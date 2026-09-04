import type { MetadataRoute } from "next";

const TOOLS = [
  "/subnet-calculator",
  "/cidr-calculator",
  "/vlsm-calculator",
  "/subnet-splitter",
  "/subnet-range-calculator",
  "/usable-host-calculator",
  "/subnet-mask-calculator",
  "/wildcard-mask-calculator",
  "/cidr-to-subnet-mask",
  "/subnet-mask-to-cidr",
  "/network-address-calculator",
  "/broadcast-address-calculator",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://didyoupingit.com";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...TOOLS.map((p) => ({
      url: base + p,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
