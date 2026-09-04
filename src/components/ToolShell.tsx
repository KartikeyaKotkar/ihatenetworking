import Link from "next/link";
import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface RelatedTool {
  href: string;
  label: string;
}

export default function ToolShell({
  title,
  description,
  children,
  example,
  explanation,
  faqs,
  related,
}: {
  title: string;
  description: string;
  children: ReactNode;
  example: string;
  explanation: string;
  faqs: { q: string; a: string }[];
  related: RelatedTool[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: title,
    description,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0" },
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10">
      <Link href="/" className="text-xs text-gray-500 hover:text-gray-300">
        ← All tools
      </Link>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">{title}</h1>
      <p className="mt-2 text-sm text-gray-400">{description}</p>

      <Card className="mt-6">
        <CardContent>{children}</CardContent>
      </Card>

      <Card className="mt-6">
        <CardContent>
        <h2 className="text-sm font-semibold text-gray-200">How to read the result</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-400">{explanation}</p>
        <h2 className="mt-5 text-sm font-semibold text-gray-200">Example</h2>
        <code className="mt-2 block rounded-md bg-black/50 px-4 py-3 font-mono text-sm leading-relaxed text-zinc-200">{example}</code>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardContent>
          <h2 className="text-sm font-semibold text-gray-200">FAQ</h2>
          <div className="mt-3 space-y-4">
            {faqs.map((f) => (
              <div key={f.q}>
                <h3 className="text-sm font-medium text-gray-200">{f.q}</h3>
                <p className="mt-1 text-sm text-gray-400">{f.a}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <nav className="mt-6">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Related tools</h2>
        <ul className="mt-2 flex flex-wrap gap-2">
          {related.map((r) => (
            <li key={r.href}>
              <Button variant="outline" size="sm" asChild>
                <Link href={r.href}>{r.label}</Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
    </div>
  );
}
