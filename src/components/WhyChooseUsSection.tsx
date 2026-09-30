"use client";

import { motion } from "framer-motion";
import { Users, Shield, HardHat, Award } from "lucide-react";

// Default features matching reference design
const defaultFeatures = [
  {
    title: "The Best Quality\nOf Services",
    desc: "Our commitment to excellence guarantees top-tier service tailored to meet every customer’s needs.",
    image: "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=800&auto=format&fit=crop",
    imageAlt: "The Best Quality Of Services",
    icon: "users"
  },
  {
    title: "Skilled Teamwork &\nCollaboration",
    desc: "Empowering success through skilled teamwork and seamless collaboration.",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Skilled Teamwork & Collaboration",
    icon: "shield"
  },
  {
    title: "Transparent\nCommunication",
    desc: "Ensuring trust through transparent and open communication every step of the way.",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Transparent Communication",
    icon: "hardhat"
  }
];

const defaultHeroImage = "https://images.unsplash.com/photo-1504307651254-35680f356f12?q=80&w=1600&auto=format&fit=crop";

export default function WhyChooseUsSection({ data }: { data?: any }) {
  const badge = data?.badge || "WHY CHOOSE US";
  const headingLine1 = data?.headingLine1 || "We Provide The";
  const headingHighlight = data?.headingHighlight || "Guaranteed Quality";
  const desc = data?.desc || "Trusted by industry leaders, we deliver excellence through top-tier equipment, skilled manpower, and reliable support for seamless project completion.";
  const heroImage = data?.image || defaultHeroImage;

  const rawFeatures = data?.features && Array.isArray(data.features) && data.features.length > 0
    ? data.features
    : defaultFeatures;

  // Helper to render icon for each card
  const getFeatureIcon = (item: any, idx: number) => {
    const iconType = item.icon || (idx === 0 ? "users" : idx === 1 ? "shield" : "hardhat");
    switch (iconType) {
      case "users":
        return <Users size={20} />;
      case "shield":
        return <Shield size={20} />;
      case "hardhat":
        return <HardHat size={20} />;
      case "award":
        return <Award size={20} />;
      default:
        return idx === 0 ? <Users size={20} /> : idx === 1 ? <Shield size={20} /> : <HardHat size={20} />;
    }
  };

  return (
    <section className="w-full bg-[#fbfcfd] text-gray-900 relative overflow-hidden border-t border-gray-200">
      
      {/* ── Background Skyscraper Architectural Blueprint Watermark (Top Left) ─── */}
      <div 
        className="absolute top-0 left-0 w-[550px] h-[550px] opacity-[0.07] pointer-events-none z-0 bg-no-repeat bg-contain bg-top-left"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400' fill='none' stroke='%230f172a' stroke-width='1.2'%3E%3Cpath d='M30 380V80l80-50v350M110 380V40l90-30v370M200 380V90l80-40v330M280 380V120l70-30v290'/%3E%3Cpath d='M30 120h80M30 160h80M30 200h80M30 240h80M30 280h80M30 320h80M110 90h90M110 130h90M110 170h90M110 210h90M110 250h90M110 290h90M110 330h90M200 140h80M200 180h80M200 220h80M200 260h80M200 300h80M200 340h80'/%3E%3C/svg%3E")`
        }}
      />

      {/* ── Bottom-Left Decorative Red Ribbon Polygon ─── */}
      <div 
        className="absolute -bottom-10 -left-10 w-48 h-48 bg-gradient-to-tr from-[#991b1b] via-[#E62E2D] to-transparent opacity-90 pointer-events-none z-0"
        style={{ clipPath: 'polygon(0 30%, 100% 100%, 0 100%)' }}
      />
      <div 
        className="absolute bottom-0 left-0 w-32 h-32 bg-[#E62E2D] opacity-80 pointer-events-none z-0"
        style={{ clipPath: 'polygon(0 60%, 100% 100%, 0 100%)' }}
      />

      <div className="w-full flex flex-col xl:flex-row items-stretch relative z-10">
        
        {/* ── Left Column: Heading, Subtitle & 3 Feature Cards (xl:w-[58%] 2xl:w-[60%]) ─── */}
        <div className="w-full xl:w-[58%] 2xl:w-[60%] px-6 sm:px-10 lg:px-14 py-12 sm:py-14 lg:py-16 flex flex-col justify-between relative z-10">
          
          {/* Header Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mb-6 sm:mb-8"
          >
            {/* Red Dash Badge */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[2px] bg-[#E62E2D]" />
              <span className="text-[#E62E2D] font-bold text-sm tracking-widest uppercase">
                {badge}
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="text-2xl md:text-3xl lg:text-[32px] font-bold leading-[1.15] tracking-tight text-[#111] mb-6">
              {headingLine1} <br />
              for a <span className="text-[#E62E2D] relative inline-block">
                {headingHighlight}
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="absolute bottom-1 left-0 h-[8px] bg-[#E62E2D]/20 -z-10" 
                />
              </span>
            </h2>

            {/* Subtitle Description */}
            <p className="text-gray-600 text-xs sm:text-[13px] leading-relaxed font-normal max-w-xl text-justify">
              {desc}
            </p>
          </motion.div>

          {/* ── 3 Feature / Benefit Cards Row ─── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 pt-1">
            {rawFeatures.slice(0, 3).map((feat: any, idx: number) => {
              const fallbackImg = defaultFeatures[idx % defaultFeatures.length]?.image;
              const cardImage = feat.image && feat.image.trim() !== "" ? feat.image : fallbackImg;
              const cardAlt = feat.imageAlt || feat.title || "Feature Image";

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="bg-white rounded-2xl sm:rounded-3xl shadow-[0_8px_25px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden flex flex-col justify-between group hover:shadow-2xl hover:border-red-200 transition-all duration-500 relative cursor-pointer"
                >
                  {/* Top Image Container with Curved Red Ribbon Accent */}
                  <div className="relative h-36 sm:h-40 bg-gray-900 overflow-hidden rounded-t-2xl sm:rounded-t-3xl">
                    
                    {/* Background Red Accent Fold (slanted bottom right) */}
                    <div 
                      className="absolute -bottom-1 -right-1 w-24 h-16 bg-gradient-to-tl from-[#991b1b] to-[#E62E2D] z-10 pointer-events-none opacity-95 group-hover:scale-110 transition-transform duration-500"
                      style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }}
                    />

                    {/* Red Corner Slice (Top Left) */}
                    <div 
                      className="absolute -top-1 -left-1 w-14 h-14 bg-[#E62E2D] z-10 pointer-events-none opacity-85 group-hover:scale-110 transition-transform duration-500"
                      style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
                    />

                    {/* Crisp Photo */}
                    <img 
                      src={cardImage} 
                      alt={cardAlt}
                      className="w-full h-full object-cover group-hover:scale-108 transition-all duration-700"
                      onError={(e: any) => {
                        e.currentTarget.src = fallbackImg;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Floating Red Rounded Icon Box */}
                  <div className="relative -mt-5 ml-5 z-20">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#E62E2D] rounded-xl sm:rounded-2xl shadow-lg shadow-red-600/30 flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      {getFeatureIcon(feat, idx)}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="px-5 pt-2 pb-5 sm:pb-6 flex-1 flex flex-col justify-between bg-white rounded-b-2xl sm:rounded-b-3xl">
                    <div>
                      <h3 className="text-sm sm:text-[15px] font-bold text-gray-900 leading-snug mb-1.5 group-hover:text-[#E62E2D] transition-colors whitespace-pre-line">
                        {feat.title}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed font-normal text-justify line-clamp-3">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

        {/* ── Right Column: Dramatic Diagonal Red Slicing Ribbon & Saudi Construction Photo (xl:w-[42%] 2xl:w-[40%]) ─── */}
        <div className="w-full xl:w-[42%] 2xl:w-[40%] min-h-[420px] sm:min-h-[480px] xl:min-h-full relative overflow-hidden flex items-stretch">
          
          {/* Main Heroic Saudi Construction Photograph (Crisp Img element) */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <img 
              src={heroImage} 
              alt="Why Choose Us Construction Leadership" 
              className="w-full h-full object-cover object-[center_35%] transition-transform duration-1000 group-hover:scale-105"
              onError={(e: any) => {
                e.currentTarget.src = defaultHeroImage;
              }}
            />
          </div>

          {/* Subtle Warm Overlay for Construction Sunset Harmony */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-black/15 pointer-events-none" />

          {/* ── Signature Diagonal Red Ribbon Divider (Left Edge of Right Column) ─── */}
          <div 
            className="hidden xl:block absolute top-0 left-0 bottom-0 w-24 sm:w-32 bg-gradient-to-br from-[#E62E2D] via-[#dc2626] to-[#991b1b] z-20 pointer-events-none drop-shadow-[-10px_0_20px_rgba(0,0,0,0.25)]"
            style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%, 65% 0)' }}
          />

          {/* Secondary White Accent Slice */}
          <div 
            className="hidden xl:block absolute top-0 left-0 bottom-0 w-12 bg-white/90 z-10 pointer-events-none"
            style={{ clipPath: 'polygon(100% 0, 100% 100%, 30% 100%, 85% 0)' }}
          />

          {/* ── Bottom-Right Dark Red Geometric Triangle with Dot Matrix Pattern ─── */}
          <div 
            className="absolute bottom-0 right-0 w-52 h-44 bg-gradient-to-tl from-[#7f1d1d] via-[#991b1b] to-transparent z-10 pointer-events-none opacity-90"
            style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
          >
            {/* Tech Dot Matrix Texture */}
            <div 
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                backgroundSize: '10px 10px'
              }}
            />
          </div>

          {/* Mobile Top Red Angle Accent */}
          <div 
            className="xl:hidden absolute top-0 left-0 right-0 h-10 bg-gradient-to-r from-[#E62E2D] to-[#991b1b] z-10"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 0)' }}
          />

        </div>

      </div>

    </section>
  );
}
