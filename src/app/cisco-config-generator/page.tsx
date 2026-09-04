import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "Cisco Config Generator",
  description: "Free Cisco IOS starter config builder. Hostname, interface IP, and default route to CLI commands.",
};

export default function Page() {
  return (
    <ToolShell
      title="Cisco Config Generator"
      description="Build a minimal Cisco IOS starter config from a hostname, one interface, and an optional default route."
      example="Router1 + Gi0/0 192.168.1.1 → hostname, interface, ip route commands"
      explanation="Fills an IOS template: hostname, interface block with IP/mask, optional default route, then end + write memory. Review before pasting into real gear."
      faqs={[
        { q: "Is this safe to paste?", a: "It is a starter template with no passwords. Always review IPs and masks before applying." },
        { q: "Real secrets?", a: "No. Never paste real passwords or keys into any web tool; configure those on-device." },
      ]}
      related={[{ href: "/cisco-acl-generator", label: "Cisco ACL Generator" }, { href: "/cisco-subnet-calculator", label: "Cisco Subnet Calculator" }, { href: "/cisco-vlan-calculator", label: "Cisco VLAN Calculator" }]}
    >
      <Calculator />
    </ToolShell>
  );
}
