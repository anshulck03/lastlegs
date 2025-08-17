export default function robots() {
  const isProd = process.env.VERCEL_ENV === "production";
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://last-legs.vercel.app";

  if (!isProd) {
    return { rules: [{ userAgent: "*", disallow: ["/"] }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${base}/sitemap.xml`,
  };
}
