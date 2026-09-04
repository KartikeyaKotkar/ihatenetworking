import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "Subnet Mask Calculator — Mask for Host Count",
  description: "Free subnet mask calculator. Enter hosts needed, get smallest fitting prefix + mask.",
};

export default function Page() {
  return (
    <ToolShell
      title="Subnet Mask Calculator"
      description="Enter hosts needed. Get smallest fitting subnet mask."
      example="50 hosts → /26, mask 255.255.255.192 (62 usable)"
      explanation="Picks smallest block with usable ≥ need. Rounds up to prefix boundary."
      faqs={[{ q: "Exact fit?", a: "Rare. subnets double in size, so most needs waste some addresses. VLSM minimizes that." }]}
      related={[{ href: "/usable-host-calculator", label: "Usable Host Calculator" }, { href: "/vlsm-calculator", label: "VLSM Calculator" }, { href: "/cidr-to-subnet-mask", label: "CIDR to Mask" }]}
    >
      <Calculator />
    </ToolShell>
  );
}
