import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "Subnet Mask to CIDR Converter",
  description: "Free mask to CIDR converter. 255.255.255.0 → /24. Validates contiguous masks.",
};

export default function Page() {
  return (
    <ToolShell
      title="Subnet Mask to CIDR"
      description="Convert dotted mask to prefix length. Rejects non-contiguous masks."
      example="255.255.255.0 → /24"
      explanation="Counts leading one-bits. 255.0.255.0 invalid: ones must be contiguous."
      faqs={[{ q: "Why is 255.0.255.0 invalid?", a: "Masks must be contiguous ones then zeros. That pattern interleaves, no valid prefix." }]}
      related={[{ href: "/cidr-to-subnet-mask", label: "CIDR to Mask" }, { href: "/wildcard-mask-calculator", label: "Wildcard Calculator" }, { href: "/subnet-calculator", label: "Subnet Calculator" }]}
    >
      <Calculator />
    </ToolShell>
  );
}
