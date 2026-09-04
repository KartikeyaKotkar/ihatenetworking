import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "Throughput Calculator",
  description: "Free throughput calculator. Measure goodput from bytes transferred and duration.",
};

export default function Page() {
  return (
    <ToolShell
      title="Throughput Calculator"
      description="Measure actual goodput from bytes transferred over a duration."
      example="100 MB in 8 s → 100 Mbps"
      explanation="Goodput = bits delivered / seconds. Compare against link rate to find utilization and headroom."
      faqs={[
        { q: "Throughput vs bandwidth?", a: "Bandwidth is capacity; throughput is measured delivered rate, always ≤ capacity." },
        { q: "Why lower than my plan?", a: "Overhead, congestion, RTT, and window limits all reduce goodput below the raw link rate." },
      ]}
      related={[{ href: "/bandwidth-calculator", label: "Bandwidth Calculator" }, { href: "/transfer-time-calculator", label: "Transfer Time Calculator" }, { href: "/latency-calculator", label: "Latency Calculator" }]}
    >
      <Calculator />
    </ToolShell>
  );
}
