// Packet header decoders. Hex input, structured output. Pure, client-safe.

export function parseHexBytes(input: string): number[] | null {
  if (typeof input !== "string") return null;
  let s = input.trim().toLowerCase().replace(/^0x/, "").replace(/[\s:_\-]/g, "");
  if (s.length === 0 || s.length % 2 !== 0) return null;
  if (!/^[0-9a-f]+$/.test(s)) return null;
  const out: number[] = [];
  for (let i = 0; i < s.length; i += 2) out.push(parseInt(s.slice(i, i + 2), 16));
  return out;
}

function u16(b: number[], off: number): number {
  return b[off] * 256 + b[off + 1];
}
function u32(b: number[], off: number): number {
  return ((b[off] * 256 + b[off + 1]) * 256 + b[off + 2]) * 256 + b[off + 3];
}
function ipv4Str(b: number[], off: number): string {
  return `${b[off]}.${b[off + 1]}.${b[off + 2]}.${b[off + 3]}`;
}
function macStr(b: number[], off: number): string {
  return b.slice(off, off + 6).map((x) => x.toString(16).padStart(2, "0").toUpperCase()).join(":");
}

const IP_PROTOCOLS: Record<number, string> = {
  1: "ICMP", 2: "IGMP", 6: "TCP", 17: "UDP", 41: "IPv6 encapsulation", 47: "GRE", 50: "ESP", 51: "AH", 58: "ICMPv6", 89: "OSPF",
};

export interface IPv4Header {
  version: number;
  ihlBytes: number;
  dscp: number;
  ecn: number;
  totalLength: number;
  identification: string;
  flags: string[];
  fragmentOffset: number;
  ttl: number;
  protocol: number;
  protocolName: string;
  checksum: string;
  src: string;
  dst: string;
  hasOptions: boolean;
}

export function decodeIPv4Header(hex: string): IPv4Header | null {
  const b = parseHexBytes(hex);
  if (!b || b.length < 20) return null;
  const version = b[0] >> 4;
  if (version !== 4) return null;
  const ihlBytes = (b[0] & 0x0f) * 4;
  if (b.length < ihlBytes) return null;
  const flagsVal = b[6] >> 5;
  const flags: string[] = [];
  if (flagsVal & 4) flags.push("Reserved");
  if (flagsVal & 2) flags.push("DF (Don't Fragment)");
  if (flagsVal & 1) flags.push("MF (More Fragments)");
  const proto = b[9];
  return {
    version,
    ihlBytes,
    dscp: b[1] >> 2,
    ecn: b[1] & 0x03,
    totalLength: u16(b, 2),
    identification: `0x${u16(b, 4).toString(16).padStart(4, "0").toUpperCase()}`,
    flags: flags.length ? flags : ["none"],
    fragmentOffset: ((b[6] & 0x1f) * 256 + b[7]),
    ttl: b[8],
    protocol: proto,
    protocolName: IP_PROTOCOLS[proto] ?? "Unknown",
    checksum: `0x${u16(b, 10).toString(16).padStart(4, "0").toUpperCase()}`,
    src: ipv4Str(b, 12),
    dst: ipv4Str(b, 16),
    hasOptions: ihlBytes > 20,
  };
}

export interface TCPHeader {
  srcPort: number;
  dstPort: number;
  seq: number;
  ack: number;
  headerBytes: number;
  flags: string[];
  window: number;
  checksum: string;
  urgent: number;
}

const TCP_FLAGS: [number, string][] = [
  [0x100, "NS"], [0x80, "CWR"], [0x40, "ECE"], [0x20, "URG"], [0x10, "ACK"],
  [0x08, "PSH"], [0x04, "RST"], [0x02, "SYN"], [0x01, "FIN"],
];

export function decodeTCPHeader(hex: string): TCPHeader | null {
  const b = parseHexBytes(hex);
  if (!b || b.length < 20) return null;
  const flagBits = ((b[12] & 0x01) << 8) + b[13];
  return {
    srcPort: u16(b, 0),
    dstPort: u16(b, 2),
    seq: u32(b, 4),
    ack: u32(b, 8),
    headerBytes: (b[12] >> 4) * 4,
    flags: TCP_FLAGS.filter(([m]) => flagBits & m).map(([, n]) => n),
    window: u16(b, 14),
    checksum: `0x${u16(b, 16).toString(16).padStart(4, "0").toUpperCase()}`,
    urgent: u16(b, 18),
  };
}

export interface UDPHeader {
  srcPort: number;
  dstPort: number;
  length: number;
  checksum: string;
}

