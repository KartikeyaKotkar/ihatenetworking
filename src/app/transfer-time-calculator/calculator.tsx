'use client';

import { useMemo, useState } from "react";
import { humanDuration, parseBits, transferSeconds } from "@/lib/netcalc";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

export default function Calculator() {
  const [size, setSize] = useState("1 GB");
  const [rate, setRate] = useState("100 Mbps");
  const [overhead, setOverhead] = useState("5");
  const r = useMemo(() => {
    if (size.trim() === "" || rate.trim() === "" || overhead.trim() === "") return { sec: null as number | null, error: "" };
    const bits = parseBits(size, "GB");
    const bps = parseBits(rate, "Mb");
    const oh = Number(overhead.trim());
    if (bits === null || bps === null || !Number.isFinite(oh)) return { sec: null, error: "Enter file size (e.g. 1 GB), rate (e.g. 100 Mbps), and overhead %." };
    const sec = transferSeconds(bits, bps, oh);
    if (sec === null) return { sec: null, error: "Rate must be > 0; overhead 0-100%." };
    return { sec, error: "" };
  }, [size, rate, overhead]);
  return (
    <div>
      <label className={labelCls}>File size</label>
      <input className={inputCls} value={size} onChange={(e) => setSize(e.target.value)} placeholder="1 GB" />
      <label className={`${labelCls} mt-4`}>Link rate</label>
      <input className={inputCls} value={rate} onChange={(e) => setRate(e.target.value)} placeholder="100 Mbps" />
      <label className={`${labelCls} mt-4`}>Overhead %</label>
      <input className={inputCls} value={overhead} onChange={(e) => setOverhead(e.target.value)} placeholder="5" inputMode="decimal" />
      <div className="mt-3 flex gap-2">
        <CopyButton text={r.sec !== null ? humanDuration(r.sec) : ""} />
        <button type="button" onClick={() => { setSize("1 GB"); setRate("100 Mbps"); setOverhead("5"); }} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4"><ErrorBox message={r.error} />
        {r.sec !== null && <div className="rounded-lg bg-black/40 p-4">
          <ResultRow label="Transfer time" value={humanDuration(r.sec)} />
          <ResultRow label="Seconds" value={String(Math.round(r.sec * 100) / 100)} />
        </div>}
      </div>
    </div>
  );
}
