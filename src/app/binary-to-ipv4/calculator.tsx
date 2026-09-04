'use client';

import { useMemo, useState } from "react";
import { binaryToIPv4String } from "@/lib/ipv4";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

export default function Calculator() {
  const [binary, setBinary] = useState("11000000.10101000.00000001.00001010");
  const result = useMemo(() => {
    if (!binary.trim()) return { ip: null as string | null, error: "" };
    const ip = binaryToIPv4String(binary);
    if (!ip) return { ip: null, error: "Invalid binary. Use 4 groups of 8 bits (dotted) or exactly 32 bits of 0/1." };
    return { ip, error: "" };
  }, [binary]);

  return (
    <div>
      <div>
        <label className={labelCls} htmlFor="binary">Binary input</label>
        <input id="binary" className={inputCls} value={binary} onChange={(e) => setBinary(e.target.value)} placeholder="11000000.10101000.00000001.00001010" inputMode="numeric" />
      </div>
      <div className="mt-3 flex gap-2">
        <CopyButton text={result.ip ?? ""} />
        <button type="button" onClick={() => setBinary("")} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4">
        <ErrorBox message={result.error} />
        {result.ip && (
          <div className="rounded-lg bg-black/40 p-4">
            <ResultRow label="IPv4" value={result.ip} />
          </div>
        )}
      </div>
    </div>
  );
}
