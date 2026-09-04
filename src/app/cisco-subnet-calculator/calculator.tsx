'use client';

import { useMemo, useState } from "react";
import { ciscoSubnet } from "@/lib/cisco";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

export default function Calculator() {
  const [ip, setIp] = useState("192.168.1.10");
  const [prefix, setPrefix] = useState("24");
  const r = useMemo(() => {
    if (ip.trim() === "" || prefix.trim() === "") return { out: null, error: "" };
    const out = ciscoSubnet(ip.trim(), Number(prefix.trim().replace(/^\//, "")));
    if (!out) return { out: null, error: "Invalid IP or prefix. Use e.g. 192.168.1.10 with prefix 0-32." };
    return { out, error: "" };
  }, [ip, prefix]);
  const copyText = r.out ? `${r.out.ipCommand}\n${r.out.networkCommand}` : "";
  return (
    <div>
      <label className={labelCls}>IP address</label>
      <input className={inputCls} value={ip} onChange={(e) => setIp(e.target.value)} placeholder="192.168.1.10" inputMode="decimal" />
      <label className={`${labelCls} mt-3`}>Prefix length</label>
      <input className={inputCls} value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="24" inputMode="numeric" />
      <div className="mt-3 flex gap-2">
        <CopyButton text={copyText} />
        <button type="button" onClick={() => { setIp("192.168.1.10"); setPrefix("24"); }} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4"><ErrorBox message={r.error} />
        {r.out && <div className="rounded-lg bg-black/40 p-4">
          <ResultRow label="Network" value={`${r.out.network}/${r.out.prefix}`} />
          <ResultRow label="Subnet mask" value={r.out.mask} />
          <ResultRow label="Wildcard" value={r.out.wildcard} />
          <ResultRow label="Usable range" value={`${r.out.firstUsable} - ${r.out.lastUsable}`} />
          <ResultRow label="Hosts" value={String(r.out.usableHosts)} />
          <ResultRow label="IOS ip address" value={r.out.ipCommand} />
          <ResultRow label="IOS network" value={r.out.networkCommand} />
        </div>}
      </div>
    </div>
  );
}
