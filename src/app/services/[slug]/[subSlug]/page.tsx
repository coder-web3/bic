import { notFound } from "next/navigation";
import type { Metadata } from "next";
import GenericServiceDetail from "@/components/GenericServiceDetail";
import JsonLd from "@/components/JsonLd";
import { getServicesData } from "@/lib/getServicesData";
import {
  findSubService,
  buildCompleteSubServiceData,
  getParentServiceSlug,
  getSubServiceSlug
} from "@/lib/subServiceUtils";
import {
  constructMetadata,
  buildServiceJsonLd,
  buildFaqJsonLd,
  buildBreadcrumbJsonLd,
  siteConfig
} from "@/lib/seo";

export const revalidate = 0;

interface SubServicePageProps {
  params: Promise<{
    slug: string;
    subSlug: string;
  }>;
}

function findParentService(services: any[], rawSlug: string) {
  if (!rawSlug) return null;
  const clean = decodeURIComponent(rawSlug).toLowerCase().trim().replace(/^\/+|\/+$/g, "");

  return services.find((s: any) => {
    const sId = (s.id || "").toLowerCase().trim().replace(/^\/+|\/+$/g, "");
    const sSlug = (s.slug || "").toLowerCase().trim().replace(/^\/+|\/+$/g, "");
    const sSlugClean = sSlug.replace(/^services\//, "");

    return sId === clean || sSlug === clean || sSlugClean === clean || sSlug === `services/${clean}`;
  });
}

export async function generateMetadata({ params }: SubServicePageProps): Promise<Metadata> {
  const { slug, subSlug } = await params;
  const services = getServicesData();
  const parentService = findParentService(services, slug);

  if (!parentService) {
    return constructMetadata({
      title: "Service Not Found | Best International Contracting",
      description: "The requested service category could not be found."
    });
  }

  const subService = findSubService(parentService, subSlug);
  if (!subService) {
    return constructMetadata({
      title: "Sub-Service Not Found | Best International Contracting",
      description: "The requested sub-service capability could not be found."
    });
  }

  const data = buildCompleteSubServiceData(parentService, subService);
  if (!data) {
    return constructMetadata({
      title: "Sub-Service Not Found | Best International Contracting",
      description: "The requested sub-service capability could not be found."
    });
  }

  const title = data.metaTitle || `${data.title} | ${parentService.title} - Best International`;
  const description = data.metaDescription || data.shortDesc || `Specialized ${data.title} solutions in Saudi Arabia.`;
  const canonical = data.canonicalUrl || `${siteConfig.url}/services/${slug}/${subSlug}`;
  const focusKeyword = data.focusKeyword || `${data.title} Saudi Arabia`;
  const image = data.ogImage || data.heroImage || parentService.heroImage;

  return constructMetadata({
    title,
    description,
    canonical,
    focusKeyword,
    image
  });
}

export default async function SubServiceDynamicPage({ params }: SubServicePageProps) {
  const { slug, subSlug } = await params;
  const services = getServicesData();
  const parentService = findParentService(services, slug);

  if (!parentService) {
    notFound();
  }

  const rawSubService = findSubService(parentService, subSlug);
  if (!rawSubService) {
    notFound();
  }

  const subServiceData = buildCompleteSubServiceData(parentService, rawSubService);
  if (!subServiceData) {
    notFound();
  }

  const parentSlug = getParentServiceSlug(parentService);
  const currentSubSlug = getSubServiceSlug(rawSubService);

  const breadcrumbsList = [
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
    { name: parentService.title || "Services", url: `/services/${parentSlug}` },
    { name: subServiceData.title, url: `/services/${parentSlug}/${currentSubSlug}` }
  ];

  const pageHeroBreadcrumbs = [
    { label: "Services", href: "/services" },
    { label: parentService.title || "Category", href: `/services/${parentSlug}` },
    { label: subServiceData.title }
  ];

  const serviceSchema = buildServiceJsonLd(subServiceData);
  const faqSchema = subServiceData.faqs?.length ? buildFaqJsonLd(subServiceData.faqs) : null;
  const breadcrumbSchema = buildBreadcrumbJsonLd(breadcrumbsList);

  let customSchemaObj = null;
  if (subServiceData.customSchema) {
    try {
      customSchemaObj = JSON.parse(subServiceData.customSchema);
    } catch (e) {
      console.error("Invalid custom schema JSON:", e);
    }
  }

  return (
    <>
      <JsonLd data={serviceSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}
      <JsonLd data={breadcrumbSchema} />
      {customSchemaObj && <JsonLd data={customSchemaObj} />}
      <GenericServiceDetail
        badge={subServiceData.badge}
        title={subServiceData.title}
        subtitle={subServiceData.subtitle}
        description={subServiceData.shortDesc || subServiceData.fullDesc}
        heroImage={subServiceData.heroImage}
        watermark={subServiceData.heroWatermark}
        overviewTitle={subServiceData.overview?.title}
        overviewDesc1={subServiceData.overview?.desc1}
        overviewDesc2={subServiceData.overview?.desc2}
        specs={subServiceData.overview?.specs}
        subServices={subServiceData.subServices || []}
        faqs={subServiceData.faqs || []}
        serviceData={{
          ...subServiceData,
          breadcrumbs: pageHeroBreadcrumbs
        }}
      />
    </>
  );
}
