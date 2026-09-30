"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const defaultServices = [
  {
    num: "01",
    title: "Contracting Services",
    slug: "/services/contracting-services",
    desc: "Comprehensive civil, mechanical, electrical, piping, structural, and industrial contracting solutions across Saudi Arabia.",
    img: "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=800&auto=format&fit=crop",
    iconSvg: '<path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"/><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M4 15v-3a6 6 0 0 1 6-6h0"/><path d="M14 6h0a6 6 0 0 1 6 6v3"/>'
  }
];

export default function ServicesSection({ data }: { data?: any }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const badge = data?.badge || "OUR EXPERTISE";
  const headingLine1 = data?.headingLine1 || "Integrated Solutions";
  const headingHighlight = data?.headingHighlight || "Stronger Tomorrow";
  const desc = data?.desc || "From contracting to industrial solutions, we provide end-to-end industrial solutions to support your projects at every stage.";
  const watermark = data?.watermark || "BiC.";

  const rawItems = Array.isArray(data) ? data : (data?.items || data?.services);
  const services = Array.isArray(rawItems) && rawItems.length > 0 ? rawItems : defaultServices;

  const [isDragging, setIsDragging] = useState(false);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
      const maxScroll = scrollWidth - clientWidth;
      setScrollProgress(maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      checkScroll();
      el.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);

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

      return () => {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
        el.removeEventListener("wheel", onWheel);
      };
    }
  }, [services]);

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
      const { clientWidth, scrollLeft } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <section className="w-full bg-[#f8fafc] text-slate-900 py-20 md:py-24 overflow-hidden relative border-t border-slate-200">
      
      {/* Background Watermark & Grid */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
        />
        
        {/* Faint Huge Watermark Text "BiC." */}
        <div className="absolute right-12 md:right-28 top-2 z-0 opacity-[0.06] select-none font-extrabold text-[120px] md:text-[210px] text-gray-900 leading-none tracking-tighter pointer-events-none">
          {watermark}
        </div>
      </div>

      {/* Header Container */}
      <div className="w-full max-w-[1650px] mx-auto px-6 sm:px-10 lg:px-14 relative z-10 mb-10 md:mb-14">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
          
          {/* Subtitle & Main Title */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-[2px] bg-[#E62E2D]" />
              <span className="text-[#E62E2D] font-bold text-xs sm:text-sm tracking-widest uppercase">
                {badge}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl lg:text-[34px] font-bold leading-[1.15] tracking-tight text-[#0f172a]">
              {headingLine1} <br />
              for a <span className="text-[#E62E2D]">{headingHighlight}</span>
            </h2>
          </motion.div>

          {/* Description with Left Border Divider */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex-1 max-w-md border-l-2 border-gray-300 pl-6 py-1"
          >
            <p className="text-gray-600 text-sm md:text-base leading-relaxed font-normal">
              {desc}
            </p>
          </motion.div>

          {/* Slogan & Slider Buttons */}
          <div className="flex items-center justify-between sm:justify-end gap-8 pt-2 xl:pt-0">
            {/* Slogan with Right Vertical Red Accent */}
            <div className="hidden lg:flex items-center gap-4 border-r-2 border-[#E62E2D] pr-4 py-1 text-right">
              <span className="text-[11px] font-extrabold tracking-[0.2em] text-gray-800 uppercase leading-tight">
                BUILDING<br />A BETTER<br />TOMORROW
              </span>
            </div>

            {/* Slider Navigation Arrow Buttons */}
            {services.length > 1 && (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleScroll('left')} 
                  disabled={!canScrollLeft}
                  className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-300 shadow-sm ${
                    canScrollLeft 
                      ? "border-gray-300 text-gray-800 bg-white hover:bg-gray-100 hover:scale-105 active:scale-95" 
                      : "border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed opacity-60"
                  }`}
                  aria-label="Scroll left"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>

                <button 
                  onClick={() => handleScroll('right')} 
                  disabled={!canScrollRight}
                  className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-300 shadow-md ${
                    canScrollRight 
                      ? "border-[#E62E2D] text-white bg-[#E62E2D] hover:bg-red-700 hover:scale-105 active:scale-95" 
                      : "border-red-200 text-white bg-red-300 cursor-not-allowed opacity-60"
                  }`}
                  aria-label="Scroll right"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Services Showcase Area */}
      <div className="relative w-full z-10">
        <div 
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className={`flex overflow-x-auto gap-6 px-6 sm:px-10 lg:px-14 pb-8 pt-2 hide-scrollbar overscroll-x-contain ${
            isDragging ? "snap-none scroll-auto cursor-grabbing select-none" : "snap-x snap-mandatory scroll-smooth cursor-grab"
          }`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {services.map((srv: any, idx: number) => {
            const isHighlighted = activeIndex === idx;

            return (
              <div 
                key={srv.num || idx} 
                className="snap-start flex-none"
                onMouseEnter={() => setActiveIndex(idx)}
              >
                <Link href={srv.slug || "/services/contracting-services"} onClickCapture={handleLinkClickCapture}>
                  <div className={`relative flex-none w-[270px] sm:w-[310px] md:w-[335px] lg:w-[350px] h-[390px] md:h-[415px] rounded-2xl overflow-hidden group cursor-pointer transition-all duration-500 bg-slate-900 ${
                    isHighlighted 
                      ? "border-2 border-[#E62E2D] ring-4 ring-[#E62E2D]/20 shadow-[0_15px_40px_rgba(230,46,45,0.3)] -translate-y-2" 
                      : "border border-slate-800 shadow-md hover:border-[#E62E2D]/60 hover:-translate-y-1.5"
                  }`}>
                    
                    {/* Top Left Number & Line */}
                    <div className="absolute top-5 left-5 z-20 flex items-center gap-2.5">
                      <span className="text-white font-black text-xl md:text-2xl tracking-tight drop-shadow-md">
                        {srv.num}
                      </span>
                      <div className="w-6 h-[2px] bg-white/60 group-hover:w-10 group-hover:bg-white transition-all duration-300" />
                    </div>

                    {/* Background Image - Crisp & Full Clarity */}
                    <img 
                      src={srv.img} 
                      alt={srv.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Clean Gradient Overlay: Clear at top, smooth dark at bottom for text contrast */}
                    <div className={`absolute inset-0 pointer-events-none transition-all duration-500 ${
                      isHighlighted
                        ? "bg-gradient-to-t from-[#250303] via-[#150204]/90 via-50% to-transparent"
                        : "bg-gradient-to-t from-[#090b10] via-[#090b10]/85 via-50% to-transparent"
                    }`} />

                    {/* Content Box */}
                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 z-20 flex flex-col justify-end">
                      
                      {/* Icon Container */}
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3 transition-all duration-300 bg-[#E62E2D] shadow-lg shadow-red-900/50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: srv.iconSvg || defaultServices[0].iconSvg }} />
                      </div>

                      {/* Title */}
                      <h3 className="text-lg sm:text-xl font-bold text-white leading-snug mb-2 group-hover:text-red-100 transition-colors">
                        {srv.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-300 text-xs sm:text-[13px] leading-relaxed font-normal opacity-90 mb-4 line-clamp-3">
                        {srv.desc}
                      </p>

                      {/* Bottom Button Action */}
                      <div className="flex items-center gap-2.5 text-[11px] font-extrabold tracking-wider text-[#E62E2D] group-hover:text-white transition-colors uppercase">
                        <span>EXPLORE SERVICE</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-1.5 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                      </div>

                    </div>

                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
