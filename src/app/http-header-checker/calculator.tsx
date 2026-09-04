'use client';

import { useState } from "react";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

interface HeaderData {
  url: string; status: number; statusText: string; elapsedMs: number;
  redirected: boolean; location: string | null; headers: Record<string, string>;
}

export default function Calculator() {
  const [url, setUrl] = useState("https://example.com");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<HeaderData | null>(null);

  async function onSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true); setError(""); setData(null);
    try {
      const r = await fetch(`/api/headers?` + new URLSearchParams({ url: url.trim() }));
      const j = await r.json();
      if (!r.ok || j.error) setError(j.error ?? "Check failed.");
      else setData(j as HeaderData);
    } catch {
      setError("Request failed. Check your connection and try again.");
    } finally { setLoading(false); }
  }

  function reset() { setError(""); setData(null); }
  const entries = data ? Object.entries(data.headers) : [];

  return (
    <form onSubmit={onSubmit}>
      <label className={labelCls}>URL</label>
      <input className={inputCls} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" autoComplete="off" spellCheck={false} />
      <div className="mt-3 flex gap-2">
        <button type="submit" disabled={loading} className="rounded-md bg-zinc-200 px-4 py-1.5 text-xs font-semibold text-black hover:bg-white disabled:opacity-50">{loading ? "Fetching…" : "Check headers"}</button>
        <CopyButton text={data ? entries.map(([k, v]) => `${k}: ${v}`).join("\n") : ""} />
        <button type="button" onClick={reset} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4">
        <ErrorBox message={error} />
        {data && (
          <div className="rounded-lg bg-black/40 p-4">
            <ResultRow label="Status" value={`${data.status} ${data.statusText}`} />
            <ResultRow label="URL" value={data.url} />
            <ResultRow label="Time" value={`${data.elapsedMs} ms`} />
            {data.redirected && <ResultRow label="Redirect →" value={data.location ?? "(no location header)"} />}
            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="text-xs uppercase tracking-wider text-gray-500"><th className="py-1 pr-3">Header</th><th className="py-1">Value</th></tr></thead>
                <tbody>
                  {entries.map(([k, v]) => (
                    <tr key={k} className="border-t border-white/5 align-top">
                      <td className="py-1.5 pr-3 font-mono text-xs text-zinc-200">{k}</td>
                      <td className="break-all py-1.5 font-mono text-xs text-gray-200">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
