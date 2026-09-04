import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "MX Record Lookup — Find Mail Servers for Any Domain",
  description: "Free MX record lookup. See which mail servers handle email for a domain, with priority values. Lowest priority wins.",
};

export default function Page() {
  return (
    <ToolShell
      title="MX Record Lookup"
      description="Find the mail servers responsible for receiving email for any domain."
      example="google.com MX → 10 smtp.google.com (lowest priority first)"
      explanation="MX records list mail exchangers with a priority number. Senders try the lowest number first and fall through to higher numbers if it is unreachable. No MX usually means the domain does not receive mail."
      faqs={[
        { q: "Which server gets mail first?", a: "The one with the lowest priority number." },
        { q: "No MX record?", a: "The domain likely does not accept email, or mail falls back to its A record per RFC 5321." },
        { q: "Why several MX records?", a: "Redundancy — backup servers take over if the primary is down." },
      ]}
      related={[
        { href: "/dns-lookup", label: "DNS Lookup" },
        { href: "/txt-record-lookup", label: "TXT Record Lookup" },
        { href: "/a-record-lookup", label: "A Record Lookup" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
