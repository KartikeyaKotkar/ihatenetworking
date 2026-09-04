import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "NS Record Lookup — Find Nameservers for Any Domain",
  description: "Free NS record lookup. See which authoritative nameservers a domain is delegated to, live with TTL.",
};

export default function Page() {
  return (
    <ToolShell
      title="NS Record Lookup"
      description="Find the authoritative nameservers a domain is delegated to."
      example="google.com NS → ns1.google.com …"
      explanation="NS records at the parent zone delegate a domain to its authoritative nameservers. Whoever controls those servers controls all DNS answers for the domain — that is why NS checks matter during migrations."
      faqs={[
        { q: "Why do NS lookups matter?", a: "Wrong NS after a migration or transfer means the whole domain stops resolving." },
        { q: "How many nameservers?", a: "Usually 2–4 for redundancy across networks." },
        { q: "NS vs A record?", a: "NS names the servers in charge of the domain; A gives the IP of a host." },
      ]}
      related={[
        { href: "/dns-lookup", label: "DNS Lookup" },
        { href: "/a-record-lookup", label: "A Record Lookup" },
        { href: "/cname-lookup", label: "CNAME Lookup" },
        { href: "/dns-propagation-checker", label: "Propagation Checker" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
