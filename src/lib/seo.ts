import type { Metadata } from "next";

export const siteConfig = {
  name: "Best International Contracting Company",
  shortName: "BiC",
  description:
    "Leading industrial contractor in Saudi Arabia specializing in turnkey EPC civil, mechanical, piping, electrical contracting, heavy equipment rental, industrial material supply, and certified manpower.",
  url: "https://bestinternational.com.sa",
  ogImage: "/images/og-image.jpg",
  telephone: "+966 13 800 0000",
  email: "info@bestinternational.com.sa",
  address: {
    streetAddress: "King Abdulaziz Road",
    addressLocality: "Dammam / Al Khobar",
    addressRegion: "Eastern Province",
    postalCode: "31952",
    addressCountry: "SA",
  },
  geo: {
    latitude: "26.4207",
    longitude: "50.0888",
  },
  openingHours: "Mo-Sa 08:00-18:00",
  sameAs: [
    "https://www.linkedin.com/company/best-international-contracting",
    "https://twitter.com/bic_saudi",
  ],
};

interface MetadataProps {
  title?: string;
  description?: string;
  canonical?: string;
  focusKeyword?: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
  languages?: Record<string, string>;
  ogType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}

/**
 * Constructs a Next.js Metadata object with standard SEO tags, canonical URL,
 * focus keywords, OpenGraph, and Twitter card data.
 */
export function constructMetadata({
  title,
  description,
  canonical,
  focusKeyword,
  keywords = [],
  image,
  noIndex = false,
  languages,
  ogType = "website",
  publishedTime,
  modifiedTime,
  authors,
}: MetadataProps = {}): Metadata {
  let fullTitle = title ? title.trim() : `${siteConfig.name} | Industrial Solutions Saudi Arabia`;

  if (title) {
    // Strip existing trailing brand suffixes (e.g., "| BiC", "- BiC", "| Best International Contracting", "| BiC | BiC")
    fullTitle = fullTitle.replace(/(\s*[|\-–—]\s*(?:BiC|BIC|Best International Contracting Company|Best International Contracting|BiC Technical Insights))+\s*$/gi, "").trim();
    // Append single canonical brand suffix
    fullTitle = `${fullTitle} | ${siteConfig.shortName}`;
  }

  const metaDescription = description || siteConfig.description;
  const canonicalUrl = canonical
    ? canonical.startsWith("http")
      ? canonical
      : `${siteConfig.url}${canonical.startsWith("/") ? "" : "/"}${canonical}`
    : siteConfig.url;

  const allKeywords = [
    ...(focusKeyword ? [focusKeyword] : []),
    ...keywords,
    "Contracting Services Saudi Arabia",
    "Heavy Equipment Rental KSA",
    "Saudi Aramco Approved Contractor",
    "Industrial Manpower Supply",
    "Material Supply Dammam",
    "Best International Contracting",
  ];

  const ogImageUrl = image
    ? image.startsWith("http")
      ? image
    : `${siteConfig.url}${image.startsWith("/") ? "" : "/"}${image}`
    : `${siteConfig.url}/uploads/og-default.jpg`;

  return {
    title: {
      absolute: fullTitle,
    },
    description: metaDescription,
    keywords: Array.from(new Set(allKeywords)),
    alternates: {
      canonical: canonicalUrl,
      ...(languages && Object.keys(languages).length > 0 ? { languages } : {}),
    },
    openGraph: {
      title: fullTitle,
      description: metaDescription,
      url: canonicalUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: "en_US",
      type: ogType,
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      ...(authors && authors.length > 0 ? { authors } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: metaDescription,
      images: [ogImageUrl],
      creator: "@bic_saudi",
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

/**
 * Generates Schema.org JSON-LD for the Best International Contracting Organization / LocalBusiness.
 */
export function buildOrganizationJsonLd(baseUrl: string = siteConfig.url) {
  return {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": `${baseUrl}/#organization`,
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    image: `${baseUrl}/images/hero-building.jpg`,
    description: siteConfig.description,
    telephone: siteConfig.telephone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.streetAddress,
      addressLocality: siteConfig.address.addressLocality,
      addressRegion: siteConfig.address.addressRegion,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Saturday",
          "Sunday",
        ],
        opens: "08:00",
        closes: "18:00",
      },
    ],
    areaServed: [
      {
        "@type": "Country",
        name: "Saudi Arabia",
      },
      {
        "@type": "AdministrativeArea",
        name: "Eastern Province",
      },
      {
        "@type": "City",
        name: "Dammam",
      },
      {
        "@type": "City",
        name: "Jubail",
      },
      {
        "@type": "City",
        name: "Riyadh",
      },
      {
        "@type": "City",
        name: "Khobar",
      },
    ],
    sameAs: siteConfig.sameAs,
  };
}

/**
 * Generates Schema.org JSON-LD for a specific Service page.
 */
export function buildServiceJsonLd(service: any, baseUrl: string = siteConfig.url) {
  if (!service) return null;

  const serviceSlug = service.slug || `/services/${service.id}`;
  const serviceUrl = serviceSlug.startsWith("http")
    ? serviceSlug
    : `${baseUrl}${serviceSlug.startsWith("/") ? "" : "/"}${serviceSlug}`;

  const subServices = Array.isArray(service.subServices)
    ? service.subServices.map((sub: any) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: sub.title,
          description: sub.desc || sub.description,
        },
      }))
    : [];

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${serviceUrl}#service`,
    name: service.title,
    description: service.shortDesc || service.fullDesc || service.subtitle,
    url: serviceUrl,
    image: service.heroImage
      ? service.heroImage.startsWith("http")
        ? service.heroImage
        : `${baseUrl}${service.heroImage.startsWith("/") ? "" : "/"}${service.heroImage}`
      : undefined,
    provider: {
      "@type": "GeneralContractor",
      "@id": `${baseUrl}/#organization`,
      name: siteConfig.name,
      url: baseUrl,
    },
    areaServed: {
      "@type": "Country",
      name: "Saudi Arabia",
    },
    hasOfferCatalog:
      subServices.length > 0
        ? {
            "@type": "OfferCatalog",
            name: `${service.title} Capabilities`,
            itemListElement: subServices,
          }
        : undefined,
  };
}

/**
 * Generates Schema.org FAQPage JSON-LD from FAQ items.
 */
export function buildFaqJsonLd(faqs: Array<{ q?: string; question?: string; a?: string; answer?: string }>) {
  if (!Array.isArray(faqs) || faqs.length === 0) return null;

  const validFaqs = faqs.filter((f) => (f.q || f.question) && (f.a || f.answer));
  if (validFaqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: validFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.q || faq.question || "",
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a || faq.answer || "",
      },
    })),
  };
}

/**
 * Generates Schema.org BreadcrumbList JSON-LD.
 */
export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>,
  baseUrl: string = siteConfig.url
) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const fullUrl = item.url.startsWith("http")
        ? item.url
        : `${baseUrl}${item.url.startsWith("/") ? "" : "/"}${item.url}`;
      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: fullUrl,
      };
    }),
  };
}
