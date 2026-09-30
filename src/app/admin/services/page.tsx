"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Save, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  CheckCircle2, 
  RefreshCw, 
  Briefcase, 
  Tag, 
  Layers, 
  Eye, 
  EyeOff,
  HelpCircle,
  HelpCircleIcon,
  Sparkles,
  Award,
  Globe,
  MessageSquare,
  Megaphone,
  FileText,
  Building2,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  FolderOpen,
  Upload,
  Image as ImageIcon,
  Search,
  Copy,
  Check,
  AlertCircle,
  Link as LinkIcon,
  Code,
  ArrowLeft,
  Settings
} from "lucide-react";
import MediaLibraryModal from "@/components/MediaLibraryModal";
import ClassicRichEditor from "@/components/admin/ClassicRichEditor";
import { 
  getSubServiceUrl, 
  getChildServiceUrl,
  getParentServiceSlug, 
  getSubServiceSlug,
  getChildServiceSlug,
  slugify
} from "@/lib/subServiceUtils";

// Helper to normalize and populate sub-service capabilities from tags if empty
function normalizeSubServices(servicesData: any[]) {
  if (!Array.isArray(servicesData)) return [];
  return servicesData.map((service) => {
    const subs = Array.isArray(service.subServices) ? service.subServices : [];
    const normalizedSubs = subs.map((sub: any, sIdx: number) => {
      let childCaps = Array.isArray(sub.subServices) ? [...sub.subServices] : [];
      
      // If no subServices array yet, auto-populate from tags
      if (childCaps.length === 0 && Array.isArray(sub.tags) && sub.tags.length > 0) {
        childCaps = sub.tags.map((tag: string, cIdx: number) => ({
          id: `0${cIdx + 1}`,
          title: tag,
          slug: slugify(tag),
          desc: `Specialized ${tag.toLowerCase()} execution delivered with certified crews and modern equipment across Saudi Arabia.`,
          tags: [tag, "Saudi Standards"],
          image: sub.image || service.heroImage || "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=1000&auto=format&fit=crop"
        }));
      }

      return {
        ...sub,
        subServices: childCaps
      };
    });

    return {
      ...service,
      subServices: normalizedSubs
    };
  });
}

