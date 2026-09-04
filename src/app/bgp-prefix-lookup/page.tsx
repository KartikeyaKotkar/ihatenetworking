import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "BGP Prefix Lookup — Find the Announcing Prefix for Any IP",
  description: "Free BGP prefix lookup. Enter any public IP to see its announcing prefix and origin ASN from the global routing table.",
};

export default function Page() {
  return (
    <ToolShell
      title="BGP Prefix Lookup"
      description="Find which BGP prefix announces any public IP, and which AS originates it."
      example="8.8.8.8 → 8.8.8.0/24 originated by AS15169"
      explanation="Routers forward packets using longest-prefix-match: the most specific covering prefix wins. An IP like 8.8.8.8 falls inside the announced prefix 8.8.8.0/24 — this tool shows that covering prefix and its origin AS."
      faqs={[
        { q: "What is longest-prefix-match?", a: "When several prefixes cover an IP, routers use the longest (most specific) one. A /24 beats a /16 for the same address." },
        { q: "Prefix vs ASN?", a: "The prefix is the address block announced on BGP; the ASN is the network operator announcing it." },
        { q: "Why no result?", a: "Private/reserved IPs are never announced on public BGP, so there is no covering prefix for them." },
      ]}
      related={[
        { href: "/asn-lookup", label: "ASN Lookup" },
        { href: "/ip-geolocation-lookup", label: "IP Geolocation Lookup" },
        { href: "/traceroute", label: "Traceroute" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
