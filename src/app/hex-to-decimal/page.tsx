import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "Hex to Decimal Converter — Free Online Hex to Dec",
  description: "Free hex to decimal converter. Paste hexadecimal, get base-10 instantly. Private, client-side, arbitrary precision.",
};

export default function Page() {
  return (
    <ToolShell
      title="Hex to Decimal Converter"
      description="Paste any hexadecimal value and get its decimal equivalent instantly."
      example="FF → 255"
      explanation="Each hex digit is weighted by a power of sixteen from right to left and summed, producing the base-10 value."
      faqs={[
        { q: "Does it accept the 0x prefix?", a: "Yes. 0xFF and FF both work. Spaces and underscores are ignored." },
        { q: "Is my input sent anywhere?", a: "No. All conversion runs in your browser." },
      ]}
      related={[
        { href: "/decimal-to-hex", label: "Decimal to Hex" },
        { href: "/hex-to-binary", label: "Hex to Binary" },
        { href: "/ipv4-to-binary", label: "IPv4 to Binary" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
