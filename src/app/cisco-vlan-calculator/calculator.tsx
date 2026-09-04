'use client';

import { useMemo, useState } from "react";
import { vlanInfo } from "@/lib/cisco";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

export default function Calculator() {
  const [id, setId] = useState("10");
  const [name, setName] = useState("");
  const r = useMemo(() => {
    if (id.trim() === "") return { out: null, error: "" };
    const out = vlanInfo(Number(id.trim()), name);
    if (!out) return { out: null, error: "Invalid VLAN ID. Enter an integer 1-4094." };
    return { out, error: "" };
  }, [id, name]);
  return (
    <div>
      <label className={labelCls}>VLAN ID (1-4094)</label>
      <input className={inputCls} value={id} onChange={(e) => setId(e.target.value)} placeholder="10" inputMode="numeric" />
      <label className={`${labelCls} mt-3`}>Name (optional)</label>
      <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="SALES" />
      <div className="mt-3 flex gap-2">
        <CopyButton text={r.out ? r.out.config : ""} />
        <button type="button" onClick={() => { setId("10"); setName(""); }} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4"><ErrorBox message={r.error} />
        {r.out && <div className="rounded-lg bg-black/40 p-4">
          <ResultRow label="Type" value={r.out.label} />
          <pre className="mt-2 overflow-x-auto font-mono text-sm text-zinc-200">{r.out.config}</pre>
        </div>}
      </div>
    </div>
  );
}
