import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "ASN Lookup — Find the Autonomous System for Any IP",
  description: "Free ASN lookup. Enter any public IP to find its origin AS number, announcing prefix, country, and registry via Team Cymru.",
};

export default function Page() {
  return (
    <ToolShell
      title="ASN Lookup"
      description="Find the Autonomous System (AS) that originates any public IP address."
      example="8.8.8.8 → AS15169 (Google), 8.8.8.0/24, US"
      explanation="Every public IP is announced on the global BGP routing table by an Autonomous System. This lookup queries Team Cymru's IP-to-ASN service and returns the origin ASN, the announcing prefix, and the registry country."
      faqs={[
        { q: "What is an ASN?", a: "An Autonomous System Number identifies a network operator (e.g. AS15169 = Google) that announces IP prefixes via BGP." },
        { q: "Why no result?", a: "Private and reserved IPs (10.x, 192.168.x, 127.x) are never announced on the public internet, so they have no ASN record." },
        { q: "Where does the data come from?", a: "Live DNS queries to Team Cymru's origin service — the same source many network operators use." },
      ]}
      related={[
        { href: "/bgp-prefix-lookup", label: "BGP Prefix Lookup" },
        { href: "/ip-geolocation-lookup", label: "IP Geolocation Lookup" },
        { href: "/whois-lookup", label: "WHOIS Lookup" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
