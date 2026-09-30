"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutGrid, 
  Building2, 
  Factory, 
  Settings, 
  Landmark, 
  Wrench, 
  ChevronDown, 
  MapPin, 
  ArrowRight, 
  BarChart3, 
  Users, 
  Cog, 
  X,
  CheckCircle2
} from "lucide-react";

export interface ProjectCardItem {
  id: string;
  title: string;
  category: "Construction" | "Industrial" | "Equipment" | "Infrastructure" | "Maintenance";
  location: string;
  image: string;
  desc?: string;
  year?: string;
  metrics?: { label: string; value: string }[];
}

const allProjectsData: ProjectCardItem[] = [
  // Row 1
  {
    id: "p1",
    title: "Petrochemical Processing Facility",
    category: "Industrial",
    location: "Jubail, Saudi Arabia",
    image: "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=800&auto=format&fit=crop",
    desc: "Complete civil sub-structures, pipe racks, and foundations for a large-scale petrochemical plant turnaround.",
    year: "2024",
    metrics: [{ label: "Concrete", value: "14,500 m³" }, { label: "HSE", value: "Zero LTI" }]
  },
  {
    id: "p2",
    title: "Industrial Warehouse Complex",
    category: "Construction",
    location: "Riyadh, Saudi Arabia",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop",
    desc: "Turnkey multi-bay pre-engineered steel warehouse facility with high-load slab flooring and office annex.",
    year: "2023",
    metrics: [{ label: "Floor Area", value: "32,000 m²" }, { label: "Steel", value: "1,200 Tons" }]
  },
  {
    id: "p3",
    title: "Oil & Gas Storage Tanks",
    category: "Infrastructure",
    location: "Dammam, Saudi Arabia",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    desc: "Foundation excavation, ring beam construction, and containment dykes for multi-tank hydrocarbon storage park.",
    year: "2024",
    metrics: [{ label: "Capacity", value: "120,000 bbl" }, { label: "Tanks", value: "6 Units" }]
  },

  // Row 2
  {
    id: "p4",
    title: "Steel Structure Installation",
    category: "Construction",
    location: "Ras Al Khair, Saudi Arabia",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356f12?q=80&w=800&auto=format&fit=crop",
    desc: "High-altitude crane lifting and precision structural steel erection for marine export terminal conveyor systems.",
    year: "2023 - 2024",
    metrics: [{ label: "Height", value: "48 Meters" }, { label: "Steel Erection", value: "2,400 Tons" }]
  },
  {
    id: "p5",
    title: "Industrial Plant Maintenance",
    category: "Maintenance",
    location: "Yanbu, Saudi Arabia",
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=800&auto=format&fit=crop",
    desc: "45-day scheduled turnaround outage, valve overhauls, high-pressure line tie-ins, and scaffolding access.",
    year: "2024",
    metrics: [{ label: "Crew", value: "180 Technicians" }, { label: "Duration", value: "45 Days" }]
  },
  {
    id: "p6",
    title: "Operations & Logistics Facility",
    category: "Construction",
    location: "NEOM, Saudi Arabia",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
    desc: "Architectural precast concrete corporate operations hub with insulated thermal building envelope.",
    year: "2024",
    metrics: [{ label: "LEED Target", value: "Gold" }, { label: "Footprint", value: "18,000 m²" }]
  },

  // Row 3
  {
    id: "p7",
    title: "Mechanical & Piping Works",
    category: "Industrial",
    location: "Jeddah, Saudi Arabia",
    image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800&auto=format&fit=crop",
    desc: "Heavy industrial alloy pipe spool fabrication, welding, ultrasonic NDT inspection, and high-pressure manifold commissioning.",
    year: "2023",
    metrics: [{ label: "Spools", value: "1,450 Di" }, { label: "Pass Rate", value: "100% NDT" }]
  },
  {
    id: "p8",
    title: "Fuel Terminal Development",
    category: "Infrastructure",
    location: "Tabuk, Saudi Arabia",
    image: "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?q=80&w=800&auto=format&fit=crop",
    desc: "Turnkey refueling canopy development, underground high-capacity fuel tanks, and automated metering skids.",
    year: "2024",
    metrics: [{ label: "Fuel Pumps", value: "16 Bays" }, { label: "Tankage", value: "250,000 L" }]
  },
  {
    id: "p9",
    title: "Power & Generator Solutions",
    category: "Equipment",
    location: "Riyadh, Saudi Arabia",
    image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=800&auto=format&fit=crop",
    desc: "Installation of 10MW continuous base-load synchronized diesel generator power plants with automated bulk fuel systems.",
    year: "2024",
    metrics: [{ label: "Grid Power", value: "10 MW" }, { label: "Uptime", value: "99.9%" }]
  },

  // Additional projects completing the 24 count
  {
    id: "p10",
    title: "Heavy Crane & Modular Haulage Fleet",
    category: "Equipment",
    location: "Jubail, Saudi Arabia",
    image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?q=80&w=800&auto=format&fit=crop",
    desc: "Mobilization of 200T-500T all-terrain mobile cranes and hydraulic multi-axle trailers for modular heavy lifts.",
    year: "2023",
    metrics: [{ label: "Cranes", value: "8 Units" }, { label: "Capacity", value: "500 Tons" }]
  },
  {
    id: "p11",
    title: "Deep Utility Pipeline Excavation",
    category: "Infrastructure",
    location: "Haradh, Saudi Arabia",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop",
    desc: "Rock trenching, pipeline sand bedding, and backfilling along 38 km cross-country transmission corridor.",
    year: "2023",
    metrics: [{ label: "Distance", value: "38 km" }, { label: "Excavation", value: "75,000 m³" }]
  },
  {
    id: "p12",
    title: "High-Voltage Substation Package",
    category: "Industrial",
    location: "Ras Tanura, Saudi Arabia",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop",
    desc: "Substation foundation construction, high-voltage transformer pads, switchgear erection, and cable loop pre-commissioning.",
    year: "2023",
    metrics: [{ label: "Voltage", value: "115 kV" }, { label: "Transformers", value: "4 Units" }]
  },
  {
    id: "p13",
    title: "Industrial Plant Overhaul & Scaffolding",
    category: "Maintenance",
    location: "Jubail, Saudi Arabia",
    image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop",
    desc: "Erection of 40,000 m³ certified industrial scaffolding for heat exchanger overhaul and plant repainting.",
    year: "2024",
    metrics: [{ label: "Scaffolding", value: "40,000 m³" }, { label: "HSE Pass", value: "100%" }]
  },
  {
    id: "p14",
    title: "Equipment Rental Earthmoving Fleet",
    category: "Equipment",
    location: "Jafurah, Saudi Arabia",
    image: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?q=80&w=800&auto=format&fit=crop",
    desc: "Deployment of CAT bulldozers, 30T articulated dump trucks, and 45T excavators for mass site grading.",
    year: "2023 - 2024",
    metrics: [{ label: "Fleet Count", value: "42 Units" }, { label: "Operators", value: "Certified" }]
  },
  {
    id: "p15",
    title: "Commercial Logistics Distribution Hub",
    category: "Construction",
    location: "Dammam 2nd Industrial City",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop",
    desc: "Construction of refrigerated cold storage warehousing, loading docks, and reinforced concrete access roads.",
    year: "2024",
    metrics: [{ label: "Capacity", value: "45,000 Pallets" }, { label: "Docks", value: "24 Bays" }]
  },
  {
    id: "p16",
    title: "Marine Port Road & Drainage Culverts",
    category: "Infrastructure",
    location: "King Abdulaziz Port Dammam",
    image: "https://images.unsplash.com/photo-1590496793929-36417d3117de?q=80&w=800&auto=format&fit=crop",
    desc: "Heavy container handling asphalt pavement and reinforced stormwater drainage channel construction.",
    year: "2023",
    metrics: [{ label: "Pavement", value: "85,000 m²" }, { label: "Axle Load", value: "120 Tons" }]
  },
  {
    id: "p17",
    title: "Petrochemical Flare Stack Maintenance",
    category: "Industrial",
    location: "Yanbu, Saudi Arabia",
    image: "https://images.unsplash.com/photo-1513828583688-c52646db42da?q=80&w=800&auto=format&fit=crop",
    desc: "Flare tip replacement, ignition line maintenance, and high-altitude specialized rigging at 110 meters height.",
    year: "2023",
    metrics: [{ label: "Stack Height", value: "110 Meters" }, { label: "Rigging", value: "Specialized" }]
  },
  {
    id: "p18",
    title: "Mobile Lighting Towers Fleet Dispatch",
    category: "Equipment",
    location: "Waad Al Shamal, Saudi Arabia",
    image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=800&auto=format&fit=crop",
    desc: "Supply and continuous maintenance of 50 low-emission diesel and solar-hybrid LED lighting towers.",
    year: "2024",
    metrics: [{ label: "Towers", value: "50 Units" }, { label: "Coverage", value: "Full Site" }]
  },
  {
    id: "p19",
    title: "Desalination Intake Concrete Pumping",
    category: "Construction",
    location: "Rabigh, Saudi Arabia",
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?q=80&w=800&auto=format&fit=crop",
    desc: "Underwater and coastal reinforced marine concrete pumping for sea water cooling intake structures.",
    year: "2023",
    metrics: [{ label: "Marine Concrete", value: "22,000 m³" }, { label: "Resistance", value: "Sulfate Spec" }]
  },
  {
    id: "p20",
    title: "Precast Concrete Blast Wall System",
    category: "Construction",
    location: "Shaybah, Saudi Arabia",
    image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop",
    desc: "Fabrication and crane placement of 8-meter high reinforced blast-proof security perimeter walls.",
    year: "2024",
    metrics: [{ label: "Wall Length", value: "4.5 km" }, { label: "Blast Rating", value: "Aramco Standard" }]
  },
  {
    id: "p21",
    title: "Air Compressor & Pneumatic Fleet",
    category: "Equipment",
    location: "Dammam Industrial City",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop",
    desc: "High-pressure diesel portable air compressors (750 to 1600 CFM) for abrasive grit blasting and pipe testing.",
    year: "2024",
    metrics: [{ label: "Pressure", value: "350 PSI" }, { label: "Fleet", value: "18 Units" }]
  },
  {
    id: "p22",
    title: "Gas Processing Foundation Shoring",
    category: "Construction",
    location: "Fadhili, Saudi Arabia",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop",
    desc: "Sheet piling shoring and dewatering for heavy gas compression turbine machine foundation pits.",
    year: "2023",
    metrics: [{ label: "Depth", value: "14 Meters" }, { label: "Dewatering", value: "24/7 Active" }]
  },
  {
    id: "p23",
    title: "Industrial Chemical Plant Pipe Rack",
    category: "Industrial",
    location: "Al Jubail, Saudi Arabia",
    image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=800&auto=format&fit=crop",
    desc: "Dual-tier steel pipe rack assembly with stainless steel acid line routing and expansion loop testing.",
    year: "2024",
    metrics: [{ label: "Rack Length", value: "850 Meters" }, { label: "Lines", value: "32 Runs" }]
  },
  {
    id: "p24",
    title: "Refinery Crude Tank Bottom Replacement",
    category: "Industrial",
    location: "Ras Tanura, Saudi Arabia",
    image: "https://images.unsplash.com/photo-1530639834083-9a21640e3a78?q=80&w=800&auto=format&fit=crop",
    desc: "Cutting, rigging, automated orbital welding, and vacuum testing of 60-meter diameter crude tank annular plates.",
    year: "2023 - 2024",
    metrics: [{ label: "Diameter", value: "60 Meters" }, { label: "Vacuum Test", value: "100% Pass" }]
  }
];

