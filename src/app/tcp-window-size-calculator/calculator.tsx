'use client';

import { useMemo, useState } from "react";
import { bdpWindow, humanBytes, parseBits } from "@/lib/netcalc";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

export default function Calculator() {
  const [rate, setRate] = useState("100 Mbps");
  const [rtt, setRtt] = useState("50");
  const r = useMemo(() => {
    if (rate.trim() === "" || rtt.trim() === "") return { w: null as null | NonNullable<ReturnType<typeof bdpWindow>>, error: "" };
    const bps = parseBits(rate, "Mb");
    const ms = Number(rtt.trim());
    if (bps === null || !Number.isFinite(ms)) return { w: null, error: "Enter rate (e.g. 100 Mbps) and RTT in ms." };
    const w = bdpWindow(bps, ms);
    if (w === null) return { w: null, error: "Rate must be > 0 and RTT ≥ 0." };
    return { w, error: "" };
  }, [rate, rtt]);
  return (
    <div>
      <label className={labelCls}>Link rate</label>
      <input className={inputCls} value={rate} onChange={(e) => setRate(e.target.value)} placeholder="100 Mbps" />
      <label className={`${labelCls} mt-4`}>RTT (ms)</label>
      <input className={inputCls} value={rtt} onChange={(e) => setRtt(e.target.value)} placeholder="50" inputMode="decimal" />
      <div className="mt-3 flex gap-2">
        <CopyButton text={r.w !== null ? String(r.w.bytes) : ""} />
        <button type="button" onClick={() => { setRate("100 Mbps"); setRtt("50"); }} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4"><ErrorBox message={r.error} />
        {r.w !== null && <div className="rounded-lg bg-black/40 p-4">
          <ResultRow label="Window" value={`${r.w.bytes} B (${humanBytes(r.w.bytes * 8)})`} />
          <ResultRow label="Scaling" value={r.w.scaleNeeded ? "Required (> 65535 B) — enable window scaling" : "Not required (≤ 65535 B)"} />
        </div>}
      </div>
    </div>
  );
}
