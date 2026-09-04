import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import { CopyButton } from "@/components/tool-ui";

export const metadata: Metadata = {
  title: "Network Protocol Reference — Ports & Purpose Chart",
  description: "Free protocol chart: 18 key protocols with transport, ports and purpose.",
};

const ROWS = [
  { proto: "HTTPS", transport: "TCP 443", purpose: "Encrypted web traffic" },
  { proto: "HTTP", transport: "TCP 80", purpose: "Unencrypted web traffic" },
  { proto: "FTP", transport: "TCP 20, 21", purpose: "File transfer, control + data" },
  { proto: "SSH", transport: "TCP 22", purpose: "Secure remote login, tunnels" },
  { proto: "Telnet", transport: "TCP 23", purpose: "Legacy unencrypted remote login" },
  { proto: "SMTP", transport: "TCP 25, 587", purpose: "Sending and relaying email" },
  { proto: "DNS", transport: "UDP/TCP 53", purpose: "Name resolution" },
  { proto: "DHCP", transport: "UDP 67, 68", purpose: "Automatic IP assignment" },
  { proto: "TFTP", transport: "UDP 69", purpose: "Simple file transfer, PXE boot" },
  { proto: "SNMP", transport: "UDP 161, 162", purpose: "Device monitoring and traps" },
  { proto: "LDAP", transport: "TCP 389", purpose: "Directory lookups, auth" },
  { proto: "SMB", transport: "TCP 445", purpose: "Windows file/printer sharing" },
  { proto: "NFS", transport: "TCP 2049", purpose: "Unix file sharing" },
  { proto: "RDP", transport: "TCP 3389", purpose: "Windows remote desktop" },
  { proto: "SIP", transport: "TCP/UDP 5060", purpose: "VoIP call signaling" },
  { proto: "BGP", transport: "TCP 179", purpose: "Inter-domain routing" },
  { proto: "OSPF", transport: "IP 89", purpose: "Interior link-state routing" },
  { proto: "ICMP", transport: "IP 1", purpose: "Ping, errors, diagnostics" },
  { proto: "ARP", transport: "Link layer", purpose: "IP-to-MAC resolution on LAN" },
];

const COPY = ROWS.map((r) => `${r.proto} (${r.transport}): ${r.purpose}`).join("\n");

export default function Page() {
  return (
    <ToolShell
      title="Network Protocol Reference"
      description="Key network protocols with transport, ports, and purpose."
      example="DNS → UDP/TCP 53 → name resolution."
      explanation="Transport shows what carries the protocol: TCP for reliability, UDP for speed, IP numbers for network-layer protocols, link layer for ARP."
      faqs={[
        { q: "Why does DNS use both TCP and UDP?", a: "UDP 53 for fast queries, TCP 53 for large answers and zone transfers." },
        { q: "BGP vs OSPF?", a: "BGP routes between autonomous systems on the internet; OSPF routes inside one network." },
      ]}
      related={[
        { href: "/osi-model-reference", label: "OSI Model" },
        { href: "/port-number-lookup", label: "Port Lookup" },
        { href: "/tcp-ip-model-reference", label: "TCP/IP Model" },
      ]}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="sticky top-0 bg-black/40">
            <tr>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Protocol</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Transport + Port</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Purpose</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.proto} className="border-t border-white/5">
                <td className="px-3 py-2 font-mono text-zinc-200">{r.proto}</td>
                <td className="px-3 py-2 font-mono text-xs text-gray-300">{r.transport}</td>
                <td className="px-3 py-2 text-xs text-gray-400">{r.purpose}</td>
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
