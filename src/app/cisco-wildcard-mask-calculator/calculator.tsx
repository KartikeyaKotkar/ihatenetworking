'use client';

import { useMemo, useState } from "react";
import { ciscoWildcard } from "@/lib/cisco";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

export default function Calculator() {
  const [network, setNetwork] = useState("192.168.1.0");
  const [prefix, setPrefix] = useState("24");
  const r = useMemo(() => {
    if (network.trim() === "" || prefix.trim() === "") return { out: null, error: "" };
    const out = ciscoWildcard(network.trim(), Number(prefix.trim().replace(/^\//, "")));
    if (!out) return { out: null, error: "Invalid network or prefix. Use e.g. 192.168.1.0 with prefix 0-32." };
    return { out, error: "" };
  }, [network, prefix]);
  return (
    <div>
      <label className={labelCls}>Network</label>
      <input className={inputCls} value={network} onChange={(e) => setNetwork(e.target.value)} placeholder="192.168.1.0" inputMode="decimal" />
      <label className={`${labelCls} mt-3`}>Prefix length</label>
      <input className={inputCls} value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="24" inputMode="numeric" />
      <div className="mt-3 flex gap-2">
        <CopyButton text={r.out ? r.out.networkStatement : ""} />
        <button type="button" onClick={() => { setNetwork("192.168.1.0"); setPrefix("24"); }} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4"><ErrorBox message={r.error} />
        {r.out && <div className="rounded-lg bg-black/40 p-4">
          <ResultRow label="Subnet mask" value={r.out.mask} />
          <ResultRow label="Wildcard mask" value={r.out.wildcard} />
          <ResultRow label="IOS statement" value={r.out.networkStatement} />
        </div>}
      </div>
    </div>
  );
}
