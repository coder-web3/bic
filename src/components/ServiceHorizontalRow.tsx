"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { getSubServiceUrl } from "@/lib/subServiceUtils";

interface ServiceHorizontalRowProps {
  srv: any;
  idx: number;
}

const DEFAULT_FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504307651254-35680f356f12?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=800&auto=format&fit=crop"
];

// Helper to provide category-appropriate icon SVGs
function getSubCategoryIcon(title: string, sIdx: number) {
  const t = (title || "").toLowerCase();
  if (t.includes("civil") || t.includes("earth") || t.includes("foundation") || t.includes("building")) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E62E2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
        <path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/>
      </svg>
    );
  }
  if (t.includes("piping") || t.includes("pipeline") || t.includes("fluid")) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E62E2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
        <polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/>
      </svg>
    );
  }
  if (t.includes("mechanical") || t.includes("equipment") || t.includes("pump") || t.includes("gear")) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E62E2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    );
  }
  if (t.includes("electrical") || t.includes("power") || t.includes("light") || t.includes("volt")) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E62E2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E62E2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"/>
      <path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M4 15v-3a6 6 0 0 1 6-6h0"/><path d="M14 6h0a6 6 0 0 1 6 6v3"/>
    </svg>
  );
}

export default function ServiceHorizontalRow({ srv, idx }: ServiceHorizontalRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);

  const num = String(idx + 1).padStart(2, "0");
  const subServices = Array.isArray(srv.subServices) ? srv.subServices : [];
  const cardImg = srv.overview?.image || srv.heroImage || DEFAULT_FALLBACK_IMAGES[idx % DEFAULT_FALLBACK_IMAGES.length];

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);

      // Approximate progress bar indicator index
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        const ratio = scrollLeft / maxScroll;
        setScrollIndex(Math.round(ratio * 3));
      }
    }
  };

  useEffect(() => {
    checkScroll();
  }, [subServices]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      // Allow natural vertical page scroll unless Shift key is held or horizontal swipe gesture
      if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
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
  }, [subServices]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDownRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftRef.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDownRef.current || !scrollRef.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.4;
    if (Math.abs(walk) > 4) {
      if (!isDragging) setIsDragging(true);
      hasMovedRef.current = true;
    }
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
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

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollRef.current.scrollLeft - scrollAmount : scrollRef.current.scrollLeft + scrollAmount,
        behavior: "smooth"
      });
    }
  };

  // Extract top words from title for stylized branding
  const titleParts = srv.title ? srv.title.split(" ") : ["Service"];
  const firstWord = titleParts[0] || "";
  const remainingWords = titleParts.slice(1).join(" ") || "";

  return (
    <div className="w-full bg-white rounded-3xl border border-gray-200/90 shadow-xl overflow-hidden mb-12 lg:mb-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[440px]">
        
        {/* ════════ LEFT COLUMN: Heroic Diagonal Showcase Card (4 cols) ════════ */}
        <div className="lg:col-span-4 relative bg-[#0a0d14] text-white p-8 sm:p-10 flex flex-col justify-between overflow-hidden group min-h-[380px] lg:min-h-[460px]">
          
          {/* Background Photo with Diagonal Gradient */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-60"
            style={{ backgroundImage: `url('${cardImg}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0d14] via-[#0a0d14]/85 to-[#0a0d14]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-[#0a0d14]/60 to-transparent" />
          
          {/* Red Diagonal Accent Glow Edge */}
          <div 
            className="absolute -right-12 -top-12 w-32 h-[140%] bg-gradient-to-b from-[#E62E2D] via-red-600 to-transparent opacity-30 transform rotate-12 blur-xl pointer-events-none" 
          />

          {/* Top: Red Icon Box & Serial */}
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E62E2D] to-red-700 flex items-center justify-center text-white shadow-lg shadow-red-900/50 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
                <path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/>
              </svg>
            </div>

            {/* Serial Subheading */}
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-[#E62E2D] font-bold text-xs tracking-widest uppercase">
                {num} — MAIN SERVICE
              </span>
            </div>

            {/* Title with Highlighted 2nd line */}
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-[1.2] mb-4">
              {firstWord} <br />
              <span className="text-[#E62E2D] relative inline-block">
                {remainingWords || "Excellence"}
              </span>
            </h3>

            {/* Sub-description */}
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-sm font-normal">
              {srv.shortDesc || srv.subtitle || "Comprehensive turnkey contracting solutions executed to Saudi Aramco and global quality standards."}
            </p>
          </div>

          {/* Bottom Action Button */}
          <div className="relative z-10 pt-8 mt-auto">
            <Link href={srv.slug || `/services/${srv.id}`}>
              <button className="w-fit bg-[#E62E2D] hover:bg-red-700 text-white text-xs sm:text-sm font-semibold py-3 px-6 rounded-xl flex items-center gap-2.5 tracking-wider uppercase transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-red-900/40 cursor-pointer">
                Explore Service
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </Link>
          </div>
        </div>

        {/* ════════ RIGHT COLUMN: Sub-Disciplines & Carousel (8 cols) ════════ */}
        <div className="lg:col-span-8 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white overflow-hidden">
          
          {/* Section Header Row */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-[2px] bg-[#E62E2D]" />
              <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-gray-800">
                SUB-DISCIPLINES & CAPABILITIES
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Link 
                href={srv.slug || `/services/${srv.id}`}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#E62E2D] hover:text-red-700 transition-colors"
              >
                <span>View All Capabilities</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>

              {/* Navigation Arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleScroll("left")}
                  disabled={!canScrollLeft}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    canScrollLeft
                      ? "bg-gray-100 text-gray-800 hover:bg-gray-200 active:scale-95"
                      : "bg-gray-50 text-gray-300 cursor-not-allowed"
                  }`}
                  aria-label="Previous capabilities"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
                </button>

                <button
                  onClick={() => handleScroll("right")}
                  disabled={!canScrollRight}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    canScrollRight
                      ? "bg-[#E62E2D] text-white hover:bg-red-700 shadow-md shadow-red-900/20 active:scale-95"
                      : "bg-red-200 text-white cursor-not-allowed"
                  }`}
                  aria-label="Next capabilities"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Sub-Services Horizontal Scroll List */}
          <div 
            ref={scrollRef}
            onScroll={checkScroll}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className={`flex gap-5 overflow-x-auto scrollbar-none pb-5 pt-2 items-stretch overscroll-x-contain ${
              isDragging ? "snap-none scroll-auto cursor-grabbing select-none" : "scroll-smooth cursor-grab"
            }`}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {subServices.map((sub: any, sIdx: number) => {
              const fallbackChoice = DEFAULT_FALLBACK_IMAGES[(sIdx + idx) % DEFAULT_FALLBACK_IMAGES.length];
              const subImg = (sub.image && sub.image.trim() !== "") ? sub.image : fallbackChoice;
              const subLink = getSubServiceUrl(srv, sub);
              const subNum = String(sIdx + 1).padStart(2, "0");

              return (
                <Link
                  key={sIdx}
                  href={subLink}
                  onClickCapture={handleLinkClickCapture}
                  className="flex-none w-[235px] sm:w-[265px] rounded-2xl overflow-hidden border border-slate-200/90 bg-white hover:border-[#E62E2D]/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(230,46,45,0.13)] transition-all duration-400 flex flex-col group/item hover:-translate-y-2 relative"
                >
                  {/* Photo Header */}
                  <div className="relative h-40 w-full overflow-hidden bg-slate-950">
                    <img 
                      src={subImg} 
                      alt={sub.title} 
                      className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700 ease-out"
                      onError={(e) => {
                        e.currentTarget.src = fallbackChoice;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/90 via-[#0B0F19]/25 to-transparent" />
                    
                    {/* Glassmorphic Number Pill */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E62E2D] animate-pulse" />
                      <span className="text-white text-[10.5px] font-mono font-bold tracking-wider">
                        {subNum}
                      </span>
                    </div>

                    {/* Top Right Floating Category Icon */}
                    <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90 group-hover/item:bg-[#E62E2D] group-hover/item:border-[#E62E2D] group-hover/item:text-white transition-all duration-300 shadow-sm">
                      {getSubCategoryIcon(sub.title, sIdx)}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-3 h-[2px] bg-[#E62E2D] scale-x-0 group-hover/item:scale-x-100 transition-transform origin-left duration-300" />
                        <h4 className="text-[15px] font-bold text-slate-900 group-hover/item:text-[#E62E2D] transition-colors leading-snug line-clamp-1">
                          {sub.title}
                        </h4>
                      </div>
                      <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 font-normal">
                        {sub.desc || `Specialized ${sub.title.toLowerCase()} execution delivered to Saudi Aramco standards.`}
                      </p>
                    </div>

                    {/* Bottom Action Row */}
                    <div className="flex items-center justify-between pt-3.5 border-t border-slate-100/90 mt-auto">
                      <span className="text-[11.5px] font-bold text-[#E62E2D] flex items-center gap-1.5 group-hover/item:translate-x-1 transition-transform uppercase tracking-wider">
                        <span>Explore Scope</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                      </span>

                      <div className="w-8 h-8 rounded-xl bg-slate-100/90 border border-slate-200/70 flex items-center justify-center text-slate-600 group-hover/item:bg-[#E62E2D] group-hover/item:border-[#E62E2D] group-hover/item:text-white shadow-2xs group-hover/item:scale-105 transition-all duration-300">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                      </div>
                    </div>

                  </div>

                  {/* Bottom Red Glowing Accent Bar on Hover */}
                  <div className="h-[2.5px] w-0 group-hover/item:w-full bg-gradient-to-r from-[#E62E2D] via-red-500 to-rose-600 transition-all duration-500" />
                </Link>
              );
            })}
          </div>

          {/* Bottom Progress Pill Bar */}
          <div className="flex items-center justify-center gap-1.5 pt-4">
            {[0, 1, 2, 3].map((pIdx) => (
              <div 
                key={pIdx}
                className={`h-1 rounded-full transition-all duration-300 ${
                  scrollIndex === pIdx 
                    ? "w-8 bg-[#E62E2D]" 
                    : "w-4 bg-gray-200"
                }`}
              />
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
