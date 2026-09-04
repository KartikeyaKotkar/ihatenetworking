import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "Cisco Subnet Calculator",
  description: "Free Cisco subnet calculator. Enter IP + prefix for mask, wildcard, and IOS ip address + network commands.",
};

export default function Page() {
  return (
    <ToolShell
      title="Cisco Subnet Calculator"
      description="Subnet any IP and get IOS-ready ip address and OSPF network commands."
      example="192.168.1.10/24 → ip address 192.168.1.1 255.255.255.0"
      explanation="The first usable address fills the IOS ip address interface command; the network address plus wildcard fills the OSPF network statement."
      faqs={[
        { q: "Which address goes in ip address?", a: "A usable host address (usually the first usable) plus the subnet mask." },
        { q: "What goes in the network statement?", a: "The network address plus the wildcard mask, e.g. network 192.168.1.0 0.0.0.255 area 0." },
      ]}
      related={[
        { href: "/subnet-calculator", label: "Subnet Calculator" },
        { href: "/cisco-wildcard-mask-calculator", label: "Cisco Wildcard Calculator" },
        { href: "/cisco-ip-calculator", label: "Cisco IP Calculator" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
