import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import { CopyButton } from "@/components/tool-ui";

export const metadata: Metadata = {
  title: "IPv4 Address Classes Reference — A to E + Private Ranges",
  description: "Free IPv4 class chart: A–E ranges, default masks, host counts, plus private and special addresses.",
};

const ROWS = [
  { cls: "A", range: "1–126", mask: "255.0.0.0 (/8)", networks: "126", hosts: "16,777,214", use: "Huge networks, legacy unicast" },
  { cls: "B", range: "128–191", mask: "255.255.0.0 (/16)", networks: "16,384", hosts: "65,534", use: "Medium networks, legacy unicast" },
  { cls: "C", range: "192–223", mask: "255.255.255.0 (/24)", networks: "2,097,152", hosts: "254", use: "Small LANs, legacy unicast" },
  { cls: "D", range: "224–239", mask: "N/A (multicast)", networks: "—", hosts: "—", use: "Multicast groups, no host assignment" },
  { cls: "E", range: "240–255", mask: "N/A (reserved)", networks: "—", hosts: "—", use: "Experimental, reserved" },
];

const COPY = [
  ...ROWS.map((r) => `Class ${r.cls}: ${r.range} mask ${r.mask} nets ${r.networks} hosts ${r.hosts} — ${r.use}`),
  "Private (RFC1918): 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16",
  "Special: 127.0.0.0/8 loopback, 169.254.0.0/16 APIPA, 224.0.0.0/4 multicast",
].join("\n");

export default function Page() {
  return (
    <ToolShell
      title="IPv4 Address Classes Reference"
      description="Classes A–E with ranges, default masks, network/host counts, plus private and special ranges."
      example="Class C 192.168.1.0/24 → 254 usable hosts."
      explanation="Class is set by the first octet. A/B/C are unicast with default /8, /16, /24 masks. D is multicast, E is reserved. 127.x loopback and 0 are excluded from Class A."
      faqs={[
        { q: "What are the private ranges?", a: "RFC1918: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16. Not routable on the public internet." },
        { q: "What is APIPA?", a: "169.254.0.0/16 self-assigned addresses when DHCP fails." },
      ]}
      related={[
        { href: "/cisco-ip-calculator", label: "Cisco IP Calculator" },
        { href: "/private-ip-checker", label: "Private IP Checker" },
        { href: "/subnet-calculator", label: "Subnet Calculator" },
      ]}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="sticky top-0 bg-black/40">
            <tr>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Class</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">First octet</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Default mask</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Networks</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Hosts/net</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Use</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.cls} className="border-t border-white/5">
                <td className="px-3 py-2 font-mono text-zinc-200">{r.cls}</td>
                <td className="px-3 py-2 font-mono text-xs text-gray-300">{r.range}</td>
                <td className="px-3 py-2 font-mono text-xs text-gray-300">{r.mask}</td>
                <td className="px-3 py-2 font-mono text-xs text-gray-300">{r.networks}</td>
                <td className="px-3 py-2 font-mono text-xs text-gray-300">{r.hosts}</td>
                <td className="px-3 py-2 text-xs text-gray-400">{r.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 space-y-1 text-xs text-gray-400">
        <p><span className="font-mono text-gray-300">Private (RFC1918):</span> 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16</p>
        <p><span className="font-mono text-gray-300">Special:</span> 127.0.0.0/8 loopback · 169.254.0.0/16 APIPA · 224.0.0.0/4 multicast</p>
      </div>
      <div className="mt-4">
        <CopyButton text={COPY} label="Copy summary" />
      </div>
    </ToolShell>
  );
}
