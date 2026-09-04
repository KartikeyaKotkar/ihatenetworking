'use client';

import { useMemo, useState } from "react";
import { buildAcl, type AclAction, type AclProtocol } from "@/lib/cisco";
import { CopyButton, ErrorBox, inputCls, labelCls } from "@/components/tool-ui";

export default function Calculator() {
  const [num, setNum] = useState("100");
  const [action, setAction] = useState<AclAction>("permit");
  const [protocol, setProtocol] = useState<AclProtocol>("tcp");
  const [src, setSrc] = useState("any");
  const [dst, setDst] = useState("any");
  const [port, setPort] = useState("");
  const [remark, setRemark] = useState("");
  const r = useMemo(() => {
    const n = Number(num.trim());
    const res = buildAcl(n, [{ action, protocol, src, dst, port, remark }]);
    if ("error" in res) return { lines: null as string[] | null, error: res.error, text: "" };
    return { lines: res.lines, error: "", text: res.lines.join("\n") };
  }, [num, action, protocol, src, dst, port, remark]);
  return (
    <div>
      <label className={labelCls}>ACL number (100-199)</label>
      <input className={inputCls} value={num} onChange={(e) => setNum(e.target.value)} placeholder="100" inputMode="numeric" />
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Action</label>
          <select className={inputCls} value={action} onChange={(e) => setAction(e.target.value as AclAction)}>
            <option value="permit">permit</option>
            <option value="deny">deny</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Protocol</label>
          <select className={inputCls} value={protocol} onChange={(e) => setProtocol(e.target.value as AclProtocol)}>
            <option value="ip">ip</option>
            <option value="tcp">tcp</option>
            <option value="udp">udp</option>
            <option value="icmp">icmp</option>
          </select>
        </div>
      </div>
      <label className={`${labelCls} mt-3`}>Source (any, host 1.2.3.4, or net wildcard)</label>
      <input className={inputCls} value={src} onChange={(e) => setSrc(e.target.value)} placeholder="any" />
      <label className={`${labelCls} mt-3`}>Destination (any, host 1.2.3.4, or net wildcard)</label>
      <input className={inputCls} value={dst} onChange={(e) => setDst(e.target.value)} placeholder="any" />
      <label className={`${labelCls} mt-3`}>Port (tcp/udp only)</label>
      <input className={inputCls} value={port} onChange={(e) => setPort(e.target.value)} placeholder="eq 80" />
      <label className={`${labelCls} mt-3`}>Remark (optional)</label>
      <input className={inputCls} value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="Allow web" />
      <div className="mt-3 flex gap-2">
        <CopyButton text={r.text} />
        <button type="button" onClick={() => { setNum("100"); setAction("permit"); setProtocol("tcp"); setSrc("any"); setDst("any"); setPort(""); setRemark(""); }} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4"><ErrorBox message={r.error} />
        {r.lines && <pre className="overflow-x-auto rounded-lg bg-black/40 p-4 font-mono text-sm text-zinc-200">{r.text}</pre>}
      </div>
    </div>
  );
}
