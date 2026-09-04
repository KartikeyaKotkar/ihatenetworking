import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "Binary to Decimal Converter — Free Online Bin to Dec",
  description: "Free binary to decimal converter. Paste binary, get base-10 instantly. Private, client-side, arbitrary precision.",
};

export default function Page() {
  return (
    <ToolShell
      title="Binary to Decimal Converter"
      description="Paste any binary value and get its decimal equivalent instantly."
      example="11111111 → 255"
      explanation="Each bit is weighted by a power of two from right to left and summed, producing the base-10 value."
      faqs={[
        { q: "Does it accept the 0b prefix?", a: "Yes. 0b11111111 and 11111111 both work. Spaces and underscores are ignored." },
        { q: "Is my input sent anywhere?", a: "No. All conversion runs in your browser." },
      ]}
      related={[
        { href: "/decimal-to-binary", label: "Decimal to Binary" },
        { href: "/binary-to-hex", label: "Binary to Hex" },
        { href: "/ipv4-to-binary", label: "IPv4 to Binary" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
