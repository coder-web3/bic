"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  Search,
  Calendar,
  Clock,
  ArrowRight,
  HardHat,
  Factory,
  Wrench,
  ShieldCheck,
  Newspaper,
  TrendingUp,
  Grid,
  Mail,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  Layers,
  Award,
  Flame,
} from "lucide-react";

export interface BlogPost {
  id?: string;
  title: string;
  slug?: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  summary: string;
  featured?: boolean;
  views?: number;
}

export default function BlogListingClient({
  initialArticles,
  initialSettings,
}: {
  initialArticles?: BlogPost[];
  initialSettings?: {
    itemsPerPage?: number;
    sectionBadge?: string;
    sectionTitle?: string;
    sectionTitleAccent?: string;
    sectionDescription?: string;
  };
}) {
  const articlesList = Array.isArray(initialArticles) ? initialArticles : [];
  const [activeCategory, setActiveCategory] = useState("All Articles");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const itemsPerPage = initialSettings?.itemsPerPage || 6;

  // Dynamically compute category counts
  const categoryIcons: Record<string, any> = {
    "All Articles": Grid,
    "Construction": HardHat,
    "Industrial": Factory,
    "Equipment": Wrench,
    "Safety": ShieldCheck,
    "Company News": Newspaper,
    "Market Insights": TrendingUp,
  };

  const dynamicCategories = React.useMemo(() => {
    const rawCategories = ["Construction", "Industrial", "Equipment", "Safety", "Company News", "Market Insights"];
    return [
      { name: "All Articles", count: articlesList.length, icon: Grid },
      ...rawCategories.map((cat) => ({
        name: cat,
        count: articlesList.filter((a) => a.category?.toLowerCase() === cat.toLowerCase()).length,
        icon: categoryIcons[cat] || Grid,
      })),
    ];
  }, [articlesList]);

  // Dynamically compute Most Read articles
  const dynamicMostRead = React.useMemo(() => {
    return articlesList.slice(0, 3).map((article, idx) => ({
      id: String(idx + 1).padStart(2, "0"),
      title: article.title,
      slug: article.slug,
      date: article.date,
      readTime: article.readTime,
      image: article.image,
    }));
  }, [articlesList]);

  // Filter articles based on active category and search
  const filteredArticles = articlesList.filter((article) => {
    const matchesCategory =
      activeCategory === "All Articles" || article.category?.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate pagination values
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + itemsPerPage);

  const handleCategoryChange = (catName: string) => {
    setActiveCategory(catName);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail("");
        setSubscribed(false);
      }, 4000);
    }
  };

  return (
    <div ref={containerRef} className="bg-[#f8f9fb] py-10 md:py-14 px-4 sm:px-6 lg:px-12 text-gray-900 scroll-mt-24">
      <div className="max-w-[1650px] mx-auto space-y-10">

        {/* ── TOP HEADER (Who We Are Section Typography Standard) ────────── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-gray-200">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-[2px] bg-[#E62E2D]" />
              <span className="text-[#E62E2D] font-bold text-sm tracking-widest uppercase">
                {initialSettings?.sectionBadge || "BLOG & INSIGHTS"}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-[32px] font-bold leading-[1.15] tracking-tight text-[#111]">
              {initialSettings?.sectionTitle || "Latest"}{" "}
              <span className="text-[#E62E2D] relative inline-block">
                {initialSettings?.sectionTitleAccent || "Articles"}
                <span className="absolute bottom-1 left-0 w-full h-[8px] bg-[#E62E2D]/20 -z-10" />
              </span>
            </h2>
            <p className="text-gray-600 text-[15px] leading-relaxed">
              {initialSettings?.sectionDescription || "Stay informed with industry insights, project updates, safety guidelines and expert knowledge from Best International Contracting Company."}
            </p>
          </div>

          {/* 3 Metric Feature Badges */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3.5">
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:border-red-500/40 transition">
              <div className="w-8 h-8 rounded-xl bg-red-50 text-[#E62E2D] flex items-center justify-center">
                <Layers size={16} />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Industry</div>
                <div className="text-[11px] text-slate-500 font-medium">Knowledge</div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:border-red-500/40 transition">
              <div className="w-8 h-8 rounded-xl bg-red-50 text-[#E62E2D] flex items-center justify-center">
                <Sparkles size={16} />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Expert</div>
                <div className="text-[11px] text-slate-500 font-medium">Insights</div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:border-red-500/40 transition">
              <div className="w-8 h-8 rounded-xl bg-red-50 text-[#E62E2D] flex items-center justify-center">
                <Award size={16} />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Real Project</div>
                <div className="text-[11px] text-slate-500 font-medium">Experiences</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── CATEGORY FILTER TABS BAR ─────────────────────────────── */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-none border-b border-gray-200">
          {dynamicCategories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.name;

            return (
              <button
                key={cat.name}
                onClick={() => handleCategoryChange(cat.name)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-[#E62E2D] text-white shadow-md shadow-red-600/20"
                    : "bg-white text-slate-700 border border-gray-200/90 hover:bg-slate-50 hover:border-gray-300 shadow-2xs"
                }`}
              >
                <Icon size={14} className={isActive ? "text-white" : "text-slate-500"} />
                <span>{cat.name} ({cat.count})</span>
              </button>
            );
          })}
        </div>

        {/* ── MAIN CONTENT (Compact Sidebar + Articles Grid) ────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          
          {/* LEFT 9 COLS: EXPANDED ARTICLES GRID */}
          <div className="lg:col-span-9 space-y-7">
            
            {/* 6 BLOG CARDS GRID (ALL USING FIRST CARD DESIGN) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {paginatedArticles.map((post, idx) => {
                const isFeatured = post.featured || (currentPage === 1 && idx === 0);

                return (
                  <div
                    key={post.id || idx}
                    className="bg-white rounded-3xl border border-gray-200/90 overflow-hidden shadow-2xs hover:shadow-xl hover:border-red-500/60 transition-all duration-300 flex flex-col justify-between group"
                  >
                    {/* Top Image Banner with Gradient & Overlay Content */}
                    <div className="relative h-56 sm:h-64 bg-slate-950 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                      
                      {/* Category / Featured Pill */}
                      <div className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-[#E62E2D] text-white text-[10px] font-black tracking-wider uppercase shadow-md">
                        {isFeatured ? "FEATURED" : post.category}
                      </div>

                      {/* Reading Time Badge */}
                      <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/20 text-white/90 text-[10px] font-mono font-bold shadow-md">
                        <Clock size={11} className="text-[#E62E2D]" />
                        <span>{post.readTime}</span>
                      </div>

                      {/* Date & Title Overlay */}
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <div className="flex items-center gap-1.5 text-slate-300 text-xs mb-2">
                          <Calendar size={12} className="text-[#E62E2D]" />
                          <span>{post.date}</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold leading-snug text-white line-clamp-2 group-hover:text-red-300 transition-colors">
                          {post.title}
                        </h3>
                      </div>
                    </div>

                    {/* Card Body with Summary and Action */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <p className="text-[13.5px] sm:text-[14px] text-gray-600 leading-relaxed mb-4 line-clamp-3">
                        {post.summary}
                      </p>
                      <Link
                        href={`/blog/${post.slug || "article"}`}
                        className="text-[13px] font-bold text-[#E62E2D] hover:text-red-700 flex items-center gap-1 group/btn"
                      >
                        <span>Read More</span>
                        <ArrowRight size={13.5} className="group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {paginatedArticles.length === 0 && (
              <div className="bg-white rounded-3xl border border-dashed border-slate-300/80 p-12 sm:p-16 text-center space-y-4 shadow-2xs">
                <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#E62E2D] flex items-center justify-center mx-auto shadow-2xs">
                  <BookOpen size={28} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {searchQuery || activeCategory !== "All Articles" ? "No Matching Articles Found" : "No Publications Yet"}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                    {searchQuery || activeCategory !== "All Articles"
                      ? "Try searching for different keywords or reset your category filter to explore all topics."
                      : "New technical publications, Aramco engineering compliance papers, and industrial insights will be published here soon."}
                  </p>
                </div>
                {(searchQuery || activeCategory !== "All Articles") && (
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setActiveCategory("All Articles");
                        setCurrentPage(1);
                      }}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      <span>Reset Filters</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── LUXURY PAGINATION BAR ───────────────────────────────── */}
            {totalPages > 1 && (
              <div className="pt-8 mt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs font-medium text-slate-500">
                  Showing <strong className="text-slate-900 font-bold">{startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredArticles.length)}</strong> of <strong className="text-slate-900 font-bold">{filteredArticles.length}</strong> articles
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

          {/* RIGHT 3 COLS: COMPACT & STICKY SIDEBAR */}
          <div className="lg:col-span-3 space-y-5">
            
            {/* WIDGET 1: COMPACT SEARCH BAR */}
            <div className="bg-white rounded-2xl border border-gray-200/90 p-1.5 shadow-2xs flex items-center focus-within:border-red-500/80 focus-within:ring-2 focus-within:ring-red-500/10 transition">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-3 pr-2 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
              />
              <button
                type="button"
                className="w-8 h-8 rounded-xl bg-[#E62E2D] hover:bg-red-700 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-xs"
                aria-label="Search"
              >
                <Search size={13} />
              </button>
            </div>

            {/* WIDGET 2: POPULAR CATEGORIES */}
            <div className="bg-white rounded-2xl border border-gray-200/90 p-4 sm:p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-[2px] bg-[#E62E2D]" />
                  <h3 className="font-bold text-[12.5px] sm:text-[13px] uppercase tracking-widest text-[#111]">
                    Popular Categories
                  </h3>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-[#E62E2D]" />
              </div>
              
              <div className="space-y-1.5">
                {dynamicCategories.filter((c) => c.name !== "All Articles").map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = activeCategory === cat.name;

                  return (
                    <button
                      key={cat.name}
                      onClick={() => handleCategoryChange(cat.name)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-[12px] sm:text-[12.5px] transition-all cursor-pointer group ${
                        isSelected
                          ? "bg-red-50 text-[#E62E2D] font-bold"
                          : "text-slate-700 hover:bg-slate-50 hover:text-[#111]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                          isSelected ? "bg-[#E62E2D] text-white" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800"
                        }`}>
                          <Icon size={11.5} />
                        </div>
                        <span className="truncate">{cat.name}</span>
                      </div>
                      <span className={`text-[10.5px] font-mono px-1.5 py-0.5 rounded-md ${
                        isSelected ? "bg-[#E62E2D]/15 text-[#E62E2D] font-bold" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                      }`}>
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── STICKY CONTAINER FOR MOST READ & NEWSLETTER ───────── */}
            <div className="sticky top-28 space-y-5">
              
              {/* WIDGET 3: STICKY MOST READ (LUXURY UNIQUE LOOK) */}
              {dynamicMostRead.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200/90 p-4 sm:p-5 shadow-2xs space-y-3.5 relative overflow-hidden">
                  {/* Top Accent Line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#E62E2D] via-red-500 to-rose-600" />

                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-[2px] bg-[#E62E2D]" />
                      <h3 className="font-bold text-[12.5px] sm:text-[13px] uppercase tracking-widest text-[#111]">
                        Most Read
                      </h3>
                    </div>
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#E62E2D] bg-red-50 border border-red-100 px-2 py-0.5 rounded-md">
                      Trending
                    </span>
                  </div>

                  <div className="space-y-3">
                    {dynamicMostRead.map((item) => (
                      <Link
                        key={item.id}
                        href={`/blog/${item.slug || "article"}`}
                        className="flex items-center gap-3 group/item cursor-pointer p-1.5 -mx-1.5 rounded-xl hover:bg-slate-50 transition"
                      >
                        {/* Rank Badge */}
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                          item.id === "01"
                            ? "bg-gradient-to-br from-red-500 to-red-700 text-white shadow-xs shadow-red-600/30"
                            : "bg-slate-100 text-slate-600 group-hover/item:bg-slate-200"
                        }`}>
                          {item.id}
                        </div>

                        {/* Thumbnail */}
                        <div className="w-12 h-12 rounded-lg bg-slate-950 overflow-hidden shrink-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-300"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h5 className="text-[12.5px] sm:text-[13px] font-bold text-[#111] group-hover/item:text-[#E62E2D] transition-colors line-clamp-2 leading-snug tracking-tight">
                            {item.title}
                          </h5>
                          <p className="text-[10.5px] text-gray-500 mt-0.5">
                            {item.date} • {item.readTime}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* WIDGET 4: COMPACT NEWSLETTER SUBSCRIPTION */}
              <div className="bg-[#0A0E17] text-white rounded-2xl p-4 sm:p-5 shadow-xl space-y-3 relative overflow-hidden border border-white/10">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/15 rounded-full blur-xl pointer-events-none" />
                
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white">
                    <Mail size={14} />
                  </div>
                  <h4 className="font-bold text-[13px] sm:text-[14px] text-white">
                    Stay Updated
                  </h4>
                </div>

                <p className="text-[12px] text-slate-300 leading-relaxed">
                  Subscribe for our latest technical updates & field insights.
                </p>

                {subscribed ? (
                  <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-300 text-[11px] font-bold text-center">
                    Subscribed successfully!
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex gap-1.5">
                    <input
                      type="email"
                      required
                      placeholder="Your email..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#E62E2D]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 rounded-xl bg-[#E62E2D] hover:bg-red-700 text-white transition-colors cursor-pointer shrink-0"
                      aria-label="Submit Email"
                    >
                      <ArrowRight size={13} />
                    </button>
                  </form>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
