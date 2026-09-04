'use client';

import { useState } from "react";

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for non-secure contexts
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      return true;
    } catch {
      return false;
    }
  }
}

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        const ok = await copyText(text);
        setDone(ok);
        setTimeout(() => setDone(false), 1200);
      }}
      className="rounded-md border border-[var(--panel-border)] bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-200 hover:border-[var(--color-neon-cyan)] hover:text-white transition-colors"
    >
      {done ? "Copied" : label}
    </button>
  );
}

export function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/5 py-2 last:border-0">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="font-mono text-sm text-gray-100 break-all text-right">{value}</span>
    </div>
  );
}

export function ErrorBox({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
      {message}
    </p>
  );
}

export const inputCls =
  "w-full rounded-lg border border-[var(--panel-border)] bg-black/40 px-4 py-2.5 font-mono text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--color-neon-cyan)]";

export const labelCls = "mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-400";
