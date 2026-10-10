import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://huhuspizzas.co.ke";
  return [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/menu`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/story`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/fresh`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/checkout`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];
}
