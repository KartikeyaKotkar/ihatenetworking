import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "OSPF Cost Calculator",
  description: "Free OSPF cost calculator. Reference bandwidth divided by interface bandwidth, minimum cost 1.",
};

export default function Page() {
  return (
    <ToolShell
      title="OSPF Cost Calculator"
      description="Compute OSPF interface cost from bandwidth and reference bandwidth."
      example="100 Mbps / 100 Mbps ref → cost 1"
      explanation="Cost = reference bandwidth / interface bandwidth, rounded, minimum 1. Default reference is 10^8 (100 Mbps)."
      faqs={[
        { q: "Why is fast links cost 1?", a: "Any link at or above the reference bandwidth floors at the minimum cost of 1." },
        { q: "Should I raise the reference?", a: "Yes on gigabit+ networks, e.g. 1 Gbps or 10 Gbps, so fast links stay distinguishable." },
      ]}
      related={[{ href: "/eigrp-metric-calculator", label: "EIGRP Metric Calculator" }, { href: "/bandwidth-calculator", label: "Bandwidth Calculator" }, { href: "/latency-calculator", label: "Latency Calculator" }]}
    >
      <Calculator />
    </ToolShell>
  );
}
