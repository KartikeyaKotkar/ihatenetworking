import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "VLSM Calculator — Variable Length Subnet Allocation",
  description: "Free VLSM calculator. Allocate subnets by host count inside a base network. Largest-first, boundary aligned.",
};

export default function Page() {
  return (
    <ToolShell
      title="VLSM Calculator"
      description="Enter base network plus host counts. Get smallest fitting subnets, largest first."
      example="192.168.1.0/24 + [100, 50, 10] → 192.168.1.0/25, 192.168.1.128/26, 192.168.1.192/28"
      explanation="Each need gets smallest prefix fitting it, aligned to its size boundary, packed largest-first to minimize waste."
      faqs={[
        { q: "Why sort largest first?", a: "Packing big blocks first avoids fragmentation and fits more hosts." },
        { q: "What if it does not fit?", a: "Calculator errors. Drop a requirement or start from a shorter prefix (bigger base)." },
      ]}
      related={[
        { href: "/subnet-calculator", label: "Subnet Calculator" },
        { href: "/subnet-splitter", label: "Subnet Splitter" },
        { href: "/usable-host-calculator", label: "Usable Host Calculator" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
