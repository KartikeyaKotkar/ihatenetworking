import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "Subnet Splitter — Divide Network Into Equal Subnets",
  description: "Free subnet splitter. Split 192.168.1.0/24 into /26s etc. Instant equal-size subnet list.",
};

export default function Page() {
  return (
    <ToolShell
      title="Subnet Splitter"
      description="Split a network into equal subnets. Pick current and new prefix, get full list."
      example="192.168.1.0/24 → /26 → 4 × /26 subnets"
      explanation="Count = 2^(new − old). Each block sized 2^(32 − new). Capped at 1024 rows for browser sanity."
      faqs={[
        { q: "Equal sizes only?", a: "Yes. For varied sizes use VLSM Calculator." },
        { q: "Why cap at 1024?", a: "Larger splits (e.g. /0 → /24 = 16M rows) would freeze the page. Copy logic scales, UI does not." },
      ]}
      related={[
        { href: "/vlsm-calculator", label: "VLSM Calculator" },
        { href: "/subnet-calculator", label: "Subnet Calculator" },
        { href: "/cidr-calculator", label: "CIDR Calculator" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
