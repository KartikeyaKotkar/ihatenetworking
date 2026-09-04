'use client';

import { useMemo, useState } from "react";
import { describeIPRange, generateIPRange, parseIPv4 } from "@/lib/ipv4";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

const LIMIT = 256;

export default function Calculator() {
  const [start, setStart] = useState("192.168.1.1");
  const [end, setEnd] = useState("192.168.1.5");
  const result = useMemo(() => {
    if (!start.trim() && !end.trim()) return { list: null as string[] | null, error: "" };
    if (parseIPv4(start) === null) return { list: null, error: "Invalid start IP. Use 4 octets 0-255, e.g. 192.168.1.1." };
    if (parseIPv4(end) === null) return { list: null, error: "Invalid end IP. Use 4 octets 0-255, e.g. 192.168.1.5." };
    const info = describeIPRange(start, end);
    if (!info) return { list: null, error: "Start must be ≤ end. Swap the addresses or narrow the range." };
    if (info.count > LIMIT)
      return { list: null, error: `Range has ${info.count} addresses — over the ${LIMIT} limit. Narrow the range and try again.` };
    return { list: generateIPRange(start, end, LIMIT), error: "" };
  }, [start, end]);

  const copyAll = result.list ? result.list.join("\n") : "";

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="start">Start IP</label>
          <input id="start" className={inputCls} value={start} onChange={(e) => setStart(e.target.value)} placeholder="192.168.1.1" inputMode="decimal" />
        </div>
        <div>
          <label className={labelCls} htmlFor="end">End IP</label>
          <input id="end" className={inputCls} value={end} onChange={(e) => setEnd(e.target.value)} placeholder="192.168.1.5" inputMode="decimal" />
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <CopyButton text={copyAll} />
        <button type="button" onClick={() => { setStart(""); setEnd(""); }} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4">
        <ErrorBox message={result.error} />
        {result.list && (
          <div className="rounded-lg bg-black/40 p-4">
            <ResultRow label="Count" value={String(result.list.length)} />
            <div className="mt-2 max-h-64 overflow-y-auto rounded-md bg-black/50 p-3 font-mono text-sm text-gray-100">
              {result.list.map((ip) => (
                <div key={ip}>{ip}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
