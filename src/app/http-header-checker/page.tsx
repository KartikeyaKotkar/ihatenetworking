import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "HTTP Header Checker — Inspect Response Headers & Status",
  description: "Free HTTP header checker. Enter a URL and see the live status line, response time, redirects and full response headers.",
};

export default function Page() {
  return (
    <ToolShell
      title="HTTP Header Checker"
      description="Fetch any public URL and inspect its status line, timing, redirects and response headers."
      example="https://example.com → 200 OK, content-type: text/html"
      explanation="Shows the status line (e.g. 200 OK, 301 redirect), round-trip time, whether the response is a redirect with its Location target, and every response header as key/value rows. Private/internal targets are blocked (403)."
      faqs={[
        { q: "Why is a redirect shown, not followed?", a: "The checker uses manual redirect mode so you see the 3xx status and Location instead of silently landing elsewhere." },
        { q: "Blocked target (403)?", a: "Private, loopback and internal hostnames are refused for safety. Only public URLs can be checked." },
        { q: "What do cache headers mean?", a: "cache-control, etag and expires tell browsers/CDNs how long to reuse the response." },
      ]}
      related={[
        { href: "/http-status-code-lookup", label: "HTTP Status Code Lookup" },
        { href: "/url-parser", label: "URL Parser" },
        { href: "/ping-tester", label: "Ping Tester" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
