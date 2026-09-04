import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "Transfer Time Calculator",
  description: "Free transfer time calculator. Estimate how long a file takes at a given rate with overhead.",
};

export default function Page() {
  return (
    <ToolShell
      title="Transfer Time Calculator"
      description="Estimate file transfer duration from file size, link rate, and protocol overhead."
      example="1 GB @ 100 Mbps + 5% → ~1 min 24 s"
      explanation="Time = size × (1 + overhead) / rate. Real transfers vary with congestion, RTT, and window limits."
      faqs={[
        { q: "Bits vs bytes matter?", a: "Yes — 1 GB is 8× larger than 1 Gb. Mixing them up is the most common estimate error." },
        { q: "What overhead should I use?", a: "5% is typical for TCP/IP on clean links; use 10%+ for VPNs or lossy paths." },
      ]}
      related={[{ href: "/bandwidth-calculator", label: "Bandwidth Calculator" }, { href: "/throughput-calculator", label: "Throughput Calculator" }, { href: "/mtu-calculator", label: "MTU Calculator" }]}
    >
      <Calculator />
    </ToolShell>
  );
}
