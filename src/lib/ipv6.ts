// Pure IPv6 helpers using BigInt (128-bit). No float math anywhere.

const HEX = /^[0-9a-fA-F]{1,4}$/;
const V4_TAIL = /^(.*:)(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/;

/** Parse embedded IPv4 tail to two 16-bit groups, or null. */
function parseEmbeddedIPv4(tail: string): [number, number] | null {
  const parts = tail.split(".");
  if (parts.length !== 4) return null;
  const nums: number[] = [];
  for (const p of parts) {
    if (!/^\d{1,3}$/.test(p)) return null;
    const n = Number(p);
    if (!Number.isInteger(n) || n < 0 || n > 255) return null;
    nums.push(n);
  }
  return [(nums[0] * 256 + nums[1]) & 0xffff, (nums[2] * 256 + nums[3]) & 0xffff];
}

/** Parse IPv6 string to 128-bit BigInt. Supports :: compression + embedded IPv4. Null on invalid. */
export function parseIPv6(input: string): bigint | null {
  if (typeof input !== "string") return null;
  let s = input.trim();
  if (s.length === 0 || s.length > 45) return null;

  // Split off embedded IPv4 tail if present
  let v4groups: [number, number] | null = null;
  const v4match = s.match(V4_TAIL);
  if (v4match) {
    v4groups = parseEmbeddedIPv4(v4match[2]);
    if (!v4groups) return null;
    s = v4match[1] + "0:0"; // placeholder, replaced below
    // Rebuild: keep head part, drop placeholder handling via token rewrite
    s = v4match[1] + v4groups[0].toString(16) + ":" + v4groups[1].toString(16);
  }

  if ((s.match(/::/g) || []).length > 1) return null; // only one ::
  const dbl = s.indexOf("::");
  let head: string[] = [];
  let tail: string[] = [];
  if (dbl !== -1) {
    head = s.slice(0, dbl).length ? s.slice(0, dbl).split(":") : [];
    tail = s.slice(dbl + 2).length ? s.slice(dbl + 2).split(":") : [];
  } else {
    head = s.split(":");
    tail = [];
  }
  for (const g of [...head, ...tail]) {
    if (!HEX.test(g)) return null;
  }
  const total = head.length + tail.length;
  if (dbl === -1) {
    if (total !== 8) return null;
  } else {
    if (total > 7) return null; // :: must compress at least one group
  }
  const zeros = dbl === -1 ? 0 : 8 - total;
  const groups = [...head, ...Array(zeros).fill("0"), ...tail];
  if (groups.length !== 8) return null;
  let out = 0n;
  for (const g of groups) {
    out = (out << 16n) + BigInt(parseInt(g, 16));
  }
  return out;
}

export function isValidIPv6(input: string): boolean {
  return parseIPv6(input) !== null;
}

/** Full expanded form: 8 groups, 4 lowercase hex digits. */
export function expandIPv6(addr: bigint): string {
  const groups: string[] = [];
  for (let i = 7; i >= 0; i--) {
    const g = Number((addr >> BigInt(i * 16)) & 0xffffn);
    groups.push(g.toString(16).padStart(4, "0"));
  }
  return groups.join(":");
}

/** RFC 5952 compressed form: longest zero run to ::, first on tie, no shrink of single group. */
export function compressIPv6(addr: bigint): string {
  const nums: number[] = [];
  for (let i = 7; i >= 0; i--) nums.push(Number((addr >> BigInt(i * 16)) & 0xffffn));
  // Find longest zero run length >= 2
  let bestStart = -1;
  let bestLen = 0;
  let curStart = -1;
  let curLen = 0;
  for (let i = 0; i <= 8; i++) {
    if (i < 8 && nums[i] === 0) {
      if (curStart === -1) {
        curStart = i;
        curLen = 1;
      } else curLen++;
    } else {
      if (curLen > bestLen) {
        bestLen = curLen;
        bestStart = curStart;
      }
      curStart = -1;
      curLen = 0;
    }
  }
  const hex = nums.map((n) => n.toString(16));
  if (bestLen < 2) return hex.join(":");
  const left = hex.slice(0, bestStart).join(":");
  const right = hex.slice(bestStart + bestLen).join(":");
  if (left === "" && right === "") return "::";
  if (left === "") return "::" + right;
  if (right === "") return left + "::";
  return left + "::" + right;
}

export function parseIPv6Prefix(input: string | number): number | null {
  const n = typeof input === "number" ? input : Number(String(input).trim().replace(/^\//, ""));
  if (!Number.isInteger(n) || n < 0 || n > 128) return null;
  return n;
}

export interface IPv6SubnetInfo {
  network: string;
  networkExpanded: string;
  lastAddress: string;
  lastExpanded: string;
  prefix: number;
  totalAddresses: bigint;
}

/** Subnet info: network = addr with host bits zeroed; last = network + 2^(128-p) - 1. */
export function describeIPv6Subnet(ipStr: string, prefix: number): IPv6SubnetInfo | null {
  const addr = parseIPv6(ipStr);
  const p = parseIPv6Prefix(prefix);
  if (addr === null || p === null) return null;
  const hostBits = 128 - p;
  const size = 1n << BigInt(hostBits);
  const network = p === 0 ? 0n : (addr >> BigInt(hostBits)) << BigInt(hostBits);
  const last = network + size - 1n;
  return {
    network: compressIPv6(network),
    networkExpanded: expandIPv6(network),
    lastAddress: compressIPv6(last),
    lastExpanded: expandIPv6(last),
    prefix: p,
    totalAddresses: size,
  };
}

/** Parse "addr/prefix" CIDR. */
export function parseIPv6CIDR(input: string): { addr: bigint; prefix: number } | null {
  const s = input.trim();
  const slash = s.lastIndexOf("/");
  if (slash === -1) return null;
  const addr = parseIPv6(s.slice(0, slash).trim());
  const prefix = parseIPv6Prefix(s.slice(slash + 1).trim());
  if (addr === null || prefix === null) return null;
  return { addr, prefix };
}
