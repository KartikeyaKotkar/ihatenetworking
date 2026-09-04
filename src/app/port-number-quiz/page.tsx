import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Quiz from "./quiz";

export const metadata: Metadata = {
  title: "Port Number Quiz — Well-Known Service Practice",
  description: "Practice port numbers with unlimited generated questions. Match services like HTTP, SSH and DNS to their ports, free and instant.",
};

export default function Page() {
  return (
    <ToolShell
      title="Port Number Quiz"
      description="Drill well-known ports: match each service to the port and protocol it runs on."
      example="Port 443/tcp → HTTPS"
      explanation="Well-known ports 0–1023 map to core services: 80 HTTP, 443 HTTPS, 22 SSH, 53 DNS. Score tracks your correct answers."
      faqs={[
        { q: "What do questions cover?", a: "Well-known ports up to 1024, asking which service runs on each port and protocol." },
        { q: "Do I need an account?", a: "No. Questions generate instantly in your browser, unlimited and free." },
      ]}
      related={[
        { href: "/port-number-lookup", label: "Port Number Lookup" },
        { href: "/ip-address-quiz", label: "IP Address Quiz" },
        { href: "/well-known-ports-reference", label: "Well-Known Ports Reference" },
      ]}
    >
      <Quiz />
    </ToolShell>
  );
}
