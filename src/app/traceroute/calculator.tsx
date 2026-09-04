'use client';

import { useState } from "react";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

interface TraceData { host: string; method: string; raw: string }

export default function Calculator() {
  const [host, setHost] = useState("google.com");
  const [maxHops, setMaxHops] = useState("20");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<TraceData | null>(null);

  async function onSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true); setError(""); setData(null);
    try {
      const r = await fetch(`/api/traceroute?` + new URLSearchParams({ host: host.trim(), maxHops: maxHops.trim() || "20" }));
      const j = await r.json();
      if (!r.ok || j.error) setError(j.error ?? "Traceroute failed.");
      else setData(j as TraceData);
    } catch {
      setError("Request failed. Check your connection and try again.");
    } finally { setLoading(false); }
  }

  function reset() { setError(""); setData(null); }

  return (
    <form onSubmit={onSubmit}>
      <label className={labelCls}>Host</label>
      <input className={inputCls} value={host} onChange={(e) => setHost(e.target.value)} placeholder="google.com" autoComplete="off" spellCheck={false} />
      <label className={labelCls}>Max hops (2–30)</label>
      <input className={inputCls} value={maxHops} onChange={(e) => setMaxHops(e.target.value)} placeholder="20" inputMode="numeric" />
      <p className="mt-2 text-xs text-gray-500">Traceroute can take up to ~45 seconds. Please wait for the full path.</p>
      <div className="mt-3 flex gap-2">
        <button type="submit" disabled={loading} className="rounded-md bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-black hover:bg-emerald-400 disabled:opacity-50">{loading ? "Tracing (up to ~45s)…" : "Trace route"}</button>
        <CopyButton text={data ? data.raw : ""} />
        <button type="button" onClick={reset} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4">
        <ErrorBox message={error} />
        {data && (
          <div className="rounded-lg bg-black/40 p-4">
            <ResultRow label="Host" value={data.host} />
            <ResultRow label="Method" value={data.method} />
            <pre className="mt-2 overflow-x-auto rounded bg-black/60 p-3 font-mono text-xs leading-relaxed text-gray-200">{data.raw}</pre>
          </div>
        )}
      </div>
    </form>
  );
}
