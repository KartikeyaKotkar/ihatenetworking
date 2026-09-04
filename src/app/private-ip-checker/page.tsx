import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "Private IP Checker — Is My IP Private or Public?",
  description: "Free private IP checker. Enter any IPv4 address to see if it is private (RFC 1918), loopback, CGNAT, or public. Instant, client-side.",
};

export default function Page() {
  return (
    <ToolShell
      title="Private IP Checker"
      description="Enter any IPv4 address to check whether it is private, loopback, link-local, CGNAT, or public."
      example="10.0.0.5 → Private (10.0.0.0/8, RFC 1918). 100.64.0.1 → CGNAT, not private."
      explanation="RFC 1918 reserves 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16 as private. CGNAT space 100.64.0.0/10 looks private but is shared carrier space, not RFC 1918."
      faqs={[
        { q: "Is 100.64.x.x private?", a: "No. It is CGNAT shared space (100.64.0.0/10), not RFC 1918 private." },
        { q: "Is 127.0.0.1 private?", a: "It is loopback, not routable. This tool marks it non-RFC1918 but not public." },
        { q: "Is my input sent anywhere?", a: "No. Classification runs entirely in your browser." },
      ]}
      related={[
        { href: "/ipv4-validator", label: "IPv4 Validator" },
        { href: "/subnet-calculator", label: "Subnet Calculator" },
        { href: "/ip-range-calculator", label: "IP Range Calculator" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
