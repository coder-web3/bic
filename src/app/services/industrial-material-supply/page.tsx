import type { Metadata } from "next";
import GenericServiceDetail from "@/components/GenericServiceDetail";
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
    (s: any) => s.id === "industrial-material-supply" || s.slug?.includes("industrial-material-supply")
  );

  const title = service?.metaTitle || "Industrial Material Supply & Trading Saudi Arabia | Piping, Steel & Valves - BiC";
  const description = service?.metaDescription || service?.shortDesc || "Reliable supplier of ASTM/ASME certified piping, valves, structural steel, electrical components, and industrial hardware in Saudi Arabia.";
  const canonical = service?.canonicalUrl || `${siteConfig.url}/services/industrial-material-supply`;
  const focusKeyword = service?.focusKeyword || "Industrial Material Supply Saudi Arabia";
  const image = service?.ogImage || service?.heroImage;

  return constructMetadata({
    title,
    description,
    canonical,
    focusKeyword,
    image,
  });
}

const defaultSubServices = [
  {
    id: "01",
    title: "Pipes, Valves & Spool Fittings",
    desc: "Seamless carbon steel, stainless steel, and alloy pipes, high-pressure flange fittings, gate/ball/check valves with mill test certificates.",
    tags: ["CS/SS Seamless Pipes", "Flanges & Fittings", "Valves", "Mill Certified"]
  },
  {
    id: "02",
    title: "Structural Steel & Grating",
    desc: "H-Beams, I-Beams, channels, equal angles, galvanized steel gratings, check plates, and structural fasteners.",
    tags: ["H-Beams & Channels", "Galvanized Gratings", "Fasteners", "Structural Plates"]
  },
  {
    id: "03",
    title: "Electrical & Instrumentation Materials",
    desc: "MV/LV power cables, explosion-proof junction boxes, cable trays, grounding conductors, and conduit fittings.",
    tags: ["Power Cabling", "Cable Trays", "Junction Boxes", "Conduits"]
  },
  {
    id: "04",
    title: "Safety Equipment & Industrial Consumables",
    desc: "Aramco-approved PPE, flame-retardant coveralls, safety harnesses, welding electrodes, industrial paints, and abrasives.",
    tags: ["Aramco PPE", "FR Coveralls", "Welding Consumables", "Abrasives"]
  }
];

const defaultFaqs = [
  {
    q: "Do supplied materials include Mill Test Certificates (MTC)?",
    a: "Yes. All piping, structural steel, and critical industrial items come with EN 10204 3.1 Mill Test Certificates and full batch traceability."
  },
  {
    q: "Can BIC handle bulk site delivery across Saudi Arabia?",
    a: "Yes, our logistics fleet delivers directly to project sites in Jubail, Dammam, Yanbu, NEOM, Riyadh, and remote project locations."
  }
];

export default function IndustrialMaterialSupplyPage() {
  const services = getServicesData();
  const serviceData = services.find(
    (s: any) => s.id === "industrial-material-supply" || s.slug?.includes("industrial-material-supply")
  );

  const activeFaqs = serviceData?.faqs?.length ? serviceData.faqs : defaultFaqs;
  const serviceSchema = buildServiceJsonLd(serviceData || {
    title: "Industrial Material Supply",
    slug: "/services/industrial-material-supply",
    shortDesc: "Reliable procurement and delivery of certified industrial materials in Saudi Arabia."
  });
  const faqSchema = buildFaqJsonLd(activeFaqs);
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
    { name: serviceData?.title || "Industrial Material Supply", url: "/services/industrial-material-supply" },
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
      <GenericServiceDetail
        badge="INDUSTRIAL PROCUREMENT"
        title="Industrial Material"
        titleAccent="Supply"
        subtitle="Mill-Certified Pipes, Valves, Structural Steel & Electrical Consumables"
        description="Reliable procurement and delivery of certified industrial materials, piping spools, steel, and electrical components."
        heroImage="https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070&auto=format&fit=crop"
        watermark="SUPPLY"
        overviewTitle="Mill-Certified Materials Delivered Straight To Site"
        overviewDesc1="Best International provides end-to-end industrial material procurement services, supplying Tier-1 mill-certified piping, structural steel, electrical consumables, and safety gear."
        overviewDesc2="We partner with globally accredited manufacturers to ensure all materials comply with Saudi Aramco, SABIC, and international engineering specifications."
        specs={[
          "EN 10204 3.1 Mill Test Certificates Provided",
          "Full Material Traceability & QA Inspection",
          "Direct On-Site Logistics Delivery Across KSA",
          "Bulk Storage & Emergency Reserve Stock"
        ]}
        subServices={defaultSubServices}
        faqs={defaultFaqs}
        serviceData={serviceData}
      />
    </>
  );
}
