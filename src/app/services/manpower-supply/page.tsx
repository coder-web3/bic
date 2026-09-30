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
    (s: any) => s.id === "manpower-supply" || s.slug?.includes("manpower-supply")
  );

  const title = service?.metaTitle || "Industrial Manpower Supply & Technical Recruitment Saudi Arabia - BiC";
  const description = service?.metaDescription || service?.shortDesc || "Aramco certified engineers, certified QA/QC inspectors, coded welders, safety officers, and skilled technical workforce supply across KSA.";
  const canonical = service?.canonicalUrl || `${siteConfig.url}/services/manpower-supply`;
  const focusKeyword = service?.focusKeyword || "Industrial Manpower Supply Saudi Arabia";
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
    title: "Engineering & Supervisory Staff",
    desc: "Civil engineers, QA/QC inspectors, HSE officers, electrical engineers, planning engineers, and project supervisors.",
    tags: ["Civil Engineers", "QA/QC Inspectors", "HSE Officers", "Aramco Approved"]
  },
  {
    id: "02",
    title: "Certified Skilled Trades",
    desc: "ASME 6G pipe welders, structural fabricators, pipe fitters, industrial electricians, and instrument technicians.",
    tags: ["ASME 6G Welders", "Pipe Fitters", "Electricians", "Instrument Techs"]
  },
  {
    id: "03",
    title: "Scaffolding & Rigging Crews",
    desc: "Saudi Aramco certified scaffolding supervisors, green-tag inspectors, level 1-3 riggers, and scaffold erectors.",
    tags: ["Scaffold Supervisors", "Level 1-3 Riggers", "Green-Tag Inspectors"]
  },
  {
    id: "04",
    title: "Turnaround & Shutdown Manpower",
    desc: "Rapid deployment crews for plant turnarounds, vessel cleaning, valve overhaul, and emergency shutdown support.",
    tags: ["Turnaround Crews", "Vessel Techs", "Valve Overhaul", "24/7 Deployment"]
  }
];

const defaultFaqs = [
  {
    q: "Are BIC manpower crews fully Saudi Aramco & SABIC certified?",
    a: "Yes. Our skilled tradespeople and technical supervisors possess valid Aramco certificates, site badges, and HSE credentials."
  },
  {
    q: "How fast can manpower be mobilized to project sites?",
    a: "We maintain ready reserves of certified workforce and can achieve mobilization within 24 to 48 hours for immediate project requirements."
  }
];

export default function ManpowerSupplyPage() {
  const services = getServicesData();
  const serviceData = services.find(
    (s: any) => s.id === "manpower-supply" || s.slug?.includes("manpower-supply")
  );

  const activeFaqs = serviceData?.faqs?.length ? serviceData.faqs : defaultFaqs;
  const serviceSchema = buildServiceJsonLd(serviceData || {
    title: "Manpower Supply",
    slug: "/services/manpower-supply",
    shortDesc: "Qualified, Aramco-certified technical workforce for industrial projects in Saudi Arabia."
  });
  const faqSchema = buildFaqJsonLd(activeFaqs);
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
    { name: serviceData?.title || "Manpower Supply", url: "/services/manpower-supply" },
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
        badge="HUMAN CAPITAL SOLUTIONS"
        title="Manpower"
        titleAccent="Supply"
        subtitle="Certified Technical & Engineering Workforce"
        description="Qualified, Aramco-certified technical workforce for industrial projects, plant turnarounds, and long-term contracts."
        heroImage="https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop"
        watermark="MANPOWER"
        overviewTitle="Certified Workforce Mobilized For Industrial Success"
        overviewDesc1="Best International supplies highly trained, certified technical manpower across Saudi Arabia, backing energy producers, civil contractors, and industrial plants."
        overviewDesc2="From Aramco-approved QA/QC inspectors to 6G certified welders and level-3 riggers, we provide compliant workforce solutions with full medical, safety, and visa credentials."
        specs={[
          "Saudi Aramco & SABIC Certified Technicians",
          "Full Legal, IQAMA & Medical Compliance",
          "24/7 Rapid Mobilization Support",
          "Comprehensive HSE & Safety Orientation"
        ]}
        subServices={defaultSubServices}
        faqs={defaultFaqs}
        serviceData={serviceData}
      />
    </>
  );
}
