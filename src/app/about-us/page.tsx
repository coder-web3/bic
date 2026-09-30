import type { Metadata } from "next";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import AboutSection from "@/components/AboutSection";
import AboutEthosMissionSections from "@/components/AboutEthosMissionSections";
import Footer from "@/components/Footer";

import JsonLd from "@/components/JsonLd";
import { getAboutData } from "@/lib/getAboutData";
import { constructMetadata, buildBreadcrumbJsonLd, siteConfig } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const aboutData = getAboutData();
  const seo = aboutData?.seo || {};

  return constructMetadata({
    title: seo.metaTitle || "About Us | Decades of Industrial Excellence - BiC",
    description: seo.metaDescription || "Learn more about Best International Contracting — our history, ISO certifications, Saudi Aramco approvals, and industrial EPC capabilities across Saudi Arabia.",
    canonical: `${siteConfig.url}/about-us`,
    focusKeyword: seo.focusKeyword || "About Best International Contracting Saudi Arabia",
    image: seo.ogImage || `${siteConfig.url}/uploads/upload-1790407774913-Civil_Works.avif`,
  });
}

export default function AboutPage() {
  const aboutData = getAboutData();
  const hero = aboutData?.hero || {};
  const whoWeAre = aboutData?.whoWeAre || {};
  const ethos = aboutData?.ethos || {};
  const visionMission = aboutData?.visionMission || {};

  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "About Us", url: "/about-us" },
  ]);

  return (
    <main className="min-h-screen">
      <JsonLd data={breadcrumbs} />
      <Header />

      <div className="pt-[var(--header-h,88px)]">
        <PageHero
          badge={hero.badge || "WHO WE ARE"}
          title={hero.title || "About Best International"}
          titleAccent={hero.titleAccent || "Contracting"}
          description={hero.description || "Delivering world-class civil, mechanical, and industrial contracting solutions across Saudi Arabia since 1994 — trusted by Aramco, SABIC, and 100+ industry leaders."}
          breadcrumbs={[{ label: "About Us" }]}
          bgImage={hero.bgImage || "https://images.unsplash.com/photo-1504307651254-35680f356f12?q=80&w=2070&auto=format&fit=crop"}
          watermark={hero.watermark || "BIC"}
          taglines={hero.taglines || [
            "FOUNDED · 1994",
            "SAUDI ARAMCO APPROVED",
            "KINGDOM OF SAUDI ARABIA",
          ]}
          stats={hero.stats || [
            { value: "30+", label: "Years of Experience" },
            { value: "100+", label: "Clients Served" },
            { value: "200+", label: "Projects Delivered" },
            { value: "99%", label: "Client Retention" },
          ]}
        />
      </div>

      <AboutSection data={whoWeAre} />
      <AboutEthosMissionSections ethosData={ethos} visionMissionData={visionMission} />
      <Footer />
    </main>
  );
}


