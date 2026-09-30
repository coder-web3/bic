import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import { constructMetadata, buildBreadcrumbJsonLd, siteConfig } from "@/lib/seo";
import GalleryListingClient from "@/components/GalleryListingClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getGalleryData() {
  try {
    const filePath = path.join(process.cwd(), "src", "data", "galleryData.json");
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf8");
      return JSON.parse(fileContent);
    }
  } catch (error) {
    console.error("Error reading galleryData.json:", error);
  }
  return null;
}

export async function generateMetadata(): Promise<Metadata> {
  const data = getGalleryData();
  const seo = data?.seo || {};

  return constructMetadata({
    title: seo.title || "Media Gallery & Project Site Photos - BiC",
    description: seo.description || "Explore on-site construction photos, heavy equipment fleet, pipe fabrication, and plant turnaround operations in Saudi Arabia.",
    canonical: `${siteConfig.url}/gallery`,
    focusKeyword: seo.focusKeyword || "Best International Contracting Gallery Saudi Arabia",
    image: data?.hero?.bgImage || `${siteConfig.url}/uploads/upload-1790407774913-Civil_Works.avif`,
  });
}

export default function GalleryPage() {
  const data = getGalleryData();

  const hero = data?.hero || {
    badge: "VISUAL MEDIA & SITE ARCHIVE",
    title: "Project Execution &",
    titleAccent: "Media Gallery",
    description: "Explore Best International Contracting's comprehensive visual showcase of heavy equipment fleets, industrial plant turnaround operations, civil foundations, and turnkey engineering landmarks across Saudi Arabia.",
    bgImage: "/uploads/upload-1790407774913-Civil_Works.avif",
    watermark: "GALLERY",
    taglines: [
      "VERIFIED INDUSTRIAL SITES",
      "SAUDI ARAMCO APPROVED FLEET",
      "TURNKEY EPC EXCELLENCE",
      "KINGDOM-WIDE MOBILIZATION"
    ],
    stats: [
      { value: "100+", label: "Verified Site Shots" },
      { value: "30+", label: "Years of Landmarks" },
      { value: "100%", label: "Live Field Projects" },
      { value: "HD", label: "Industrial Visuals" }
    ]
  };

  const images = data?.images && data.images.length > 0 ? data.images : [
    { src: "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=800&auto=format&fit=crop", category: "Fleet Operations" },
    { src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop", category: "Civil Works" },
    { src: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=800&auto=format&fit=crop", category: "Plant Maintenance" },
    { src: "https://images.unsplash.com/photo-1504307651254-35680f356f12?q=80&w=800&auto=format&fit=crop", category: "Industrial Access" },
    { src: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?q=80&w=800&auto=format&fit=crop", category: "Heavy Lifting" },
    { src: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop", category: "Mechanical Works" }
  ];

  const itemsPerPage = data?.settings?.itemsPerPage || 6;

  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Gallery", url: "/gallery" },
  ]);

  return (
    <main className="min-h-screen bg-[#f8f9fb] text-gray-900 overflow-x-hidden selection:bg-[#E62E2D] selection:text-white">
      <JsonLd data={breadcrumbs} />
      <Header />

      {/* ── HERO SECTION (Exact Shop & About Page Standard) ─────────────── */}
      <div className="pt-[var(--header-h,88px)]">
        <PageHero
          badge={hero.badge || "VISUAL MEDIA & SITE ARCHIVE"}
          title={hero.title || "Project Execution &"}
          titleAccent={hero.titleAccent || "Media Gallery"}
          description={hero.description || "Explore Best International Contracting's comprehensive visual showcase of heavy equipment fleets, industrial plant turnaround operations, civil foundations, and turnkey engineering landmarks across Saudi Arabia."}
          breadcrumbs={[
            { label: "Gallery" }
          ]}
          bgImage={hero.bgImage || "/uploads/upload-1790407774913-Civil_Works.avif"}
          watermark={hero.watermark || "GALLERY"}
          taglines={hero.taglines || [
            "VERIFIED INDUSTRIAL SITES",
            "SAUDI ARAMCO APPROVED FLEET",
            "TURNKEY EPC EXCELLENCE",
            "KINGDOM-WIDE MOBILIZATION"
          ]}
          stats={hero.stats || [
            { value: "100+", label: "Verified Site Shots" },
            { value: "30+", label: "Years of Landmarks" },
            { value: "100%", label: "Live Field Projects" },
            { value: "HD", label: "Industrial Visuals" }
          ]}
        />
      </div>

      {/* ── MEDIA GALLERY LISTING CLIENT ──────────────────────────── */}
      <GalleryListingClient
        images={images}
        itemsPerPage={itemsPerPage}
      />

      <Footer />
    </main>
  );
}
