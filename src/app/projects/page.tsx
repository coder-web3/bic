import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import ProjectsListingClient from "@/components/ProjectsListingClient";
import { constructMetadata, buildBreadcrumbJsonLd, siteConfig } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: "Featured Industrial Projects & EPC Case Studies | Best International KSA",
    description: "Browse completed civil works, heavy equipment fleet deployments, refinery turnarounds, and industrial contracting projects delivered across Saudi Arabia by Best International.",
    canonical: `${siteConfig.url}/projects`,
    focusKeyword: "Industrial Contracting Projects Saudi Arabia",
    image: `${siteConfig.url}/uploads/og-default.jpg`,
  });
}

export default function ProjectsPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Projects", url: "/projects" },
  ]);

  return (
    <main className="min-h-screen bg-[#fdfdfd]">
      <JsonLd data={breadcrumbs} />
      <Header />

      {/* Premium Page Hero (Exact Standard as Services & Contact Pages) */}
      <div className="pt-[var(--header-h,88px)]">
        <PageHero
          badge="PORTFOLIO OF SUCCESS"
          title="Featured Capital Works &"
          titleAccent="Industrial Projects"
          description="A proven track record of turnkey civil infrastructure, plant turnarounds, heavy equipment fleet mobilization, and specialized engineering works delivered for premier clients across Saudi Arabia."
          breadcrumbs={[{ label: "Projects" }]}
          bgImage="https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=2070&auto=format&fit=crop"
          watermark="PROJECTS"
          taglines={[
            "200+ COMPLETED PROJECTS",
            "ARAMCO & SABIC APPROVED",
            "ZERO LTI SAFETY RECORD",
            "KINGDOM-WIDE MOBILIZATION"
          ]}
          stats={[
            { value: "200+", label: "Delivered Projects" },
            { value: "100+", label: "Industrial Clients" },
            { value: "30+", label: "Years Track Record" },
            { value: "100%", label: "On-Time Milestone Delivery" },
          ]}
        />
      </div>

      {/* Interactive Projects Portfolio Showcase with Who We Are font typography */}
      <ProjectsListingClient />

      <Footer />
    </main>
  );
}
