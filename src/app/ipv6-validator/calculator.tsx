'use client';

import { useMemo, useState } from "react";
import { expandIPv6, parseIPv6 } from "@/lib/ipv6";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

export default function Calculator() {
  const [ip, setIp] = useState("2001:db8::1");
  const result = useMemo(() => {
    if (!ip.trim()) return { valid: false, expanded: "", error: "" };
    const n = parseIPv6(ip);
    if (n === null) return { valid: false, expanded: "", error: "Invalid IPv6 address. Check groups, hex digits, and use :: at most once." };
    return { valid: true, expanded: expandIPv6(n), error: "" };
  }, [ip]);

  const copyAll = result.valid ? `Input: ${ip.trim()}\nValid: yes\nExpanded: ${result.expanded}` : "";

  return (
    <div>
      <div>
        <label className={labelCls} htmlFor="ip">IPv6 address</label>
        <input id="ip" className={inputCls} value={ip} onChange={(e) => setIp(e.target.value)} placeholder="2001:db8::1" inputMode="text" />
      </div>
      <div className="mt-3 flex gap-2">
        <CopyButton text={copyAll} />
        <button type="button" onClick={() => setIp("")} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4">
        <ErrorBox message={result.error} />
        {ip.trim() && !result.error && (
          <div className="rounded-lg bg-black/40 p-4">
            <ResultRow label="Valid" value="Yes" />
            <ResultRow label="Expanded" value={result.expanded} />
          </div>
        )}
      </div>
    </div>
  );
}
