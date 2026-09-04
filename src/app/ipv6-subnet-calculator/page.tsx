import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "IPv6 Subnet Calculator — Network, Range & Total Addresses",
  description: "Free IPv6 subnet calculator. Enter IPv6 address + prefix to get network, last address, and total count. Instant, client-side.",
};

export default function Page() {
  return (
    <ToolShell
      title="IPv6 Subnet Calculator"
      description="Enter any IPv6 address plus prefix length. Instant network address, last address, and total count."
      example="2001:db8::1/64 → network 2001:db8::, last 2001:db8::ffff:ffff:ffff:ffff"
      explanation="Network = address with host bits zeroed. Last = network + 2^(128-prefix) − 1. A /64 holds 2^64 ≈ 1.8×10^19 addresses."
      faqs={[
        { q: "How many addresses in a /64?", a: "2^64, about 18 quintillion. IPv6 subnets are vast." },
        { q: "What is the typical LAN prefix?", a: "/64. It is the standard subnet size for SLAAC." },
        { q: "Is my input sent anywhere?", a: "No. All math runs in your browser with BigInt." },
      ]}
      related={[
        { href: "/ipv6-validator", label: "IPv6 Validator" },
        { href: "/ipv6-compression", label: "IPv6 Compression" },
        { href: "/subnet-calculator", label: "Subnet Calculator" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
