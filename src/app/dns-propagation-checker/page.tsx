import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "DNS Propagation Checker — Check DNS Worldwide",
  description: "Free DNS propagation checker. See how your hostname resolves across multiple public resolvers and whether they agree yet.",
};

export default function Page() {
  return (
    <ToolShell
      title="DNS Propagation Checker"
      description="Check how a hostname resolves across multiple public DNS resolvers worldwide."
      example="example.com → agreed across 4 resolvers: 93.184.215.14"
      explanation="DNS records are cached per their TTL, so after a change different resolvers may answer differently until old entries expire. This tool queries several public resolvers and reports whether they agree yet."
      faqs={[
        { q: "How long does propagation take?", a: "Usually up to the record's TTL — commonly 5 minutes to 24 hours. Lower the TTL before a planned change." },
        { q: "What does 'not yet' mean?", a: "Resolvers returned different answers, so cached old values are still expiring. Wait one TTL and check again." },
        { q: "Why do resolvers differ?", a: "Each resolver caches independently. Stale caches, geo-steered answers, and round-robin records can all cause disagreement." },
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
