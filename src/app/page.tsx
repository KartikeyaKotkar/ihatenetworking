import Link from "next/link";
import type { Metadata } from "next";
import HomeSearch from "@/components/HomeSearch";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES, TOOLS, categoryLabel, toolsByCategory } from "@/lib/tools";

export const metadata: Metadata = {
  title: "did you ping it? — Free Subnetting, DNS & Networking Tools",
  description:
    "Free, fast, privacy-first networking tools: subnet calculators, DNS lookups, ping, headers, URL utils, base converters. No signup.",
};

const popular = TOOLS.filter((t) => t.popular);
const recent = TOOLS.filter((t) => t.recent).slice(-8);

function ToolCard({ href, title, desc, badge }: { href: string; title: string; desc: string; badge?: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Card className="h-full p-6 transition-colors hover:border-zinc-500 hover:bg-white/[0.07]">
        {badge && (
          <Badge className="mb-2">{badge}</Badge>
        )}
        <h3 className="text-base font-semibold text-gray-100">{title}</h3>
        <p className="mt-1.5 text-sm text-gray-400">{desc}</p>
      </Card>
    </Link>
  );
}

const sideLinkCls =
  "block rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-10">
      <header className="flex flex-col items-center gap-4 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-gray-600">
          Free · No signup · Private
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">did you ping it?</h1>
        <p className="max-w-2xl text-sm text-gray-400 sm:text-base">
          Small networking tasks, solved instantly. 85 tools for subnets, DNS, packets, Cisco, testing, conversion, and learning.
        </p>
        <div className="w-full max-w-2xl">
          <HomeSearch />
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {popular.slice(0, 5).map((t) => (
            <Button key={t.href} variant="outline" size="sm" asChild className="rounded-full">
              <Link href={t.href}>{t.title}</Link>
            </Button>
          ))}
        </div>
        <Card className="w-full max-w-2xl text-left">
          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Having a problem?</p>
              <p className="mt-1 text-xs text-gray-400">Walk DNS → ping → TCP → HTTP → TLS step by step.</p>
            </div>
            <Button asChild className="shrink-0">
              <Link href="/troubleshoot">Troubleshoot a network problem</Link>
            </Button>
          </CardContent>
        </Card>
        <div className="flex w-full max-w-2xl justify-center gap-6 text-xs text-gray-500">
          <span>I know what tool I need → search or browse below</span>
          <span className="hidden sm:inline">·</span>
          <span>I know what&apos;s broken → troubleshoot</span>
        </div>
      </header>

      <div className="mt-12 flex w-full items-start gap-8">
        <aside className="sticky top-6 hidden w-56 shrink-0 lg:block" aria-label="Categories">
          <Card>
            <CardContent className="p-3">
              <p className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Browse
              </p>
              <ul className="space-y-1">
                <li>
                  <a href="#popular" className={sideLinkCls}>
                    Popular
                    <span className="ml-2 font-mono text-[10px] text-gray-600">{popular.length}</span>
                  </a>
                </li>
                {CATEGORIES.map((c) => {
                  const n = toolsByCategory(c.id).length;
                  return (
                    <li key={c.id}>
                      <a href={`#category-${c.id}`} className={sideLinkCls}>
                        {c.label}
                        <span className="ml-2 font-mono text-[10px] text-gray-600">
                          {c.id === "cisco" ? `${n} new` : n}
                        </span>
                      </a>
                    </li>
                  );
                })}
                <li>
                  <a href="#recent" className={sideLinkCls}>
                    Recently added
                    <span className="ml-2 font-mono text-[10px] text-gray-600">{recent.length}</span>
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardContent className="p-4">
              <p className="text-xs font-semibold text-gray-200">Privacy-first</p>
              <p className="mt-1 text-[11px] leading-relaxed text-gray-500">
                Calculators run in your browser. Server lookups are on demand, never logged.
              </p>
            </CardContent>
          </Card>
        </aside>

        <main className="min-w-0 flex-1 text-left">
          <section id="popular" className="scroll-mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Popular tools
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {popular.map((t) => (
                <ToolCard key={t.href} href={t.href} title={t.title} desc={t.desc} badge={categoryLabel(t.category)} />
              ))}
            </div>
          </section>

          {CATEGORIES.map((c) => (
            <section key={c.id} id={`category-${c.id}`} className="mt-12 scroll-mt-6">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                  {c.label}
                </h2>
                <span className="font-mono text-[11px] text-gray-600">
                  {toolsByCategory(c.id).length} tools
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">{c.blurb}</p>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {toolsByCategory(c.id).map((t) => (
                  <ToolCard key={t.href} href={t.href} title={t.title} desc={t.desc} />
                ))}
              </div>
            </section>
          ))}

          <section id="recent" className="mt-12 scroll-mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Recently added
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {recent.map((t) => (
                <li key={t.href}>
                  <Button variant="outline" asChild>
                    <Link href={t.href}>{t.title}</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>

      <footer className="mt-14 text-center text-xs text-gray-600">
        <p>85 tools + troubleshooting workflows. No account, no tracking inputs.</p>
      </footer>
    </div>
  );
}
