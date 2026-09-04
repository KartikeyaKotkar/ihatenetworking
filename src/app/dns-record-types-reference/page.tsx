import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import { CopyButton } from "@/components/tool-ui";

export const metadata: Metadata = {
  title: "DNS Record Types Reference — A, CNAME, MX, TXT Chart",
  description: "Free DNS record chart: 10 common types with purpose and examples.",
};

const ROWS = [
  { type: "A", purpose: "Hostname to IPv4 address", example: "www → 93.184.216.34" },
  { type: "AAAA", purpose: "Hostname to IPv6 address", example: "www → 2606:2800:220:1::" },
  { type: "CNAME", purpose: "Alias one name to another", example: "blog → example.com" },
  { type: "MX", purpose: "Mail exchanger + priority", example: "10 mail.example.com" },
  { type: "TXT", purpose: "Free text: SPF, DKIM, verification", example: "\"v=spf1 include:_spf.x ~all\"" },
  { type: "NS", purpose: "Authoritative nameservers", example: "ns1.example.net" },
  { type: "SOA", purpose: "Zone authority: primary NS, serial", example: "ns1 admin serial 2024010101" },
  { type: "PTR", purpose: "Reverse lookup: IP to name", example: "34.216.184.93.in-addr.arpa" },
  { type: "SRV", purpose: "Service location: host + port", example: "_sip._tcp → port 5060" },
  { type: "CAA", purpose: "Which CAs may issue certs", example: "0 issue \"letsencrypt.org\"" },
];

const COPY = ROWS.map((r) => `${r.type}: ${r.purpose} (e.g. ${r.example})`).join("\n");

export default function Page() {
  return (
    <ToolShell
      title="DNS Record Types Reference"
      description="10 common DNS record types with purpose and example values."
      example="MX 10 mail.example.com → mail routes to that host."
      explanation="A/AAAA map names to IPs, CNAME aliases names, MX routes mail, TXT carries verification strings, NS/SOA delegate zones, PTR reverses IPs, SRV locates services, CAA restricts certificate issuance."
      faqs={[
        { q: "A vs CNAME?", a: "A points a name at an IP; CNAME points a name at another name. CNAME cannot sit at the zone apex." },
        { q: "Which records matter for email?", a: "MX for routing plus TXT (SPF/DKIM/DMARC) for authentication." },
      ]}
      related={[
        { href: "/dns-lookup", label: "DNS Lookup" },
        { href: "/txt-record-lookup", label: "TXT Lookup" },
        { href: "/mx-record-lookup", label: "MX Lookup" },
      ]}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="sticky top-0 bg-black/40">
            <tr>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Type</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Purpose</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Example</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.type} className="border-t border-white/5">
                <td className="px-3 py-2 font-mono text-zinc-200">{r.type}</td>
                <td className="px-3 py-2 text-xs text-gray-300">{r.purpose}</td>
                <td className="px-3 py-2 font-mono text-xs text-gray-400">{r.example}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <CopyButton text={COPY} label="Copy summary" />
      </div>
    </ToolShell>
  );
}
