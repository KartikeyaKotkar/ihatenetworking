'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={async () => {
        const ok = await copyText(text);
        setDone(ok);
        setTimeout(() => setDone(false), 1200);
      }}
    >
      {done ? "Copied" : label}
    </Button>
  );
}

export function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/5 py-2 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="break-all text-right font-mono text-sm text-gray-100">{value}</span>
    </div>
  );
}

export function ErrorBox({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-md border border-destructive bg-destructive/20 px-3 py-2 text-sm text-red-300">
      {message}
    </p>
  );
}

export { Input, Label };

export const inputCls =
  "flex w-full rounded-lg border border-input bg-black/40 px-4 py-2.5 font-mono text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50";

export const labelCls = "mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-400";

/**
 * useState persisted to localStorage (§9 "preserve useful state").
 * SSR-safe: renders default first, hydrates stored value in effect (no mismatch).
 */
export function usePersistentState(key: string, initial: string): [string, (v: string) => void] {
  const [value, setValue] = useState(initial);
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(`dypi:${key}`);
      if (stored !== null) setValue(stored);
    } catch {
      // storage unavailable: keep default
    }
  }, [key]);
  const set = (v: string) => {
    setValue(v);
    try {
      window.localStorage.setItem(`dypi:${key}`, v);
    } catch {
      // ignore
    }
  };
  return [value, set];
}
