import { MetadataRoute } from "next";
import { getServicesData } from "@/lib/getServicesData";
import { siteConfig } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const currentDate = new Date();

  // Base static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/clients`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Dynamic Service routes from servicesData.json
  const services = getServicesData();
  const serviceRoutes: MetadataRoute.Sitemap = services
    .filter((s: any) => s.active !== false)
    .map((s: any) => {
      const slug = s.slug || `/services/${s.id}`;
      const serviceUrl = slug.startsWith("http")
        ? slug
        : `${baseUrl}${slug.startsWith("/") ? "" : "/"}${slug}`;

      return {
        url: serviceUrl,
        lastModified: currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.9,
      };
    });

  return [...staticRoutes, ...serviceRoutes];
}
