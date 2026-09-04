'use client';

import { useMemo, useState } from "react";
import { interfaceRange, type IfType } from "@/lib/cisco";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

const TYPES: IfType[] = ["GigabitEthernet", "FastEthernet", "TenGigabitEthernet", "Serial", "Loopback", "Vlan"];

export default function Calculator() {
  const [type, setType] = useState<IfType>("GigabitEthernet");
  const [slot, setSlot] = useState("0");
  const [start, setStart] = useState("1");
  const [end, setEnd] = useState("24");
  const r = useMemo(() => {
    if (slot.trim() === "" || start.trim() === "" || end.trim() === "")
      return { out: null as string | null, error: "" };
    const s = Number(start.trim());
    const e = Number(end.trim());
    if (!Number.isInteger(s) || !Number.isInteger(e))
      return { out: null, error: "Start and end ports must be integers." };
    if (s > e) return { out: null, error: "Start port must be ≤ end port." };
    if (e - s > 200) return { out: null, error: "Span too large. Keep end − start ≤ 200." };
    const out = interfaceRange(type, Number(slot.trim()), s, e);
    if (!out) return { out: null, error: "Invalid input. Slot and ports must be 0-4094." };
    return { out, error: "" };
  }, [type, slot, start, end]);
  return (
    <div>
      <label className={labelCls}>Interface type</label>
      <select className={inputCls} value={type} onChange={(e) => setType(e.target.value as IfType)}>
        {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
      <label className={`${labelCls} mt-3`}>Slot / module</label>
      <input className={inputCls} value={slot} onChange={(e) => setSlot(e.target.value)} placeholder="0" inputMode="numeric" />
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Start port</label>
          <input className={inputCls} value={start} onChange={(e) => setStart(e.target.value)} placeholder="1" inputMode="numeric" />
        </div>
        <div>
          <label className={labelCls}>End port</label>
          <input className={inputCls} value={end} onChange={(e) => setEnd(e.target.value)} placeholder="24" inputMode="numeric" />
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <CopyButton text={r.out ?? ""} />
        <button type="button" onClick={() => { setType("GigabitEthernet"); setSlot("0"); setStart("1"); setEnd("24"); }} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4"><ErrorBox message={r.error} />
        {r.out && <div className="rounded-lg bg-black/40 p-4">
          <ResultRow label="IOS command" value={r.out} />
        </div>}
      </div>
    </div>
  );
}
