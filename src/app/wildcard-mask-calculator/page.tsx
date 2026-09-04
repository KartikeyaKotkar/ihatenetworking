import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "Wildcard Mask Calculator — Inverse of Subnet Mask",
  description: "Free wildcard mask calculator. Enter prefix or mask, get Cisco wildcard instantly.",
};

export default function Page() {
  return (
    <ToolShell
      title="Wildcard Mask Calculator"
      description="Get inverse mask for ACLs. Enter prefix or subnet mask."
      example="/24 → wildcard 0.0.0.255"
      explanation="Wildcard = 255.255.255.255 − mask. Used in Cisco ACLs and OSPF network statements."
      faqs={[{ q: "Wildcard vs mask?", a: "Mask marks network bits (1s). Wildcard marks host bits (1s). Exact inverse." }]}
      related={[{ href: "/subnet-mask-to-cidr", label: "Mask to CIDR" }, { href: "/cidr-to-subnet-mask", label: "CIDR to Mask" }, { href: "/subnet-calculator", label: "Subnet Calculator" }]}
    >
      <Calculator />
    </ToolShell>
  );
}
