"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface Crumb {
  label: string;
  href?: string;
}

interface PageHeroProps {
  /** Tiny red badge text, e.g. "WHO WE ARE" */
  badge?: string;
  /** Large headline */
  title: string;
  /** Optional red-highlighted word(s) inside the title */
  titleAccent?: string;
  /** Sub-description */
  description?: string;
  /** Breadcrumb trail */
  breadcrumbs?: Crumb[];
  /** Full-bleed background image URL */
  bgImage?: string;
  /** Watermark text (top-right ghost text) */
  watermark?: string;
  /** Quick-stat pills shown in the bottom strip */
  stats?: { value: string; label: string }[];
  /** Right-side decorative tag lines */
  taglines?: string[];
  /** Optional angled bottom divider, defaults to false */
  showDivider?: boolean;
}

export default function PageHero({
  badge,
  title,
  titleAccent,
  description,
  breadcrumbs = [],
  bgImage = "https://images.unsplash.com/photo-1504307651254-35680f356f12?q=80&w=2070&auto=format&fit=crop",
  watermark = "BIC",
  stats,
  taglines,
  showDivider = false,
}: PageHeroProps) {
  return (
    <section className="relative w-full min-h-[50vh] md:min-h-[58vh] flex flex-col justify-between overflow-hidden bg-[#090c10]">

      {/* ── 1. Background industrial image ─────────────── */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${bgImage}')` }}
      />

      {/* ── 2. Multi-layer dark gradient overlay ─────── */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#060810]/97 via-[#060810]/85 to-[#060810]/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#060810] via-transparent to-transparent" />

      {/* ── 3. Red diagonal accent bar (left edge) ─────── */}
      <div
        className="absolute top-0 left-0 w-1.5 md:w-2 h-full bg-[#E62E2D]"
        style={{ boxShadow: "4px 0 24px rgba(230,46,45,0.4)" }}
      />

      {/* ── 4. Angled red corner wedge (top-left) ─────── */}
      <div
        className="absolute top-0 left-0 w-[220px] md:w-[320px] h-[120px] md:h-[160px] bg-[#E62E2D]/10 pointer-events-none"
        style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
      />

      {/* ── 5. Top-right red wedge ─────── */}
      <div
        className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-[#E62E2D] pointer-events-none z-0"
        style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
      />

      {/* ── 6. Ghost dot-grid watermark ─────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* ── 7. Giant watermark text ─────── */}
      <div className="absolute right-6 md:right-16 top-1/2 -translate-y-1/2 select-none pointer-events-none z-0">
        <span className="text-[100px] md:text-[180px] lg:text-[220px] font-black text-white/[0.04] leading-none tracking-tighter">
          {watermark}
        </span>
      </div>

      {/* ── 8. Ambient red glow orb ─────── */}
      <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-[#E62E2D] rounded-full blur-[180px] opacity-[0.07] pointer-events-none" />

      {/* ══════════ MAIN CONTENT ══════════ */}
      <div className="relative z-10 flex flex-col justify-center flex-1 w-full max-w-[1650px] mx-auto px-6 sm:px-10 lg:px-16 pt-16 md:pt-20 pb-8">

        {/* ── Breadcrumb trail ─────────────── */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          aria-label="Breadcrumb"
          className="flex items-center gap-2 mb-6 md:mb-8"
        >
          <Link
            href="/"
            className="text-[11px] font-bold tracking-[0.18em] text-gray-400 uppercase hover:text-white transition-colors"
          >
            Home
          </Link>
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-[#E62E2D] shrink-0">
                <path d="m9 18 6-6-6-6" />
              </svg>
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="text-[11px] font-bold tracking-[0.18em] text-gray-400 uppercase hover:text-white transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[11px] font-bold tracking-[0.18em] text-white uppercase">
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </motion.nav>

        {/* ── Two-column layout ─────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-16">

          {/* Left: badge + headline */}
          <div className="flex-none max-w-2xl">
            {badge && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="flex items-center gap-3 mb-5"
              >
                <div className="w-10 h-[2px] bg-[#E62E2D]" />
                <span className="text-[#E62E2D] font-bold text-[11px] tracking-[0.22em] uppercase">
                  {badge}
                </span>
              </motion.div>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.15 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold leading-tight tracking-tight text-white"
            >
              {title}
              {titleAccent && (
                <span className="text-[#E62E2D]"> {titleAccent}</span>
              )}
            </motion.h1>

            {description && (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="mt-5 text-gray-400 text-sm sm:text-[15px] leading-relaxed max-w-xl font-normal text-justify"
              >
                {description}
              </motion.p>
            )}
          </div>

          {/* Right: taglines */}
          {taglines && taglines.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden lg:flex flex-col gap-3 border-l-2 border-[#E62E2D]/40 pl-6 pb-1"
            >
              {taglines.map((t, i) => (
                <span
                  key={i}
                  className="text-[11px] font-bold tracking-[0.22em] uppercase text-gray-400"
                >
                  {t}
                </span>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* ══════════ BOTTOM STATS STRIP ══════════ */}
      {stats && stats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative z-20 w-full border-t border-white/10 bg-black/60 backdrop-blur-md"
        >
          <div className="w-full max-w-[1650px] mx-auto px-6 sm:px-10 lg:px-16 py-5">
            <div className="flex flex-wrap items-center gap-6 md:gap-10">
              {stats.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  {i > 0 && (
                    <div className="hidden sm:block w-px h-6 bg-white/15" />
                  )}
                  <span className="text-xl md:text-2xl font-black text-white leading-none">
                    {s.value}
                  </span>
                  <span className="text-[11px] font-semibold text-gray-400 tracking-widest uppercase">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Optional angled bottom divider - disabled by default */}
      {showDivider && (
        <div className="absolute bottom-0 left-0 right-0 z-[5] pointer-events-none">
          <svg
            viewBox="0 0 1440 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
            preserveAspectRatio="none"
          >
            <path d="M0 56 L1440 0 L1440 56 Z" fill="white" />
          </svg>
        </div>
      )}

    </section>
  );
}
