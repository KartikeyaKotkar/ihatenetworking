// Server-side only. Imported exclusively from app/api route handlers.
// Never import from client components (pulls node:dns into browser bundle).

import dns from "node:dns/promises";
import net from "node:net";

export type DnsType = "A" | "AAAA" | "MX" | "CNAME" | "TXT" | "NS";

export const DNS_TYPES: DnsType[] = ["A", "AAAA", "MX", "CNAME", "TXT", "NS"];

export function isDnsType(s: string): s is DnsType {
  return (DNS_TYPES as string[]).includes(s.toUpperCase());
}

/** Hostname allowlist: letters, digits, dots, hyphens, max 253 chars. Also accepts IPv4/IPv6 literals. */
export function validLookupName(name: string): boolean {
  const s = name.trim().replace(/\.$/, "");
  if (s.length === 0 || s.length > 253) return false;
  if (net.isIP(s) !== 0) return true;
  if (!/^[A-Za-z0-9.-]+$/.test(s)) return false;
  if (s.includes("..")) return false;
  const labels = s.split(".");
  if (labels.length < 2 && !s.endsWith(".local")) {
    // Allow single-label like localhost
    if (!/^[A-Za-z0-9-]+$/.test(s)) return false;
    return true;
  }
  return labels.every((l) => l.length > 0 && l.length <= 63 && !l.startsWith("-") && !l.endsWith("-"));
}

export interface DnsAnswer {
  type: DnsType;
  name: string;
  values: string[];
  ttlSeconds: number | null;
}

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
  });
  return Promise.race([p.then((v) => (clearTimeout(timer), v)), timeout]);
}

export async function resolveRecords(name: string, type: DnsType): Promise<DnsAnswer> {
  const host = name.trim().replace(/\.$/, "");
  const TIMEOUT = 8000;
  switch (type) {
    case "A": {
      const r = await withTimeout(dns.resolve4(host, { ttl: true }), TIMEOUT, "A lookup");
      return { type, name: host, values: r.map((x) => x.address), ttlSeconds: r[0]?.ttl ?? null };
    }
    case "AAAA": {
      const r = await withTimeout(dns.resolve6(host, { ttl: true }), TIMEOUT, "AAAA lookup");
      return { type, name: host, values: r.map((x) => x.address), ttlSeconds: r[0]?.ttl ?? null };
    }
    case "MX": {
      const r = await withTimeout(dns.resolveMx(host), TIMEOUT, "MX lookup");
      const sorted = [...r].sort((a, b) => a.priority - b.priority);
      return { type, name: host, values: sorted.map((x) => `${x.priority} ${x.exchange}`), ttlSeconds: null };
    }
    case "CNAME": {
      const r = await withTimeout(dns.resolveCname(host), TIMEOUT, "CNAME lookup");
      return { type, name: host, values: r, ttlSeconds: null };
    }
    case "TXT": {
      const r = await withTimeout(dns.resolveTxt(host), TIMEOUT, "TXT lookup");
      return { type, name: host, values: r.map((chunks) => chunks.join("")), ttlSeconds: null };
    }
    case "NS": {
      const r = await withTimeout(dns.resolveNs(host), TIMEOUT, "NS lookup");
      return { type, name: host, values: [...r].sort(), ttlSeconds: null };
    }
  }
}

export async function reverseLookup(ip: string): Promise<string[]> {
  const s = ip.trim();
  if (net.isIP(s) === 0) throw new Error("Not a valid IP address.");
  return withTimeout(dns.reverse(s), 8000, "Reverse lookup");
}

/** SSRF guard: resolve hostname, reject if it maps to private/loopback/link-local. Returns resolved IPs. */
export async function assertPublicHost(host: string): Promise<string[]> {
  const s = host.trim();
  if (net.isIP(s) !== 0) {
    if (isNonPublicIp(s)) throw new Error("Refused: target resolves to a private/internal address.");
    return [s];
  }
  const addrs = await withTimeout(dns.lookup(s, { all: true }), 8000, "DNS resolve");
  const ips = addrs.map((a) => a.address);
  if (ips.some(isNonPublicIp)) throw new Error("Refused: target resolves to a private/internal address.");
  return ips;
}

export function isNonPublicIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const o = ip.split(".").map(Number);
    if (o[0] === 10) return true;
    if (o[0] === 172 && o[1] >= 16 && o[1] <= 31) return true;
    if (o[0] === 192 && o[1] === 168) return true;
    if (o[0] === 127) return true;
    if (o[0] === 169 && o[1] === 254) return true;
    if (o[0] === 0) return true;
    if (o[0] >= 224) return true;
    if (o[0] === 100 && o[1] >= 64 && o[1] <= 127) return true;
    if (o[0] === 192 && o[1] === 0 && o[2] === 2) return true;
    return false;
  }
  // IPv6: loopback, link-local, unique-local, unspecified, multicast, documentation
  const low = ip.toLowerCase();
  if (low === "::1" || low === "::") return true;
  if (low.startsWith("fe80:")) return true;
  if (low.startsWith("fc") || low.startsWith("fd")) return true;
  if (low.startsWith("ff")) return true;
  if (low.startsWith("2001:db8")) return true;
  if (low === "::ffff:0:0" || ip === "::ffff:0.0.0.0") return true;
  return false;
}

export function validHttpUrl(raw: string): URL | null {
  let s = raw.trim();
  if (!/^https?:\/\//i.test(s)) s = "https://" + s;
  try {
    const u = new URL(s);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    if (!validLookupName(u.hostname)) return null;
    return u;
  } catch {
    return null;
  }
}
