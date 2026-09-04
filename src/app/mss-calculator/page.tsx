import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "MSS Calculator",
  description: "Free MSS calculator. Derive TCP maximum segment size from MTU, IP version, and timestamps.",
};

export default function Page() {
  return (
    <ToolShell
      title="MSS Calculator"
      description="Derive TCP maximum segment size from MTU, IP version, and TCP timestamps."
      example="MTU 1500 IPv4 → MSS 1460"
      explanation="MSS = MTU − IP header (20 IPv4 / 40 IPv6) − TCP header (20) − timestamps (12 if enabled)."
      faqs={[
        { q: "Why 1460 for Ethernet?", a: "1500 − 20 (IPv4) − 20 (TCP) = 1460. IPv6 gives 1440; timestamps subtract 12 more." },
        { q: "MSS vs MTU?", a: "MTU is the whole IP packet limit; MSS is the TCP payload limit inside it." },
      ]}
      related={[{ href: "/mtu-calculator", label: "MTU Calculator" }, { href: "/tcp-window-size-calculator", label: "TCP Window Size Calculator" }, { href: "/tcp-header-decoder", label: "TCP Header Decoder" }]}
    >
      <Calculator />
    </ToolShell>
  );
}
