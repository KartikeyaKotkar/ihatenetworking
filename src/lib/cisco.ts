// Cisco / student helpers. Pure, client-safe. Reuses ipv4 lib for address math.

import { describeSubnet, parseIPv4, parsePrefix, prefixToMaskString, prefixToWildcardString, ipv4ToString, networkAddressInt } from "@/lib/ipv4";

// ---------- Wildcard (Cisco command form) ----------

export interface CiscoWildcard {
  prefix: number;
  mask: string;
  wildcard: string;
  networkStatement: string;
}

export function ciscoWildcard(networkStr: string, prefix: number): CiscoWildcard | null {
  const ip = parseIPv4(networkStr);
  const p = parsePrefix(prefix);
  if (ip === null || p === null) return null;
  const net = ipv4ToString(networkAddressInt(ip, p));
  const wild = prefixToWildcardString(p);
  return { prefix: p, mask: prefixToMaskString(p), wildcard: wild, networkStatement: `network ${net} ${wild} area 0` };
}

// ---------- ACL generator ----------

export type AclAction = "permit" | "deny";
export type AclProtocol = "ip" | "tcp" | "udp" | "icmp";

export interface AclRule {
  action: AclAction;
  protocol: AclProtocol;
  src: string;
  dst: string;
  port: string; // "" or "eq 80" / "range 1000 2000"
  remark: string;
}

/** Parse "any" | "host 1.2.3.4" | "1.2.3.0" | "1.2.3.0 0.0.0.255". Null on invalid. */
export function parseAclAddr(input: string): string | null {
  const s = input.trim();
  if (/^any$/i.test(s)) return "any";
  const hostMatch = s.match(/^host\s+(\S+)$/i);
  if (hostMatch) {
    const ip = parseIPv4(hostMatch[1]);
    return ip === null ? null : `host ${ipv4ToString(ip)}`;
  }
  const parts = s.split(/\s+/);
  if (parts.length === 1) {
    const ip = parseIPv4(parts[0]);
    return ip === null ? null : `host ${ipv4ToString(ip)}`;
  }
  if (parts.length === 2) {
    const ip = parseIPv4(parts[0]);
    const w = parseIPv4(parts[1]);
    if (ip === null || w === null) return null;
    return `${ipv4ToString(ip)} ${ipv4ToString(w)}`;
  }
  return null;
}

/** Build numbered extended ACL lines. Returns lines or error string. */
export function buildAcl(number: number, rules: AclRule[]): { lines: string[] } | { error: string } {
  if (!Number.isInteger(number) || number < 100 || number > 199)
    return { error: "Extended ACL number must be 100-199." };
  if (rules.length === 0 || rules.length > 32) return { error: "Add 1-32 rules." };
  const lines: string[] = [];
  for (let i = 0; i < rules.length; i++) {
    const r = rules[i];
    const src = parseAclAddr(r.src);
    const dst = parseAclAddr(r.dst);
    if (!src) return { error: `Rule ${i + 1}: bad source. Use "any", "host 1.2.3.4", or "1.2.3.0 0.0.0.255".` };
    if (!dst) return { error: `Rule ${i + 1}: bad destination. Use "any", "host 1.2.3.4", or "1.2.3.0 0.0.0.255".` };
    let line = `access-list ${number} ${r.action} ${r.protocol} ${src} ${dst}`;
    if ((r.protocol === "tcp" || r.protocol === "udp") && r.port.trim() !== "") {
      if (!/^(eq \d{1,5}|range \d{1,5} \d{1,5})$/.test(r.port.trim()))
        return { error: `Rule ${i + 1}: port must be "eq 80" or "range 1000 2000".` };
      line += ` ${r.port.trim()}`;
    }
    lines.push(line);
    if (r.remark.trim() !== "") lines.push(`! ${r.remark.trim()}`);
  }
  return { lines };
}

// ---------- VLAN ----------

export type VlanKind = "normal" | "reserved-fddi-token" | "extended" | "invalid";

export interface VlanInfo {
  id: number;
  kind: VlanKind;
  label: string;
  config: string;
}

export function vlanInfo(id: number, name: string): VlanInfo | null {
  if (!Number.isInteger(id) || id < 1 || id > 4094) return null;
  let kind: VlanKind = "normal";
  let label = "Normal-range VLAN (1-1005).";
  if (id >= 1002 && id <= 1005) {
    kind = "reserved-fddi-token";
    label = "Reserved for Token Ring/FDDI. Cannot be used for Ethernet.";
  } else if (id >= 1006) {
    kind = "extended";
    label = "Extended-range VLAN (1006-4094). Requires VTP transparent mode.";
  }
  const clean = name.trim().replace(/[^\w-]/g, "").slice(0, 32) || `VLAN${id}`;
  return { id, kind, label, config: `vlan ${id}\n name ${clean}\nexit` };
}

// ---------- Cisco subnet / IP (IOS command output) ----------

export interface CiscoSubnet {
  network: string;
  prefix: number;
  mask: string;
  wildcard: string;
  ipCommand: string;
  networkCommand: string;
  firstUsable: string;
  lastUsable: string;
  usableHosts: number;
}

export function ciscoSubnet(ipStr: string, prefix: number): CiscoSubnet | null {
  const info = describeSubnet(ipStr, prefix);
  if (!info) return null;
  return {
    network: info.network,
    prefix: info.prefix,
    mask: info.mask,
    wildcard: info.wildcard,
    ipCommand: `ip address ${info.firstUsable} ${info.mask}`,
    networkCommand: `network ${info.network} ${info.wildcard} area 0`,
    firstUsable: info.firstUsable,
    lastUsable: info.lastUsable,
    usableHosts: info.usableHosts,
  };
}

