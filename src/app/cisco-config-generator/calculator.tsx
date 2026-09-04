'use client';

import { useMemo, useState } from "react";
import { buildConfig } from "@/lib/cisco";
import { CopyButton, ErrorBox, inputCls, labelCls } from "@/components/tool-ui";

export default function Calculator() {
  const [hostname, setHostname] = useState("Router1");
  const [name, setName] = useState("GigabitEthernet0/0");
  const [ip, setIp] = useState("192.168.1.1");
  const [mask, setMask] = useState("255.255.255.0");
  const [desc, setDesc] = useState("");
  const [route, setRoute] = useState("");
  const r = useMemo(
    () => buildConfig(hostname, [{ name, ip, mask, desc }], route),
    [hostname, name, ip, mask, desc, route]
  );
  const config = "config" in r ? r.config : "";
  const error = "error" in r ? r.error : "";
  const reset = () => { setHostname("Router1"); setName("GigabitEthernet0/0"); setIp("192.168.1.1"); setMask("255.255.255.0"); setDesc(""); setRoute(""); };
  return (
    <div>
      <label className={labelCls}>Hostname</label>
      <input className={inputCls} value={hostname} onChange={(e) => setHostname(e.target.value)} placeholder="Router1" />
      <div className="mt-3 grid gap-3">
        <div><label className={labelCls}>Interface name</label><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="GigabitEthernet0/0" /></div>
        <div><label className={labelCls}>IP address</label><input className={inputCls} value={ip} onChange={(e) => setIp(e.target.value)} placeholder="192.168.1.1" inputMode="decimal" /></div>
        <div><label className={labelCls}>Subnet mask</label><input className={inputCls} value={mask} onChange={(e) => setMask(e.target.value)} placeholder="255.255.255.0" inputMode="decimal" /></div>
        <div><label className={labelCls}>Description (optional)</label><input className={inputCls} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="LAN link" /></div>
        <div><label className={labelCls}>Default route next-hop (optional)</label><input className={inputCls} value={route} onChange={(e) => setRoute(e.target.value)} placeholder="192.168.1.254" inputMode="decimal" /></div>
      </div>
      <div className="mt-3 flex gap-2">
        <CopyButton text={config} />
        <button type="button" onClick={reset} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4"><ErrorBox message={error} />
        {config && <pre className="overflow-x-auto rounded-lg bg-black/40 p-4 font-mono text-xs leading-relaxed text-emerald-300">{config}</pre>}
        <p className="mt-2 text-xs text-gray-500">Starter template only — placeholders, no real secrets. Review before applying to real gear.</p>
      </div>
    </div>
  );
}
