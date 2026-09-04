import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "URL Encoder / Decoder — Percent-Encode & Decode Online",
  description: "Free URL encoder and decoder. Percent-encode or decode any string with encodeURIComponent instantly. Private, client-side.",
};

export default function Page() {
  return (
    <ToolShell
      title="URL Encoder / Decoder"
      description="Encode or decode any string. Toggle mode, get percent-encoding instantly."
      example="encode: hello world? → hello%20world%3F"
      explanation="Encode uses encodeURIComponent (encodes everything except A-Z a-z 0-9 - _ . ! ~ * ' ( )). encodeURI leaves URL structure characters like : / ? # intact — use it for whole URLs, encodeURIComponent for single values."
      faqs={[
        { q: "encodeURI vs encodeURIComponent?", a: "encodeURI preserves : / ? # & for whole URLs. encodeURIComponent encodes those too, for embedding one value inside a query string." },
        { q: "Why did decoding fail?", a: "A lone % or invalid hex (e.g. %ZZ, trailing %) is not valid percent-encoding." },
        { q: "Is my input sent anywhere?", a: "No. All encoding runs in your browser." },
      ]}
      related={[
        { href: "/url-parser", label: "URL Parser" },
        { href: "/http-header-checker", label: "HTTP Header Checker" },
        { href: "/dns-lookup", label: "DNS Lookup" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
