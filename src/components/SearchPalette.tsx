'use client';

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { searchTools } from "@/lib/tools";

export function SearchButton({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-3 rounded-xl border border-[var(--panel-border)] bg-[#0a0a0a]/90 px-5 py-4 text-left text-sm text-gray-500 transition-colors hover:border-zinc-500 hover:text-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
        <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
        <line x1="11" y1="11" x2="14.5" y2="14.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <span className="flex-1">What networking problem are you solving?</span>
      <kbd className="hidden rounded border border-[var(--panel-border)] bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-gray-500 sm:inline">
        Ctrl K
      </kbd>
    </button>
  );
}

export default function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const results = useMemo(() => searchTools(q), [q]);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open ]);

  useEffect(() => setActive(0), [q]);

  const go = useCallback(
    (href: string) => {
      onClose();
      router.push(href);
    },
    [onClose, router]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      } else if (e.key === "Enter" && results[active]) {
        go(results[active].href);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, active, go, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 pt-[12vh]"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search tools"
        className="glass-panel w-full max-w-xl overflow-hidden rounded-2xl shadow-2xl shadow-black"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0 text-gray-500">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
            <line x1="11" y1="11" x2="14.5" y2="14.5" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Type to search 41 tools…"
            aria-label="Search networking tools"
            aria-controls="palette-results"
            aria-activedescendant={results[active] ? `palette-${results[active].href}` : undefined}
            className="w-full bg-transparent text-base text-white placeholder-gray-600 focus:outline-none"
          />
          <kbd className="rounded border border-[var(--panel-border)] bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-gray-500">
            ESC
          </kbd>
        </div>
        <ul id="palette-results" role="listbox" className="max-h-80 overflow-y-auto p-2 text-left">
          {q.trim().length >= 2 && results.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-gray-500">
              No tool matches. Try subnet, dns, ping, binary.
            </li>
          )}
          {q.trim().length < 2 && (
            <li className="px-4 py-6 text-center text-sm text-gray-600">
              Start typing. Arrow keys navigate, Enter opens.
            </li>
          )}
          {results.map((t, i) => (
            <li key={t.href} id={`palette-${t.href}`} role="option" aria-selected={i === active}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => go(t.href)}
                className={`flex w-full items-center justify-between gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                  i === active ? "bg-white/10" : "bg-transparent"
                }`}
              >
                <span>
                  <span className="block text-sm font-medium text-gray-100">{t.title}</span>
                  <span className="block text-xs text-gray-500">{t.desc}</span>
                </span>
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-gray-600">
                  {t.href.slice(1).split("-")[0]}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
