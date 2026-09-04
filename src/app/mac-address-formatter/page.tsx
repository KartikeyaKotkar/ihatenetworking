import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "MAC Address Formatter — Convert MAC Formats Free",
  description: "Free MAC address formatter. Convert any MAC form to colon, hyphen, Cisco dot, and plain formats with OUI lookup.",
};

export default function Page() {
  return (
    <ToolShell
      title="MAC Address Formatter"
      description="Paste any MAC form and get all 5 standard formats plus unicast/multicast, universal/local, and OUI."
      example="00:1B:44:11:3A:B7 → 001B.4411.3AB7, 00-1B-44-11-3A-B7"
      explanation="A MAC is 6 bytes (12 hex digits). Separators are cosmetic: colons, hyphens, Cisco dots, or plain hex all encode the same bytes. Bit 0 of the first byte = unicast/multicast, bit 1 = universal/local."
      faqs={[
        { q: "Which formats are shown?", a: "Uppercase colon, lowercase colon, hyphen, Cisco dotted, and plain hex — plus the OUI (first 3 bytes)." },
        { q: "What is unicast vs multicast?", a: "Bit 0 of the first byte decides: even = unicast, odd = multicast (e.g. FF:FF:FF:FF:FF:FF broadcast)." },
      ]}
      related={[
        { href: "/mac-address-validator", label: "MAC Validator" },
        { href: "/ethernet-frame-decoder", label: "Ethernet Decoder" },
        { href: "/ipv4-to-binary", label: "IPv4 to Binary" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
