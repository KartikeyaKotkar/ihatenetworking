'use client';

import { useMemo, useState } from "react";
import { humanRate, parseBits, requiredBandwidth } from "@/lib/netcalc";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

export default function Calculator() {
  const [users, setUsers] = useState("100");
  const [rate, setRate] = useState("5 Mbps");
  const [overhead, setOverhead] = useState("10");
  const r = useMemo(() => {
    if (users.trim() === "" || rate.trim() === "" || overhead.trim() === "") return { bps: null as number | null, error: "" };
    const u = Number(users.trim());
    const perUser = parseBits(rate, "Mb");
    const oh = Number(overhead.trim());
    if (!Number.isFinite(u) || perUser === null || !Number.isFinite(oh)) return { bps: null, error: "Enter users, per-user rate (e.g. 5 Mbps), and overhead %." };
    const bps = requiredBandwidth(u, perUser, oh);
    if (bps === null) return { bps: null, error: "Users and rate must be > 0; overhead 0-100%." };
    return { bps, error: "" };
  }, [users, rate, overhead]);
  return (
    <div>
      <label className={labelCls}>Concurrent users</label>
      <input className={inputCls} value={users} onChange={(e) => setUsers(e.target.value)} placeholder="100" inputMode="numeric" />
      <label className={`${labelCls} mt-4`}>Per-user rate</label>
      <input className={inputCls} value={rate} onChange={(e) => setRate(e.target.value)} placeholder="5 Mbps" />
      <label className={`${labelCls} mt-4`}>Overhead %</label>
      <input className={inputCls} value={overhead} onChange={(e) => setOverhead(e.target.value)} placeholder="10" inputMode="decimal" />
      <div className="mt-3 flex gap-2">
        <CopyButton text={r.bps !== null ? humanRate(r.bps) : ""} />
        <button type="button" onClick={() => { setUsers("100"); setRate("5 Mbps"); setOverhead("10"); }} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4"><ErrorBox message={r.error} />
        {r.bps !== null && <div className="rounded-lg bg-black/40 p-4">
          <ResultRow label="Required capacity" value={humanRate(r.bps)} />
          <ResultRow label="Raw bps" value={String(Math.round(r.bps))} />
        </div>}
      </div>
    </div>
  );
}
