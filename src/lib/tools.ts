export interface ToolEntry {
  href: string;
  title: string;
  desc: string;
  category: CategoryId;
  keywords: string;
  popular?: boolean;
  recent?: boolean;
}

export type CategoryId =
  | "subnetting"
  | "ip-addressing"
  | "dns"
  | "ports-protocols"
  | "network-testing"
  | "calculators"
  | "converters"
  | "cisco";

export interface Category {
  id: CategoryId;
  label: string;
  blurb: string;
}

export const CATEGORIES: Category[] = [
  { id: "subnetting", label: "Subnetting", blurb: "Carve networks, decode CIDR, plan VLSM." },
  { id: "ip-addressing", label: "IP Addressing", blurb: "Validate, convert, classify, and range IPv4 and IPv6." },
  { id: "dns", label: "DNS", blurb: "Resolve records, reverse IPs, inspect mail and name servers." },
  { id: "ports-protocols", label: "Ports & Protocols", blurb: "Look up ports, services, and HTTP status codes." },
  { id: "network-testing", label: "Network Testing", blurb: "Ping, trace, and inspect live HTTP responses." },
  { id: "calculators", label: "Calculators", blurb: "Host counts, masks, and ranges at a glance." },
  { id: "converters", label: "Converters", blurb: "Hex, decimal, and binary both ways, any size." },
  { id: "cisco", label: "Cisco", blurb: "Student and engineer toolkit. Coming in Phase 3." },
];

