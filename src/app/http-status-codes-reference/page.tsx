import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import { CopyButton } from "@/components/tool-ui";
import { allStatuses } from "@/lib/http-status";

export const metadata: Metadata = {
  title: "HTTP Status Codes Reference — Full 1xx–5xx Chart",
  description: "Free full HTTP status code chart grouped by category with phrase and meaning.",
};

export default function Page() {
  const statuses = allStatuses();
  const groups: { name: string; items: typeof statuses }[] = [];
  for (const s of statuses) {
    const g = groups.find((x) => x.name === s.category);
    if (g) g.items.push(s);
    else groups.push({ name: s.category, items: [s] });
  }
  const copy = statuses.map((s) => `${s.code} ${s.phrase}: ${s.description}`).join("\n");
  return (
    <ToolShell
      title="HTTP Status Codes Reference"
      description="Every status code in the library, grouped by category."
      example="404 Not Found → no resource at this path."
      explanation="1xx = informational, 2xx = success, 3xx = redirect elsewhere, 4xx = client must fix the request, 5xx = server failed."
      faqs={[
        { q: "404 vs 410?", a: "404 means not found now; 410 Gone means permanently deleted — crawlers should drop the URL." },
        { q: "301 vs 308?", a: "Both permanent, but 301 may rewrite POST to GET while 308 preserves method and body." },
      ]}
      related={[
        { href: "/http-status-code-lookup", label: "Status Lookup" },
        { href: "/http-header-checker", label: "Header Checker" },
        { href: "/url-parser", label: "URL Parser" },
      ]}
    >
      {groups.map((g) => (
        <div key={g.name} className="mb-6 last:mb-0">
          <h2 className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-zinc-200">{g.name}</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="sticky top-0 bg-black/40">
                <tr>
                  <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Code</th>
                  <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Phrase</th>
                  <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Description</th>
                </tr>
              </thead>
              <tbody>
                {g.items.map((s) => (
                  <tr key={s.code} className="border-t border-white/5">
                    <td className="px-3 py-2 font-mono text-zinc-200">{s.code}</td>
                    <td className="px-3 py-2 text-xs font-medium text-gray-100">{s.phrase}</td>
                    <td className="px-3 py-2 text-xs text-gray-400">{s.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      <div className="mt-4">
        <CopyButton text={copy} label="Copy summary" />
      </div>
    </ToolShell>
  );
}
