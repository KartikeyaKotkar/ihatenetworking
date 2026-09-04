'use client';

import { useMemo } from "react";
import { parsePrefix, prefixToMaskString, prefixToWildcardString, maskStringToPrefix } from "@/lib/ipv4";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls, usePersistentState } from "@/components/tool-ui";

export default function Calculator() {
  const [val, setVal] = usePersistentState("wild:val", "24");
  const r = useMemo(() => {
    if (val.trim() === "") return { out: null, error: "" };
    let p = parsePrefix(val);
    if (p === null) {
      // try mask string
      const mp = maskStringToPrefix(val.trim());
      if (mp === null) return { out: null, error: "Enter prefix 0-32 or mask like 255.255.255.0." };
      p = mp;
    }
    return { out: { p, mask: prefixToMaskString(p), wild: prefixToWildcardString(p) }, error: "" };
  }, [val]);
  return (
    <div>
      <label className={labelCls}>Prefix or mask</label>
      <input className={inputCls} value={val} onChange={(e) => setVal(e.target.value)} placeholder="24 or 255.255.255.0" />
      <div className="mt-3 flex gap-2">
        <CopyButton text={r.out ? r.out.wild : ""} />
        <button type="button" onClick={() => setVal("")} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4"><ErrorBox message={r.error} />
        {r.out && <div className="rounded-lg bg-black/40 p-4">
          <ResultRow label="Wildcard mask" value={r.out.wild} />
          <ResultRow label="Subnet mask" value={r.out.mask} />
          <ResultRow label="Prefix" value={`/${r.out.p}`} />
        </div>}
      </div>
    </div>
  );
}
