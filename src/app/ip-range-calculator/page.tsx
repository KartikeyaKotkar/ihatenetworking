import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "IP Range Calculator — Count Addresses Between Two IPs",
  description: "Free IP range calculator. Enter start and end IPv4, get address count plus normalized range. Private, client-side.",
};

export default function Page() {
  return (
    <ToolShell
      title="IP Range Calculator"
      description="Enter a start and end IPv4 address. Get the address count plus normalized range."
      example="192.168.1.1 – 192.168.1.254 → 254 addresses"
      explanation="Count = end − start + 1 as 32-bit integers. Start must be ≤ end; both must be valid dotted-decimal IPv4."
      faqs={[
        { q: "What if start is after end?", a: "The range is invalid — swap them so start ≤ end." },
        { q: "Does this list the addresses?", a: "No, it only counts. Use the IP Range Generator to list up to 256." },
        { q: "Is my input sent anywhere?", a: "No. All math runs in your browser." },
      ]}
      related={[
        { href: "/ip-range-generator", label: "IP Range Generator" },
        { href: "/subnet-range-calculator", label: "Subnet Range Calculator" },
        { href: "/subnet-calculator", label: "Subnet Calculator" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
