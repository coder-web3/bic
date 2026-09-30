import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import ClientsListingClient from "@/components/ClientsListingClient";
import { getClientsData } from "@/lib/getClientsData";
import { constructMetadata, buildBreadcrumbJsonLd, siteConfig } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: "Our Clients & Partners | Best International Contracting - BiC",
    description: "Discover our strategic partnerships with Saudi Aramco, SABIC, Samsung Engineering, Hyundai E&C, Sicim, Archirodon, and leading EPC enterprises across Saudi Arabia.",
    canonical: `${siteConfig.url}/clients`,
    focusKeyword: "Clients & Partners Best International Contracting Saudi Arabia",
    image: `${siteConfig.url}/uploads/upload-1790407774913-Civil_Works.avif`,
  });
}

export default function ClientsPage() {
  const clients = getClientsData();

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Our Clients", url: "/clients" },
  ]);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Best International Contracting Company",
    url: siteConfig.url,
    logo: `${siteConfig.url}/uploads/upload-1790411215652-best_logo-01.png`,
    description: "Leading industrial equipment rental, specialized contracting, and manpower supply partner in Saudi Arabia.",
    knowsAbout: [
      "Saudi Aramco Approved Contracting",
      "SABIC Qualified Vendor",
      "Heavy Equipment Rental",
      "Civil and Mechanical Contracting",
      "Industrial Scaffolding and Access"
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Industrial Client Services",
      itemListElement: clients.map((c: any, index: number) => ({
        "@type": "Offer",
        position: index + 1,
        name: `${c.name} - Strategic Partner`,
        category: "Client Partner",
        description: c.arabic ? `${c.name} (${c.arabic})` : c.name
      }))
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f9fb] text-gray-900 overflow-x-hidden selection:bg-[#E62E2D] selection:text-white">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={organizationSchema} />
      <Header />

      {/* ── HERO SECTION (Exact Shop Listing / Service Detail Style) ── */}
      <div className="pt-[var(--header-h,88px)]">
        <PageHero
          badge="STRATEGIC INDUSTRIAL PARTNERSHIPS"
          title="Trusted by Global &"
          titleAccent="Saudi Industry Leaders"
          description="Over a decade of successful contracting, heavy equipment mobilization, and specialized industrial workforce partnerships with the Kingdom's premier energy, petrochemical, infrastructure, and EPC conglomerates."
          breadcrumbs={[
            { label: "Our Clients" }
          ]}
          bgImage="/uploads/upload-1790407774913-Civil_Works.avif"
          watermark="CLIENTS"
          taglines={[
            "ARAMCO & SABIC APPROVED",
            "100+ MAJOR ENTERPRISE CLIENTS",
            "200+ COMPLETED MEGA PROJECTS",
            "99% LONG-TERM RETENTION"
          ]}
        />
      </div>

      {/* ── CLIENTS DIRECTORY & PARTNERSHIP ECOSYSTEM ─────────────── */}
      <ClientsListingClient
        clients={clients}
      />

      <Footer />
    </main>
  );
}
