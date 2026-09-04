'use client';

import Link from "next/link";
import { useMemo, useState } from "react";
import { searchTools } from "@/lib/tools";

export default function ToolSearch() {
  const [q, setQ] = useState("");
  const results = useMemo(() => searchTools(q), [q]);
  return (
    <div className="w-full">
      <div className="group relative">
        <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[var(--color-neon-green)] to-[var(--color-neon-cyan)] opacity-30 blur transition duration-500 group-hover:opacity-60"></div>
        <input
          type="search"
          role="combobox"
          aria-expanded={results.length > 0}
          aria-controls="tool-search-results"
          aria-label="Search networking tools"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="What networking problem are you solving?"
          className="relative w-full rounded-xl border border-[var(--panel-border)] bg-[#0a0a0a]/90 px-6 py-4 text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-neon-cyan)]"
        />
      </div>
      {q.trim().length >= 2 && (
        <ul id="tool-search-results" role="listbox" className="glass-panel mt-2 overflow-hidden rounded-xl text-left">
          {results.length === 0 && (
            <li className="px-5 py-4 text-sm text-gray-500">No tool matches. Try subnet, dns, ping, binary.</li>
          )}
          {results.map((t) => (
            <li key={t.href} className="border-b border-white/5 last:border-0">
              <Link href={t.href} className="block px-5 py-3 hover:bg-white/5">
                <span className="text-sm font-medium text-gray-100">{t.title}</span>
                <span className="ml-2 text-xs text-gray-500">{t.desc}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
