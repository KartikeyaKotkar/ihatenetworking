import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "Binary to Hex Converter — Free Online Bin to Hex",
  description: "Free binary to hex converter. Paste binary, get uppercase hexadecimal instantly. Private, client-side, arbitrary precision.",
};

export default function Page() {
  return (
    <ToolShell
      title="Binary to Hex Converter"
      description="Paste any binary value and get its hexadecimal equivalent instantly."
      example="11111111 → FF"
      explanation="Bits are grouped in fours from the right, each nibble mapping to one hex digit. Short groups are zero-padded on the left."
      faqs={[
        { q: "Does it accept the 0b prefix?", a: "Yes. 0b11111111 and 11111111 both work. Spaces and underscores are ignored." },
        { q: "Is my input sent anywhere?", a: "No. All conversion runs in your browser." },
      ]}
      related={[
        { href: "/hex-to-binary", label: "Hex to Binary" },
        { href: "/binary-to-decimal", label: "Binary to Decimal" },
        { href: "/ipv4-to-binary", label: "IPv4 to Binary" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
