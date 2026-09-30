import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import ShopListingClient from "@/components/ShopListingClient";
import rawProducts from "@/data/shopData.json";
import rawCategories from "@/data/shopCategories.json";
import { constructMetadata, buildBreadcrumbJsonLd, siteConfig } from "@/lib/seo";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: "Industrial Equipment & Machinery Shop | Best International Contracting - BiC",
    description: "Explore Best International's verified inventory of heavy earth moving equipment, mobile cranes, power generators, compaction rollers, and access lifts in Saudi Arabia.",
    canonical: `${siteConfig.url}/shop`,
    focusKeyword: "Industrial Equipment & Machinery Shop Saudi Arabia",
    image: `${siteConfig.url}/uploads/upload-1790330735644-1790240810196-mechanical---piping-works3-b7bdda5f793f8bd8.jpeg`,
  });
}

export default function ShopPage() {
  const products = (rawProducts as any) || [];
  const categories = (rawCategories as any) || [];

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Shop", url: "/shop" },
  ]);

  const shopCatalogSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "BIC Industrial Equipment & Machinery Catalog",
    description: "Certified heavy machinery, mobile cranes, diesel generators, and construction equipment available across Saudi Arabia.",
    itemListElement: products.map((item: any, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: item.name,
        description: item.shortDesc || item.name,
        image: item.image,
        offers: {
          "@type": "Offer",
          availability: item.availability === "In Stock" ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
          priceCurrency: "SAR",
          price: "0",
          url: `${siteConfig.url}/shop`
        }
      }
    }))
  };

  return (
    <main className="min-h-screen bg-[#f8f9fb] text-gray-900 overflow-x-hidden selection:bg-[#E62E2D] selection:text-white">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={shopCatalogSchema} />
      <Header />

      {/* ── HERO SECTION (Exact Service Detail Style) ─────────────── */}
      <div className="pt-[var(--header-h,88px)]">
        <PageHero
          badge="EQUIPMENT STORE & RENTAL INVENTORY"
          title="Industrial Equipment &"
          titleAccent="Machinery Shop"
          description="Explore Best International Contracting's comprehensive inventory of heavy earth moving equipment, all-terrain cranes, diesel power generators, compaction rollers, and access lifts available for procurement and rapid project mobilization across Saudi Arabia."
          breadcrumbs={[
            { label: "Shop" }
          ]}
          bgImage="/uploads/upload-1790330735644-1790240810196-mechanical---piping-works3-b7bdda5f793f8bd8.jpeg"
          watermark="SHOP"
          taglines={[
            "CERTIFIED HEAVY EQUIPMENT",
            "READY KSA WAREHOUSE STOCK",
            "EXPRESS SITE MOBILIZATION",
            "DIRECT COMMERCIAL RFQ QUOTES"
          ]}
          stats={[
            { value: "5,000+", label: "Stock & Fleet Items" },
            { value: "100%", label: "Aramco & ISO Certified" },
            { value: "24/7", label: "Fast Dispatch KSA" },
            { value: "Best Rate", label: "Competitive B2B Rates" }
          ]}
        />
      </div>

      {/* ── EXACT SHOP SECTION DESIGN ──────────────────────────────── */}
      <ShopListingClient products={products} categories={categories} />

      <Footer />
    </main>
  );
}
