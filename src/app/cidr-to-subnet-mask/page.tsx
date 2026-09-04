import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "CIDR to Subnet Mask Converter",
  description: "Free CIDR to mask converter. /24 → 255.255.255.0 instantly with wildcard.",
};

export default function Page() {
  return (
    <ToolShell
      title="CIDR to Subnet Mask"
      description="Convert prefix length to dotted-decimal mask plus wildcard."
      example="/24 → 255.255.255.0"
      explanation="Prefix N = N one-bits then zeros. /24 = 24 ones = 255.255.255.0."
      faqs={[{ q: "Common values?", a: "/8=255.0.0.0, /16=255.255.0.0, /24=255.255.255.0." }]}
      related={[{ href: "/subnet-mask-to-cidr", label: "Mask to CIDR" }, { href: "/wildcard-mask-calculator", label: "Wildcard Calculator" }, { href: "/cidr-calculator", label: "CIDR Calculator" }]}
    >
      <Calculator />
    </ToolShell>
  );
}
