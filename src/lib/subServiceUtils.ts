export function slugify(text: string): string {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getParentServiceSlug(parentService: any): string {
  if (!parentService) return "";
  if (parentService.slug) {
    const sClean = parentService.slug.toLowerCase().trim().replace(/^\/+|\/+$/g, "");
    if (sClean.startsWith("services/")) return sClean.replace(/^services\//, "");
    if (sClean.length > 0) return sClean;
  }
  if (parentService.id) {
    const idClean = parentService.id.toLowerCase().trim().replace(/^\/+|\/+$/g, "");
    if (idClean.startsWith("services/")) return idClean.replace(/^services\//, "");
    if (idClean.length > 0) return idClean;
  }
  return slugify(parentService.title || "service");
}

export function getSubServiceSlug(sub: any): string {
  if (!sub) return "";
  if (sub.slug) {
    const clean = sub.slug.toLowerCase().trim().replace(/^\/+|\/+$/g, "");
    const parts = clean.split("/");
    return parts[parts.length - 1];
  }
  if (sub.link && !sub.link.startsWith("http") && !sub.link.startsWith("#")) {
    const clean = sub.link.toLowerCase().trim().replace(/^\/+|\/+$/g, "");
    const parts = clean.split("/");
    return parts[parts.length - 1];
  }
  if (sub.title) {
    return slugify(sub.title);
  }
  if (sub.id) {
    return slugify(sub.id);
  }
  return "sub-service";
}

export function getChildServiceSlug(child: any): string {
  if (!child) return "";
  if (child.slug) {
    const clean = child.slug.toLowerCase().trim().replace(/^\/+|\/+$/g, "");
    const parts = clean.split("/");
    return parts[parts.length - 1];
  }
  if (child.link && !child.link.startsWith("http") && !child.link.startsWith("#")) {
    const clean = child.link.toLowerCase().trim().replace(/^\/+|\/+$/g, "");
    const parts = clean.split("/");
    return parts[parts.length - 1];
  }
  if (child.title) {
    return slugify(child.title);
  }
  if (child.id) {
    return slugify(child.id);
  }
  return "capability";
}

export function getSubServiceUrl(parentService: any, sub: any): string {
  if (!sub) return "#";
  if (sub.link && (sub.link.startsWith("http://") || sub.link.startsWith("https://") || sub.link.startsWith("/contact"))) {
    return sub.link;
  }
  
  // If parentService is already a Sub-Service (has parentSlug or rootParentSlug), link to level 3
  if (parentService?.parentSlug && parentService?.id) {
    const rootSlug = parentService.parentSlug;
    const subSlug = getSubServiceSlug(parentService);
    const childSlug = getChildServiceSlug(sub);
    return `/services/${rootSlug}/${subSlug}/${childSlug}`;
  }

  const pSlug = getParentServiceSlug(parentService);
  const sSlug = getSubServiceSlug(sub);
  return `/services/${pSlug}/${sSlug}`;
}

export function getChildServiceUrl(parentService: any, subService: any, child: any): string {
  if (!child) return "#";
  if (child.link && (child.link.startsWith("http://") || child.link.startsWith("https://") || child.link.startsWith("/contact"))) {
    return child.link;
  }
  const pSlug = getParentServiceSlug(parentService);
  const sSlug = getSubServiceSlug(subService);
  const cSlug = getChildServiceSlug(child);
  return `/services/${pSlug}/${sSlug}/${cSlug}`;
}

export function findSubService(parentService: any, rawSubSlug: string) {
  if (!parentService || !parentService.subServices || !rawSubSlug) return null;
  const target = decodeURIComponent(rawSubSlug).toLowerCase().trim().replace(/^\/+|\/+$/g, "");
  const targetLast = target.split("/").pop() || target;

  return parentService.subServices.find((sub: any) => {
    const sSlug = getSubServiceSlug(sub);
    const subId = (sub.id || "").toString().toLowerCase().trim();
    const subTitleSlug = slugify(sub.title || "");
    const subLink = (sub.link || "").toLowerCase().trim().replace(/^\/+|\/+$/g, "");
    const subLinkLast = subLink.split("/").pop() || subLink;

    return (
      sSlug === targetLast ||
      subId === targetLast ||
      subTitleSlug === targetLast ||
      subLink === targetLast ||
      subLinkLast === targetLast
    );
  });
}

export function findChildService(subService: any, rawChildSlug: string) {
  if (!subService || !rawChildSlug) return null;
  const capabilities = subService.subServices && subService.subServices.length > 0 
    ? subService.subServices 
    : (subService.tags && subService.tags.length > 0
        ? subService.tags.map((tag: string, idx: number) => ({
            id: `0${idx + 1}`,
            title: tag,
            desc: `Specialized ${tag.toLowerCase()} execution delivered with certified crews and modern equipment across Saudi Arabia.`,
            tags: [tag, "KSA Standards"],
            image: subService.image || "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=1000&auto=format&fit=crop"
          }))
        : []);

  const target = decodeURIComponent(rawChildSlug).toLowerCase().trim().replace(/^\/+|\/+$/g, "");
  const targetLast = target.split("/").pop() || target;

  return capabilities.find((child: any) => {
    const cSlug = getChildServiceSlug(child);
    const childId = (child.id || "").toString().toLowerCase().trim();
    const childTitleSlug = slugify(child.title || "");
    const childLink = (child.link || "").toLowerCase().trim().replace(/^\/+|\/+$/g, "");
    const childLinkLast = childLink.split("/").pop() || childLink;

    return (
      cSlug === targetLast ||
      childId === targetLast ||
      childTitleSlug === targetLast ||
      childLink === targetLast ||
      childLinkLast === targetLast
    );
  });
}

export function buildCompleteSubServiceData(parentService: any, sub: any) {
  if (!sub) return null;

  const parentSlug = getParentServiceSlug(parentService);
  const subSlug = getSubServiceSlug(sub);
  const subUrl = `/services/${parentSlug}/${subSlug}`;

  // Resolve subServices: if explicitly defined, respect it (even if empty).
  // If undefined and tags exist, map tags.
  let resolvedSubServices: any[] = [];
  if (Array.isArray(sub.subServices)) {
    resolvedSubServices = sub.subServices;
  } else if (Array.isArray(sub.tags) && sub.tags.length > 0) {
    resolvedSubServices = sub.tags.map((tag: string, idx: number) => ({
      id: `0${idx + 1}`,
      title: tag,
      desc: `Specialized ${tag.toLowerCase()} execution delivered with certified crews and modern equipment across Saudi Arabia.`,
      tags: [tag, "KSA Standards"],
      image: sub.image || parentService?.heroImage || "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=1000&auto=format&fit=crop"
    }));
  }

  // Resolve whyChooseUs: if explicitly defined, use it. If undefined, empty array.
  const resolvedWhyChooseUs = Array.isArray(sub.whyChooseUs)
    ? sub.whyChooseUs
    : [];

  // Resolve industries: if explicitly defined, use it. If undefined, empty array.
  const resolvedIndustries = Array.isArray(sub.industries)
    ? sub.industries
    : [];

  // Resolve showcaseTabs: if explicitly defined, use it. If undefined, empty.
  const resolvedShowcaseTabs = Array.isArray(sub.showcaseTabs)
    ? sub.showcaseTabs
    : [];

  // Resolve faqs: if explicitly defined, use it. If undefined, empty.
  const resolvedFaqs = Array.isArray(sub.faqs)
    ? sub.faqs
    : [];

  // Resolve overview: only return if it has actual content
  const resolvedOverview = sub.overview && (
    sub.overview.title ||
    sub.overview.desc1 ||
    sub.overview.desc2 ||
    (Array.isArray(sub.overview.specs) && sub.overview.specs.length > 0) ||
    sub.overview.image ||
    sub.overview.image2 ||
    sub.overview.image3 ||
    sub.overview.image4
  ) ? sub.overview : null;

  // Resolve CTA: only return if it has actual content
  const resolvedCta = sub.cta && (
    sub.cta.title ||
    sub.cta.desc ||
    sub.cta.buttonText ||
    sub.cta.primaryBtnText
  ) ? sub.cta : null;

  return {
    id: sub.id || subSlug,
    parentId: parentService?.id,
    parentTitle: parentService?.title,
    parentSlug: parentSlug,
    title: sub.title,
    slug: subUrl,
    badge: sub.badge || `${sub.title.toUpperCase()} · CAPABILITY`,
    subtitle: sub.subtitle || `${sub.title} Services in Saudi Arabia`,
    shortDesc: sub.shortDesc || sub.desc || `Professional ${sub.title.toLowerCase()} tailored for industrial and infrastructure facilities across Saudi Arabia.`,
    fullDesc: sub.fullDesc || sub.shortDesc || sub.desc || "",
    heroImage: sub.heroImage || sub.image || parentService?.heroImage || "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=2070&auto=format&fit=crop",
    heroWatermark: sub.heroWatermark || sub.watermark || "BIC",
    heroTaglines: Array.isArray(sub.heroTaglines) ? sub.heroTaglines : (Array.isArray(parentService?.heroTaglines) ? parentService.heroTaglines : []),
    heroStats: Array.isArray(sub.heroStats) ? sub.heroStats : (Array.isArray(parentService?.heroStats) ? parentService.heroStats : []),
    overview: resolvedOverview,
    subServicesBadge: sub.subServicesBadge || "SPECIALIZED WORK PACKAGES",
    subServicesTitle: sub.subServicesTitle || `${sub.title} Capabilities & Packages`,
    subServicesDesc: sub.subServicesDesc || "",
    subServices: resolvedSubServices,
    whyChooseUsBadge: sub.whyChooseUsBadge || "WHY BEST INTERNATIONAL",
    whyChooseUsTitle: sub.whyChooseUsTitle || `Why Choose BIC for ${sub.title}?`,
    whyChooseUsDesc: sub.whyChooseUsDesc || "",
    whyChooseUs: resolvedWhyChooseUs,
    industriesBadge: sub.industriesBadge || "SECTOR APPLICATIONS",
    industriesTitle: sub.industriesTitle || `Industries Powered by Our ${sub.title}`,
    industriesDesc: sub.industriesDesc || "",
    industries: resolvedIndustries,
    showcaseBadge: sub.showcaseBadge || "DETAILED EXECUTION",
    showcaseTitle: sub.showcaseTitle || `Comprehensive ${sub.title} Execution Framework`,
    showcaseDesc: sub.showcaseDesc || "",
    showcaseTabs: resolvedShowcaseTabs,
    faqsBadge: sub.faqsBadge || "FREQUENTLY ASKED QUESTIONS",
    faqsTitle: sub.faqsTitle || `Common Questions About ${sub.title}`,
    faqsDesc: sub.faqsDesc || "",
    faqs: resolvedFaqs,
    cta: resolvedCta,
    metaTitle: sub.metaTitle || `${sub.title} Saudi Arabia | Best International Contracting - BiC`,
    metaDescription: sub.metaDescription || sub.shortDesc || sub.desc || `Expert ${sub.title.toLowerCase()} in Saudi Arabia. Aramco & SABIC approved contractor delivering turnkey industrial excellence across KSA.`,
    canonicalUrl: sub.canonicalUrl || `${subUrl}`,
    focusKeyword: sub.focusKeyword || `${sub.title} Saudi Arabia`,
    ogImage: sub.ogImage || sub.heroImage || sub.image || parentService?.heroImage,
    customSchema: sub.customSchema || ""
  };
}

export function buildCompleteChildServiceData(parentService: any, subService: any, child: any) {
  if (!child) return null;

  const parentSlug = getParentServiceSlug(parentService);
  const subSlug = getSubServiceSlug(subService);
  const childSlug = getChildServiceSlug(child);
  const childUrl = `/services/${parentSlug}/${subSlug}/${childSlug}`;

  // Resolve subServices: if explicitly defined, respect it.
  // If undefined, default to siblings.
  let resolvedSubServices: any[] = [];
  if (Array.isArray(child.subServices)) {
    resolvedSubServices = child.subServices;
  } else if (Array.isArray(subService.subServices) && subService.subServices.length > 0) {
    resolvedSubServices = subService.subServices
      .filter((s: any) => getChildServiceSlug(s) !== childSlug)
      .map((s: any) => ({
        ...s,
        link: getChildServiceUrl(parentService, subService, s)
      }));
  }

  // Resolve whyChooseUs: if explicitly defined, use it. If undefined, empty array.
  const resolvedWhyChooseUs = Array.isArray(child.whyChooseUs)
    ? child.whyChooseUs
    : [];

  // Resolve industries: if explicitly defined, use it. If undefined, empty array.
  const resolvedIndustries = Array.isArray(child.industries)
    ? child.industries
    : [];

  // Resolve showcaseTabs: if explicitly defined, use it. If undefined, empty.
  const resolvedShowcaseTabs = Array.isArray(child.showcaseTabs)
    ? child.showcaseTabs
    : [];

  // Resolve faqs: if explicitly defined, use it. If undefined, empty.
  const resolvedFaqs = Array.isArray(child.faqs)
    ? child.faqs
    : [];

  // Resolve overview: only return if it has actual content
  const resolvedOverview = child.overview && (
    child.overview.title ||
    child.overview.desc1 ||
    child.overview.desc2 ||
    (Array.isArray(child.overview.specs) && child.overview.specs.length > 0) ||
    child.overview.image ||
    child.overview.image2 ||
    child.overview.image3 ||
    child.overview.image4
  ) ? child.overview : null;

  // Resolve CTA: only return if it has actual content
  const resolvedCta = child.cta && (
    child.cta.title ||
    child.cta.desc ||
    child.cta.buttonText ||
    child.cta.primaryBtnText
  ) ? child.cta : null;

  return {
    id: child.id || childSlug,
    parentId: subService?.id,
    parentTitle: subService?.title,
    parentSlug: subSlug,
    rootParentId: parentService?.id,
    rootParentTitle: parentService?.title,
    rootParentSlug: parentSlug,
    title: child.title,
    slug: childUrl,
    badge: child.badge || `${child.title.toUpperCase()} · SPECIALIZED CAPABILITY`,
    subtitle: child.subtitle || `${child.title} Execution & Solutions in Saudi Arabia`,
    shortDesc: child.shortDesc || child.desc || `Specialized ${child.title.toLowerCase()} solutions executed to the highest quality and safety standards across Saudi Arabia.`,
    fullDesc: child.fullDesc || child.shortDesc || child.desc || "",
    heroImage: child.heroImage || child.image || subService?.heroImage || subService?.image || parentService?.heroImage || "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=2070&auto=format&fit=crop",
    heroWatermark: child.heroWatermark || subService?.heroWatermark || "BIC",
    heroTaglines: Array.isArray(child.heroTaglines) ? child.heroTaglines : (Array.isArray(subService?.heroTaglines) ? subService.heroTaglines : []),
    heroStats: Array.isArray(child.heroStats) ? child.heroStats : (Array.isArray(subService?.heroStats) ? subService.heroStats : []),
    overview: resolvedOverview,
    subServicesBadge: child.subServicesBadge || "RELATED WORK PACKAGES",
    subServicesTitle: child.subServicesTitle || `Related ${subService.title} Capabilities`,
    subServicesDesc: child.subServicesDesc || "",
    subServices: resolvedSubServices,
    whyChooseUsBadge: child.whyChooseUsBadge || "WHY BEST INTERNATIONAL",
    whyChooseUsTitle: child.whyChooseUsTitle || `Why Choose BIC for ${child.title}?`,
    whyChooseUsDesc: child.whyChooseUsDesc || "",
    whyChooseUs: resolvedWhyChooseUs,
    industriesBadge: child.industriesBadge || "SECTOR APPLICATIONS",
    industriesTitle: child.industriesTitle || `Industries Powered by Our ${child.title}`,
    industriesDesc: child.industriesDesc || "",
    industries: resolvedIndustries,
    showcaseBadge: child.showcaseBadge || "DETAILED EXECUTION",
    showcaseTitle: child.showcaseTitle || `Comprehensive ${child.title} Execution Framework`,
    showcaseDesc: child.showcaseDesc || "",
    showcaseTabs: resolvedShowcaseTabs,
    faqsBadge: child.faqsBadge || "FREQUENTLY ASKED QUESTIONS",
    faqsTitle: child.faqsTitle || `Common Questions About ${child.title}`,
    faqsDesc: child.faqsDesc || "",
    faqs: resolvedFaqs,
    cta: resolvedCta,
    metaTitle: child.metaTitle || `${child.title} | ${subService.title} Saudi Arabia - Best International`,
    metaDescription: child.metaDescription || child.shortDesc || child.desc || `Expert ${child.title.toLowerCase()} in Saudi Arabia. Aramco & SABIC approved contractor delivering turnkey industrial excellence across KSA.`,
    canonicalUrl: child.canonicalUrl || `${childUrl}`,
    focusKeyword: child.focusKeyword || `${child.title} Saudi Arabia`,
    ogImage: child.ogImage || child.heroImage || child.image || subService?.heroImage || parentService?.heroImage,
    customSchema: child.customSchema || ""
  };
}
