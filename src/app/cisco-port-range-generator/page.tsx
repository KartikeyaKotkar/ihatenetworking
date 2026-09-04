import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "Cisco Port Range Generator",
  description: "Free Cisco interface range generator. Build interface range GigabitEthernet commands for bulk port config.",
};

export default function Page() {
  return (
    <ToolShell
      title="Cisco Port Range Generator"
      description="Generate the IOS interface range command for configuring many switchports at once."
      example="interface range GigabitEthernet0/1 - 24"
      explanation="One interface range command applies the following subcommands to every port in the span. Keep spans at 200 ports or fewer so configs stay readable."
      faqs={[
        { q: "When is interface range useful?", a: "Applying the same switchport mode, VLAN, or description to a block of ports at once." },
        { q: "What are the limits?", a: "Start must be ≤ end and the span (end − start) at most 200." },
      ]}
      related={[
        { href: "/cisco-vlan-calculator", label: "Cisco VLAN Calculator" },
        { href: "/cisco-config-generator", label: "Cisco Config Generator" },
        { href: "/port-number-lookup", label: "Port Number Lookup" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
