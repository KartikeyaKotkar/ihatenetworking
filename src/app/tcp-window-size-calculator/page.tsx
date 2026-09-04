import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "TCP Window Size Calculator",
  description: "Free TCP window calculator. Size the window from bandwidth-delay product with scaling guidance.",
};

export default function Page() {
  return (
    <ToolShell
      title="TCP Window Size Calculator"
      description="Size the TCP receive window from link rate and RTT via the bandwidth-delay product."
      example="100 Mbps × 50 ms → ~625 KiB window"
      explanation="Window (bytes) = rate × RTT / 8. Windows above 65535 need RFC 7323 window scaling."
      faqs={[
        { q: "What is BDP?", a: "Bandwidth-delay product: the bytes that must be in flight to keep the link fully utilized." },
        { q: "When is scaling needed?", a: "Whenever the BDP exceeds 65535 bytes — true for most high-speed or high-RTT paths." },
      ]}
      related={[{ href: "/latency-calculator", label: "Latency Calculator" }, { href: "/throughput-calculator", label: "Throughput Calculator" }, { href: "/mss-calculator", label: "MSS Calculator" }]}
    >
      <Calculator />
    </ToolShell>
  );
}