export const TOOLS: ToolEntry[] = [
  // Subnetting (12)
  { href: "/subnet-calculator", title: "IPv4 Subnet Calculator", desc: "Network, broadcast, range from IP + prefix", category: "subnetting", keywords: "subnet network broadcast mask hosts cidr", popular: true },
  { href: "/cidr-calculator", title: "CIDR Calculator", desc: "Decode 10.0.0.5/16 style input", category: "subnetting", keywords: "cidr prefix slash notation", popular: true },
  { href: "/vlsm-calculator", title: "VLSM Calculator", desc: "Allocate subnets by host count", category: "subnetting", keywords: "vlsm variable length allocate hosts", popular: true },
  { href: "/subnet-splitter", title: "Subnet Splitter", desc: "Split network into equal subnets", category: "subnetting", keywords: "split divide equal subnets", popular: true },
  { href: "/subnet-range-calculator", title: "Subnet Range Calculator", desc: "First to last usable IP", category: "subnetting", keywords: "range first last usable hosts", popular: true },
  { href: "/usable-host-calculator", title: "Usable Host Calculator", desc: "Hosts per prefix length", category: "subnetting", keywords: "usable hosts count prefix", popular: true },
  { href: "/subnet-mask-calculator", title: "Subnet Mask Calculator", desc: "Mask for host count", category: "subnetting", keywords: "mask netmask hosts needed", },
  { href: "/wildcard-mask-calculator", title: "Wildcard Mask Calculator", desc: "Inverse mask for ACLs", category: "subnetting", keywords: "wildcard inverse acl ospf cisco", popular: true },
  { href: "/cidr-to-subnet-mask", title: "CIDR to Subnet Mask", desc: "/24 to 255.255.255.0", category: "subnetting", keywords: "cidr mask convert netmask", },
  { href: "/subnet-mask-to-cidr", title: "Subnet Mask to CIDR", desc: "255.255.255.0 to /24", category: "subnetting", keywords: "mask cidr prefix convert", },
  { href: "/network-address-calculator", title: "Network Address Calculator", desc: "IP AND mask", category: "subnetting", keywords: "network address and", },
  { href: "/broadcast-address-calculator", title: "Broadcast Address Calculator", desc: "Last address of subnet", category: "subnetting", keywords: "broadcast last address", },
  // IP Addressing (9)
  { href: "/ipv4-validator", title: "IPv4 Address Validator", desc: "Valid or not, with reason", category: "ip-addressing", keywords: "validate ipv4 check valid", popular: true },
  { href: "/ipv4-to-binary", title: "IPv4 to Binary", desc: "Dotted decimal to binary", category: "ip-addressing", keywords: "ipv4 binary bits convert", },
  { href: "/binary-to-ipv4", title: "Binary to IPv4", desc: "Binary back to dotted decimal", category: "ip-addressing", keywords: "binary ipv4 bits convert", },
  { href: "/ip-range-calculator", title: "IP Range Calculator", desc: "Count addresses between two IPs", category: "ip-addressing", keywords: "range count between", popular: true },
  { href: "/ip-range-generator", title: "IP Range Generator", desc: "List every IP in range", category: "ip-addressing", keywords: "range list generate enumerate", },
  { href: "/private-ip-checker", title: "Private IP Checker", desc: "Private, CGNAT, public, scope", category: "ip-addressing", keywords: "private public rfc1918 cgnat scope", recent: true },
  { href: "/ipv6-subnet-calculator", title: "IPv6 Subnet Calculator", desc: "Network + last address + total", category: "ip-addressing", keywords: "ipv6 subnet prefix network", },
  { href: "/ipv6-validator", title: "IPv6 Address Validator", desc: "Valid or not, expanded form", category: "ip-addressing", keywords: "ipv6 validate check", },
  { href: "/ipv6-compression", title: "IPv6 Compression & Expansion", desc: "Shortest vs full form, RFC 5952", category: "ip-addressing", keywords: "ipv6 compress expand shorten full", recent: true },
  // DNS (7)
  { href: "/dns-lookup", title: "DNS Lookup", desc: "A/AAAA/MX/CNAME/TXT/NS records", category: "dns", keywords: "dns resolve record dig nslookup", recent: true },
  { href: "/reverse-dns-lookup", title: "Reverse DNS Lookup", desc: "IP to hostname via PTR", category: "dns", keywords: "reverse ptr ip hostname", },
  { href: "/mx-record-lookup", title: "MX Record Lookup", desc: "Mail servers + priority", category: "dns", keywords: "mx mail exchange email", },
  { href: "/a-record-lookup", title: "A Record Lookup", desc: "Hostname to IPv4", category: "dns", keywords: "a record ipv4 address", },
  { href: "/cname-lookup", title: "CNAME Lookup", desc: "Alias chain target", category: "dns", keywords: "cname alias canonical", },
  { href: "/txt-record-lookup", title: "TXT Record Lookup", desc: "SPF, DKIM, verification", category: "dns", keywords: "txt spf dkim verification", },
  { href: "/ns-record-lookup", title: "NS Record Lookup", desc: "Authoritative nameservers", category: "dns", keywords: "ns nameserver delegation authoritative", },
  // Ports & Protocols (2)
  { href: "/port-number-lookup", title: "Port Number Lookup", desc: "Service behind the port", category: "ports-protocols", keywords: "port service tcp udp well-known", popular: true, recent: true },
  { href: "/http-status-code-lookup", title: "HTTP Status Code Lookup", desc: "What 404 really means", category: "ports-protocols", keywords: "http status code 404 500", },
  // Network Testing (3)
  { href: "/ping-tester", title: "Ping Tester", desc: "ICMP latency, TCP fallback", category: "network-testing", keywords: "ping latency icmp echo", recent: true },
  { href: "/traceroute", title: "Traceroute", desc: "Hop-by-hop path trace", category: "network-testing", keywords: "traceroute hops path tracert", recent: true },
  { href: "/http-header-checker", title: "HTTP Header Checker", desc: "Status + response headers", category: "network-testing", keywords: "http headers response status", recent: true },
  // Calculators (cross-links to calculator-style tools)
  // Converters (6) + URL codec live under utilities per game plan §2
  { href: "/url-parser", title: "URL Parser", desc: "Split URL into parts", category: "converters", keywords: "url parse query params parts", recent: true },
  { href: "/url-encoder-decoder", title: "URL Encoder/Decoder", desc: "Percent-encoding both ways", category: "converters", keywords: "url encode decode percent", },
  { href: "/hex-to-binary", title: "Hex to Binary", desc: "FF to 11111111", category: "converters", keywords: "hex binary base convert", recent: true },
  { href: "/binary-to-hex", title: "Binary to Hex", desc: "11111111 to FF", category: "converters", keywords: "binary hex base convert", },
  { href: "/decimal-to-binary", title: "Decimal to Binary", desc: "255 to 11111111", category: "converters", keywords: "decimal binary base convert", },
  { href: "/binary-to-decimal", title: "Binary to Decimal", desc: "11111111 to 255", category: "converters", keywords: "binary decimal base convert", },
  { href: "/hex-to-decimal", title: "Hex to Decimal", desc: "FF to 255", category: "converters", keywords: "hex decimal base convert", },
  { href: "/decimal-to-hex", title: "Decimal to Hex", desc: "255 to FF", category: "converters", keywords: "decimal hex base convert", },
];

export const CALCULATOR_HREFS = [
  "/subnet-calculator",
  "/cidr-calculator",
  "/vlsm-calculator",
  "/usable-host-calculator",
  "/subnet-mask-calculator",
  "/ip-range-calculator",
];

export function toolsByCategory(id: CategoryId): ToolEntry[] {
  if (id === "calculators") return CALCULATOR_HREFS.map((h) => TOOLS.find((t) => t.href === h)!).filter(Boolean);
  if (id === "cisco") return [];
  return TOOLS.filter((t) => t.category === id);
}

export function searchTools(query: string, limit = 8): ToolEntry[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const words = q.split(/\s+/);
  const scored = TOOLS.map((t) => {
    const hay = `${t.title} ${t.desc} ${t.keywords}`.toLowerCase();
    let score = 0;
    for (const w of words) {
      if (t.title.toLowerCase().includes(w)) score += 3;
      else if (hay.includes(w)) score += 1;
      else return null;
    }
    return { t, score };
  }).filter((x): x is { t: ToolEntry; score: number } => x !== null);
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((x) => x.t);
}
