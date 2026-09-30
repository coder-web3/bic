"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Users, 
  Shield, 
  BarChart2, 
  Lightbulb, 
  HardHat, 
  Award, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from "lucide-react";

// Default fallback values matching reference design
const defaultValues = [
  {
    num: "01",
    title: "Accountability &\nProfessionalism",
    desc: "Owning every phase of the project lifecycle — from initial planning through to final execution — while consistently upholding a high level of professionalism in every interaction.",
    image: "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Accountability and professionalism execution",
    icon: "users"
  },
  {
    num: "02",
    title: "Integrity &\nTransparency",
    desc: "Building trust and fostering open communication by prioritizing honesty and transparency in every interaction with clients and vendors.",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Integrity and transparency construction site",
    icon: "shield"
  },
  {
    num: "03",
    title: "Data-Driven\nImprovement",
    desc: "Leveraging data-driven insights to make informed decisions, optimizing efficiency, and improving outcomes across every project and operation.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Data-driven improvement in industrial processing",
    icon: "chart"
  },
  {
    num: "04",
    title: "Learning &\nInnovation",
    desc: "Keeping pace with industry advancements, continuously improving skills and adopting new techniques to lead in the contracting field.",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Continuous learning and modern innovation",
    icon: "lightbulb"
  },
  {
    num: "05",
    title: "Safety &\nSustainability",
    desc: "Enforcing strict Saudi Aramco and international HSE standards to ensure a safe work environment for all personnel and assets.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356f12?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Safety and sustainability compliance",
    icon: "hardhat"
  },
  {
    num: "06",
    title: "Quality &\nExcellence",
    desc: "Delivering certified ISO 9001 quality across every work package with rigorous QA/QC inspection and on-time milestones.",
    image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Quality and operational excellence",
    icon: "award"
  }
];

