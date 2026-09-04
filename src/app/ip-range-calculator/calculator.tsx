'use client';

import { useMemo } from "react";
import { describeIPRange, parseIPv4 } from "@/lib/ipv4";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls, usePersistentState } from "@/components/tool-ui";

export default function Calculator() {
  const [start, setStart] = usePersistentState("iprange:start", "192.168.1.1");
  const [end, setEnd] = usePersistentState("iprange:end", "192.168.1.254");
  const result = useMemo(() => {
    if (!start.trim() && !end.trim()) return { info: null, error: "" };
    if (parseIPv4(start) === null) return { info: null, error: "Invalid start IP. Use 4 octets 0-255, e.g. 192.168.1.1." };
    if (parseIPv4(end) === null) return { info: null, error: "Invalid end IP. Use 4 octets 0-255, e.g. 192.168.1.254." };
    const info = describeIPRange(start, end);
    if (!info) return { info: null, error: "Start must be ≤ end. Swap the addresses or narrow the range." };
    return { info, error: "" };
  }, [start, end]);

  const copyAll = result.info ? `Range: ${result.info.start} - ${result.info.end}\nCount: ${result.info.count}` : "";

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="start">Start IP</label>
          <input id="start" className={inputCls} value={start} onChange={(e) => setStart(e.target.value)} placeholder="192.168.1.1" inputMode="decimal" />
        </div>
        <div>
          <label className={labelCls} htmlFor="end">End IP</label>
          <input id="end" className={inputCls} value={end} onChange={(e) => setEnd(e.target.value)} placeholder="192.168.1.254" inputMode="decimal" />
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <CopyButton text={copyAll} />
        <button type="button" onClick={() => { setStart(""); setEnd(""); }} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4">
        <ErrorBox message={result.error} />
        {result.info && (
          <div className="rounded-lg bg-black/40 p-4">
            <ResultRow label="First" value={result.info.start} />
            <ResultRow label="Last" value={result.info.end} />
            <ResultRow label="Count" value={String(result.info.count)} />
          </div>
        )}
      </div>
    </div>
  );
}
