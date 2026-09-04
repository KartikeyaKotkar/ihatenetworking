'use client';

import { useMemo, useState } from "react";
import { ipv4StringToBinary } from "@/lib/ipv4";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

export default function Calculator() {
  const [ip, setIp] = useState("192.168.1.10");
  const result = useMemo(() => {
    if (!ip.trim()) return { binary: null as string | null, error: "" };
    const binary = ipv4StringToBinary(ip);
    if (!binary) return { binary: null, error: "Invalid IPv4 address. Use 4 octets 0-255, e.g. 192.168.1.10." };
    return { binary, error: "" };
  }, [ip]);

  return (
    <div>
      <div>
        <label className={labelCls} htmlFor="ip">IP address</label>
        <input id="ip" className={inputCls} value={ip} onChange={(e) => setIp(e.target.value)} placeholder="192.168.1.10" inputMode="decimal" />
      </div>
      <div className="mt-3 flex gap-2">
        <CopyButton text={result.binary ?? ""} />
        <button type="button" onClick={() => setIp("")} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4">
        <ErrorBox message={result.error} />
        {result.binary && (
          <div className="rounded-lg bg-black/40 p-4">
            <ResultRow label="Binary" value={result.binary} />
          </div>
        )}
      </div>
    </div>
  );
}
