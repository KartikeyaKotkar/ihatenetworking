'use client';

import { useMemo, useState } from "react";
import { binToHex } from "@/lib/converters";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

export default function Calculator() {
  const [val, setVal] = useState("11111111");
  const r = useMemo(() => {
    if (val.trim() === "") return { out: null as string | null, error: "" };
    const out = binToHex(val);
    if (out === null) return { out: null as string | null, error: "Invalid binary. Use only 0 and 1, optional 0b prefix." };
    return { out, error: "" };
  }, [val]);
  return (
    <div>
      <label className={labelCls}>Binary</label>
      <input className={inputCls} value={val} onChange={(e) => setVal(e.target.value)} placeholder="11111111" inputMode="numeric" spellCheck={false} />
      <div className="mt-3 flex gap-2">
        <CopyButton text={r.out ?? ""} />
        <button type="button" onClick={() => setVal("")} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4"><ErrorBox message={r.error} />
        {r.out !== null && <div className="rounded-lg bg-black/40 p-4">
          <ResultRow label="Hexadecimal" value={r.out} />
        </div>}
      </div>
    </div>
  );
}
