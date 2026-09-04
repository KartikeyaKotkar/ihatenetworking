import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Quiz from "./quiz";

export const metadata: Metadata = {
  title: "Subnetting Practice Questions — Free Subnet Quiz Generator",
  description: "Practice subnetting with unlimited generated questions. Find network addresses from IP and prefix, free and instant.",
};

export default function Page() {
  return (
    <ToolShell
      title="Subnetting Practice Generator"
      description="Drill network-address questions with a fresh generated problem every round."
      example="192.168.1.77/24 → network 192.168.1.0"
      explanation="The network address is the IP with all host bits zeroed. Score tracks how many you answer correctly."
      faqs={[
        { q: "How is score tracked?", a: "Each checked answer adds one to your total; correct answers add one to your score. Reset clears both." },
        { q: "Do I need an account?", a: "No. Questions generate instantly in your browser, unlimited and free." },
      ]}
      related={[
        { href: "/subnet-calculator", label: "Subnet Calculator" },
        { href: "/cidr-practice", label: "CIDR Practice" },
        { href: "/vlsm-practice", label: "VLSM Practice" },
      ]}
    >
      <Quiz />
    </ToolShell>
  );
}
