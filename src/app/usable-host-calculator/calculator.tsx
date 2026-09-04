'use client';

import { useMemo } from "react";
import { parsePrefix, usableHostCount, totalAddresses } from "@/lib/ipv4";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls, usePersistentState } from "@/components/tool-ui";

export default function Calculator() {
  const [prefix, setPrefix] = usePersistentState("hosts:prefix", "24");
  const r = useMemo(() => {
    const p = parsePrefix(prefix);
    if (prefix.trim() === "") return { p: null, error: "" };
    if (p === null) return { p: null, error: "Invalid prefix. Use 0-32." };
    return { p, error: "" };
  }, [prefix]);
  return (
    <div>
      <label className={labelCls}>Prefix length</label>
      <input className={inputCls} value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="24" inputMode="numeric" />
      <div className="mt-3 flex gap-2">
        <CopyButton text={r.p !== null ? `/${r.p}: ${usableHostCount(r.p)} usable hosts` : ""} />
        <button type="button" onClick={() => setPrefix("")} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4"><ErrorBox message={r.error} />
        {r.p !== null && <div className="rounded-lg bg-black/40 p-4">
          <ResultRow label="Usable hosts" value={String(usableHostCount(r.p))} />
          <ResultRow label="Total addresses" value={String(totalAddresses(r.p))} />
        </div>}
      </div>
    </div>
  );
}
