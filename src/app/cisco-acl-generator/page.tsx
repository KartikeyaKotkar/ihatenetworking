import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "Cisco ACL Generator",
  description: "Free Cisco extended ACL generator. Build access-list 100-199 permit/deny lines with a live preview.",
};

export default function Page() {
  return (
    <ToolShell
      title="Cisco ACL Generator"
      description="Build a Cisco extended access-list entry with live IOS syntax preview."
      example="access-list 100 permit tcp any any eq 80"
      explanation="Extended ACLs are numbered 100-199. Each line matches protocol plus source and destination. An implicit deny ip any any ends every ACL, so permit what you need explicitly."
      faqs={[
        { q: "What address formats work?", a: 'Use "any", "host 1.2.3.4", or "network wildcard" like "10.0.0.0 0.0.0.255".' },
        { q: "When is the port field used?", a: 'Only for TCP/UDP, e.g. "eq 80" or "range 1000 2000". It is ignored for ip/icmp.' },
        { q: "Is there an implicit deny?", a: "Yes. Every ACL ends with deny ip any any, so add explicit permit lines first." },
      ]}
      related={[
        { href: "/cisco-wildcard-mask-calculator", label: "Cisco Wildcard Calculator" },
        { href: "/cisco-config-generator", label: "Cisco Config Generator" },
        { href: "/wildcard-mask-calculator", label: "Wildcard Calculator" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
