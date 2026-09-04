import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "Usable Host Calculator — Hosts Per Prefix",
  description: "Free usable host calculator. Enter /24 etc, get usable + total addresses. Handles /31 and /32.",
};

export default function Page() {
  return (
    <ToolShell
      title="Usable Host Calculator"
      description="Enter prefix length. Get usable host count instantly."
      example="/24 → 254 usable, 256 total"
      explanation="Usable = 2^(32−prefix) − 2. /31 = 2 (RFC 3021), /32 = 1."
      faqs={[{ q: "Why minus 2?", a: "Network and broadcast addresses cannot be assigned to hosts." }]}
      related={[{ href: "/subnet-mask-calculator", label: "Subnet Mask Calculator" }, { href: "/subnet-calculator", label: "Subnet Calculator" }, { href: "/vlsm-calculator", label: "VLSM Calculator" }]}
    >
      <Calculator />
    </ToolShell>
  );
}
