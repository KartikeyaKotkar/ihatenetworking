'use client';

import { useMemo, useState } from "react";
import { eigrpMetric } from "@/lib/cisco";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

export default function Calculator() {
  const [bw, setBw] = useState("1544");
  const [delay, setDelay] = useState("20000");
  const [preset, setPreset] = useState("default");
  const r = useMemo(() => {
    if (bw.trim() === "" || delay.trim() === "") return { out: null, error: "" };
    const b = Number(bw);
    const d = Number(delay);
    if (!Number.isFinite(b) || b <= 0) return { out: null, error: "Min bandwidth must be a positive number (Kbps)." };
    if (!Number.isInteger(d) || d < 0) return { out: null, error: "Delay must be a non-negative integer (tens of usec)." };
    const out = eigrpMetric(b, d, 1, 0, 1, 0, 0);
    if (!out) return { out: null, error: "Could not compute metric." };
    return { out, error: "" };
  }, [bw, delay]);
  void preset;
  return (
    <div>
      <label className={labelCls}>Min bandwidth (Kbps)</label>
      <input className={inputCls} value={bw} onChange={(e) => setBw(e.target.value)} placeholder="1544" inputMode="decimal" />
      <label className={`${labelCls} mt-3`}>Total delay (tens of usec)</label>
      <input className={inputCls} value={delay} onChange={(e) => setDelay(e.target.value)} placeholder="20000" inputMode="numeric" />
      <label className={`${labelCls} mt-3`}>K preset</label>
      <select className={inputCls} value={preset} onChange={(e) => setPreset(e.target.value)}>
        <option value="default">Default K1=K3=1</option>
      </select>
      <p className="mt-1 text-xs text-gray-500">Custom K values change weighting; K5 (reliability) unsupported.</p>
      <div className="mt-3 flex gap-2">
        <CopyButton text={r.out ? String(r.out.metric) : ""} />
        <button type="button" onClick={() => { setBw(""); setDelay(""); }} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4"><ErrorBox message={r.error} />
        {r.out && <div className="rounded-lg bg-black/40 p-4">
          <ResultRow label="BW term" value={String(r.out.bwTerm)} />
          <ResultRow label="Delay term" value={String(r.out.delayTerm)} />
          <ResultRow label="Metric" value={String(r.out.metric)} />
          <ResultRow label="Formula" value="K1×BW + K3×Delay" />
        </div>}
      </div>
    </div>
  );
}
