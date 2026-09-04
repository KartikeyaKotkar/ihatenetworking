'use client';

import { useMemo, useState } from "react";
import { ospfCost } from "@/lib/cisco";
import { parseBits } from "@/lib/netcalc";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

const REFS = [
  { label: "100 Mbps (default)", value: 100e6 },
  { label: "1 Gbps", value: 1e9 },
  { label: "10 Gbps", value: 10e9 },
];

export default function Calculator() {
  const [bw, setBw] = useState("100 Mbps");
  const [ref, setRef] = useState(100e6);
  const r = useMemo(() => {
    if (bw.trim() === "") return { cost: null as number | null, error: "" };
    const bps = parseBits(bw, "Mb");
    if (bps === null || bps <= 0) return { cost: null as number | null, error: "Invalid bandwidth, e.g. 100 Mbps or 1.5 Gbps." };
    const cost = ospfCost(bps, ref);
    if (cost === null) return { cost: null as number | null, error: "Could not compute cost." };
    return { cost, error: "" };
  }, [bw, ref]);
  return (
    <div>
      <label className={labelCls}>Interface bandwidth</label>
      <input className={inputCls} value={bw} onChange={(e) => setBw(e.target.value)} placeholder="100 Mbps" />
      <label className={`${labelCls} mt-3`}>Reference bandwidth</label>
      <select className={inputCls} value={ref} onChange={(e) => setRef(Number(e.target.value))}>
        {REFS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <div className="mt-3 flex gap-2">
        <CopyButton text={r.cost !== null ? String(r.cost) : ""} />
        <button type="button" onClick={() => { setBw(""); }} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4"><ErrorBox message={r.error} />
        {r.cost !== null && <div className="rounded-lg bg-black/40 p-4">
          <ResultRow label="OSPF cost" value={String(r.cost)} />
          <ResultRow label="Formula" value="cost = max(1, round(ref / bw))" />
          <p className="mt-2 text-xs text-gray-500">Default reference 10^8. Cost floors at minimum 1.</p>
        </div>}
      </div>
    </div>
  );
}
