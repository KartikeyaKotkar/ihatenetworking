'use client';

import { useMemo } from "react";
import { validateIPv4Detailed, ipv4ToString } from "@/lib/ipv4";
import { CopyButton, ResultRow, inputCls, labelCls, usePersistentState } from "@/components/tool-ui";

export default function Calculator() {
  const [ip, setIp] = usePersistentState("validator:ip", "192.168.1.256");
  const result = useMemo(() => validateIPv4Detailed(ip), [ip]);
  const copyAll = result.valid
    ? `Valid: ${ip.trim()} (${result.value !== null ? ipv4ToString(result.value) : ""})`
    : `Invalid: ${ip.trim()} — ${result.reason}`;

  return (
    <div>
      <div>
        <label className={labelCls} htmlFor="ip">IP address</label>
        <input id="ip" className={inputCls} value={ip} onChange={(e) => setIp(e.target.value)} placeholder="192.168.1.1" inputMode="decimal" />
      </div>
      <div className="mt-3 flex gap-2">
        <CopyButton text={copyAll} />
        <button type="button" onClick={() => setIp("")} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4">
        <div className="rounded-lg bg-black/40 p-4">
          <ResultRow label="Status" value={result.valid ? "Valid" : "Invalid"} />
          <ResultRow label="Reason" value={result.reason} />
          {result.valid && result.value !== null && (
            <ResultRow label="Numeric value" value={String(result.value >>> 0)} />
          )}
        </div>
      </div>
    </div>
  );
}
