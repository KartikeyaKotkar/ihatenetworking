import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import { CopyButton } from "@/components/tool-ui";
import { allPorts } from "@/lib/ports";

export const metadata: Metadata = {
  title: "Well-Known Ports Reference — Full Service Chart",
  description: "Free port chart: every known port with protocol, service and description.",
};

export default function Page() {
  const ports = allPorts();
  const copy = ports.map((p) => `${p.port}/${p.protocol} ${p.service}: ${p.description}`).join("\n");
  return (
    <ToolShell
      title="Well-Known Ports Reference"
      description="Full port table with protocol, service, and description."
      example="443/TCP HTTPS → encrypted web traffic."
      explanation="Ports 0–1023 are well-known (IANA assigned), 1024–49151 registered, 49152–65535 ephemeral. TCP = reliable streams, UDP = fast datagrams."
      faqs={[
        { q: "TCP vs UDP ports?", a: "Same number, separate namespaces: DNS uses both 53/UDP for queries and 53/TCP for zone transfers." },
        { q: "Most-memorized ports?", a: "22 SSH, 25 SMTP, 53 DNS, 80 HTTP, 110 POP3, 143 IMAP, 443 HTTPS, 3306 MySQL, 3389 RDP." },
      ]}
      related={[
        { href: "/port-number-lookup", label: "Port Lookup" },
        { href: "/port-number-quiz", label: "Port Quiz" },
        { href: "/tcp-flags-reference", label: "TCP Flags" },
      ]}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="sticky top-0 bg-black/40">
            <tr>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Port</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Protocol</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Service</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Description</th>
            </tr>
          </thead>
          <tbody>
            {ports.map((p) => (
              <tr key={`${p.port}-${p.service}`} className="border-t border-white/5">
                <td className="px-3 py-2 font-mono text-zinc-200">{p.port}</td>
                <td className="px-3 py-2 font-mono text-xs text-gray-300">{p.protocol}</td>
                <td className="px-3 py-2 text-xs font-medium text-gray-100">{p.service}</td>
                <td className="px-3 py-2 text-xs text-gray-400">{p.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <CopyButton text={copy} label="Copy summary" />
      </div>
    </ToolShell>
  );
}
