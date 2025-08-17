import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import './globals.css'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://last-legs.vercel.app";

export const metadata: Metadata = {
  title: "Last Legs — AI Ironman Training",
  description:
    "Your AI-powered Ironman coach. Adaptive plans, accountability, and race-day readiness.",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Last Legs — AI Ironman Training",
    description:
      "Your AI-powered Ironman coach. Adaptive plans, accountability, and race-day readiness.",
    url: SITE_URL,
    siteName: "Last Legs",
    images: ["/opengraph-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Last Legs — AI Ironman Training",
    description:
      "Your AI-powered Ironman coach. Adaptive plans, accountability, and race-day readiness.",
    images: ["/opengraph-image.png"],
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-[color:var(--bg-0)] text-[color:var(--text-2)]">
      <body className="font-sans antialiased">
        <div className="relative">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}
