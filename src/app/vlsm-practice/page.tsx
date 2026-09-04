import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Quiz from "./quiz";

export const metadata: Metadata = {
  title: "VLSM Practice Quiz — Smallest Prefix Questions",
  description: "Practice VLSM subnet sizing with unlimited generated questions. Pick the smallest prefix that fits a host count, free and instant.",
};

export default function Page() {
  return (
    <ToolShell
      title="VLSM Practice"
      description="Drill right-sizing subnets: pick the smallest prefix that fits the required hosts."
      example="Need 50 hosts → /26 (62 usable)"
      explanation="A /N prefix has 2^(32-N) − 2 usable hosts. Pick the largest N (smallest block) that still fits."
      faqs={[
        { q: "What do questions cover?", a: "Host-count requirements from 5 to 500 hosts and the smallest working prefix." },
        { q: "Do I need an account?", a: "No. Questions generate instantly in your browser, unlimited and free." },
      ]}
      related={[
        { href: "/vlsm-calculator", label: "VLSM Calculator" },
        { href: "/usable-host-calculator", label: "Usable Host Calculator" },
        { href: "/subnetting-practice", label: "Subnetting Practice" },
      ]}
    >
      <Quiz />
    </ToolShell>
  );
}
