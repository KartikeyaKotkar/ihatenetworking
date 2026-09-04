import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "IPv4 Address Validator — Check If an IP Is Valid",
  description: "Free IPv4 validator. Enter any IP string and get instant valid/invalid plus the exact reason. Private, client-side.",
};

export default function Page() {
  return (
    <ToolShell
      title="IPv4 Address Validator"
      description="Enter any IPv4 string. Get instant valid/invalid plus the exact reason."
      example="192.168.1.256 → invalid: octet 4 (256) out of range 0-255"
      explanation="An IPv4 address needs 4 numeric octets 0-255 separated by dots. The validator reports the first failure — wrong octet count, non-numeric text, or out-of-range value."
      faqs={[
        { q: "Why is 192.168.1.256 invalid?", a: "Each octet must be 0-255. 256 exceeds the 8-bit maximum." },
        { q: "Are leading zeros allowed?", a: "Yes, they parse as decimal here (e.g. 010 = 10)." },
        { q: "Is my input sent anywhere?", a: "No. Validation runs entirely in your browser." },
      ]}
      related={[
        { href: "/private-ip-checker", label: "Private IP Checker" },
        { href: "/ipv4-to-binary", label: "IPv4 to Binary" },
        { href: "/subnet-calculator", label: "Subnet Calculator" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
