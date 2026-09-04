'use client';

import { useState } from "react";
import type { Question } from "@/lib/learn";
import { cidrQuestion } from "@/lib/learn";

function optionCls(picked: boolean, checked: boolean, isAnswer: boolean, isWrongPick: boolean): string {
  const base = "w-full rounded-lg border px-4 py-2.5 text-left font-mono text-sm transition-colors";
  if (checked && isAnswer) return `${base} border-zinc-400 bg-zinc-200/10 text-zinc-200`;
  if (checked && isWrongPick) return `${base} border-red-500 bg-red-500/10 text-red-200`;
  if (checked) return `${base} border-[var(--panel-border)] bg-white/5 text-gray-500`;
  if (picked) return `${base} border-zinc-500 bg-white/10 text-white ring-1 ring-zinc-500`;
  return `${base} border-[var(--panel-border)] bg-white/5 text-gray-200 hover:border-zinc-500 hover:text-white`;
}

const primaryBtn =
  "rounded-md bg-zinc-200 px-4 py-1.5 text-xs font-semibold text-black hover:bg-white disabled:opacity-50";
const secondaryBtn =
  "rounded-md border border-[var(--panel-border)] bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-200 hover:border-zinc-500 hover:text-white transition-colors";

export default function Quiz() {
  const [q, setQ] = useState<Question>(() => cidrQuestion());
  const [picked, setPicked] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  function check(): void {
    if (picked === null || checked) return;
    setChecked(true);
    setTotal((t) => t + 1);
    if (picked === q.answer) setScore((s) => s + 1);
  }

  function newQuestion(): void {
    setQ(cidrQuestion());
    setPicked(null);
    setChecked(false);
  }

  function reset(): void {
    setScore(0);
    setTotal(0);
    setQ(cidrQuestion());
    setPicked(null);
    setChecked(false);
  }

  const correct = checked && picked === q.answer;

  return (
    <div>
      <p className="text-lg font-medium text-white">{q.prompt}</p>
      <div className="mt-4 space-y-2">
        {q.options.map((opt) => (
          <button
            key={opt}
            type="button"
            disabled={checked}
            onClick={() => setPicked(opt)}
            className={optionCls(picked === opt, checked, opt === q.answer, checked && picked === opt && opt !== q.answer)}
          >
            {opt}
          </button>
        ))}
      </div>
      {checked && (
        <div className="mt-4">
          <p className={correct ? "text-sm text-zinc-200" : "text-sm text-red-300"}>
            {correct ? "Correct!" : `Not quite — the answer is ${q.answer}.`}
          </p>
          <p className="mt-1 text-xs text-gray-400">Hint: {q.hint}</p>
        </div>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {!checked ? (
          <button type="button" onClick={check} disabled={picked === null} className={primaryBtn}>
            Check
          </button>
        ) : (
          <button type="button" onClick={newQuestion} className={primaryBtn}>
            New Question
          </button>
        )}
        <button type="button" onClick={reset} className={secondaryBtn}>
          Reset
        </button>
        <span className="ml-auto font-mono text-xs text-gray-400">
          Score {score} / {total}
        </span>
      </div>
    </div>
  );
}
