import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SCENARIOS } from "@/lib/troubleshoot";

export const metadata: Metadata = {
  title: "Troubleshoot — Find where the network breaks",
  description: "Guided troubleshooting workflows. Start with 'Website / server unreachable' and walk DNS to TLS step by step.",
};

export default function Page() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10">
      <Link href="/" className="text-xs text-gray-500 hover:text-gray-300">
        ← All tools
      </Link>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">Troubleshoot</h1>
      <p className="mt-2 text-sm text-gray-400">
        Choose what is broken. We walk you through the checks in order, explain each result, and tell you what to do next.
      </p>

      <div className="mt-8 grid gap-4">
        {SCENARIOS.map((s) => (
          <Link key={s.id} href={s.href} className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Card className="p-6 transition-colors hover:border-zinc-500 hover:bg-white/[0.07]">
              <h2 className="text-base font-semibold text-white">{s.title}</h2>
              <p className="mt-1.5 text-sm text-gray-400">{s.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {s.steps.map((st) => (
                  <span key={st.id} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-300">
                    {st.title}
                  </span>
                ))}
              </div>
              <div className="mt-4">
                <Button variant="outline" size="sm" asChild>
                  <span>Start troubleshooting</span>
                </Button>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-8">
        <CardContent>
          <h2 className="text-sm font-semibold text-gray-200">More scenarios coming</h2>
          <p className="mt-1 text-sm text-gray-400">
            DNS, packet-loss, SSH and other workflows will be added after this first workflow proves useful.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
