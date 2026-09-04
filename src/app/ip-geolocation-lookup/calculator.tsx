'use client';

import { useState } from "react";
import { CopyButton, ErrorBox, ResultRow, inputCls, labelCls } from "@/components/tool-ui";

interface GeoData {
  ip: string; country: string; region: string; city: string;
  lat: number | null; lon: number | null; isp: string; org: string; as: string; note: string;
}

export default function Calculator() {
  const [ip, setIp] = useState("8.8.8.8");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<GeoData | null>(null);

  async function onSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true); setError(""); setData(null);
    try {
      const r = await fetch(`/api/geo?` + new URLSearchParams({ ip: ip.trim() }));
      const j = await r.json();
      if (!r.ok || j.error) setError(j.error ?? "Geolocation lookup failed.");
      else setData(j as GeoData);
    } catch {
      setError("Request failed. Check your connection and try again.");
    } finally { setLoading(false); }
  }

  function reset() { setError(""); setData(null); }

  const loc = (d: GeoData) => [d.city, d.region, d.country].filter(Boolean).join(", ");

  return (
    <form onSubmit={onSubmit}>
      <label className={labelCls}>IP address</label>
      <input className={inputCls} value={ip} onChange={(e) => setIp(e.target.value)} placeholder="8.8.8.8" autoComplete="off" spellCheck={false} />
      <div className="mt-3 flex gap-2">
        <button type="submit" disabled={loading} className="rounded-md bg-zinc-200 px-4 py-1.5 text-xs font-semibold text-black hover:bg-white disabled:opacity-50">{loading ? "Locating…" : "Locate IP"}</button>
        <CopyButton text={data ? `${data.ip} ${loc(data)} lat=${data.lat} lon=${data.lon} isp=${data.isp} ${data.as}` : ""} />
        <button type="button" onClick={reset} className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs text-gray-400 hover:text-white">Reset</button>
      </div>
      <div className="mt-4">
        <ErrorBox message={error} />
        {data && (
          <div className="rounded-lg bg-black/40 p-4">
            <ResultRow label="IP" value={data.ip} />
            <ResultRow label="Location" value={loc(data) || "—"} />
            <ResultRow label="Latitude / Longitude" value={data.lat != null && data.lon != null ? `${data.lat}, ${data.lon}` : "—"} />
            <ResultRow label="ISP" value={data.isp || "—"} />
            <ResultRow label="Organization" value={data.org || "—"} />
            <ResultRow label="AS" value={data.as || "—"} />
            {data.note && <p className="mt-2 text-xs text-gray-500">{data.note}</p>}
            <p className="mt-1 text-xs text-gray-500">Accuracy disclaimer: country-level is usually reliable; city-level is approximate.</p>
          </div>
        )}
      </div>
    </form>
  );
}
