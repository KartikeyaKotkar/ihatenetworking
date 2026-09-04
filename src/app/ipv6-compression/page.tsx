import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "IPv6 Compression & Expansion — Compress or Expand IPv6",
  description: "Free IPv6 compressor and expander. Paste any IPv6 address to see both RFC 5952 compressed and full expanded forms. Client-side.",
};

export default function Page() {
  return (
    <ToolShell
      title="IPv6 Compression & Expansion"
      description="Paste any IPv6 address in either form to see both its compressed and expanded representations."
      example="2001:0db8:0000:0000:0000:0000:0000:0001 → compressed 2001:db8::1"
      explanation="RFC 5952: suppress leading zeros per group, replace the longest run of 2+ zero groups with :: once (first run wins ties), use lowercase hex."
      faqs={[
        { q: "When is :: allowed?", a: "Once per address, replacing one or more consecutive all-zero groups." },
        { q: "Why lowercase?", a: "RFC 5952 recommends lowercase hex for consistent display." },
        { q: "Is my input sent anywhere?", a: "No. Conversion runs entirely in your browser." },
      ]}
      related={[
        { href: "/ipv6-validator", label: "IPv6 Validator" },
        { href: "/ipv6-subnet-calculator", label: "IPv6 Subnet Calculator" },
        { href: "/ipv4-to-binary", label: "IPv4 to Binary" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
