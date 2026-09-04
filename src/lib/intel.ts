// Server-only intel lookups. Imported exclusively from app/api routes.
// Team Cymru DNS needs outbound port 53; WHOIS needs TCP 43; geo uses ip-api.com HTTP.

import dns from "node:dns/promises";
import net from "node:net";
import { validLookupName } from "@/lib/dns";

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
  });
  return Promise.race([p.then((v) => (clearTimeout(timer), v)), timeout]);
}

export interface AsnInfo {
  asn: string;
  prefix: string;
  country: string;
  registry: string;
}

function reverseV4(ip: string): string {
  return ip.split(".").reverse().join(".");
}

function expandV6Nibbles(ip: string): string {
  // Expand via manual parse: reuse simple expansion for nibble format
  const halves = ip.split("::");
  const head = halves[0] ? halves[0].split(":") : [];
  const tail = halves[1] ? halves[1].split(":") : [];
  const missing = 8 - head.length - tail.length;
  const groups = [...head, ...Array(missing).fill("0"), ...tail];
  return groups
    .map((g) => g.padStart(4, "0"))
    .join("")
    .split("")
    .reverse()
    .join(".");
}

/** ASN + announcing prefix via Team Cymru (origin.asn.cymru.com). Null when no record. */
export async function cymruLookup(ip: string): Promise<AsnInfo | null> {
  const v4 = net.isIPv4(ip);
  const v6 = net.isIPv6(ip);
  if (!v4 && !v6) throw new Error("Not a valid IP address.");
  const zone = v4
    ? `${reverseV4(ip)}.origin.asn.cymru.com`
    : `${expandV6Nibbles(ip)}.origin6.asn.cymru.com`;
  const txt = await withTimeout(dns.resolveTxt(zone), 9000, "ASN lookup");
  const first = txt[0]?.join("") ?? "";
  // Format: "15169 | 8.8.8.0/24 | US | arin | 2000-03-30"
  const parts = first.split("|").map((s) => s.trim());
  if (parts.length < 4) return null;
  return { asn: `AS${parts[0]}`, prefix: parts[1], country: parts[2], registry: parts[3] };
}

function whoisQuery(server: string, query: string, timeoutMs = 10000): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    const sock = net.connect({ host: server, port: 43, timeout: timeoutMs }, () => {
      sock.write(query + "\r\n");
    });
    const timer = setTimeout(() => {
      sock.destroy();
      reject(new Error("WHOIS timed out."));
    }, timeoutMs);
    sock.setEncoding("utf8");
    sock.on("data", (chunk) => {
      data += chunk;
      if (data.length > 64 * 1024) {
        clearTimeout(timer);
        sock.destroy();
        resolve(data);
      }
    });
    sock.on("timeout", () => {
      clearTimeout(timer);
      sock.destroy();
      reject(new Error("WHOIS timed out."));
    });
    sock.on("error", (e) => {
      clearTimeout(timer);
      reject(new Error(`WHOIS query failed: ${e.message}`));
    });
    sock.on("close", () => {
      clearTimeout(timer);
      resolve(data);
    });
  });
}

function referralServer(raw: string): string | null {
  const m = raw.match(/^whois:\s*(\S+)/im) || raw.match(/^refer:\s*(\S+)/im);
  return m ? m[1].trim() : null;
}

/** WHOIS with one referral follow. Returns raw text (trimmed, capped). */
export async function whoisLookup(query: string): Promise<{ server: string; raw: string }> {
  const q = query.trim().toLowerCase();
  if (!validLookupName(q) && net.isIP(q) === 0) throw new Error("Invalid domain or IP.");
  let server = "whois.iana.org";
  let raw = await whoisQuery(server, q);
  const next = referralServer(raw);
  if (next && next !== server && /^[A-Za-z0-9.-]+$/.test(next)) {
    server = next;
    raw = await whoisQuery(server, q);
  }
  return { server, raw: raw.trim().slice(0, 8000) };
}

export interface PropagationResult {
  resolver: string;
  values: string[] | null;
  error: string | null;
  ms: number;
}

const RESOLVERS = [
  { name: "Google (8.8.8.8)", ip: "8.8.8.8" },
  { name: "Cloudflare (1.1.1.1)", ip: "1.1.1.1" },
  { name: "Quad9 (9.9.9.9)", ip: "9.9.9.9" },
  { name: "OpenDNS (208.67.222.222)", ip: "208.67.222.222" },
];

/** Query A records across public resolvers in parallel. Agreement = propagated. */
export async function propagationCheck(name: string): Promise<PropagationResult[]> {
  const host = name.trim().replace(/\.$/, "");
  if (!validLookupName(host)) throw new Error("Invalid hostname.");
  return Promise.all(
    RESOLVERS.map(async (r) => {
      const t0 = Date.now();
      try {
        const resolver = new dns.Resolver();
        resolver.setServers([r.ip]);
        const addrs = await withTimeout(resolver.resolve4(host), 7000, r.name);
        return { resolver: r.name, values: [...addrs].sort(), error: null, ms: Date.now() - t0 };
      } catch (e) {
        const msg = e instanceof Error ? e.message : "failed";
        const friendly = /ENOTFOUND|ENODATA/.test(msg) ? "No A record (yet?)" : msg.slice(0, 120);
        return { resolver: r.name, values: null, error: friendly, ms: Date.now() - t0 };
      }
    })
  );
}

export interface GeoInfo {
  ip: string;
  country: string;
  region: string;
  city: string;
  lat: number | null;
  lon: number | null;
  isp: string;
  org: string;
  as: string;
}

/** City-level geo via ip-api.com free tier (45 req/min, non-HTTPS endpoint). */
export async function geoLookup(ip: string): Promise<GeoInfo> {
  if (net.isIP(ip.trim()) === 0) throw new Error("Enter a valid IPv4 or IPv6 address.");
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 9000);
  try {
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip.trim())}?fields=status,message,country,regionName,city,lat,lon,isp,org,as,query`,
      { signal: ctrl.signal }
    );
    if (!res.ok) throw new Error(`Geo provider HTTP ${res.status}.`);
    const j = (await res.json()) as Record<string, unknown>;
    if (j.status !== "success") throw new Error(typeof j.message === "string" ? j.message : "Geo lookup failed.");
    return {
      ip: String(j.query ?? ip),
      country: String(j.country ?? "—"),
      region: String(j.regionName ?? "—"),
      city: String(j.city ?? "—"),
      lat: typeof j.lat === "number" ? j.lat : null,
      lon: typeof j.lon === "number" ? j.lon : null,
      isp: String(j.isp ?? "—"),
      org: String(j.org ?? "—"),
      as: String(j.as ?? "—"),
    };
  } catch (e) {
    if (e instanceof Error && /abort/i.test(e.message)) throw new Error("Geo provider timed out.");
    throw e;
  } finally {
    clearTimeout(timer);
  }
}
