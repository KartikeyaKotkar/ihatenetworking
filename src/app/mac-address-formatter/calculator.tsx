'use client';

import { useMemo, useState } from "react";
import { formatMac } from "@/lib/mac";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

export default function Calculator() {
  const [val, setVal] = useState("00:1B:44:11:3A:B7");
  const info = useMemo(() => formatMac(val), [val]);
  return (
    <div>
      <label className={labelCls}>MAC address</label>
      <input className={inputCls} value={val} onChange={(e) => setVal(e.target.value)} placeholder="00:1B:44:11:3A:B7" spellCheck={false} />
      <div className="mt-3 flex gap-2">
        <CopyButton text={info ? info.canonical : ""} />
        <button type="button" onClick={() => setVal("")} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4"><ErrorBox message={val.trim() !== "" && !info ? "Invalid MAC. Use 6 byte pairs (00:1B:44:11:3A:B7) or Cisco xxxx.xxxx.xxxx." : ""} />
        {info && <div className="rounded-lg bg-black/40 p-4">
          <ResultRow label="Canonical" value={info.canonical} />
          <ResultRow label="Lowercase colon" value={info.colonLower} />
          <ResultRow label="Hyphen" value={info.hyphenUpper} />
          <ResultRow label="Cisco dotted" value={info.dotCisco} />
          <ResultRow label="Plain" value={info.plain} />
          <ResultRow label="Cast" value={info.unicast ? "Unicast" : "Multicast"} />
          <ResultRow label="Scope" value={info.universal ? "Universal" : "Local"} />
          <ResultRow label="OUI" value={info.oui} />
        </div>}
      </div>
    </div>
  );
}
