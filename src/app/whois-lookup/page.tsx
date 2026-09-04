import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "WHOIS Lookup — Domain & IP Registration Records",
  description: "Free WHOIS lookup. Enter any domain or IP to see registrar, creation date, name servers, and raw registration records.",
};

export default function Page() {
  return (
    <ToolShell
      title="WHOIS Lookup"
      description="Look up domain and IP registration records — registrar, dates, name servers, and raw WHOIS text."
      example="example.com → Internet Assigned Numbers Authority, created 1995-08-14"
      explanation="WHOIS queries the responsible registry (via referral-following: thin registries redirect to the registrar's server) and shows which server answered plus the full raw record."
      faqs={[
        { q: "Why is contact data hidden?", a: "GDPR and privacy-redaction policies hide most registrant contact details. What remains is registrar, dates, status, and name servers." },
        { q: "What is referral follow?", a: "Thin registries (like .com) return a referral to the registrar's WHOIS server; this tool follows it automatically to show the full record." },
        { q: "WHOIS vs RDAP?", a: "RDAP is the structured JSON successor to WHOIS. WHOIS remains useful because every TLD and RIR still serves it as plain text." },
      ]}
      related={[
        { href: "/dns-lookup", label: "DNS Lookup" },
        { href: "/asn-lookup", label: "ASN Lookup" },
        { href: "/ns-record-lookup", label: "NS Record Lookup" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
