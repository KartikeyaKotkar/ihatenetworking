'use client';

import { useMemo, useState } from "react";
import { parseHexBytes, decodeUDPHeader } from "@/lib/packets";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

export default function Calculator() {
  const [val, setVal] = useState("0035c3b8001c2a9c");
  const r = useMemo(() => {
    if (val.trim() === "") return { h: null, error: "" };
    const bytes = parseHexBytes(val);
    if (!bytes) return { h: null, error: "Invalid hex. Use hex digits, spaces/colons/0x separators allowed." };
    if (bytes.length < 8) return { h: null, error: `Too short: ${bytes.length} bytes, need at least 8.` };
    const h = decodeUDPHeader(val);
    if (!h) return { h: null, error: "Could not decode UDP header." };
    return { h, error: "" };
  }, [val]);
  const h = r.h;
  return (
    <div>
      <label className={labelCls}>UDP header hex (≥ 8 bytes)</label>
      <input className={inputCls} value={val} onChange={(e) => setVal(e.target.value)} placeholder="0035c3b8001c2a9c" spellCheck={false} />
      <div className="mt-3 flex gap-2">
        <CopyButton text={h ? `${h.srcPort} → ${h.dstPort} len=${h.length}` : ""} />
        <button type="button" onClick={() => setVal("")} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4"><ErrorBox message={r.error} />
        {h && <div className="rounded-lg bg-black/40 p-4">
          <ResultRow label="Source port" value={String(h.srcPort)} />
          <ResultRow label="Destination port" value={String(h.dstPort)} />
          <ResultRow label="Length" value={String(h.length)} />
          <ResultRow label="Checksum" value={h.checksum} />
        </div>}
      </div>
    </div>
  );
}
