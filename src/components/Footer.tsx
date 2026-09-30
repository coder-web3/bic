"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import defaultSettings from "@/data/siteSettings.json";
import { SiteSettings } from "@/lib/getSiteSettings";

interface FooterProps {
  initialSettings?: SiteSettings;
}

export default function Footer({ initialSettings }: FooterProps) {
  const [settings, setSettings] = useState<SiteSettings>(
    initialSettings || (defaultSettings as unknown as SiteSettings)
  );

  // Sync settings dynamically on client
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (e) {
        // Fallback silently
      }
    }
    loadSettings();
  }, []);

  const footer = settings?.footer || defaultSettings.footer;
  const general = settings?.general || defaultSettings.general;
  const socials = settings?.socials || defaultSettings.socials;

  const logoSrc = footer?.logoUrl || general?.logoUrl || "/uploads/upload-1790411215652-best_logo-01.png";
  const logoAlt = footer?.logoAlt || general?.logoAlt || "Best International Contracting Logo";

  const cta = footer?.ctaBanner || (defaultSettings.footer as any).ctaBanner || {
    show: true,
    badge: "LET'S BUILD TOGETHER",
    titleWhite: "Have a Project",
    titleRed: "in Mind?",
    description: "Get in touch with our team for a customized solution. We are ready to support your next project with expertise and reliability.",
    quoteButtonText: "GET A QUOTE",
    quoteButtonUrl: "/contact-us",
    brochureButtonText: "OUR BROCHURE",
    brochureButtonUrl: "/about-us",
    bgImageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356f12?q=80&w=2070&auto=format&fit=crop"
  };

  const quickLinks = footer?.quickLinks || defaultSettings.footer.quickLinks;
  const serviceLinks = footer?.serviceLinks || defaultSettings.footer.serviceLinks;
  const informationLinks = (footer as any)?.informationLinks || (defaultSettings.footer as any).informationLinks || [
    { id: "1", name: "Shop", path: "/shop" },
    { id: "2", name: "Enquiry Cart", path: "/contact-us" },
    { id: "3", name: "Make an Inquiry", path: "/contact-us" },
    { id: "4", name: "Privacy", path: "#" },
    { id: "5", name: "Terms & Conditions", path: "#" }
  ];

  const bottomLinks = footer?.bottomLinks || defaultSettings.footer.bottomLinks || [
    { id: "1", name: "Privacy", path: "#" },
    { id: "2", name: "Terms & Conditions", path: "#" }
  ];

  const phone1 = (footer as any)?.phone1 || "+966 54 750 4465";
  const phone1Label = (footer as any)?.phone1Label || "KSA";
  const phone2 = (footer as any)?.phone2 || "+966 50 206 6423";
  const phone2Label = (footer as any)?.phone2Label || "KSA";
  const phone3 = (footer as any)?.phone3 || "+971 55 601 6007";
  const phone3Label = (footer as any)?.phone3Label || "UAE";

  const email = footer?.email || general?.email || "info@bestincontracting.com";
  const workingHours = (footer as any)?.workingHours || "Sat-Thu 8am - 5pm";
  const directionText = (footer as any)?.directionText || "Visit Us";
  const directionUrl = (footer as any)?.directionUrl || "/contact-us";

  const badge1 = (footer as any)?.badge1 || "Quality Driven";
  const badge2 = (footer as any)?.badge2 || "Trusted Partnership";
  const badge3 = (footer as any)?.badge3 || "Sustainable Growth";

  const sloganTitle = (footer as any)?.sloganTitle || "BUILDING";
  const sloganSubtitle = (footer as any)?.sloganSubtitle || "A STRONGER TOMORROW";

  const locationCity = (footer as any)?.locationCity || "RIYADH";
  const locationCountry = (footer as any)?.locationCountry || "SAUDI ARABIA";

  const quickLinksTitle = (footer as any)?.quickLinksTitle || "Quick Links";
  const servicesTitle = (footer as any)?.servicesTitle || "Services";
  const informationTitle = (footer as any)?.informationTitle || "Information";

  const bottomCtaText = (footer as any)?.bottomCtaText || "GET A QUOTE";
  const bottomCtaUrl = (footer as any)?.bottomCtaUrl || "/contact-us";

  return (
    <footer className="w-full bg-[#0D0D11] text-white pt-8 pb-8 relative overflow-hidden font-sans border-t border-white/5">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-[#E62E2D]/5 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#E62E2D]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* =========================================================================
            TOP CTA BANNER ("Have a Project in Mind?") - Compact & Balanced
            ========================================================================= */}
        {cta.show !== false && (
          <div className="relative rounded-2xl overflow-hidden mb-10 border border-white/10 shadow-xl bg-[#111317]">
            {/* Angled Red Industrial Accent Ribbon */}
            <div 
              className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 hidden md:block"
              style={{
                background: "linear-gradient(115deg, rgba(230,46,45,0.95) 0%, rgba(180,20,20,0.85) 12%, transparent 18%)",
              }}
            />

            {/* Right Hero Image (Engineers overlooking industrial plant) */}
            <div className="absolute right-0 top-0 bottom-0 w-full md:w-[46%] z-0 overflow-hidden">
              <div 
                className="w-full h-full bg-cover bg-center brightness-90 contrast-110"
                style={{
                  backgroundImage: `url('${cta.bgImageUrl || 'https://images.unsplash.com/photo-1504307651254-35680f356f12?q=80&w=2070&auto=format&fit=crop'}')`,
                }}
              />
              {/* Dark gradient fade into left content */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#111317] via-[#111317]/85 md:via-[#111317]/60 to-transparent" />
              {/* Dynamic red diagonal polygon slice */}
              <div 
                className="absolute -left-10 top-0 bottom-0 w-24 bg-[#E62E2D] -skew-x-12 opacity-90 hidden lg:block shadow-2xl"
                style={{ clipPath: "polygon(40% 0, 100% 0, 60% 100%, 0% 100%)" }}
              />
              <div 
                className="absolute left-5 top-0 bottom-0 w-8 bg-white/20 -skew-x-12 hidden lg:block"
                style={{ clipPath: "polygon(30% 0, 100% 0, 70% 100%, 0% 100%)" }}
              />
            </div>

            {/* Left Dark Content - Reduced Height and Balanced Typography */}
            <div className="relative z-20 px-6 py-6 sm:px-8 sm:py-7 md:px-10 md:py-7 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8">
              
              {/* Title & Description */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-7 max-w-3xl">
                <div>
                  <div className="flex items-center gap-1.5 text-[#E62E2D] text-[11px] font-extrabold tracking-widest uppercase mb-1">
                    <span className="w-3.5 h-[2px] bg-[#E62E2D]" />
                    <span>{cta.badge || "LET'S BUILD TOGETHER"}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-tight">
                    {cta.titleWhite || "Have a Project"}{" "}
                    <span className="text-[#E62E2D]">{cta.titleRed || "in Mind?"}</span>
                  </h2>
                </div>

                {/* Vertical subtle separator */}
                <div className="hidden md:block w-[1px] h-12 bg-white/20 shrink-0" />

                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-normal max-w-sm">
                  {cta.description || "Get in touch with our team for a customized solution. We are ready to support your next project with expertise and reliability."}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto shrink-0 relative z-30">
                <Link 
                  href={cta.quoteButtonUrl || "/contact-us"}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 rounded-lg bg-[#E62E2D] hover:bg-[#c92120] text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-lg shadow-[#E62E2D]/25 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <line x1="10" y1="9" x2="8" y2="9"/>
                  </svg>
                  <span>{cta.quoteButtonText || "GET A QUOTE"}</span>
                  <span>→</span>
                </Link>

                <Link 
                  href={cta.brochureButtonUrl || "/about-us"}
                  className="inline-flex items-center gap-2.5 text-white hover:text-[#E62E2D] transition-colors group px-2 py-1.5"
                >
                  <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center group-hover:border-[#E62E2D] group-hover:bg-[#E62E2D] transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="translate-x-0.5">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] text-gray-400 font-semibold tracking-widest uppercase">OUR</span>
                    <span className="text-[11px] font-bold tracking-wider uppercase">BROCHURE</span>
                  </div>
                </Link>
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            MAIN FOOTER SECTION
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 pb-10">
          
          {/* ----------------------------------------------------
              COL 1: BRAND IDENTITY & BADGES (Span 4)
              ---------------------------------------------------- */}
          <div className="lg:col-span-4 flex flex-col justify-between pr-0 lg:pr-6 border-b lg:border-b-0 pb-8 lg:pb-0 border-white/10">
            <div>
              <Link href="/" className="inline-block mb-5 group">
                <img 
                  src={logoSrc} 
                  alt={logoAlt} 
                  className="h-12 md:h-14 w-auto object-contain brightness-105"
                />
              </Link>

              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-5 font-normal">
                {footer?.aboutText || "Delivering integrated industrial, civil, mechanical, piping and electrical solutions with a commitment to quality, safety and sustainable growth across Saudi Arabia and beyond."}
              </p>

              <div className="w-full h-[1px] bg-white/10 mb-5" />

              {/* 3 Feature Badges */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/5">
                  <div className="w-7 h-7 rounded-lg bg-[#2A1618] border border-[#E62E2D]/20 flex items-center justify-center text-[#E62E2D] shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold text-gray-300 leading-tight">
                    {badge1}
                  </span>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/5">
                  <div className="w-7 h-7 rounded-lg bg-[#2A1618] border border-[#E62E2D]/20 flex items-center justify-center text-[#E62E2D] shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold text-gray-300 leading-tight">
                    {badge2}
                  </span>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/5">
                  <div className="w-7 h-7 rounded-lg bg-[#2A1618] border border-[#E62E2D]/20 flex items-center justify-center text-[#E62E2D] shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold text-gray-300 leading-tight">
                    {badge3}
                  </span>
                </div>
              </div>
            </div>

            {/* Industrial Refinery Blueprint Slogan */}
            <div className="pt-3 flex items-center gap-3">
              <div className="w-1 h-7 bg-[#E62E2D] rounded-full" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] tracking-widest font-extrabold text-gray-400 uppercase">{sloganTitle}</span>
                <span className="text-[11px] tracking-wider font-black text-white uppercase">{sloganSubtitle}</span>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------
              COL 2: CONTACT US (Span 3.5)
              ---------------------------------------------------- */}
          <div className="lg:col-span-3 flex flex-col justify-between border-b lg:border-b-0 pb-8 lg:pb-0 border-white/10">
            <div>
              <h4 className="text-white font-bold text-sm tracking-wide uppercase">
                Contact Us
              </h4>
              <div className="w-6 h-[2px] bg-[#E62E2D] mt-1.5 mb-5" />

              <div className="flex flex-col gap-3.5">
                
                {/* Phone 1 */}
                {phone1 && (
                  <div className="flex items-center gap-3 group">
                    <div className="w-9 h-9 rounded-xl bg-[#2A1618] border border-[#E62E2D]/20 flex items-center justify-center text-[#E62E2D] shrink-0 group-hover:bg-[#E62E2D] group-hover:text-white transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <a href={`tel:${phone1.replace(/\s+/g, '')}`} className="text-white font-bold text-sm hover:text-[#E62E2D] transition-colors leading-tight">
                        {phone1}
                      </a>
                      <span className="text-[10px] text-gray-400 font-medium">({phone1Label})</span>
                    </div>
                  </div>
                )}

                {/* Phone 2 */}
                {phone2 && (
                  <div className="flex items-center gap-3 group">
                    <div className="w-9 h-9 rounded-xl bg-[#2A1618] border border-[#E62E2D]/20 flex items-center justify-center text-[#E62E2D] shrink-0 group-hover:bg-[#E62E2D] group-hover:text-white transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <a href={`tel:${phone2.replace(/\s+/g, '')}`} className="text-white font-bold text-sm hover:text-[#E62E2D] transition-colors leading-tight">
                        {phone2}
                      </a>
                      <span className="text-[10px] text-gray-400 font-medium">({phone2Label})</span>
                    </div>
                  </div>
                )}

                {/* Phone 3 */}
                {phone3 && (
                  <div className="flex items-center gap-3 group">
                    <div className="w-9 h-9 rounded-xl bg-[#2A1618] border border-[#E62E2D]/20 flex items-center justify-center text-[#E62E2D] shrink-0 group-hover:bg-[#E62E2D] group-hover:text-white transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <a href={`tel:${phone3.replace(/\s+/g, '')}`} className="text-white font-bold text-sm hover:text-[#E62E2D] transition-colors leading-tight">
                        {phone3}
                      </a>
                      <span className="text-[10px] text-gray-400 font-medium">({phone3Label})</span>
                    </div>
                  </div>
                )}

                {/* Email */}
                {email && (
                  <div className="flex items-center gap-3 group pt-0.5">
                    <div className="w-9 h-9 rounded-xl bg-[#2A1618] border border-[#E62E2D]/20 flex items-center justify-center text-[#E62E2D] shrink-0 group-hover:bg-[#E62E2D] group-hover:text-white transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 font-semibold">Email Us:</span>
                      <a href={`mailto:${email}`} className="text-gray-200 text-xs font-medium hover:text-[#E62E2D] transition-colors">
                        {email}
                      </a>
                    </div>
                  </div>
                )}

                {/* Hours */}
                {workingHours && (
                  <div className="flex items-center gap-3 group">
                    <div className="w-9 h-9 rounded-xl bg-[#2A1618] border border-[#E62E2D]/20 flex items-center justify-center text-[#E62E2D] shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 font-semibold">Opening Hours:</span>
                      <span className="text-gray-200 text-xs font-medium">
                        {workingHours}
                      </span>
                    </div>
                  </div>
                )}

                {/* Get Direction */}
                {directionText && (
                  <div className="flex items-center gap-3 group">
                    <div className="w-9 h-9 rounded-xl bg-[#2A1618] border border-[#E62E2D]/20 flex items-center justify-center text-[#E62E2D] shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 font-semibold">Get Direction:</span>
                      <Link href={directionUrl || "/contact-us"} className="text-[#E62E2D] font-bold text-xs hover:underline flex items-center gap-1">
                        <span>{directionText}</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* ----------------------------------------------------
              COL 3, 4, 5 & LOWER STRIP (Span 5)
              ---------------------------------------------------- */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            
            {/* Top Row: Quick Links | Services | Information */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 pb-7 border-b border-white/10">
              
              {/* Quick Links */}
              <div>
                <h4 className="text-white font-bold text-sm tracking-wide uppercase">
                  {quickLinksTitle}
                </h4>
                <div className="w-6 h-[2px] bg-[#E62E2D] mt-1.5 mb-3.5" />
                <ul className="flex flex-col gap-2 text-xs sm:text-sm">
                  {quickLinks.map((item) => (
                    <li key={item.id || item.name}>
                      <Link 
                        href={item.path} 
                        className="flex items-center justify-between text-gray-400 hover:text-white hover:translate-x-1 transition-all group py-0.5"
                      >
                        <span>{item.name}</span>
                        <span className="text-gray-600 group-hover:text-[#E62E2D] transition-colors font-bold">›</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Services */}
              <div>
                <h4 className="text-white font-bold text-sm tracking-wide uppercase">
                  {servicesTitle}
                </h4>
                <div className="w-6 h-[2px] bg-[#E62E2D] mt-1.5 mb-3.5" />
                <ul className="flex flex-col gap-2 text-xs sm:text-sm">
                  {serviceLinks.map((item) => (
                    <li key={item.id || item.name}>
                      <Link 
                        href={item.path} 
                        className="flex items-center justify-between text-gray-400 hover:text-white hover:translate-x-1 transition-all group py-0.5"
                      >
                        <span>{item.name}</span>
                        <span className="text-gray-600 group-hover:text-[#E62E2D] transition-colors font-bold">›</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Information */}
              <div>
                <h4 className="text-white font-bold text-sm tracking-wide uppercase">
                  {informationTitle}
                </h4>
                <div className="w-6 h-[2px] bg-[#E62E2D] mt-1.5 mb-3.5" />
                <ul className="flex flex-col gap-2 text-xs sm:text-sm">
                  {informationLinks.map((item: any) => (
                    <li key={item.id || item.name}>
                      <Link 
                        href={item.path} 
                        className="flex items-center justify-between text-gray-400 hover:text-white hover:translate-x-1 transition-all group py-0.5"
                      >
                        <span>{item.name}</span>
                        <span className="text-gray-600 group-hover:text-[#E62E2D] transition-colors font-bold">›</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Bottom Row: Follow Us + Riyadh Map Graphic + Red Corner Slice */}
            <div className="pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative">
              
              {/* Follow Us */}
              <div className="flex flex-col">
                <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-1">
                  Follow Us
                </h5>
                <div className="w-6 h-[2px] bg-[#E62E2D] mb-2.5" />
                
                <div className="flex items-center gap-2">
                  {socials?.facebook && (
                    <a 
                      href={socials.facebook} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#E62E2D] hover:text-white hover:border-[#E62E2D] transition-all duration-300"
                      aria-label="Facebook"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                      </svg>
                    </a>
                  )}
                  {socials?.instagram && (
                    <a 
                      href={socials.instagram} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#E62E2D] hover:text-white hover:border-[#E62E2D] transition-all duration-300"
                      aria-label="Instagram"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                      </svg>
                    </a>
                  )}
                  {socials?.linkedin && (
                    <a 
                      href={socials.linkedin} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#E62E2D] hover:text-white hover:border-[#E62E2D] transition-all duration-300"
                      aria-label="LinkedIn"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.2a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28"/>
                      </svg>
                    </a>
                  )}
                  {socials?.twitter && (
                    <a 
                      href={socials.twitter} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#E62E2D] hover:text-white hover:border-[#E62E2D] transition-all duration-300"
                      aria-label="X (Twitter)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                  )}
                  {email && (
                    <a 
                      href={`mailto:${email}`}
                      className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#E62E2D] hover:text-white hover:border-[#E62E2D] transition-all duration-300"
                      aria-label="Email Us"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>

              {/* Vertical subtle separator */}
              <div className="hidden sm:block w-[1px] h-12 bg-white/10 shrink-0" />

              {/* Riyadh Saudi Arabia Dot Map Indicator */}
              <div className="flex items-center gap-3.5 relative z-10">
                <div className="relative flex items-center justify-center">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E62E2D] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E62E2D]"></span>
                  </span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[11px] font-black tracking-widest text-white uppercase">
                    {locationCity}
                  </span>
                  <span className="text-[9px] font-bold tracking-wider text-gray-400 uppercase">
                    {locationCountry}
                  </span>
                  <div className="w-6 h-[2px] bg-[#E62E2D] mt-0.5" />
                </div>
              </div>

              {/* Red Corner Wedge with Watermark Bi */}
              <div 
                className="absolute -right-6 -bottom-6 w-28 h-20 bg-[#E62E2D]/20 rounded-tl-3xl pointer-events-none hidden lg:flex items-center justify-center overflow-hidden"
                style={{ clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0% 100%)" }}
              >
                <span className="text-3xl font-black text-white/20 select-none">Bi</span>
              </div>

            </div>

          </div>

        </div>

        {/* =========================================================================
            BOTTOM COPYRIGHT & LEGAL BAR
            ========================================================================= */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-gray-500">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} {footer?.copyrightText || "Best International Contracting Company, All rights reserved."}
          </p>

          <div className="flex items-center gap-5">
            <Link href={bottomCtaUrl} className="text-[#E62E2D] hover:underline font-bold flex items-center gap-1.5">
              <span>{bottomCtaText}</span>
              <span>→</span>
            </Link>
            <span className="text-white/20">|</span>
            {bottomLinks.map((link, i) => (
              <React.Fragment key={link.id || link.name}>
                <Link href={link.path} className="hover:text-gray-300 transition-colors">
                  {link.name}
                </Link>
                {i < bottomLinks.length - 1 && <span className="text-white/20">|</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
