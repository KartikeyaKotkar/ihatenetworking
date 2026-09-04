'use client';

import { useMemo, useState } from "react";
import { humanRate, parseBits, throughput } from "@/lib/netcalc";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

export default function Calculator() {
  const [size, setSize] = useState("100 MB");
  const [secs, setSecs] = useState("8");
  const r = useMemo(() => {
    if (size.trim() === "" || secs.trim() === "") return { bps: null as number | null, error: "" };
    const bits = parseBits(size, "MB");
    const s = Number(secs.trim());
    if (bits === null || !Number.isFinite(s)) return { bps: null, error: "Enter size (e.g. 100 MB) and duration in seconds." };
    const bps = throughput(bits, s);
    if (bps === null) return { bps: null, error: "Duration must be > 0 and size ≥ 0." };
    return { bps, error: "" };
  }, [size, secs]);
  return (
    <div>
      <label className={labelCls}>Bytes transferred</label>
      <input className={inputCls} value={size} onChange={(e) => setSize(e.target.value)} placeholder="100 MB" />
      <label className={`${labelCls} mt-4`}>Duration (seconds)</label>
      <input className={inputCls} value={secs} onChange={(e) => setSecs(e.target.value)} placeholder="8" inputMode="decimal" />
      <div className="mt-3 flex gap-2">
        <CopyButton text={r.bps !== null ? humanRate(r.bps) : ""} />
        <button type="button" onClick={() => { setSize("100 MB"); setSecs("8"); }} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4"><ErrorBox message={r.error} />
        {r.bps !== null && <div className="rounded-lg bg-black/40 p-4">
          <ResultRow label="Throughput" value={humanRate(r.bps)} />
          <ResultRow label="Raw bps" value={String(Math.round(r.bps))} />
        </div>}
      </div>
    </div>
  );
}
