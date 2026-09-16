import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "did you ping it — Free Subnetting, DNS & Networking Tools",
    template: "%s | did you ping it",
  },
  description:
    "Free, fast, privacy-first networking tools: subnet calculators, DNS lookups, ping, headers, packet decoders, Cisco, quizzes. No signup.",
  openGraph: {
    type: "website",
    siteName: "did you ping it",
    title: "did you ping it — Free Subnetting, DNS & Networking Tools",
    description:
      "Small networking tasks, solved instantly. 85 free tools, no signup, privacy-first.",
  },
  twitter: {
    card: "summary",
    title: "did you ping it — Free Networking Tools",
    description: "Small networking tasks, solved instantly. 85 free tools.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
