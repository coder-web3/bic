import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import CoreValuesSection from "@/components/CoreValuesSection";
import ServicesSection from "@/components/ServicesSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import ClientsSection from "@/components/ClientsSection";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { getHomepageContent } from "@/lib/getHomepageContent";
import { constructMetadata, buildOrganizationJsonLd, buildBreadcrumbJsonLd, siteConfig } from "@/lib/seo";

// Ensure page revalidates or fetches dynamic content
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const content = getHomepageContent();
  const seo = content?.seo;

  return constructMetadata({
    title: seo?.metaTitle || `${siteConfig.name} | Industrial Solutions Saudi Arabia`,
    description: seo?.metaDescription || siteConfig.description,
    canonical: seo?.canonicalUrl || siteConfig.url,
    focusKeyword: seo?.focusKeyword || "Industrial Contracting Company Saudi Arabia",
    image: seo?.ogImage || `${siteConfig.url}/uploads/og-default.jpg`,
  });
}

export default function Home() {
  const content = getHomepageContent();

  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" }
  ]);

  return (
    <main className="min-h-screen">
      <JsonLd data={breadcrumbs} />
      <Header />
      <Hero data={content?.hero} />
      <AboutSection data={content?.about} />
      <CoreValuesSection data={content?.coreValues} />
      <ServicesSection data={content?.services} />
      <WhyChooseUsSection data={content?.whyChooseUs} />
      <ClientsSection data={content?.clients} />
      <Footer />
    </main>
  );
}
