'use client';

import { useMemo, useState } from "react";
import { parseCIDR, describeSubnet, ipv4ToString } from "@/lib/ipv4";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

export default function Calculator() {
  const [cidr, setCidr] = useState("10.0.0.5/16");
  const result = useMemo(() => {
    if (!cidr.trim()) return { info: null, error: "" };
    const c = parseCIDR(cidr);
    if (!c) return { info: null, error: "Invalid CIDR. Format: 10.0.0.5/16 (IP + /0-32)." };
    return { info: describeSubnet(ipv4ToString(c.ip), c.prefix), error: "" };
  }, [cidr]);

  return (
    <div>
      <label className={labelCls} htmlFor="cidr">CIDR notation</label>
      <input id="cidr" className={inputCls} value={cidr} onChange={(e) => setCidr(e.target.value)} placeholder="10.0.0.5/16" />
      <div className="mt-3 flex gap-2">
        <CopyButton text={result.info ? `${result.info.network}/${result.info.prefix} mask ${result.info.mask} hosts ${result.info.usableHosts}` : ""} />
        <button type="button" onClick={() => setCidr("")} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4">
        <ErrorBox message={result.error} />
        {result.info && (
          <div className="rounded-lg bg-black/40 p-4">
            <ResultRow label="CIDR" value={`${result.info.network}/${result.info.prefix}`} />
            <ResultRow label="Mask" value={result.info.mask} />
            <ResultRow label="Wildcard" value={result.info.wildcard} />
            <ResultRow label="Network" value={result.info.network} />
            <ResultRow label="Broadcast" value={result.info.broadcast} />
            <ResultRow label="Usable range" value={`${result.info.firstUsable} – ${result.info.lastUsable}`} />
            <ResultRow label="Usable hosts" value={String(result.info.usableHosts)} />
          </div>
        )}
      </div>
    </div>
  );
}
