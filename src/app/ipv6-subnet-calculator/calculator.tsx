'use client';

import { useMemo, useState } from "react";
import { describeIPv6Subnet, parseIPv6, parseIPv6Prefix } from "@/lib/ipv6";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

export default function Calculator() {
  const [ip, setIp] = useState("2001:db8::1");
  const [prefix, setPrefix] = useState("64");
  const result = useMemo(() => {
    if (!ip.trim() && !prefix.trim()) return { info: null, error: "" };
    if (parseIPv6(ip) === null) return { info: null, error: "Invalid IPv6 address, e.g. 2001:db8::1." };
    if (parseIPv6Prefix(prefix) === null) return { info: null, error: "Invalid prefix. Use 0-128, e.g. 64." };
    const info = describeIPv6Subnet(ip, Number(prefix));
    if (!info) return { info: null, error: "Could not calculate subnet." };
    return { info, error: "" };
  }, [ip, prefix]);

  const copyAll = result.info
    ? `Network: ${result.info.network}/${result.info.prefix}\nLast: ${result.info.lastAddress}\nTotal: ${result.info.totalAddresses.toString()}`
    : "";

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="ip">IPv6 address</label>
          <input id="ip" className={inputCls} value={ip} onChange={(e) => setIp(e.target.value)} placeholder="2001:db8::1" inputMode="text" />
        </div>
        <div>
          <label className={labelCls} htmlFor="prefix">Prefix</label>
          <input id="prefix" className={inputCls} value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="64" inputMode="numeric" />
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
            <ResultRow label="Network (expanded)" value={result.info.networkExpanded} />
            <ResultRow label="Last address" value={result.info.lastAddress} />
            <ResultRow label="Last (expanded)" value={result.info.lastExpanded} />
            <ResultRow label="Total addresses" value={result.info.totalAddresses.toString()} />
          </div>
        )}
      </div>
    </div>
  );
}
