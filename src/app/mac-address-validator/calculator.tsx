'use client';

import { useMemo, useState } from "react";
import { validateMacDetailed } from "@/lib/mac";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

export default function Calculator() {
  const [val, setVal] = useState("00:1B:44:11:3A:B7");
  const r = useMemo(() => validateMacDetailed(val), [val]);
  return (
    <div>
      <label className={labelCls}>MAC address</label>
      <input className={inputCls} value={val} onChange={(e) => setVal(e.target.value)} placeholder="00:1B:44:11:3A:B7" spellCheck={false} />
      <div className="mt-3 flex gap-2">
        <CopyButton text={r.reason} />
        <button type="button" onClick={() => setVal("")} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4"><ErrorBox message={!r.valid && val.trim() !== "" ? r.reason : ""} />
        {(val.trim() === "" || r.valid) && <div className="rounded-lg bg-black/40 p-4">
          <ResultRow label="Valid" value={r.valid ? "Yes" : "—"} />
          <ResultRow label="Reason" value={r.reason} />
        </div>}
        {!r.valid && val.trim() !== "" && <div className="rounded-lg bg-black/40 p-4">
          <ResultRow label="Valid" value="No" />
          <ResultRow label="Reason" value={r.reason} />
        </div>}
      </div>
    </div>
  );
}
