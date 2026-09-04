import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import { CopyButton } from "@/components/tool-ui";

export const metadata: Metadata = {
  title: "IPv6 Prefix Reference — Special Addresses Chart",
  description: "Free IPv6 prefix chart: loopback, link-local, unique-local, multicast and more with examples.",
};

const ROWS = [
  { prefix: "::/128", use: "Unspecified", example: ":: (no address yet)" },
  { prefix: "::1/128", use: "Loopback", example: "::1 (localhost)" },
  { prefix: "2000::/3", use: "Global unicast", example: "2606:4700:4700::1111" },
  { prefix: "fe80::/10", use: "Link-local", example: "fe80::1 (same link only)" },
  { prefix: "fc00::/7", use: "Unique-local", example: "fd00::1 (private)" },
  { prefix: "ff00::/8", use: "Multicast", example: "ff02::1 (all nodes)" },
  { prefix: "2001:db8::/32", use: "Documentation", example: "2001:db8::1 (docs only)" },
  { prefix: "::ffff:0:0/96", use: "IPv4-mapped", example: "::ffff:192.0.2.1" },
];

const COPY = ROWS.map((r) => `${r.prefix} ${r.use}: ${r.example}`).join("\n");

export default function Page() {
  return (
    <ToolShell
      title="IPv6 Prefix Reference"
      description="Key IPv6 prefixes with use and example addresses."
      example="fe80::/10 → link-local, never routed off-link."
      explanation="The prefix decides scope: ::1 is loopback, fe80::/10 stays on-link, fc00::/7 is private, 2000::/3 is public, ff00::/8 is multicast, 2001:db8::/32 is docs-only."
      faqs={[
        { q: "Link-local vs unique-local?", a: "Link-local (fe80::/10) never leaves the link; unique-local (fc00::/7) is routable inside an org like IPv4 private space." },
        { q: "What is ::ffff:0:0/96?", a: "IPv4-mapped IPv6: embeds an IPv4 address, e.g. ::ffff:192.0.2.1, for dual-stack sockets." },
      ]}
      related={[
        { href: "/ipv6-validator", label: "IPv6 Validator" },
        { href: "/ipv6-compression", label: "IPv6 Compression" },
        { href: "/ipv6-subnet-calculator", label: "IPv6 Subnet Calculator" },
      ]}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="sticky top-0 bg-black/40">
            <tr>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Prefix</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Use</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Example</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.prefix} className="border-t border-white/5">
                <td className="px-3 py-2 font-mono text-xs text-zinc-200">{r.prefix}</td>
                <td className="px-3 py-2 text-xs text-gray-300">{r.use}</td>
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
