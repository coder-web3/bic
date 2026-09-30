"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Search,
  Home,
  ArrowLeft,
  Phone,
  Mail,
  HardHat,
  Truck,
  Users,
  PackageCheck,
  BookOpen,
  Briefcase,
  ChevronRight,
  AlertTriangle,
  HelpCircle,
  Compass,
  ArrowRight,
} from "lucide-react";

interface SearchDestination {
  title: string;
  category: string;
  href: string;
  keywords: string[];
}

const SEARCH_DESTINATIONS: SearchDestination[] = [
  {
    title: "Civil & Turnkey Contracting Services",
    category: "Services",
    href: "/services/contracting-services",
    keywords: ["contracting", "civil", "epc", "turnkey", "construction", "concrete", "earthwork", "foundation"],
  },
  {
    title: "Heavy Equipment Rental & Fleet Solutions",
    category: "Equipment",
    href: "/services/equipment-rental",
    keywords: ["equipment", "rental", "crane", "forklift", "excavator", "boom truck", "lowbed", "fleet", "heavy machinery"],
  },
  {
    title: "Certified Industrial Manpower Supply",
    category: "Manpower",
    href: "/services/manpower-supply",
    keywords: ["manpower", "labor", "workers", "technicians", "engineers", "aramco certified", "riggers", "welders", "safety officers"],
  },
  {
    title: "Industrial & Structural Material Supply",
    category: "Materials",
    href: "/services/industrial-material-supply",
    keywords: ["materials", "piping", "flanges", "valves", "steel", "structural", "fittings", "gaskets", "electrical supply"],
  },
  {
    title: "All Engineering Services & Capabilities",
    category: "Overview",
    href: "/services",
    keywords: ["all services", "solutions", "capabilities", "industrial operations", "maintenance"],
  },
  {
    title: "Completed EPC Projects & Case Studies",
    category: "Portfolio",
    href: "/projects",
    keywords: ["projects", "case studies", "turnaround", "refinery", "completed works", "sabic", "aramco"],
  },
  {
    title: "Technical Insights & Engineering Blog",
    category: "Knowledge Base",
    href: "/blog",
    keywords: ["blog", "articles", "technical papers", "insights", "safety standards", "industry news", "vision 2030"],
  },
  {
    title: "About Best International Contracting (BiC)",
    category: "Company",
    href: "/about-us",
    keywords: ["about", "company", "leadership", "mission", "vision", "safety policy", "iso certification"],
  },
  {
    title: "Clients & Trusted Industry Partners",
    category: "Partners",
    href: "/clients",
    keywords: ["clients", "partners", "aramco", "sabic", "sec", "hyundai", "samsung engineering", "testimonials"],
  },
  {
    title: "Contact Engineering Directorate & RFQ Quotes",
    category: "Contact",
    href: "/contact-us",
    keywords: ["contact", "rfq", "quote", "inquiry", "phone", "email", "office", "dammam", "jubail", "khobar"],
  },
];

const POPULAR_PAGES = [
  {
    title: "Contracting Services",
    desc: "Turnkey civil, mechanical, piping, and EPC site execution.",
    href: "/services/contracting-services",
    icon: HardHat,
    color: "from-red-500/20 to-orange-500/10",
    border: "group-hover:border-red-500/40",
    badge: "EPC & Civil",
  },
  {
    title: "Heavy Equipment Rental",
    desc: "Aramco-certified mobile cranes, boom trucks & heavy haulage.",
    href: "/services/equipment-rental",
    icon: Truck,
    color: "from-amber-500/20 to-yellow-500/10",
    border: "group-hover:border-amber-500/40",
    badge: "Certified Fleet",
  },
  {
    title: "Manpower Supply",
    desc: "Certified HSE officers, QA/QC inspectors, welders & riggers.",
    href: "/services/manpower-supply",
    icon: Users,
    color: "from-blue-500/20 to-cyan-500/10",
    border: "group-hover:border-blue-500/40",
    badge: "Aramco Approved",
  },
  {
    title: "Technical Articles & Blog",
    desc: "Compliance benchmarks, turnaround strategies & Vision 2030 updates.",
    href: "/blog",
    icon: BookOpen,
    color: "from-emerald-500/20 to-teal-500/10",
    border: "group-hover:border-emerald-500/40",
    badge: "Engineering Papers",
  },
];

