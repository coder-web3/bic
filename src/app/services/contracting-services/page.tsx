import type { Metadata } from "next";
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

export async function generateMetadata(): Promise<Metadata> {
  const services = getServicesData();
  const service = services.find(
    (s: any) => s.id === "contracting-services" || s.slug?.includes("contracting")
  );

  const title = service?.metaTitle || "Industrial Contracting Services Saudi Arabia | Turnkey EPC - BiC";
  const description = service?.metaDescription || service?.shortDesc || "Turnkey industrial, civil, mechanical, piping, electrical, scaffolding, and plant turnaround contracting solutions in KSA.";
  const canonical = service?.canonicalUrl || `${siteConfig.url}/services/contracting-services`;
  const focusKeyword = service?.focusKeyword || "Industrial Contracting Services Saudi Arabia";
  const image = service?.ogImage || service?.heroImage;

  return constructMetadata({
    title,
    description,
    canonical,
    focusKeyword,
    image,
  });
}

export default function ContractingServicesPage() {
  const services = getServicesData();
  const serviceData = services.find(
    (s: any) => s.id === "contracting-services" || s.slug?.includes("contracting")
  );

  const serviceSchema = buildServiceJsonLd(serviceData);
  const faqSchema = serviceData?.faqs ? buildFaqJsonLd(serviceData.faqs) : null;
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
    { name: serviceData?.title || "Contracting Services", url: "/services/contracting-services" },
  ]);

  let customSchemaObj = null;
  if (serviceData?.customSchema) {
    try {
      customSchemaObj = JSON.parse(serviceData.customSchema);
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
      <ContractingServiceDetail serviceData={serviceData} />
    </>
  );
}
