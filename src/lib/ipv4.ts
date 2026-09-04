// Pure IPv4 helpers. All addresses as unsigned 32-bit ints (0..4294967295).
// No floating point tricks. Bitwise done with >>>0 and arithmetic.

export function parseIPv4(input: string): number | null {
  if (typeof input !== "string") return null;
  const s = input.trim();
  if (s.length === 0) return null;
  const parts = s.split(".");
  if (parts.length !== 4) return null;
  let result = 0;
  for (const part of parts) {
    if (part.length === 0 || part.length > 3) return null;
    if (!/^\d+$/.test(part)) return null;
    // Reject octets with leading zeros like "01" only if ambiguous? Allow single "0".
    // Keep strict-ish: allow them, parse as decimal.
    const n = Number(part);
    if (!Number.isInteger(n) || n < 0 || n > 255) return null;
    result = result * 256 + n;
  }
  return result >>> 0;
}

export function ipv4ToString(n: number): string {
  const v = n >>> 0;
  const a = Math.floor(v / 16777216) % 256;
  const b = Math.floor(v / 65536) % 256;
  const c = Math.floor(v / 256) % 256;
  const d = v % 256;
  return `${a}.${b}.${c}.${d}`;
}

export function ipv4ToBinaryGrouped(n: number): string {
  const v = n >>> 0;
  const octets: string[] = [];
  for (let i = 3; i >= 0; i--) {
    const octet = Math.floor(v / Math.pow(256, i)) % 256;
    octets.push(octet.toString(2).padStart(8, "0"));
  }
  return octets.join(".");
}

export function isValidIPv4(input: string): boolean {
  return parseIPv4(input) !== null;
}

