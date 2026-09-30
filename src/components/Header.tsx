"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import defaultSettings from "@/data/siteSettings.json";
import { SiteSettings } from "@/lib/getSiteSettings";

interface HeaderProps {
  initialSettings?: SiteSettings;
}

export default function Header({ initialSettings }: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(initialSettings || (defaultSettings as unknown as SiteSettings));

  // Sync scroll position to collapse top bar when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const header = settings?.header || defaultSettings.header;
  const general = settings?.general || defaultSettings.general;
  const socials = settings?.socials || defaultSettings.socials;

  const logoSrc = general?.logoUrl || "/bic-logo.jpg";
  const logoAlt = general?.logoAlt || "Best International Contracting Logo";
  const navLinks = header?.navLinks || defaultSettings.header.navLinks;
  const cta = header?.ctaButton || defaultSettings.header.ctaButton;

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
      
      {/* Top Utility Bar (Collapses smoothly on scroll) */}
      {header.showTopBar !== false && (
        <div
          className={`transition-all duration-300 ease-in-out bg-[#080a0f]/95 text-gray-300 flex justify-center text-[12px] tracking-wide backdrop-blur-md overflow-hidden ${
            scrolled
              ? "max-h-0 opacity-0 -translate-y-full py-0 border-none pointer-events-none"
              : "max-h-16 opacity-100 translate-y-0 py-2 px-6 sm:px-10 md:px-14 border-b border-white/[0.08]"
          }`}
        >
          <div className="max-w-[1650px] w-full mx-auto flex items-center justify-between">
            
            {/* Left Contact Details */}
            <div className="flex items-center gap-5 sm:gap-7">
              {header.phone && (
                <a href={`tel:${header.phone.replace(/\s+/g, '')}`} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group">
                  <div className="w-5 h-5 rounded-full bg-[#E62E2D]/15 flex items-center justify-center border border-[#E62E2D]/30 group-hover:bg-[#E62E2D] group-hover:border-[#E62E2D] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#E62E2D] group-hover:text-white transition-colors"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </div>
                  <span className="font-semibold text-xs text-gray-200 group-hover:text-white transition-colors">{header.phone}</span>
                </a>
              )}

              {header.email && (
                <a href={`mailto:${header.email}`} className="hidden sm:flex items-center gap-2 text-gray-300 hover:text-white transition-colors group">
                  <div className="w-5 h-5 rounded-full bg-[#E62E2D]/15 flex items-center justify-center border border-[#E62E2D]/30 group-hover:bg-[#E62E2D] group-hover:border-[#E62E2D] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#E62E2D] group-hover:text-white transition-colors"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </div>
                  <span className="font-medium text-xs text-gray-300 group-hover:text-white transition-colors">{header.email}</span>
                </a>
              )}

              {header.address && (
                <div className="hidden lg:flex items-center gap-2 text-gray-400">
                  <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#E62E2D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">{header.address}</span>
                </div>
              )}
            </div>

            {/* Right Highlights & Social Links */}
            <div className="flex items-center gap-4 sm:gap-6">
              {header.showBadge !== false && header.badgeText && (
                <div className="hidden md:inline-flex items-center gap-2 text-[#E62E2D] font-extrabold text-[10.5px] tracking-wider uppercase bg-[#E62E2D]/10 px-3.5 py-1 rounded-full border border-[#E62E2D]/35 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E62E2D] animate-pulse" />
                  {header.badgeText}
                </div>
              )}

              {/* Social Icons */}
              {header.showSocials !== false && socials && (
                <div className="flex items-center gap-2.5 border-l border-white/10 pl-4">
                  {socials.linkedin && (
                    <a href={socials.linkedin} target="_blank" rel="noreferrer" className="w-6 h-6 rounded-full bg-white/5 hover:bg-[#E62E2D] flex items-center justify-center text-gray-400 hover:text-white transition-all" aria-label="LinkedIn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                    </a>
                  )}
                  {socials.twitter && (
                    <a href={socials.twitter} target="_blank" rel="noreferrer" className="w-6 h-6 rounded-full bg-white/5 hover:bg-[#E62E2D] flex items-center justify-center text-gray-400 hover:text-white transition-all" aria-label="Twitter">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                    </a>
                  )}
                  {socials.facebook && (
                    <a href={socials.facebook} target="_blank" rel="noreferrer" className="w-6 h-6 rounded-full bg-white/5 hover:bg-[#E62E2D] flex items-center justify-center text-gray-400 hover:text-white transition-all" aria-label="Facebook">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                    </a>
                  )}
                  {socials.instagram && (
                    <a href={socials.instagram} target="_blank" rel="noreferrer" className="w-6 h-6 rounded-full bg-white/5 hover:bg-[#E62E2D] flex items-center justify-center text-gray-400 hover:text-white transition-all" aria-label="Instagram">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                    </a>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Main Navigation Bar (Remains Sticky & Sleek on Scroll) */}
      <div
        className={`transition-all duration-300 text-white flex justify-center border-b border-white/[0.09] ${
          scrolled
            ? "bg-[#080a0f]/95 backdrop-blur-xl py-2.5 px-6 sm:px-10 md:px-14 shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
            : "bg-[#0e1218]/90 backdrop-blur-xl py-3.5 px-6 sm:px-10 md:px-14 shadow-2xl"
        }`}
      >
        <div className="max-w-[1650px] w-full mx-auto flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-1 rounded-lg transition-transform duration-300 group-hover:scale-103">
              <img 
                src={logoSrc} 
                alt={logoAlt} 
                className={`w-auto object-contain rounded-sm drop-shadow-md transition-all duration-300 ${
                  scrolled ? "h-10 md:h-12 lg:h-13" : "h-12 md:h-14 lg:h-16"
                }`}
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-[13px] font-medium tracking-wide">
            {navLinks.map((link) => {
              const isActive = pathname === link.path || (link.path !== "/" && pathname.startsWith(link.path));
              return (
                <div key={link.id || link.name}>
                  <Link 
                    href={link.path} 
                    className={`relative py-1.5 transition-all duration-300 uppercase tracking-wider inline-block ${
                      isActive 
                        ? 'text-white font-semibold' 
                        : 'text-gray-300/90 hover:text-white font-normal'
                    }`}
                  >
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-[#E62E2D] rounded-full shadow-sm shadow-red-500" />
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Actions Button */}
          {cta?.show !== false && (
            <div className="hidden lg:flex items-center gap-6">
              <Link href={cta?.url || "/contact-us"}>
                <button className="relative group overflow-hidden bg-gradient-to-r from-[#E62E2D] to-red-600 hover:from-red-600 hover:to-red-700 text-white text-[12.5px] font-extrabold px-7 py-3 rounded-full flex items-center gap-2.5 uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-red-900/30 cursor-pointer">
                  <span>{cta?.text || "GET A QUOTE"}</span>
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </div>
                </button>
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            )}
          </button>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#0e1218]/98 backdrop-blur-2xl border-b border-white/10 px-6 py-6 flex flex-col gap-4 shadow-2xl animate-fade-in-up">
          {navLinks.map((link) => {
            const isActive = pathname === link.path || (link.path !== "/" && pathname.startsWith(link.path));
            return (
              <Link
                key={link.id || link.name}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-bold tracking-wider py-2.5 border-b border-white/5 transition-colors uppercase ${isActive ? 'text-[#E62E2D]' : 'text-gray-300 hover:text-white'}`}
              >
                {link.name}
              </Link>
            );
          })}
          {cta?.show !== false && (
            <Link href={cta?.url || "/contact-us"} onClick={() => setMobileMenuOpen(false)} className="mt-2">
              <button className="w-full bg-[#E62E2D] hover:bg-red-700 text-white text-[13px] font-bold py-3.5 rounded-full flex items-center justify-center gap-2 uppercase tracking-wider transition-colors shadow-lg shadow-red-900/40">
                {cta?.text || "GET A QUOTE"}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
