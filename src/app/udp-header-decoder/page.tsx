import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "UDP Header Decoder — Parse UDP Hex Free",
  description: "Free UDP header decoder. Paste 8 bytes of hex and decode source/destination ports, length, and checksum.",
};

export default function Page() {
  return (
    <ToolShell
      title="UDP Header Decoder"
      description="Paste a raw 8-byte UDP header in hex and decode ports, length, and checksum."
      example="0035c3b8001c2a9c → src 53 (DNS), dst 50040, len 28"
      explanation="UDP headers are exactly 8 bytes: source port, destination port, total length, and checksum. No flags or sequence numbers — that simplicity is why DNS and streaming use it."
      faqs={[
        { q: "How many bytes do I need?", a: "Exactly 8 bytes (16 hex chars) for the header; extra bytes are payload." },
        { q: "Why is port 53 special?", a: "Port 53 is DNS — most short UDP datagrams to/from 53 are DNS queries." },
      ]}
      related={[
        { href: "/tcp-header-decoder", label: "TCP Decoder" },
        { href: "/ipv4-header-decoder", label: "IPv4 Decoder" },
        { href: "/dns-lookup", label: "DNS Lookup" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
