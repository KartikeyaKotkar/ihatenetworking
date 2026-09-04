import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "EIGRP Metric Calculator",
  description: "Free classic EIGRP metric calculator. Bandwidth and delay terms with default K1=K3=1.",
};

export default function Page() {
  return (
    <ToolShell
      title="EIGRP Metric Calculator"
      description="Compute the classic EIGRP composite metric from minimum bandwidth and total delay."
      example="1544 Kbps + 20000 tens-usec → bandwidth and delay terms"
      explanation="Classic metric = K1×BW + K3×Delay, where BW=(10^7/minBWkbps)×256 and Delay=(tens-of-usec)×256."
      faqs={[
        { q: "Custom K values?", a: "This tool uses the default K1=K3=1 preset. Non-default K values change the weighting; K5 is unsupported here." },
        { q: "Why K5 unsupported?", a: "K5 needs live reliability data, which the classic static formula cannot provide." },
      ]}
      related={[{ href: "/ospf-cost-calculator", label: "OSPF Cost Calculator" }, { href: "/bandwidth-calculator", label: "Bandwidth Calculator" }, { href: "/latency-calculator", label: "Latency Calculator" }]}
    >
      <Calculator />
    </ToolShell>
  );
}
