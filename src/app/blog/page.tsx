import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import BlogListingClient from "@/components/BlogListingClient";
import { getBlogData } from "@/lib/getBlogData";
import { constructMetadata, buildBreadcrumbJsonLd, siteConfig } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const blogData = getBlogData();
  const seo = blogData?.seo || {};
  return constructMetadata({
    title: seo.title || "Industrial Insights, Standards & Technical Articles - BiC Blog",
    description: seo.description || "Explore technical articles on heavy equipment safety, Aramco compliance standards, refinery turnaround strategies, and industrial engineering in Saudi Arabia.",
    canonical: `${siteConfig.url}/blog`,
    focusKeyword: seo.focusKeyword || "Industrial Contracting Blog Saudi Arabia",
    image: `${siteConfig.url}/uploads/upload-1790407774913-Civil_Works.avif`,
  });
}

export default function BlogPage() {
  const blogData = getBlogData();
  const hero = blogData?.hero || {
    badge: "KNOWLEDGE BASE & INDUSTRY INSIGHTS",
    title: "Technical Articles &",
    titleAccent: "Engineering Insights",
    description: "Explore Best International Contracting's technical articles, Aramco safety compliance standards, refinery turnaround strategies, heavy equipment fleet management, and turnkey engineering updates across Saudi Arabia.",
    bgImage: "/uploads/upload-1790407774913-Civil_Works.avif",
    watermark: "INSIGHTS",
    taglines: [
      "TECHNICAL ENGINEERING PAPERS",
      "ARAMCO & SABIC STANDARDS",
      "EQUIPMENT & FLEET BEST PRACTICES",
      "KINGDOM-WIDE EPC UPDATES"
    ],
    stats: [
      { value: "50+", label: "Technical Articles" },
      { value: "100%", label: "Industry Compliant" },
      { value: "30+", label: "Years Experience" },
      { value: "Weekly", label: "Engineering Updates" }
    ]
  };

  const settings = blogData?.settings;
  const rawArticles = blogData?.articles || [];
  
  // Only show published articles on the public blog listing (filter out drafts)
  const publishedArticles = rawArticles.filter((article: any) => article.status !== "draft");

  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
  ]);

  return (
    <main className="min-h-screen bg-[#f8f9fb] text-gray-900 overflow-x-hidden selection:bg-[#E62E2D] selection:text-white">
      <JsonLd data={breadcrumbs} />
      <Header />

      {/* ── HERO SECTION (Exact Shop & Equipment Standard) ────────────────── */}
      <div className="pt-[var(--header-h,88px)]">
        <PageHero
          badge={hero.badge}
          title={hero.title}
          titleAccent={hero.titleAccent}
          description={hero.description}
          breadcrumbs={[
            { label: "Blog" }
          ]}
          bgImage={hero.bgImage}
          watermark={hero.watermark}
          taglines={hero.taglines}
          stats={hero.stats}
        />
      </div>

      {/* ── BLOG & INSIGHTS ARTICLE LISTING & SIDEBAR ─────────────────────── */}
      <BlogListingClient initialArticles={publishedArticles} initialSettings={settings} />

      <Footer />
    </main>
  );
}