export default function CoreValuesSection({ data }: { data?: any }) {
  const badge = data?.badge || "OUR CORE VALUES";
  const headingLine1 = data?.headingLine1 || "Core Principles";
  const headingHighlight = data?.headingHighlight || "That Define";
  const headingLine2 = data?.headingLine2 || "Our Culture";
  const desc = data?.desc || "Guided by strong values, we build lasting partnerships and deliver excellence in every project. Our commitment to these principles ensures that we consistently exceed expectations.";
  const ctaText = data?.ctaText || "DISCOVER OUR PROCESS";
  const ctaLink = data?.ctaLink || "/about-us";
  const itemsList = data?.items && data.items.length > 0 ? data.items : defaultValues;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
      
      const itemWidth = 340;
      const idx = Math.round(scrollLeft / itemWidth);
      setActiveIndex(Math.min(itemsList.length - 1, Math.max(0, idx)));
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      checkScroll();
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);

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

      return () => {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
        el.removeEventListener("wheel", onWheel);
      };
    }
  }, [itemsList.length]);

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
      const scrollAmount = clientWidth > 768 ? 360 : 300;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth"
      });
    }
  };

  // Helper to render appropriate icon
  const getIcon = (item: any, idx: number) => {
    const iconType = item.icon || (idx === 0 ? "users" : idx === 1 ? "shield" : idx === 2 ? "chart" : idx === 3 ? "lightbulb" : idx === 4 ? "hardhat" : "award");
    switch (iconType) {
      case "users":
        return <Users size={22} />;
      case "shield":
        return <Shield size={22} />;
      case "chart":
        return <BarChart2 size={22} />;
      case "lightbulb":
        return <Lightbulb size={22} />;
      case "hardhat":
        return <HardHat size={22} />;
      case "award":
        return <Award size={22} />;
      default:
        return <Users size={22} />;
    }
  };

  return (
    <section className="w-full bg-[#f8f9fb] text-gray-900 py-14 sm:py-16 lg:py-20 relative overflow-hidden border-y border-gray-200/80">
      
      {/* ── 1. Giant Faint Background Watermark Text ───────── */}
      <div className="absolute top-4 left-6 sm:left-12 text-[80px] sm:text-[120px] lg:text-[150px] font-black text-gray-200/40 select-none pointer-events-none tracking-tight leading-none z-0">
        CORE VALUES
      </div>

      {/* ── 2. Decorative Ambient Gradients & Silhouette Accents ─── */}
      <div className="absolute -bottom-16 -left-16 w-[360px] h-[360px] bg-red-600/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-[320px] h-[320px] bg-red-600/5 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Subtle Bottom-Left Industrial Line Pattern Overlay */}
      <div 
        className="absolute bottom-0 left-0 w-72 h-60 opacity-10 pointer-events-none z-0 bg-no-repeat bg-contain bg-bottom"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' fill='none' stroke='%23111827' stroke-width='1.5'%3E%3Cpath d='M20 180V80h30v100M60 180V40h40v140M110 180V90h25v90M145 180V60h35v120'/%3E%3Cpath d='M10 180h180M50 80l20-40M100 40l20 50M135 90l20-30'/%3E%3C/svg%3E")`
        }}
      />

      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ── Left Typography & CTA Column (lg:col-span-4) ───────── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4 flex flex-col justify-between"
          >
            <div>
              {/* Badge Subtitle with Horizontal Red Bar */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-[2px] bg-[#E62E2D]" />
                <span className="text-[#E62E2D] font-bold text-sm tracking-widest uppercase">
                  {badge}
                </span>
              </div>

              {/* Main Headline */}
              <h2 className="text-2xl md:text-3xl lg:text-[32px] font-bold leading-[1.15] tracking-tight text-[#111] mb-6">
                {headingLine1} <br />
                <span className="text-[#E62E2D] relative inline-block">
                  {headingHighlight}
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="absolute bottom-1 left-0 h-[8px] bg-[#E62E2D]/20 -z-10" 
                  />
                </span>
                {headingLine2 ? (
                  <>
                    <br />
                    {headingLine2}
                  </>
                ) : null}
              </h2>

              {/* Description */}
              <p className="text-gray-600 text-xs sm:text-[13px] leading-relaxed font-normal mb-6 max-w-md text-justify">
                {desc}
              </p>
            </div>

            {/* Discover Our Process CTA Button */}
            <div>
              <Link
                href={ctaLink}
                className="inline-flex items-center gap-3 group cursor-pointer select-none"
              >
                <div className="w-10 h-10 rounded-full bg-[#E62E2D] text-white flex items-center justify-center shadow-md group-hover:scale-105 group-hover:bg-red-700 transition-all duration-300">
                  <ArrowRight size={16} className="transform group-hover:translate-x-0.5 transition-transform" />
                </div>
                <span className="text-[11px] font-black tracking-widest uppercase text-gray-900 group-hover:text-[#E62E2D] transition-colors">
                  {ctaText}
                </span>
              </Link>
            </div>
          </motion.div>

          {/* ── Right Carousel Cards Column (lg:col-span-8) ───────── */}
          <div className="lg:col-span-8 flex flex-col">
            
            {/* Horizontal Scrollable Track with 3 Visible Cards on Desktop */}
            <div
              ref={scrollRef}
              data-lenis-prevent
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              className={`flex overflow-x-auto gap-4 sm:gap-5 pb-3 pt-1 hide-scrollbar overscroll-x-contain ${
                isDragging ? "snap-none scroll-auto cursor-grabbing select-none" : "snap-x snap-mandatory scroll-smooth cursor-grab"
              }`}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {itemsList.map((item: any, idx: number) => {
                const numStr = item.num || (idx < 9 ? `0${idx + 1}` : `${idx + 1}`);
                const fallbackImg = defaultValues[idx % defaultValues.length]?.image || "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=800&auto=format&fit=crop";
                const cardImg = item.image || fallbackImg;
                const cardAlt = item.imageAlt || item.title || "Core Value Image";

                return (
                  <motion.div
                    key={numStr}
                    onClickCapture={handleLinkClickCapture}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.07 }}
                    className="w-[270px] sm:w-[295px] md:w-[315px] shrink-0 snap-start bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border border-gray-100 group hover:shadow-xl hover:border-red-200 transition-all duration-500 flex flex-col justify-between relative cursor-pointer"
                  >
                    {/* Top Slanted Image Header */}
                    <div className="relative h-40 sm:h-44 bg-gray-950 overflow-hidden rounded-t-2xl sm:rounded-t-3xl">
                      
                      {/* Diagonal Slanted Image Container */}
                      <div 
                        className="w-full h-full overflow-hidden"
                        style={{ clipPath: "polygon(0 0, 100% 0, 100% 86%, 0 100%)" }}
                      >
                        <img
                          src={cardImg}
                          alt={cardAlt}
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-108 transition-all duration-700"
                          onError={(e: any) => {
                            e.currentTarget.src = fallbackImg;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                      </div>

                      {/* Large Number Overlay (01, 02, 03) */}
                      <span className="absolute top-2.5 left-3.5 text-3xl sm:text-4xl font-black text-white drop-shadow-md z-10 select-none tracking-tight">
                        {numStr}
                      </span>
                    </div>

                    {/* Floating Square Rounded Icon Box */}
                    <div className="relative -mt-5 ml-5 z-20">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center text-[#E62E2D] group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        {getIcon(item, idx)}
                      </div>
                    </div>

                    {/* Bottom Card Content */}
                    <div className="px-5 pt-2 pb-5 flex-1 flex flex-col justify-between bg-white rounded-b-2xl sm:rounded-b-3xl">
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1.5 leading-snug group-hover:text-[#E62E2D] transition-colors whitespace-pre-line">
                          {item.title}
                        </h3>

                        {/* Red Underline Indicator */}
                        <div className="w-6 h-[2px] bg-[#E62E2D] mb-2.5 group-hover:w-12 transition-all duration-300 rounded-full" />

                        <p className="text-xs text-gray-500 leading-relaxed font-normal text-justify line-clamp-4">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* ── Bottom Carousel Controls Bar ───────── */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-3 border-t border-gray-200/70">
              
              {/* Segmented Line Progress Indicator with Label */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-1.5">
                  {itemsList.map((_: any, sIdx: number) => {
                    const isPassedOrActive = sIdx <= activeIndex;
                    return (
                      <div
                        key={sIdx}
                        className={`h-[3px] rounded-full transition-all duration-300 ${
                          sIdx === activeIndex
                            ? "w-8 bg-[#E62E2D]"
                            : isPassedOrActive
                            ? "w-4 bg-red-300"
                            : "w-4 bg-gray-300"
                        }`}
                      />
                    );
                  })}
                </div>

                <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase whitespace-nowrap ml-2">
                  {itemsList.length} PRINCIPLES
                </span>
              </div>

              {/* Navigation Round Arrow Buttons */}
              <div className="flex items-center gap-2.5 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => handleScroll("left")}
                  disabled={!canScrollLeft}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 cursor-pointer ${
                    canScrollLeft
                      ? "bg-white border-gray-200 text-gray-800 shadow-sm hover:border-[#E62E2D] hover:text-[#E62E2D] active:scale-95"
                      : "bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed"
                  }`}
                  aria-label="Previous card"
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => handleScroll("right")}
                  disabled={!canScrollRight}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer ${
                    canScrollRight
                      ? "bg-[#E62E2D] text-white hover:bg-red-700 active:scale-95"
                      : "bg-red-300 text-white/60 cursor-not-allowed"
                  }`}
                  aria-label="Next card"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
