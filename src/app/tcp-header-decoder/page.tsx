import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "TCP Header Decoder — Parse TCP Hex Free",
  description: "Free TCP header decoder. Paste 20+ bytes of hex and decode ports, sequence numbers, flags, and window.",
};

export default function Page() {
  return (
    <ToolShell
      title="TCP Header Decoder"
      description="Paste raw TCP header hex and decode ports, sequence/ack numbers, flags, and window size."
      example="3039c3b8... → src 12345, dst 50040, flags SYN"
      explanation="Bytes 0–3 are source/destination ports, 4–11 are sequence and ack numbers, byte 13 holds the classic flags (SYN, ACK, FIN, RST, PSH...), bytes 14–15 are the window size."
      faqs={[
        { q: "How many bytes do I need?", a: "At least 20 bytes (40 hex chars). Longer headers include TCP options." },
        { q: "What do the flags mean?", a: "SYN opens, ACK acknowledges, FIN closes, RST aborts, PSH pushes data now." },
      ]}
      related={[
        { href: "/ipv4-header-decoder", label: "IPv4 Decoder" },
        { href: "/udp-header-decoder", label: "UDP Decoder" },
        { href: "/port-number-lookup", label: "Port Lookup" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
