import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "Traceroute Online — Trace the Path to Any Host",
  description: "Free online traceroute. Trace hop-by-hop network path to any public host, up to 30 hops. Honest results from the live server.",
};

export default function Page() {
  return (
    <ToolShell
      title="Traceroute"
      description="Trace the hop-by-hop network path from this server to any public host."
      example="google.com → 12 hops, raw path output"
      explanation="Each hop line shows a router along the path and its response time. Stars (*) mean a router did not answer — common and not necessarily a problem. If this host has no traceroute binary you will get an honest 501 message with a local alternative."
      faqs={[
        { q: "Why does it take so long?", a: "Each hop is probed with timeouts (2s each). Full traces can take up to ~45 seconds." },
        { q: "'Binary unavailable' (501)?", a: "This server has neither traceroute nor tracepath installed. Run `traceroute HOST` (macOS/Linux) or `tracert HOST` (Windows) locally instead." },
        { q: "What do *** mean?", a: "That router stayed silent (filtered ICMP). The path usually continues on the next line." },
      ]}
      related={[
        { href: "/ping-tester", label: "Ping Tester" },
        { href: "/dns-lookup", label: "DNS Lookup" },
        { href: "/reverse-dns-lookup", label: "Reverse DNS Lookup" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
