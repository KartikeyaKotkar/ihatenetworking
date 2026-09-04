'use client';

import { useMemo, useState } from "react";
import { lookupIcmp, searchIcmp } from "@/lib/packets";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

export default function Calculator() {
  const [val, setVal] = useState("8");
  const r = useMemo(() => {
    if (val.trim() === "") return { hits: [], error: "" };
    if (/^\d+$/.test(val.trim())) {
      const hit = lookupIcmp(Number(val.trim()));
      if (!hit) return { hits: [], error: `Unknown ICMP type ${val.trim()}. Try 0, 3, 8, or 11.` };
      return { hits: [hit], error: "" };
    }
    const hits = searchIcmp(val);
    if (hits.length === 0) return { hits: [], error: `No ICMP type matches "${val.trim()}". Try a number or "echo".` };
    return { hits, error: "" };
  }, [val]);
  return (
    <div>
      <label className={labelCls}>ICMP type number or name</label>
      <input className={inputCls} value={val} onChange={(e) => setVal(e.target.value)} placeholder="8 or echo" spellCheck={false} />
      <div className="mt-3 flex gap-2">
        <CopyButton text={r.hits.length === 1 ? `Type ${r.hits[0].type} — ${r.hits[0].name}` : ""} />
        <button type="button" onClick={() => setVal("")} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4"><ErrorBox message={r.error} />
        {r.hits.map((h) => (
          <div key={h.type} className="mb-3 rounded-lg bg-black/40 p-4">
            <ResultRow label="Type" value={String(h.type)} />
            <ResultRow label="Name" value={h.name} />
            {h.codes.map((c) => (
              <ResultRow key={c.code} label={`Code ${c.code}`} value={c.meaning} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
