'use client';

import { useMemo, useState } from "react";
import { parseIPv4, parsePrefix, networkAddressInt, ipv4ToString } from "@/lib/ipv4";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

export default function Calculator() {
  const [ip, setIp] = useState("192.168.1.130");
  const [prefix, setPrefix] = useState("25");
  const r = useMemo(() => {
    const a = parseIPv4(ip);
    const p = parsePrefix(prefix);
    if (ip.trim() === "" && prefix.trim() === "") return { net: null, error: "" };
    if (a === null) return { net: null, error: "Invalid IPv4 address." };
    if (p === null) return { net: null, error: "Invalid prefix 0-32." };
    return { net: ipv4ToString(networkAddressInt(a, p)), error: "" };
  }, [ip, prefix]);
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className={labelCls}>IP address</label><input className={inputCls} value={ip} onChange={(e) => setIp(e.target.value)} placeholder="192.168.1.130" /></div>
        <div><label className={labelCls}>Prefix</label><input className={inputCls} value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="25" /></div>
      </div>
      <div className="mt-3 flex gap-2">
        <CopyButton text={r.net ?? ""} />
        <button type="button" onClick={() => { setIp(""); setPrefix(""); }} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4"><ErrorBox message={r.error} />
        {r.net && <div className="rounded-lg bg-black/40 p-4"><ResultRow label="Network address" value={r.net} /></div>}
      </div>
    </div>
  );
}
