import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "Cisco Wildcard Mask Calculator",
  description: "Free Cisco wildcard mask calculator. Enter network + prefix to get mask, wildcard, and IOS network area statement.",
};

export default function Page() {
  return (
    <ToolShell
      title="Cisco Wildcard Mask Calculator"
      description="Compute Cisco wildcard masks and the OSPF network statement from any network and prefix."
      example="192.168.1.0/24 → wildcard 0.0.0.255 → network 192.168.1.0 0.0.0.255 area 0"
      explanation="Wildcard = inverse of the subnet mask. IOS uses wildcards in network and access-list statements: /24 = mask 255.255.255.0 = wildcard 0.0.0.255."
      faqs={[
        { q: "What is a wildcard mask?", a: "The bitwise inverse of a subnet mask. 0 bits must match, 255 bits are ignored." },
        { q: "Where do I use the network statement?", a: "Under router ospf: network <net> <wildcard> area 0 advertises matching interfaces." },
      ]}
      related={[
        { href: "/wildcard-mask-calculator", label: "Wildcard Calculator" },
        { href: "/cisco-acl-generator", label: "Cisco ACL Generator" },
        { href: "/cisco-subnet-calculator", label: "Cisco Subnet Calculator" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
