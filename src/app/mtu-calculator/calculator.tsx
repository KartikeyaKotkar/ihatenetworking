'use client';

import { useMemo, useState } from "react";
import { effectiveMtu } from "@/lib/netcalc";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

const OPTIONS = [
  { label: "PPPoE", bytes: 8 },
  { label: "VLAN", bytes: 4 },
  { label: "GRE", bytes: 24 },
  { label: "VXLAN", bytes: 50 },
  { label: "IPsec", bytes: 73 },
];

export default function Calculator() {
  const [base, setBase] = useState("1500");
  const [sel, setSel] = useState<string[]>(["PPPoE"]);
  const toggle = (name: string) => setSel((p) => (p.includes(name) ? p.filter((s) => s !== name) : [...p, name]));
  const r = useMemo(() => {
    if (base.trim() === "") return { mtu: null as number | null, error: "" };
    const b = Number(base.trim());
    if (!Number.isInteger(b)) return { mtu: null, error: "Base MTU must be an integer 68-9000." };
    const ohs = OPTIONS.filter((o) => sel.includes(o.label)).map((o) => o.bytes);
    const mtu = effectiveMtu(b, ohs);
    if (mtu === null) return { mtu: null, error: "Invalid: base MTU 68-9000 and result must stay ≥ 68." };
    return { mtu, error: "" };
  }, [base, sel]);
  return (
    <div>
      <label className={labelCls}>Base MTU</label>
      <input className={inputCls} value={base} onChange={(e) => setBase(e.target.value)} placeholder="1500" inputMode="numeric" />
      <span className={`${labelCls} mt-4`}>Overheads</span>
      <div className="mt-1 space-y-1.5">
        {OPTIONS.map((o) => (
          <label key={o.label} className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" checked={sel.includes(o.label)} onChange={() => toggle(o.label)} className="accent-emerald-400" />
            {o.label} ({o.bytes} B)
          </label>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <CopyButton text={r.mtu !== null ? String(r.mtu) : ""} />
        <button type="button" onClick={() => { setBase("1500"); setSel([]); }} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4"><ErrorBox message={r.error} />
        {r.mtu !== null && <div className="rounded-lg bg-black/40 p-4">
          <ResultRow label="Effective MTU" value={`${r.mtu} B`} />
          <ResultRow label="Note" value={r.mtu < 1280 ? "Below IPv6 minimum (1280)" : "Fits standard Ethernet frame"} />
        </div>}
      </div>
    </div>
  );
}
