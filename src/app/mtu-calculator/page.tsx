import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "MTU Calculator",
  description: "Free MTU calculator. Compute effective MTU after PPPoE, VLAN, GRE, VXLAN, or IPsec overhead.",
};

export default function Page() {
  return (
    <ToolShell
      title="MTU Calculator"
      description="Compute effective MTU after tunnel and encapsulation overheads."
      example="1500 − PPPoE 8 → 1492"
      explanation="Effective MTU = base MTU − sum of overhead bytes. Oversized packets fragment or drop if DF is set."
      faqs={[
        { q: "Why does PPPoE use 1492?", a: "PPPoE adds 8 bytes, so 1500 − 8 = 1492 is the largest unfragmented payload." },
        { q: "What if result is too small?", a: "Below 68 bytes is invalid for IPv4; reduce stacked tunnels or raise the base MTU (jumbo frames)." },
      ]}
      related={[{ href: "/mss-calculator", label: "MSS Calculator" }, { href: "/transfer-time-calculator", label: "Transfer Time Calculator" }, { href: "/ipv4-header-decoder", label: "IPv4 Header Decoder" }]}
    >
      <Calculator />
    </ToolShell>
  );
}
