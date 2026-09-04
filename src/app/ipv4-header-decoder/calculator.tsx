'use client';

import { useMemo, useState } from "react";
import { parseHexBytes, decodeIPv4Header } from "@/lib/packets";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

export default function Calculator() {
  const [val, setVal] = useState("4500003cabcd40004006a6c2c0a0000010a000002");
  const r = useMemo(() => {
    if (val.trim() === "") return { h: null, error: "" };
    const bytes = parseHexBytes(val);
    if (!bytes) return { h: null, error: "Invalid hex. Use hex digits, spaces/colons/0x separators allowed." };
    if (bytes.length < 20) return { h: null, error: `Too short: ${bytes.length} bytes, need at least 20.` };
    const h = decodeIPv4Header(val);
    if (!h) return { h: null, error: "Could not decode. Check version nibble is 4 and header length fits." };
    if (h.version !== 4) return { h: null, error: `Wrong version ${h.version}: must be 4.` };
    return { h, error: "" };
  }, [val]);
  const h = r.h;
  return (
    <div>
      <label className={labelCls}>IPv4 header hex (≥ 20 bytes)</label>
      <input className={inputCls} value={val} onChange={(e) => setVal(e.target.value)} placeholder="4500003c…" spellCheck={false} />
      <div className="mt-3 flex gap-2">
        <CopyButton text={h ? `${h.src} → ${h.dst} proto=${h.protocolName}` : ""} />
        <button type="button" onClick={() => setVal("")} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4"><ErrorBox message={r.error} />
        {h && <div className="rounded-lg bg-black/40 p-4">
          <ResultRow label="Version" value={String(h.version)} />
          <ResultRow label="Header length" value={`${h.ihlBytes} bytes`} />
          <ResultRow label="DSCP" value={String(h.dscp)} />
          <ResultRow label="ECN" value={String(h.ecn)} />
          <ResultRow label="Total length" value={String(h.totalLength)} />
          <ResultRow label="Identification" value={h.identification} />
          <ResultRow label="Flags" value={h.flags.join(", ")} />
          <ResultRow label="Fragment offset" value={String(h.fragmentOffset)} />
          <ResultRow label="TTL" value={String(h.ttl)} />
          <ResultRow label="Protocol" value={`${h.protocol} (${h.protocolName})`} />
          <ResultRow label="Checksum" value={h.checksum} />
          <ResultRow label="Source" value={h.src} />
          <ResultRow label="Destination" value={h.dst} />
          <ResultRow label="Options" value={h.hasOptions ? "Yes" : "No"} />
        </div>}
      </div>
    </div>
  );
}
