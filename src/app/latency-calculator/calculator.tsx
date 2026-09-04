'use client';

import { useMemo, useState } from "react";
import { latencyBreakdown, parseBits, type Medium } from "@/lib/netcalc";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

const MEDIUMS: Medium[] = ["fiber", "copper", "wifi", "satellite-leo", "satellite-geo"];

export default function Calculator() {
  const [dist, setDist] = useState("1000");
  const [medium, setMedium] = useState<Medium>("fiber");
  const [size, setSize] = useState("1500 B");
  const [rate, setRate] = useState("1 Gbps");
  const r = useMemo(() => {
    if (dist.trim() === "" || size.trim() === "" || rate.trim() === "") return { b: null, error: "" };
    const d = Number(dist.trim());
    const bits = parseBits(size, "B");
    const bps = parseBits(rate, "Gb");
    if (!Number.isFinite(d) || bits === null || bps === null) return { b: null as null | NonNullable<ReturnType<typeof latencyBreakdown>>, error: "Enter distance km, packet size (e.g. 1500 B), and link rate (e.g. 1 Gbps)." };
    const b = latencyBreakdown(d, medium, bits, bps);
    if (b === null) return { b: null, error: "Distance and size must be ≥ 0; rate must be > 0." };
    return { b, error: "" };
  }, [dist, medium, size, rate]);
  const fmt = (n: number) => `${Math.round(n * 100) / 100} ms`;
  return (
    <div>
      <label className={labelCls}>Distance (km)</label>
      <input className={inputCls} value={dist} onChange={(e) => setDist(e.target.value)} placeholder="1000" inputMode="decimal" />
      <label className={`${labelCls} mt-4`}>Medium</label>
      <select className={inputCls} value={medium} onChange={(e) => setMedium(e.target.value as Medium)}>
        {MEDIUMS.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>
      <label className={`${labelCls} mt-4`}>Packet size</label>
      <input className={inputCls} value={size} onChange={(e) => setSize(e.target.value)} placeholder="1500 B" />
      <label className={`${labelCls} mt-4`}>Link rate</label>
      <input className={inputCls} value={rate} onChange={(e) => setRate(e.target.value)} placeholder="1 Gbps" />
      <div className="mt-3 flex gap-2">
        <CopyButton text={r.b !== null ? fmt(r.b.totalMs) : ""} />
        <button type="button" onClick={() => { setDist("1000"); setMedium("fiber"); setSize("1500 B"); setRate("1 Gbps"); }} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4"><ErrorBox message={r.error} />
        {r.b !== null && <div className="rounded-lg bg-black/40 p-4">
          <ResultRow label="Propagation" value={fmt(r.b.propagationMs)} />
          <ResultRow label="Transmission" value={fmt(r.b.transmissionMs)} />
          <ResultRow label="Base" value={fmt(r.b.baseMs)} />
          <ResultRow label="Total" value={fmt(r.b.totalMs)} />
        </div>}
      </div>
    </div>
  );
}
