import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "Decimal to Binary Converter — Free Online Dec to Bin",
  description: "Free decimal to binary converter. Enter a base-10 number, get binary instantly. Private, client-side, arbitrary precision.",
};

export default function Page() {
  return (
    <ToolShell
      title="Decimal to Binary Converter"
      description="Enter any base-10 number and get its binary equivalent instantly."
      example="255 → 11111111"
      explanation="The number is repeatedly divided by 2 and remainders are read in reverse, yielding the base-2 representation."
      faqs={[
        { q: "Does it handle large numbers?", a: "Yes. Arbitrary-precision integers are supported, far beyond 32 bits." },
        { q: "Is my input sent anywhere?", a: "No. All conversion runs in your browser." },
      ]}
      related={[
        { href: "/binary-to-decimal", label: "Binary to Decimal" },
        { href: "/decimal-to-hex", label: "Decimal to Hex" },
        { href: "/ipv4-to-binary", label: "IPv4 to Binary" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
