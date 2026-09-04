import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Quiz from "./quiz";

export const metadata: Metadata = {
  title: "Wildcard Mask Practice Quiz — Free ACL Mask Drill",
  description: "Practice wildcard masks with unlimited generated questions. Find the inverse mask for any prefix, free and instant.",
};

export default function Page() {
  return (
    <ToolShell
      title="Wildcard Mask Practice"
      description="Drill wildcard masks used in ACLs: invert any prefix into its wildcard form."
      example="/24 → wildcard 0.0.0.255"
      explanation="Wildcard = 255.255.255.255 minus the subnet mask. /24 mask 255.255.255.0 inverts to 0.0.0.255."
      faqs={[
        { q: "What do questions cover?", a: "Wildcard masks for prefixes /8 to /30, including tricky non-octet boundaries." },
        { q: "Do I need an account?", a: "No. Questions generate instantly in your browser, unlimited and free." },
      ]}
      related={[
        { href: "/wildcard-mask-calculator", label: "Wildcard Calculator" },
        { href: "/cisco-acl-generator", label: "Cisco ACL Generator" },
        { href: "/cidr-practice", label: "CIDR Practice" },
      ]}
    >
      <Quiz />
    </ToolShell>
  );
}
