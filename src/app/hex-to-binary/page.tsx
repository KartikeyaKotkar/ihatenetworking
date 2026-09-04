import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "Hex to Binary Converter — Free Online Hex to Bin",
  description: "Free hex to binary converter. Paste hexadecimal, get binary instantly. Private, client-side, arbitrary precision.",
};

export default function Page() {
  return (
    <ToolShell
      title="Hex to Binary Converter"
      description="Paste any hexadecimal value and get its binary equivalent instantly."
      example="FF → 11111111"
      explanation="Each hex digit maps to exactly 4 binary bits. The converter translates digit by digit, then strips leading zeros."
      faqs={[
        { q: "Does it accept the 0x prefix?", a: "Yes. 0xFF and FF both work. Spaces and underscores are ignored." },
        { q: "Is my input sent anywhere?", a: "No. All conversion runs in your browser." },
      ]}
      related={[
        { href: "/binary-to-hex", label: "Binary to Hex" },
        { href: "/hex-to-decimal", label: "Hex to Decimal" },
        { href: "/ipv4-to-binary", label: "IPv4 to Binary" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
