import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import { CopyButton } from "@/components/tool-ui";

export const metadata: Metadata = {
  title: "OSI Model Reference — 7 Layers Explained",
  description: "Free OSI model chart: all 7 layers with PDU, devices, protocols and role, ordered 7 to 1.",
};

const ROWS = [
  { n: 7, layer: "Application", pdu: "Data", examples: "HTTP, DNS, SMTP, FTP", role: "User-facing services and APIs." },
  { n: 6, layer: "Presentation", pdu: "Data", examples: "TLS/SSL, JPEG, ASCII", role: "Encryption, compression, data format." },
  { n: 5, layer: "Session", pdu: "Data", examples: "NetBIOS, RPC, SIP", role: "Opens, manages, and closes sessions." },
  { n: 4, layer: "Transport", pdu: "Segment", examples: "TCP, UDP", role: "End-to-end delivery and ports." },
  { n: 3, layer: "Network", pdu: "Packet", examples: "IP, ICMP · routers", role: "Logical addressing and routing." },
  { n: 2, layer: "Data Link", pdu: "Frame", examples: "Ethernet, ARP · switches", role: "Framing, MAC addressing, error check." },
  { n: 1, layer: "Physical", pdu: "Bits", examples: "Cables, hubs, repeaters", role: "Raw bit transmission over media." },
];

const COPY = ROWS.map((r) => `L${r.n} ${r.layer} (${r.pdu}): ${r.examples} — ${r.role}`).join("\n");

export default function Page() {
  return (
    <ToolShell
      title="OSI Model Reference"
      description="All 7 OSI layers with PDU, device/protocol examples, and role."
      example="L4 Transport → Segment → TCP/UDP → end-to-end delivery."
      explanation="Read top-down 7→1: upper layers serve apps, lower layers move bits. PDU names: Data, Segment, Packet, Frame, Bits."
      faqs={[
        { q: "What is the PDU at each layer?", a: "Layers 7–5: Data, Layer 4: Segment, Layer 3: Packet, Layer 2: Frame, Layer 1: Bits." },
        { q: "Where do routers and switches sit?", a: "Routers work at Layer 3 (Network); switches at Layer 2 (Data Link); hubs at Layer 1." },
      ]}
      related={[
        { href: "/tcp-ip-model-reference", label: "TCP/IP Model" },
        { href: "/network-protocol-reference", label: "Protocol Reference" },
        { href: "/tcp-flags-reference", label: "TCP Flags" },
      ]}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="sticky top-0 bg-black/40">
            <tr>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">#</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Layer</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">PDU</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Devices / Protocols</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Role</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.n} className="border-t border-white/5">
                <td className="px-3 py-2 font-mono text-zinc-200">{r.n}</td>
                <td className="px-3 py-2 font-medium text-gray-100">{r.layer}</td>
                <td className="px-3 py-2 font-mono text-xs text-gray-300">{r.pdu}</td>
                <td className="px-3 py-2 font-mono text-xs text-gray-300">{r.examples}</td>
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
