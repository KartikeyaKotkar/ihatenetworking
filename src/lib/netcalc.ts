// Network planning math. Sizes parsed to exact bits via BigInt-friendly floats avoided:
// byte counts use Number (safe up to petabytes), rates use plain arithmetic.

const SIZE_UNITS: Record<string, number> = {
  b: 1, kb: 1e3, mb: 1e6, gb: 1e9, tb: 1e12,
  Kb: 1e3, Mb: 1e6, Gb: 1e9, Tb: 1e12,
  kib: 1024, mib: 1024 ** 2, gib: 1024 ** 3, tib: 1024 ** 4,
  B: 8, KB: 8e3, MB: 8e6, GB: 8e9, TB: 8e12,
  KiB: 8 * 1024, MiB: 8 * 1024 ** 2, GiB: 8 * 1024 ** 3, TiB: 8 * 1024 ** 4,
};

/** Parse "100", "100 Mbps", "1.5 GiB" to bits. Bare numbers = unit param default. */
export function parseBits(input: string, defaultUnit = "Mb"): number | null {
  const s = input.trim().replace(/,/g, "");
  const m = s.match(/^([\d.]+)\s*([A-Za-z]*)$/);
  if (!m) return null;
  const n = Number(m[1]);
  if (!Number.isFinite(n) || n < 0) return null;
  const unit = m[2] === "" ? normalizeUnit(defaultUnit) : normalizeUnit(m[2]);
  const mult = SIZE_UNITS[unit];
  if (mult === undefined) return null;
  return n * mult;
}

function normalizeUnit(u: string): string {
  const t = u.trim();
  // Accept common spellings: mbps/mbit → Mb, etc.
  const low = t.toLowerCase();
  if (/^(mbps|mbit|mbits)$/.test(low)) return "Mb";
  if (/^(kbps|kbit|kbits)$/.test(low)) return "kb";
  if (/^(gbps|gbit|gbits)$/.test(low)) return "Gb";
  if (/^(bps|bit|bits)$/.test(low)) return "b";
  if (/^(bytes?)$/.test(low)) return "B";
  // Case-sensitive table handles the rest (MB vs Mb, etc.)
  if (SIZE_UNITS[t] !== undefined) return t;
  // Single-letter fallback
  if (low === "k") return "kb";
  if (low === "m") return "Mb";
  if (low === "g") return "Gb";
  return t;
}

export function humanBits(bits: number): string {
  if (!Number.isFinite(bits) || bits < 0) return "—";
  const units: [string, number][] = [["Tb", 1e12], ["Gb", 1e9], ["Mb", 1e6], ["kb", 1e3]];
  for (const [u, m] of units) {
    if (bits >= m) return `${trimNum(bits / m)} ${u}ps`;
  }
  return `${trimNum(bits)} bps`;
}

export function humanRate(bitsPerSec: number): string {
  return humanBits(bitsPerSec);
}

export function humanBytes(bits: number): string {
  const bytes = bits / 8;
  const units: [string, number][] = [["GiB", 1024 ** 3], ["MiB", 1024 ** 2], ["KiB", 1024]];
  for (const [u, m] of units) {
    if (bytes >= m) return `${trimNum(bytes / m)} ${u}`;
  }
  return `${trimNum(bytes)} B`;
}

export function humanDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "—";
  if (seconds < 1) return `${trimNum(seconds * 1000)} ms`;
  if (seconds < 60) return `${trimNum(seconds)} s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m < 60) return s < 0.5 ? `${m} min` : `${m} min ${Math.round(s)} s`;
  const h = Math.floor(m / 60);
  return `${h} h ${m % 60} min`;
}

function trimNum(n: number): string {
  return n >= 100 ? String(Math.round(n)) : String(Math.round(n * 100) / 100);
}

/** Required capacity: users × per-user rate × (1 + overhead). Returns bps. */
export function requiredBandwidth(users: number, perUserBps: number, overheadPct: number): number | null {
  if (![users, perUserBps, overheadPct].every(Number.isFinite)) return null;
  if (users <= 0 || perUserBps <= 0 || overheadPct < 0 || overheadPct > 100) return null;
  return users * perUserBps * (1 + overheadPct / 100);
}

/** Goodput: bits delivered / seconds. */
export function throughput(bits: number, seconds: number): number | null {
  if (!Number.isFinite(bits) || !Number.isFinite(seconds) || bits < 0 || seconds <= 0) return null;
  return bits / seconds;
}

export type Medium = "fiber" | "copper" | "wifi" | "satellite-geo" | "satellite-leo";

export const MEDIUM_SPEED_KM_S: Record<Medium, number> = {
  fiber: 200000,
  copper: 230000,
  wifi: 299700,
  "satellite-leo": 299700,
  "satellite-geo": 299700,
};

export const MEDIUM_BASE_RTT_MS: Record<Medium, number> = {
  fiber: 0,
  copper: 0,
  wifi: 2,
  "satellite-leo": 30,
  "satellite-geo": 480,
};

/** Latency breakdown: propagation + transmission + base RTT. All ms. */
export function latencyBreakdown(distanceKm: number, medium: Medium, sizeBits: number, rateBps: number): {
  propagationMs: number;
  transmissionMs: number;
  baseMs: number;
  totalMs: number;
} | null {
  if (![distanceKm, sizeBits, rateBps].every(Number.isFinite)) return null;
  if (distanceKm < 0 || sizeBits < 0 || rateBps <= 0) return null;
  const propagationMs = (distanceKm / MEDIUM_SPEED_KM_S[medium]) * 1000;
  const transmissionMs = (sizeBits / rateBps) * 1000;
  const baseMs = MEDIUM_BASE_RTT_MS[medium];
  return { propagationMs, transmissionMs, baseMs, totalMs: propagationMs + transmissionMs + baseMs };
}

/** Transfer seconds for sizeBits at rateBps with overhead %. */
export function transferSeconds(sizeBits: number, rateBps: number, overheadPct: number): number | null {
  if (![sizeBits, rateBps, overheadPct].every(Number.isFinite)) return null;
  if (sizeBits < 0 || rateBps <= 0 || overheadPct < 0 || overheadPct > 100) return null;
  return (sizeBits * (1 + overheadPct / 100)) / rateBps;
}

/** Effective MTU after tunnel overheads. overheads = bytes list. */
export function effectiveMtu(baseMtu: number, overheads: number[]): number | null {
  if (!Number.isInteger(baseMtu) || baseMtu < 68 || baseMtu > 9000) return null;
  if (overheads.some((o) => !Number.isInteger(o) || o < 0 || o > 500)) return null;
  const out = baseMtu - overheads.reduce((a, b) => a + b, 0);
  return out >= 68 ? out : null;
}

/** MSS = MTU − IP header − TCP header. timestamps adds 12. */
export function mssFor(mtu: number, ipv6: boolean, timestamps: boolean): number | null {
  if (!Number.isInteger(mtu) || mtu < 68 || mtu > 9000) return null;
  return mtu - (ipv6 ? 40 : 20) - 20 - (timestamps ? 12 : 0);
}

/** Bandwidth-delay product → minimum TCP window for full utilization. Returns bytes + scaling note. */
export function bdpWindow(rateBps: number, rttMs: number): { bytes: number; scaleNeeded: boolean } | null {
  if (!Number.isFinite(rateBps) || !Number.isFinite(rttMs) || rateBps <= 0 || rttMs < 0) return null;
  const bytes = Math.ceil(((rateBps * rttMs) / 1000) / 8);
  return { bytes, scaleNeeded: bytes > 65535 };
}