export function decodeUDPHeader(hex: string): UDPHeader | null {
  const b = parseHexBytes(hex);
  if (!b || b.length < 8) return null;
  return {
    srcPort: u16(b, 0),
    dstPort: u16(b, 2),
    length: u16(b, 4),
    checksum: `0x${u16(b, 6).toString(16).padStart(4, "0").toUpperCase()}`,
  };
}

const ETHERTYPES: Record<number, string> = {
  0x0800: "IPv4", 0x0806: "ARP", 0x86dd: "IPv6", 0x8100: "VLAN tagged", 0x88cc: "LLDP", 0x8863: "PPPoE discovery", 0x8864: "PPPoE session",
};

export interface EthernetFrame {
  dstMac: string;
  srcMac: string;
  etherType: string;
  etherTypeName: string;
  payloadBytes: number;
}

export function decodeEthernetFrame(hex: string): EthernetFrame | null {
  const b = parseHexBytes(hex);
  if (!b || b.length < 14) return null;
  const type = u16(b, 12);
  return {
    dstMac: macStr(b, 0),
    srcMac: macStr(b, 6),
    etherType: `0x${type.toString(16).padStart(4, "0").toUpperCase()}`,
    etherTypeName: ETHERTYPES[type] ?? "Unknown",
    payloadBytes: b.length - 14,
  };
}

export interface IcmpInfo {
  type: number;
  name: string;
  codes: { code: string; meaning: string }[];
}

const ICMP: IcmpInfo[] = [
  { type: 0, name: "Echo Reply", codes: [{ code: "0", meaning: "Echo reply (ping answer)" }] },
  { type: 3, name: "Destination Unreachable", codes: [
    { code: "0", meaning: "Net unreachable" }, { code: "1", meaning: "Host unreachable" },
    { code: "2", meaning: "Protocol unreachable" }, { code: "3", meaning: "Port unreachable" },
    { code: "4", meaning: "Fragmentation needed, DF set" }, { code: "5", meaning: "Source route failed" },
    { code: "6", meaning: "Destination network unknown" }, { code: "7", meaning: "Destination host unknown" },
    { code: "9", meaning: "Network administratively prohibited" }, { code: "10", meaning: "Host administratively prohibited" },
    { code: "13", meaning: "Communication administratively filtered" },
  ]},
  { type: 4, name: "Source Quench (deprecated)", codes: [{ code: "0", meaning: "Quench, slow down" }] },
  { type: 5, name: "Redirect", codes: [
    { code: "0", meaning: "Redirect for network" }, { code: "1", meaning: "Redirect for host" },
    { code: "2", meaning: "Redirect for TOS + network" }, { code: "3", meaning: "Redirect for TOS + host" },
  ]},
  { type: 8, name: "Echo Request", codes: [{ code: "0", meaning: "Echo request (ping)" }] },
  { type: 11, name: "Time Exceeded", codes: [
    { code: "0", meaning: "TTL expired in transit (traceroute relies on this)" },
    { code: "1", meaning: "Fragment reassembly time exceeded" },
  ]},
  { type: 12, name: "Parameter Problem", codes: [
    { code: "0", meaning: "Pointer indicates the error" }, { code: "1", meaning: "Missing required option" }, { code: "2", meaning: "Bad length" },
  ]},
  { type: 13, name: "Timestamp Request", codes: [{ code: "0", meaning: "Timestamp request" }] },
  { type: 14, name: "Timestamp Reply", codes: [{ code: "0", meaning: "Timestamp reply" }] },
  { type: 30, name: "Traceroute", codes: [{ code: "0", meaning: "Outbound (deprecated)" }] },
  { type: 40, name: "Photuris (experimental)", codes: [{ code: "0", meaning: "Photuris message" }] },
  { type: 42, name: "Extended Echo Request", codes: [{ code: "0", meaning: "Extended ping request (RFC 8335)" }] },
  { type: 43, name: "Extended Echo Reply", codes: [{ code: "0", meaning: "Extended ping reply (RFC 8335)" }] },
];

export function lookupIcmp(type: number): IcmpInfo | null {
  if (!Number.isInteger(type) || type < 0 || type > 255) return null;
  return ICMP.find((t) => t.type === type) ?? null;
}

export function searchIcmp(query: string, limit = 20): IcmpInfo[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  if (/^\d+$/.test(q)) {
    const hit = lookupIcmp(Number(q));
    return hit ? [hit] : [];
  }
  return ICMP.filter((t) => t.name.toLowerCase().includes(q)).slice(0, limit);
}
