import { notFound } from "next/navigation";
import type { Metadata } from "next";
import GenericServiceDetail from "@/components/GenericServiceDetail";
import ContractingServiceDetail from "@/components/ContractingServiceDetail";
import JsonLd from "@/components/JsonLd";
import { getServicesData } from "@/lib/getServicesData";
import { 
  constructMetadata, 
  buildServiceJsonLd, 
  buildFaqJsonLd, 
  buildBreadcrumbJsonLd, 
  siteConfig 
} from "@/lib/seo";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

function findServiceBySlug(services: any[], rawSlug: string) {
  if (!rawSlug) return null;
  const clean = decodeURIComponent(rawSlug).toLowerCase().trim().replace(/^\/+|\/+$/g, "");
  
  return services.find((s: any) => {
    const sId = (s.id || "").toLowerCase().trim().replace(/^\/+|\/+$/g, "");
    const sSlug = (s.slug || "").toLowerCase().trim().replace(/^\/+|\/+$/g, "");
    const sSlugClean = sSlug.replace(/^services\//, "");
    
    return sId === clean || sSlug === clean || sSlugClean === clean || sSlug === `services/${clean}`;
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const services = getServicesData();
  const service = findServiceBySlug(services, slug);

  if (!service) {
    return constructMetadata({
      title: "Service Not Found | Best International Contracting",
      description: "The requested service could not be found.",
    });
  }

  const title = service.metaTitle || `${service.title} | Best International Contracting Saudi Arabia`;
  const description = service.metaDescription || service.shortDesc || service.fullDesc || "Comprehensive industrial contracting services across Saudi Arabia.";
  const canonical = service.canonicalUrl || `${siteConfig.url}/services/${slug}`;
  const focusKeyword = service.focusKeyword || service.title;
  const image = service.ogImage || service.heroImage;

  return constructMetadata({
    title,
    description,
    canonical,
    focusKeyword,
    image,
  });
}

export default async function ServiceDynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const services = getServicesData();
  const service = findServiceBySlug(services, slug);

  if (!service) {
    notFound();
  }

  const serviceSchema = buildServiceJsonLd(service);
  const faqSchema = service.faqs?.length ? buildFaqJsonLd(service.faqs) : null;
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
    { name: service.title || "Service Detail", url: `/services/${slug}` },
  ]);

  let customSchemaObj = null;
  if (service.customSchema) {
    try {
      customSchemaObj = JSON.parse(service.customSchema);
    } catch (e) {
      console.error("Invalid custom schema JSON:", e);
    }
  }

  // If it's specifically contracting-services, use the dedicated Contracting layout
  if (service.id === "contracting-services") {
    return (
      <>
        <JsonLd data={serviceSchema} />
        {faqSchema && <JsonLd data={faqSchema} />}
        <JsonLd data={breadcrumbSchema} />
        {customSchemaObj && <JsonLd data={customSchemaObj} />}
        <ContractingServiceDetail serviceData={service} />
      </>
    );
  }

  return (
    <>
      <JsonLd data={serviceSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}
      <JsonLd data={breadcrumbSchema} />
      {customSchemaObj && <JsonLd data={customSchemaObj} />}
      <GenericServiceDetail
        badge={service.badge || "SPECIALIZED CAPABILITY"}
        title={service.title}
        subtitle={service.subtitle || service.shortDesc}
        description={service.shortDesc || service.fullDesc}
        heroImage={service.heroImage}
        watermark={service.heroWatermark || service.watermark || "BIC"}
        overviewTitle={service.overview?.title}
        overviewDesc1={service.overview?.desc1}
        overviewDesc2={service.overview?.desc2}
        specs={service.overview?.specs}
        subServices={service.subServices || []}
        faqs={service.faqs || []}
        serviceData={service}
      />
    </>
  );
}
