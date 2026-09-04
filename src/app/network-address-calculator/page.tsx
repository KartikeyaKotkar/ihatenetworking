import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "Network Address Calculator — IP AND Mask",
  description: "Free network address calculator. Enter IP + prefix, get network address instantly.",
};

export default function Page() {
  return (
    <ToolShell
      title="Network Address Calculator"
      description="Find network address of any IP/prefix. IP bitwise-AND mask."
      example="192.168.1.130/25 → network 192.168.1.128"
      explanation="Network = IP AND mask. Host bits zeroed. First address of subnet, never assigned to a host."
      faqs={[{ q: "Network vs first usable?", a: "Network is .0-style base. First usable is network+1." }]}
      related={[{ href: "/broadcast-address-calculator", label: "Broadcast Calculator" }, { href: "/subnet-calculator", label: "Subnet Calculator" }, { href: "/subnet-range-calculator", label: "Range Calculator" }]}
    >
      <Calculator />
    </ToolShell>
  );
}
