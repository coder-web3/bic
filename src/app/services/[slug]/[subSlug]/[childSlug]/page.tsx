import { notFound } from "next/navigation";
import type { Metadata } from "next";
import GenericServiceDetail from "@/components/GenericServiceDetail";
import JsonLd from "@/components/JsonLd";
import { getServicesData } from "@/lib/getServicesData";
import {
  findSubService,
  findChildService,
  buildCompleteChildServiceData,
  getParentServiceSlug,
  getSubServiceSlug,
  getChildServiceSlug
} from "@/lib/subServiceUtils";
import {
  constructMetadata,
  buildServiceJsonLd,
  buildFaqJsonLd,
  buildBreadcrumbJsonLd,
  siteConfig
} from "@/lib/seo";

export const revalidate = 0;

interface ChildServicePageProps {
  params: Promise<{
    slug: string;
    subSlug: string;
    childSlug: string;
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

export async function generateMetadata({ params }: ChildServicePageProps): Promise<Metadata> {
  const { slug, subSlug, childSlug } = await params;
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
      description: "The requested sub-service could not be found."
    });
  }

  const childService = findChildService(subService, childSlug);
  if (!childService) {
    return constructMetadata({
      title: "Capability Not Found | Best International Contracting",
      description: "The requested specialized capability could not be found."
    });
  }

  const data = buildCompleteChildServiceData(parentService, subService, childService);
  if (!data) {
    return constructMetadata({
      title: "Capability Not Found | Best International Contracting",
      description: "The requested specialized capability could not be found."
    });
  }

  const title = data.metaTitle || `${data.title} | ${subService.title} - Best International Contracting`;
  const description = data.metaDescription || data.shortDesc || `Specialized ${data.title} capabilities in Saudi Arabia.`;
  const canonical = data.canonicalUrl || `${siteConfig.url}/services/${slug}/${subSlug}/${childSlug}`;
  const focusKeyword = data.focusKeyword || `${data.title} Saudi Arabia`;
  const image = data.ogImage || data.heroImage || subService.heroImage || parentService.heroImage;

  return constructMetadata({
    title,
    description,
    canonical,
    focusKeyword,
    image
  });
}

export default async function ChildServiceDynamicPage({ params }: ChildServicePageProps) {
  const { slug, subSlug, childSlug } = await params;
  const services = getServicesData();
  const parentService = findParentService(services, slug);

  if (!parentService) {
    notFound();
  }

  const rawSubService = findSubService(parentService, subSlug);
  if (!rawSubService) {
    notFound();
  }

  const rawChildService = findChildService(rawSubService, childSlug);
  if (!rawChildService) {
    notFound();
  }

  const childServiceData = buildCompleteChildServiceData(parentService, rawSubService, rawChildService);
  if (!childServiceData) {
    notFound();
  }

  const parentSlug = getParentServiceSlug(parentService);
  const currentSubSlug = getSubServiceSlug(rawSubService);
  const currentChildSlug = getChildServiceSlug(rawChildService);

  const breadcrumbsList = [
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
    { name: parentService.title || "Services", url: `/services/${parentSlug}` },
    { name: rawSubService.title, url: `/services/${parentSlug}/${currentSubSlug}` },
    { name: childServiceData.title, url: `/services/${parentSlug}/${currentSubSlug}/${currentChildSlug}` }
  ];

  const pageHeroBreadcrumbs = [
    { label: "Services", href: "/services" },
    { label: parentService.title || "Category", href: `/services/${parentSlug}` },
    { label: rawSubService.title, href: `/services/${parentSlug}/${currentSubSlug}` },
    { label: childServiceData.title }
  ];

  const serviceSchema = buildServiceJsonLd(childServiceData);
  const faqSchema = childServiceData.faqs?.length ? buildFaqJsonLd(childServiceData.faqs) : null;
  const breadcrumbSchema = buildBreadcrumbJsonLd(breadcrumbsList);

  let customSchemaObj = null;
  if (childServiceData.customSchema) {
    try {
      customSchemaObj = JSON.parse(childServiceData.customSchema);
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
        badge={childServiceData.badge}
        title={childServiceData.title}
        subtitle={childServiceData.subtitle}
        description={childServiceData.shortDesc || childServiceData.fullDesc}
        heroImage={childServiceData.heroImage}
        watermark={childServiceData.heroWatermark}
        overviewTitle={childServiceData.overview?.title}
        overviewDesc1={childServiceData.overview?.desc1}
        overviewDesc2={childServiceData.overview?.desc2}
        specs={childServiceData.overview?.specs}
        subServices={childServiceData.subServices || []}
        faqs={childServiceData.faqs || []}
        serviceData={{
          ...childServiceData,
          breadcrumbs: pageHeroBreadcrumbs
        }}
      />
    </>
  );
}
