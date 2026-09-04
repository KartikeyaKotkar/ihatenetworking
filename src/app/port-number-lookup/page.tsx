import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "Port Number Lookup — Service, Protocol & Description",
  description: "Free port number lookup. Enter a port or service name to find protocol, service, description, and range class. Private, client-side.",
};

export default function Page() {
  return (
    <ToolShell
      title="Port Number Lookup"
      description="Enter a port number or service name. Instant protocol, service, and range class."
      example="443 → HTTPS, TCP, encrypted web — Well-known (0-1023, IANA assigned)"
      explanation="Ports 0-1023 are well-known (IANA assigned), 1024-49151 registered, 49152-65535 dynamic/private. Results come from a built-in common-ports dataset."
      faqs={[
        { q: "What if my port has no entry?", a: "Not every port is listed. You'll see an honest notice plus the range class anyway." },
        { q: "Can I search by service name?", a: "Yes. Type e.g. http, ssh, or redis to match service names and descriptions." },
        { q: "Is my input sent anywhere?", a: "No. All lookups run in your browser." },
      ]}
      related={[
        { href: "/http-status-code-lookup", label: "HTTP Status Code Lookup" },
        { href: "/dns-lookup", label: "DNS Lookup" },
        { href: "/ping-tester", label: "Ping Tester" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
