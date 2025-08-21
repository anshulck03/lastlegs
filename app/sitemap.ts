import { publicEnv } from "../lib/env";

export default function sitemap() {
  const base = publicEnv.NEXT_PUBLIC_SITE_URL;
  const lastModified = new Date();

  const paths = [
    "/",
    "/#features",
    "/#how",
    "/#dashboard",
    "/#races",
    "/#guarantee",
    "/#faq",
    "/#waitlist",
  ];

  return paths.map((p) => ({
    url: `${base}${p}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: p === "/" ? 1 : 0.6,
  }));
}
