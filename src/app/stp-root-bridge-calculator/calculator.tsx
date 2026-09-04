'use client';

import { useMemo, useState } from "react";
import { stpEffectivePriority, stpWinner } from "@/lib/cisco";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

function bridgeVals(prio: string, vlan: string, mac: string) {
  const p = Number(prio);
  const v = Number(vlan);
  const eff = stpEffectivePriority(p, v);
  return { p, v, mac, eff };
}

export default function Calculator() {
  const [prioA, setPrioA] = useState("32768");
  const [vlanA, setVlanA] = useState("1");
  const [macA, setMacA] = useState("AA:BB:CC:00:11:22");
  const [prioB, setPrioB] = useState("28672");
  const [vlanB, setVlanB] = useState("1");
  const [macB, setMacB] = useState("AA:BB:CC:00:11:33");
  const { a, b } = useMemo(() => ({
    a: bridgeVals(prioA, vlanA, macA),
    b: bridgeVals(prioB, vlanB, macB),
  }), [prioA, vlanA, macA, prioB, vlanB, macB]);
  const error = !Number.isInteger(a.p) || !Number.isInteger(a.v) || a.eff === null
    ? "Bridge A: priority must be a multiple of 4096 (0-61440), VLAN 1-4094."
    : !Number.isInteger(b.p) || !Number.isInteger(b.v) || b.eff === null
      ? "Bridge B: priority must be a multiple of 4096 (0-61440), VLAN 1-4094."
      : "";
  const verdict = error ? null : stpWinner({ priority: a.p, vlan: a.v, mac: a.mac }, { priority: b.p, vlan: b.v, mac: b.mac });
  const reset = () => { setPrioA("32768"); setVlanA("1"); setMacA("AA:BB:CC:00:11:22"); setPrioB("28672"); setVlanB("1"); setMacB("AA:BB:CC:00:11:33"); };
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-300">Bridge A</h2>
          <label className={`${labelCls} mt-2`}>Priority</label><input className={inputCls} value={prioA} onChange={(e) => setPrioA(e.target.value)} placeholder="32768" inputMode="numeric" />
          <label className={`${labelCls} mt-2`}>VLAN</label><input className={inputCls} value={vlanA} onChange={(e) => setVlanA(e.target.value)} placeholder="1" inputMode="numeric" />
          <label className={`${labelCls} mt-2`}>MAC</label><input className={inputCls} value={macA} onChange={(e) => setMacA(e.target.value)} placeholder="AA:BB:CC:00:11:22" />
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-300">Bridge B</h2>
          <label className={`${labelCls} mt-2`}>Priority</label><input className={inputCls} value={prioB} onChange={(e) => setPrioB(e.target.value)} placeholder="28672" inputMode="numeric" />
          <label className={`${labelCls} mt-2`}>VLAN</label><input className={inputCls} value={vlanB} onChange={(e) => setVlanB(e.target.value)} placeholder="1" inputMode="numeric" />
          <label className={`${labelCls} mt-2`}>MAC</label><input className={inputCls} value={macB} onChange={(e) => setMacB(e.target.value)} placeholder="AA:BB:CC:00:11:33" />
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <CopyButton text={verdict ?? ""} />
        <button type="button" onClick={reset} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4"><ErrorBox message={error} />
        {!error && verdict && <div className="rounded-lg bg-black/40 p-4">
          <ResultRow label="A effective priority" value={a.eff !== null ? String(a.eff) : "—"} />
          <ResultRow label="B effective priority" value={b.eff !== null ? String(b.eff) : "—"} />
          <ResultRow label="Winner" value={verdict} />
          <p className="mt-2 text-xs text-gray-500">Election order: lowest effective priority first, then lowest MAC.</p>
        </div>}
      </div>
    </div>
  );
}
