import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "Ping Tester — Check Host Latency & Packet Loss Online",
  description: "Free online ping tester. Ping any public hostname or IP and see packet loss plus min/avg/max latency. ICMP with honest TCP fallback.",
};

export default function Page() {
  return (
    <ToolShell
      title="Ping Tester"
      description="Ping any public host and measure packet loss plus min/avg/max round-trip latency."
      example="google.com → 0% loss, avg 12 ms"
      explanation="Uses real ICMP ping when the server allows it. Many sandboxed hosts block ICMP, so the API honestly falls back to TCP-connect latency on ports 443/80 — labelled 'TCP fallback' in the result badge. Loss and timings are shown either way."
      faqs={[
        { q: "What is TCP fallback?", a: "When ICMP is unavailable, latency is measured by opening TCP connections to ports 443/80. It is honest latency data, just not true ICMP." },
        { q: "Why 100% loss?", a: "The host is down, firewalled, or ignoring ping. Try the HTTP header checker to see if its web port answers." },
        { q: "Blocked target?", a: "Private and internal addresses are refused (403). Only public hosts can be pinged." },
      ]}
      related={[
        { href: "/traceroute", label: "Traceroute" },
        { href: "/dns-lookup", label: "DNS Lookup" },
        { href: "/http-header-checker", label: "HTTP Header Checker" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
