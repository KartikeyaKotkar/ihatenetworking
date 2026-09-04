import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "HTTP Status Code Lookup — Phrase, Category & Meaning",
  description: "Free HTTP status code lookup. Enter a code or phrase to get meaning, category, and description instantly. Private, client-side.",
};

export default function Page() {
  return (
    <ToolShell
      title="HTTP Status Code Lookup"
      description="Enter a status code or phrase. Instant category, phrase, and meaning."
      example="404 → Not Found, 4xx Client Error — no resource at this path"
      explanation="1xx informational, 2xx success, 3xx redirection, 4xx client error, 5xx server error. Results come from a built-in common-status dataset."
      faqs={[
        { q: "Can I search by phrase?", a: "Yes. Type e.g. not found, redirect, or timeout to match phrases and descriptions." },
        { q: "What if my code has no entry?", a: "Only common codes are listed. You'll see an honest notice for unlisted but valid codes." },
        { q: "Is my input sent anywhere?", a: "No. All lookups run in your browser." },
      ]}
      related={[
        { href: "/port-number-lookup", label: "Port Number Lookup" },
        { href: "/http-header-checker", label: "HTTP Header Checker" },
        { href: "/url-parser", label: "URL Parser" },
        { href: "/http-status-codes-reference", label: "Status Codes Reference" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
