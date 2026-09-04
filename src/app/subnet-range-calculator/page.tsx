import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "Subnet Range Calculator — First to Last Usable IP",
  description: "Free subnet range calculator. Get first usable, last usable, network, broadcast from IP + prefix.",
};

export default function Page() {
  return (
    <ToolShell
      title="Subnet Range Calculator"
      description="Find usable IP range of any subnet. Network and broadcast excluded, except /31 and /32."
      example="192.168.1.50/24 → usable 192.168.1.1 – 192.168.1.254"
      explanation="Range = network+1 through broadcast−1. /31 both addresses usable, /32 range is the single address."
      faqs={[{ q: "Usable vs total?", a: "Total includes network + broadcast. Usable excludes them (minus 2), except /31 and /32." }]}
      related={[{ href: "/subnet-calculator", label: "Subnet Calculator" }, { href: "/broadcast-address-calculator", label: "Broadcast Calculator" }, { href: "/network-address-calculator", label: "Network Calculator" }]}
    >
      <Calculator />
    </ToolShell>
  );
}
