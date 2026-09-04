'use client';

import { useMemo, useState } from "react";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

export default function Calculator() {
  const [val, setVal] = useState("hello world?");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const r = useMemo(() => {
    if (val === "") return { out: "", error: "" };
    try {
      if (mode === "encode") return { out: encodeURIComponent(val), error: "" };
      return { out: decodeURIComponent(val), error: "" };
    } catch {
      return { out: "", error: "Invalid percent-encoding: lone % or bad hex." };
    }
  }, [val, mode]);
  return (
    <div>
      <label className={labelCls}>Mode</label>
      <div className="flex gap-2">
        <button type="button" onClick={() => setMode("encode")} className={`rounded-md border px-3 py-1.5 text-xs ${mode === "encode" ? "border-zinc-500 text-white" : "border-[var(--panel-border)] text-gray-400 hover:text-white"}`}>Encode</button>
        <button type="button" onClick={() => setMode("decode")} className={`rounded-md border px-3 py-1.5 text-xs ${mode === "decode" ? "border-zinc-500 text-white" : "border-[var(--panel-border)] text-gray-400 hover:text-white"}`}>Decode</button>
      </div>
      <label className={`${labelCls} mt-4`}>Input</label>
      <textarea className={`${inputCls} min-h-20`} value={val} onChange={(e) => setVal(e.target.value)} placeholder={mode === "encode" ? "hello world?" : "hello%20world%3F"} />
      <div className="mt-3 flex gap-2">
        <CopyButton text={r.out} />
        <button type="button" onClick={() => setVal("")} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4"><ErrorBox message={r.error} />
        {r.out !== "" && <div className="rounded-lg bg-black/40 p-4">
          <ResultRow label="Result" value={r.out} />
        </div>}
      </div>
    </div>
  );
}
