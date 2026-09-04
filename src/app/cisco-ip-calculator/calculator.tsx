'use client';

import { useMemo, useState } from "react";
import { ciscoIp } from "@/lib/cisco";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

const RANGES: Record<string, string> = { A: "0-127", B: "128-191", C: "192-223", D: "224-239", E: "240-255" };

export default function Calculator() {
  const [val, setVal] = useState("10.1.2.3");
  const r = useMemo(() => {
    if (val.trim() === "") return { info: null, error: "" };
    const info = ciscoIp(val);
    if (!info) return { info: null, error: "Invalid IPv4 address." };
    return { info, error: "" };
  }, [val]);
  return (
    <div>
      <label className={labelCls}>IP address</label>
      <input className={inputCls} value={val} onChange={(e) => setVal(e.target.value)} placeholder="10.1.2.3" inputMode="decimal" />
      <div className="mt-3 flex gap-2">
        <CopyButton text={r.info ? `Class ${r.info.cls}, mask ${r.info.defaultMask ?? "N/A"}` : ""} />
        <button type="button" onClick={() => setVal("")} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4"><ErrorBox message={r.error} />
        {r.info && <div className="rounded-lg bg-black/40 p-4">
          <ResultRow label="Class" value={r.info.cls} />
          <ResultRow label="Default mask" value={r.info.defaultMask ?? "N/A (Class D/E)"} />
          <ResultRow label="First-octet range" value={RANGES[r.info.cls] ?? "—"} />
          <ResultRow label="Classful" value={r.info.classful ? "Yes (A/B/C)" : "No (D/E)"} />
        </div>}
      </div>
    </div>
  );
}
