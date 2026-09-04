import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "did you ping it — Free Subnetting & Networking Tools",
  description:
    "Free, fast, privacy-first subnetting calculators: subnet, CIDR, VLSM, splitter, masks, ranges. No signup, client-side.",
};

const SUBNET_TOOLS = [
  { href: "/subnet-calculator", title: "IPv4 Subnet Calculator", desc: "Network, broadcast, range from IP + prefix" },
  { href: "/cidr-calculator", title: "CIDR Calculator", desc: "Decode 10.0.0.5/16 style input" },
  { href: "/vlsm-calculator", title: "VLSM Calculator", desc: "Allocate subnets by host count" },
  { href: "/subnet-splitter", title: "Subnet Splitter", desc: "Split network into equal subnets" },
  { href: "/subnet-range-calculator", title: "Subnet Range Calculator", desc: "First to last usable IP" },
  { href: "/usable-host-calculator", title: "Usable Host Calculator", desc: "Hosts per prefix length" },
  { href: "/subnet-mask-calculator", title: "Subnet Mask Calculator", desc: "Mask for host count" },
  { href: "/wildcard-mask-calculator", title: "Wildcard Mask Calculator", desc: "Inverse mask for ACLs" },
  { href: "/cidr-to-subnet-mask", title: "CIDR to Subnet Mask", desc: "/24 → 255.255.255.0" },
  { href: "/subnet-mask-to-cidr", title: "Subnet Mask to CIDR", desc: "255.255.255.0 → /24" },
  { href: "/network-address-calculator", title: "Network Address Calculator", desc: "IP AND mask" },
  { href: "/broadcast-address-calculator", title: "Broadcast Address Calculator", desc: "Last address of subnet" },
];

const IP_TOOLS = [
  { href: "/ipv4-validator", title: "IPv4 Address Validator", desc: "Valid or not, with reason" },
  { href: "/ipv4-to-binary", title: "IPv4 to Binary", desc: "Dotted decimal to binary" },
  { href: "/binary-to-ipv4", title: "Binary to IPv4", desc: "Binary back to dotted decimal" },
  { href: "/ip-range-calculator", title: "IP Range Calculator", desc: "Count addresses between two IPs" },
  { href: "/ip-range-generator", title: "IP Range Generator", desc: "List every IP in range" },
  { href: "/private-ip-checker", title: "Private IP Checker", desc: "Private, CGNAT, public, scope" },
  { href: "/ipv6-subnet-calculator", title: "IPv6 Subnet Calculator", desc: "Network + last address + total" },
  { href: "/ipv6-validator", title: "IPv6 Address Validator", desc: "Valid or not, expanded form" },
  { href: "/ipv6-compression", title: "IPv6 Compression & Expansion", desc: "Shortest vs full form, RFC 5952" },
];

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center px-5 py-14 text-center">
      <header className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">did you ping it</h1>
        <p className="max-w-2xl text-sm text-gray-400 sm:text-base">
          Small networking tasks, solved instantly. Free, fast, privacy-first. All subnet math runs in your browser.
        </p>
      </header>

      <main className="mt-10 w-full text-left">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Subnetting — 12 tools</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {SUBNET_TOOLS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="glass-panel rounded-lg p-4 transition-colors hover:border-[var(--color-neon-cyan)]"
            >
              <h3 className="text-sm font-semibold text-gray-100">{t.title}</h3>
              <p className="mt-1 text-xs text-gray-400">{t.desc}</p>
            </Link>
          ))}
        </div>

        <h2 className="mt-8 text-xs font-semibold uppercase tracking-wider text-gray-500">IP Tools — 9 tools</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {IP_TOOLS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="glass-panel rounded-lg p-4 transition-colors hover:border-[var(--color-neon-cyan)]"
            >
              <h3 className="text-sm font-semibold text-gray-100">{t.title}</h3>
              <p className="mt-1 text-xs text-gray-400">{t.desc}</p>
            </Link>
          ))}
        </div>

        <div className="glass-panel mt-8 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-gray-200">Privacy</h2>
          <p className="mt-1 text-xs text-gray-400">
            No account. No tracking inputs. Subnet calculators run 100% client-side.
          </p>
        </div>
      </main>

      <footer className="mt-10 text-xs text-gray-600">
        <p>Phase 1 MVP: Subnetting + IP tools live (21 tools). DNS, utilities, converters ship next.</p>
      </footer>
    </div>
  );
}
