'use client';

import { useState } from "react";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

interface PingData {
  host: string; method: "icmp" | "tcp"; transmitted: number; received: number;
  lossPct: number; min: number; avg: number; max: number; raw?: string; detail?: string;
}

export default function Calculator() {
  const [host, setHost] = useState("google.com");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<PingData | null>(null);

  async function onSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true); setError(""); setData(null);
    try {
      const r = await fetch(`/api/ping?` + new URLSearchParams({ host: host.trim() }));
      const j = await r.json();
      if (!r.ok || j.error) setError(j.error ?? "Ping failed.");
      else setData(j as PingData);
    } catch {
      setError("Request failed. Check your connection and try again.");
    } finally { setLoading(false); }
  }

  function reset() { setError(""); setData(null); }

  return (
    <form onSubmit={onSubmit}>
      <label className={labelCls}>Host</label>
      <input className={inputCls} value={host} onChange={(e) => setHost(e.target.value)} placeholder="google.com" autoComplete="off" spellCheck={false} />
      <div className="mt-3 flex gap-2">
        <button type="submit" disabled={loading} className="rounded-md bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-black hover:bg-emerald-400 disabled:opacity-50">{loading ? "Pinging…" : "Ping"}</button>
        <CopyButton text={data ? `${data.host} loss=${data.lossPct}% min/avg/max=${data.min}/${data.avg}/${data.max} ms (${data.method})` : ""} />
        <button type="button" onClick={reset} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4">
        <ErrorBox message={error} />
        {data && (
          <div className="rounded-lg bg-black/40 p-4">
            <div className="mb-2">
              <span className={`inline-block rounded px-2 py-0.5 font-mono text-xs font-semibold ${data.method === "icmp" ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}`}>
                {data.method === "icmp" ? "ICMP — real ping" : "TCP fallback"}
              </span>
              {data.method === "tcp" && <p className="mt-1 text-xs text-gray-500">ICMP is blocked from this server, so latency was measured via TCP connect to ports 443/80 instead. Values are comparable but not true ICMP.</p>}
            </div>
            <ResultRow label="Host" value={data.host} />
            <ResultRow label="Loss" value={`${data.lossPct}% (${data.received}/${data.transmitted})`} />
            <ResultRow label="Min / Avg / Max" value={`${data.min} / ${data.avg} / ${data.max} ms`} />
            {data.detail && <p className="mt-1 text-xs text-gray-500">{data.detail}</p>}
            {data.raw && <pre className="mt-2 overflow-x-auto rounded bg-black/60 p-2 font-mono text-xs text-gray-300">{data.raw}</pre>}
          </div>
        )}
      </div>
    </form>
  );
}
