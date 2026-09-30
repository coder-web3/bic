"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  ArrowRight,
  PhoneCall,
  ShieldCheck,
  Award,
  Clock,
  HardHat,
  Flame,
  Factory,
  Zap,
  Building2,
  Droplets,
  Layers,
  FileText,
  TrendingUp,
  Trophy,
  Users,
  ThumbsUp,
  Wrench,
  ShieldAlert,
  Settings,
  Truck,
  Database,
  Pipette,
  RefreshCw,
  Package,
  Minus,
  Plus,
  MessageSquare,
  Calendar,
  LucideIcon
} from "lucide-react";

import { getSubServiceUrl } from "@/lib/subServiceUtils";

export interface SubServiceItem {
  id: string;
  title: string;
  desc: string;
  tags: string[];
  icon?: LucideIcon;
  image?: string;
  slug?: string;
  link?: string;
}

export interface GenericServiceDetailProps {
  badge?: string;
  title?: string;
  titleAccent?: string;
  subtitle?: string;
  description?: string;
  heroImage?: string;
  watermark?: string;
  overviewTitle?: string;
  overviewDesc1?: string;
  overviewDesc2?: string;
  specs?: string[];
  subServices?: SubServiceItem[];
  whyChooseUs?: { title: string; desc: string; icon?: LucideIcon; image?: string; id?: string }[];
  faqs?: { q: string; a: string }[];
  breadcrumbs?: { label: string; href?: string }[];
  serviceData?: any;
}

const defaultWhyChooseUs = [
  {
    id: "01",
    icon: ShieldAlert,
    title: "Saudi Aramco & ISO Certified Standards",
    desc: "All operations strictly adhere to Saudi Aramco Safety System requirements, ASME/AWS welding guidelines, and ISO 9001 quality procedures.",
    image: "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "02",
    icon: Award,
    title: "Turnkey Execution & Single-Point Accountability",
    desc: "From initial civil earthworks to final electrical commissioning and plant line tie-ins, we take full responsibility for cost, quality, and timelines.",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "03",
    icon: Clock,
    title: "Rapid Mobilization Across KSA",
    desc: "Equipped with our own heavy equipment fleet and certified technical crews ready to mobilize to Jubail, Yanbu, Dammam, Riyadh, and remote sites.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356f12?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "04",
    icon: HardHat,
    title: "Zero-Accident HSE Culture",
    desc: "Proactive safety officers, daily toolbox talks, certified riggers, and rigorous risk assessments ensure safety remains paramount on every job site.",
    image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop"
  }
];

const industriesList = [
  {
    id: "01",
    name: "Oil & Gas and Energy",
    icon: Flame,
    image: "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "02",
    name: "Petrochemical & Refining",
    icon: Factory,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "03",
    name: "Power & Utilities",
    icon: Zap,
    image: "https://images.unsplash.com/photo-1504307651254-35680f356f12?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "04",
    name: "Cement & Building Materials",
    icon: Layers,
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "05",
    name: "Water & Wastewater",
    icon: Droplets,
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "06",
    name: "Manufacturing & Industrial",
    icon: Settings,
    image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "07",
    name: "Infrastructure & Construction",
    icon: Truck,
    image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "08",
    name: "Storage & Terminal Facilities",
    icon: Database,
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop"
  }
];

const contractingSolutionsTabs = [
  {
    id: "01",
    title: "Civil Works & Foundations",
    icon: Building2,
    desc: "We provide comprehensive civil construction services including site preparation, excavation, concrete works, foundations, paving and associated infrastructure for industrial and commercial projects.",
    statNum: "200+",
    statLabel: "CIVIL PROJECTS DELIVERED",
    image: "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=1000&auto=format&fit=crop",
    features: [
      { name: "Site Preparation & Earthworks", icon: Truck },
      { name: "Building Construction & Industrial Facilities", icon: Building2 },
      { name: "Concrete Foundations & Structures", icon: Layers },
      { name: "Reinforced Concrete & Structural Works", icon: Factory },
      { name: "Roads, Paving & Drainage Works", icon: Wrench },
      { name: "Boundary Walls & Site Infrastructure", icon: ShieldCheck }
    ]
  },
  {
    id: "02",
    title: "Mechanical & Plant Erection",
    icon: Settings,
    desc: "Turnkey mechanical installation, heavy equipment positioning, industrial plant assembly, rotating machinery alignment, and structural steel integration executed with precision safety.",
    statNum: "150+",
    statLabel: "MECHANICAL ERECTIONS",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1000&auto=format&fit=crop",
    features: [
      { name: "Heavy Equipment Erection", icon: Wrench },
      { name: "Rotating Machinery Alignment", icon: Settings },
      { name: "Process Skid & Plant Installation", icon: Factory },
      { name: "Structural Steel Integration", icon: Layers },
      { name: "Vessel & Tank Erection", icon: ShieldCheck },
      { name: "Pre-commissioning & Testing", icon: Zap }
    ]
  },
  {
    id: "03",
    title: "Electrical & Instrumentation",
    icon: Zap,
    desc: "Comprehensive industrial electrical systems, high-voltage substations, cabling, control panel integration, SCADA, and instrumentation calibration for oil, gas, and process plants.",
    statNum: "180+",
    statLabel: "ELECTRICAL PROJECTS",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1000&auto=format&fit=crop",
    features: [
      { name: "High Voltage Substation Setup", icon: Zap },
      { name: "Control Panels & PLC Systems", icon: Settings },
      { name: "Industrial Cable Laying & Termination", icon: Layers },
      { name: "Instrumentation & SCADA Calibration", icon: Factory },
      { name: "Lighting & Grounding Systems", icon: ShieldCheck },
      { name: "Loop Testing & Commissioning", icon: TrendingUp }
    ]
  },
  {
    id: "04",
    title: "High-Pressure Piping Works",
    icon: Pipette,
    desc: "Spool fabrication, ASME coded welding, non-destructive testing (NDT), hydro-testing, and field installation for high-pressure oil, gas, chemical, and steam pipelines.",
    statNum: "500k+",
    statLabel: "METERS PIPELINE FABRICATED",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop",
    features: [
      { name: "ASME Coded Pipe Welding", icon: Flame },
      { name: "Carbon & Stainless Steel Spools", icon: Layers },
      { name: "Hydrostatic & Pneumatic Testing", icon: ShieldCheck },
      { name: "NDT Inspection & Radiography", icon: Factory },
      { name: "Flange Torque & Tie-In Works", icon: Wrench },
      { name: "Insulation & Pipeline Coating", icon: Droplets }
    ]
  },
  {
    id: "05",
    title: "Structural Steel Fabrication",
    icon: Factory,
    desc: "Custom steel design, shop fabrication, sandblasting, protective coating, pipe racks, process platform erection, and heavy industrial structural framework.",
    statNum: "45k+",
    statLabel: "TONS STEEL FABRICATED",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356f12?q=80&w=1000&auto=format&fit=crop",
    features: [
      { name: "Heavy Pipe Rack Fabrication", icon: Factory },
      { name: "Process Platform & Gangways", icon: Layers },
      { name: "Sandblasting & Epoxy Coating", icon: ShieldCheck },
      { name: "High-Strength Bolted Assembly", icon: Wrench },
      { name: "Industrial Shed Structural Frames", icon: Building2 },
      { name: "3D Detailing & Quality Inspections", icon: TrendingUp }
    ]
  },
  {
    id: "06",
    title: "Equipment Rental & Manpower Supply",
    icon: Users,
    desc: "Fleet of heavy cranes, excavators, trailers, power generators, and Saudi Aramco certified skilled technical manpower ready for immediate project deployment across KSA.",
    statNum: "300+",
    statLabel: "EQUIPMENT UNITS FLEET",
    image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?q=80&w=1000&auto=format&fit=crop",
    features: [
      { name: "Heavy Mobile Cranes & Lifting Fleet", icon: Truck },
      { name: "Aramco Certified Riggers & Welders", icon: Users },
      { name: "Safety Officers & QA/QC Engineers", icon: ShieldCheck },
      { name: "Power Generators & Compressors", icon: Settings },
      { name: "Earthmoving & Heavy Machinery", icon: Wrench },
      { name: "24/7 Site Support & Operator Crew", icon: Clock }
    ]
  },
  {
    id: "07",
    title: "Maintenance & Shutdown Support",
    icon: RefreshCw,
    desc: "Turnaround planning, emergency shutdown repairs, vessel overhaul, catalyst loading, heat exchanger retubing, and minimum downtime plant restart execution.",
    statNum: "80+",
    statLabel: "SHUTDOWNS EXECUTED",
    image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=1000&auto=format&fit=crop",
    features: [
      { name: "Planned Turnaround Maintenance", icon: RefreshCw },
      { name: "Heat Exchanger Retubing & Cleaning", icon: Wrench },
      { name: "Vessel Internal Repair & Overhaul", icon: ShieldCheck },
      { name: "24/7 Emergency Mobilization Crew", icon: Clock },
      { name: "Valve Repair & Reconditioning", icon: Factory },
      { name: "Zero-Downtime Plant Restart", icon: TrendingUp }
    ]
  },
  {
    id: "08",
    title: "Logistics & Material Supply",
    icon: Package,
    desc: "End-to-end procurement and supply of industrial materials, piping components, valves, structural steel, safety equipment, and project site logistics across Saudi Arabia.",
    statNum: "10k+",
    statLabel: "DELIVERIES COMPLETED",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1000&auto=format&fit=crop",
    features: [
      { name: "Industrial Valves & Piping Supplies", icon: Package },
      { name: "Heavy Material Transport & Hauling", icon: Truck },
      { name: "Aramco Approved Stock & Fittings", icon: ShieldCheck },
      { name: "Warehouse & On-site Storage", icon: Building2 },
      { name: "Fasteners, Gaskets & Consumables", icon: Settings },
      { name: "On-Time Site Delivery Guarantee", icon: Clock }
    ]
  }
];

