import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calculator from "./calculator";

export const metadata: Metadata = {
  title: "IP Geolocation Lookup — City, ISP & Coordinates for Any IP",
  description: "Free IP geolocation lookup. Enter any public IP to find its city, region, country, coordinates, ISP, and AS network.",
};

export default function Page() {
  return (
    <ToolShell
      title="IP Geolocation Lookup"
      description="Geolocate any public IP — city, region, country, coordinates, ISP, and network."
      example="8.8.8.8 → Mountain View, California, US (Google LLC, AS15169)"
      explanation="IP geolocation maps address blocks to the location the operator registered them — useful for fraud checks, localization, and debugging. Accuracy varies: country is usually right, city can be the ISP's hub rather than the user."
      faqs={[
        { q: "How accurate is IP geolocation?", a: "Country-level is typically accurate; city-level is approximate and may show the ISP point-of-presence instead of the exact user." },
        { q: "Why do mobile IPs look wrong?", a: "Mobile carriers route traffic through regional gateways, so the location reflects the gateway, not the handset." },
        { q: "VPNs and proxies?", a: "The location shown is the exit IP's location — a VPN server abroad will show that country, not yours." },
      ]}
      related={[
        { href: "/asn-lookup", label: "ASN Lookup" },
        { href: "/bgp-prefix-lookup", label: "BGP Prefix Lookup" },
        { href: "/private-ip-checker", label: "Private IP Checker" },
      ]}
    >
      <Calculator />
    </ToolShell>
  );
}
