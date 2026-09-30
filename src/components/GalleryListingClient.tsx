"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";

export interface GalleryItem {
  id?: string;
  src: string;
  category?: string;
}

interface GalleryListingClientProps {
  images: GalleryItem[];
  itemsPerPage?: number;
}

export default function GalleryListingClient({
  images,
  itemsPerPage = 6,
}: GalleryListingClientProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate pagination values
  const totalPages = Math.ceil(images.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedImages = images.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const openLightbox = (indexInPaginated: number) => {
    // Map paginated index back to images array index
    const actualIndex = startIndex + indexInPaginated;
    setLightboxIndex(actualIndex);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const prevImage = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : images.length - 1));
  }, [lightboxIndex, images.length]);

  const nextImage = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! < images.length - 1 ? prev! + 1 : 0));
  }, [lightboxIndex, images.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, prevImage, nextImage]);

  return (
    <div ref={containerRef} className="bg-[#f8f9fb] py-12 md:py-16 px-4 sm:px-6 lg:px-12 scroll-mt-24">
      <div className="max-w-[1650px] mx-auto space-y-8">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-[2px] bg-[#E62E2D]" />
              <span className="text-[#E62E2D] font-bold text-xs tracking-widest uppercase">
                VISUAL PROJECT ARCHIVE
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Verified Industrial <span className="text-[#E62E2D]">Field Media</span>
            </h2>
          </div>

          {/* Asset Counter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-500 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/90 shadow-2xs">
              {images.length} Verified Media Items
            </span>
          </div>
        </div>

        {/* ── LUXURY FULL-BLEED GALLERY GRID (No bottom text boxes) ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
          {paginatedImages.map((item, idx) => {
            const overallNumber = startIndex + idx + 1;
            const num = String(overallNumber).padStart(2, "0");

            return (
              <div
                key={idx}
                onClick={() => openLightbox(idx)}
                className="group relative h-[300px] sm:h-[350px] md:h-[400px] rounded-3xl overflow-hidden bg-slate-950 border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(230,46,45,0.18)] hover:border-red-500/80 transition-all duration-500 cursor-pointer hover:-translate-y-2"
              >
                {/* Full-bleed Edge-to-Edge Image */}
                <img
                  src={item.src}
                  alt={`Gallery Asset ${num}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Multi-layer Cinematic Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 group-hover:opacity-75 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />

                {/* Top Left: Glassmorphic Number Tag */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-[#E62E2D] animate-pulse" />
                  <span className="text-white text-xs font-mono font-bold tracking-wider">
                    {num}
                  </span>
                </div>

                {/* Top Right: Expand View Button */}
                <div className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90 group-hover:bg-[#E62E2D] group-hover:border-[#E62E2D] group-hover:scale-110 group-hover:text-white transition-all duration-300 shadow-md">
                  <Maximize2 size={16} className="stroke-[2.2]" />
                </div>

                {/* Center Hover Glow Icon */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-lg border border-white/30 flex items-center justify-center text-white shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Eye size={22} className="stroke-[2.2]" />
                  </div>
                </div>

                {/* Bottom Red Glowing Accent Bar on Hover */}
                <div className="absolute bottom-0 left-0 right-0 h-[3px] w-0 group-hover:w-full bg-gradient-to-r from-[#E62E2D] via-red-500 to-rose-600 transition-all duration-500" />
              </div>
            );
          })}
        </div>

        {/* ── LUXURY PAGINATION BAR ─────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="pt-8 mt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-medium text-slate-500">
              Showing <strong className="text-slate-900 font-bold">{startIndex + 1}–{Math.min(startIndex + itemsPerPage, images.length)}</strong> of <strong className="text-slate-900 font-bold">{images.length}</strong> verified photos
            </span>

            <div className="flex items-center gap-1.5">
              {/* Previous Page Button */}
              <button
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                aria-label="Previous Page"
              >
                <ChevronLeft size={15} />
                <span>Previous</span>
              </button>

              {/* Number Buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const isActive = currentPage === pageNum;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center justify-center ${
                      isActive
                        ? "bg-[#E62E2D] text-white shadow-[0_4px_16px_rgba(230,46,45,0.35)] scale-105"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Next Page Button */}
              <button
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                aria-label="Next Page"
              >
                <span>Next</span>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ── FULL-SCREEN LIGHTBOX MODAL ─────────────────────────────── */}
      {lightboxIndex !== null && images[lightboxIndex] && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300"
          onClick={closeLightbox}
        >
          {/* Top Bar with Counter & Close */}
          <div 
            className="absolute top-5 left-5 right-5 flex items-center justify-between z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-white text-xs font-mono font-bold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#E62E2D]" />
              <span>
                {lightboxIndex + 1} / {images.length}
              </span>
            </div>

            <button
              onClick={closeLightbox}
              className="p-2.5 rounded-full bg-white/10 hover:bg-[#E62E2D] text-white border border-white/15 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Left Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-white/10 hover:bg-[#E62E2D] text-white border border-white/15 transition-all duration-200 cursor-pointer z-20 active:scale-95 shadow-xl"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Right Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-white/10 hover:bg-[#E62E2D] text-white border border-white/15 transition-all duration-200 cursor-pointer z-20 active:scale-95 shadow-xl"
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>

          {/* Center Image Container */}
          <div 
            className="max-w-6xl max-h-[85vh] w-full flex items-center justify-center relative z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[lightboxIndex].src}
              alt={`Gallery Image ${lightboxIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}

    </div>
  );
}
