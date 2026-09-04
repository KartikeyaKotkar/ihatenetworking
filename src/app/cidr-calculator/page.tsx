import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "CIDR Calculator — Decode Any IP/Prefix",
  description: "Free CIDR calculator. Paste 192.168.1.10/24 style input, get mask, network, broadcast, usable range.",
};

export default function Page() {
  return (
    <ToolShell
      title="CIDR Calculator"
      description="Paste CIDR notation. Instant decode to mask, network, and host range."
      example="10.0.0.5/16 → network 10.0.0.0/16, mask 255.255.0.0, 65,534 usable hosts"
      explanation="Prefix length = count of network bits. /16 leaves 16 host bits = 65,536 total addresses minus 2."
      faqs={[
        { q: "CIDR vs subnet mask?", a: "Same thing, two notations. /24 = 255.255.255.0." },
        { q: "Does host IP matter?", a: "No. Host bits get masked off to find the network." },
      ]}
      related={[
        { href: "/subnet-calculator", label: "Subnet Calculator" },
        { href: "/cidr-to-subnet-mask", label: "CIDR to Subnet Mask" },
        { href: "/subnet-mask-to-cidr", label: "Subnet Mask to CIDR" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
