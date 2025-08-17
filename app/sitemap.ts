export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://last-legs.vercel.app";
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