function parseInlineFormatting(text: string) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-bold text-gray-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function renderFormattedText(text: string) {
  if (!text) return null;

  const rawLines = text.split(/\r?\n/);
  const elements: React.ReactNode[] = [];
  let currentList: { type: "bullet" | "number"; items: string[] } | null = null;

  const flushList = () => {
    if (currentList) {
      if (currentList.type === "bullet") {
        elements.push(
          <ul key={`list-${elements.length}`} className="space-y-2 my-3 pl-0.5">
            {currentList.items.map((item, iIdx) => (
              <li key={iIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 leading-relaxed">
                <div className="w-4 h-4 rounded-full bg-red-100 text-[#E62E2D] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={12} className="text-[#E62E2D]" />
                </div>
                <span className="flex-1 text-justify">{parseInlineFormatting(item)}</span>
              </li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={`list-${elements.length}`} className="space-y-2 my-3 pl-0.5">
            {currentList.items.map((item, iIdx) => (
              <li key={iIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 leading-relaxed">
                <span className="w-5 h-5 rounded-md bg-red-50 text-[#E62E2D] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 border border-red-100">
                  {iIdx + 1}
                </span>
                <span className="flex-1 text-justify">{parseInlineFormatting(item)}</span>
              </li>
            ))}
          </ol>
        );
      }
      currentList = null;
    }
  };

  for (let i = 0; i < rawLines.length; i++) {
    const rawLine = rawLines[i].trim();

    if (!rawLine) {
      flushList();
      continue;
    }

    if (rawLine.startsWith("### ")) {
      flushList();
      elements.push(
        <h4 key={`h-${i}`} className="text-sm sm:text-base font-bold text-gray-900 mt-4 mb-2 flex items-center gap-2">
          <div className="w-2.5 h-[2px] bg-[#E62E2D]" />
          <span>{parseInlineFormatting(rawLine.replace(/^###\s+/, ""))}</span>
        </h4>
      );
    } else if (rawLine.startsWith("## ")) {
      flushList();
      elements.push(
        <h3 key={`h-${i}`} className="text-base sm:text-lg font-bold text-gray-900 mt-5 mb-2.5 flex items-center gap-2">
          <div className="w-3.5 h-[2.5px] bg-[#E62E2D]" />
          <span>{parseInlineFormatting(rawLine.replace(/^##\s+/, ""))}</span>
        </h3>
      );
    } else if (rawLine.startsWith("# ")) {
      flushList();
      elements.push(
        <h2 key={`h-${i}`} className="text-lg sm:text-xl font-black text-gray-900 mt-5 mb-3">
          {parseInlineFormatting(rawLine.replace(/^#\s+/, ""))}
        </h2>
      );
    } else if (/^[-*•]\s+/.test(rawLine)) {
      const itemText = rawLine.replace(/^[-*•]\s+/, "");
      if (!currentList || currentList.type !== "bullet") {
        flushList();
        currentList = { type: "bullet", items: [itemText] };
      } else {
        currentList.items.push(itemText);
      }
    } else if (/^\d+\.\s+/.test(rawLine)) {
      const itemText = rawLine.replace(/^\d+\.\s+/, "");
      if (!currentList || currentList.type !== "number") {
        flushList();
        currentList = { type: "number", items: [itemText] };
      } else {
        currentList.items.push(itemText);
      }
    } else {
      flushList();
      if (rawLine.endsWith(":") && rawLine.length < 70) {
        elements.push(
          <h5 key={`sub-${i}`} className="text-xs sm:text-sm font-bold text-gray-900 mt-3 mb-1.5">
            {parseInlineFormatting(rawLine)}
          </h5>
        );
      } else {
        elements.push(
          <p key={`p-${i}`} className="text-gray-600 text-xs sm:text-sm leading-relaxed text-justify mb-3 last:mb-0">
            {parseInlineFormatting(rawLine)}
          </p>
        );
      }
    }
  }

  flushList();

  return <div className="space-y-2">{elements}</div>;
}

export default function GenericServiceDetail({
  badge,
  title,
  titleAccent,
  subtitle,
  description,
  heroImage,
  watermark = "SERVICES",
  overviewTitle,
  overviewDesc1,
  overviewDesc2,
  specs = [],
  subServices = [],
  whyChooseUs = defaultWhyChooseUs,
  faqs = [],
  breadcrumbs: customBreadcrumbs,
  serviceData
}: GenericServiceDetailProps) {
  const [data, setData] = useState<any>(serviceData || null);

  React.useEffect(() => {
    if (serviceData) {
      setData(serviceData);
    }
  }, [serviceData]);

  const activeBadge = data?.badge || badge || "INDUSTRIAL SOLUTION";
  const activeTitle = data?.title ? data.title.split(" ")[0] : (title || "Service");
  const activeTitleAccent = data?.title ? data.title.split(" ").slice(1).join(" ") : (titleAccent || "");
  const activeSubtitle = data?.subtitle || subtitle || "";
  const activeDesc = data?.shortDesc || data?.fullDesc || description || "";
  const activeHeroImage = data?.heroImage || heroImage || "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=2070&auto=format&fit=crop";

  const activeOverviewBadge = data?.overview?.badge || "EXECUTIVE OVERVIEW";
  const activeOverviewTitle = data?.overview?.title || overviewTitle || "";
  const activeOverviewDesc1 = data?.overview?.desc1 || overviewDesc1 || "";
  const activeOverviewDesc2 = data?.overview?.desc2 || overviewDesc2 || "";
  const activeSpecs = data?.overview?.specs || specs || [];
  const activeOverviewImage = data?.overview?.image || activeHeroImage;
  const activeStatNum = data?.overview?.statNum || "100+";
  const activeStatLabel = data?.overview?.statLabel || "Projects Completed";
  const activeStatSub = data?.overview?.statSub || "Across Saudi Arabia";

  const activeSubServices = Array.isArray(data?.subServices)
    ? data.subServices
    : (Array.isArray(subServices) ? subServices : []);

  const activeWhyChooseUs = Array.isArray(data?.whyChooseUs)
    ? data.whyChooseUs
    : (Array.isArray(whyChooseUs) && whyChooseUs !== defaultWhyChooseUs ? whyChooseUs : []);

  const activeIndustries = Array.isArray(data?.industries)
    ? data.industries
    : [];

  const activeShowcaseTabs = Array.isArray(data?.showcaseTabs)
    ? data.showcaseTabs
    : [];

  const activeFaqs = Array.isArray(data?.faqs)
    ? data.faqs
    : (Array.isArray(faqs) ? faqs : []);

  const hasOverview = Boolean(
    (activeOverviewTitle && activeOverviewTitle.trim().length > 0) ||
    (activeOverviewDesc1 && activeOverviewDesc1.trim().length > 0) ||
    (activeOverviewDesc2 && activeOverviewDesc2.trim().length > 0) ||
    (data?.overview?.desc1 && data.overview.desc1.trim().length > 0) ||
    (data?.overview?.desc2 && data.overview.desc2.trim().length > 0) ||
    (activeSpecs && activeSpecs.length > 0) ||
    (data?.overview?.image && data.overview.image.trim().length > 0) ||
    (data?.overview?.image2 && data.overview.image2.trim().length > 0) ||
    (data?.overview?.image3 && data.overview.image3.trim().length > 0) ||
    (data?.overview?.image4 && data.overview.image4.trim().length > 0)
  );

  const hasCta = Boolean(
    data?.cta && (
      (data.cta.title && data.cta.title.trim().length > 0) ||
      (data.cta.desc && data.cta.desc.trim().length > 0) ||
      (data.cta.primaryBtnText && data.cta.primaryBtnText.trim().length > 0) ||
      (data.cta.buttonText && data.cta.buttonText.trim().length > 0) ||
      (data.cta.secondaryBtnText && data.cta.secondaryBtnText.trim().length > 0)
    )
  );

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeContractingTab, setActiveContractingTab] = useState(0);
  const [activeImage, setActiveImage] = useState(activeOverviewImage);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);

  React.useEffect(() => {
    if (data?.overview?.image) {
      setActiveImage(data.overview.image);
    } else if (data?.heroImage) {
      setActiveImage(data.heroImage);
    }
  }, [data?.overview?.image, data?.heroImage]);

  React.useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 0 || Math.abs(e.deltaX) > 0) {
        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll > 0) {
          const canScroll =
            (delta > 0 && el.scrollLeft < maxScroll - 1) ||
            (delta < 0 && el.scrollLeft > 1);
          if (canScroll) {
            e.preventDefault();
            el.scrollLeft += delta * 1.2;
          }
        }
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [activeSubServices]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    isDownRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDownRef.current || !scrollContainerRef.current) return;
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.4;
    if (Math.abs(walk) > 4) {
      if (!isDragging) setIsDragging(true);
      hasMovedRef.current = true;
    }
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDownRef.current = false;
    setTimeout(() => {
      setIsDragging(false);
      hasMovedRef.current = false;
    }, 50);
  };

  const handleLinkClickCapture = (e: React.MouseEvent) => {
    if (hasMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleScrollEvent = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
      setScrollProgress(progress);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollContainerRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-900 pt-20 overflow-x-hidden selection:bg-[#E62E2D] selection:text-white">
      <Header />

      {/* 1. HERO SECTION */}
      <PageHero
        badge={activeBadge}
        title={activeTitle}
        titleAccent={activeTitleAccent}
        description={activeDesc}
        breadcrumbs={
          customBreadcrumbs ||
          data?.breadcrumbs || [
            { label: "Services", href: "/services" },
            { label: `${activeTitle} ${activeTitleAccent}`.trim() }
          ]
        }
        bgImage={activeHeroImage}
        watermark={data?.heroWatermark || watermark || "SERVICES"}
        stats={data?.heroStats && data.heroStats.length > 0 ? data.heroStats : [
          { value: "100%", label: "Aramco & ISO Standards" },
          { value: "15+", label: "Years Experience" },
          { value: "24/7", label: "Mobilization Desk" },
          { value: "KSA", label: "Nationwide Coverage" }
        ]}
        taglines={data?.heroTaglines && data.heroTaglines.length > 0 ? data.heroTaglines : [
          "Certified Quality & Safety",
          "Turnkey Execution Capabilities",
          "24/7 Rapid Mobilization Support",
          "Saudi Arabia KSA Wide Coverage"
        ]}
      />

      {/* Quick Action Floating Bar */}
      <section className="relative z-30 bg-[#111827] border-y border-gray-800 text-white py-6">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[#E62E2D] animate-ping" />
            <p className="text-sm text-gray-200 font-medium">
              Looking for {title} {titleAccent} solutions or pricing?
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/contact-us">
              <button className="bg-[#E62E2D] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded flex items-center gap-2 transition-all shadow-md">
                <span>Request Instant Quote</span>
                <ArrowRight size={15} />
              </button>
            </Link>
            <a
              href="tel:+966547504485"
              className="border border-white/20 hover:border-white/40 text-gray-200 hover:text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded flex items-center gap-2 transition-colors"
            >
              <PhoneCall size={15} className="text-[#E62E2D]" />
              <span>+966 54 750 4485</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. OVERVIEW SECTION */}
      {hasOverview && (
        <section className="relative py-20 bg-white overflow-hidden">
          <div
            className="absolute top-0 right-0 w-[240px] md:w-[360px] h-[240px] md:h-[360px] bg-[#E62E2D] pointer-events-none z-0"
            style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
          />
          <div
            className="absolute bottom-0 right-0 w-[180px] md:w-[260px] h-[180px] md:h-[260px] bg-[#E62E2D] pointer-events-none z-0"
            style={{ clipPath: "polygon(100% 100%, 100% 0, 0 100%)" }}
          />

          <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
              
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-6 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-[2.5px] bg-[#E62E2D]" />
                  <span className="text-[#E62E2D] font-bold text-xs tracking-widest uppercase">
                    {activeOverviewBadge}
                  </span>
                </div>

              <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold leading-tight tracking-tight text-gray-900 mb-6">
                {activeOverviewTitle || (
                  <>
                    Industrial Engineering Built For{" "}
                    <span className="text-[#E62E2D]">KSA’s Leading Projects</span>
                  </>
                )}
              </h2>

              <div
                data-lenis-prevent
                className="max-h-[170px] overflow-y-auto pr-4 mb-8 text-gray-600 text-xs sm:text-sm leading-relaxed space-y-3 text-justify overscroll-contain"
                style={{ scrollbarWidth: "thin", scrollbarColor: "#E62E2D #f1f1f1" }}
              >
                {activeOverviewDesc1 ? (
                  <p>{activeOverviewDesc1}</p>
                ) : (
                  <p>
                    Best International delivers comprehensive, heavy-duty industrial solutions tailored to Saudi Arabia’s expanding energy, petrochemical, utility, and civil infrastructure sectors.
                  </p>
                )}
                {activeOverviewDesc2 ? (
                  <p>{activeOverviewDesc2}</p>
                ) : (
                  <p>
                    Operating with in-house heavy plant equipment, certified technical workforce, and strict Saudi Aramco & SABIC HSE standards, we execute multi-discipline packages to achieve highest quality and zero-downtime execution.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {(activeSpecs.length > 0
                  ? activeSpecs
                  : [
                      "Saudi Aramco & SABIC Approved Contractor",
                      "ISO 9001:2015, ISO 14001:2015 & ISO 45001:2018 Certified",
                      "Turnkey EPC Capabilities (Civil, Mech, Elec, Piping)",
                      "Over 250+ Heavy Industrial Projects Delivered"
                    ]
                ).map((spec: string, idx: number) => {
                  const iconsList = [Wrench, ShieldCheck, CheckCircle2, Clock, Award, Building2];
                  const FeatureIcon = iconsList[idx % iconsList.length];
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.08 }}
                      whileHover={{ y: -4, scale: 1.01 }}
                      className="bg-white border border-gray-200/90 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-sm hover:shadow-lg hover:border-[#E62E2D] group transition-all duration-300 cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-[#E62E2D] shrink-0 group-hover:scale-110 group-hover:bg-[#E62E2D] group-hover:text-white transition-all duration-300">
                        <FeatureIcon size={24} className="transition-transform duration-300 group-hover:rotate-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#E62E2D] transition-colors leading-snug">
                          {spec}
                        </h4>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.35 }}
                whileHover={{ scale: 1.005 }}
                className="p-5 bg-[#fff7f7] border-l-4 border-[#E62E2D] rounded-r-2xl flex items-start gap-4 shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-red-100 text-[#E62E2D] flex items-center justify-center shrink-0 mt-0.5">
                  <Award size={22} />
                </div>
                <div>
                  <h4 className="text-gray-900 font-bold text-sm mb-1">
                    {data?.overview?.standardsTitle || "Saudi Aramco & Royal Commission Standards"}
                  </h4>
                  <p className="text-gray-600 text-xs leading-relaxed text-justify">
                    {data?.overview?.standardsDesc || "Our QA/QC procedures enforce rigid quality plans, non-destructive testing (NDT), hydro-testing, and complete safety documentation on every contract."}
                  </p>
                </div>
              </motion.div>

            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-6 flex flex-col"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 group bg-gray-900">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  src={activeImage || activeOverviewImage || activeHeroImage}
                  alt={
                    (activeImage === data?.overview?.image ? data?.overview?.imageAlt : null) ||
                    (activeImage === data?.overview?.image2 ? data?.overview?.image2Alt : null) ||
                    (activeImage === data?.overview?.image3 ? data?.overview?.image3Alt : null) ||
                    (activeImage === data?.overview?.image4 ? data?.overview?.image4Alt : null) ||
                    data?.overview?.imageAlt ||
                    activeOverviewTitle ||
                    title ||
                    "BIC Service Overview"
                  }
                  className="w-full h-[420px] sm:h-[460px] object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e: any) => {
                    e.currentTarget.src = activeHeroImage || "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=1200&auto=format&fit=crop";
                  }}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute top-5 right-5 bg-white/95 backdrop-blur-md border border-gray-100 p-3.5 px-5 rounded-2xl shadow-xl flex items-center gap-3.5 z-10"
                >
                  <div>
                    <div className="text-xl font-black text-[#E62E2D] leading-none">
                      {activeStatNum}
                    </div>
                    <div className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500 mt-1">
                      {activeStatSub}
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-red-50 text-[#E62E2D] flex items-center justify-center font-bold">
                    <TrendingUp size={20} />
                  </div>
                </motion.div>

                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3.5 sm:p-4 shadow-xl border border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center sm:text-left z-10">
                  {[
                    { icon: Trophy, value: activeStatNum, label: activeStatLabel },
                    { icon: Users, value: "100+", label: "Clients Served" },
                    { icon: FileText, value: "100%", label: "Aramco HSE Standards" },
                    { icon: ThumbsUp, value: "99%", label: "Client Retention" }
                  ].map((stat, sIdx) => {
                    const StatIcon = stat.icon;
                    return (
                      <div key={sIdx} className="flex items-center gap-2.5 sm:border-r border-gray-200/80 last:border-r-0 pr-2">
                        <div className="w-8 h-8 rounded-lg bg-red-50 text-[#E62E2D] flex items-center justify-center shrink-0">
                          <StatIcon size={16} />
                        </div>
                        <div>
                          <div className="text-base font-black text-gray-900 leading-none">{stat.value}</div>
                          <div className="text-[10px] font-bold text-gray-500 tracking-tight leading-tight mt-0.5">{stat.label}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Overview Gallery Thumbnails Row (4 Images) */}
              {(() => {
                const thumbs = [
                  { url: data?.overview?.image, alt: data?.overview?.imageAlt },
                  { url: data?.overview?.image2, alt: data?.overview?.image2Alt },
                  { url: data?.overview?.image3, alt: data?.overview?.image3Alt },
                  { url: data?.overview?.image4, alt: data?.overview?.image4Alt },
                ].filter((t: any) => Boolean(t.url));

                const finalThumbs = thumbs.length > 0 
                  ? thumbs 
                  : [
                      { url: activeOverviewImage || "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=1200&auto=format&fit=crop", alt: `${title} Overview Image 1` },
                      { url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200&auto=format&fit=crop", alt: `${title} Overview Image 2` },
                      { url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop", alt: `${title} Overview Image 3` },
                      { url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop", alt: `${title} Overview Image 4` }
                    ];

                return (
                  <div className={`grid gap-3 mt-4 ${finalThumbs.length >= 4 ? 'grid-cols-4' : finalThumbs.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                    {finalThumbs.map((thumbObj: { url: string; alt?: string }, tIdx: number) => {
                      const isCurrent = (activeImage || activeOverviewImage || finalThumbs[0].url) === thumbObj.url;
                      return (
                        <button
                          key={tIdx}
                          type="button"
                          onClick={() => setActiveImage(thumbObj.url)}
                          className={`relative rounded-xl overflow-hidden h-20 sm:h-24 md:h-28 border-2 transition-all duration-300 group cursor-pointer bg-slate-900 ${
                            isCurrent
                              ? "border-[#E62E2D] shadow-md scale-[1.03] ring-2 ring-[#E62E2D]/20"
                              : "border-gray-200 opacity-75 hover:opacity-100 hover:border-gray-400"
                          }`}
                        >
                          <img
                            src={thumbObj.url}
                            alt={thumbObj.alt || `${title} Overview Thumbnail ${tIdx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e: any) => {
                              e.currentTarget.src = "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=600&auto=format&fit=crop";
                            }}
                          />
                          <div className={`absolute inset-0 transition-colors ${isCurrent ? 'bg-transparent' : 'bg-black/15 group-hover:bg-transparent'}`} />
                        </button>
                      );
                    })}
                  </div>
                );
              })()}

            </motion.div>

          </div>
        </div>
      </section>
      )}

      {/* ════════════════════════════════════════════════════════════════
          2.5 COMPLETE CONTRACTING SOLUTIONS TABBED SHOWCASE
      ════════════════════════════════════════════════════════════════ */}
      {activeShowcaseTabs.length > 0 && (
      <section className="py-24 bg-[#f8f9fb] relative overflow-hidden border-t border-gray-200/80">
        {/* Decorative background red diagonal element */}
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-[#E62E2D]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-red-50/40 to-transparent pointer-events-none" />
        
        {/* Giant Watermark */}
        <div className="absolute top-12 right-12 text-[160px] sm:text-[220px] font-black text-gray-200/30 pointer-events-none select-none tracking-tighter leading-none z-0">
          BIC
        </div>

        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="w-8 h-[2px] bg-[#E62E2D]" />
                <span className="text-[#E62E2D] font-bold text-xs tracking-widest uppercase">
                  {data?.showcaseBadge || "OUR CONTRACTING SERVICES"}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold leading-tight tracking-tight text-gray-900">
                {data?.showcaseTitle ? (
                  data.showcaseTitle
                ) : (
                  <>
                    Complete Contracting Solutions <br className="hidden sm:block" />
                    <span className="text-[#E62E2D]">for Every Project Need</span>
                  </>
                )}
              </h2>
              <p className="mt-3 text-gray-600 text-xs sm:text-sm max-w-2xl font-normal leading-relaxed text-justify">
                {data?.showcaseDesc || "From civil construction to industrial facilities, we deliver integrated contracting services with safety, quality and on-time execution."}
              </p>
            </div>

            <div className="hidden lg:flex items-center gap-4 border-l-2 border-[#E62E2D] pl-5 py-1 shrink-0">
              <div className="text-xs font-black text-gray-400 tracking-widest uppercase leading-snug">
                INTEGRATED<br />
                CONTRACTING<br />
                SOLUTIONS<br />
                <span className="text-[#E62E2D] font-extrabold">SAUDI ARABIA</span>
                <div className="w-8 h-[2px] bg-[#E62E2D] mt-2" />
              </div>
            </div>
          </motion.div>

          {/* Interactive Showcase Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
          >
            {/* Left Vertical Tabs List (lg:col-span-4) - Matching Height with Internal Scrolling */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-3 sm:p-4 shadow-xl border border-gray-100 flex flex-col h-[520px] sm:h-[560px] lg:h-[620px]">
              <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-gray-100 shrink-0">
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider">
                  All Capabilities ({activeShowcaseTabs.length})
                </span>
                <span className="text-[10px] font-bold text-[#E62E2D] uppercase tracking-wider">
                  Scroll To View
                </span>
              </div>

              <div
                data-lenis-prevent
                className="flex-1 overflow-y-auto space-y-2 pr-1.5 overscroll-contain [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-red-400"
              >
                {activeShowcaseTabs.map((tab: any, index: number) => {
                  const isActive = activeContractingTab === index;
                  const TabIcon = tab.icon || Building2;
                  return (
                    <button
                      key={tab.id || index}
                      onClick={() => setActiveContractingTab(index)}
                      className={`w-full flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl text-left transition-all duration-300 group ${
                        isActive
                          ? "bg-[#E62E2D] text-white shadow-lg shadow-[#E62E2D]/25 font-bold"
                          : "bg-transparent text-gray-700 hover:bg-red-50/50 hover:text-gray-900 font-semibold"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-red-50 text-[#E62E2D] group-hover:bg-[#E62E2D] group-hover:text-white group-hover:scale-105"
                          }`}
                        >
                          <TabIcon size={18} className="transition-transform group-hover:rotate-6" />
                        </div>
                        <span className="text-xs sm:text-sm truncate">
                          {tab.title}
                        </span>
                      </div>
                      <ChevronRight
                        size={18}
                        className={`shrink-0 transition-all duration-300 ${
                          isActive
                            ? "text-white translate-x-0.5 opacity-100"
                            : "text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Panel (lg:col-span-8): Details & Dynamic Image */}
            <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 lg:p-9 shadow-xl border border-gray-100 relative overflow-hidden flex flex-col justify-start h-[520px] sm:h-[560px] lg:h-[620px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeContractingTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch h-full"
                >
                  {/* Left Column: Text & Features (xl:col-span-7) with internal vertical scroll */}
                  <div
                    data-lenis-prevent
                    className="xl:col-span-7 flex flex-col justify-start overflow-y-auto pr-3 overscroll-contain h-full max-h-[460px] sm:max-h-[500px] lg:max-h-[550px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#E62E2D] [&::-webkit-scrollbar-thumb]:rounded-full"
                    style={{ scrollbarWidth: "thin", scrollbarColor: "#E62E2D #f1f1f1" }}
                  >
                    <div>
                      {/* Number Header */}
                      <div className="flex items-center gap-3 mb-2 shrink-0">
                        <span className="text-[#E62E2D] font-black text-sm tracking-wider uppercase">
                          {(activeShowcaseTabs[activeContractingTab] || activeShowcaseTabs[0])?.id || "01"}
                        </span>
                        <div className="w-12 h-[2px] bg-[#E62E2D]" />
                      </div>

                      {/* Main Title */}
                      <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-3 tracking-tight leading-snug">
                        {(activeShowcaseTabs[activeContractingTab] || activeShowcaseTabs[0])?.title}
                      </h3>

                      {/* Description with rich formatting (headings, lists, bold) */}
                      <div className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-5 font-normal">
                        {renderFormattedText((activeShowcaseTabs[activeContractingTab] || activeShowcaseTabs[0])?.desc || "")}
                      </div>

                      {/* Deliverables Grid (Optional) */}
                      {Array.isArray((activeShowcaseTabs[activeContractingTab] || activeShowcaseTabs[0])?.features) &&
                        ((activeShowcaseTabs[activeContractingTab] || activeShowcaseTabs[0])?.features || []).filter(Boolean).length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pb-2">
                            {((activeShowcaseTabs[activeContractingTab] || activeShowcaseTabs[0])?.features || []).map((feat: any, fIdx: number) => {
                              const featName = typeof feat === "string" ? feat : feat.name;
                              const FeatIcon = typeof feat === "object" && feat.icon ? feat.icon : CheckCircle2;
                              if (!featName) return null;
                              return (
                                <div
                                  key={fIdx}
                                  className="flex items-center gap-2.5 p-3 rounded-xl bg-red-50/40 border border-red-100/60 hover:bg-red-50 hover:border-red-200 transition-all duration-300 group"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-red-100/80 text-[#E62E2D] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#E62E2D] group-hover:text-white transition-all duration-300 shadow-sm">
                                    <FeatIcon size={15} />
                                  </div>
                                  <span className="text-xs font-bold text-gray-800 leading-snug group-hover:text-[#E62E2D] transition-colors">
                                    {featName}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Fixed Height Image (xl:col-span-5) */}
                  <div className="xl:col-span-5 relative w-full h-[260px] sm:h-[320px] xl:h-full max-h-[550px] rounded-2xl overflow-hidden shadow-lg group bg-gray-950 shrink-0">
                    <img
                      src={
                        (activeShowcaseTabs[activeContractingTab] || activeShowcaseTabs[0])?.image ||
                        activeHeroImage ||
                        "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=1000&auto=format&fit=crop"
                      }
                      alt={
                        (activeShowcaseTabs[activeContractingTab] || activeShowcaseTabs[0])?.imageAlt ||
                        (activeShowcaseTabs[activeContractingTab] || activeShowcaseTabs[0])?.title ||
                        "Specialized Solution Showcase"
                      }
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e: any) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1000&auto=format&fit=crop";
                      }}
                    />
                    
                    {/* Corner gradient & red accent wedge */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-28 h-28 bg-[#E62E2D] transform translate-x-12 translate-y-12 rotate-45 pointer-events-none" />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </section>
      )}

      {/* 3. SUB SERVICES ONE ROW SCROLLING SECTION */}
      {activeSubServices.length > 0 && (
      <section className="py-20 bg-[#f8f9fb] relative border-y border-gray-200/80">
        <div className="absolute top-10 right-10 select-none pointer-events-none opacity-[0.03] z-0">
          <span className="text-[180px] md:text-[240px] font-black leading-none tracking-tighter text-gray-900">
            BIC
          </span>
        </div>

        <div
          className="absolute top-0 right-0 w-[160px] md:w-[220px] h-[160px] md:h-[220px] bg-[#E62E2D] pointer-events-none z-0"
          style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
        />

        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-[2.5px] bg-[#E62E2D]" />
                <span className="text-[#E62E2D] font-bold text-xs tracking-widest uppercase">
                  {data?.subServicesBadge || "SPECIALIZED CAPABILITIES"}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold leading-tight tracking-tight text-gray-900">
                {data?.subServicesTitle ? (
                  data.subServicesTitle
                ) : (
                  <>
                    Sub-Services & <span className="text-[#E62E2D]">Capabilities</span>
                  </>
                )}
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm mt-2 max-w-xl font-medium text-justify">
                {data?.subServicesDesc || "Explore our specialized service categories and tailored industrial execution packages."}
              </p>
            </motion.div>

            <div className="flex items-center gap-6">
              <div className="hidden lg:flex flex-col text-right border-r border-gray-200 pr-6">
                <span className="text-[10px] font-extrabold tracking-widest uppercase text-gray-400">PEOPLE</span>
                <span className="text-[10px] font-extrabold tracking-widest uppercase text-gray-400">SOLUTIONS</span>
                <span className="text-[10px] font-extrabold tracking-widest uppercase text-gray-400">PROGRESS</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => scroll("left")}
                  aria-label="Previous Slide"
                  className="w-11 h-11 rounded-full bg-white border border-gray-250 shadow-sm flex items-center justify-center text-gray-700 hover:bg-[#E62E2D] hover:text-white hover:border-[#E62E2D] transition-all transform hover:scale-105"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => scroll("right")}
                  aria-label="Next Slide"
                  className="w-11 h-11 rounded-full bg-[#E62E2D] text-white shadow-md flex items-center justify-center hover:bg-red-700 transition-all transform hover:scale-105"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          <div
            ref={scrollContainerRef}
            data-lenis-prevent
            onScroll={handleScrollEvent}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className={`flex gap-6 overflow-x-auto scrollbar-none pb-8 pt-2 overscroll-x-contain ${
              isDragging ? "snap-none scroll-auto cursor-grabbing select-none" : "snap-x snap-mandatory scroll-smooth cursor-grab"
            }`}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {activeSubServices.map((service: any, idx: number) => {
              const IconComp = service.icon || Building2;
              const targetUrl =
                service.link?.startsWith("http") || service.link?.startsWith("/contact")
                  ? service.link
                  : getSubServiceUrl(data || { id: title, title, slug: "/services" }, service);
              const cardImg =
                service.image ||
                activeHeroImage ||
                "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1000&auto=format&fit=crop";

              return (
                <motion.div
                  key={service.id || idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.07 }}
                  className="shrink-0 w-[310px] sm:w-[350px] lg:w-[380px] snap-start rounded-2xl border border-gray-200/90 bg-white hover:border-[#E62E2D] shadow-sm hover:shadow-xl group transition-all duration-500 flex flex-col justify-between relative cursor-pointer"
                >
                  {/* Top Image Header Wrapper */}
                  <div className="relative h-48 rounded-t-2xl">
                    <Link
                      href={targetUrl}
                      onClickCapture={handleLinkClickCapture}
                      className="absolute inset-0 rounded-t-2xl overflow-hidden bg-gray-950 block"
                    >
                      <img
                        src={cardImg}
                        alt={service.imageAlt || service.title || "Sub Service"}
                        className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-108 transition-all duration-700"
                        onError={(e: any) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1000&auto=format&fit=crop";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />

                      <span className="absolute top-4 left-5 text-4xl font-black text-white/95 drop-shadow-lg z-10">
                        {service.id}
                      </span>
                    </Link>

                    {/* Full Visible Floating Red Badge with Icon */}
                    <Link
                      href={targetUrl}
                      onClickCapture={handleLinkClickCapture}
                      className="absolute -bottom-5 left-6 w-11 h-11 bg-[#E62E2D] rounded-xl flex items-center justify-center text-white shadow-xl border-2 border-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 z-30"
                    >
                      <IconComp size={20} />
                    </Link>
                  </div>

                  <div className="pt-8 px-6 pb-6 flex-1 flex flex-col justify-between bg-white rounded-b-2xl">
                    <div>
                      <Link href={targetUrl} onClickCapture={handleLinkClickCapture}>
                        <h3 className="text-lg font-bold text-gray-900 mb-2.5 group-hover:text-[#E62E2D] transition-colors leading-snug">
                          {service.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 text-[11px] sm:text-xs leading-relaxed mb-5 font-normal line-clamp-3 text-justify">
                        {service.desc}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {(Array.isArray(service.tags) ? service.tags : []).map((tag: any, tIdx: number) => (
                          <span
                            key={tIdx}
                            className="text-[11px] font-semibold text-gray-600 bg-[#f0f2f5] px-2.5 py-1 rounded-md border border-gray-150"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Link
                      href={targetUrl}
                      onClickCapture={handleLinkClickCapture}
                      className="pt-4 border-t border-gray-100 flex items-center justify-between group/btn"
                    >
                      <span className="text-xs font-extrabold uppercase tracking-wider text-gray-700 group-hover/btn:text-[#E62E2D] transition-colors">
                        VIEW DETAILS
                      </span>
                      <div className="w-8 h-8 rounded-full bg-[#E62E2D] text-white flex items-center justify-center group-hover/btn:translate-x-1 transition-transform shadow-md">
                        <ChevronRight size={16} />
                      </div>
                    </Link>
                  </div>

                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-transparent group-hover:bg-[#E62E2D] transition-colors rounded-t-2xl z-20" />
                </motion.div>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <div className="w-48 sm:w-64 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#E62E2D] rounded-full transition-all duration-300"
                style={{ width: `${Math.max(15, scrollProgress)}%` }}
              />
            </div>
            
            <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <span>EXPLORE MORE CAPABILITIES</span>
              <div className="w-6 h-[1.5px] bg-gray-300" />
            </span>
          </div>

        </div>
      </section>
      )}

      {/* 4. WHY BEST INTERNATIONAL SECTION */}
      {activeWhyChooseUs.length > 0 && (
      <section className="py-24 bg-white relative overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 w-1/3 bg-cover bg-left opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=1000&auto=format&fit=crop')" }}
        />
        <div
          className="absolute inset-y-0 right-0 w-1/3 bg-cover bg-right opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1000&auto=format&fit=crop')" }}
        />
        <div
          className="absolute bottom-0 left-0 w-[180px] md:w-[260px] h-[180px] md:h-[260px] bg-[#E62E2D] pointer-events-none z-0"
          style={{ clipPath: "polygon(0 100%, 0 0, 100% 100%)" }}
        />
        <div
          className="absolute top-0 right-0 w-[160px] md:w-[240px] h-[160px] md:h-[240px] bg-[#E62E2D] pointer-events-none z-0"
          style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
        />

        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          <div className="absolute top-0 left-6 sm:left-10 lg:left-16 hidden lg:flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold tracking-widest uppercase text-gray-400">PEOPLE</span>
              <span className="text-[10px] font-extrabold tracking-widest uppercase text-gray-400">SOLUTIONS</span>
              <span className="text-[10px] font-extrabold tracking-widest uppercase text-gray-400">PROGRESS</span>
            </div>
            <div className="w-[2px] h-10 bg-[#E62E2D]" />
          </div>

          <div className="absolute bottom-0 right-6 sm:right-10 lg:right-16 hidden lg:flex items-center gap-3 text-right">
            <div className="w-[2px] h-10 bg-[#E62E2D]" />
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold tracking-widest uppercase text-gray-400">BUILDING</span>
              <span className="text-[10px] font-extrabold tracking-widest uppercase text-gray-400">A STRONGER</span>
              <span className="text-[10px] font-extrabold tracking-widest uppercase text-gray-400">TOMORROW</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-8 h-[2.5px] bg-[#E62E2D]" />
              <span className="text-[#E62E2D] font-bold text-xs tracking-widest uppercase">
                {data?.whyChooseUsBadge || "WHY BEST INTERNATIONAL"}
              </span>
              <div className="w-8 h-[2.5px] bg-[#E62E2D]" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold leading-tight tracking-tight text-gray-900 mb-4">
              {data?.whyChooseUsTitle ? (
                data.whyChooseUsTitle
              ) : (
                <>
                  Built On Safety, Precision &{" "}
                  <span className="text-[#E62E2D]">Uncompromised Standards</span>
                </>
              )}
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-medium text-center mx-auto max-w-2xl">
              {data?.whyChooseUsDesc || "We eliminate project risks by combining heavy equipment independence, Saudi Aramco certified supervisors, and strict QA/QC compliance."}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {activeWhyChooseUs.map((item: any, idx: number) => {
              const IconComp = item.icon || ShieldCheck;
              const cardId = item.id || `0${idx + 1}`;
              const cardImg = item.image || activeHeroImage;
              return (
                <motion.div
                  key={cardId}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-[#E62E2D] shadow-md hover:shadow-2xl group transition-all duration-500 relative cursor-pointer"
                >
                  <div>
                    <div className="relative h-32 sm:h-36 rounded-2xl overflow-hidden mb-6 bg-gray-950">
                      <img
                        src={cardImg}
                        alt={item.imageAlt || item.title || "Why Choose Us"}
                        className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-108 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />
                      <span className="absolute top-3 right-4 text-3xl font-black text-white/40 group-hover:text-white/80 transition-colors">
                        {cardId}
                      </span>
                      <div
                        className="absolute top-0 right-0 w-8 h-8 bg-[#E62E2D] pointer-events-none z-10"
                        style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
                      />
                      <div className="absolute top-3.5 left-3.5 w-11 h-11 bg-[#E62E2D] rounded-xl text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 z-10">
                        <IconComp size={22} />
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#E62E2D] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-[11px] sm:text-xs leading-relaxed font-normal mb-6 text-justify">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-150 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#E62E2D]">
                      Aramco / ISO Verified
                    </span>
                    <CheckCircle2 size={16} className="text-[#E62E2D]" />
                  </div>
                  <div className="absolute top-0 left-6 right-6 h-[2px] bg-transparent group-hover:bg-[#E62E2D] transition-colors rounded-full" />
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>
      )}

      {/* 5. INDUSTRIES WE SERVE SECTION - INCREASED CARD HEIGHT */}
      {activeIndustries.length > 0 && (
      <section className="py-24 bg-[#f8f9fb] relative overflow-hidden border-t border-gray-200/80">
        
        <div
          className="absolute top-0 left-0 w-[180px] md:w-[260px] h-[180px] md:h-[260px] bg-[#E62E2D] pointer-events-none z-0"
          style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
        />

        <div
          className="absolute bottom-0 right-0 w-[180px] md:w-[260px] h-[180px] md:h-[260px] bg-[#E62E2D] pointer-events-none z-0"
          style={{ clipPath: "polygon(100% 100%, 100% 0, 0 100%)" }}
        />

        <div className="absolute top-6 right-10 select-none pointer-events-none opacity-[0.035] z-0">
          <span className="text-[120px] sm:text-[180px] md:text-[240px] font-black leading-none tracking-tighter text-gray-900">
            INDUSTRIES
          </span>
        </div>

        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          
          <div className="absolute top-1/2 -translate-y-1/2 right-6 sm:right-10 lg:right-16 hidden lg:flex items-center gap-3 text-right">
            <div className="w-[2px] h-12 bg-[#E62E2D]" />
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold tracking-widest uppercase text-gray-400">DIVERSE</span>
              <span className="text-[10px] font-extrabold tracking-widest uppercase text-gray-400">INDUSTRIES</span>
              <span className="text-[10px] font-extrabold tracking-widest uppercase text-gray-400">GREATER</span>
              <span className="text-[10px] font-extrabold tracking-widest uppercase text-gray-400">POSSIBILITIES</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-4 flex flex-col pr-0 lg:pr-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-[2.5px] bg-[#E62E2D]" />
                <span className="text-[#E62E2D] font-bold text-xs tracking-widest uppercase">
                  {data?.industriesBadge || "INDUSTRIES WE SERVE"}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold leading-tight tracking-tight text-gray-900 mb-4">
                {data?.industriesTitle ? (
                  data.industriesTitle
                ) : (
                  <>
                    Powering Critical Industries Across{" "}
                    <span className="text-[#E62E2D]">Saudi Arabia</span>
                  </>
                )}
              </h2>

              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6 font-normal text-justify">
                {data?.industriesDesc || "We deliver integrated industrial solutions for diverse sectors, supporting Saudi Arabia's growth with reliability, safety and long term value."}
              </p>

              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-200/90 h-64 sm:h-72 bg-gray-950 group my-2">
                <img
                  src="https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=800&auto=format&fit=crop"
                  alt="Built for a Stronger Tomorrow"
                  className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-red-950/95 via-red-900/70 to-transparent pointer-events-none" />

                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                  <div className="w-10 h-10 rounded-xl bg-[#E62E2D] text-white flex items-center justify-center shadow-lg border border-white/20">
                    <HardHat size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-black text-lg sm:text-xl leading-tight uppercase tracking-wide">
                      BUILT FOR<br />
                      A STRONGER<br />
                      TOMORROW
                    </h4>
                    <div className="w-12 h-[2px] bg-white mt-2" />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-[2px] bg-[#E62E2D]" />
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Our Focus</span>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed text-justify">
                  Delivering specialized contracting and industrial solutions that keep essential industries running and growing.
                </p>
              </div>
            </motion.div>

            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
                {activeIndustries.map((ind: any, idx: number) => {
                  const IndIcon = ind.icon || Factory;
                  return (
                    <motion.div
                      key={ind.id}
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-2xl overflow-hidden border border-gray-200/90 shadow-sm hover:shadow-xl hover:border-[#E62E2D] group transition-all duration-300 flex flex-col justify-between cursor-pointer"
                    >
                      <div className="relative h-44 sm:h-48 rounded-t-2xl">
                        <div className="absolute inset-0 rounded-t-2xl overflow-hidden bg-gray-950">
                          <img
                            src={ind.image}
                            alt={ind.imageAlt || ind.name || ind.title || "Industry Sector"}
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-108 transition-all duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent pointer-events-none" />
                        </div>

                        <div className="absolute -bottom-4 left-4 w-9 h-9 sm:w-10 sm:h-10 bg-[#E62E2D] rounded-xl flex items-center justify-center text-white shadow-lg border-2 border-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 z-20">
                          <IndIcon size={18} />
                        </div>
                      </div>

                      <div className="pt-7 px-4 pb-5 bg-white rounded-b-2xl flex items-start gap-3 min-h-[95px]">
                        <div>
                          <span className="text-xs font-black text-gray-400 block leading-none">{ind.id}</span>
                          <div className="w-3.5 h-[1.5px] bg-[#E62E2D] mt-1" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug group-hover:text-[#E62E2D] transition-colors">
                            {ind.name}
                          </h4>
                          {(ind.desc || ind.description) && (
                            <p className="text-[11px] sm:text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-3">
                              {ind.desc || ind.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </section>
      )}

      {/* 6. FAQ SECTION - EXACT REFERENCE MATCH DESIGN */}
      {activeFaqs.length > 0 && (
        <section className="py-24 bg-[#f8f9fb] relative overflow-hidden border-t border-gray-200/80">
          {/* Giant Watermark */}
          <div className="absolute top-8 right-10 text-[180px] sm:text-[240px] font-black text-gray-200/35 pointer-events-none select-none tracking-tighter leading-none z-0">
            FAQ
          </div>

          <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
            
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <div className="inline-flex items-center gap-3 mb-3">
                <div className="w-10 h-[2px] bg-[#E62E2D]" />
                <span className="text-[#E62E2D] font-black text-xs tracking-widest uppercase">
                  {data?.faqsBadge || "FREQUENTLY ASKED QUESTIONS"}
                </span>
                <div className="w-10 h-[2px] bg-[#E62E2D]" />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold leading-tight tracking-tight text-gray-900 mb-3">
                {data?.faqsTitle ? (
                  data.faqsTitle
                ) : (
                  <>
                    Everything You Need to Know <br className="hidden sm:block" />
                    About Our <span className="text-[#E62E2D]">{title}</span>
                  </>
                )}
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm font-normal leading-relaxed text-center mx-auto max-w-2xl">
                {data?.faqsDesc || "Clear answers to common questions about our services, processes, capabilities and project execution."}
              </p>
            </motion.div>

            {/* 2-Column Balanced FAQ Grid Layout (Left Half FAQs, Right Half FAQs) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start relative z-10">
              
              {/* Left Column: First half of FAQs (lg:col-span-1) */}
              <div className="space-y-4">
                {activeFaqs.slice(0, Math.ceil(activeFaqs.length / 2)).map((item: any, index: number) => {
                  const globalIdx = index;
                  const isOpen = openFaq === globalIdx;
                  const ItemIcon = FileText;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                        isOpen
                          ? "border-red-200 shadow-md ring-1 ring-red-100"
                          : "border-gray-100/90 shadow-sm hover:shadow-md hover:border-gray-200"
                      }`}
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : globalIdx)}
                        className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left group"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-red-50/80 text-[#E62E2D] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#E62E2D] group-hover:text-white transition-all duration-300">
                            <ItemIcon size={18} />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[11px] font-black text-gray-400 block leading-none mb-1">
                              0{globalIdx + 1}
                            </span>
                            <h4 className="text-xs sm:text-sm font-extrabold text-gray-900 leading-snug group-hover:text-[#E62E2D] transition-colors">
                              {item.q}
                            </h4>
                          </div>
                        </div>

                        <div
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                            isOpen
                              ? "bg-[#E62E2D] text-white shadow-md"
                              : "border border-gray-300 text-gray-400 group-hover:border-[#E62E2D] group-hover:text-[#E62E2D]"
                          }`}
                        >
                          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                        </div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="px-5 pb-5 pt-0">
                              <div className="p-4 rounded-xl bg-gray-50/80 border border-gray-100 text-xs sm:text-sm text-gray-600 leading-relaxed font-normal text-justify">
                                {item.a}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>

              {/* Right Column: Second half of FAQs (lg:col-span-1) */}
              <div className="space-y-4">
                {activeFaqs.slice(Math.ceil(activeFaqs.length / 2)).map((item: any, index: number) => {
                  const globalIdx = index + Math.ceil(activeFaqs.length / 2);
                  const isOpen = openFaq === globalIdx;
                  const ItemIcon = FileText;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                      className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                        isOpen
                          ? "border-red-200 shadow-md ring-1 ring-red-100"
                          : "border-gray-100/90 shadow-sm hover:shadow-md hover:border-gray-200"
                      }`}
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : globalIdx)}
                        className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left group"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-red-50/80 text-[#E62E2D] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#E62E2D] group-hover:text-white transition-all duration-300">
                            <ItemIcon size={18} />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[11px] font-black text-gray-400 block leading-none mb-1">
                              0{globalIdx + 1}
                            </span>
                            <h4 className="text-xs sm:text-sm font-extrabold text-gray-900 leading-snug group-hover:text-[#E62E2D] transition-colors">
                              {item.q}
                            </h4>
                          </div>
                        </div>

                        <div
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                            isOpen
                              ? "bg-[#E62E2D] text-white shadow-md"
                              : "border border-gray-300 text-gray-400 group-hover:border-[#E62E2D] group-hover:text-[#E62E2D]"
                          }`}
                        >
                          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                        </div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="px-5 pb-5 pt-0">
                              <div className="p-4 rounded-xl bg-gray-50/80 border border-gray-100 text-xs sm:text-sm text-gray-600 leading-relaxed font-normal text-justify">
                                {item.a}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>

            </div>

          </div>
        </section>
      )}

      {/* 7. CTA SECTION - EXACT REFERENCE MATCH DESIGN */}
      {hasCta && (
        <section className="py-24 bg-[#f8f9fb] relative overflow-hidden border-t border-gray-200/80">
          {/* Background decorative diagonal accent elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-red-50/50 to-transparent pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#E62E2D]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column: Heading, Actions & 3 Feature Badges (lg:col-span-6) */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="lg:col-span-6 flex flex-col justify-between"
              >
                <div>
                  {/* Badge Header */}
                  <div className="inline-flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-[2px] bg-[#E62E2D]" />
                    <span className="text-[#E62E2D] font-black text-xs tracking-widest uppercase">
                      {data?.cta?.badge || "LET'S BUILD TOGETHER"}
                    </span>
                  </div>

                  {/* Main Heading */}
                  <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold leading-tight tracking-tight text-gray-900 mb-4">
                    {data?.cta?.title || `Ready to Start Your Next Project in Saudi Arabia?`}
                  </h2>

                  {/* Subtitle / Description with smooth internal scroll */}
                  <div
                    data-lenis-prevent
                    className="max-h-[110px] sm:max-h-[130px] overflow-y-auto pr-3 mb-8 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-[#E62E2D] overscroll-contain"
                  >
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed max-w-xl font-normal text-justify">
                      {data?.cta?.desc || "Partner with a trusted contracting company delivering safe, reliable and high-quality industrial solutions across the Kingdom."}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-4 mb-10">
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-[#E62E2D] text-white font-extrabold text-sm rounded-xl shadow-lg shadow-[#E62E2D]/30 hover:bg-[#c92423] hover:shadow-xl transition-all group"
                    >
                      <span>{data?.cta?.primaryBtnText || "Get in Touch"}</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-white border border-gray-200 text-gray-800 font-extrabold text-sm rounded-xl hover:border-red-200 hover:bg-red-50/50 hover:text-[#E62E2D] shadow-sm transition-all group"
                    >
                      <span>{data?.cta?.secondaryBtnText || "Request a Consultation"}</span>
                      <Calendar size={16} className="text-gray-500 group-hover:text-[#E62E2D] transition-colors" />
                    </Link>
                  </div>
                </div>

                {/* 3 Footer Feature Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200/80">
                  {/* Feature 1 */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50/80 text-[#E62E2D] flex items-center justify-center shrink-0 shadow-sm">
                      <Users size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-black text-gray-900 leading-snug">Experienced</div>
                      <div className="text-xs font-bold text-gray-500 leading-snug">Project Team</div>
                    </div>
                  </div>

                  {/* Feature 2 */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50/80 text-[#E62E2D] flex items-center justify-center shrink-0 shadow-sm">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-black text-gray-900 leading-snug">Safety & Quality</div>
                      <div className="text-xs font-bold text-gray-500 leading-snug">Focused</div>
                    </div>
                  </div>

                  {/* Feature 3 */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50/80 text-[#E62E2D] flex items-center justify-center shrink-0 shadow-sm">
                      <Clock size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-black text-gray-900 leading-snug">On-Time</div>
                      <div className="text-xs font-bold text-gray-500 leading-snug">Execution</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right Column: Image + Floating 2x2 Stats Card + Red Angled Banner (lg:col-span-6) */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="lg:col-span-6 relative"
              >
                {/* Outer Image Container */}
                <div className="relative h-[440px] sm:h-[480px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl group border border-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=1200&auto=format&fit=crop"
                    alt="Ready to Start Your Project"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Subtle Image Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-black/20 to-transparent" />
                  
                  {/* Right Bottom Decorative Red Wedge */}
                  <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#E62E2D] transform translate-x-16 translate-y-16 rotate-45 pointer-events-none" />

                  {/* Overlapping Bottom-Right Dark Red Angled Banner */}
                  <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-gradient-to-r from-[#8B0B0B] via-[#C41C1C] to-[#E62E2D] p-6 sm:p-7 rounded-2xl sm:rounded-3xl shadow-2xl text-white max-w-[340px] sm:max-w-[380px] z-30">
                    <div className="inline-flex items-center gap-2 mb-2">
                      <div className="w-5 h-[2px] bg-white/80" />
                      <span className="text-white/90 font-black text-[10px] tracking-widest uppercase">
                        DISCUSS YOUR PROJECT
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-2xl font-black text-white leading-tight mb-2">
                      Turn Your <br />
                      Vision Into Reality
                    </h3>
                    <p className="text-xs sm:text-sm text-red-50/90 font-normal leading-relaxed text-justify">
                      Our team is ready to understand your requirements and provide the best solution for your project.
                    </p>
                  </div>
                </div>

                {/* Floating 2x2 Glass Metrics Card (Overlap Top-Left of Image) */}
                <div className="absolute -top-6 -left-4 sm:-top-8 sm:-left-8 bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-2xl border border-white/90 z-40 max-w-[260px] sm:max-w-[290px]">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Metric 1 */}
                    <div className="pr-3 pb-3 border-r border-b border-gray-100">
                      <div className="text-xl sm:text-2xl font-black text-gray-900 leading-none mb-1">
                        200+
                      </div>
                      <div className="w-4 h-[2px] bg-[#E62E2D] my-1" />
                      <div className="text-[9px] sm:text-[10px] font-extrabold text-gray-400 tracking-wider uppercase leading-tight">
                        PROJECTS DELIVERED
                      </div>
                    </div>

                    {/* Metric 2 */}
                    <div className="pl-3 pb-3 border-b border-gray-100">
                      <div className="text-xl sm:text-2xl font-black text-gray-900 leading-none mb-1">
                        15+
                      </div>
                      <div className="w-4 h-[2px] bg-[#E62E2D] my-1" />
                      <div className="text-[9px] sm:text-[10px] font-extrabold text-gray-400 tracking-wider uppercase leading-tight">
                        YEARS OF EXPERIENCE
                      </div>
                    </div>

                    {/* Metric 3 */}
                    <div className="pr-3 pt-3 border-r border-gray-100">
                      <div className="text-xl sm:text-2xl font-black text-gray-900 leading-none mb-1">
                        100+
                      </div>
                      <div className="w-4 h-[2px] bg-[#E62E2D] my-1" />
                      <div className="text-[9px] sm:text-[10px] font-extrabold text-gray-400 tracking-wider uppercase leading-tight">
                        CLIENTS SERVED
                      </div>
                    </div>

                    {/* Metric 4 */}
                    <div className="pl-3 pt-3">
                      <div className="text-xl sm:text-2xl font-black text-gray-900 leading-none mb-1">
                        99%
                      </div>
                      <div className="w-4 h-[2px] bg-[#E62E2D] my-1" />
                      <div className="text-[9px] sm:text-[10px] font-extrabold text-gray-400 tracking-wider uppercase leading-tight">
                        SAFETY COMPLIANCE
                      </div>
                    </div>
                  </div>
                </div>

              </motion.div>

            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
