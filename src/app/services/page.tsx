import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import ServiceHorizontalRow from "@/components/ServiceHorizontalRow";
import { getServicesData } from "@/lib/getServicesData";
import { 
  constructMetadata, 
  buildBreadcrumbJsonLd, 
  siteConfig 
} from "@/lib/seo";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: "Industrial Contracting & Engineering Services | Best International KSA",
    description: "Explore our specialized industrial contracting, heavy equipment rental, material procurement, and technical manpower supply services across Saudi Arabia.",
    canonical: `${siteConfig.url}/services`,
    focusKeyword: "Industrial Contracting Services Saudi Arabia",
    image: `${siteConfig.url}/uploads/og-default.jpg`,
  });
}

export default function ServicesPage() {
  const allServices = getServicesData();
  const activeServices = allServices.filter((s: any) => s.active !== false);

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
  ]);

  const serviceCatalogSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: activeServices.map((service: any, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.title,
        description: service.shortDesc || service.fullDesc,
        url: `${siteConfig.url}${service.slug || "/services/" + service.id}`,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-[#fdfdfd]">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={serviceCatalogSchema} />
      <Header />
      
      {/* Premium Page Hero (Same Luxury Standard as About Page) */}
      <div className="pt-[var(--header-h,88px)]">
        <PageHero
          badge="OUR CAPABILITIES"
          title="Industrial Contracting &"
          titleAccent="Engineering Services"
          description="Turnkey civil, mechanical, piping, electrical contracting, heavy equipment rental, material procurement, and technical manpower solutions engineered for Saudi Arabia's premier industrial projects."
          breadcrumbs={[{ label: "Services" }]}
          bgImage="https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=2070&auto=format&fit=crop"
          watermark="SERVICES"
          taglines={[
            "SAUDI ARAMCO APPROVED",
            "SABIC COMPLIANT",
            "ISO 9001:2015 CERTIFIED",
            "KINGDOM-WIDE MOBILIZATION"
          ]}
          stats={[
            { value: "4+", label: "Core Divisions" },
            { value: "50+", label: "Specialized Capabilities" },
            { value: "100%", label: "Safety & QA/QC" },
            { value: "24/7", label: "Fleet & Crew Support" },
          ]}
        />
      </div>

      {/* Section Heading */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 pt-16 pb-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-8">
          <div>
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-10 h-[2px] bg-[#E62E2D]" />
              <span className="text-[#E62E2D] font-bold text-xs sm:text-sm tracking-widest uppercase">
                PORTFOLIO OF DISCIPLINES
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-[34px] font-bold leading-[1.2] tracking-tight text-[#111]">
              Explore Our Core <br className="hidden sm:inline" />
              <span className="text-[#E62E2D] relative inline-block">
                Specialized Divisions
                <span className="absolute bottom-1 left-0 w-full h-[8px] bg-[#E62E2D]/20 -z-10" />
              </span>
            </h2>
          </div>
          <p className="text-gray-600 text-sm sm:text-base max-w-md leading-relaxed">
            Click on any division to access detailed capabilities, compliance standards, plant execution scopes, and technical specifications.
          </p>
        </div>
      </div>

      {/* Premium Services Horizontal Rows (Exact Reference Layout) */}
      <section className="max-w-[1650px] mx-auto px-6 sm:px-10 lg:px-12 py-10 pb-24">
        {activeServices.map((srv: any, idx: number) => (
          <ServiceHorizontalRow key={srv.id} srv={srv} idx={idx} />
        ))}
      </section>
      
      <Footer />
    </main>
  );
}
