import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "Broadcast Address Calculator — Last Address of Subnet",
  description: "Free broadcast address calculator. Enter IP + prefix, get broadcast instantly.",
};

export default function Page() {
  return (
    <ToolShell
      title="Broadcast Address Calculator"
      description="Find broadcast address of any subnet. Network OR inverted mask."
      example="192.168.1.130/25 → broadcast 192.168.1.255"
      explanation="Broadcast = network with all host bits set. Last address, reserved, never assigned."
      faqs={[{ q: "Usable?", a: "No. Broadcast reserved. Last usable is broadcast−1 (except /31)." }]}
      related={[{ href: "/network-address-calculator", label: "Network Calculator" }, { href: "/subnet-calculator", label: "Subnet Calculator" }, { href: "/subnet-range-calculator", label: "Range Calculator" }]}
    >
      <Calculator />
    </ToolShell>
  );
}
