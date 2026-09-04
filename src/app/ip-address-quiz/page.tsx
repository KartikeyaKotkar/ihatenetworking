import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Quiz from "./quiz";

export const metadata: Metadata = {
  title: "IP Address Quiz — Private vs Public Practice",
  description: "Practice IP address classification with unlimited generated questions. Private, public, loopback, multicast and more, free and instant.",
};

export default function Page() {
  return (
    <ToolShell
      title="IP Address Quiz"
      description="Drill IP classification: private, public, loopback, multicast, link-local and more."
      example="10.5.6.7 → Private (RFC 1918)"
      explanation="First-octet ranges decide scope: 10/8, 172.16/12, 192.168/16 are private; 127/8 is loopback; 224/4 is multicast."
      faqs={[
        { q: "What do questions cover?", a: "Classifying addresses as private, public, loopback, multicast, link-local, CGNAT and others." },
        { q: "Do I need an account?", a: "No. Questions generate instantly in your browser, unlimited and free." },
      ]}
      related={[
        { href: "/ipv4-validator", label: "IPv4 Validator" },
        { href: "/private-ip-checker", label: "Private IP Checker" },
        { href: "/port-number-quiz", label: "Port Number Quiz" },
      ]}
    >
      <Quiz />
    </ToolShell>
  );
}
