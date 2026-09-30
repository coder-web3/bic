import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import SmoothScroll from "@/components/SmoothScroll";
import { buildOrganizationJsonLd, siteConfig } from "@/lib/seo";
import { getSiteSettings } from "@/lib/getSiteSettings";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSiteSettings();
  const general = settings?.general;
  const siteName = general?.siteName || siteConfig.name;
  const shortName = general?.shortName || siteConfig.shortName;
  const favicon = general?.faviconUrl || "/favicon.ico";

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${siteName} | Industrial Solutions Saudi Arabia`,
      template: `%s | ${shortName}`,
    },
    description: siteConfig.description,
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: favicon,
    },
    keywords: [
      "Industrial Contracting Saudi Arabia",
      "Heavy Equipment Rental Dammam",
      "Turnkey EPC Contractor KSA",
      "Saudi Aramco Approved Contractor",
      "Industrial Manpower Supply",
      "Material Supply Saudi Arabia",
      "Best International Contracting",
    ],
    authors: [{ name: siteName, url: siteConfig.url }],
    creator: siteName,
    alternates: {
      canonical: siteConfig.url,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      siteName: siteName,
      title: `${siteName} | Industrial Solutions Saudi Arabia`,
      description: siteConfig.description,
      images: [
        {
          url: `${siteConfig.url}/uploads/og-default.jpg`,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} | Industrial Solutions Saudi Arabia`,
      description: siteConfig.description,
      images: [`${siteConfig.url}/uploads/og-default.jpg`],
      creator: "@bic_saudi",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SmoothScroll />
        <JsonLd data={buildOrganizationJsonLd()} />
        {children}
      </body>
    </html>
  );
}
