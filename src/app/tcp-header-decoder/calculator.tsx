'use client';

import { useMemo, useState } from "react";
import { parseHexBytes, decodeTCPHeader } from "@/lib/packets";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

export default function Calculator() {
  const [val, setVal] = useState("3039c3b8123456789abcdef501882000e7300000");
  const r = useMemo(() => {
    if (val.trim() === "") return { h: null, error: "" };
    const bytes = parseHexBytes(val);
    if (!bytes) return { h: null, error: "Invalid hex. Use hex digits, spaces/colons/0x separators allowed." };
    if (bytes.length < 20) return { h: null, error: `Too short: ${bytes.length} bytes, need at least 20.` };
    const h = decodeTCPHeader(val);
    if (!h) return { h: null, error: "Could not decode TCP header." };
    return { h, error: "" };
  }, [val]);
  const h = r.h;
  return (
    <div>
      <label className={labelCls}>TCP header hex (≥ 20 bytes)</label>
      <input className={inputCls} value={val} onChange={(e) => setVal(e.target.value)} placeholder="3039c3b8…" spellCheck={false} />
      <div className="mt-3 flex gap-2">
        <CopyButton text={h ? `${h.srcPort} → ${h.dstPort} [${h.flags.join(", ") || "no flags"}]` : ""} />
        <button type="button" onClick={() => setVal("")} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4"><ErrorBox message={r.error} />
        {h && <div className="rounded-lg bg-black/40 p-4">
          <ResultRow label="Source port" value={String(h.srcPort)} />
          <ResultRow label="Destination port" value={String(h.dstPort)} />
          <ResultRow label="Sequence" value={String(h.seq)} />
          <ResultRow label="Ack" value={String(h.ack)} />
          <ResultRow label="Header length" value={`${h.headerBytes} bytes`} />
          <ResultRow label="Flags" value={h.flags.length ? h.flags.join(", ") : "none"} />
          <ResultRow label="Window" value={String(h.window)} />
          <ResultRow label="Checksum" value={h.checksum} />
          <ResultRow label="Urgent" value={String(h.urgent)} />
        </div>}
      </div>
    </div>
  );
}