export function parsePrefix(input: string | number): number | null {
  const n = typeof input === "number" ? input : Number(String(input).trim().replace(/^\//, ""));
  if (!Number.isInteger(n) || n < 0 || n > 32) return null;
  return n;
}

export function prefixToMaskInt(prefix: number): number {
  if (prefix <= 0) return 0;
  if (prefix >= 32) return 0xffffffff >>> 0;
  // e.g. /24: 0xffffffff << 8
  return ((0xffffffff << (32 - prefix)) >>> 0);
}

export function prefixToMaskString(prefix: number): string {
  return ipv4ToString(prefixToMaskInt(prefix));
}

export function prefixToWildcardString(prefix: number): string {
  const mask = prefixToMaskInt(prefix);
  const wild = (~mask) >>> 0;
  return ipv4ToString(wild);
}

/** Returns prefix 0..32 if mask is contiguous ones, else null. */
export function maskIntToPrefix(mask: number): number | null {
  const v = mask >>> 0;
  if (v === 0) return 0;
  // Contiguous check: inverted mask + 1 must be power of two (or zero for /32).
  const inv = (~v) >>> 0;
  if (inv === 0) return 32;
  // inv must be of form 2^k - 1
  if (((inv + 1) & inv) !== 0) return null;
  let prefix = 32;
  let x = inv;
  while (x > 0) {
    x = Math.floor(x / 2);
    prefix -= 1;
  }
  return prefix;
}

export function maskStringToPrefix(maskStr: string): number | null {
  const m = parseIPv4(maskStr);
  if (m === null) return null;
  return maskIntToPrefix(m);
}

export function isValidMask(maskStr: string): boolean {
  return maskStringToPrefix(maskStr) !== null;
}

export function networkAddressInt(ip: number, prefix: number): number {
  const mask = prefixToMaskInt(prefix);
  // Use arithmetic-safe AND via per-octet to avoid signed issues.
  const ipOct = toOctets(ip >>> 0);
  const mOct = toOctets(mask);
  let r = 0;
  for (let i = 0; i < 4; i++) r = r * 256 + (ipOct[i] & mOct[i]);
  return r >>> 0;
}

export function broadcastAddressInt(ip: number, prefix: number): number {
  const net = networkAddressInt(ip, prefix);
  const hostBits = 32 - prefix;
  if (hostBits <= 0) return net;
  return (net + (Math.pow(2, hostBits) - 1)) >>> 0;
}

export function totalAddresses(prefix: number): number {
  return Math.pow(2, 32 - prefix);
}

/** Usable hosts. /31 => 2 (RFC 3021 point-to-point), /32 => 1. */
export function usableHostCount(prefix: number): number {
  if (prefix === 32) return 1;
  if (prefix === 31) return 2;
  return Math.pow(2, 32 - prefix) - 2;
}

export function firstUsableInt(ip: number, prefix: number): number | null {
  const net = networkAddressInt(ip, prefix);
  if (prefix === 32) return net;
  if (prefix === 31) return net; // both usable
  return (net + 1) >>> 0;
}

export function lastUsableInt(ip: number, prefix: number): number | null {
  const bcast = broadcastAddressInt(ip, prefix);
  if (prefix === 32) return bcast;
  if (prefix === 31) return bcast;
  return (bcast - 1) >>> 0;
}

export interface SubnetInfo {
  ip: string;
  prefix: number;
  mask: string;
  wildcard: string;
  network: string;
  broadcast: string;
  firstUsable: string;
  lastUsable: string;
  totalAddresses: number;
  usableHosts: number;
  binaryIp: string;
  binaryMask: string;
  ipClass: string;
}

export function ipClassOf(ip: number): string {
  const first = Math.floor((ip >>> 0) / 16777216);
  if (first < 128) return "A";
  if (first < 192) return "B";
  if (first < 224) return "C";
  if (first < 240) return "D";
  return "E";
}

export function describeSubnet(ipStr: string, prefix: number): SubnetInfo | null {
  const ip = parseIPv4(ipStr);
  const p = parsePrefix(prefix);
  if (ip === null || p === null) return null;
  const maskInt = prefixToMaskInt(p);
  const net = networkAddressInt(ip, p);
  const bcast = broadcastAddressInt(ip, p);
  const first = firstUsableInt(ip, p)!;
  const last = lastUsableInt(ip, p)!;
  return {
    ip: ipv4ToString(ip),
    prefix: p,
    mask: ipv4ToString(maskInt),
    wildcard: ipv4ToString((~maskInt) >>> 0),
    network: ipv4ToString(net),
    broadcast: ipv4ToString(bcast),
    firstUsable: ipv4ToString(first),
    lastUsable: ipv4ToString(last),
    totalAddresses: totalAddresses(p),
    usableHosts: usableHostCount(p),
    binaryIp: ipv4ToBinaryGrouped(ip),
    binaryMask: ipv4ToBinaryGrouped(maskInt),
    ipClass: ipClassOf(ip),
  };
}

export interface CidrParse {
  ip: number;
  prefix: number;
  network: number;
}

export function parseCIDR(input: string): CidrParse | null {
  const s = input.trim();
  const slash = s.indexOf("/");
  if (slash === -1) return null;
  const ipPart = s.slice(0, slash).trim();
  const prefixPart = s.slice(slash + 1).trim();
  const ip = parseIPv4(ipPart);
  const prefix = parsePrefix(prefixPart);
  if (ip === null || prefix === null) return null;
  return { ip, prefix, network: networkAddressInt(ip, prefix) };
}

/** Split network/prefix into subnets of newPrefix. Caps output at 1024. */
export function splitSubnet(networkStr: string, prefix: number, newPrefix: number): string[] | null {
  const net = parseIPv4(networkStr);
  const p = parsePrefix(prefix);
  const np = parsePrefix(newPrefix);
  if (net === null || p === null || np === null) return null;
  if (np < p) return null;
  const base = networkAddressInt(net, p);
  const count = Math.pow(2, np - p);
  if (count > 1024) return null; // safety cap
  const size = Math.pow(2, 32 - np);
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    out.push(`${ipv4ToString((base + i * size) >>> 0)}/${np}`);
  }
  return out;
}

export interface VlsmBlock {
  network: string;
  prefix: number;
  mask: string;
  broadcast: string;
  firstUsable: string;
  lastUsable: string;
  usableHosts: number;
  requestedHosts: number;
}

/** Smallest prefix fitting hostCount usable hosts (accounts /31 /32). */
export function prefixForHosts(hostCount: number): number | null {
  if (!Number.isInteger(hostCount) || hostCount < 1) return null;
  if (hostCount === 1) return 32;
  if (hostCount <= 2) return 31;
  // Scan largest prefix (smallest block) downward; first fit wins.
  for (let p = 30; p >= 0; p--) {
    if (usableHostCount(p) >= hostCount) return p;
  }
  return null;
}

/** Allocate VLSM blocks largest-first inside base network. Returns null on overflow/invalid. */
export function vlsmAllocate(baseStr: string, basePrefix: number, hosts: number[]): VlsmBlock[] | null {
  const base = parseIPv4(baseStr);
  const bp = parsePrefix(basePrefix);
  if (base === null || bp === null) return null;
  if (hosts.length === 0 || hosts.length > 64) return null;
  for (const h of hosts) {
    if (!Number.isInteger(h) || h < 1 || h > 16777214) return null;
  }
  const baseNet = networkAddressInt(base, bp);
  const baseEnd = broadcastAddressInt(base, bp);
  const sorted = [...hosts].sort((a, b) => b - a);
  const blocks: VlsmBlock[] = [];
  let cursor = baseNet;
  for (const h of sorted) {
    const p = prefixForHosts(h);
    if (p === null) return null;
    // Align cursor to prefix boundary relative to 0
    const size = Math.pow(2, 32 - p);
    const misaligned = cursor % size;
    if (misaligned !== 0) cursor = cursor + (size - misaligned);
    const bcast = (cursor + size - 1) >>> 0;
    if (bcast > baseEnd) return null; // overflow
    const maskInt = prefixToMaskInt(p);
    blocks.push({
      network: `${ipv4ToString(cursor)}/${p}`,
      prefix: p,
      mask: ipv4ToString(maskInt),
      broadcast: ipv4ToString(bcast),
      firstUsable: ipv4ToString(firstUsableInt(cursor, p)!),
      lastUsable: ipv4ToString(lastUsableInt(cursor, p)!),
      usableHosts: usableHostCount(p),
      requestedHosts: h,
    });
    cursor = (bcast + 1) >>> 0;
  }
  return blocks;
}

function toOctets(n: number): [number, number, number, number] {
  const v = n >>> 0;
  return [
    Math.floor(v / 16777216) % 256,
    Math.floor(v / 65536) % 256,
    Math.floor(v / 256) % 256,
    v % 256,
  ];
}

// ---------- IP Tools additions (Phase 1b) ----------

export interface IPv4Validation {
  valid: boolean;
  reason: string;
  value: number | null;
}

/** Strict validation with human-readable reason for first failure. */
export function validateIPv4Detailed(input: string): IPv4Validation {
  if (typeof input !== "string" || input.trim().length === 0)
    return { valid: false, reason: "Empty input. Enter 4 octets like 192.168.1.1.", value: null };
  const s = input.trim();
  const parts = s.split(".");
  if (parts.length !== 4)
    return { valid: false, reason: `Expected 4 octets, got ${parts.length}. Use format A.B.C.D.`, value: null };
  for (let i = 0; i < 4; i++) {
    const part = parts[i];
    if (part.length === 0) return { valid: false, reason: `Octet ${i + 1} is empty.`, value: null };
    if (!/^\d+$/.test(part))
      return { valid: false, reason: `Octet ${i + 1} ("${part}") is not numeric.`, value: null };
    if (part.length > 3)
      return { valid: false, reason: `Octet ${i + 1} ("${part}") too long. Max 3 digits.`, value: null };
    const n = Number(part);
    if (!Number.isInteger(n) || n < 0 || n > 255)
      return { valid: false, reason: `Octet ${i + 1} (${n}) out of range 0-255.`, value: null };
  }
  return { valid: true, reason: "Valid IPv4 address.", value: parseIPv4(s) };
}

/** Dotted binary "11000000.10101000..." for an IPv4 string. Null on invalid. */
export function ipv4StringToBinary(ipStr: string): string | null {
  const n = parseIPv4(ipStr);
  if (n === null) return null;
  return ipv4ToBinaryGrouped(n);
}

/** Parse dotted binary or plain 32-bit binary to dotted decimal. Null on invalid. */
export function binaryToIPv4String(input: string): string | null {
  if (typeof input !== "string") return null;
  const s = input.trim().replace(/\s+/g, "");
  if (s.length === 0) return null;
  let bits: string;
  if (s.includes(".")) {
    const parts = s.split(".");
    if (parts.length !== 4) return null;
    for (const p of parts) {
      if (p.length !== 8 || !/^[01]{8}$/.test(p)) return null;
    }
    bits = parts.join("");
  } else {
    if (!/^[01]{32}$/.test(s)) return null;
    bits = s;
  }
  let n = 0;
  for (let i = 0; i < 4; i++) {
    const octet = parseInt(bits.slice(i * 8, i * 8 + 8), 2);
    n = n * 256 + octet;
  }
  return ipv4ToString(n >>> 0);
}

export type IPv4Scope =
  | "private"
  | "loopback"
  | "link-local"
  | "carrier-grade-nat"
  | "multicast"
  | "broadcast"
  | "reserved"
  | "public";

export interface IPv4ScopeInfo {
  scope: IPv4Scope;
  private: boolean;
  label: string;
}

/** Classify scope of a parsed address. Ordering matters: specific ranges first. */
export function scopeOfIPv4(ip: number): IPv4ScopeInfo {
  const v = ip >>> 0;
  const first = Math.floor(v / 16777216);
  const second = Math.floor(v / 65536) % 256;
  if (v === 0xffffffff) return { scope: "broadcast", private: false, label: "Limited broadcast (255.255.255.255)" };
  if (first === 10) return { scope: "private", private: true, label: "Private (10.0.0.0/8, RFC 1918)" };
  if (first === 172 && second >= 16 && second <= 31)
    return { scope: "private", private: true, label: "Private (172.16.0.0/12, RFC 1918)" };
  if (first === 192 && second === 168)
    return { scope: "private", private: true, label: "Private (192.168.0.0/16, RFC 1918)" };
  if (first === 127) return { scope: "loopback", private: true, label: "Loopback (127.0.0.0/8)" };
  if (first === 169 && second === 254)
    return { scope: "link-local", private: true, label: "Link-local (169.254.0.0/16, APIPA)" };
  if (first === 100 && second >= 64 && second <= 127)
    return { scope: "carrier-grade-nat", private: false, label: "Shared CGNAT space (100.64.0.0/10, not RFC 1918 private)" };
  if (first >= 224 && first <= 239) return { scope: "multicast", private: false, label: "Multicast (224.0.0.0/4)" };
  if (first >= 240) return { scope: "reserved", private: false, label: "Reserved (240.0.0.0/4)" };
  if (first === 0) return { scope: "reserved", private: false, label: "Reserved (0.0.0.0/8, this network)" };
  if (first === 192 && second === 0) return { scope: "reserved", private: false, label: "Reserved (192.0.0.0/24, IETF protocol)" };
  if (first === 203 && second === 0) {
    const third = Math.floor(v / 256) % 256;
    if (third === 113) return { scope: "reserved", private: false, label: "Documentation (203.0.113.0/24, TEST-NET-3)" };
  }
  if (first === 198 && second === 51) {
    const third = Math.floor(v / 256) % 256;
    if (third === 100) return { scope: "reserved", private: false, label: "Documentation (198.51.100.0/24, TEST-NET-2)" };
  }
  if (first === 192) {
    const third = Math.floor(v / 256) % 256;
    if (second === 0 && third === 2) return { scope: "reserved", private: false, label: "Documentation (192.0.2.0/24, TEST-NET-1)" };
  }
  return { scope: "public", private: false, label: "Public (globally routable)" };
}

export interface IPRangeInfo {
  start: string;
  end: string;
  count: number;
}

/** Validate start/end range. Count capped at 2^32; caller caps generation separately. */
export function describeIPRange(startStr: string, endStr: string): IPRangeInfo | null {
  const a = parseIPv4(startStr);
  const b = parseIPv4(endStr);
  if (a === null || b === null) return null;
  if ((b >>> 0) < (a >>> 0)) return null;
  return { start: ipv4ToString(a), end: ipv4ToString(b), count: (b >>> 0) - (a >>> 0) + 1 };
}

/** Generate addresses in range. Null on invalid, reversed, or over limit (default 256). */
export function generateIPRange(startStr: string, endStr: string, limit = 256): string[] | null {
  const info = describeIPRange(startStr, endStr);
  if (!info) return null;
  if (info.count > limit) return null;
  const out: string[] = [];
  const a = parseIPv4(startStr)! >>> 0;
  for (let i = 0; i < info.count; i++) out.push(ipv4ToString((a + i) >>> 0));
  return out;
}
