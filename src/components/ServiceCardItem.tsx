"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { getSubServiceUrl } from "@/lib/subServiceUtils";

interface ServiceCardItemProps {
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

export default function ServiceCardItem({ srv, idx }: ServiceCardItemProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const num = String(idx + 1).padStart(2, "0");
  const subServices = Array.isArray(srv.subServices) ? srv.subServices : [];
  const subCount = subServices.length;
  const cardImg = srv.overview?.image || srv.heroImage || DEFAULT_FALLBACK_IMAGES[idx % DEFAULT_FALLBACK_IMAGES.length];

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  const handleScroll = (direction: "left" | "right", e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (scrollRef.current) {
      const scrollAmount = 260;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollRef.current.scrollLeft - scrollAmount : scrollRef.current.scrollLeft + scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="relative bg-white border border-gray-200/90 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#E62E2D]/40 transition-all duration-500 flex flex-col h-full group">
      
      {/* Top Red Ambient Indicator */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#E62E2D] via-red-500 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Main Hero Header Preview (Seamlessly blended) */}
      <Link href={srv.slug || `/services/${srv.id}`} className="block relative h-64 sm:h-72 w-full overflow-hidden bg-gray-950">
        <img 
          src={cardImg} 
          alt={srv.title} 
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          onError={(e) => {
            e.currentTarget.src = DEFAULT_FALLBACK_IMAGES[idx % DEFAULT_FALLBACK_IMAGES.length];
          }}
        />
        {/* Soft Industrial Cinematic Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1117]/80 via-transparent to-[#0d1117]/40" />
        
        {/* Top Badges */}
        <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
          <span className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#E62E2D] animate-pulse" />
            {srv.badge || "CORE INDUSTRIAL CAPABILITY"}
          </span>
          <span className="text-3xl font-black text-white/30 font-mono group-hover:text-white/80 transition-colors">
            {num}
          </span>
        </div>

        {/* Bottom Title Blended over Image */}
        <div className="absolute bottom-5 left-6 right-6 z-10">
          <h3 className="text-2xl md:text-[28px] lg:text-[30px] font-bold leading-[1.2] text-white group-hover:text-[#E62E2D] transition-colors drop-shadow-md tracking-tight">
            {srv.title}
          </h3>
          {srv.subtitle && (
            <p className="text-gray-200 text-xs sm:text-sm font-medium line-clamp-1 mt-1 opacity-90">
              {srv.subtitle}
            </p>
          )}
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between bg-gradient-to-b from-white to-gray-50/50">
        <div>
          {/* Short Description */}
          <p className="text-gray-600 text-sm sm:text-[15px] leading-relaxed mb-6 font-normal">
            {srv.shortDesc || srv.fullDesc || "Specialized turnkey engineering and industrial contracting solutions compliant with Saudi Aramco and SABIC standards."}
          </p>

          {/* Sub-Services Interactive Visual Carousel */}
          {subCount > 0 && (
            <div className="mb-6 pt-2">
              {/* Carousel Header with Controls */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-[#E62E2D]" />
                  <span className="text-xs font-black text-gray-900 tracking-wider uppercase">
                    Sub-Disciplines & Capabilities
                  </span>
                  <span className="text-xs font-bold text-[#E62E2D] bg-red-50 border border-red-200/80 px-2 py-0.5 rounded-md shadow-xs">
                    {subCount}
                  </span>
                </div>

                {/* Arrow Controls */}
                {subCount > 2 && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleScroll("left", e)}
                      disabled={!canScrollLeft}
                      className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                        canScrollLeft 
                          ? "bg-white border-gray-300 text-gray-800 hover:bg-[#E62E2D] hover:border-[#E62E2D] hover:text-white shadow-sm hover:scale-105 active:scale-95" 
                          : "bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed"
                      }`}
                      aria-label="Previous sub-service"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <button
                      onClick={(e) => handleScroll("right", e)}
                      disabled={!canScrollRight}
                      className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                        canScrollRight 
                          ? "bg-white border-gray-300 text-gray-800 hover:bg-[#E62E2D] hover:border-[#E62E2D] hover:text-white shadow-sm hover:scale-105 active:scale-95" 
                          : "bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed"
                      }`}
                      aria-label="Next sub-service"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Scrollable Sub-Services Image Cards Strip */}
              <div 
                ref={scrollRef}
                onScroll={checkScroll}
                className="flex gap-3.5 overflow-x-auto scrollbar-none scroll-smooth pb-2 pt-1"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {subServices.map((sub: any, sIdx: number) => {
                  const fallbackChoice = DEFAULT_FALLBACK_IMAGES[(sIdx + idx) % DEFAULT_FALLBACK_IMAGES.length];
                  const subImg = (sub.image && sub.image.trim() !== "") ? sub.image : fallbackChoice;
                  const subLink = getSubServiceUrl(srv, sub);

                  return (
                    <Link
                      key={sIdx}
                      href={subLink}
                      className="flex-none w-[190px] sm:w-[215px] group/sub rounded-2xl overflow-hidden border border-slate-200/90 bg-white hover:border-[#E62E2D]/80 shadow-[0_4px_18px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(230,46,45,0.12)] transition-all duration-300 flex flex-col hover:-translate-y-1.5 relative"
                    >
                      {/* Sub-Card Image Banner */}
                      <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-slate-950">
                        <img 
                          src={subImg} 
                          alt={sub.title} 
                          className="w-full h-full object-cover group-hover/sub:scale-110 transition-transform duration-700 ease-out"
                          onError={(e) => {
                            e.currentTarget.src = fallbackChoice;
                          }}
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/90 via-[#0B0F19]/25 to-transparent" />
                        
                        {/* Number Badge */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 shadow-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E62E2D] animate-pulse" />
                          <span className="text-white text-[10px] font-mono font-bold tracking-wider">
                            {String(sIdx + 1).padStart(2, "0")}
                          </span>
                        </div>
                      </div>

                      {/* Sub-Card Text Content */}
                      <div className="p-3.5 flex-1 flex flex-col justify-between bg-white space-y-2">
                        <h4 className="text-xs font-bold text-slate-900 group-hover/sub:text-[#E62E2D] transition-colors line-clamp-2 leading-snug">
                          {sub.title}
                        </h4>
                        
                        <div className="flex items-center justify-between pt-2 mt-auto border-t border-slate-100">
                          <span className="text-[11px] font-bold text-[#E62E2D] group-hover/sub:translate-x-1 transition-transform flex items-center gap-1 uppercase tracking-wider">
                            <span>Explore</span>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                          </span>
                        </div>
                      </div>

                      {/* Bottom Glowing Red Line */}
                      <div className="h-[2px] w-0 group-hover/sub:w-full bg-gradient-to-r from-[#E62E2D] via-red-500 to-rose-600 transition-all duration-400" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Footer */}
        <div className="pt-6 border-t border-gray-200/80 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Saudi Aramco & SABIC Compliant</span>
          </div>
          
          <Link 
            href={srv.slug || `/services/${srv.id}`}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white bg-[#E62E2D] hover:bg-red-700 px-5 py-3 rounded-xl transition-all duration-300 shadow-md shadow-red-900/25 hover:shadow-red-900/45 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Explore Division</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-1 transition-transform">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </Link>
        </div>

      </div>
    </div>
  );
}

