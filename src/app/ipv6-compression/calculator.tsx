'use client';

import { useMemo, useState } from "react";
import { compressIPv6, expandIPv6, parseIPv6 } from "@/lib/ipv6";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

export default function Calculator() {
  const [ip, setIp] = useState("2001:0db8:0000:0000:0000:0000:0000:0001");
  const result = useMemo(() => {
    if (!ip.trim()) return { expanded: "", compressed: "", error: "" };
    const n = parseIPv6(ip);
    if (n === null) return { expanded: "", compressed: "", error: "Invalid IPv6 address. Accepts compressed or expanded form." };
    return { expanded: expandIPv6(n), compressed: compressIPv6(n), error: "" };
  }, [ip]);

  const copyAll = result.expanded ? `Expanded: ${result.expanded}\nCompressed: ${result.compressed}` : "";

  return (
    <div>
      <div>
        <label className={labelCls} htmlFor="ip">IPv6 address (either form)</label>
        <input id="ip" className={inputCls} value={ip} onChange={(e) => setIp(e.target.value)} placeholder="2001:db8::1" inputMode="text" />
      </div>
      <div className="mt-3 flex gap-2">
        <CopyButton text={copyAll} />
        <button type="button" onClick={() => setIp("")} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4">
        <ErrorBox message={result.error} />
        {result.expanded && (
          <div className="rounded-lg bg-black/40 p-4">
            <ResultRow label="Compressed (RFC 5952)" value={result.compressed} />
            <ResultRow label="Expanded" value={result.expanded} />
          </div>
        )}
      </div>
    </div>
  );
}
