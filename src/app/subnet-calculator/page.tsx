import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "IPv4 Subnet Calculator — Network, Broadcast, Host Range",
  description: "Free IPv4 subnet calculator. Enter IP + CIDR prefix, get network, broadcast, mask, wildcard, usable range instantly. Private, client-side.",
};

export default function Page() {
  return (
    <ToolShell
      title="IPv4 Subnet Calculator"
      description="Enter any IPv4 address plus CIDR prefix. Instant network, broadcast, and host range."
      example="192.168.1.10/24 → network 192.168.1.0, broadcast 192.168.1.255, usable 192.168.1.1 – 192.168.1.254"
      explanation="Network = IP AND mask. Broadcast = network + host bits set. First/last usable exclude those two, except /31 (both usable, RFC 3021) and /32 (single host)."
      faqs={[
        { q: "How many usable hosts in /24?", a: "254. Total 256 minus network and broadcast." },
        { q: "What about /31 and /32?", a: "/31 gives 2 usable (point-to-point, no broadcast reserved). /32 is one host address." },
        { q: "Is my input sent anywhere?", a: "No. All math runs in your browser." },
      ]}
      related={[
        { href: "/cidr-calculator", label: "CIDR Calculator" },
        { href: "/wildcard-mask-calculator", label: "Wildcard Mask Calculator" },
        { href: "/subnet-splitter", label: "Subnet Splitter" },
        { href: "/vlsm-calculator", label: "VLSM Calculator" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