export default function ProjectsListingClient() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest" | "name">("latest");
  const [selectedProject, setSelectedProject] = useState<ProjectCardItem | null>(null);

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      all: allProjectsData.length,
      Construction: allProjectsData.filter((p) => p.category === "Construction").length,
      Industrial: allProjectsData.filter((p) => p.category === "Industrial").length,
      Equipment: allProjectsData.filter((p) => p.category === "Equipment").length,
      Infrastructure: allProjectsData.filter((p) => p.category === "Infrastructure").length,
      Maintenance: allProjectsData.filter((p) => p.category === "Maintenance").length,
    };
  }, []);

  // Filtered & sorted projects
  const filteredProjects = useMemo(() => {
    let list = allProjectsData.filter((p) => {
      if (activeCategory === "all") return true;
      return p.category === activeCategory;
    });

    if (sortOrder === "name") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === "oldest") {
      list.sort((a, b) => a.id.localeCompare(b.id));
    } else {
      // Latest First (default)
      list.sort((a, b) => b.id.localeCompare(a.id));
    }

    return list;
  }, [activeCategory, sortOrder]);

  return (
    <div className="w-full bg-[#fdfdfd] py-12 md:py-16">
      <div className="max-w-[1650px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* ══════════════════════════════════════════════════════════════
            1. SECTION HEADER (Exact Title, Badge & Subtext)
        ══════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 md:mb-10">
          <div>
            {/* Red Dash Badge */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-[2.5px] bg-[#E62E2D]" />
              <span className="text-[#E62E2D] font-bold text-xs tracking-widest uppercase">
                OUR PROJECTS
              </span>
            </div>

            {/* Main Headline with Red Accent */}
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-[#111] leading-tight">
              Projects That <span className="text-[#E62E2D]">Make an Impact</span>
            </h2>
          </div>

          {/* Right Subtitle with Left Border */}
          <div className="border-l-2 border-gray-300/80 pl-6 py-1 max-w-xl">
            <p className="text-gray-500 text-sm sm:text-[14.5px] leading-relaxed">
              Explore our diverse portfolio of successfully delivered projects across construction, industrial, and infrastructure sectors in Saudi Arabia and beyond.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            2. FILTER PILLS & SORTING ROW
        ══════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8">
          
          {/* Left Category Buttons Strip */}
          <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {/* All Projects (24) */}
            <button
              onClick={() => setActiveCategory("all")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 cursor-pointer shadow-2xs ${
                activeCategory === "all"
                  ? "bg-[#E62E2D] text-white shadow-md shadow-red-600/20"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <LayoutGrid size={15} className={activeCategory === "all" ? "text-white" : "text-gray-500"} />
              <span>All Projects ({categoryCounts.all})</span>
            </button>

            {/* Construction (8) */}
            <button
              onClick={() => setActiveCategory("Construction")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 cursor-pointer shadow-2xs ${
                activeCategory === "Construction"
                  ? "bg-[#E62E2D] text-white shadow-md shadow-red-600/20"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <Building2 size={15} className={activeCategory === "Construction" ? "text-white" : "text-gray-500"} />
              <span>Construction ({categoryCounts.Construction})</span>
            </button>

            {/* Industrial (6) */}
            <button
              onClick={() => setActiveCategory("Industrial")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 cursor-pointer shadow-2xs ${
                activeCategory === "Industrial"
                  ? "bg-[#E62E2D] text-white shadow-md shadow-red-600/20"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <Factory size={15} className={activeCategory === "Industrial" ? "text-white" : "text-gray-500"} />
              <span>Industrial ({categoryCounts.Industrial})</span>
            </button>

            {/* Equipment (4) */}
            <button
              onClick={() => setActiveCategory("Equipment")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 cursor-pointer shadow-2xs ${
                activeCategory === "Equipment"
                  ? "bg-[#E62E2D] text-white shadow-md shadow-red-600/20"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <Settings size={15} className={activeCategory === "Equipment" ? "text-white" : "text-gray-500"} />
              <span>Equipment ({categoryCounts.Equipment})</span>
            </button>

            {/* Infrastructure (4) */}
            <button
              onClick={() => setActiveCategory("Infrastructure")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 cursor-pointer shadow-2xs ${
                activeCategory === "Infrastructure"
                  ? "bg-[#E62E2D] text-white shadow-md shadow-red-600/20"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <Landmark size={15} className={activeCategory === "Infrastructure" ? "text-white" : "text-gray-500"} />
              <span>Infrastructure ({categoryCounts.Infrastructure})</span>
            </button>

            {/* Maintenance (2) */}
            <button
              onClick={() => setActiveCategory("Maintenance")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 cursor-pointer shadow-2xs ${
                activeCategory === "Maintenance"
                  ? "bg-[#E62E2D] text-white shadow-md shadow-red-600/20"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <Wrench size={15} className={activeCategory === "Maintenance" ? "text-white" : "text-gray-500"} />
              <span>Maintenance ({categoryCounts.Maintenance})</span>
            </button>
          </div>

          {/* Right Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
            <span className="text-xs text-gray-500 font-medium">Sort by</span>
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="appearance-none bg-white border border-gray-200 rounded-xl px-3.5 py-2 pr-8 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#E62E2D] cursor-pointer shadow-2xs"
              >
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Alphabetical</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════════
            3. MAIN SECTION: 3-COL PROJECT CARDS (LEFT) + FEATURED SIDEBAR (RIGHT)
        ══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ── LEFT / MAIN CONTENT (8 cols): 3-Column Project Cards Grid ── */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((proj) => (
                  <motion.div
                    key={proj.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setSelectedProject(proj)}
                    className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                  >
                    {/* Top Image Frame */}
                    <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-gray-900">
                      <img
                        src={proj.image}
                        alt={proj.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                      
                      {/* Dark Category Badge Pill */}
                      <div className="absolute top-3 left-3 z-10 bg-[#0f172a]/80 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-md text-white text-[10.5px] font-semibold tracking-wide">
                        {proj.category}
                      </div>
                    </div>

                    {/* Bottom Card Info */}
                    <div className="p-4 sm:p-4.5 flex-1 flex flex-col justify-between bg-white">
                      <div>
                        {/* Title */}
                        <h3 className="text-[14.5px] font-bold text-gray-900 leading-snug group-hover:text-[#E62E2D] transition-colors mb-2 line-clamp-2">
                          {proj.title}
                        </h3>

                        {/* Location */}
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                          <MapPin size={13} className="shrink-0 text-gray-400" />
                          <span className="truncate">{proj.location}</span>
                        </div>
                      </div>

                      {/* Right Arrow Trigger */}
                      <div className="flex justify-end pt-3">
                        <div className="w-6 h-6 flex items-center justify-center text-gray-400 group-hover:text-[#E62E2D] group-hover:translate-x-1 transition-all">
                          <ArrowRight size={15} />
                        </div>
                      </div>

                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* ── RIGHT SIDEBAR (4 cols): Featured Card + Stats + CTA Banner ── */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. FEATURED PROJECT CARD */}
            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              
              {/* Featured Visual with Top-Left Badge */}
              <div className="relative h-60 w-full overflow-hidden bg-gray-950">
                <img
                  src="https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=1200&auto=format&fit=crop"
                  alt="Integrated Petrochemical Facility"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                
                {/* Top-Left Featured Pill Badge */}
                <div className="absolute top-4 left-4 z-10 bg-[#0b121e]/90 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-lg text-white text-[11px] font-extrabold tracking-wider uppercase">
                  FEATURED PROJECT
                </div>
              </div>

              {/* Featured Project Body */}
              <div className="p-6 sm:p-7">
                {/* Category & Location Tag */}
                <div className="text-[11px] font-black tracking-widest text-[#E62E2D] uppercase mb-2">
                  INDUSTRIAL <span className="text-gray-300 mx-1">|</span> JUBAIL, SAUDI ARABIA
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight mb-3">
                  Integrated Petrochemical Facility
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-xs sm:text-[13.5px] leading-relaxed mb-6">
                  A state-of-the-art petrochemical processing facility featuring advanced engineering, procurement, and construction solutions.
                </p>

                {/* View Project Details Button */}
                <Link
                  href="/contact-us"
                  className="inline-flex items-center gap-2.5 bg-[#0b121e] hover:bg-[#E62E2D] text-white px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md group cursor-pointer"
                >
                  <span>View Project Details</span>
                  <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

            </div>

            {/* 2. STATS 2x2 GRID BOX */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-7 shadow-sm">
              <div className="grid grid-cols-2 gap-6">
                
                {/* Stat 1 */}
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-gray-50 rounded-xl text-gray-700 shrink-0 border border-gray-100">
                    <BarChart3 size={20} />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-gray-900 leading-none">50+</div>
                    <div className="text-xs text-gray-500 font-medium mt-1">Projects Completed</div>
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-gray-50 rounded-xl text-gray-700 shrink-0 border border-gray-100">
                    <Users size={20} />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-gray-900 leading-none">30+</div>
                    <div className="text-xs text-gray-500 font-medium mt-1">Happy Clients</div>
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-gray-50 rounded-xl text-gray-700 shrink-0 border border-gray-100">
                    <Cog size={20} />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-gray-900 leading-none">15+</div>
                    <div className="text-xs text-gray-500 font-medium mt-1">Industries Served</div>
                  </div>
                </div>

                {/* Stat 4 */}
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-gray-50 rounded-xl text-gray-700 shrink-0 border border-gray-100">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-gray-900 leading-none">10+</div>
                    <div className="text-xs text-gray-500 font-medium mt-1">Cities in KSA</div>
                  </div>
                </div>

              </div>
            </div>

            {/* 3. "HAVE A SIMILAR PROJECT?" CTA CARD */}
            <div className="bg-[#0b121e] text-white rounded-3xl p-7 sm:p-8 relative overflow-hidden shadow-xl border border-slate-800">
              
              {/* Subtle Blueprint Grid Pattern Watermark (Bottom Right) */}
              <div 
                className="absolute right-0 bottom-0 w-44 h-44 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' fill='none' stroke='%23ffffff' stroke-width='1.2'%3E%3Cpath d='M10 190V50h40v140M60 190V30h50v160M120 190V70h35v120M165 190V90h25v100'/%3E%3Cpath d='M5 190h190M50 50l30-30M110 30l30 40M155 70l20-30'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'bottom right',
                  backgroundSize: 'contain'
                }}
              />

              <div className="relative z-10">
                {/* Red Dash Eyebrow */}
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-5 h-[2px] bg-[#E62E2D]" />
                  <span className="text-[10px] font-black tracking-widest text-gray-300 uppercase">
                    HAVE A SIMILAR PROJECT?
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-[22px] font-bold text-white leading-snug mb-2.5">
                  Let&apos;s Build <br />
                  Something Great Together
                </h3>

                {/* Subtitle */}
                <p className="text-gray-400 text-xs sm:text-[13px] leading-relaxed mb-6 max-w-xs">
                  Get in touch with our team to discuss your project requirements.
                </p>

                {/* Red CTA Button */}
                <Link
                  href="/contact-us"
                  className="inline-flex items-center gap-2 bg-[#E62E2D] hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-red-900/30 cursor-pointer group"
                >
                  <span>Get a Quote</span>
                  <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════
          4. PROJECT DETAILS POPUP MODAL (When clicking any project)
      ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative border border-gray-100 my-auto"
            >
              {/* Modal Image Header */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-gray-950">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                
                {/* Close Button */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-[#E62E2D] text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>

                {/* Category & Location Badges */}
                <div className="absolute bottom-4 left-6 right-6 z-10 text-white">
                  <span className="inline-block bg-[#E62E2D] px-3 py-1 rounded-md text-[10.5px] font-black uppercase tracking-wider mb-2">
                    {selectedProject.category}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold leading-tight drop-shadow-md">
                    {selectedProject.title}
                  </h3>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-5">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                  <MapPin size={14} className="text-[#E62E2D]" />
                  <span>{selectedProject.location}</span>
                  {selectedProject.year && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span>Executed in {selectedProject.year}</span>
                    </>
                  )}
                </div>

                <p className="text-gray-600 text-sm leading-relaxed">
                  {selectedProject.desc}
                </p>

                {/* Metrics */}
                {selectedProject.metrics && selectedProject.metrics.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {selectedProject.metrics.map((m, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div className="text-xs text-gray-400 font-bold uppercase">{m.label}</div>
                        <div className="text-base font-extrabold text-gray-900">{m.value}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                  >
                    Close
                  </button>
                  <Link
                    href="/contact-us"
                    className="px-6 py-2.5 rounded-xl bg-[#E62E2D] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition shadow-md cursor-pointer flex items-center gap-2"
                  >
                    <span>Request RFQ for Similar Scope</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
