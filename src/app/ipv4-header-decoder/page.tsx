import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "IPv4 Header Decoder — Parse Header Hex Free",
  description: "Free IPv4 header decoder. Paste 20+ bytes of hex and decode version, addresses, TTL, protocol, and flags.",
};

export default function Page() {
  return (
    <ToolShell
      title="IPv4 Header Decoder"
      description="Paste raw IPv4 header hex and decode every field: addresses, TTL, protocol, flags, and more."
      example="4500003c... → version 4, src 10.0.0.1, dst 10.0.0.2, proto TCP"
      explanation="The first byte holds version (must be 4) and header length. Bytes 12–19 are source and destination addresses; byte 8 is TTL; byte 9 is the protocol number."
      faqs={[
        { q: "How many bytes do I need?", a: "At least 20 bytes (40 hex chars). Longer headers include IP options." },
        { q: "Why 'version != 4' error?", a: "The top nibble of byte 0 must be 4 — other values are IPv6 or garbage." },
      ]}
      related={[
        { href: "/tcp-header-decoder", label: "TCP Decoder" },
        { href: "/udp-header-decoder", label: "UDP Decoder" },
        { href: "/ethernet-frame-decoder", label: "Ethernet Decoder" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
