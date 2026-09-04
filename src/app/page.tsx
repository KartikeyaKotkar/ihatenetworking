import Link from "next/link";
import type { Metadata } from "next";
import ToolSearch from "@/components/ToolSearch";
import { CATEGORIES, TOOLS, toolsByCategory } from "@/lib/tools";

export const metadata: Metadata = {
  title: "did you ping it — Free Subnetting, DNS & Networking Tools",
  description:
    "Free, fast, privacy-first networking tools: subnet calculators, DNS lookups, ping, headers, URL utils, base converters. No signup.",
};

const popular = TOOLS.filter((t) => t.popular);
const recent = TOOLS.filter((t) => t.recent).slice(0, 8);

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center px-5 py-14 text-center">
      <header className="flex w-full flex-col items-center gap-4">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">did you ping it</h1>
        <p className="max-w-2xl text-sm text-gray-400 sm:text-base">
          Small networking tasks, solved instantly. Free, fast, privacy-first.
        </p>
        <ToolSearch />
      </header>

      <main className="mt-10 w-full text-left">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Popular tools</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {popular.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="glass-panel rounded-lg p-4 transition-colors hover:border-[var(--color-neon-cyan)]"
            >
              <h3 className="text-sm font-semibold text-gray-100">{t.title}</h3>
              <p className="mt-1 text-xs text-gray-400">{t.desc}</p>
            </Link>
          ))}
        </div>

        <h2 className="mt-10 text-xs font-semibold uppercase tracking-wider text-gray-500">Categories</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CATEGORIES.map((c) => (
            <a
              key={c.id}
              href={`#category-${c.id}`}
              className="glass-panel rounded-lg p-4 transition-colors hover:border-[var(--color-neon-cyan)]"
            >
              <h3 className="text-sm font-semibold text-gray-100">{c.label}</h3>
              <p className="mt-1 text-xs text-gray-500">
                {c.id === "cisco" ? "Soon" : `${toolsByCategory(c.id).length} tools`}
              </p>
            </a>
          ))}
        </div>

        {CATEGORIES.filter((c) => c.id !== "cisco").map((c) => (
          <section key={c.id} id={`category-${c.id}`} className="mt-10 scroll-mt-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {c.label} — {toolsByCategory(c.id).length} tools
            </h2>
            <p className="mt-1 text-xs text-gray-500">{c.blurb}</p>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {toolsByCategory(c.id).map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="glass-panel rounded-lg p-4 transition-colors hover:border-[var(--color-neon-cyan)]"
                >
                  <h3 className="text-sm font-semibold text-gray-100">{t.title}</h3>
                  <p className="mt-1 text-xs text-gray-400">{t.desc}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <section className="mt-10">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Recently added</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {recent.map((t) => (
              <li key={t.href}>
                <Link
                  href={t.href}
                  className="inline-block rounded-md border border-[var(--panel-border)] bg-white/5 px-3 py-1.5 text-xs text-gray-300 hover:border-[var(--color-neon-cyan)] hover:text-white"
                >
                  {t.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="glass-panel mt-8 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-gray-200">Privacy</h2>
          <p className="mt-1 text-xs leading-relaxed text-gray-400">
            No account. No tracking inputs. Calculators and converters run 100% client-side in your browser.
            DNS, ping, traceroute, and header checks run server-side on demand and are never logged.
          </p>
        </div>
      </main>

      <footer className="mt-10 text-xs text-gray-600">
        <p>Phase 1 MVP complete: 41 tools live.</p>
      </footer>
    </div>
  );
}
