import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "Reverse DNS Lookup — Find Hostname for Any IP",
  description: "Free reverse DNS lookup. Enter an IPv4 or IPv6 address and see its PTR hostname. No PTR record is normal for many IPs.",
};

export default function Page() {
  return (
    <ToolShell
      title="Reverse DNS Lookup"
      description="Find the hostname behind any IP address via its PTR record."
      example="8.8.8.8 → dns.google"
      explanation="Reverse DNS queries the special in-addr.arpa / ip6.arpa zones for a PTR record. Mail servers check it for spam filtering. Many IPs (especially client and cloud ranges) have no PTR — that 404 is a normal answer, not an error."
      faqs={[
        { q: "No PTR record — broken?", a: "No. Only the IP owner can set PTR, and most IPs have none. That is normal." },
        { q: "Why does reverse matter for email?", a: "Receiving servers may reject mail from IPs without matching forward/reverse DNS." },
        { q: "IPv6 supported?", a: "Yes. Enter any IPv4 or IPv6 address." },
      ]}
      related={[
        { href: "/dns-lookup", label: "DNS Lookup" },
        { href: "/ping-tester", label: "Ping Tester" },
        { href: "/a-record-lookup", label: "A Record Lookup" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
