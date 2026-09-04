'use client';

import { useState } from "react";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

interface WhoisData {
  query: string; server: string; raw: string;
}

export default function Calculator() {
  const [q, setQ] = useState("example.com");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<WhoisData | null>(null);

  async function onSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true); setError(""); setData(null);
    try {
      const r = await fetch(`/api/whois?` + new URLSearchParams({ q: q.trim() }));
      const j = await r.json();
      if (!r.ok || j.error) setError(j.error ?? "WHOIS lookup failed.");
      else setData(j as WhoisData);
    } catch {
      setError("Request failed. Check your connection and try again.");
    } finally { setLoading(false); }
  }

  function reset() { setError(""); setData(null); }

  return (
    <form onSubmit={onSubmit}>
      <label className={labelCls}>Domain or IP</label>
      <input className={inputCls} value={q} onChange={(e) => setQ(e.target.value)} placeholder="example.com" autoComplete="off" spellCheck={false} />
      <div className="mt-3 flex gap-2">
        <button type="submit" disabled={loading} className="rounded-md bg-zinc-200 px-4 py-1.5 text-xs font-semibold text-black hover:bg-white disabled:opacity-50">{loading ? "Looking up…" : "Look up WHOIS"}</button>
        <CopyButton text={data ? data.raw : ""} />
        <button type="button" onClick={reset} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4">
        <ErrorBox message={error} />
        {data && (
          <div className="rounded-lg bg-black/40 p-4">
            <ResultRow label="Query" value={data.query} />
            <ResultRow label="Answering server" value={data.server} />
            <p className="mt-2 text-xs text-gray-500">Referral followed automatically where the registry redirects to the registrar.</p>
            <pre className="mt-2 max-h-96 overflow-auto rounded bg-black/60 p-3 font-mono text-xs text-gray-300">{data.raw}</pre>
          </div>
        )}
      </div>
    </form>
  );
}
