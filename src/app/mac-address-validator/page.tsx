import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "MAC Address Validator — Check MAC Validity Free",
  description: "Free MAC address validator. Check any MAC string with a clear valid/invalid reason.",
};

export default function Page() {
  return (
    <ToolShell
      title="MAC Address Validator"
      description="Check whether a MAC address string is valid and learn exactly why it fails."
      example="00:1B:44:11:3A:B7 → valid; 00:1B:44:11:3A → wrong length"
      explanation="A valid MAC has exactly 12 hex digits grouped as 6 pairs (colon/hyphen), Cisco xxxx.xxxx.xxxx, or 12 plain digits. Anything else fails on characters, length, or grouping."
      faqs={[
        { q: "What counts as valid?", a: "6 byte pairs with : or -, Cisco dotted xxxx.xxxx.xxxx, or 12 plain hex digits." },
        { q: "Why did mine fail?", a: "The tool reports illegal characters, wrong hex-digit count, or bad grouping." },
      ]}
      related={[
        { href: "/mac-address-formatter", label: "MAC Formatter" },
        { href: "/ethernet-frame-decoder", label: "Ethernet Decoder" },
        { href: "/ipv4-validator", label: "IPv4 Validator" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
