import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "DNS Lookup — Check A, AAAA, MX, CNAME, TXT, NS Records",
  description: "Free online DNS lookup. Enter a hostname, pick a record type (A, AAAA, MX, CNAME, TXT, NS) and see live values plus TTL.",
};

export default function Page() {
  return (
    <ToolShell
      title="DNS Lookup"
      description="Look up live DNS records for any hostname. Pick a type and get current values plus TTL."
      example="google.com A → 142.250.x.x, TTL 300s"
      explanation="DNS maps names to records. A/AAAA give addresses, MX gives mail servers, CNAME aliases one name to another, TXT carries verification strings, NS shows delegation. TTL is how long resolvers cache the answer."
      faqs={[
        { q: "What does 'no record' (404) mean?", a: "The name exists but has no record of that type, or the name does not exist. Try another type or check spelling." },
        { q: "How fresh are results?", a: "Live — queried from DNS at request time, not a cached database." },
        { q: "TXT shows long strings?", a: "Yes. TXT records (SPF, DKIM, verification tokens) can be long; each value is shown separately." },
      ]}
      related={[
        { href: "/a-record-lookup", label: "A Record Lookup" },
        { href: "/mx-record-lookup", label: "MX Record Lookup" },
        { href: "/reverse-dns-lookup", label: "Reverse DNS Lookup" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
