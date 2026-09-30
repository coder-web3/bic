"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutSection({ data }: { data?: any }) {
  const badge = data?.badge || "WHO WE ARE";
  const headingLine1 = data?.headingLine1 || "Crafting Worldwide";
  const headingHighlight = data?.headingHighlight || "Landmarks";
  const headingLine2 = data?.headingLine2 || "From Saudi Soil";
  const leadParagraph = data?.leadParagraph || "The Best International for Heavy Equipment Rental and Contracting is a leading provider of industrial solutions and general trading.";
  const secondaryParagraph = data?.secondaryParagraph || "We specialize in comprehensive contracting services, offering equipment rentals, manpower provision, and materials supply for construction projects. Our commitment to quality and efficiency ensures successful project execution.";
  const ctaButtonText = data?.ctaButtonText || "Explore Our Story";
  const ctaButtonLink = data?.ctaButtonLink || "/about-us";
  const bottomTagline = data?.bottomTagline || "Building A Stronger Tomorrow";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  return (
    <section className="w-full bg-[#fcfcfc] flex justify-center overflow-hidden relative">
      
      {/* Premium Background Layers */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#111 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        {/* Soft glows */}
        <div className="absolute -top-[300px] -right-[300px] w-[800px] h-[800px] bg-[#E62E2D] rounded-full blur-[150px] opacity-[0.03]" />
        <div className="absolute top-1/2 -left-[200px] w-[500px] h-[500px] bg-black rounded-full blur-[120px] opacity-[0.02]" />
      </div>

      {/* Decorative background accent */}
      <motion.div 
        initial={{ x: '100%' }}
        whileInView={{ x: '60px' }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute top-0 right-0 w-1/3 h-full bg-[#f4f4f4] transform -skew-x-12 z-0" 
      />

      <div className="max-w-[1600px] w-full flex flex-col lg:flex-row relative z-10">
        
        {/* Left Content Column */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="w-full lg:w-[55%] flex flex-col justify-center px-8 md:px-12 lg:pr-20 py-16"
        >
          
          {/* Subheading */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
            <div className="w-12 h-[2px] bg-[#E62E2D]" />
            <span className="text-[#E62E2D] font-bold text-sm tracking-widest uppercase">
              {badge}
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h2 variants={itemVariants} className="text-2xl md:text-3xl lg:text-[32px] font-bold leading-[1.15] tracking-tight text-[#111] mb-8">
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
            </span> {headingLine2}
          </motion.h2>

          {/* Description Paragraphs */}
          <motion.div variants={itemVariants} className="text-gray-600 mb-10 text-[15px] leading-relaxed border-l-2 border-[#E62E2D] pl-6">
            <p className="font-bold text-gray-800 mb-3">
              {leadParagraph}
            </p>
            <p>
              {secondaryParagraph}
            </p>
          </motion.div>

          {/* Features Row - Compact & Premium */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { icon: <><path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"/><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M4 15v-3a6 6 0 0 1 6-6h0"/><path d="M14 6h0a6 6 0 0 1 6 6v3"/></>, label: "Contracting\nServices" },
              { icon: <><path d="m20.24 12.24-11.41-5a1.1 1.1 0 0 0-1.42.59l-.31.81a1.1 1.1 0 0 0 .6 1.41l3.52 1.54"/><path d="M18 10.5 21 12l-1 2.3-5-2.2"/><path d="M9.13 14H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-3"/><path d="M13.6 15 12 11l-2 5"/></>, label: "Electrical &\nMechanical" },
              { icon: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>, label: "Piping &\nFabrication" },
              { icon: <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>, label: "Industrial\nScaffolding" }
            ].map((feat, idx) => (
              <motion.div 
                whileHover="hover"
                key={idx} 
                className="flex items-center gap-3 bg-white p-3 shadow-sm border border-gray-100 rounded-xl cursor-default group"
              >
                <motion.div 
                  variants={{ hover: { scale: 1.1, rotate: [0, -10, 10, 0], backgroundColor: "#E62E2D", color: "#ffffff" } }}
                  transition={{ duration: 0.3 }}
                  className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-[#E62E2D]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    {feat.icon}
                  </svg>
                </motion.div>
                <span className="text-[11px] font-bold text-[#111] leading-tight whitespace-pre-line group-hover:text-[#E62E2D] transition-colors">
                  {feat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Row */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
            <Link href={ctaButtonLink}>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#111] hover:bg-[#E62E2D] text-white font-bold py-4 px-8 rounded-full flex items-center gap-3 text-[12px] tracking-widest uppercase shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-colors"
              >
                {ctaButtonText}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </motion.button>
            </Link>
            
            {/* Minimal Watermark style text */}
            <div className="flex items-center gap-4 text-[10px] tracking-[0.25em] text-gray-400 font-bold uppercase">
              <div className="w-12 h-[1px] bg-gray-300" />
              {bottomTagline}
            </div>
          </motion.div>
        </motion.div>

        {/* Right Image Composition (Premium Layered Look) */}
        <div className="w-full lg:w-[45%] h-[500px] lg:h-auto relative px-8 pb-16 lg:px-0 lg:pb-0 lg:py-16 overflow-visible">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative w-full h-full max-h-[600px] flex items-center justify-center"
          >
             
             {/* Main Image Block */}
             <motion.div 
               whileHover={{ scale: 1.02 }}
               transition={{ duration: 0.5 }}
               className="relative w-[85%] h-[90%] lg:w-[90%] lg:h-full rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] ml-auto"
             >
               <img 
                 src={data?.image || "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=2070&auto=format&fit=crop"}
                 referrerPolicy="no-referrer"
                 onError={(e: any) => { e.currentTarget.src = "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=2070&auto=format&fit=crop"; }} 
                 alt="Construction Site"
                 className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
               />
               <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent pointer-events-none" />
             </motion.div>

             {/* Red Accent Block Overlapping Top Left */}
             <motion.div 
               initial={{ opacity: 0, y: -20, x: -20 }}
               whileInView={{ opacity: 1, y: 0, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6, delay: 0.6 }}
               className="absolute top-4 left-0 w-40 bg-[#E62E2D] text-white p-6 rounded-xl shadow-xl z-20"
             >
                <div className="text-[10px] font-bold tracking-[0.2em] leading-relaxed uppercase">
                  {data?.redBoxText ? (
                    data.redBoxText.split("\n").map((line: string, i: number) => (
                      <span key={i}>{line}{i < data.redBoxText.split("\n").length - 1 && <br />}</span>
                    ))
                  ) : (
                    <>Saudi Arabia<br/>To The World</>
                  )}
                </div>
                <div className="w-8 h-[2px] bg-white/50 mt-4" />
             </motion.div>

             {/* Dark Accent Block Overlapping Bottom Left */}
             <motion.div 
               initial={{ opacity: 0, y: 30, x: -30 }}
               whileInView={{ opacity: 1, y: 0, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6, delay: 0.8 }}
               className="absolute bottom-8 left-4 lg:-left-12 bg-[#111] p-6 rounded-xl shadow-2xl z-20 border border-white/5"
             >
               <div className="text-[10px] font-bold tracking-[0.2em] leading-relaxed uppercase text-white mb-2">
                 {data?.darkBoxTextLine1 ? (
                   data.darkBoxTextLine1.split("\n").map((line: string, i: number) => (
                     <span key={i}>{line}{i < data.darkBoxTextLine1.split("\n").length - 1 && <br />}</span>
                   ))
                 ) : (
                   <>More Than<br/>Projects</>
                 )}
               </div>
               <div className="text-[10px] font-bold tracking-[0.2em] leading-relaxed uppercase text-gray-400">
                 {data?.darkBoxTextLine2 ? (
                   data.darkBoxTextLine2.split("\n").map((line: string, i: number) => (
                     <span key={i}>{line}{i < data.darkBoxTextLine2.split("\n").length - 1 && <br />}</span>
                   ))
                 ) : (
                   <>A Stronger<br/>Tomorrow</>
                 )}
               </div>
             </motion.div>

             {/* Stat Box Overlapping Bottom Right */}
             <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6, delay: 1 }}
               className="absolute bottom-4 right-4 bg-white p-5 rounded-xl shadow-lg z-20 flex items-center gap-4"
             >
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-[#E62E2D]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <div>
                  <div className="font-black text-xl text-[#111]">{data?.statBoxValue || "100%"}</div>
                  <div className="text-[9px] font-bold tracking-wider text-gray-500 uppercase">{data?.statBoxLabel || "Trust & Experience"}</div>
                </div>
             </motion.div>

          </motion.div>
        </div>

      </div>
    </section>
  );
}
