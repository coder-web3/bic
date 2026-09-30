import fs from "fs";
import path from "path";
import defaultSettings from "@/data/siteSettings.json";

export interface NavLinkItem {
  id: string;
  name: string;
  path: string;
}

export interface SiteSettings {
  general: {
    siteName: string;
    shortName: string;
    siteTagline: string;
    logoUrl: string;
    logoDarkUrl: string;
    logoAlt: string;
    faviconUrl: string;
    phone: string;
    email: string;
    address: string;
    accreditationBadge: string;
  };
  header: {
    showTopBar: boolean;
    phone: string;
    email: string;
    address: string;
    badgeText: string;
    showBadge: boolean;
    showSocials: boolean;
    showLanguage: boolean;
    navLinks: NavLinkItem[];
    ctaButton: {
      show: boolean;
      text: string;
      url: string;
    };
  };
  footer: {
    aboutText: string;
    logoUrl: string;
    logoAlt: string;
    address?: string;
    phone?: string;
    email: string;
    workingHours?: string;
    directionText?: string;
    directionUrl?: string;
    copyrightText: string;
    badge1?: string;
    badge2?: string;
    badge3?: string;
    sloganTitle?: string;
    sloganSubtitle?: string;
    phone1?: string;
    phone1Label?: string;
    phone2?: string;
    phone2Label?: string;
    phone3?: string;
    phone3Label?: string;
    locationCity?: string;
    locationCountry?: string;
    ctaBanner?: {
      show: boolean;
      badge: string;
      titleWhite: string;
      titleRed: string;
      description: string;
      quoteButtonText: string;
      quoteButtonUrl: string;
      brochureButtonText: string;
      brochureButtonUrl: string;
      bgImageUrl: string;
    };
    quickLinksTitle?: string;
    quickLinks: NavLinkItem[];
    servicesTitle?: string;
    serviceLinks: NavLinkItem[];
    informationTitle?: string;
    informationLinks?: NavLinkItem[];
    bottomCtaText?: string;
    bottomCtaUrl?: string;
    bottomLinks: NavLinkItem[];
  };
  socials: {
    linkedin: string;
    twitter: string;
    facebook: string;
    instagram: string;
  };
}

export function getSiteSettings(): SiteSettings {
  try {
    const dataFilePath = path.join(process.cwd(), "src", "data", "siteSettings.json");
    if (fs.existsSync(dataFilePath)) {
      const fileContents = fs.readFileSync(dataFilePath, "utf8");
      const parsed = JSON.parse(fileContents);
      return {
        ...defaultSettings,
        ...parsed,
        general: { ...defaultSettings.general, ...(parsed.general || {}) },
        header: { ...defaultSettings.header, ...(parsed.header || {}) },
        footer: { ...defaultSettings.footer, ...(parsed.footer || {}) },
        socials: { ...defaultSettings.socials, ...(parsed.socials || {}) },
      } as SiteSettings;
    }
  } catch (err) {
    console.error("Error loading site settings from disk, using fallback:", err);
  }
  return defaultSettings as unknown as SiteSettings;
}
