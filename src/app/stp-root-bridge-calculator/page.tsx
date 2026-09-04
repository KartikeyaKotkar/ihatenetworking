import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "STP Root Bridge Calculator",
  description: "Free STP root bridge election checker. Compare two bridges by priority, VLAN, and MAC.",
};

export default function Page() {
  return (
    <ToolShell
      title="STP Root Bridge Calculator"
      description="Compare two bridges to see which wins the STP root election."
      example="32768 vs 28672 → Bridge B wins on lower priority"
      explanation="Election order: lowest bridge ID wins. Bridge ID = effective priority (config priority + VLAN) first, then lowest MAC on ties."
      faqs={[
        { q: "Valid priorities?", a: "Multiples of 4096 from 0 to 61440, e.g. 0, 4096, 24576, 32768." },
        { q: "What breaks ties?", a: "If effective priorities match, the bridge with the lowest MAC address wins." },
      ]}
      related={[{ href: "/cisco-vlan-calculator", label: "Cisco VLAN Calculator" }, { href: "/mac-address-validator", label: "MAC Address Validator" }, { href: "/cisco-config-generator", label: "Cisco Config Generator" }]}
    >
      <Calculator />
    </ToolShell>
  );
}
