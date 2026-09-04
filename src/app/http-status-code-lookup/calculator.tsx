'use client';

import { useMemo, useState } from "react";
import { lookupStatus, searchStatuses } from "@/lib/http-status";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

export default function Calculator() {
  const [val, setVal] = useState("404");
  const r = useMemo(() => {
    const q = val.trim();
    if (q === "") return { hits: [], error: "", copy: "" };
    if (/^\d+$/.test(q)) {
      const n = Number(q);
      const hit = lookupStatus(n);
      if (hit) return { hits: [hit], error: "", copy: `${hit.code} ${hit.phrase}` };
      if (Number.isInteger(n) && n >= 100 && n <= 599) return { hits: [], error: `No entry for status ${n} in the common-status dataset.`, copy: "" };
      return { hits: [], error: "Status code must be 100-599.", copy: "" };
    }
    const hits = searchStatuses(q);
    if (hits.length === 0) return { hits, error: `No entry matching "${q}" in the common-status dataset.`, copy: "" };
    return { hits, error: "", copy: hits.map((h) => `${h.code} ${h.phrase}`).join(", ") };
  }, [val]);
  return (
    <div>
      <label className={labelCls}>Status code or phrase</label>
      <input className={inputCls} value={val} onChange={(e) => setVal(e.target.value)} placeholder="404 or not found" inputMode="search" />
      <div className="mt-3 flex gap-2">
        <CopyButton text={r.copy} />
        <button type="button" onClick={() => setVal("")} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4"><ErrorBox message={r.error} />
        {r.hits.length > 0 && <div className="rounded-lg bg-black/40 p-4 space-y-4">
          {r.hits.map((h) => (
            <div key={h.code}>
              <ResultRow label="Code" value={String(h.code)} />
              <ResultRow label="Phrase" value={h.phrase} />
              <ResultRow label="Category" value={h.category} />
              <ResultRow label="Description" value={h.description} />
            </div>
          ))}
        </div>}
      </div>
    </div>
  );
}
