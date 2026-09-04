import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import { CopyButton } from "@/components/tool-ui";
import { TCP_FLAG_MEANINGS } from "@/lib/packets";

export const metadata: Metadata = {
  title: "TCP Flags Reference — SYN ACK FIN RST Meanings",
  description: "Free TCP flags chart: all 9 flags with meanings and when you see them.",
};

const WHEN_SEEN: Record<string, string> = {
  NS: "Rarely; ECN nonce experiments.",
  CWR: "After congestion; sender confirms it throttled.",
  ECE: "During congestion; receiver echoes ECN signal.",
  URG: "Legacy urgent/OOB data, e.g. Telnet interrupts.",
  ACK: "Almost every packet after the initial SYN.",
  PSH: "Interactive sends pushing buffered data up.",
  RST: "Refused port, aborted or half-open reset.",
  SYN: "Connection open handshake (SYN, SYN-ACK).",
  FIN: "Graceful close, each side in turn.",
};

const ORDER = ["NS", "CWR", "ECE", "URG", "ACK", "PSH", "RST", "SYN", "FIN"];

export default function Page() {
  const rows = ORDER.map((flag) => ({ flag, meaning: TCP_FLAG_MEANINGS[flag], when: WHEN_SEEN[flag] }));
  const copy = rows.map((r) => `${r.flag}: ${r.meaning} — ${r.when}`).join("\n");
  return (
    <ToolShell
      title="TCP Flags Reference"
      description="All 9 TCP flags with meanings and when you see them in captures."
      example="SYN → SYN-ACK → ACK opens; FIN closes; RST aborts."
      explanation="Flags live in the TCP header control bits. handshake = SYN, steady state = ACK/PSH, teardown = FIN, abort = RST, congestion = ECE/CWR."
      faqs={[
        { q: "What does SYN-ACK mean?", a: "A packet with both SYN and ACK set: the server accepts the open request and syncs its own sequence number." },
        { q: "FIN vs RST?", a: "FIN is a graceful close (data delivered, each side finishes); RST aborts immediately, dropping state." },
      ]}
      related={[
        { href: "/tcp-header-decoder", label: "TCP Header Decoder" },
        { href: "/osi-model-reference", label: "OSI Model" },
        { href: "/port-number-quiz", label: "Port Quiz" },
      ]}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="sticky top-0 bg-black/40">
            <tr>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Flag</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Meaning</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">When seen</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.flag} className="border-t border-white/5">
                <td className="px-3 py-2 font-mono text-zinc-200">{r.flag}</td>
                <td className="px-3 py-2 text-xs text-gray-300">{r.meaning}</td>
                <td className="px-3 py-2 text-xs text-gray-400">{r.when}</td>
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