export default function NotFound() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  React.useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = "404 - Page Not Located | BiC";
    }
  }, []);

  // Filter search destinations dynamically
  const filteredDestinations = query.trim()
    ? SEARCH_DESTINATIONS.filter((item) => {
        const q = query.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        const matchesKeywords = item.keywords.some((k) => k.toLowerCase().includes(q));
        return matchesTitle || matchesCategory || matchesKeywords;
      }).slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (filteredDestinations.length > 0) {
      router.push(filteredDestinations[0].href);
    } else {
      router.push(`/services`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090e] text-slate-100 selection:bg-[#E62E2D] selection:text-white relative overflow-x-hidden">
      <Header />

      {/* ── BACKGROUND INDUSTRIAL GRID & GLOW EFFECTS ──────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Ambient Red Glow Top */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#E62E2D]/15 rounded-full blur-[140px]" />
        
        {/* Ambient Dark Blue Glow Bottom */}
        <div className="absolute -bottom-40 right-10 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px]" />

        {/* Diagonal Brand Accent Bar */}
        <div
          className="absolute top-0 left-0 w-2 h-full bg-[#E62E2D]"
          style={{ boxShadow: "4px 0 24px rgba(230,46,45,0.4)" }}
        />

        {/* Top-Right Red Corner Wedge */}
        <div
          className="absolute top-0 right-0 w-32 h-32 md:w-56 md:h-56 bg-[#E62E2D]/15 pointer-events-none"
          style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
        />

        {/* Subtle Engineering Dot Grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* ── MAIN CONTENT CONTAINER ─────────────────────────────────── */}
      <main className="flex-1 pt-44 sm:pt-48 md:pt-52 pb-24 px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl mx-auto w-full flex flex-col justify-center">
        
        {/* ── HERO 404 SECTION ───────────────────────────────────────── */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-[#E62E2D] text-xs font-black tracking-widest uppercase shadow-[0_0_15px_rgba(230,46,45,0.15)]">
            <span className="w-2 h-2 rounded-full bg-[#E62E2D] animate-ping" />
            <span>HTTP 404 · PAGE NOT LOCATED</span>
          </div>

          {/* Giant Industrial 404 Graphic */}
          <div className="relative select-none py-2">
            <h1 className="text-7xl sm:text-9xl md:text-[140px] font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-600 drop-shadow-2xl">
              4<span className="text-[#E62E2D] drop-shadow-[0_0_35px_rgba(230,46,45,0.6)]">0</span>4
            </h1>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#E62E2D] to-transparent rounded-full" />
          </div>

          {/* Headline & Description */}
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Blueprint Specification Missing or Relocated
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
              The technical paper, service endpoint, or resource directory you are trying to access has been archived, renamed, or does not exist on this server.
            </p>
          </div>

          {/* ── INTERACTIVE LIVE SEARCH BAR ──────────────────────────── */}
          <div className="pt-2 max-w-xl mx-auto relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative flex items-center">
                <Search size={18} className="absolute left-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                  placeholder="Search services, heavy equipment, manpower, blog..."
                  className="w-full pl-11 pr-28 py-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#E62E2D] focus:bg-white/10 focus:outline-none text-white text-xs sm:text-sm transition backdrop-blur-md shadow-lg shadow-black/40 font-medium placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#E62E2D] to-red-700 hover:from-red-600 hover:to-red-800 text-white text-xs font-bold transition shadow-md shadow-red-600/25 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Explore</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </form>

            {/* Live Search Suggestions Dropdown */}
            {isFocused && query.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#0c1017] border border-white/15 rounded-2xl p-2 shadow-2xl z-30 space-y-1 backdrop-blur-xl text-left">
                <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-white/5">
                  Suggested Destinations ({filteredDestinations.length})
                </div>

                {filteredDestinations.length > 0 ? (
                  filteredDestinations.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      className="p-3 rounded-xl hover:bg-white/10 flex items-center justify-between group transition cursor-pointer"
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-white group-hover:text-red-400 transition">
                          {item.title}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Domain: <span className="text-slate-300 font-medium">{item.category}</span>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition" />
                    </Link>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400 space-y-2">
                    <p>No exact blueprint found for &ldquo;{query}&rdquo;.</p>
                    <Link
                      href="/services"
                      className="inline-block text-[#E62E2D] hover:underline font-bold text-xs"
                    >
                      Browse full engineering directory &rarr;
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── CORE ACTION BUTTONS ──────────────────────────────────── */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                if (typeof window !== "undefined" && window.history.length > 1) {
                  router.back();
                } else {
                  router.push("/");
                }
              }}
              className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-sm"
            >
              <ArrowLeft size={15} className="text-[#E62E2D]" />
              <span>Previous Page</span>
            </button>

            <Link
              href="/"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#E62E2D] to-red-700 hover:from-red-600 hover:to-red-800 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-600/25 transition cursor-pointer"
            >
              <Home size={15} />
              <span>Return to Homepage</span>
            </Link>

            <Link
              href="/contact-us"
              className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-sm"
            >
              <Mail size={15} className="text-blue-400" />
              <span>Technical RFQ Help</span>
            </Link>
          </div>

        </div>

        {/* ── POPULAR DESTINATION CARDS GRID ───────────────────────── */}
        <div className="mt-16 pt-12 border-t border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-[#E62E2D] text-xs font-black uppercase tracking-wider">
                <Compass size={14} />
                <span>Quick Operational Directory</span>
              </div>
              <h3 className="text-lg font-bold text-white">Popular Industrial Solutions</h3>
            </div>

            <Link
              href="/services"
              className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition"
            >
              <span>View All Capabilities</span>
              <ChevronRight size={14} className="text-[#E62E2D]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {POPULAR_PAGES.map((page, index) => {
              const Icon = page.icon;
              return (
                <Link
                  key={index}
                  href={page.href}
                  className={`group p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 ${page.border} transition-all duration-300 flex flex-col justify-between space-y-4 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${page.color} border border-white/10 flex items-center justify-center text-white`}>
                        <Icon size={20} className="text-[#E62E2D]" />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-400 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                        {page.badge}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white group-hover:text-[#E62E2D] transition">
                        {page.title}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                        {page.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-bold text-slate-400 group-hover:text-white transition">
                    <span>Access Department</span>
                    <ArrowRight size={13} className="text-[#E62E2D] group-hover:translate-x-1 transition" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── ASSISTANCE & EMERGENCY HOTLINE FOOTNOTE ──────────────── */}
        <div className="mt-12 bg-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-amber-400 text-xs font-bold">
              <AlertTriangle size={14} />
              <span>Looking for an immediate industrial quote or mobilized equipment?</span>
            </div>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Our engineering coordination and logistics desk in Dammam &amp; Jubail is active 24/7 for Aramco &amp; SABIC shutdown tenders.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a
              href="tel:+966138000000"
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-2 transition"
            >
              <Phone size={13} className="text-[#E62E2D]" />
              <span>+966 13 800 0000</span>
            </a>

            <a
              href="mailto:info@bestinternational.com.sa"
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-2 transition"
            >
              <Mail size={13} className="text-blue-400" />
              <span>info@bestinternational.com.sa</span>
            </a>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
