import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "Ethernet Frame Decoder — Parse Frame Hex Free",
  description: "Free Ethernet frame decoder. Paste 14+ bytes of hex and decode MACs, EtherType, and payload size.",
};

export default function Page() {
  return (
    <ToolShell
      title="Ethernet Frame Decoder"
      description="Paste a raw Ethernet frame in hex and decode destination/source MACs, EtherType, and payload size."
      example="ffffffffffff001b44113ab70800 → broadcast, EtherType IPv4"
      explanation="Bytes 0–5 are the destination MAC, 6–11 the source MAC, 12–13 the EtherType (0x0800 = IPv4, 0x0806 = ARP, 0x86DD = IPv6). Anything after byte 14 is payload."
      faqs={[
        { q: "How many bytes minimum?", a: "14 bytes (28 hex chars): 6 dst MAC + 6 src MAC + 2 EtherType." },
        { q: "What is EtherType 0x8100?", a: "An 802.1Q VLAN tag — 4 extra bytes precede the real EtherType." },
      ]}
      related={[
        { href: "/mac-address-formatter", label: "MAC Formatter" },
        { href: "/ipv4-header-decoder", label: "IPv4 Decoder" },
        { href: "/mac-address-validator", label: "MAC Validator" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
