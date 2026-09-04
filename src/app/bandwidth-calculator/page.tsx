import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "Bandwidth Calculator",
  description: "Free bandwidth calculator. Estimate required link capacity from users, per-user rate, and overhead.",
};

export default function Page() {
  return (
    <ToolShell
      title="Bandwidth Calculator"
      description="Estimate required link capacity from concurrent users, per-user rate, and protocol overhead."
      example="100 users × 5 Mbps + 10% overhead → 550 Mbps"
      explanation="Required capacity = users × per-user rate × (1 + overhead). Add headroom for bursts and retransmits."
      faqs={[
        { q: "What overhead should I use?", a: "10% is a common planning value for headers and retransmits; use 20-30% for video or lossy links." },
        { q: "Is this bits or bytes?", a: "Rates are in bits per second (Mbps/Gbps). File sizes use bytes (MB/GB)." },
      ]}
      related={[{ href: "/throughput-calculator", label: "Throughput Calculator" }, { href: "/transfer-time-calculator", label: "Transfer Time Calculator" }, { href: "/tcp-window-size-calculator", label: "TCP Window Size Calculator" }]}
    >
      <Calculator />
    </ToolShell>
  );
}
