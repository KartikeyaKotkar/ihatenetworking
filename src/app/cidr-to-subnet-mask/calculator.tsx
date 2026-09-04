'use client';

import { useMemo, useState } from "react";
import { parsePrefix, prefixToMaskString, prefixToWildcardString } from "@/lib/ipv4";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

export default function Calculator() {
  const [val, setVal] = useState("24");
  const r = useMemo(() => {
    const p = parsePrefix(val.replace(/^\//, ""));
    if (val.trim() === "") return { p: null, error: "" };
    if (p === null) return { p: null, error: "Invalid CIDR prefix 0-32." };
    return { p, error: "" };
  }, [val]);
  return (
    <div>
      <label className={labelCls}>CIDR prefix</label>
      <input className={inputCls} value={val} onChange={(e) => setVal(e.target.value)} placeholder="24" inputMode="numeric" />
      <div className="mt-3 flex gap-2">
        <CopyButton text={r.p !== null ? prefixToMaskString(r.p) : ""} />
        <button type="button" onClick={() => setVal("")} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4"><ErrorBox message={r.error} />
        {r.p !== null && <div className="rounded-lg bg-black/40 p-4">
          <ResultRow label="Subnet mask" value={prefixToMaskString(r.p)} />
          <ResultRow label="Wildcard" value={prefixToWildcardString(r.p)} />
        </div>}
      </div>
    </div>
  );
}
