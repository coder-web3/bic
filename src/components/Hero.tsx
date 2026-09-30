"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const defaultSlides = [
  {
    image: "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=2070&auto=format&fit=crop",
    subheading: "Modern Fleet, Skilled Operators, Reliable Results",
    heading1: "Efficient Equipment",
    headingHighlight: "Rental Solutions",
    heading2: "for Every Project",
    desc: "Our advanced equipment rental service combines high-performance machinery to ensure safe, efficient, and on-schedule project execution."
  },
  {
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2071&auto=format&fit=crop",
    subheading: "Building the Future Today",
    heading1: "Advanced Civil",
    headingHighlight: "Engineering Services",
    heading2: "for Large Scale Works",
    desc: "From concept to completion, we deliver comprehensive civil engineering solutions that stand the test of time."
  },
  {
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=2070&auto=format&fit=crop",
    subheading: "Precision and Excellence",
    heading1: "Industrial Plant",
    headingHighlight: "Construction & Maintenance",
    heading2: "by Experts",
    desc: "We specialize in the construction and maintenance of complex industrial facilities with a focus on safety."
  }
];

export default function Hero({ data }: { data?: any }) {
  const slides = data?.slides && data.slides.length > 0 ? data.slides : defaultSlides;
  const watermarkText = data?.watermark || "RENTAL";
  const scrollDownText = data?.scrollDownText || "SCROLL DOWN";
  const bottomTagline = data?.bottomTagline || "BUILDING A STRONGER TOMORROW";
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Optional: Auto-play slider
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-[92vh] lg:min-h-[95vh] w-full bg-[#111] text-white overflow-hidden flex justify-center">
      {/* Background Images */}
      {slides.map((slide: any, index: number) => (
        <div 
          key={index}
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-90' : 'opacity-0'}`}
          style={{ 
            backgroundImage: `url('${slide.image}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      ))}
      <div className="absolute inset-0 bg-black/35 bg-gradient-to-t from-black/80 via-black/20 to-black/50 z-0 pointer-events-none" />

      {/* Large Watermark Text */}
      <div className="absolute bottom-10 -left-10 text-[18vw] font-black tracking-tighter z-0 text-white select-none leading-none pointer-events-none opacity-5 animate-fade-in-subtle">
        {watermarkText}
      </div>

      <div className="relative z-10 flex w-full max-w-[1600px]">
        {/* Left Sidebar Fixed Content */}
        <div className="w-24 h-full flex flex-col justify-end items-center py-28 border-r border-white/10 hidden md:flex animate-slide-in-left">
          <div className="flex flex-col items-center gap-6">
            <div className="rotate-[-90deg] whitespace-nowrap text-[11px] tracking-[0.2em] text-gray-400">
              {scrollDownText}
            </div>
            <div className="w-[1px] h-16 bg-[#E62E2D]" />
          </div>
        </div>

        {/* Main Content Area - Center Aligned */}
        <div className="flex-1 flex flex-col justify-center items-center text-center px-6 sm:px-12 md:px-20 lg:px-28 pt-36 pb-20">
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center" key={currentSlide}>
            {/* Subheading Badge (Centered - Same as Who We Are) */}
            <div className="inline-flex items-center justify-center gap-4 mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-[2px] bg-[#E62E2D]" />
              <span className="text-[#E62E2D] font-bold text-sm tracking-widest uppercase">
                {slides[currentSlide].subheading}
              </span>
              <div className="w-12 h-[2px] bg-[#E62E2D]" />
            </div>

            {/* Heading (2 Lines - Centered) */}
            <h1 className="text-2xl md:text-3xl lg:text-[34px] font-bold leading-[1.2] tracking-tight mb-6 text-center text-white animate-fade-in-up max-w-4xl mx-auto" style={{ animationDelay: '0.2s' }}>
              {slides[currentSlide].heading1} <br />
              <span className="text-[#E62E2D] relative inline-block">
                {slides[currentSlide].headingHighlight}
                <span className="absolute bottom-1 left-0 w-full h-[8px] bg-[#E62E2D]/25 -z-10" />
              </span>
              {slides[currentSlide].heading2 ? ` ${slides[currentSlide].heading2}` : ""}
            </h1>

            {/* Description (Centered) */}
            <p className="text-gray-200 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed text-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              {slides[currentSlide].desc}
            </p>

            {/* CTA Buttons (Centered) */}
            <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Link href="/about">
                <button className="bg-[#E62E2D] hover:bg-red-700 text-white font-bold py-3.5 px-7 sm:px-8 rounded-full flex items-center gap-2.5 text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-red-900/40 cursor-pointer">
                  ABOUT US
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </button>
              </Link>
              <Link href="/contact">
                <button className="bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white font-bold py-3.5 px-7 sm:px-8 rounded-full flex items-center gap-2.5 text-xs sm:text-sm tracking-widest uppercase backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">
                  GET IN TOUCH
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </button>
              </Link>
            </div>

            {/* Features Bottom Row (Centered) */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-12 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center gap-3 group cursor-pointer transition-transform duration-300 hover:-translate-y-1 bg-black/40 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-white/10 hover:border-[#E62E2D]/60">
                <div className="p-2 border border-white/20 rounded-lg group-hover:border-[#E62E2D] group-hover:text-[#E62E2D] text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                </div>
                <span className="text-xs font-medium text-gray-200 group-hover:text-white transition-colors text-left leading-tight">
                  Modern<br/>Equipment
                </span>
              </div>
              
              <div className="flex items-center gap-3 group cursor-pointer transition-transform duration-300 hover:-translate-y-1 bg-black/40 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-white/10 hover:border-[#E62E2D]/60">
                <div className="p-2 border border-white/20 rounded-lg group-hover:border-[#E62E2D] group-hover:text-[#E62E2D] text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"/><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M4 15v-3a6 6 0 0 1 6-6h0"/><path d="M14 6h0a6 6 0 0 1 6 6v3"/></svg>
                </div>
                <span className="text-xs font-medium text-gray-200 group-hover:text-white transition-colors text-left leading-tight">
                  Skilled<br/>Operators
                </span>
              </div>
              
              <div className="flex items-center gap-3 group cursor-pointer transition-transform duration-300 hover:-translate-y-1 bg-black/40 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-white/10 hover:border-[#E62E2D]/60">
                <div className="p-2 border border-white/20 rounded-lg group-hover:border-[#E62E2D] group-hover:text-[#E62E2D] text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                </div>
                <span className="text-xs font-medium text-gray-200 group-hover:text-white transition-colors text-left leading-tight">
                  Reliable<br/>Performance
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-24 h-full flex flex-col justify-center items-center pt-36 pb-24 hidden lg:flex">
          <div className="flex flex-col gap-6 font-medium text-sm my-auto">
            {slides.map((_: any, idx: number) => (
              <div 
                key={idx} 
                className="relative flex justify-center cursor-pointer group"
                onClick={() => setCurrentSlide(idx)}
              >
                <span className={`transition-colors ${idx === currentSlide ? 'text-[#E62E2D]' : 'text-gray-500 group-hover:text-white'}`}>
                  0{idx + 1}
                </span>
                {idx === currentSlide && (
                  <div className="absolute -bottom-2 w-4 h-[2px] bg-[#E62E2D] animate-fade-in-subtle" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Right Absolute Elements */}
      <div className="absolute bottom-10 right-10 z-20 flex flex-col items-end gap-8 hidden md:flex">
        {/* Navigation Arrows */}
        <div className="flex gap-1">
          <button 
            onClick={prevSlide}
            className="w-12 h-12 bg-black/50 border border-white/10 flex items-center justify-center text-white backdrop-blur-sm transition-colors hover:bg-[#E62E2D]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button 
            onClick={nextSlide}
            className="w-12 h-12 bg-black/50 border border-white/10 flex items-center justify-center text-white backdrop-blur-sm transition-colors hover:bg-[#E62E2D]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>

        {/* Bottom Text */}
        <div className="flex items-center gap-4 text-[11px] tracking-[0.2em] text-gray-400 font-medium">
          BUILDING A STRONGER TOMORROW
          <div className="w-12 h-[1px] bg-[#E62E2D]" />
        </div>
      </div>
    </div>
  );
}
