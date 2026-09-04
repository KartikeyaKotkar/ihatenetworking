'use client';

import { useMemo, useState } from "react";
import { mssFor } from "@/lib/netcalc";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

export default function Calculator() {
  const [mtu, setMtu] = useState("1500");
  const [ipv6, setIpv6] = useState(false);
  const [ts, setTs] = useState(false);
  const r = useMemo(() => {
    if (mtu.trim() === "") return { mss: null as number | null, error: "" };
    const m = Number(mtu.trim());
    if (!Number.isInteger(m)) return { mss: null, error: "MTU must be an integer 68-9000." };
    const mss = mssFor(m, ipv6, ts);
    if (mss === null) return { mss: null, error: "MTU must be 68-9000." };
    return { mss, error: "" };
  }, [mtu, ipv6, ts]);
  const headers = `${ipv6 ? 40 : 20} (IP${ipv6 ? "v6" : "v4"}) + 20 (TCP)${ts ? " + 12 (timestamps)" : ""}`;
  return (
    <div>
      <label className={labelCls}>MTU</label>
      <input className={inputCls} value={mtu} onChange={(e) => setMtu(e.target.value)} placeholder="1500" inputMode="numeric" />
      <div className="mt-3 flex items-center gap-4 text-sm text-gray-300">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={ipv6} onChange={(e) => setIpv6(e.target.checked)} className="accent-zinc-300" /> IPv6
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={ts} onChange={(e) => setTs(e.target.checked)} className="accent-zinc-300" /> Timestamps
        </label>
      </div>
      <div className="mt-3 flex gap-2">
        <CopyButton text={r.mss !== null ? String(r.mss) : ""} />
        <button type="button" onClick={() => { setMtu("1500"); setIpv6(false); setTs(false); }} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4"><ErrorBox message={r.error} />
        {r.mss !== null && <div className="rounded-lg bg-black/40 p-4">
          <ResultRow label="MSS" value={`${r.mss} B`} />
          <ResultRow label="Subtracted" value={headers} />
        </div>}
      </div>
    </div>
  );
}