// Helper to ensure rich standard defaults for a child capability
function ensureChildDefaults(parentService: any, subService: any, child: any) {
  if (!child) return child;
  const title = child.title || "Specialized Capability";
  const childSlug = child.slug || child.link || slugify(title);

  return {
    ...child,
    id: child.id || "01",
    title: title,
    slug: childSlug,
    badge: child.badge || `${title.toUpperCase()} · SPECIALIZED CAPABILITY`,
    subtitle: child.subtitle || `${title} Execution & Solutions in Saudi Arabia`,
    shortDesc: child.shortDesc || child.desc || `Specialized ${title.toLowerCase()} execution compliant with Saudi Aramco and international quality standards.`,
    fullDesc: child.fullDesc || child.desc || "",
    heroImage: child.heroImage || child.image || subService?.heroImage || subService?.image || parentService?.heroImage || "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=2070&auto=format&fit=crop",
    heroImageAlt: child.heroImageAlt || child.imageAlt || `${title} Hero Image`,
    heroWatermark: child.heroWatermark || "BIC",
    heroTaglines: child.heroTaglines || [
      "Saudi Aramco & SABIC Compliant",
      "Certified Field Supervisors & Technicians",
      "Modern Tooling & Heavy Fleet Support",
      "Kingdom-Wide Fast Mobilization"
    ],
    heroStats: child.heroStats || [
      { value: "100%", label: "Compliance & Safety" },
      { value: "24/7", label: "Rapid Mobilization" },
      { value: "30+", label: "Years Experience" },
      { value: "ISO", label: "Certified QA/QC" }
    ],
    overview: child.overview || {
      title: `${title} Solutions Built for High-Demand Industrial Projects`,
      badge: "EXECUTIVE OVERVIEW",
      desc1: child.desc || `Best International Contracting Company provides turnkey ${title.toLowerCase()} across Saudi Arabia, ensuring precision execution, safety compliance, and disciplined milestone delivery.`,
      desc2: `Operating with in-house equipment, certified technicians, and strict Saudi Aramco & SABIC HSE standards, we execute ${title.toLowerCase()} requirements from greenfield developments to turnaround maintenance overhauls.`,
      specs: [
        "Saudi Aramco & SABIC Approved Contractor Standards",
        "ISO 9001:2015, ISO 14001:2015 & ISO 45001:2018 Certified",
        "Comprehensive Project Management & QA/QC Documentation",
        "Rapid Kingdom-Wide Mobilization across Eastern, Central & Western Provinces"
      ],
      image: child.overview?.image || child.image || subService?.image || "",
      imageAlt: child.overview?.imageAlt || `${title} Executive Overview Image 1`,
      image2: child.overview?.image2 || child.image2 || subService?.image2 || "",
      image2Alt: child.overview?.image2Alt || `${title} Overview Image 2`,
      image3: child.overview?.image3 || child.image3 || subService?.image3 || "",
      image3Alt: child.overview?.image3Alt || `${title} Overview Image 3`,
      image4: child.overview?.image4 || child.image4 || subService?.image4 || "",
      image4Alt: child.overview?.image4Alt || `${title} Overview Image 4`,
      statNum: "100+",
      statLabel: "Successful Contracts",
      statSub: "Across Saudi Arabia",
      standardsTitle: "Saudi Aramco & Royal Commission Standards",
      standardsDesc: "Our QA/QC procedures enforce rigid quality plans, non-destructive testing (NDT), calibrated tooling, and complete safety documentation."
    },
    subServicesBadge: child.subServicesBadge || "RELATED WORK PACKAGES",
    subServicesTitle: child.subServicesTitle || `Related ${subService?.title || "Discipline"} Capabilities`,
    subServicesDesc: child.subServicesDesc || `Explore complementary work packages and execution capabilities.`,
    subServices: Array.isArray(child.subServices) ? child.subServices : [],
    whyChooseUsBadge: child.whyChooseUsBadge || "WHY BEST INTERNATIONAL",
    whyChooseUsTitle: child.whyChooseUsTitle || `Why Choose BIC for ${title}?`,
    whyChooseUsDesc: child.whyChooseUsDesc || `We eliminate project risks by combining heavy equipment independence, Saudi Aramco certified supervisors, and strict QA/QC compliance.`,
    whyChooseUs: Array.isArray(child.whyChooseUs) ? child.whyChooseUs : [],
    industriesBadge: child.industriesBadge || "SECTOR APPLICATIONS",
    industriesTitle: child.industriesTitle || `Industries Powered by Our ${title}`,
    industriesDesc: child.industriesDesc || `Delivering specialized ${title.toLowerCase()} solutions to the Kingdom's vital industrial and civil sectors.`,
    industries: Array.isArray(child.industries) ? child.industries : [],
    showcaseBadge: child.showcaseBadge || "DETAILED EXECUTION",
    showcaseTitle: child.showcaseTitle || `Comprehensive ${title} Execution Framework`,
    showcaseDesc: child.showcaseDesc || `From pre-planning to field execution and quality sign-off, we provide complete lifecycle delivery.`,
    showcaseTabs: Array.isArray(child.showcaseTabs) ? child.showcaseTabs : [],
    faqsBadge: child.faqsBadge || "FREQUENTLY ASKED QUESTIONS",
    faqsTitle: child.faqsTitle || `Common Questions About ${title}`,
    faqsDesc: child.faqsDesc || `Clear answers regarding our ${title.toLowerCase()} workflows, site access, and deliverables.`,
    faqs: Array.isArray(child.faqs) ? child.faqs : [],
    cta: child.cta || {
      badge: "LET'S BUILD TOGETHER",
      title: `Need Reliable ${title} for Your Next Project?`,
      desc: `Get in touch with Best International Contracting Company to discuss project specifications, schedule site visits, or request technical proposals.`,
      buttonText: "Request Technical Proposal",
      buttonLink: "/contact-us"
    },
    metaTitle: child.metaTitle || `${title} Saudi Arabia | Best International Contracting - BiC`,
    metaDescription: child.metaDescription || child.desc || `Expert ${title.toLowerCase()} in Saudi Arabia. Aramco & SABIC approved contractor delivering turnkey industrial excellence across KSA.`,
    canonicalUrl: child.canonicalUrl || "",
    focusKeyword: child.focusKeyword || `${title} Saudi Arabia`,
    ogImage: child.ogImage || child.heroImage || child.image || subService?.heroImage || parentService?.heroImage,
    customSchema: child.customSchema || ""
  };
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // 3-Level Navigation State
  const [selectedServiceIndex, setSelectedServiceIndex] = useState<number | null>(0);
  const [selectedSubServiceIndex, setSelectedSubServiceIndex] = useState<number | null>(null);
  const [selectedChildServiceIndex, setSelectedChildServiceIndex] = useState<number | null>(null);

  const [activeTab, setActiveTab] = useState<
    "hero" | "overview" | "subServices" | "whyChooseUs" | "industries" | "showcase" | "faqs" | "cta" | "seo"
  >("hero");
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [treeSearch, setTreeSearch] = useState("");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Media Library Modal State
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<{
    type: "root" | "nested" | "array";
    field: string;
    section?: string;
    arrayIndex?: number;
    currentValue: string;
  } | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/services?_t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Pragma": "no-cache",
          "Cache-Control": "no-cache"
        }
      });
      if (res.ok) {
        const data = await res.json();
        const normalized = normalizeSubServices(data);
        setServices(normalized);
        if (normalized.length > 0 && selectedServiceIndex === null) {
          setSelectedServiceIndex(0);
        }
      }
    } catch (err) {
      console.error("Failed to fetch services:", err);
      setMessage({ text: "Failed to load services data.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Save ONLY the currently selected service (prevents overwriting coworkers' work on other services)
  const handleSaveCurrentService = async () => {
    if (selectedServiceIndex === null || !currentService) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: currentService.id,
          serviceData: currentService
        }),
      });

      if (res.ok) {
        const resData = await res.json();
        setMessage({ 
          text: `"${currentService.title}" saved successfully without touching other services!`, 
          type: "success" 
        });
        setTimeout(() => setMessage(null), 4000);
      } else {
        setMessage({ text: "Error saving service data.", type: "error" });
      }
    } catch (err) {
      console.error("Error saving service:", err);
      setMessage({ text: "Failed to connect to server.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(services),
      });

      if (res.ok) {
        setMessage({ text: "All Services, Sub-Services & Capabilities saved successfully!", type: "success" });
        setTimeout(() => setMessage(null), 4000);
      } else {
        setMessage({ text: "Error saving services data.", type: "error" });
      }
    } catch (err) {
      console.error("Error saving services:", err);
      setMessage({ text: "Failed to connect to server.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  // Hierarchy Resolution
  const currentService = selectedServiceIndex !== null ? services[selectedServiceIndex] : null;
  const isEditingSubService = selectedSubServiceIndex !== null && selectedChildServiceIndex === null;
  const isEditingChildService = selectedSubServiceIndex !== null && selectedChildServiceIndex !== null;

  const currentSubService = (selectedSubServiceIndex !== null && currentService?.subServices)
    ? currentService.subServices[selectedSubServiceIndex]
    : null;

  const rawChildService = (isEditingChildService && currentSubService?.subServices)
    ? currentSubService.subServices[selectedChildServiceIndex]
    : null;

  const currentChildService = isEditingChildService
    ? ensureChildDefaults(currentService, currentSubService, rawChildService)
    : null;

  // The active entity being configured in the form
  const activeEntity = isEditingChildService 
    ? currentChildService 
    : (selectedSubServiceIndex !== null ? currentSubService : currentService);

  // Update entity top-level fields
  const updateEntityField = (field: string, value: any) => {
    if (selectedServiceIndex === null) return;
    const updated = [...services];
    const targetService = { ...updated[selectedServiceIndex] };

    const applyFields = (item: any) => {
      const res = { ...item, [field]: value };
      if (field === "shortDesc") {
        res.desc = value;
      } else if (field === "desc") {
        res.shortDesc = value;
      }
      return res;
    };

    if (selectedSubServiceIndex === null) {
      targetService[field] = value;
      if (field === "shortDesc") targetService.desc = value;
      if (field === "desc") targetService.shortDesc = value;
    } else if (selectedChildServiceIndex === null) {
      const subs = [...(targetService.subServices || [])];
      subs[selectedSubServiceIndex] = applyFields(subs[selectedSubServiceIndex]);
      targetService.subServices = subs;
    } else {
      const subs = [...(targetService.subServices || [])];
      const targetSub = { ...subs[selectedSubServiceIndex] };
      const childs = [...(targetSub.subServices || [])];
      const existingChild = ensureChildDefaults(targetService, targetSub, childs[selectedChildServiceIndex]);
      childs[selectedChildServiceIndex] = applyFields(existingChild);
      targetSub.subServices = childs;
      subs[selectedSubServiceIndex] = targetSub;
      targetService.subServices = subs;
    }
    updated[selectedServiceIndex] = targetService;
    setServices(updated);
  };

  // Update nested objects (e.g. overview, cta)
  const updateEntityNested = (section: string, field: string, value: any) => {
    if (selectedServiceIndex === null) return;
    const updated = [...services];
    const targetService = { ...updated[selectedServiceIndex] };

    if (selectedSubServiceIndex === null) {
      const sectionObj = { ...(targetService[section] || {}) };
      sectionObj[field] = value;
      targetService[section] = sectionObj;
    } else if (selectedChildServiceIndex === null) {
      const subs = [...(targetService.subServices || [])];
      const targetSub = { ...subs[selectedSubServiceIndex] };
      const sectionObj = { ...(targetSub[section] || {}) };
      sectionObj[field] = value;
      targetSub[section] = sectionObj;
      subs[selectedSubServiceIndex] = targetSub;
      targetService.subServices = subs;
    } else {
      const subs = [...(targetService.subServices || [])];
      const targetSub = { ...subs[selectedSubServiceIndex] };
      const childs = [...(targetSub.subServices || [])];
      const existingChild = ensureChildDefaults(targetService, targetSub, childs[selectedChildServiceIndex]);
      const sectionObj = { ...(existingChild[section] || {}) };
      sectionObj[field] = value;
      childs[selectedChildServiceIndex] = {
        ...existingChild,
        [section]: sectionObj
      };
      targetSub.subServices = childs;
      subs[selectedSubServiceIndex] = targetSub;
      targetService.subServices = subs;
    }
    updated[selectedServiceIndex] = targetService;
    setServices(updated);
  };

  // Array item additions
  const addEntityArrayItem = (sectionKey: string, defaultItem: any) => {
    if (selectedServiceIndex === null || !activeEntity) return;
    const updated = [...services];
    const targetService = { ...updated[selectedServiceIndex] };

    if (selectedSubServiceIndex === null) {
      const currentArr = Array.isArray(targetService[sectionKey]) ? targetService[sectionKey] : [];
      targetService[sectionKey] = [...currentArr, defaultItem];
    } else if (selectedChildServiceIndex === null) {
      const subs = [...(targetService.subServices || [])];
      const targetSub = { ...subs[selectedSubServiceIndex] };
      const currentArr = Array.isArray(targetSub[sectionKey]) ? targetSub[sectionKey] : [];
      targetSub[sectionKey] = [...currentArr, defaultItem];
      subs[selectedSubServiceIndex] = targetSub;
      targetService.subServices = subs;
    } else {
      const subs = [...(targetService.subServices || [])];
      const targetSub = { ...subs[selectedSubServiceIndex] };
      const childs = [...(targetSub.subServices || [])];
      const existingChild = ensureChildDefaults(targetService, targetSub, childs[selectedChildServiceIndex]);
      const currentArr = Array.isArray(existingChild[sectionKey]) ? existingChild[sectionKey] : [];
      childs[selectedChildServiceIndex] = {
        ...existingChild,
        [sectionKey]: [...currentArr, defaultItem]
      };
      targetSub.subServices = childs;
      subs[selectedSubServiceIndex] = targetSub;
      targetService.subServices = subs;
    }
    updated[selectedServiceIndex] = targetService;
    setServices(updated);
  };

  // Array item updates
  const updateEntityArrayItem = (sectionKey: string, itemIndex: number, field: string, value: any) => {
    if (selectedServiceIndex === null || !activeEntity) return;
    const updated = [...services];
    const targetService = { ...updated[selectedServiceIndex] };

    if (selectedSubServiceIndex === null) {
      const currentArr = [...(targetService[sectionKey] || [])];
      if (currentArr[itemIndex]) {
        currentArr[itemIndex] = { ...currentArr[itemIndex], [field]: value };
        targetService[sectionKey] = currentArr;
      }
    } else if (selectedChildServiceIndex === null) {
      const subs = [...(targetService.subServices || [])];
      const targetSub = { ...subs[selectedSubServiceIndex] };
      const currentArr = [...(targetSub[sectionKey] || [])];
      if (currentArr[itemIndex]) {
        currentArr[itemIndex] = { ...currentArr[itemIndex], [field]: value };
        targetSub[sectionKey] = currentArr;
        subs[selectedSubServiceIndex] = targetSub;
        targetService.subServices = subs;
      }
    } else {
      const subs = [...(targetService.subServices || [])];
      const targetSub = { ...subs[selectedSubServiceIndex] };
      const childs = [...(targetSub.subServices || [])];
      const existingChild = ensureChildDefaults(targetService, targetSub, childs[selectedChildServiceIndex]);
      const currentArr = [...(existingChild[sectionKey] || [])];
      if (currentArr[itemIndex]) {
        currentArr[itemIndex] = { ...currentArr[itemIndex], [field]: value };
        childs[selectedChildServiceIndex] = {
          ...existingChild,
          [sectionKey]: currentArr
        };
        targetSub.subServices = childs;
        subs[selectedSubServiceIndex] = targetSub;
        targetService.subServices = subs;
      }
    }
    updated[selectedServiceIndex] = targetService;
    setServices(updated);
  };

  // Array item deletions
  const removeEntityArrayItem = (sectionKey: string, itemIndex: number) => {
    if (selectedServiceIndex === null || !activeEntity) return;
    const updated = [...services];
    const targetService = { ...updated[selectedServiceIndex] };

    if (selectedSubServiceIndex === null) {
      targetService[sectionKey] = (targetService[sectionKey] || []).filter((_: any, i: number) => i !== itemIndex);
    } else if (selectedChildServiceIndex === null) {
      const subs = [...(targetService.subServices || [])];
      const targetSub = { ...subs[selectedSubServiceIndex] };
      targetSub[sectionKey] = (targetSub[sectionKey] || []).filter((_: any, i: number) => i !== itemIndex);
      subs[selectedSubServiceIndex] = targetSub;
      targetService.subServices = subs;
    } else {
      const subs = [...(targetService.subServices || [])];
      const targetSub = { ...subs[selectedSubServiceIndex] };
      const childs = [...(targetSub.subServices || [])];
      const existingChild = ensureChildDefaults(targetService, targetSub, childs[selectedChildServiceIndex]);
      childs[selectedChildServiceIndex] = {
        ...existingChild,
        [sectionKey]: (existingChild[sectionKey] || []).filter((_: any, i: number) => i !== itemIndex)
      };
      targetSub.subServices = childs;
      subs[selectedSubServiceIndex] = targetSub;
      targetService.subServices = subs;
    }
    updated[selectedServiceIndex] = targetService;
    setServices(updated);
  };

  const addNewService = () => {
    const timestamp = Date.now().toString().slice(-4);
    const newService = {
      id: `service-${timestamp}`,
      title: "New Industrial Service",
      slug: `/services/new-service-${timestamp}`,
      subtitle: "Comprehensive Industrial & Engineering Capabilities",
      badge: "INDUSTRIAL SOLUTION",
      shortDesc: "World-class industrial service offering executed to Saudi Aramco and international quality standards.",
      fullDesc: "Best International provides specialized industrial capabilities across Saudi Arabia with certified engineers and equipment.",
      heroImage: "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=2070&auto=format&fit=crop",
      heroWatermark: "BIC",
      active: true,
      overview: {
        title: "High-Performance Industrial Capabilities Delivered On Demand",
        badge: "ENGINEERING EXCELLENCE",
        desc1: "Best International Contracting Company delivers multi-disciplinary industrial solutions to energy producers, petrochemical complexes, and infrastructure projects.",
        desc2: "With strict QA/QC standards and Saudi Aramco compliance, our engineering crews operate with modern equipment to execute complex projects on schedule.",
        specs: [
          "Saudi Aramco & SABIC Approved Contractor",
          "ISO 9001:2015 & ISO 45001:2018 Certified",
          "Turnkey Execution Across Saudi Arabia",
          "24/7 Rapid Mobilization Support"
        ],
        image: "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=1000&auto=format&fit=crop",
        statNum: "100+",
        statLabel: "Projects Delivered",
        statSub: "Across Saudi Arabia"
      },
      subServices: [
        {
          id: "01",
          title: "Specialized Engineering Package",
          desc: "Full-scope execution adhering to international codes and client specifications with safety assurance.",
          tags: ["Engineering", "Turnkey", "Aramco Standard", "Quality Assurance"],
          image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1000&auto=format&fit=crop",
          subServices: [
            {
              id: "01",
              title: "Detailed Engineering & Planning",
              desc: "Engineering method statements and site planning.",
              tags: ["Planning", "Design"],
              image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1000&auto=format&fit=crop"
            }
          ]
        }
      ],
      whyChooseUs: [
        {
          id: "01",
          title: "Certified Safety & Quality Compliance",
          desc: "Strict adherence to Aramco safety standards, ASME/AWS codes, and ISO quality procedures.",
          image: "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=800&auto=format&fit=crop"
        }
      ],
      industries: [
        {
          id: "01",
          name: "Oil & Gas Refineries",
          desc: "Specialized industrial engineering solutions for refinery process units.",
          image: "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=800&auto=format&fit=crop"
        }
      ],
      showcaseTabs: [
        {
          id: "01",
          title: "Integrated Service Package",
          desc: "Complete operational capabilities tailored for industrial, civil, and energy projects across KSA.",
          image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1000&auto=format&fit=crop",
          features: ["Turnkey Project Execution", "On-Time Delivery", "Certified Specialists", "QA/QC Inspection"]
        }
      ],
      faqs: [
        {
          id: "01",
          q: "What certifications and approvals do your teams possess for this service?",
          a: "All operations strictly adhere to Saudi Aramco Safety System requirements, ISO 9001/45001 standards, and valid third-party certifications."
        }
      ],
      cta: {
        badge: "READY TO EXECUTE YOUR PROJECT?",
        title: "Partner with KSA's Premier Industrial Contractor",
        titleAccent: "Premier Industrial Contractor",
        desc: "Request a comprehensive technical proposal or speak directly with our project manager today.",
        primaryBtnText: "Request Technical Proposal",
        secondaryBtnText: "Direct Consultation (+966)"
      },
      metaTitle: "New Industrial Service | Best International Contracting Saudi Arabia",
      metaDescription: "World-class industrial service offering executed to Saudi Aramco and international quality standards across Saudi Arabia.",
      canonicalUrl: `https://bestinternational.com.sa/services/new-service-${timestamp}`,
      focusKeyword: "New Industrial Service Saudi Arabia",
      ogImage: "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=2070&auto=format&fit=crop"
    };
    const updated = [...services, newService];
    setServices(updated);
    setSelectedServiceIndex(updated.length - 1);
    setSelectedSubServiceIndex(null);
    setSelectedChildServiceIndex(null);
  };

  const removeService = (index: number) => {
    const sTitle = services[index]?.title || "this service";
    if (confirm(`Are you sure you want to delete "${sTitle}" and all its sub-services?`)) {
      const updated = services.filter((_, i) => i !== index);
      setServices(updated);
      if (selectedServiceIndex === index) {
        setSelectedServiceIndex(updated.length > 0 ? 0 : null);
        setSelectedSubServiceIndex(null);
        setSelectedChildServiceIndex(null);
      } else if (selectedServiceIndex !== null && selectedServiceIndex > index) {
        setSelectedServiceIndex(selectedServiceIndex - 1);
      }
    }
  };

  const removeSubService = (serviceIndex: number, subIndex: number) => {
    const sTitle = services[serviceIndex]?.subServices?.[subIndex]?.title || `Sub-Service #${subIndex + 1}`;
    if (confirm(`Are you sure you want to delete Level 2 Sub-Service "${sTitle}" and all its child capabilities?`)) {
      const updated = [...services];
      const targetService = { ...updated[serviceIndex] };
      const currentSubs = Array.isArray(targetService.subServices) ? targetService.subServices : [];
      targetService.subServices = currentSubs.filter((_: any, i: number) => i !== subIndex);
      updated[serviceIndex] = targetService;
      setServices(updated);

      if (selectedServiceIndex === serviceIndex) {
        if (selectedSubServiceIndex === subIndex) {
          setSelectedSubServiceIndex(null);
          setSelectedChildServiceIndex(null);
        } else if (selectedSubServiceIndex !== null && selectedSubServiceIndex > subIndex) {
          setSelectedSubServiceIndex(selectedSubServiceIndex - 1);
        }
      }
    }
  };

  const removeChildService = (serviceIndex: number, subIndex: number, childIndex: number) => {
    const cTitle = services[serviceIndex]?.subServices?.[subIndex]?.subServices?.[childIndex]?.title || `Capability #${childIndex + 1}`;
    if (confirm(`Are you sure you want to delete Level 3 Capability "${cTitle}"?`)) {
      const updated = [...services];
      const targetService = { ...updated[serviceIndex] };
      const currentSubs = [...(targetService.subServices || [])];
      const targetSub = { ...currentSubs[subIndex] };
      const currentChilds = Array.isArray(targetSub.subServices) ? targetSub.subServices : [];
      targetSub.subServices = currentChilds.filter((_: any, i: number) => i !== childIndex);
      currentSubs[subIndex] = targetSub;
      targetService.subServices = currentSubs;
      updated[serviceIndex] = targetService;
      setServices(updated);

      if (selectedServiceIndex === serviceIndex && selectedSubServiceIndex === subIndex) {
        if (selectedChildServiceIndex === childIndex) {
          setSelectedChildServiceIndex(null);
        } else if (selectedChildServiceIndex !== null && selectedChildServiceIndex > childIndex) {
          setSelectedChildServiceIndex(selectedChildServiceIndex - 1);
        }
      }
    }
  };

  // Media Library Trigger Helpers
  const openMediaPicker = (
    type: "root" | "nested" | "array",
    field: string,
    currentValue: string,
    section?: string,
    arrayIndex?: number
  ) => {
    setMediaTarget({ type, field, currentValue, section, arrayIndex });
    setIsMediaModalOpen(true);
  };

  const handleMediaSelect = (newUrl: string, newAlt?: string) => {
    if (!mediaTarget) return;

    if (mediaTarget.type === "root") {
      updateEntityField(mediaTarget.field, newUrl);
      if (newAlt) {
        if (mediaTarget.field === "heroImage" || mediaTarget.field === "image") {
          updateEntityField("heroImageAlt", newAlt);
        } else if (mediaTarget.field === "ogImage") {
          updateEntityField("ogImageAlt", newAlt);
        }
      }
    } else if (mediaTarget.type === "nested" && mediaTarget.section) {
      updateEntityNested(mediaTarget.section, mediaTarget.field, newUrl);
      if (newAlt && mediaTarget.section === "overview") {
        updateEntityNested("overview", `${mediaTarget.field}Alt`, newAlt);
      }
    } else if (mediaTarget.type === "array" && mediaTarget.section && mediaTarget.arrayIndex !== undefined) {
      updateEntityArrayItem(mediaTarget.section, mediaTarget.arrayIndex, mediaTarget.field, newUrl);
      if (newAlt) {
        updateEntityArrayItem(mediaTarget.section, mediaTarget.arrayIndex, "imageAlt", newAlt);
      }
    }
  };

  // Calculate current live URL for preview button
  const getLivePreviewUrl = () => {
    if (!activeEntity) return "#";
    if (isEditingChildService && currentService && currentSubService) {
      return getChildServiceUrl(currentService, currentSubService, activeEntity);
    }
    if (selectedSubServiceIndex !== null && currentService) {
      return getSubServiceUrl(currentService, activeEntity);
    }
    if (activeEntity.slug?.startsWith("http") || activeEntity.slug?.startsWith("/")) {
      return activeEntity.slug;
    }
    return `/services/${activeEntity.slug || activeEntity.id}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <RefreshCw className="w-8 h-8 animate-spin text-red-600" />
        <span className="ml-3 text-slate-700 font-medium">Loading services data...</span>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-8">
      {/* Executive Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B0F17] via-[#111625] to-[#0A0D14] p-6 md:p-8 text-white border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] border border-white/10 text-xs font-semibold text-red-400 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span>BIC Enterprise Architecture CMS</span>
              <span className="text-white/30">|</span>
              <span className="text-slate-300 font-mono text-[11px]">3-Tier Depth Enabled</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Services & Capabilities Control Center
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Manage Level 1 Main Disciplines, Level 2 Sub-Services, and Level 3 Dedicated Capabilities with turnkey content, image galleries, and SEO schema.
            </p>

            {/* Quick Metrics Strip */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs backdrop-blur-sm">
                <Briefcase className="w-3.5 h-3.5 text-red-400" />
                <span className="text-slate-400">Disciplines (L1):</span>
                <strong className="text-white font-bold">{services.length}</strong>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs backdrop-blur-sm">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-slate-400">Sub-Services (L2):</span>
                <strong className="text-white font-bold">
                  {services.reduce((acc, s) => acc + (s.subServices?.length || 0), 0)}
                </strong>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-slate-400">Capabilities (L3):</span>
                <strong className="text-white font-bold">
                  {services.reduce((acc, s) => acc + (s.subServices || []).reduce((subAcc: number, sub: any) => subAcc + (sub.subServices?.length || 0), 0), 0)}
                </strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={addNewService}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/15 rounded-xl transition-all duration-200 text-xs md:text-sm font-semibold shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 text-red-400" />
              <span>Add Discipline</span>
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl transition-all duration-200 text-xs md:text-sm font-bold shadow-lg shadow-red-600/30 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? "Saving Data..." : "Save All Changes"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Alert Notification */}
      {message && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between shadow-sm transition-all ${
            message.type === "success"
              ? "bg-emerald-50/90 border-emerald-200 text-emerald-900"
              : "bg-red-50/90 border-red-200 text-red-900"
          }`}
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
            <span className="font-semibold text-xs md:text-sm">{message.text}</span>
          </div>
          <button 
            onClick={() => setMessage(null)} 
            className="text-xs font-bold opacity-60 hover:opacity-100 px-2 py-1 rounded bg-white/50"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 3-Tier Hierarchy Explorer Tree */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col">
            {/* Tree Explorer Header */}
            <div className="p-4 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-slate-900 flex items-center gap-2 text-xs uppercase tracking-wider">
                  <FolderOpen className="w-4 h-4 text-red-600" />
                  3-Tier Hierarchy Explorer
                </h2>
                <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                  {services.length} Root Services
                </span>
              </div>

              {/* Tree Quick Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter tree by keyword..."
                  value={treeSearch}
                  onChange={(e) => setTreeSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/90 rounded-xl py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-2xs"
                />
                {treeSearch && (
                  <button
                    onClick={() => setTreeSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-700"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Tree Items List */}
            <div data-lenis-prevent className="divide-y divide-slate-100/80 max-h-[750px] overflow-y-auto overscroll-contain custom-scrollbar p-2.5 space-y-2">
              {services
                .filter((service) => {
                  if (!treeSearch.trim()) return true;
                  const q = treeSearch.toLowerCase();
                  const matchesService = service.title?.toLowerCase().includes(q) || service.slug?.toLowerCase().includes(q);
                  const matchesSub = (service.subServices || []).some(
                    (sub: any) =>
                      sub.title?.toLowerCase().includes(q) ||
                      (sub.subServices || []).some((child: any) => child.title?.toLowerCase().includes(q))
                  );
                  return matchesService || matchesSub;
                })
                .map((service, index) => {
                const isSelected = selectedServiceIndex === index;
                const isServiceSelectedMain = isSelected && selectedSubServiceIndex === null && selectedChildServiceIndex === null;
                const subs = Array.isArray(service.subServices) ? service.subServices : [];

                return (
                  <div key={service.id || index} className="rounded-xl overflow-hidden border border-slate-200/60 bg-white">
                    {/* Level 1 Main Service Row */}
                    <div
                      onClick={() => {
                        setSelectedServiceIndex(index);
                        setSelectedSubServiceIndex(null);
                        setSelectedChildServiceIndex(null);
                      }}
                      className={`p-3 cursor-pointer transition-all duration-200 flex items-center justify-between group ${
                        isServiceSelectedMain
                          ? "bg-gradient-to-r from-red-50 via-rose-50/50 to-white border-l-4 border-red-600 text-red-950 font-bold shadow-xs"
                          : isSelected
                          ? "bg-slate-50 border-l-4 border-slate-400 text-slate-900 font-semibold"
                          : "hover:bg-slate-50/80 text-slate-700"
                      }`}
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-slate-100 group-hover:bg-red-100 flex items-center justify-center text-slate-600 group-hover:text-red-600 text-[10px] font-mono font-bold shrink-0 transition-colors">
                            L1
                          </span>
                          <span className="truncate text-xs md:text-sm font-semibold">{service.title}</span>
                          {!service.active && (
                            <span className="px-1.5 py-0.2 text-[9px] uppercase font-bold bg-slate-200 text-slate-600 rounded">
                              Hidden
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 pl-7">
                          <span>{subs.length} sub-services</span>
                          <span>•</span>
                          <span>
                            {subs.reduce((acc: number, s: any) => acc + (s.subServices?.length || 0), 0)} capabilities
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeService(index);
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                          title="Delete discipline"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Indented Sub-Services Tree List */}
                    {isSelected && subs.length > 0 && (
                      <div className="bg-slate-50/70 p-2.5 space-y-2 border-t border-slate-150">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
                          <span>Level 2 Sub-Services ({subs.length})</span>
                          <span className="text-slate-300">↳ Branch</span>
                        </div>

                        <div className="ml-2 pl-3 border-l-2 border-slate-200/90 space-y-1.5">
                          {subs.map((sub: any, sIdx: number) => {
                            const isSubSelected = isSelected && selectedSubServiceIndex === sIdx && selectedChildServiceIndex === null;
                            const isSubParentOfChild = isSelected && selectedSubServiceIndex === sIdx && selectedChildServiceIndex !== null;
                            const childCaps = Array.isArray(sub.subServices) ? sub.subServices : [];

                            return (
                              <div key={sub.id || sIdx} className="space-y-1">
                                <div
                                  onClick={() => {
                                    setSelectedServiceIndex(index);
                                    setSelectedSubServiceIndex(sIdx);
                                    setSelectedChildServiceIndex(null);
                                  }}
                                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition group ${
                                    isSubSelected
                                      ? "bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold shadow-md shadow-red-500/20"
                                      : isSubParentOfChild
                                      ? "bg-red-50 text-red-900 font-semibold border border-red-200"
                                      : "text-slate-700 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200"
                                  }`}
                                >
                                  <span className="truncate flex items-center gap-1.5 flex-1 min-w-0 pr-1">
                                    <span className={`text-[9px] font-mono px-1 py-0.2 rounded ${
                                      isSubSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                                    }`}>
                                      L2
                                    </span>
                                    <span className="truncate">{sub.title}</span>
                                  </span>

                                  <div className="flex items-center gap-1 shrink-0">
                                    {childCaps.length > 0 && (
                                      <span className={`text-[9px] font-mono px-1 rounded ${
                                        isSubSelected ? "bg-red-700 text-white" : "text-slate-400"
                                      }`}>
                                        {childCaps.length} caps
                                      </span>
                                    )}
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeSubService(index, sIdx);
                                      }}
                                      className={`p-1 rounded transition ${
                                        isSubSelected
                                          ? "text-red-200 hover:text-white hover:bg-red-700"
                                          : "text-slate-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100"
                                      }`}
                                      title={`Delete sub-service "${sub.title}"`}
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>

                                {/* Level 3 Child Capabilities Tree List */}
                                {isSelected && selectedSubServiceIndex === sIdx && childCaps.length > 0 && (
                                  <div className="ml-3 pl-3 border-l-2 border-purple-200/90 py-1 space-y-1 bg-purple-50/30 rounded-r-lg">
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-purple-600 block px-1">
                                      Level 3 Capabilities ({childCaps.length}):
                                    </span>
                                    {childCaps.map((child: any, cIdx: number) => {
                                      const isChildSelected = isSelected && selectedSubServiceIndex === sIdx && selectedChildServiceIndex === cIdx;
                                      return (
                                        <div
                                          key={child.id || cIdx}
                                          onClick={() => {
                                            setSelectedServiceIndex(index);
                                            setSelectedSubServiceIndex(sIdx);
                                            setSelectedChildServiceIndex(cIdx);
                                          }}
                                          className={`flex items-center justify-between px-2 py-1 rounded text-[11px] cursor-pointer transition group ${
                                            isChildSelected
                                              ? "bg-gradient-to-r from-purple-700 to-indigo-700 text-white font-bold shadow-xs"
                                              : "text-slate-600 hover:bg-white hover:text-purple-800"
                                          }`}
                                        >
                                          <span className="truncate flex items-center gap-1.5 flex-1 min-w-0 pr-1">
                                            <span className={`text-[8px] font-mono px-1 rounded ${
                                              isChildSelected ? "bg-white/20 text-white" : "bg-purple-100 text-purple-700"
                                            }`}>
                                              L3
                                            </span>
                                            <span className="truncate">{child.title}</span>
                                          </span>
                                          <div className="flex items-center gap-1 shrink-0">
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                removeChildService(index, sIdx, cIdx);
                                              }}
                                              className={`p-0.5 rounded transition ${
                                                isChildSelected
                                                  ? "text-purple-200 hover:text-white hover:bg-purple-800"
                                                  : "text-slate-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100"
                                              }`}
                                              title={`Delete capability "${child.title}"`}
                                            >
                                              <Trash2 className="w-2.5 h-2.5" />
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Section Editor */}
        <div className="lg:col-span-8">
          {activeEntity ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] overflow-hidden">
              {/* Section Header & Breadcrumb Bar */}
              <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50/90 via-white to-slate-50/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    {/* Level 3 Header */}
                    {isEditingChildService ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-purple-700 to-indigo-700 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm shadow-purple-500/20">
                            <Sparkles className="w-3.5 h-3.5 text-purple-200" /> Level 3 · Dedicated Capability
                          </span>
                          <button
                            onClick={() => setSelectedChildServiceIndex(null)}
                            className="text-xs font-bold text-slate-600 hover:text-red-600 flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition shadow-2xs"
                          >
                            <ArrowLeft className="w-3 h-3" /> Back to {currentSubService?.title}
                          </button>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1">
                          {activeEntity.title || `Capability #${(selectedChildServiceIndex || 0) + 1}`}
                        </h2>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
                          <span className="font-semibold text-slate-700">{currentService?.title}</span>
                          <span>&gt;</span>
                          <span className="font-semibold text-slate-700">{currentSubService?.title}</span>
                          <span>&gt;</span>
                          <span className="text-purple-700 font-bold">{activeEntity.title}</span>
                        </div>
                      </div>
                    ) : isEditingSubService ? (
                      /* Level 2 Header */
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-red-600 to-rose-600 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm shadow-red-500/20">
                            <Layers className="w-3.5 h-3.5 text-red-200" /> Level 2 · Sub-Service Offering
                          </span>
                          <button
                            onClick={() => setSelectedSubServiceIndex(null)}
                            className="text-xs font-bold text-slate-600 hover:text-red-600 flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition shadow-2xs"
                          >
                            <ArrowLeft className="w-3 h-3" /> Back to {currentService?.title}
                          </button>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1">
                          {activeEntity.title || `Sub-Service #${(selectedSubServiceIndex || 0) + 1}`}
                        </h2>
                        <p className="text-xs text-slate-500">
                          Parent Discipline: <strong className="text-slate-800">{currentService?.title}</strong>
                        </p>
                      </div>
                    ) : (
                      /* Level 1 Header */
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-white bg-slate-900 px-3 py-1 rounded-full flex items-center gap-1.5 w-fit shadow-xs">
                          <Briefcase className="w-3.5 h-3.5 text-red-400" /> Level 1 · Main Service Discipline
                        </span>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1">
                          {activeEntity.title}
                        </h2>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5">
                    {selectedSubServiceIndex === null ? (
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 bg-white px-3.5 py-2 border border-slate-200 rounded-xl shadow-2xs hover:bg-slate-50 transition">
                        <input
                          type="checkbox"
                          checked={activeEntity.active !== false}
                          onChange={(e) => updateEntityField("active", e.target.checked)}
                          className="rounded border-slate-300 text-red-600 focus:ring-red-500 w-4 h-4"
                        />
                        <span>{activeEntity.active !== false ? "🟢 Published" : "⚪ Draft / Hidden"}</span>
                      </label>
                    ) : selectedChildServiceIndex === null ? (
                      <button
                        type="button"
                        onClick={() => removeSubService(selectedServiceIndex!, selectedSubServiceIndex!)}
                        className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 rounded-xl transition shadow-2xs"
                        title="Delete this sub-service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Sub-Service</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeChildService(selectedServiceIndex!, selectedSubServiceIndex!, selectedChildServiceIndex!)}
                        className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 rounded-xl transition shadow-2xs"
                        title="Delete this capability"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Capability</span>
                      </button>
                    )}

                    <a
                      href={getLivePreviewUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-800 hover:text-red-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
                      title="Preview Page"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-red-600" />
                      <span>Live Preview</span>
                    </a>

                    {/* Dedicated Save For This Active Service Discipline */}
                    <button
                      type="button"
                      onClick={handleSaveCurrentService}
                      disabled={saving}
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all duration-200 text-xs font-bold shadow-md shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                      title="Saves only this service so co-workers' work on other services is never overwritten"
                    >
                      {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      <span>Save This Service</span>
                    </button>
                  </div>
                </div>

                {/* Sub-Service & Capability Quick Switcher Bar */}
                {currentService && (currentService.subServices || []).length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3 text-xs border-b border-slate-200/80 custom-scrollbar">
                    <span className="font-bold text-slate-500 uppercase tracking-wider shrink-0 text-[10px]">
                      Quick Nav:
                    </span>
                    <button
                      onClick={() => {
                        setSelectedSubServiceIndex(null);
                        setSelectedChildServiceIndex(null);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
                        selectedSubServiceIndex === null
                          ? "bg-slate-900 text-white shadow-sm"
                          : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      ★ {currentService.title} (Main)
                    </button>
                    {(currentService.subServices || []).map((sub: any, sIdx: number) => (
                      <div key={sIdx} className="inline-flex items-center rounded-xl border border-slate-200/90 overflow-hidden shadow-2xs shrink-0 group">
                        <button
                          onClick={() => {
                            setSelectedSubServiceIndex(sIdx);
                            setSelectedChildServiceIndex(null);
                          }}
                          className={`px-3 py-1.5 font-bold transition flex items-center gap-1.5 ${
                            selectedSubServiceIndex === sIdx && selectedChildServiceIndex === null
                              ? "bg-gradient-to-r from-red-600 to-rose-600 text-white"
                              : "bg-white text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <span>#{sIdx + 1}: {sub.title}</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSubService(selectedServiceIndex!, sIdx);
                          }}
                          className={`px-2 py-1.5 transition border-l ${
                            selectedSubServiceIndex === sIdx && selectedChildServiceIndex === null
                              ? "bg-red-700 text-red-100 hover:bg-red-800 hover:text-white border-red-500"
                              : "bg-white text-slate-400 hover:text-red-600 hover:bg-red-50 border-slate-200"
                          }`}
                          title={`Delete sub-service "${sub.title}"`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* When Editing Level 2 or Level 3: Show Capability Switcher Pills */}
                {selectedSubServiceIndex !== null && currentSubService && (currentSubService.subServices || []).length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3 text-xs bg-purple-50/50 p-2.5 rounded-xl border border-purple-100 custom-scrollbar">
                    <span className="font-bold text-purple-900 uppercase tracking-wider shrink-0 text-[10px] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-600" /> Capabilities in {currentSubService.title}:
                    </span>
                    {(currentSubService.subServices || []).map((child: any, cIdx: number) => (
                      <div key={cIdx} className="inline-flex items-center rounded-xl border border-purple-200 overflow-hidden shadow-2xs shrink-0 group">
                        <button
                          onClick={() => {
                            setSelectedChildServiceIndex(cIdx);
                          }}
                          className={`px-3 py-1 text-[11px] font-bold transition flex items-center gap-1 ${
                            selectedChildServiceIndex === cIdx
                              ? "bg-gradient-to-r from-purple-700 to-indigo-700 text-white"
                              : "bg-white text-purple-900 hover:bg-purple-100"
                          }`}
                        >
                          <span>• {child.title}</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeChildService(selectedServiceIndex!, selectedSubServiceIndex!, cIdx);
                          }}
                          className={`px-2 py-1 transition border-l ${
                            selectedChildServiceIndex === cIdx
                              ? "bg-purple-800 text-purple-100 hover:bg-purple-900 hover:text-white border-purple-600"
                              : "bg-white text-purple-400 hover:text-red-600 hover:bg-red-50 border-purple-200"
                          }`}
                          title={`Delete capability "${child.title}"`}
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newId = `0${(currentSubService.subServices || []).length + 1}`;
                        addEntityArrayItem("subServices", {
                          id: newId,
                          title: "New Capability",
                          slug: `capability-${Date.now().toString().slice(-4)}`,
                          desc: "Description of the specialized execution package.",
                          tags: ["Saudi Standards", "Certified"],
                          image: "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=1000&auto=format&fit=crop"
                        });
                        setSelectedChildServiceIndex((currentSubService.subServices || []).length);
                      }}
                      className="px-2.5 py-1 rounded-xl text-[11px] font-bold text-purple-700 bg-white border border-dashed border-purple-300 hover:bg-purple-100 flex items-center gap-1 shrink-0 shadow-2xs"
                    >
                      <Plus className="w-3 h-3" /> Add Capability
                    </button>
                  </div>
                )}

                {/* Section Editor Navigation Tabs (Apple/Linear Segmented Control) */}
                <div className="bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 flex flex-wrap gap-1 mt-2">
                  {[
                    { id: "hero", label: "Hero Section", icon: Sparkles },
                    { id: "overview", label: "Overview", icon: Building2 },
                    { id: "subServices", label: isEditingChildService ? "Related Packages" : isEditingSubService ? "Capabilities" : "Sub-Services", icon: Layers },
                    { id: "whyChooseUs", label: "Why Best", icon: Award },
                    { id: "industries", label: "Industries", icon: Globe },
                    { id: "showcase", label: "Showcase Tabs", icon: Briefcase },
                    { id: "faqs", label: "FAQs", icon: HelpCircle },
                    { id: "cta", label: "CTA Section", icon: Megaphone },
                    { id: "seo", label: "SEO & Schema", icon: Search },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                          isActive
                            ? isEditingChildService 
                              ? "bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-md shadow-purple-600/20" 
                              : "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/20"
                            : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tab Form Contents */}
              <div className="p-6 md:p-8">
                {/* 1. HERO & BASIC TAB */}
                {activeTab === "hero" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-red-600" />
                      Hero & Basic Configuration ({activeEntity.title})
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          {isEditingChildService ? "Capability Title" : isEditingSubService ? "Sub-Service Title" : "Service Title"}
                        </label>
                        <input
                          type="text"
                          value={activeEntity.title || ""}
                          onChange={(e) => updateEntityField("title", e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          URL Slug / Identifier
                        </label>
                        <input
                          type="text"
                          value={activeEntity.slug || activeEntity.link || ""}
                          onChange={(e) => updateEntityField("slug", e.target.value)}
                          placeholder={
                            isEditingChildService
                              ? "e.g. earthworks"
                              : isEditingSubService
                              ? "e.g. civil-works"
                              : "/services/contracting-services"
                          }
                          className="w-full px-3 py-2 border rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Top Badge Category
                        </label>
                        <input
                          type="text"
                          value={activeEntity.badge || ""}
                          onChange={(e) => updateEntityField("badge", e.target.value)}
                          placeholder="e.g. CIVIL CONTRACTING · CAPABILITY"
                          className="w-full px-3 py-2 border rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Subtitle / Tagline
                        </label>
                        <input
                          type="text"
                          value={activeEntity.subtitle || ""}
                          onChange={(e) => updateEntityField("subtitle", e.target.value)}
                          placeholder="e.g. Turnkey Industrial & Civil Infrastructure in KSA"
                          className="w-full px-3 py-2 border rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* HERO IMAGE WITH DEVICE UPLOAD / MEDIA LIBRARY */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Hero Background Image
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={activeEntity.heroImage || activeEntity.image || ""}
                          onChange={(e) => updateEntityField("heroImage", e.target.value)}
                          className="flex-1 px-3 py-2 border rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                          placeholder="Image URL or uploaded path..."
                        />
                        <button
                          type="button"
                          onClick={() => openMediaPicker("root", "heroImage", activeEntity.heroImage || activeEntity.image || "")}
                          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition text-xs font-semibold shrink-0 shadow-sm"
                        >
                          <FolderOpen className="w-4 h-4 text-red-400" />
                          Device Upload / Media Library
                        </button>
                      </div>

                      {/* Optional Hero Image Alt Text */}
                      <div className="mt-2">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Hero Image Alt Tag (Optional for SEO / Accessibility)
                        </label>
                        <input
                          type="text"
                          value={activeEntity.heroImageAlt || ""}
                          onChange={(e) => updateEntityField("heroImageAlt", e.target.value)}
                          placeholder="e.g. Turnkey civil works contracting operations in Saudi Arabia"
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-red-500 outline-none bg-slate-50/50 focus:bg-white"
                        />
                      </div>

                      {(activeEntity.heroImage || activeEntity.image) && (
                        <div className="mt-2 relative w-full h-28 rounded-lg overflow-hidden border bg-slate-900">
                          <img 
                            src={activeEntity.heroImage || activeEntity.image} 
                            alt={activeEntity.heroImageAlt || "Hero Preview"} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Hero Watermark Text (Ghost Text Background)
                      </label>
                      <input
                        type="text"
                        value={activeEntity.heroWatermark || activeEntity.watermark || "BIC"}
                        onChange={(e) => updateEntityField("heroWatermark", e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                        placeholder="e.g. CONTRACTING, CIVIL, PIPING, EQUIPMENT"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Short Summary Description
                      </label>
                      <textarea
                        rows={2}
                        value={activeEntity.shortDesc || activeEntity.desc || ""}
                        onChange={(e) => updateEntityField("shortDesc", e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Full Detailed Description
                      </label>
                      <textarea
                        rows={4}
                        value={activeEntity.fullDesc || ""}
                        onChange={(e) => updateEntityField("fullDesc", e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                      />
                    </div>

                    {/* HERO RIGHT-SIDE TAGLINES */}
                    <div className="border-t pt-4">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Hero Right-Side Taglines (Up to 4 Highlights)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[0, 1, 2, 3].map((idx) => {
                          const currentTaglines = activeEntity.heroTaglines || [
                            "Certified Quality & Safety",
                            "Turnkey Execution Capabilities",
                            "24/7 Rapid Mobilization Support",
                            "Saudi Arabia KSA Wide Coverage"
                          ];
                          return (
                            <div key={idx}>
                              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                                Tagline #{idx + 1}
                              </label>
                              <input
                                type="text"
                                value={currentTaglines[idx] || ""}
                                onChange={(e) => {
                                  const updated = [...currentTaglines];
                                  updated[idx] = e.target.value;
                                  updateEntityField("heroTaglines", updated);
                                }}
                                className="w-full px-3 py-1.5 border rounded-lg text-sm text-slate-900 outline-none focus:ring-2 focus:ring-red-500 bg-white"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* HERO BOTTOM STATS BAR */}
                    <div className="border-t pt-4">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Hero Bottom Stats Bar (4 Metric Cards)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[0, 1, 2, 3].map((idx) => {
                          const currentStats = activeEntity.heroStats || [
                            { value: "150+", label: "Completed Projects" },
                            { value: "100%", label: "Aramco HSE Standards" },
                            { value: "24/7", label: "Turnaround Mobilization" },
                            { value: "ISO 9001", label: "Certified QA/QC" }
                          ];
                          const item = currentStats[idx] || { value: "", label: "" };
                          return (
                            <div key={idx} className="p-3 border rounded-lg bg-slate-50 space-y-2">
                              <span className="text-[11px] font-bold text-red-600">Hero Stat #{idx + 1}</span>
                              <div className="grid grid-cols-3 gap-2">
                                <div>
                                  <label className="block text-[10px] text-slate-500 uppercase font-semibold">Value</label>
                                  <input
                                    type="text"
                                    value={item.value || ""}
                                    onChange={(e) => {
                                      const updated = [...currentStats];
                                      updated[idx] = { ...item, value: e.target.value };
                                      updateEntityField("heroStats", updated);
                                    }}
                                    className="w-full px-2 py-1 border rounded text-xs text-slate-900 bg-white font-bold"
                                  />
                                </div>
                                <div className="col-span-2">
                                  <label className="block text-[10px] text-slate-500 uppercase font-semibold">Label</label>
                                  <input
                                    type="text"
                                    value={item.label || ""}
                                    onChange={(e) => {
                                      const updated = [...currentStats];
                                      updated[idx] = { ...item, label: e.target.value };
                                      updateEntityField("heroStats", updated);
                                    }}
                                    className="w-full px-2 py-1 border rounded text-xs text-slate-900 bg-white"
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. OVERVIEW SECTION TAB */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-red-600" />
                      Executive Overview Section
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Overview Section Badge
                        </label>
                        <input
                          type="text"
                          value={activeEntity.overview?.badge || "EXECUTIVE OVERVIEW"}
                          onChange={(e) => updateEntityNested("overview", "badge", e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Overview Section Title
                        </label>
                        <input
                          type="text"
                          value={activeEntity.overview?.title || ""}
                          onChange={(e) => updateEntityNested("overview", "title", e.target.value)}
                          placeholder="e.g. Turnkey Industrial Contracting Built For KSA Projects"
                          className="w-full px-3 py-2 border rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Description Paragraph 1 (Supports &lt;br&gt; or new lines)
                      </label>
                      <textarea
                        rows={3}
                        value={activeEntity.overview?.desc1 || ""}
                        onChange={(e) => updateEntityNested("overview", "desc1", e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Description Paragraph 2 (Supports &lt;br&gt; or new lines)
                      </label>
                      <textarea
                        rows={3}
                        value={activeEntity.overview?.desc2 || ""}
                        onChange={(e) => updateEntityNested("overview", "desc2", e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                      />
                    </div>

                    {/* OVERVIEW 4-IMAGE GALLERY SETUP */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Overview Gallery Images (4 Image Setup)
                          </label>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Provide up to 4 images for the interactive Overview showcase and thumbnail navigation.
                          </p>
                        </div>
                        <span className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                          4 Images Supported
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { key: "image", label: "Image 1 (Main Featured Overview)" },
                          { key: "image2", label: "Image 2 (Gallery Preview 2)" },
                          { key: "image3", label: "Image 3 (Gallery Preview 3)" },
                          { key: "image4", label: "Image 4 (Gallery Preview 4)" }
                        ].map((imgConfig, idx) => {
                          const imgKey = imgConfig.key;
                          const currentVal = activeEntity.overview?.[imgKey] || "";
                          return (
                            <div key={imgKey} className="p-3.5 border rounded-xl bg-slate-50/60 border-slate-200 space-y-2.5 shadow-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 text-[11px] font-bold flex items-center justify-center shrink-0">
                                    {idx + 1}
                                  </span>
                                  <span className="truncate">{imgConfig.label}</span>
                                </span>
                                {currentVal && (
                                  <button
                                    type="button"
                                    onClick={() => updateEntityNested("overview", imgKey, "")}
                                    className="text-[11px] text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 shrink-0 ml-2"
                                    title="Remove Image"
                                  >
                                    <Trash2 className="w-3 h-3" /> Clear
                                  </button>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={currentVal}
                                  onChange={(e) => updateEntityNested("overview", imgKey, e.target.value)}
                                  className="flex-1 px-3 py-1.5 border rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-red-500 outline-none bg-white font-mono"
                                  placeholder={idx === 0 ? "Main image URL or upload..." : `Image #${idx + 1} URL or upload...`}
                                />
                                <button
                                  type="button"
                                  onClick={() => openMediaPicker("nested", imgKey, currentVal, "overview")}
                                  className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition text-xs font-semibold shrink-0 shadow-xs"
                                  title="Open Media Library"
                                >
                                  <FolderOpen className="w-3.5 h-3.5 text-red-400" />
                                  <span>Upload</span>
                                </button>
                              </div>

                              {/* Optional Image Alt Tag */}
                              <div>
                                <input
                                  type="text"
                                  value={activeEntity.overview?.[`${imgKey}Alt`] || ""}
                                  onChange={(e) => updateEntityNested("overview", `${imgKey}Alt`, e.target.value)}
                                  className="w-full px-3 py-1 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-red-500 outline-none bg-white placeholder:text-slate-400"
                                  placeholder={`Image #${idx + 1} Alt Tag (Optional SEO & Accessibility)...`}
                                />
                              </div>

                              {currentVal ? (
                                <div className="relative w-full h-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 group">
                                  <img
                                    src={currentVal}
                                    alt={activeEntity.overview?.[`${imgKey}Alt`] || `Overview ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute top-1.5 right-1.5 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                    Thumb #{idx + 1}
                                  </div>
                                </div>
                              ) : (
                                <div className="h-14 rounded-lg border border-dashed border-slate-300 bg-slate-100/50 flex items-center justify-center text-slate-400 text-xs gap-1.5">
                                  <ImageIcon className="w-4 h-4 text-slate-400" />
                                  <span>No image set (Optional)</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t pt-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Stat Num
                        </label>
                        <input
                          type="text"
                          value={activeEntity.overview?.statNum || "250+"}
                          onChange={(e) => updateEntityNested("overview", "statNum", e.target.value)}
                          className="w-full px-2.5 py-2 border rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Stat Label
                        </label>
                        <input
                          type="text"
                          value={activeEntity.overview?.statLabel || "Projects Executed"}
                          onChange={(e) => updateEntityNested("overview", "statLabel", e.target.value)}
                          className="w-full px-2.5 py-2 border rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Stat Subtitle
                        </label>
                        <input
                          type="text"
                          value={activeEntity.overview?.statSub || "Across Saudi Arabia"}
                          onChange={(e) => updateEntityNested("overview", "statSub", e.target.value)}
                          className="w-full px-2.5 py-2 border rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Bullet Point Specifications (One per line)
                      </label>
                      <textarea
                        rows={4}
                        value={(activeEntity.overview?.specs || []).join("\n")}
                        onChange={(e) =>
                          updateEntityNested(
                            "overview",
                            "specs",
                            e.target.value.split("\n").filter((s) => s.trim().length > 0)
                          )
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                        placeholder="Saudi Aramco & SABIC Approved Contractor&#10;ISO 9001:2015 Certified"
                      />
                    </div>

                    {/* QA/QC STANDARDS & COMPLIANCE STRIP SETTINGS */}
                    <div className="p-4 rounded-xl border border-red-100 bg-red-50/40 space-y-3">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-red-600" />
                        <label className="block text-xs font-bold text-red-900 uppercase tracking-wider">
                          QA/QC Standards & Compliance Highlight Strip
                        </label>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Standards Strip Title
                        </label>
                        <input
                          type="text"
                          value={activeEntity.overview?.standardsTitle || "Saudi Aramco & Royal Commission Standards"}
                          onChange={(e) => updateEntityNested("overview", "standardsTitle", e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none bg-white"
                          placeholder="e.g. Saudi Aramco & Royal Commission Standards"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Standards Strip Description
                        </label>
                        <textarea
                          rows={2}
                          value={activeEntity.overview?.standardsDesc || "Our QA/QC procedures enforce rigid quality plans, non-destructive testing (NDT), hydro-testing, and complete safety documentation on every contract."}
                          onChange={(e) => updateEntityNested("overview", "standardsDesc", e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none bg-white"
                          placeholder="QA/QC compliance statement..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. SUB-SERVICES / CAPABILITIES SCROLLER TAB */}
                {activeTab === "subServices" && (
                  <div className="space-y-6">
                    {/* Section Header Controls */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 space-y-3">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        {isEditingChildService 
                          ? "Related Packages Header Text" 
                          : isEditingSubService 
                          ? "Capabilities & Packages Header Text" 
                          : "Sub-Services Section Header Text"}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Section Subtitle / Badge
                          </label>
                          <input
                            type="text"
                            value={activeEntity.subServicesBadge || (isEditingChildService ? "RELATED WORK PACKAGES" : isEditingSubService ? "SPECIALIZED WORK PACKAGES" : "SPECIALIZED CAPABILITIES")}
                            onChange={(e) => updateEntityField("subServicesBadge", e.target.value)}
                            className="w-full px-3 py-1.5 border rounded-lg text-sm text-slate-900 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Section Main Title
                          </label>
                          <input
                            type="text"
                            value={activeEntity.subServicesTitle || (isEditingChildService ? `Related ${currentSubService?.title || "Discipline"} Packages` : isEditingSubService ? `${activeEntity.title} Capabilities & Packages` : "Sub-Services & Contracting Packages")}
                            onChange={(e) => updateEntityField("subServicesTitle", e.target.value)}
                            className="w-full px-3 py-1.5 border rounded-lg text-sm text-slate-900 bg-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Section Description
                        </label>
                        <textarea
                          rows={2}
                          value={activeEntity.subServicesDesc || `Explore specialized execution packages and capabilities.`}
                          onChange={(e) => updateEntityField("subServicesDesc", e.target.value)}
                          className="w-full px-3 py-1.5 border rounded-lg text-sm text-slate-900 bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-b pb-2">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-red-600" />
                        {isEditingChildService ? "Related Package Cards" : isEditingSubService ? "Capability Cards" : "Sub-Services Cards"} ({activeEntity.subServices?.length || 0})
                      </h3>

                      <button
                        onClick={() =>
                          addEntityArrayItem("subServices", {
                            id: `0${(activeEntity.subServices?.length || 0) + 1}`,
                            title: isEditingSubService ? "New Capability Title" : "New Sub-Service Title",
                            desc: "Description of the specialized work package.",
                            tags: ["Saudi Standards", "Certified Crew"],
                            image: "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=1000&auto=format&fit=crop"
                          })
                        }
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        {isEditingChildService ? "Add Package" : isEditingSubService ? "Add Capability" : "Add Sub-Service"}
                      </button>
                    </div>

                    <div className="space-y-4">
                      {(activeEntity.subServices || []).map((sub: any, idx: number) => (
                        <div key={idx} className="p-4 border rounded-xl bg-slate-50 relative space-y-3 shadow-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                              #{idx + 1} ({sub.id || idx + 1}) - {sub.title}
                            </span>

                            <button
                              onClick={() => removeEntityArrayItem("subServices", idx)}
                              className="text-slate-400 hover:text-red-600 p-1"
                              title="Delete item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                Title
                              </label>
                              <input
                                type="text"
                                value={sub.title || ""}
                                onChange={(e) => updateEntityArrayItem("subServices", idx, "title", e.target.value)}
                                className="w-full px-3 py-1.5 border rounded-lg text-sm text-slate-900 bg-white font-semibold"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                Card Image & Alt Tag
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={sub.image || ""}
                                  onChange={(e) => updateEntityArrayItem("subServices", idx, "image", e.target.value)}
                                  className="flex-1 px-3 py-1.5 border rounded-lg text-sm text-slate-900 bg-white"
                                  placeholder="Image URL..."
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    openMediaPicker(
                                      "array",
                                      "image",
                                      sub.image || "",
                                      "subServices",
                                      idx
                                    )
                                  }
                                  className="px-2.5 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-medium hover:bg-slate-900"
                                >
                                  Browse
                                </button>
                              </div>
                              <input
                                type="text"
                                value={sub.imageAlt || ""}
                                onChange={(e) => updateEntityArrayItem("subServices", idx, "imageAlt", e.target.value)}
                                className="w-full mt-1.5 px-3 py-1 border border-slate-200 rounded-lg text-xs text-slate-800 bg-white placeholder:text-slate-400"
                                placeholder="Image Alt Tag (Optional for SEO)..."
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                              Description
                            </label>
                            <textarea
                              rows={2}
                              value={sub.desc || ""}
                              onChange={(e) => updateEntityArrayItem("subServices", idx, "desc", e.target.value)}
                              className="w-full px-3 py-1.5 border rounded-lg text-sm text-slate-900 bg-white"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                Tags (Comma separated)
                              </label>
                              <input
                                type="text"
                                value={Array.isArray(sub.tags) ? sub.tags.join(", ") : sub.tags || ""}
                                onChange={(e) =>
                                  updateEntityArrayItem(
                                    "subServices",
                                    idx,
                                    "tags",
                                    e.target.value.split(",").map((t) => t.trim()).filter((t) => t.length > 0)
                                  )
                                }
                                className="w-full px-3 py-1.5 border rounded-lg text-sm text-slate-900 bg-white"
                                placeholder="e.g. Earthworks, Saudi Standards"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                Custom Redirect / Slug
                              </label>
                              <input
                                type="text"
                                value={sub.link || sub.slug || ""}
                                onChange={(e) => updateEntityArrayItem("subServices", idx, "link", e.target.value)}
                                className="w-full px-3 py-1.5 border rounded-lg text-sm text-slate-900 bg-white font-mono"
                                placeholder="Auto-generated URL"
                              />
                            </div>
                          </div>

                          {/* ACTION BUTTON TO DIVE INTO LEVEL 2 (Sub-Service) OR LEVEL 3 (Capability) */}
                          {!isEditingSubService && !isEditingChildService && (
                            /* From Level 1: Edit Sub-Service */
                            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedSubServiceIndex(idx);
                                  setSelectedChildServiceIndex(null);
                                  setActiveTab("hero");
                                }}
                                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-600 hover:text-white transition text-xs font-bold shadow-sm"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                Edit Full Sub-Service Detail Page ({sub.title})
                              </button>

                              <a
                                href={getSubServiceUrl(currentService, sub)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-600 font-medium"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Preview Live Page</span>
                              </a>
                            </div>
                          )}

                          {isEditingSubService && !isEditingChildService && (
                            /* From Level 2: Edit Child Capability */
                            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedChildServiceIndex(idx);
                                  setActiveTab("hero");
                                }}
                                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-700 hover:text-white transition text-xs font-bold shadow-sm"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                Edit Full Capability Detail Page ({sub.title})
                              </button>

                              <a
                                href={getChildServiceUrl(currentService, currentSubService, sub)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-slate-500 hover:text-purple-700 font-medium"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Preview Live Page</span>
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. WHY CHOOSE US TAB */}
                {activeTab === "whyChooseUs" && (
                  <div className="space-y-6">
                    {/* Section Header Controls */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 space-y-3">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Why Best Section Header Text
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Section Subtitle / Badge
                          </label>
                          <input
                            type="text"
                            value={activeEntity.whyChooseUsBadge || "WHY BEST INTERNATIONAL"}
                            onChange={(e) => updateEntityField("whyChooseUsBadge", e.target.value)}
                            className="w-full px-3 py-1.5 border rounded-lg text-sm text-slate-900 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Section Main Title
                          </label>
                          <input
                            type="text"
                            value={activeEntity.whyChooseUsTitle || `Why Choose BIC for ${activeEntity.title}?`}
                            onChange={(e) => updateEntityField("whyChooseUsTitle", e.target.value)}
                            className="w-full px-3 py-1.5 border rounded-lg text-sm text-slate-900 bg-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Section Description
                        </label>
                        <textarea
                          rows={2}
                          value={activeEntity.whyChooseUsDesc || "We eliminate project risks by combining heavy equipment independence, Saudi Aramco certified supervisors, and strict QA/QC compliance."}
                          onChange={(e) => updateEntityField("whyChooseUsDesc", e.target.value)}
                          className="w-full px-3 py-1.5 border rounded-lg text-sm text-slate-900 bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-b pb-2">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Award className="w-5 h-5 text-red-600" />
                        Why We Are the Best Choice Cards ({activeEntity.whyChooseUs?.length || 0})
                      </h3>

                      <button
                        onClick={() =>
                          addEntityArrayItem("whyChooseUs", {
                            id: `0${(activeEntity.whyChooseUs?.length || 0) + 1}`,
                            title: "New Feature Title",
                            desc: "Detailed explanation of why we excel in this area.",
                            image: "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=800&auto=format&fit=crop"
                          })
                        }
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Card
                      </button>
                    </div>

                    <div className="space-y-4">
                      {(activeEntity.whyChooseUs || []).map((card: any, idx: number) => (
                        <div key={idx} className="p-4 border rounded-xl bg-slate-50 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                              Card #{idx + 1}
                            </span>
                            <button
                              onClick={() => removeEntityArrayItem("whyChooseUs", idx)}
                              className="text-slate-400 hover:text-red-600 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                Card Title
                              </label>
                              <input
                                type="text"
                                value={card.title || ""}
                                onChange={(e) => updateEntityArrayItem("whyChooseUs", idx, "title", e.target.value)}
                                className="w-full px-3 py-1.5 border rounded-lg text-sm text-slate-900 bg-white"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                Card Image & Alt Tag
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={card.image || ""}
                                  onChange={(e) => updateEntityArrayItem("whyChooseUs", idx, "image", e.target.value)}
                                  className="flex-1 px-3 py-1.5 border rounded-lg text-sm text-slate-900 bg-white"
                                  placeholder="Image URL..."
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    openMediaPicker(
                                      "array",
                                      "image",
                                      card.image || "",
                                      "whyChooseUs",
                                      idx
                                    )
                                  }
                                  className="px-2.5 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-medium hover:bg-slate-900"
                                >
                                  Browse
                                </button>
                              </div>
                              <input
                                type="text"
                                value={card.imageAlt || ""}
                                onChange={(e) => updateEntityArrayItem("whyChooseUs", idx, "imageAlt", e.target.value)}
                                className="w-full mt-1.5 px-3 py-1 border border-slate-200 rounded-lg text-xs text-slate-800 bg-white placeholder:text-slate-400"
                                placeholder="Image Alt Tag (Optional for SEO)..."
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                              Card Description
                            </label>
                            <textarea
                              rows={2}
                              value={card.desc || ""}
                              onChange={(e) => updateEntityArrayItem("whyChooseUs", idx, "desc", e.target.value)}
                              className="w-full px-3 py-1.5 border rounded-lg text-sm text-slate-900 bg-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. INDUSTRIES WE SERVE TAB */}
                {activeTab === "industries" && (
                  <div className="space-y-6">
                    {/* Section Header Controls */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 space-y-3">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Industries Section Header Text
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Section Subtitle / Badge
                          </label>
                          <input
                            type="text"
                            value={activeEntity.industriesBadge || "INDUSTRIES WE SERVE"}
                            onChange={(e) => updateEntityField("industriesBadge", e.target.value)}
                            className="w-full px-3 py-1.5 border rounded-lg text-sm text-slate-900 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Section Main Title
                          </label>
                          <input
                            type="text"
                            value={activeEntity.industriesTitle || `Industries Powered by Our ${activeEntity.title}`}
                            onChange={(e) => updateEntityField("industriesTitle", e.target.value)}
                            className="w-full px-3 py-1.5 border rounded-lg text-sm text-slate-900 bg-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Section Description
                        </label>
                        <textarea
                          rows={2}
                          value={activeEntity.industriesDesc || `Delivering integrated industrial solutions for diverse sectors across Saudi Arabia.`}
                          onChange={(e) => updateEntityField("industriesDesc", e.target.value)}
                          className="w-full px-3 py-1.5 border rounded-lg text-sm text-slate-900 bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-b pb-2">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-red-600" />
                        Industries We Serve ({activeEntity.industries?.length || 0})
                      </h3>

                      <button
                        onClick={() =>
                          addEntityArrayItem("industries", {
                            id: `0${(activeEntity.industries?.length || 0) + 1}`,
                            name: "New Industry Name",
                            desc: "Specialized contracting and industrial solutions tailored for this sector.",
                            image: "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=800&auto=format&fit=crop"
                          })
                        }
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Industry
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(activeEntity.industries || []).map((ind: any, idx: number) => (
                        <div key={idx} className="p-4 border rounded-xl bg-slate-50 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-600">Industry #{idx + 1}</span>
                            <button
                              onClick={() => removeEntityArrayItem("industries", idx)}
                              className="text-slate-400 hover:text-red-600 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                              Industry Name
                            </label>
                            <input
                              type="text"
                              value={ind.name || ind.title || ""}
                              onChange={(e) => updateEntityArrayItem("industries", idx, "name", e.target.value)}
                              className="w-full px-3 py-1.5 border rounded-lg text-sm text-slate-900 bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                              Short Description
                            </label>
                            <textarea
                              rows={2}
                              value={ind.desc || ""}
                              onChange={(e) => updateEntityArrayItem("industries", idx, "desc", e.target.value)}
                              className="w-full px-3 py-1.5 border rounded-lg text-sm text-slate-900 bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                              Image URL & Alt Tag
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={ind.image || ""}
                                onChange={(e) => updateEntityArrayItem("industries", idx, "image", e.target.value)}
                                className="flex-1 px-3 py-1.5 border rounded-lg text-sm text-slate-900 bg-white"
                                placeholder="Image URL..."
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  openMediaPicker(
                                    "array",
                                    "image",
                                    ind.image || "",
                                    "industries",
                                    idx
                                  )
                                }
                                className="px-2.5 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-medium hover:bg-slate-900"
                              >
                                Browse
                              </button>
                            </div>
                            <input
                              type="text"
                              value={ind.imageAlt || ""}
                              onChange={(e) => updateEntityArrayItem("industries", idx, "imageAlt", e.target.value)}
                              className="w-full mt-1.5 px-3 py-1 border border-slate-200 rounded-lg text-xs text-slate-800 bg-white placeholder:text-slate-400"
                              placeholder="Image Alt Tag (Optional for SEO)..."
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. SHOWCASE TABS SECTION */}
                {activeTab === "showcase" && (
                  <div className="space-y-6">
                    {/* Section Header Controls */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 space-y-3">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Showcase Section Header Text
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Section Subtitle / Badge
                          </label>
                          <input
                            type="text"
                            value={activeEntity.showcaseBadge || "DETAILED EXECUTION"}
                            onChange={(e) => updateEntityField("showcaseBadge", e.target.value)}
                            className="w-full px-3 py-1.5 border rounded-lg text-sm text-slate-900 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Section Main Title
                          </label>
                          <input
                            type="text"
                            value={activeEntity.showcaseTitle || `Comprehensive ${activeEntity.title} Execution Framework`}
                            onChange={(e) => updateEntityField("showcaseTitle", e.target.value)}
                            className="w-full px-3 py-1.5 border rounded-lg text-sm text-slate-900 bg-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Section Description
                        </label>
                        <textarea
                          rows={2}
                          value={activeEntity.showcaseDesc || `From pre-planning to field execution and quality sign-off, we provide complete lifecycle delivery.`}
                          onChange={(e) => updateEntityField("showcaseDesc", e.target.value)}
                          className="w-full px-3 py-1.5 border rounded-lg text-sm text-slate-900 bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-b pb-2">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-red-600" />
                        Showcase Interactive Tabs ({activeEntity.showcaseTabs?.length || 0})
                      </h3>

                      <button
                        onClick={() =>
                          addEntityArrayItem("showcaseTabs", {
                            id: `tab-${(activeEntity.showcaseTabs?.length || 0) + 1}`,
                            name: "New Tab Title",
                            title: "Detailed Framework Title",
                            badge: "SPECIALIZED CAPABILITY",
                            desc: "Comprehensive description of capabilities and workflows.",
                            image: "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=1000&auto=format&fit=crop",
                            features: ["Key Deliverable 1", "Key Deliverable 2", "QA/QC Inspection"],
                            stats: { num: "100%", label: "Standard Compliance" }
                          })
                        }
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Showcase Tab
                      </button>
                    </div>

                    <div className="space-y-6">
                      {(activeEntity.showcaseTabs || []).map((tab: any, idx: number) => (
                        <div key={idx} className="p-5 border rounded-xl bg-slate-50 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                              Tab #{idx + 1}: {tab.name || tab.title}
                            </span>
                            <button
                              onClick={() => removeEntityArrayItem("showcaseTabs", idx)}
                              className="text-slate-400 hover:text-red-600 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                Tab Button Label
                              </label>
                              <input
                                type="text"
                                value={tab.name || tab.title || ""}
                                onChange={(e) => updateEntityArrayItem("showcaseTabs", idx, "name", e.target.value)}
                                className="w-full px-3 py-1.5 border rounded-lg text-sm text-slate-900 bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                Inner Content Title
                              </label>
                              <input
                                type="text"
                                value={tab.title || ""}
                                onChange={(e) => updateEntityArrayItem("showcaseTabs", idx, "title", e.target.value)}
                                className="w-full px-3 py-1.5 border rounded-lg text-sm text-slate-900 bg-white"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">
                              Tab Content & Description (Rich Text & Headings)
                            </label>
                            <ClassicRichEditor
                              value={tab.desc || ""}
                              onChange={(val) => updateEntityArrayItem("showcaseTabs", idx, "desc", val)}
                              rows={8}
                              placeholder="Write detailed paragraphs, headings with '### Title', bullet points with '- Point', or bold with '**text**'..."
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                              Showcase Image & Alt Tag
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={tab.image || ""}
                                onChange={(e) => updateEntityArrayItem("showcaseTabs", idx, "image", e.target.value)}
                                className="flex-1 px-3 py-1.5 border rounded-lg text-sm text-slate-900 bg-white"
                                placeholder="Image URL..."
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  openMediaPicker(
                                    "array",
                                    "image",
                                    tab.image || "",
                                    "showcaseTabs",
                                    idx
                                  )
                                }
                                className="px-2.5 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-medium hover:bg-slate-900"
                              >
                                Browse
                              </button>
                            </div>
                            <input
                              type="text"
                              value={tab.imageAlt || ""}
                              onChange={(e) => updateEntityArrayItem("showcaseTabs", idx, "imageAlt", e.target.value)}
                              className="w-full mt-1.5 px-3 py-1 border border-slate-200 rounded-lg text-xs text-slate-800 bg-white placeholder:text-slate-400"
                              placeholder="Image Alt Tag (Optional for SEO)..."
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                              Features Checklist (One per line)
                            </label>
                            <textarea
                              rows={3}
                              value={(tab.features || []).join("\n")}
                              onChange={(e) =>
                                updateEntityArrayItem(
                                  "showcaseTabs",
                                  idx,
                                  "features",
                                  e.target.value.split("\n").filter((s) => s.trim().length > 0)
                                )
                              }
                              className="w-full px-3 py-1.5 border rounded-lg text-sm text-slate-900 bg-white"
                              placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. FAQS TAB */}
                {activeTab === "faqs" && (
                  <div className="space-y-6">
                    {/* Section Header Controls */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 space-y-3">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        FAQs Section Header Text
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Section Subtitle / Badge
                          </label>
                          <input
                            type="text"
                            value={activeEntity.faqsBadge || "FREQUENTLY ASKED QUESTIONS"}
                            onChange={(e) => updateEntityField("faqsBadge", e.target.value)}
                            className="w-full px-3 py-1.5 border rounded-lg text-sm text-slate-900 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Section Main Title
                          </label>
                          <input
                            type="text"
                            value={activeEntity.faqsTitle || `Common Questions About ${activeEntity.title}`}
                            onChange={(e) => updateEntityField("faqsTitle", e.target.value)}
                            className="w-full px-3 py-1.5 border rounded-lg text-sm text-slate-900 bg-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Section Description
                        </label>
                        <textarea
                          rows={2}
                          value={activeEntity.faqsDesc || `Clear answers regarding our workflows, site access, and project deliverables.`}
                          onChange={(e) => updateEntityField("faqsDesc", e.target.value)}
                          className="w-full px-3 py-1.5 border rounded-lg text-sm text-slate-900 bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-b pb-2">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-red-600" />
                        Questions & Answers ({activeEntity.faqs?.length || 0})
                      </h3>

                      <button
                        onClick={() =>
                          addEntityArrayItem("faqs", {
                            id: `0${(activeEntity.faqs?.length || 0) + 1}`,
                            q: "What is the typical turnaround or mobilization timeframe?",
                            a: "Depending on the location in Saudi Arabia, our teams can mobilize within 24 to 72 hours."
                          })
                        }
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Question
                      </button>
                    </div>

                    <div className="space-y-4">
                      {(activeEntity.faqs || []).map((faq: any, idx: number) => (
                        <div key={idx} className="p-4 border rounded-xl bg-slate-50 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                              Question #{idx + 1}
                            </span>
                            <button
                              onClick={() => removeEntityArrayItem("faqs", idx)}
                              className="text-slate-400 hover:text-red-600 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                              Question
                            </label>
                            <input
                              type="text"
                              value={faq.q || ""}
                              onChange={(e) => updateEntityArrayItem("faqs", idx, "q", e.target.value)}
                              className="w-full px-3 py-1.5 border rounded-lg text-sm text-slate-900 bg-white font-semibold"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                              Answer
                            </label>
                            <textarea
                              rows={3}
                              value={faq.a || ""}
                              onChange={(e) => updateEntityArrayItem("faqs", idx, "a", e.target.value)}
                              className="w-full px-3 py-1.5 border rounded-lg text-sm text-slate-900 bg-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 8. CTA SECTION TAB */}
                {activeTab === "cta" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                      <Megaphone className="w-5 h-5 text-red-600" />
                      Bottom Call-to-Action (CTA) Banner
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          CTA Badge Text
                        </label>
                        <input
                          type="text"
                          value={activeEntity.cta?.badge || "READY TO EXECUTE YOUR PROJECT?"}
                          onChange={(e) => updateEntityNested("cta", "badge", e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          CTA Title
                        </label>
                        <input
                          type="text"
                          value={activeEntity.cta?.title || `Need Reliable ${activeEntity.title} for Your Next Project?`}
                          onChange={(e) => updateEntityNested("cta", "title", e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        CTA Description
                      </label>
                      <textarea
                        rows={3}
                        value={activeEntity.cta?.desc || "Get in touch with Best International Contracting Company to discuss project specifications, schedule site visits, or request technical proposals."}
                        onChange={(e) => updateEntityNested("cta", "desc", e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Primary Button Text
                        </label>
                        <input
                          type="text"
                          value={activeEntity.cta?.buttonText || activeEntity.cta?.primaryBtnText || "Request Technical Proposal"}
                          onChange={(e) => updateEntityNested("cta", "buttonText", e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Primary Button Link
                        </label>
                        <input
                          type="text"
                          value={activeEntity.cta?.buttonLink || "/contact-us"}
                          onChange={(e) => updateEntityNested("cta", "buttonLink", e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 9. SEO & METADATA TAB */}
                {activeTab === "seo" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                      <Search className="w-5 h-5 text-red-600" />
                      Search Engine Optimization (SEO) & Structured Data
                    </h3>

                    {/* Meta Title */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                          SEO Meta Title (Browser & Search Snippet)
                        </label>
                        <span
                          className={`text-xs font-mono font-medium ${
                            (activeEntity.metaTitle || "").length > 60
                              ? "text-amber-600"
                              : "text-slate-400"
                          }`}
                        >
                          {(activeEntity.metaTitle || "").length} / 60 chars
                        </span>
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. Civil Works Contracting Saudi Arabia | Best International"
                        value={activeEntity.metaTitle || ""}
                        onChange={(e) => updateEntityField("metaTitle", e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        Optimal length: 50-60 characters. Recommended format: [Specific Service] in Saudi Arabia | Best International
                      </p>
                    </div>

                    {/* Meta Description */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                          SEO Meta Description
                        </label>
                        <span
                          className={`text-xs font-mono font-medium ${
                            (activeEntity.metaDescription || "").length > 160
                              ? "text-amber-600"
                              : "text-slate-400"
                          }`}
                        >
                          {(activeEntity.metaDescription || "").length} / 160 chars
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        placeholder="Summary of this service for Google search results..."
                        value={activeEntity.metaDescription || ""}
                        onChange={(e) => updateEntityField("metaDescription", e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                      />
                    </div>

                    {/* Focus Keyword */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                        Focus Keyword / Search Query
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. civil contracting saudi arabia"
                        value={activeEntity.focusKeyword || ""}
                        onChange={(e) => updateEntityField("focusKeyword", e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                      />
                    </div>

                    {/* Canonical URL */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                        Canonical URL Override (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="https://bestinternational.com.sa/services/..."
                        value={activeEntity.canonicalUrl || ""}
                        onChange={(e) => updateEntityField("canonicalUrl", e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none font-mono"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        Leave blank to automatically use the page URL.
                      </p>
                    </div>

                    {/* OpenGraph / Social Share Image */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                        Social Share & OpenGraph Image (1200x630)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="/uploads/og-image.jpg or https://..."
                          value={activeEntity.ogImage || ""}
                          onChange={(e) => updateEntityField("ogImage", e.target.value)}
                          className="flex-1 px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => openMediaPicker("root", "ogImage", activeEntity.ogImage || "")}
                          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition text-xs font-semibold shrink-0 shadow-sm"
                        >
                          <FolderOpen className="w-4 h-4 text-red-400" />
                          Device Upload / Media Library
                        </button>
                      </div>
                      <div className="mt-2">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                          OG Image Alt Text (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Best International Contracting - Turnkey Industrial Services"
                          value={activeEntity.ogImageAlt || ""}
                          onChange={(e) => updateEntityField("ogImageAlt", e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-xs text-slate-900 focus:ring-1 focus:ring-red-500 outline-none"
                        />
                      </div>
                      {activeEntity.ogImage && (
                        <div className="mt-3 relative w-48 h-28 rounded-lg overflow-hidden border bg-slate-100">
                          <img
                            src={activeEntity.ogImage}
                            alt={activeEntity.ogImageAlt || "Social Share Preview"}
                            className="w-full h-full object-cover"
                            onError={(e: any) => {
                              e.target.src = "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=600";
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* LIVE GOOGLE SEARCH SERP PREVIEW */}
                    <div className="pt-4 border-t border-slate-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <Search className="w-4 h-4 text-blue-600" />
                          Live Google Search (SERP) Preview
                        </h4>
                        <span className="text-[11px] text-slate-500 font-medium">Desktop & Mobile snippet</span>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <div className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-[9px]">
                            B
                          </div>
                          <span className="font-medium text-slate-800">Best International Contracting</span>
                          <span className="text-slate-400">›</span>
                          <span className="text-slate-500 truncate">
                            https://bestinternational.com.sa{getLivePreviewUrl()}
                          </span>
                        </div>

                        <div className="text-lg text-[#1a0dab] hover:underline font-medium cursor-pointer leading-snug">
                          {activeEntity.metaTitle || `${activeEntity.title} | Best International Contracting Saudi Arabia`}
                        </div>

                        <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                          {activeEntity.metaDescription ||
                            activeEntity.shortDesc ||
                            activeEntity.desc ||
                            "Comprehensive industrial and contracting solutions executed to Saudi Aramco and global standards across Saudi Arabia."}
                        </p>
                      </div>
                    </div>

                    {/* SCHEMA.ORG STRUCTURED DATA INSPECTOR */}
                    <div className="pt-4 border-t border-slate-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Code className="w-4 h-4 text-emerald-600" />
                            Schema.org JSON-LD Structured Data
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Auto-generated rich snippet schema for Google search rich results.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const schemaData = {
                              "@context": "https://schema.org",
                              "@type": "Service",
                              name: activeEntity.title,
                              description: activeEntity.shortDesc || activeEntity.desc || activeEntity.fullDesc,
                              url: `https://bestinternational.com.sa${getLivePreviewUrl()}`,
                              provider: {
                                "@type": "GeneralContractor",
                                name: "Best International Contracting Company",
                                url: "https://bestinternational.com.sa"
                              },
                              areaServed: "Saudi Arabia"
                            };
                            navigator.clipboard.writeText(JSON.stringify(schemaData, null, 2));
                            setCopiedSchema(true);
                            setTimeout(() => setCopiedSchema(false), 2500);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition shadow-sm"
                        >
                          {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedSchema ? "Copied JSON-LD!" : "Copy Schema"}
                        </button>
                      </div>

                      {/* Detected Schema Badges */}
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-semibold">
                          <Check className="w-3 h-3 text-emerald-600" />
                          Service Schema (Active)
                        </span>

                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-semibold">
                          <Check className="w-3 h-3 text-emerald-600" />
                          FAQPage Schema ({Array.isArray(activeEntity.faqs) ? activeEntity.faqs.length : 0} Questions)
                        </span>

                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-semibold">
                          <Check className="w-3 h-3 text-emerald-600" />
                          BreadcrumbList Schema (Active)
                        </span>

                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-semibold">
                          <Check className="w-3 h-3 text-emerald-600" />
                          Organization Provider (Active)
                        </span>
                      </div>

                      {/* Optional Custom Schema JSON-LD Override */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                          Custom Schema JSON-LD Override (Optional)
                        </label>
                        <textarea
                          rows={4}
                          placeholder='{"@context": "https://schema.org", "@type": "CustomType", ...}'
                          value={activeEntity.customSchema || ""}
                          onChange={(e) => updateEntityField("customSchema", e.target.value)}
                          className="w-full px-3.5 py-2.5 font-mono text-xs border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-red-500 outline-none bg-slate-50"
                        />
                        <p className="text-[11px] text-slate-500 mt-1">
                          Leave blank to use the automated Schema.org markup.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Sticky Action Bar */}
                <div className="sticky bottom-0 -mx-6 md:-mx-8 -mb-6 md:-mb-8 mt-10 p-4 sm:p-5 bg-white/95 backdrop-blur-md border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg z-20">
                  <div className="text-xs text-slate-500 font-medium">
                    Editing: <strong className="text-slate-800">{activeEntity.title}</strong>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Primary Button: Save ONLY This Service */}
                    <button
                      type="button"
                      onClick={handleSaveCurrentService}
                      disabled={saving}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                      title="Saves only this service so co-workers' work on other services is never overwritten"
                    >
                      {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      <span>{saving ? "Saving..." : `Save "${currentService?.title || 'This Service'}"`}</span>
                    </button>

                    {/* Secondary Button: Save All */}
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                      title="Saves all disciplines together"
                    >
                      <span>Save All</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border p-12 text-center text-slate-500">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-semibold text-lg text-slate-700">No service selected</p>
              <p className="text-sm mt-1">Select a service from the left menu or create a new one.</p>
            </div>
          )}
        </div>
      </div>

      {/* Media Library Modal Popup */}
      <MediaLibraryModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelectImage={handleMediaSelect}
        currentImageUrl={mediaTarget?.currentValue || ""}
      />
    </div>
  );
}
