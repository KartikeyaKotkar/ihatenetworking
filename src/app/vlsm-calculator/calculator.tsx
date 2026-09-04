'use client';

import { useMemo } from "react";
import { parseIPv4, parsePrefix, vlsmAllocate } from "@/lib/ipv4";
import { CopyButton, ErrorBox, inputCls, labelCls, usePersistentState } from "@/components/tool-ui";

export default function Calculator() {
  const [base, setBase] = usePersistentState("vlsm:base", "192.168.1.0");
  const [prefix, setPrefix] = usePersistentState("vlsm:prefix", "24");
  const [hosts, setHosts] = usePersistentState("vlsm:hosts", "100, 50, 10");
  const result = useMemo(() => {
    if (parseIPv4(base) === null) return { blocks: null, error: "Invalid base network IP." };
    if (parsePrefix(prefix) === null) return { blocks: null, error: "Invalid base prefix 0-32." };
    const list = hosts.split(/[\s,;]+/).filter(Boolean).map(Number);
    if (list.length === 0) return { blocks: null, error: "" };
    if (list.some((h) => !Number.isInteger(h) || h < 1)) return { blocks: null, error: "Host counts must be positive integers, comma separated." };
    const blocks = vlsmAllocate(base, Number(prefix), list);
    if (!blocks) return { blocks: null, error: "Does not fit. Reduce host counts or use larger base network." };
    return { blocks, error: "" };
  }, [base, prefix, hosts]);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelCls} htmlFor="base">Base network</label>
          <input id="base" className={inputCls} value={base} onChange={(e) => setBase(e.target.value)} placeholder="192.168.1.0" />
        </div>
        <div>
          <label className={labelCls} htmlFor="pfx">Base prefix</label>
          <input id="pfx" className={inputCls} value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="24" />
        </div>
        <div>
          <label className={labelCls} htmlFor="hosts">Hosts needed (comma sep.)</label>
          <input id="hosts" className={inputCls} value={hosts} onChange={(e) => setHosts(e.target.value)} placeholder="100, 50, 10" />
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <CopyButton text={result.blocks ? result.blocks.map((b) => `${b.network} (${b.requestedHosts} hosts → ${b.usableHosts} usable) range ${b.firstUsable}-${b.lastUsable}`).join("\n") : ""} />
        <button type="button" onClick={() => { setBase(""); setPrefix(""); setHosts(""); }} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4">
        <ErrorBox message={result.error} />
        {result.blocks && (
          <div className="overflow-x-auto rounded-lg bg-black/40">
            <table className="w-full text-left font-mono text-xs">
              <thead><tr className="text-gray-500">
                <th className="px-3 py-2">Network</th><th className="px-3 py-2">Mask</th><th className="px-3 py-2">Range</th><th className="px-3 py-2">Need/Fit</th>
              </tr></thead>
              <tbody>
                {result.blocks.map((b) => (
                  <tr key={b.network} className="border-t border-white/5 text-gray-200">
                    <td className="px-3 py-2">{b.network}</td>
                    <td className="px-3 py-2">{b.mask}</td>
                    <td className="px-3 py-2">{b.firstUsable}–{b.lastUsable}</td>
                    <td className="px-3 py-2">{b.requestedHosts}/{b.usableHosts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
