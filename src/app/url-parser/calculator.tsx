'use client';

import { useMemo, useState } from "react";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

export default function Calculator() {
  const [val, setVal] = useState("https://example.com:8080/a/b?x=1&y=2#frag");
  const r = useMemo(() => {
    const q = val.trim();
    if (q === "") return { u: null as URL | null, params: [] as [string, string][], error: "" };
    let s = q;
    if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(s)) s = `https://${s}`;
    try {
      const u = new URL(s);
      const params: [string, string][] = [];
      u.searchParams.forEach((v, k) => params.push([k, v]));
      return { u, params, error: "" };
    } catch {
      return { u: null, params: [] as [string, string][], error: "Invalid URL." };
    }
  }, [val]);
  const copy = r.u ? r.u.toString() : "";
  return (
    <div>
      <label className={labelCls}>URL</label>
      <input className={inputCls} value={val} onChange={(e) => setVal(e.target.value)} placeholder="https://example.com/path?q=1#frag" inputMode="url" />
      <div className="mt-3 flex gap-2">
        <CopyButton text={copy} />
        <button type="button" onClick={() => setVal("")} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4"><ErrorBox message={r.error} />
        {r.u && <div className="rounded-lg bg-black/40 p-4">
          <ResultRow label="Protocol" value={r.u.protocol} />
          <ResultRow label="Hostname" value={r.u.hostname} />
          <ResultRow label="Port" value={r.u.port || "(default)"} />
          <ResultRow label="Pathname" value={r.u.pathname} />
          <ResultRow label="Search" value={r.u.search || "(none)"} />
          <ResultRow label="Hash" value={r.u.hash || "(none)"} />
          <ResultRow label="Origin" value={r.u.origin} />
          {r.params.length > 0 && <div className="mt-2">
            {r.params.map(([k, v], i) => (
              <ResultRow key={`${k}-${i}`} label={`param: ${k}`} value={v} />
            ))}
          </div>}
        </div>}
      </div>
    </div>
  );
}
