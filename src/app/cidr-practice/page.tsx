import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Quiz from "./quiz";

export const metadata: Metadata = {
  title: "CIDR Practice Quiz — Prefix to Mask Questions",
  description: "Practice CIDR notation with unlimited generated questions. Convert between prefix lengths and subnet masks, free and instant.",
};

export default function Page() {
  return (
    <ToolShell
      title="CIDR Practice"
      description="Drill prefix-to-mask and mask-to-prefix conversions with fresh questions every round."
      example="/24 → 255.255.255.0"
      explanation="Prefix N means N one-bits followed by zeros. /24 is 24 ones = 255.255.255.0."
      faqs={[
        { q: "What do questions cover?", a: "Converting /prefix to dotted-decimal mask and back, across /8 to /30." },
        { q: "Do I need an account?", a: "No. Questions generate instantly in your browser, unlimited and free." },
      ]}
      related={[
        { href: "/cidr-calculator", label: "CIDR Calculator" },
        { href: "/subnet-mask-to-cidr", label: "Mask to CIDR" },
        { href: "/subnetting-practice", label: "Subnetting Practice" },
      ]}
    >
      <Quiz />
    </ToolShell>
  );
}
