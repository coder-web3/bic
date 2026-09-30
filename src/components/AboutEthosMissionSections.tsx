"use client";

import React from "react";
import {
  ShieldCheck,
  Users,
  Cog,
  Leaf,
  Eye,
  Target,
  Sparkles,
  Building2,
  Award,
  Compass,
} from "lucide-react";

interface AboutEthosMissionSectionsProps {
  ethosData?: any;
  visionMissionData?: any;
}

function renderEthosIcon(iconName: string) {
  switch (iconName) {
    case "Users":
      return <Users size={20} className="stroke-[2]" />;
    case "Cog":
      return <Cog size={20} className="stroke-[2]" />;
    case "Leaf":
      return <Leaf size={20} className="stroke-[2]" />;
    case "Sparkles":
      return <Sparkles size={20} className="stroke-[2]" />;
    case "Award":
      return <Award size={20} className="stroke-[2]" />;
    case "Compass":
      return <Compass size={20} className="stroke-[2]" />;
    case "Building2":
      return <Building2 size={20} className="stroke-[2]" />;
    case "ShieldCheck":
    default:
      return <ShieldCheck size={20} className="stroke-[2]" />;
  }
}

export default function AboutEthosMissionSections({
  ethosData,
  visionMissionData,
}: AboutEthosMissionSectionsProps) {
  const ethos = ethosData || {};
  const vm = visionMissionData || {};

  const ethosBadge = ethos.badge || "OUR ETHOS";
  const ethosLine1 = ethos.headingLine1 || "Built on Values,";
  const ethosHighlight = ethos.headingHighlight || "Driven by Purpose";
  const ethosLead = ethos.leadParagraph || "Our ethos reflects who we are, how we work, and what we stand for.";
  const ethosSecondary = ethos.secondaryParagraph || "It guides every project we undertake and every relationship we build across the Kingdom.";
  const ethosImg = ethos.image || "https://images.unsplash.com/photo-1513828583688-c52646db42da?q=80&w=1200&auto=format&fit=crop";
  const ethosCorner = ethos.cornerBadge || { line1: "STRONG", line2: "VALUES", line3: "LASTING IMPACT" };
  const ethosItems = ethos.items || [
    { id: "ethos-1", icon: "ShieldCheck", title: "Integrity", desc: "We do what is right, always." },
    { id: "ethos-2", icon: "Users", title: "People First", desc: "We value our people, partners and communities." },
    { id: "ethos-3", icon: "Cog", title: "Excellence", desc: "We strive for the highest standards in everything we do." },
    { id: "ethos-4", icon: "Leaf", title: "Sustainability", desc: "We build for a safer, greener and better tomorrow." }
  ];

  const vmBadge = vm.badge || "OUR VISION & MISSION";
  const vmHeadingLine1 = vm.headingLine1 || "Building a";
  const vmHeadingHighlight = vm.headingHighlight || "Stronger Tomorrow";
  const vmDesc = vm.description || "Our vision drives us forward, and our mission keeps us focused — to deliver value, create opportunities, and build a better future.";
  const vmLeftImg = vm.leftImage || "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?q=80&w=1200&auto=format&fit=crop";
  const vmLeftBadge = vm.leftBadge || { line1: "PEOPLE", line2: "PROJECTS", line3: "PROGRESS" };

  const vision = vm.vision || {
    title: "Our Vision",
    desc: "To be a trusted and leading contracting and industrial solutions provider in Saudi Arabia and beyond, recognized for our quality, innovation, and long-term value creation.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop",
    pill: { line1: "A STRONGER", line2: "SAUDI ARABIA", line3: "BEYOND TOMORROW" }
  };

  const mission = vm.mission || {
    title: "Our Mission",
    desc: "To deliver integrated contracting, equipment rental, material supply and manpower solutions with a commitment to safety, quality, and sustainability, empowering our clients and communities to achieve their goals.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop",
    pill: { line1: "PEOPLE", line2: "PARTNERSHIPS", line3: "PROGRESS" }
  };
  return (
    <div className="w-full bg-[#fcfcfc] text-gray-900 space-y-16 md:space-y-24 py-12 md:py-20 overflow-hidden">
      
      {/* ══════════════════════════════════════════════════════════════
          1. OUR ETHOS SECTION
      ══════════════════════════════════════════════════════════════ */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 relative">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)] overflow-hidden relative">
          
          {/* Top Half: Text, Giant Watermark & Industrial Visual */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[360px] relative">
            
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-center relative z-10">
              
              {/* Giant Faint ETHOS Watermark */}
              <div className="absolute right-6 top-6 text-[80px] sm:text-[110px] md:text-[135px] font-bold text-gray-100/90 tracking-widest select-none pointer-events-none uppercase -z-10 leading-none">
                ETHOS
              </div>

              {/* Subheading / Badge */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-[2px] bg-[#E62E2D]" />
                <span className="text-[#E62E2D] font-bold text-sm tracking-widest uppercase">
                  {ethosBadge}
                </span>
              </div>

              {/* Main Heading */}
              <h2 className="text-2xl md:text-3xl lg:text-[32px] font-bold leading-[1.15] tracking-tight text-[#111] mb-6">
                {ethosLine1} <br />
                <span className="text-[#E62E2D]">{ethosHighlight}</span>
              </h2>

              {/* Description Paragraph */}
              <div className="border-l-2 border-[#E62E2D] pl-6 text-gray-600 text-[15px] leading-relaxed max-w-xl">
                {ethosLead && (
                  <p className="font-bold text-gray-800 mb-2">
                    {ethosLead}
                  </p>
                )}
                {ethosSecondary && (
                  <p>
                    {ethosSecondary}
                  </p>
                )}
              </div>
            </div>

            {/* Right Industrial Image with Slanted Wedge (5 cols) */}
            <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full overflow-hidden">
              
              {/* Red Angled Wedge Accent */}
              <div 
                className="absolute -top-1 -left-1 bottom-0 w-16 md:w-20 bg-[#E62E2D] z-20 pointer-events-none hidden lg:block"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 20% 100%, 0 100%)"
                }}
              />

              {/* Industrial Sunset Plant Photo */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('${ethosImg}')`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

              {/* Bottom Right Floating Badge */}
              <div 
                className="absolute bottom-0 right-0 bg-[#111] text-white px-6 py-4 z-20 shadow-2xl flex items-center gap-3.5"
                style={{
                  clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0 100%)"
                }}
              >
                <div className="w-[2px] h-9 bg-[#E62E2D]" />
                <div className="text-[10px] font-bold tracking-[0.25em] uppercase leading-tight text-gray-300 pl-1">
                  <div>{ethosCorner.line1 || "STRONG"}</div>
                  <div>{ethosCorner.line2 || "VALUES"}</div>
                  <div className="text-white font-bold">{ethosCorner.line3 || "LASTING IMPACT"}</div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Half: 4 Ethos Cards Strip */}
          <div className="border-t border-gray-100 bg-[#FAFBFD] p-6 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {ethosItems.map((item: any, idx: number) => (
                <div
                  key={item.id || idx}
                  className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300 flex items-start gap-3.5 group cursor-default"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-[#E62E2D] shrink-0 group-hover:bg-[#E62E2D] group-hover:text-white transition-colors duration-300">
                    {renderEthosIcon(item.icon)}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-[#111] mb-1 group-hover:text-[#E62E2D] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════════
          2. OUR VISION & MISSION SECTION
      ══════════════════════════════════════════════════════════════ */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Left Column: Dramatic Steel Structure Visual (4.5 cols) */}
          <div className="lg:col-span-4 xl:col-span-4 rounded-3xl overflow-hidden relative shadow-md min-h-[380px] lg:min-h-[500px] bg-[#111] flex flex-col justify-end">
            
            {/* Background Architecture Photo */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('${vmLeftImg}')`
              }}
            />

            {/* Geometric Angled Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0b0f19] via-[#0b0f19]/60 to-transparent" />
            
            {/* Bright Lens Flare Light Accent */}
            <div className="absolute right-0 top-1/2 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

            {/* Bottom Dark Wedge Badge */}
            <div 
              className="relative z-10 bg-[#111]/95 backdrop-blur-md text-white p-5 sm:p-6 m-4 sm:m-6 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-3.5 max-w-[240px]"
            >
              <div className="w-[2px] h-10 bg-[#E62E2D]" />
              <div className="text-[10px] font-bold tracking-[0.25em] uppercase leading-tight text-gray-300">
                <div>{vmLeftBadge.line1 || "PEOPLE"}</div>
                <div>{vmLeftBadge.line2 || "PROJECTS"}</div>
                <div className="text-white font-bold">{vmLeftBadge.line3 || "PROGRESS"}</div>
              </div>
            </div>

          </div>

          {/* Right Column: Vision & Mission Content (7.5-8 cols) */}
          <div className="lg:col-span-8 xl:col-span-8 flex flex-col justify-between space-y-6">
            
            {/* Top Headline Row */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-[2px] bg-[#E62E2D]" />
                  <span className="text-[#E62E2D] font-bold text-sm tracking-widest uppercase">
                    {vmBadge}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-[32px] font-bold leading-[1.15] tracking-tight text-[#111]">
                  {vmHeadingLine1} <span className="text-[#E62E2D]">{vmHeadingHighlight}</span>
                </h2>
              </div>

              {vmDesc && (
                <p className="text-gray-600 text-[14px] leading-relaxed max-w-sm">
                  {vmDesc}
                </p>
              )}
            </div>

            {/* Vision & Mission Two-Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1">
              
              {/* Card 1: Our Vision */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col justify-between group hover:shadow-xl hover:border-gray-200 transition-all duration-300">
                
                {/* Upper Text */}
                <div className="p-6 sm:p-7 space-y-3.5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-[#E62E2D] shrink-0 group-hover:bg-[#E62E2D] group-hover:text-white transition-colors duration-300">
                      <Eye size={20} className="stroke-[2]" />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-[#111]">
                        {vision.title || "Our Vision"}
                      </h3>
                      <div className="w-8 h-[2px] bg-[#E62E2D] mt-1" />
                    </div>
                  </div>

                  <p className="text-[14px] text-gray-600 leading-relaxed pt-1">
                    {vision.desc}
                  </p>
                </div>

                {/* Lower Saudi Landscape Photo Frame */}
                <div className="relative h-44 sm:h-48 w-full overflow-hidden mt-2">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage: `url('${vision.image}')`
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  
                  {/* Bottom Text Pill */}
                  <div className="absolute bottom-4 left-5 flex items-center gap-3">
                    <div className="w-[2px] h-8 bg-[#E62E2D]" />
                    <div className="text-[10px] font-bold tracking-[0.25em] uppercase leading-tight text-white">
                      <div>{vision.pill?.line1 || "A STRONGER"}</div>
                      <div>{vision.pill?.line2 || "SAUDI ARABIA"}</div>
                      <div className="text-gray-300">{vision.pill?.line3 || "BEYOND TOMORROW"}</div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Card 2: Our Mission */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col justify-between group hover:shadow-xl hover:border-gray-200 transition-all duration-300">
                
                {/* Upper Text */}
                <div className="p-6 sm:p-7 space-y-3.5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-[#E62E2D] shrink-0 group-hover:bg-[#E62E2D] group-hover:text-white transition-colors duration-300">
                      <Target size={20} className="stroke-[2]" />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-[#111]">
                        {mission.title || "Our Mission"}
                      </h3>
                      <div className="w-8 h-[2px] bg-[#E62E2D] mt-1" />
                    </div>
                  </div>

                  <p className="text-[14px] text-gray-600 leading-relaxed pt-1">
                    {mission.desc}
                  </p>
                </div>

                {/* Lower Riyadh Skyline Photo Frame */}
                <div className="relative h-44 sm:h-48 w-full overflow-hidden mt-2">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage: `url('${mission.image}')`
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  
                  {/* Bottom Text Pill */}
                  <div className="absolute bottom-4 left-5 flex items-center gap-3">
                    <div className="w-[2px] h-8 bg-[#E62E2D]" />
                    <div className="text-[10px] font-bold tracking-[0.25em] uppercase leading-tight text-white">
                      <div>{mission.pill?.line1 || "PEOPLE"}</div>
                      <div>{mission.pill?.line2 || "PARTNERSHIPS"}</div>
                      <div className="text-gray-300">{mission.pill?.line3 || "PROGRESS"}</div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
