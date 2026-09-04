'use client';

import { useMemo, useState } from "react";
import { describeSubnet, parseIPv4, parsePrefix } from "@/lib/ipv4";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

export default function Calculator() {
  const [ip, setIp] = useState("192.168.1.10");
  const [prefix, setPrefix] = useState("24");
  const result = useMemo(() => {
    if (!ip.trim() && !prefix.trim()) return { info: null, error: "" };
    if (parseIPv4(ip) === null) return { info: null, error: "Invalid IPv4 address. Use 4 octets 0-255, e.g. 192.168.1.10." };
    if (parsePrefix(prefix) === null) return { info: null, error: "Invalid prefix. Use 0-32, e.g. 24." };
    const info = describeSubnet(ip, Number(prefix));
    if (!info) return { info: null, error: "Could not calculate subnet." };
    return { info, error: "" };
  }, [ip, prefix]);

  const copyAll = result.info
    ? `Network: ${result.info.network}/${result.info.prefix}\nMask: ${result.info.mask}\nRange: ${result.info.firstUsable} - ${result.info.lastUsable}\nBroadcast: ${result.info.broadcast}`
    : "";

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="ip">IP address</label>
          <input id="ip" className={inputCls} value={ip} onChange={(e) => setIp(e.target.value)} placeholder="192.168.1.10" inputMode="decimal" />
        </div>
        <div>
          <label className={labelCls} htmlFor="prefix">Prefix (CIDR)</label>
          <input id="prefix" className={inputCls} value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="24" inputMode="numeric" />
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <CopyButton text={copyAll} />
        <button type="button" onClick={() => { setIp(""); setPrefix(""); }} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4">
        <ErrorBox message={result.error} />
        {result.info && (
          <div className="rounded-lg bg-black/40 p-4">
            <ResultRow label="Network" value={`${result.info.network}/${result.info.prefix}`} />
            <ResultRow label="Subnet mask" value={result.info.mask} />
            <ResultRow label="Wildcard" value={result.info.wildcard} />
            <ResultRow label="Broadcast" value={result.info.broadcast} />
            <ResultRow label="First usable" value={result.info.firstUsable} />
            <ResultRow label="Last usable" value={result.info.lastUsable} />
            <ResultRow label="Usable hosts" value={String(result.info.usableHosts)} />
            <ResultRow label="Total addresses" value={String(result.info.totalAddresses)} />
            <ResultRow label="Class" value={result.info.ipClass} />
          </div>
        )}
      </div>
    </div>
  );
}
