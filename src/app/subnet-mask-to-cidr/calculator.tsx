'use client';

import { useMemo, useState } from "react";
import { maskStringToPrefix } from "@/lib/ipv4";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

export default function Calculator() {
  const [val, setVal] = useState("255.255.255.0");
  const r = useMemo(() => {
    if (val.trim() === "") return { p: null, error: "" };
    const p = maskStringToPrefix(val);
    if (p === null) return { p: null, error: "Invalid or non-contiguous mask. Masks must be ones then zeros." };
    return { p, error: "" };
  }, [val]);
  return (
    <div>
      <label className={labelCls}>Subnet mask</label>
      <input className={inputCls} value={val} onChange={(e) => setVal(e.target.value)} placeholder="255.255.255.0" />
      <div className="mt-3 flex gap-2">
        <CopyButton text={r.p !== null ? `/${r.p}` : ""} />
        <button type="button" onClick={() => setVal("")} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4"><ErrorBox message={r.error} />
        {r.p !== null && <div className="rounded-lg bg-black/40 p-4">
          <ResultRow label="CIDR prefix" value={`/${r.p}`} />
        </div>}
      </div>
    </div>
  );
}
