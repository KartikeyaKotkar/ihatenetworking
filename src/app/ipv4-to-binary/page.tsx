import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "IPv4 to Binary Converter — Dotted Binary Online",
  description: "Free IPv4 to binary converter. Enter an IPv4 address, get dotted 8-bit binary instantly. Private, client-side.",
};

export default function Page() {
  return (
    <ToolShell
      title="IPv4 to Binary"
      description="Enter any IPv4 address. Get dotted 8-bit binary instantly."
      example="192.168.1.10 → 11000000.10101000.00000001.00001010"
      explanation="Each octet (0-255) maps to 8 bits. Dotted binary keeps the 4-octet structure so you can see network vs host bits."
      faqs={[
        { q: "What is dotted binary?", a: "Each decimal octet as 8 bits, joined by dots — e.g. 192 = 11000000." },
        { q: "Why convert to binary?", a: "Subnet math (network, broadcast, masks) is bitwise AND/OR on these bits." },
        { q: "Is my input sent anywhere?", a: "No. Conversion runs entirely in your browser." },
      ]}
      related={[
        { href: "/binary-to-ipv4", label: "Binary to IPv4" },
        { href: "/ipv4-validator", label: "IPv4 Validator" },
        { href: "/subnet-calculator", label: "Subnet Calculator" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
