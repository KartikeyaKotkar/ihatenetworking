import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "TXT Record Lookup — SPF, DKIM & Verification Strings",
  description: "Free TXT record lookup. Inspect SPF, DKIM, DMARC and domain-verification strings for any domain, live with TTL.",
};

export default function Page() {
  return (
    <ToolShell
      title="TXT Record Lookup"
      description="Inspect the TXT strings on any domain — SPF, DKIM, DMARC, verification tokens."
      example="google.com TXT → v=spf1 …"
      explanation="TXT records carry free-form text used by email authentication (SPF, DKIM, DMARC) and ownership verification (Google, Microsoft, etc.). Each string is shown separately; long DKIM keys may be split across multiple strings."
      faqs={[
        { q: "What is v=spf1?", a: "An SPF policy listing which servers may send mail for the domain." },
        { q: "Why many TXT records?", a: "One domain can hold SPF, several DKIM selectors, DMARC and verification tokens at once." },
        { q: "No TXT record?", a: "The domain has none published — common for domains that do not send mail." },
      ]}
      related={[
        { href: "/dns-lookup", label: "DNS Lookup" },
        { href: "/mx-record-lookup", label: "MX Record Lookup" },
        { href: "/ns-record-lookup", label: "NS Record Lookup" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
