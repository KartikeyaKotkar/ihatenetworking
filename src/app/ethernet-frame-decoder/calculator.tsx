'use client';

import { useMemo, useState } from "react";
import { parseHexBytes, decodeEthernetFrame } from "@/lib/packets";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

export default function Calculator() {
  const [val, setVal] = useState("ffffffffffff001b44113ab70800");
  const r = useMemo(() => {
    if (val.trim() === "") return { f: null, error: "" };
    const bytes = parseHexBytes(val);
    if (!bytes) return { f: null, error: "Invalid hex. Use hex digits, spaces/colons/0x separators allowed." };
    if (bytes.length < 14) return { f: null, error: `Too short: ${bytes.length} bytes, need at least 14 (dst + src MAC + EtherType).` };
    const f = decodeEthernetFrame(val);
    if (!f) return { f: null, error: "Could not decode Ethernet frame." };
    return { f, error: "" };
  }, [val]);
  const f = r.f;
  return (
    <div>
      <label className={labelCls}>Ethernet frame hex (≥ 14 bytes)</label>
      <input className={inputCls} value={val} onChange={(e) => setVal(e.target.value)} placeholder="ffffffffffff001b44113ab70800" spellCheck={false} />
      <div className="mt-3 flex gap-2">
        <CopyButton text={f ? `${f.dstMac} ← ${f.srcMac} ${f.etherType}` : ""} />
        <button type="button" onClick={() => setVal("")} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4"><ErrorBox message={r.error} />
        {f && <div className="rounded-lg bg-black/40 p-4">
          <ResultRow label="Destination MAC" value={f.dstMac} />
          <ResultRow label="Source MAC" value={f.srcMac} />
          <ResultRow label="EtherType" value={`${f.etherType} (${f.etherTypeName})`} />
          <ResultRow label="Payload size" value={`${f.payloadBytes} bytes`} />
        </div>}
      </div>
    </div>
  );
}
