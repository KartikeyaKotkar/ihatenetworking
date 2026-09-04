import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "IPv6 Address Validator — Check & Expand IPv6",
  description: "Free IPv6 validator. Check any IPv6 address and see its full expanded form. Handles :: compression and embedded IPv4. Client-side.",
};

export default function Page() {
  return (
    <ToolShell
      title="IPv6 Address Validator"
      description="Enter any IPv6 address to check validity and see its full expanded form."
      example="2001:db8::1 → valid, expanded 2001:0db8:0000:0000:0000:0000:0000:0001"
      explanation="A valid IPv6 address has 8 groups of 1-4 hex digits, with at most one :: compression. Embedded IPv4 tails like ::ffff:192.0.2.1 are also accepted."
      faqs={[
        { q: "Why is my address invalid?", a: "Usually two :: sequences, more than 8 groups, or non-hex characters." },
        { q: "Are uppercase hex digits OK?", a: "Yes. Hex is case-insensitive; output uses lowercase." },
        { q: "Is my input sent anywhere?", a: "No. Validation runs entirely in your browser." },
      ]}
      related={[
        { href: "/ipv6-compression", label: "IPv6 Compression" },
        { href: "/ipv6-subnet-calculator", label: "IPv6 Subnet Calculator" },
        { href: "/ipv4-validator", label: "IPv4 Validator" },
        { href: "/ipv6-prefix-reference", label: "IPv6 Prefix Reference" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
