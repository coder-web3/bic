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
    (s: any) => s.id === "equipment-rental" || s.slug?.includes("equipment-rental")
  );

  const title = service?.metaTitle || "Heavy Equipment Rental Saudi Arabia | Certified Cranes & Fleet - BiC";
  const description = service?.metaDescription || service?.shortDesc || "Saudi Aramco & TUV certified heavy equipment rental in KSA. Mobile cranes, excavators, dump trucks, generators, and compressors with certified operators.";
  const canonical = service?.canonicalUrl || `${siteConfig.url}/services/equipment-rental`;
  const focusKeyword = service?.focusKeyword || "Heavy Equipment Rental Saudi Arabia";
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
    title: "Earthmoving & Grading Fleet",
    desc: "Heavy excavators (CAT/Komatsu), wheel loaders, bulldozers, motor graders, and vibrating roller compactors with certified operators.",
    tags: ["Excavators", "Wheel Loaders", "Bulldozers", "Aramco Certified Operators"]
  },
  {
    id: "02",
    title: "Lifting & Heavy Crane Fleet",
    desc: "Mobile cranes (50T to 500T), rough terrain cranes, telescopic boom lifts, manlifts, and certified rigging teams.",
    tags: ["50T-500T Mobile Cranes", "Rough Terrain Cranes", "Manlifts", "Rigging Crews"]
  },
  {
    id: "03",
    title: "Heavy Logistics & Haulage",
    desc: "Dump trucks, lowbed heavy equipment haulers, flatbed trailers, water tankers, and site logistics transport.",
    tags: ["Lowbed Trailers", "Dump Trucks", "Flatbeds", "Water Tankers"]
  },
  {
    id: "04",
    title: "Power, Air & Utility Fleet",
    desc: "Heavy diesel power generators (50kVA to 1250kVA), high-pressure air compressors, light towers, and mobile welding rigs.",
    tags: ["50kVA-1250kVA Generators", "Air Compressors", "Light Towers", "Welding Rigs"]
  }
];

const defaultFaqs = [
  {
    q: "Are BIC heavy machines third-party certified for Aramco & SABIC projects?",
    a: "Yes. All machinery in our fleet undergoes rigorous third-party inspection (TUV/Aramco approved) and holds valid safety stickers and maintenance logs."
  },
  {
    q: "Do you supply certified operators with the machinery?",
    a: "We offer both dry hire (equipment only) and wet hire (with Saudi Aramco certified operators, riggers, and heavy drivers)."
  },
  {
    q: "What is the minimum hire period for equipment?",
    a: "We support short-term daily/weekly rentals as well as long-term multi-year project leases across Saudi Arabia."
  }
];

export default function EquipmentRentalPage() {
  const services = getServicesData();
  const serviceData = services.find(
    (s: any) => s.id === "equipment-rental" || s.slug?.includes("equipment-rental")
  );

  const activeFaqs = serviceData?.faqs?.length ? serviceData.faqs : defaultFaqs;
  const serviceSchema = buildServiceJsonLd(serviceData || {
    title: "Equipment Rental",
    slug: "/services/equipment-rental",
    shortDesc: "Certified heavy equipment rental fleet in Saudi Arabia."
  });
  const faqSchema = buildFaqJsonLd(activeFaqs);
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
    { name: serviceData?.title || "Equipment Rental", url: "/services/equipment-rental" },
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
        badge="HEAVY FLEET SOLUTIONS"
        title="Equipment"
        titleAccent="Rental"
        subtitle="Third-Party Certified Machinery Fleet & Operations"
        description="Modern heavy machinery fleet available for short-term and long-term project hire across Saudi Arabia."
        heroImage="https://images.unsplash.com/photo-1504307651254-35680f356f12?q=80&w=2070&auto=format&fit=crop"
        watermark="FLEET"
        overviewTitle="Third-Party Certified Fleet Delivered On Demand"
        overviewDesc1="Best International maintains one of the Eastern Province’s most versatile heavy equipment fleets, servicing oil & gas refineries, civil infrastructure, and plant turnarounds."
        overviewDesc2="Each machine is backed by comprehensive maintenance records, TUV certification, and prompt 24/7 on-site repair support to ensure maximum job site uptime."
        specs={[
          "TUV & Saudi Aramco Third-Party Certified",
          "Wet & Dry Hire Options Available",
          "24/7 Field Maintenance & Swap Out Support",
          "GPS Tracked Fleet Operations"
        ]}
        subServices={defaultSubServices}
        faqs={defaultFaqs}
        serviceData={serviceData}
      />
    </>
  );
}
