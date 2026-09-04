'use client';

import { useState } from "react";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

export default function Calculator() {
  const [ip, setIp] = useState("8.8.8.8");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hostnames, setHostnames] = useState<string[] | null>(null);
  const [queriedIp, setQueriedIp] = useState("");

  async function onSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true); setError(""); setHostnames(null);
    try {
      const r = await fetch(`/api/dns/reverse?` + new URLSearchParams({ ip: ip.trim() }));
      const j = await r.json();
      if (!r.ok || j.error) setError(j.error ?? "Lookup failed.");
      else { setHostnames(j.hostnames as string[]); setQueriedIp(j.ip as string); }
    } catch {
      setError("Request failed. Check your connection and try again.");
    } finally { setLoading(false); }
  }

  function reset() { setError(""); setHostnames(null); setQueriedIp(""); }

  return (
    <form onSubmit={onSubmit}>
      <label className={labelCls}>IP address</label>
      <input className={inputCls} value={ip} onChange={(e) => setIp(e.target.value)} placeholder="8.8.8.8" autoComplete="off" spellCheck={false} />
      <p className="mt-2 text-xs text-gray-500">No PTR record (404) is normal — many IPs simply have none.</p>
      <div className="mt-3 flex gap-2">
        <button type="submit" disabled={loading} className="rounded-md bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-black hover:bg-emerald-400 disabled:opacity-50">{loading ? "Looking up…" : "Reverse lookup"}</button>
        <CopyButton text={hostnames ? hostnames.join("\n") : ""} />
        <button type="button" onClick={reset} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4">
        <ErrorBox message={error} />
        {hostnames && (
          <div className="rounded-lg bg-black/40 p-4">
            <ResultRow label="IP" value={queriedIp} />
            <div className="mt-2">
              <p className="text-xs text-gray-400">Hostnames ({hostnames.length})</p>
              <ul className="mt-1 space-y-1">
                {hostnames.map((h) => <li key={h} className="break-all rounded bg-white/5 px-2 py-1 font-mono text-xs text-emerald-200">{h}</li>)}
              </ul>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
