'use client';

import { useMemo, useState } from "react";
import { prefixForHosts, prefixToMaskString, usableHostCount } from "@/lib/ipv4";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

export default function Calculator() {
  const [hosts, setHosts] = useState("50");
  const r = useMemo(() => {
    if (hosts.trim() === "") return { p: null, error: "" };
    const h = Number(hosts.trim());
    if (!Number.isInteger(h) || h < 1) return { p: null, error: "Enter positive integer host count." };
    const p = prefixForHosts(h);
    if (p === null) return { p: null, error: "Too many hosts for IPv4." };
    return { p, error: "" };
  }, [hosts]);
  return (
    <div>
      <label className={labelCls}>Hosts needed</label>
      <input className={inputCls} value={hosts} onChange={(e) => setHosts(e.target.value)} placeholder="50" inputMode="numeric" />
      <div className="mt-3 flex gap-2">
        <CopyButton text={r.p !== null ? `/${r.p} mask ${prefixToMaskString(r.p)}` : ""} />
        <button type="button" onClick={() => setHosts("")} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4"><ErrorBox message={r.error} />
        {r.p !== null && <div className="rounded-lg bg-black/40 p-4">
          <ResultRow label="Recommended prefix" value={`/${r.p}`} />
          <ResultRow label="Subnet mask" value={prefixToMaskString(r.p)} />
          <ResultRow label="Fits hosts" value={String(usableHostCount(r.p))} />
        </div>}
      </div>
    </div>
  );
}
