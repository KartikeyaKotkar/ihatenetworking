import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "Cisco IP Class Calculator",
  description: "Free Cisco IP class checker. Enter any IPv4 address to get class A-E, default mask, and classful range.",
};

export default function Page() {
  return (
    <ToolShell
      title="Cisco IP Calculator"
      description="Look up the classful class and default subnet mask for any IPv4 address."
      example="10.1.2.3 → Class A, default mask 255.0.0.0"
      explanation="Class is decided by the first octet: A 0-127, B 128-191, C 192-223, D 224-239, E 240-255. Classes D and E have no default mask."
      faqs={[
        { q: "What is a classful default mask?", a: "The mask implied by class alone: A=/8, B=/16, C=/24. Modern routing uses CIDR instead." },
        { q: "Why N/A for Class D/E?", a: "Class D is multicast and Class E is experimental, so neither has a classful host mask." },
      ]}
      related={[{ href: "/cisco-subnet-calculator", label: "Cisco Subnet Calculator" }, { href: "/ipv4-validator", label: "IPv4 Validator" }, { href: "/private-ip-checker", label: "Private IP Checker" }]}
    >
      <Calculator />
    </ToolShell>
  );
}
