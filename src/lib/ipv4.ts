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
