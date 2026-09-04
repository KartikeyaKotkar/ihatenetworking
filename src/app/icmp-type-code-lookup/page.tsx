import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "ICMP Type/Code Lookup — Reference Table Free",
  description: "Free ICMP type/code lookup. Search by number or name: echo, unreachable, time exceeded, and more.",
};

export default function Page() {
  return (
    <ToolShell
      title="ICMP Type/Code Lookup"
      description="Look up any ICMP type by number or name and see its full code table with meanings."
      example="8 → Echo Request (ping); 3/3 → Port unreachable"
      explanation="ICMP types name the message (8 = ping request, 0 = reply); codes add detail (type 3 code 3 = port unreachable). Ping uses 8/0, traceroute relies on type 11 Time Exceeded."
      faqs={[
        { q: "Which types matter most?", a: "0/8 echo (ping), 3 unreachable, 11 time exceeded (traceroute), 5 redirect." },
        { q: "Can I search by name?", a: "Yes — try 'echo', 'unreachable', or 'time' as well as numbers like 8." },
      ]}
      related={[
        { href: "/ping-tester", label: "Ping Tester" },
        { href: "/traceroute", label: "Traceroute" },
        { href: "/ipv4-header-decoder", label: "IPv4 Decoder" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
