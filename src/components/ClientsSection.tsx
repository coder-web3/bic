"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, animate } from "framer-motion";
import Image from "next/image";

/* ──────────────────────────────────────────────
   Continuously looping slot counter
   ① 0 → target  (slow count-up, 2.4 s)
   ② hold 4.5 s
   ③ dip to ~88 % then recover (live-data feel)
   ④ hold 5 s → reset → repeat
────────────────────────────────────────────── */
function SlotCounter({ to, suffix }: { to: number; suffix: string }) {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const digitRef = useRef<HTMLSpanElement>(null);
  const inView   = useInView(wrapRef, { once: true, amount: 0.1 });

  useEffect(() => {
    if (!inView) return;
    let active = true;

    const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    const run = async () => {
      while (active) {
        /* ① count up */
        await animate(0, to, {
          duration: 2.4,
          ease: "easeOut",
          onUpdate(v) {
            if (digitRef.current) digitRef.current.textContent = Math.round(v).toString();
          },
        });

        /* ② hold at target */
        await sleep(4500);
        if (!active) break;

        /* ③ subtle dip then recover – feels like a live ticker */
        const dip = Math.max(0, Math.floor(to * 0.88));
        await animate(to, dip, {
          duration: 0.35,
          ease: "easeIn",
          onUpdate(v) {
            if (digitRef.current) digitRef.current.textContent = Math.round(v).toString();
          },
        });
        await animate(dip, to, {
          duration: 0.9,
          ease: "easeOut",
          onUpdate(v) {
            if (digitRef.current) digitRef.current.textContent = Math.round(v).toString();
          },
        });

        /* ④ hold then silent-reset and loop */
        await sleep(5000);
        if (!active) break;
        if (digitRef.current) digitRef.current.textContent = "0";
        await sleep(80); // one frame gap so reset is invisible
      }
    };

    run();
    return () => { active = false; };
  }, [inView, to]);

  return (
    <div ref={wrapRef} className="flex items-baseline gap-0">
      <span
        ref={digitRef}
        className="text-3xl md:text-4xl font-extrabold text-[#0f172a] leading-none tabular-nums"
      >
        0
      </span>
      <span className="text-2xl md:text-3xl font-extrabold text-[#E62E2D] leading-none">
        {suffix}
      </span>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Main Section
────────────────────────────────────────────── */
export default function ClientsSection({ data }: { data?: any }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const content = data || {
    clients: [
      {
        name: "Samsung Engineering",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/320px-Samsung_Logo.svg.png",
        fallback: "SAMSUNG\nENGINEERING",
        color: "#1428A0",
      },
      {
        name: "Hyundai Engineering & Construction",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Hyundai_Motor_Company_logo.svg/320px-Hyundai_Motor_Company_logo.svg.png",
        fallback: "HYUNDAI",
        color: "#003087",
      },
      {
        name: "Sicim",
        logo: "https://www.sicim.eu/wp-content/uploads/2020/02/sicim-logo.png",
        fallback: "SICIM",
        color: "#E62E2D",
      },
      {
        name: "Archirodon",
        logo: "https://www.archirodon.net/wp-content/uploads/2021/04/archirodon-logo.png",
        fallback: "ARCHIRODON",
        color: "#004B87",
      },
      {
        name: "ALEC Contracting",
        logo: "https://alec.ae/wp-content/uploads/2023/01/ALEC-Logo.png",
        fallback: "ALEC",
        color: "#E62E2D",
      },
      {
        name: "Saudi Aramco",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Saudi_Aramco_Logo.svg/320px-Saudi_Aramco_Logo.svg.png",
        fallback: "ARAMCO",
        color: "#009A44",
      },
      {
        name: "SABIC",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/SABIC_Logo.svg/320px-SABIC_Logo.svg.png",
        fallback: "SABIC",
        color: "#009A44",
      },
    ],
    stats: [
      {
        num: "30+",
        raw: 30,
        label: "Years of Success",
        suffix: "+",
        iconSvg:
          '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
      },
      {
        num: "100+",
        raw: 100,
        label: "Clients Served",
        suffix: "+",
        iconSvg:
          '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
      },
      {
        num: "200+",
        raw: 200,
        label: "Projects Delivered",
        suffix: "+",
        iconSvg:
          '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/>',
      },
      {
        num: "99%",
        raw: 99,
        label: "Client Retention",
        suffix: "%",
        iconSvg:
          '<path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>',
      },
    ],
  };

  const [isDragging, setIsDragging] = useState(false);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);

  /* scroll logic */
  const checkScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
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
  }, [content.clients]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    isDownRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeftRef.current = sliderRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDownRef.current || !sliderRef.current) return;
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.4;
    if (Math.abs(walk) > 4) {
      if (!isDragging) setIsDragging(true);
      hasMovedRef.current = true;
    }
    sliderRef.current.scrollLeft = scrollLeftRef.current - walk;
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

  const slide = (dir: "left" | "right") => {
    if (!sliderRef.current) return;
    const amt = sliderRef.current.clientWidth * 0.6;
    sliderRef.current.scrollTo({
      left:
        dir === "left"
          ? sliderRef.current.scrollLeft - amt
          : sliderRef.current.scrollLeft + amt,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full bg-white relative overflow-hidden">
      {/* ── decorative top-right red wedge ── */}
      <div
        className="absolute top-0 right-0 w-40 h-40 md:w-56 md:h-56 bg-[#E62E2D] z-0 pointer-events-none"
        style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
      />

      {/* ── decorative bottom-left dark wedge ── */}
      <div
        className="absolute bottom-0 left-0 w-36 h-36 md:w-52 md:h-52 bg-[#111] z-0 pointer-events-none"
        style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%)" }}
      />

      {/* ── world-map dot watermark ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(#9ca3af 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />

      {/* ── industrial photo, right side ── */}
      <div className="absolute top-0 right-0 bottom-0 w-[38%] md:w-[32%] z-0 pointer-events-none hidden lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1513828583688-c52646db42da?q=80&w=800&auto=format&fit=crop')",
          }}
        />
        {/* fade mask so it blends left */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent" />
      </div>

      {/* ══════════════════════════════════════════
          UPPER BLOCK
      ══════════════════════════════════════════ */}
      <div className="relative z-10 w-full max-w-[1650px] mx-auto px-6 sm:px-10 lg:px-14 pt-14 pb-10 md:pt-16 md:pb-12">
        <div className="flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-16">
          {/* ── LEFT: heading ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-none lg:w-[38%] xl:w-[34%]"
          >
            {/* badge */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-[2px] bg-[#E62E2D]" />
              <span className="text-[#E62E2D] font-bold text-xs tracking-widest uppercase">
                TRUSTED PARTNERSHIPS
              </span>
            </div>

            {/* headline */}
            <h2 className="text-2xl md:text-3xl lg:text-[32px] font-bold leading-[1.15] tracking-tight text-[#0f172a] mb-4">
              We Proudly Serve{" "}
              <span className="text-[#E62E2D] block text-5xl md:text-6xl leading-none my-1">
                100+
              </span>
              Industry Leaders
            </h2>

            <p className="text-gray-500 text-sm md:text-base leading-relaxed mt-4 max-w-xs">
              Long-term partnerships built on reliability, safety compliance,
              and consistent execution across Saudi Arabia.
            </p>

            {/* PEOPLE | SOLUTIONS | PROGRESS */}
            <div className="flex items-center gap-2 mt-8 text-[11px] font-bold tracking-[0.18em] text-gray-400 uppercase">
              <div className="w-8 h-[2px] bg-[#E62E2D] mr-1" />
              <span>PEOPLE</span>
              <span className="text-gray-300">|</span>
              <span>SOLUTIONS</span>
              <span className="text-gray-300">|</span>
              <span>PROGRESS</span>
            </div>
          </motion.div>

          {/* ── RIGHT: logo slider ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex-1 min-w-0"
          >
            {/* slider header row */}
            <div className="flex items-center justify-between mb-4 gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold tracking-[0.2em] text-gray-500 uppercase">
                  KEY CLIENTS &amp; CONTRACTORS
                </span>
                <div className="flex-1 h-[1px] bg-gray-300 w-16 md:w-24" />
              </div>

              {/* arrow buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => slide("left")}
                  disabled={!canScrollLeft}
                  aria-label="Previous"
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 shadow-sm ${
                    canScrollLeft
                      ? "border-gray-300 text-gray-700 bg-white hover:bg-gray-100 active:scale-95"
                      : "border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed opacity-50"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
                <button
                  onClick={() => slide("right")}
                  disabled={!canScrollRight}
                  aria-label="Next"
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
                    canScrollRight
                      ? "bg-[#E62E2D] text-white hover:bg-red-700 active:scale-95"
                      : "bg-red-200 text-white cursor-not-allowed opacity-50"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* scrollable logo strip */}
            <div
              ref={sliderRef}
              data-lenis-prevent
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              className={`flex gap-4 overflow-x-auto pb-2 hide-scrollbar overscroll-x-contain ${
                isDragging ? "snap-none scroll-auto cursor-grabbing select-none" : "snap-x snap-mandatory scroll-smooth cursor-grab"
              }`}
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {content.clients.map((client: any, idx: number) => (
                <div
                  key={idx}
                  onClickCapture={handleLinkClickCapture}
                  className="snap-start flex-none w-[160px] md:w-[180px] h-[80px] md:h-[88px] bg-white border border-gray-200 rounded-xl flex items-center justify-center px-5 shadow-sm hover:shadow-md hover:border-[#E62E2D]/50 transition-all duration-300 group cursor-pointer"
                >
                  <img
                    src={client.logo}
                    alt={client.name}
                    referrerPolicy="no-referrer"
                    className="max-w-[130px] max-h-[50px] w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const parent = e.currentTarget.parentElement;
                      if (parent && !parent.querySelector(".fb-txt")) {
                        const sp = document.createElement("span");
                        sp.className =
                          "fb-txt font-black text-center text-xs tracking-wider leading-tight";
                        sp.style.color = client.color || "#333";
                        sp.innerText = client.fallback || client.name;
                        parent.appendChild(sp);
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          LOWER STATS ROW
      ══════════════════════════════════════════ */}
      <div className="relative z-10 w-full border-t border-gray-100 bg-white/80">
        <div className="w-full max-w-[1650px] mx-auto px-6 sm:px-10 lg:px-14 py-8 md:py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {content.stats.map((stat: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="flex items-center gap-4 bg-[#fafafa] border border-gray-100 rounded-xl px-5 py-5 shadow-sm hover:shadow-md hover:border-[#E62E2D]/30 transition-all duration-300 group"
              >
                {/* icon square with light red bg */}
                <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-[#E62E2D] shrink-0 group-hover:bg-[#E62E2D] group-hover:border-[#E62E2D] group-hover:text-white transition-all duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    dangerouslySetInnerHTML={{ 
                      __html: stat.iconSvg || [
                        '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
                        '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
                        '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/>',
                        '<path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>'
                      ][idx % 4]
                    }}
                  />
                </div>

                {/* number + label */}
                <div>
                  <SlotCounter to={stat.raw} suffix={stat.suffix} />
                  <p className="text-gray-500 text-xs md:text-sm font-medium mt-1">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
