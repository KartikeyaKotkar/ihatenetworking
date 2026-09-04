import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "Decimal to Hex Converter — Free Online Dec to Hex",
  description: "Free decimal to hex converter. Enter a base-10 number, get uppercase hexadecimal instantly. Private, client-side, arbitrary precision.",
};

export default function Page() {
  return (
    <ToolShell
      title="Decimal to Hex Converter"
      description="Enter any base-10 number and get its hexadecimal equivalent instantly."
      example="255 → FF"
      explanation="The number is repeatedly divided by 16 and remainders are read in reverse, yielding the base-16 representation."
      faqs={[
        { q: "Does it handle large numbers?", a: "Yes. Arbitrary-precision integers are supported, far beyond 32 bits." },
        { q: "Is my input sent anywhere?", a: "No. All conversion runs in your browser." },
      ]}
      related={[
        { href: "/hex-to-decimal", label: "Hex to Decimal" },
        { href: "/decimal-to-binary", label: "Decimal to Binary" },
        { href: "/ipv4-to-binary", label: "IPv4 to Binary" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
