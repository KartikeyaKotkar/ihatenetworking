import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "Cisco VLAN Calculator",
  description: "Free Cisco VLAN checker. Validate a VLAN ID 1-4094, spot reserved ranges, and get vlan/name/exit config.",
};

export default function Page() {
  return (
    <ToolShell
      title="Cisco VLAN Calculator"
      description="Validate a VLAN ID and generate the IOS vlan / name / exit snippet."
      example="vlan 10 → name VLAN10 → exit"
      explanation="VLANs 1-1005 are normal range; 1002-1005 are reserved for Token Ring/FDDI. Extended VLANs 1006-4094 need VTP transparent mode."
      faqs={[
        { q: "Why is VLAN 1003 rejected?", a: "VLANs 1002-1005 are reserved for Token Ring and FDDI and cannot carry Ethernet." },
        { q: "What about VLANs above 1005?", a: "Extended-range VLANs (1006-4094) require VTP transparent mode on the switch." },
      ]}
      related={[
        { href: "/cisco-config-generator", label: "Cisco Config Generator" },
        { href: "/cisco-port-range-generator", label: "Cisco Port Range Generator" },
        { href: "/subnet-splitter", label: "Subnet Splitter" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
