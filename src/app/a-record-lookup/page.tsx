import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "A Record Lookup — Find IPv4 Address of Any Domain",
  description: "Free A record lookup. Enter a hostname and see its live IPv4 addresses plus TTL. For AAAA, CNAME and other types use DNS lookup.",
};

export default function Page() {
  return (
    <ToolShell
      title="A Record Lookup"
      description="Find the IPv4 address(es) behind any hostname via its A record."
      example="google.com → 142.250.x.x, TTL 300s"
      explanation="An A record maps a hostname to one or more IPv4 addresses. Large sites return several (round-robin). A 404 means the name has no A record — it may be IPv6-only (AAAA) or an alias."
      faqs={[
        { q: "Why multiple IPs?", a: "Load balancing. Clients pick one; all are valid." },
        { q: "No A record but site works?", a: "It may be IPv6-only or CNAME-aliased. Check AAAA or CNAME lookups." },
        { q: "What is TTL?", a: "Seconds resolvers cache the answer before re-querying." },
      ]}
      related={[
        { href: "/dns-lookup", label: "DNS Lookup" },
        { href: "/cname-lookup", label: "CNAME Lookup" },
        { href: "/ns-record-lookup", label: "NS Record Lookup" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
