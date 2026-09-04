'use client';

import { useState } from "react";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

interface AsnData {
  ip: string; asn: string; prefix: string; country: string; registry: string; source: string;
}

export default function Calculator() {
  const [ip, setIp] = useState("8.8.8.8");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<AsnData | null>(null);

  async function onSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true); setError(""); setData(null);
    try {
      const r = await fetch(`/api/asn?` + new URLSearchParams({ ip: ip.trim() }));
      const j = await r.json();
      if (!r.ok || j.error) setError(j.error ?? "ASN lookup failed.");
      else setData(j as AsnData);
    } catch {
      setError("Request failed. Check your connection and try again.");
    } finally { setLoading(false); }
  }

  function reset() { setError(""); setData(null); }

  return (
    <form onSubmit={onSubmit}>
      <label className={labelCls}>IP address</label>
      <input className={inputCls} value={ip} onChange={(e) => setIp(e.target.value)} placeholder="8.8.8.8" autoComplete="off" spellCheck={false} />
      <div className="mt-3 flex gap-2">
        <button type="submit" disabled={loading} className="rounded-md bg-zinc-200 px-4 py-1.5 text-xs font-semibold text-black hover:bg-white disabled:opacity-50">{loading ? "Looking up…" : "Look up ASN"}</button>
        <CopyButton text={data ? `${data.ip} ASN=${data.asn} prefix=${data.prefix} country=${data.country} registry=${data.registry}` : ""} />
        <button type="button" onClick={reset} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4">
        <ErrorBox message={error} />
        {data && (
          <div className="rounded-lg bg-black/40 p-4">
            <ResultRow label="IP" value={data.ip} />
            <ResultRow label="ASN" value={data.asn} />
            <ResultRow label="Prefix" value={data.prefix} />
            <ResultRow label="Country" value={data.country} />
            <ResultRow label="Registry" value={data.registry} />
            <p className="mt-2 text-xs text-gray-500">Source: {data.source}</p>
          </div>
        )}
      </div>
    </form>
  );
}
