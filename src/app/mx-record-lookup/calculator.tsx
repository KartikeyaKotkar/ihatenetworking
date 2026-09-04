'use client';

import { useState } from "react";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

interface DnsAnswer { type: string; name: string; values: string[]; ttlSeconds: number | null }

export default function Calculator() {
  const [name, setName] = useState("google.com");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [answer, setAnswer] = useState<DnsAnswer | null>(null);

  async function onSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true); setError(""); setAnswer(null);
    try {
      const r = await fetch(`/api/dns?` + new URLSearchParams({ name: name.trim(), type: "MX" }));
      const j = await r.json();
      if (!r.ok || j.error) setError(j.error ?? "Lookup failed.");
      else setAnswer(j.answer as DnsAnswer);
    } catch {
      setError("Request failed. Check your connection and try again.");
    } finally { setLoading(false); }
  }

  function reset() { setError(""); setAnswer(null); }

  return (
    <form onSubmit={onSubmit}>
      <label className={labelCls}>Domain</label>
      <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="google.com" autoComplete="off" spellCheck={false} />
      <p className="mt-2 text-xs text-gray-500">Lowest priority number wins — mail is delivered to the lowest-priority reachable server first.</p>
      <div className="mt-3 flex gap-2">
        <button type="submit" disabled={loading} className="rounded-md bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-black hover:bg-emerald-400 disabled:opacity-50">{loading ? "Looking up…" : "Look up MX"}</button>
        <CopyButton text={answer ? answer.values.join("\n") : ""} />
        <button type="button" onClick={reset} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4">
        <ErrorBox message={error} />
        {answer && (
          <div className="rounded-lg bg-black/40 p-4">
            <ResultRow label="Domain" value={answer.name} />
            {answer.ttlSeconds !== null && answer.ttlSeconds !== undefined && <ResultRow label="TTL" value={`${answer.ttlSeconds}s`} />}
            <div className="mt-2">
              <p className="text-xs text-gray-400">Mail servers ({answer.values.length})</p>
              <ul className="mt-1 space-y-1">
                {answer.values.map((v) => <li key={v} className="break-all rounded bg-white/5 px-2 py-1 font-mono text-xs text-emerald-200">{v}</li>)}
              </ul>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