const CLASS_DEFAULT: Record<string, number> = { A: 8, B: 16, C: 24 };

export interface CiscoIp {
  ip: string;
  cls: string;
  defaultMask: string | null;
  classful: boolean;
}

export function ciscoIp(ipStr: string): CiscoIp | null {
  const ip = parseIPv4(ipStr);
  if (ip === null) return null;
  const first = Math.floor((ip >>> 0) / 16777216);
  let cls = "E";
  if (first < 128) cls = "A";
  else if (first < 192) cls = "B";
  else if (first < 224) cls = "C";
  else if (first < 240) cls = "D";
  const def = CLASS_DEFAULT[cls];
  return {
    ip: ipv4ToString(ip),
    cls,
    defaultMask: def === undefined ? null : prefixToMaskString(def),
    classful: def !== undefined,
  };
}

// ---------- Interface range ----------

const IF_TYPES = ["GigabitEthernet", "FastEthernet", "TenGigabitEthernet", "Serial", "Loopback", "Vlan"] as const;
export type IfType = (typeof IF_TYPES)[number];

export function interfaceRange(mod: IfType, slot: number, start: number, end: number): string | null {
  for (const n of [slot, start, end]) {
    if (!Number.isInteger(n) || n < 0 || n > 4094) return null;
  }
  if (start > end || end - start > 200) return null;
  return `interface range ${mod}${slot}/${start} - ${end}`;
}

// ---------- Config generator ----------

export interface SimpleIface {
  name: string;
  ip: string;
  mask: string;
  desc: string;
}

export function buildConfig(hostname: string, ifaces: SimpleIface[], defaultRoute: string): { config: string } | { error: string } {
  const host = hostname.trim().replace(/[^\w-]/g, "").slice(0, 32);
  if (!host) return { error: "Hostname required (letters, digits, dash)." };
  if (ifaces.length > 8) return { error: "Max 8 interfaces." };
  const out = [`hostname ${host}`];
  for (let i = 0; i < ifaces.length; i++) {
    const f = ifaces[i];
    if (!/^[\w\/.-]{1,32}$/.test(f.name.trim())) return { error: `Interface ${i + 1}: bad name.` };
    if (parseIPv4(f.ip) === null) return { error: `Interface ${i + 1}: bad IP.` };
    if (parseIPv4(f.mask) === null) return { error: `Interface ${i + 1}: bad mask.` };
    out.push(`interface ${f.name.trim()}`);
    if (f.desc.trim() !== "") out.push(` description ${f.desc.trim().slice(0, 80)}`);
    out.push(` ip address ${f.ip.trim()} ${f.mask.trim()}`, ` no shutdown`, `exit`);
  }
  if (defaultRoute.trim() !== "") {
    if (parseIPv4(defaultRoute) === null) return { error: "Bad default-route next hop." };
    out.push(`ip route 0.0.0.0 0.0.0.0 ${defaultRoute.trim()}`);
  }
  out.push("end", "write memory");
  return { config: out.join("\n") };
}

// ---------- OSPF cost ----------

export function ospfCost(bandwidthBps: number, refBps = 100e6): number | null {
  if (!Number.isFinite(bandwidthBps) || bandwidthBps <= 0) return null;
  if (!Number.isFinite(refBps) || refBps <= 0) return null;
  return Math.max(1, Math.round(refBps / bandwidthBps));
}

// ---------- EIGRP classic metric ----------

export interface EigrpResult {
  metric: number;
  bwTerm: number;
  delayTerm: number;
}

export function eigrpMetric(minBwKbps: number, totalDelayTensUsec: number, k1 = 1, k2 = 0, k3 = 1, k4 = 0, k5 = 0): EigrpResult | null {
  const ks = [k1, k2, k3, k4, k5];
  if (ks.some((k) => !Number.isInteger(k) || k < 0 || k > 255)) return null;
  if (!Number.isFinite(minBwKbps) || minBwKbps <= 0) return null;
  if (!Number.isFinite(totalDelayTensUsec) || totalDelayTensUsec < 0) return null;
  if (k5 !== 0) return null; // reliability term needs live data; classic formula only
  const bwTerm = Math.floor((10e6 / minBwKbps) * 256);
  const delayTerm = Math.floor(totalDelayTensUsec * 256);
  const metric = k1 * bwTerm + k3 * delayTerm;
  return { metric, bwTerm, delayTerm };
}

// ---------- STP root ----------

export function stpEffectivePriority(priority: number, vlan: number): number | null {
  if (!Number.isInteger(priority) || priority < 0 || priority > 61440 || priority % 4096 !== 0) return null;
  if (!Number.isInteger(vlan) || vlan < 1 || vlan > 4094) return null;
  return priority + vlan;
}

export function stpWinner(a: { priority: number; vlan: number; mac: string }, b: { priority: number; vlan: number; mac: string }): string | null {
  const pa = stpEffectivePriority(a.priority, a.vlan);
  const pb = stpEffectivePriority(b.priority, b.vlan);
  if (pa === null || pb === null) return null;
  if (pa !== pb) return pa < pb ? "Bridge A wins (lower effective priority)." : "Bridge B wins (lower effective priority).";
  const norm = (m: string) => m.trim().toUpperCase();
  if (norm(a.mac) === norm(b.mac)) return "Tie on priority and MAC. Check configuration.";
  return norm(a.mac) < norm(b.mac) ? "Tie on priority. Bridge A wins (lower MAC)." : "Tie on priority. Bridge B wins (lower MAC).";
}
