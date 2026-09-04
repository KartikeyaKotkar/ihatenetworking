import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "Binary to IPv4 Converter — Dotted Decimal Online",
  description: "Free binary to IPv4 converter. Paste dotted binary or 32-bit binary, get dotted decimal instantly. Private, client-side.",
};

export default function Page() {
  return (
    <ToolShell
      title="Binary to IPv4"
      description="Paste dotted binary or plain 32-bit binary. Get dotted decimal instantly."
      example="11000000.10101000.00000001.00001010 → 192.168.1.10"
      explanation="Each 8-bit group converts to one decimal octet 0-255. Dotted form needs four 8-bit groups; plain form needs exactly 32 bits of 0/1."
      faqs={[
        { q: "Which formats are accepted?", a: "Dotted (11000000.10101000.00000001.00001010) or plain 32-bit (11000000101010000000000100001010)." },
        { q: "Why did my input fail?", a: "Each dotted group must be exactly 8 chars of 0/1; plain input must be exactly 32 bits." },
        { q: "Is my input sent anywhere?", a: "No. Conversion runs entirely in your browser." },
      ]}
      related={[
        { href: "/ipv4-to-binary", label: "IPv4 to Binary" },
        { href: "/ipv4-validator", label: "IPv4 Validator" },
        { href: "/cidr-calculator", label: "CIDR Calculator" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
