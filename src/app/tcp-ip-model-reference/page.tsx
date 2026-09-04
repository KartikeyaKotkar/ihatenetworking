import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import { CopyButton } from "@/components/tool-ui";

export const metadata: Metadata = {
  title: "TCP/IP Model Reference — 4 Layers + OSI Mapping",
  description: "Free TCP/IP model chart: 4 layers with OSI mapping and example protocols.",
};

const ROWS = [
  { layer: "Application", osi: "OSI 5–7", protocols: "HTTP, DNS, SMTP, FTP, SSH, DHCP", role: "User services and application data." },
  { layer: "Transport", osi: "OSI 4", protocols: "TCP, UDP", role: "Ports, segments, reliability vs speed." },
  { layer: "Internet", osi: "OSI 3", protocols: "IP, ICMP, IGMP", role: "Logical addressing and routing." },
  { layer: "Network Access (Link)", osi: "OSI 1–2", protocols: "Ethernet, ARP, Wi-Fi", role: "Physical framing and LAN delivery." },
];

const COPY = ROWS.map((r) => `${r.layer} (${r.osi}): ${r.protocols} — ${r.role}`).join("\n");

export default function Page() {
  return (
    <ToolShell
      title="TCP/IP Model Reference"
      description="The 4 TCP/IP layers with OSI mapping and example protocols."
      example="Transport ≈ OSI L4 → TCP/UDP ports and segments."
      explanation="TCP/IP merges OSI's top three layers into Application and bottom two into Network Access. Internet and Transport map 1:1 to OSI L3/L4."
      faqs={[
        { q: "How does TCP/IP map to OSI?", a: "Application covers OSI 5–7, Transport is OSI 4, Internet is OSI 3, Network Access covers OSI 1–2." },
        { q: "Which layer is IP on?", a: "Internet layer (OSI Layer 3). TCP and UDP sit one up, at Transport." },
      ]}
      related={[
        { href: "/osi-model-reference", label: "OSI Model" },
        { href: "/network-protocol-reference", label: "Protocol Reference" },
        { href: "/ipv4-header-decoder", label: "IPv4 Header Decoder" },
      ]}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="sticky top-0 bg-black/40">
            <tr>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">TCP/IP Layer</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">OSI Mapping</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Example Protocols</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Role</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.layer} className="border-t border-white/5">
                <td className="px-3 py-2 font-medium text-gray-100">{r.layer}</td>
                <td className="px-3 py-2 font-mono text-xs text-zinc-200">{r.osi}</td>
                <td className="px-3 py-2 font-mono text-xs text-gray-300">{r.protocols}</td>
                <td className="px-3 py-2 text-xs text-gray-400">{r.role}</td>
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
