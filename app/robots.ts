import { publicEnv } from "../lib/env";

export default function robots() {
  const isProd = process.env.VERCEL_ENV === "production";
  const base = publicEnv.NEXT_PUBLIC_SITE_URL;

  if (!isProd) {
    return { rules: [{ userAgent: "*", disallow: ["/"] }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${base}/sitemap.xml`,
  };
}
