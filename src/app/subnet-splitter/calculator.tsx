'use client';

import { useMemo } from "react";
import { parseIPv4, parsePrefix, splitSubnet } from "@/lib/ipv4";
import { CopyButton, ErrorBox, inputCls, labelCls, usePersistentState } from "@/components/tool-ui";

export default function Calculator() {
  const [net, setNet] = usePersistentState("split:net", "192.168.1.0");
  const [prefix, setPrefix] = usePersistentState("split:prefix", "24");
  const [next, setNext] = usePersistentState("split:next", "26");
  const result = useMemo(() => {
    if (parseIPv4(net) === null) return { list: null, error: "Invalid network IP." };
    if (parsePrefix(prefix) === null || parsePrefix(next) === null) return { list: null, error: "Prefixes must be 0-32, new prefix ≥ current." };
    const list = splitSubnet(net, Number(prefix), Number(next));
    if (!list) return { list: null, error: Number(next) < Number(prefix) ? "New prefix must be ≥ current prefix." : "Too many subnets (cap 1024). Pick closer prefix." };
    return { list, error: "" };
  }, [net, prefix, next]);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className={labelCls}>Network</label><input className={inputCls} value={net} onChange={(e) => setNet(e.target.value)} placeholder="192.168.1.0" /></div>
        <div><label className={labelCls}>Current prefix</label><input className={inputCls} value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="24" /></div>
        <div><label className={labelCls}>New prefix</label><input className={inputCls} value={next} onChange={(e) => setNext(e.target.value)} placeholder="26" /></div>
      </div>
      <div className="mt-3 flex gap-2">
        <CopyButton text={result.list ? result.list.join("\n") : ""} />
        <button type="button" onClick={() => { setNet(""); setPrefix(""); setNext(""); }} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4">
        <ErrorBox message={result.error} />
        {result.list && <p className="mb-2 text-xs text-gray-400">{result.list.length} subnets</p>}
        {result.list && (
          <ul className="grid gap-1.5 font-mono text-sm sm:grid-cols-2">
            {result.list.slice(0, 64).map((s) => <li key={s} className="rounded bg-black/40 px-3 py-1.5 text-gray-200">{s}</li>)}
          </ul>
        )}
        {result.list && result.list.length > 64 && <p className="mt-2 text-xs text-gray-500">Showing 64 of {result.list.length}. Copy for full list.</p>}
      </div>
    </div>
  );
}
