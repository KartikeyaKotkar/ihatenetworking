import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "IP Range Generator — List Addresses Between Two IPs",
  description: "Free IP range generator. Enter start and end IPv4, list up to 256 addresses with copy. Private, client-side.",
};

export default function Page() {
  return (
    <ToolShell
      title="IP Range Generator"
      description="Enter a start and end IPv4 address. List every address (up to 256) with one-click copy."
      example="192.168.1.1 – 192.168.1.5 → 192.168.1.1, .2, .3, .4, .5"
      explanation="Addresses increment as 32-bit integers from start to end. Output caps at 256 to keep the page fast — narrow the range for larger blocks."
      faqs={[
        { q: "Why the 256-address limit?", a: "Large ranges would freeze the page. Narrow your range into chunks of 256." },
        { q: "How do I copy the list?", a: "Use the Copy button — addresses are newline-separated for spreadsheets and scripts." },
        { q: "Is my input sent anywhere?", a: "No. Generation runs entirely in your browser." },
      ]}
      related={[
        { href: "/ip-range-calculator", label: "IP Range Calculator" },
        { href: "/subnet-splitter", label: "Subnet Splitter" },
        { href: "/subnet-calculator", label: "Subnet Calculator" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
