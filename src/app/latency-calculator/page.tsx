import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "Latency Calculator",
  description: "Free latency calculator. Break down propagation, transmission, and base delay by medium.",
};

export default function Page() {
  return (
    <ToolShell
      title="Latency Calculator"
      description="Break down one-way latency into propagation, transmission, and medium base delay."
      example="1000 km fiber + 1500 B @ 1 Gbps → ~5 ms"
      explanation="Propagation = distance / medium speed. Transmission = packet bits / rate. Base = medium RTT floor (Wi-Fi, satellite)."
      faqs={[
        { q: "One-way or round-trip?", a: "This shows one-way propagation + transmission plus the medium base. Double propagation for a rough RTT." },
        { q: "Why is satellite so slow?", a: "GEO satellites add ~480 ms base delay from the ~72,000 km round trip to orbit and back." },
      ]}
      related={[{ href: "/ping-tester", label: "Ping Tester" }, { href: "/throughput-calculator", label: "Throughput Calculator" }, { href: "/tcp-window-size-calculator", label: "TCP Window Size Calculator" }]}
    >
      <Calculator />
    </ToolShell>
  );
}
