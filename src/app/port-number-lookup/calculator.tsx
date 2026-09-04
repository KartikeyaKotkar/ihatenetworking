'use client';

import { useMemo, useState } from "react";
import { lookupPort, searchPorts, wellKnownRange } from "@/lib/ports";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

export default function Calculator() {
  const [val, setVal] = useState("443");
  const r = useMemo(() => {
    const q = val.trim();
    if (q === "") return { hits: [], error: "", range: "", copy: "" };
    if (/^\d+$/.test(q)) {
      const n = Number(q);
      if (!Number.isInteger(n) || n < 0 || n > 65535) return { hits: [], error: "Port must be 0-65535.", range: "", copy: "" };
      const hit = lookupPort(n);
      const range = wellKnownRange(n);
      if (hit) return { hits: [hit], error: "", range, copy: `${hit.port} ${hit.service} (${hit.protocol})` };
      return { hits: [], error: `No entry for port ${n} in the common-ports dataset.`, range, copy: range };
    }
    const hits = searchPorts(q);
    if (hits.length === 0) return { hits, error: `No entry matching "${q}" in the common-ports dataset.`, range: "", copy: "" };
    return { hits, error: "", range: "", copy: hits.map((h) => `${h.port} ${h.service}`).join(", ") };
  }, [val]);
  return (
    <div>
      <label className={labelCls}>Port number or service name</label>
      <input className={inputCls} value={val} onChange={(e) => setVal(e.target.value)} placeholder="443 or https" inputMode="search" />
      <div className="mt-3 flex gap-2">
        <CopyButton text={r.copy} />
        <button type="button" onClick={() => setVal("")} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4"><ErrorBox message={r.error} />
        {r.hits.length > 0 && <div className="rounded-lg bg-black/40 p-4 space-y-4">
          {r.hits.map((h) => (
            <div key={h.port}>
              <ResultRow label="Port" value={String(h.port)} />
              <ResultRow label="Service" value={h.service} />
              <ResultRow label="Protocol" value={h.protocol} />
              <ResultRow label="Description" value={h.description} />
              <ResultRow label="Range class" value={wellKnownRange(h.port)} />
            </div>
          ))}
        </div>}
        {r.hits.length === 0 && r.range !== "" && <div className="rounded-lg bg-black/40 p-4">
          <ResultRow label="Range class" value={r.range} />
        </div>}
      </div>
    </div>
  );
}
