'use client';

import { useState } from "react";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

interface ResolverResult {
  resolver: string; values: string[] | null; error: string | null; ms: number;
}

interface PropData {
  name: string; agreed: boolean; resolvers: ResolverResult[];
}

export default function Calculator() {
  const [name, setName] = useState("example.com");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<PropData | null>(null);

  async function onSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true); setError(""); setData(null);
    try {
      const r = await fetch(`/api/propagation?` + new URLSearchParams({ name: name.trim() }));
      const j = await r.json();
      if (!r.ok || j.error) setError(j.error ?? "Propagation check failed.");
      else setData(j as PropData);
    } catch {
      setError("Request failed. Check your connection and try again.");
    } finally { setLoading(false); }
  }

  function reset() { setError(""); setData(null); }

  return (
    <form onSubmit={onSubmit}>
      <label className={labelCls}>Hostname</label>
      <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="example.com" autoComplete="off" spellCheck={false} />
      <div className="mt-3 flex gap-2">
        <button type="submit" disabled={loading} className="rounded-md bg-zinc-200 px-4 py-1.5 text-xs font-semibold text-black hover:bg-white disabled:opacity-50">{loading ? "Checking…" : "Check propagation"}</button>
        <CopyButton text={data ? `${data.name} agreed=${data.agreed} ` + data.resolvers.map((r) => `${r.resolver}=${r.values ? r.values.join(",") : r.error ?? "error"} (${r.ms}ms)`).join(" ") : ""} />
        <button type="button" onClick={reset} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4">
        <ErrorBox message={error} />
        {data && (
          <div className="rounded-lg bg-black/40 p-4">
            <div className="mb-2">
              <span className={`inline-block rounded px-2 py-0.5 font-mono text-xs font-semibold ${data.agreed ? "bg-zinc-200/20 text-zinc-200" : "bg-white/10 text-zinc-400"}`}>
                {data.agreed ? "Agreed — propagated" : "Not yet — resolvers disagree"}
              </span>
            </div>
            <ResultRow label="Hostname" value={data.name} />
            {data.resolvers.map((r) => (
              <ResultRow key={r.resolver} label={`${r.resolver} · ${r.ms} ms`} value={r.values ? r.values.join(", ") : r.error ?? "error"} />
            ))}
            <p className="mt-2 text-xs text-gray-500">DNS answers are cached per TTL — differences usually clear after the old record expires.</p>
          </div>
        )}
      </div>
    </form>
  );
}
