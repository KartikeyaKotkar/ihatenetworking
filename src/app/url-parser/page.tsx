import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "URL Parser — Split Protocol, Host, Path, Params, Hash",
  description: "Free URL parser. Paste any URL to split protocol, hostname, port, path, query params, hash, and origin instantly. Private, client-side.",
};

export default function Page() {
  return (
    <ToolShell
      title="URL Parser"
      description="Paste any URL. Instant breakdown of protocol, host, path, params, and hash."
      example="https://example.com:8080/a/b?x=1&y=2#frag → host example.com, port 8080, 2 params"
      explanation="Parsing uses the built-in URL API. If you omit the scheme, https:// is assumed. Invalid input shows an error instead of guessing."
      faqs={[
        { q: "Do I need to include https://?", a: "No. If the scheme is missing, https:// is prepended before parsing." },
        { q: "How are query params shown?", a: "Each key/value pair is listed separately, plus the raw query string." },
        { q: "Is my input sent anywhere?", a: "No. All parsing runs in your browser." },
      ]}
      related={[
        { href: "/url-encoder-decoder", label: "URL Encoder / Decoder" },
        { href: "/http-header-checker", label: "HTTP Header Checker" },
        { href: "/http-status-code-lookup", label: "HTTP Status Code Lookup" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
