import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "CNAME Lookup — Find Canonical Name / Alias for a Host",
  description: "Free CNAME lookup. Check whether a hostname is an alias and see its canonical target. No record on apex domains is normal.",
};

export default function Page() {
  return (
    <ToolShell
      title="CNAME Lookup"
      description="Check whether a hostname is an alias (CNAME) and follow it to its canonical target."
      example="www.example.com CNAME → example.com"
      explanation="A CNAME points one name at another canonical name, forming an alias chain that resolvers follow to the final A/AAAA record. Apex/bare domains cannot have CNAMEs (they need SOA/NS), so 'no record' there is expected."
      faqs={[
        { q: "No CNAME found — is that an error?", a: "Usually not. Most apex domains and direct hosts simply have A records instead of aliases." },
        { q: "Can a CNAME chain be long?", a: "Yes, CDNs often chain several CNAMEs before the final address record." },
        { q: "CNAME vs A record?", a: "A gives an IP directly; CNAME gives another name that must be resolved further." },
      ]}
      related={[
        { href: "/dns-lookup", label: "DNS Lookup" },
        { href: "/a-record-lookup", label: "A Record Lookup" },
        { href: "/ns-record-lookup", label: "NS Record Lookup" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
