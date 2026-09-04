'use client';

import { useMemo, useState } from "react";
import { parseIPv4, scopeOfIPv4 } from "@/lib/ipv4";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

export default function Calculator() {
  const [ip, setIp] = useState("192.168.1.10");
  const result = useMemo(() => {
    if (!ip.trim()) return { info: null, error: "" };
    const n = parseIPv4(ip);
    if (n === null) return { info: null, error: "Invalid IPv4 address. Use 4 octets 0-255, e.g. 192.168.1.10." };
    return { info: scopeOfIPv4(n), error: "" };
  }, [ip]);

  const copyAll = result.info
    ? `IP: ${ip.trim()}\nPrivate: ${result.info.private ? "yes" : "no"}\nScope: ${result.info.scope}\n${result.info.label}`
    : "";

  return (
    <div>
      <div>
        <label className={labelCls} htmlFor="ip">IP address</label>
        <input id="ip" className={inputCls} value={ip} onChange={(e) => setIp(e.target.value)} placeholder="192.168.1.10" inputMode="decimal" />
      </div>
      <div className="mt-3 flex gap-2">
        <CopyButton text={copyAll} />
        <button type="button" onClick={() => setIp("")} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4">
        <ErrorBox message={result.error} />
        {result.info && (
          <div className="rounded-lg bg-black/40 p-4">
            <ResultRow label="Private (RFC 1918)" value={result.info.private ? "Yes" : "No"} />
            <ResultRow label="Scope" value={result.info.scope} />
            <ResultRow label="Classification" value={result.info.label} />
          </div>
        )}
      </div>
    </div>
  );
}
