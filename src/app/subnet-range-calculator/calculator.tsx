'use client';

import { useMemo } from "react";
import { describeSubnet, parseIPv4, parsePrefix } from "@/lib/ipv4";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls, usePersistentState } from "@/components/tool-ui";

export default function Calculator() {
  const [ip, setIp] = usePersistentState("range:ip", "192.168.1.50");
  const [prefix, setPrefix] = usePersistentState("range:prefix", "24");
  const r = useMemo(() => {
    if (parseIPv4(ip) === null) return { info: null, error: "Invalid IP." };
    if (parsePrefix(prefix) === null) return { info: null, error: "Invalid prefix 0-32." };
    return { info: describeSubnet(ip, Number(prefix)), error: "" };
  }, [ip, prefix]);
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className={labelCls}>IP in range</label><input className={inputCls} value={ip} onChange={(e) => setIp(e.target.value)} placeholder="192.168.1.50" /></div>
        <div><label className={labelCls}>Prefix</label><input className={inputCls} value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="24" /></div>
      </div>
      <div className="mt-3 flex gap-2">
        <CopyButton text={r.info ? `${r.info.firstUsable} - ${r.info.lastUsable}` : ""} />
        <button type="button" onClick={() => { setIp(""); setPrefix(""); }} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4"><ErrorBox message={r.error} />
        {r.info && <div className="rounded-lg bg-black/40 p-4">
          <ResultRow label="Network" value={`${r.info.network}/${r.info.prefix}`} />
          <ResultRow label="First usable" value={r.info.firstUsable} />
          <ResultRow label="Last usable" value={r.info.lastUsable} />
          <ResultRow label="Broadcast" value={r.info.broadcast} />
          <ResultRow label="Usable count" value={String(r.info.usableHosts)} />
        </div>}
      </div>
    </div>
  );
}
