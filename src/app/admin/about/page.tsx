"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Info,
  Save,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  Image as ImageIcon,
  Sparkles,
  ShieldCheck,
  Eye,
  Target,
  FileText,
  Layers,
  BarChart3,
  Plus,
  Trash2,
  Compass,
  FolderOpen,
  Upload,
} from "lucide-react";
import MediaLibraryModal from "@/components/MediaLibraryModal";

export default function AdminAboutPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"hero" | "whoWeAre" | "ethos" | "visionMission" | "seo">("hero");

  // Media Library & Upload state
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [targetFieldPath, setTargetFieldPath] = useState<string | null>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // Direct upload handler
  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>, pathStr: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingField(pathStr);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("alt", file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        if (json.url) {
          updateField(pathStr, json.url);
        }
      } else {
        alert("Failed to upload image. Please try again.");
      }
    } catch (err) {
      console.error("Direct upload error:", err);
      alert("Error uploading image.");
    } finally {
      setUploadingField(null);
      e.target.value = "";
    }
  };

  // Fetch initial data
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/about");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to load about data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Save changes to API
  const handleSaveAll = async () => {
    try {
      setSaving(true);
      setSaveSuccess(false);

      const res = await fetch("/api/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3500);
      } else {
        alert("Failed to save about data. Please try again.");
      }
    } catch (err) {
      console.error("Error saving about data:", err);
      alert("Error saving about data.");
    } finally {
      setSaving(false);
    }
  };

  // Helper to update deeply nested fields
  const updateField = (pathStr: string, value: any) => {
    setData((prev: any) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const keys = pathStr.split(".");
      let current = copy;
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        if (!current[k]) current[k] = {};
        current = current[k];
      }
      current[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  // Open Media Library Modal for a specific path
  const openMediaFor = (pathStr: string) => {
    setTargetFieldPath(pathStr);
    setMediaModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-red-500 animate-spin" />
          <span className="text-slate-500 text-sm font-semibold">Loading About Page CMS...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-slate-500">
        Failed to load content. Please refresh or check API connection.
      </div>
    );
  }

  const { hero, whoWeAre, ethos, visionMission, seo } = data;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24">
      
      {/* ── 1. TOP HEADER BANNER ───────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-[#090D15] text-white p-6 sm:p-8 md:p-10 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={12} />
                <span>Page CMS Control</span>
              </span>
              <span className="text-slate-400 text-xs font-mono">/about-us</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
              About Us <span className="text-red-500">Content Manager</span>
            </h1>

            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl font-medium leading-relaxed">
              Manage Hero visuals, stats metrics, &quot;Who We Are&quot; copy, Our Ethos value cards, Vision &amp; Mission architecture frames, and SEO metadata.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/about-us"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/15 rounded-xl transition-all duration-200 text-xs md:text-sm font-semibold shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              <ExternalLink className="w-4 h-4 text-slate-300" />
              <span>Live Page</span>
            </Link>

            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl transition-all duration-200 text-xs md:text-sm font-black shadow-lg shadow-red-600/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center gap-3 text-emerald-800 text-xs font-bold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={18} className="text-emerald-600" />
          <span>About Page content saved successfully! Live website cache updated.</span>
        </div>
      )}

      {/* ── 2. NAVIGATION TABS ────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {[
          { id: "hero", label: "Hero & Statistics", icon: BarChart3 },
          { id: "whoWeAre", label: "Who We Are", icon: Info },
          { id: "ethos", label: "Our Ethos", icon: ShieldCheck },
          { id: "visionMission", label: "Vision & Mission", icon: Target },
          { id: "seo", label: "SEO & Social", icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── 3. TAB 1: HERO & STATISTICS ───────────────────────────── */}
      {activeTab === "hero" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Hero Section &amp; Metrics</h2>
            <p className="text-xs text-slate-500">Configure page hero title, background cover photo, and live counters.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Badge / Top Label
              </label>
              <input
                type="text"
                value={hero?.badge || ""}
                onChange={(e) => updateField("hero.badge", e.target.value)}
                placeholder="e.g. WHO WE ARE"
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-red-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Watermark Letters
              </label>
              <input
                type="text"
                value={hero?.watermark || ""}
                onChange={(e) => updateField("hero.watermark", e.target.value)}
                placeholder="e.g. BIC"
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-red-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Main Title
              </label>
              <input
                type="text"
                value={hero?.title || ""}
                onChange={(e) => updateField("hero.title", e.target.value)}
                placeholder="e.g. About Best International"
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-red-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Title Accent (Red Color)
              </label>
              <input
                type="text"
                value={hero?.titleAccent || ""}
                onChange={(e) => updateField("hero.titleAccent", e.target.value)}
                placeholder="e.g. Contracting"
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-red-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Hero Description Copy
            </label>
            <textarea
              rows={3}
              value={hero?.description || ""}
              onChange={(e) => updateField("hero.description", e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-red-500 transition"
            />
          </div>

          {/* Background Image Picker */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Hero Background Image
                </label>
                <p className="text-[11px] text-slate-500">
                  Full-width cover photo for About page hero banner.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => openMediaFor("hero.bgImage")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold shadow-sm transition cursor-pointer"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-red-400" />
                  <span>Media Library</span>
                </button>

                <label className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-sm transition cursor-pointer">
                  {uploadingField === "hero.bgImage" ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>{uploadingField === "hero.bgImage" ? "Uploading..." : "Upload File"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleDirectUpload(e, "hero.bgImage")}
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={hero?.bgImage || ""}
                onChange={(e) => updateField("hero.bgImage", e.target.value)}
                placeholder="https://images.unsplash.com/... or /uploads/..."
                className="w-full text-xs font-mono bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-red-500 transition"
              />
              {hero?.bgImage && (
                <button
                  type="button"
                  onClick={() => updateField("hero.bgImage", "")}
                  title="Clear Image"
                  className="p-2.5 text-slate-400 hover:text-red-600 bg-white border border-slate-200 rounded-xl transition cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            {hero?.bgImage && (
              <div className="mt-2.5 h-28 w-full max-w-sm rounded-xl overflow-hidden border border-slate-200 relative bg-slate-900">
                <img src={hero.bgImage} alt="Hero Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* 4 Stats Grid */}
          <div className="pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Hero Metric Counters (4 Stats)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(hero?.stats || []).map((st: any, idx: number) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400">Stat #{idx + 1}</span>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Value</label>
                    <input
                      type="text"
                      value={st.value || ""}
                      onChange={(e) => {
                        const updated = [...(hero.stats || [])];
                        updated[idx].value = e.target.value;
                        updateField("hero.stats", updated);
                      }}
                      className="w-full text-xs font-bold text-red-600 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Label</label>
                    <input
                      type="text"
                      value={st.label || ""}
                      onChange={(e) => {
                        const updated = [...(hero.stats || [])];
                        updated[idx].label = e.target.value;
                        updateField("hero.stats", updated);
                      }}
                      className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 4. TAB 2: WHO WE ARE ─────────────────────────────────── */}
      {activeTab === "whoWeAre" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">&quot;Who We Are&quot; Section Content &amp; Media</h2>
            <p className="text-xs text-slate-500">Manage heading typography, corporate copy, featured section image, floating corner badges, and call-to-action.</p>
          </div>

          {/* Heading Typography */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Badge
              </label>
              <input
                type="text"
                value={whoWeAre?.badge || ""}
                onChange={(e) => updateField("whoWeAre.badge", e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-red-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Heading Line 1
              </label>
              <input
                type="text"
                value={whoWeAre?.headingLine1 || ""}
                onChange={(e) => updateField("whoWeAre.headingLine1", e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-red-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Highlight (Red text)
              </label>
              <input
                type="text"
                value={whoWeAre?.headingHighlight || ""}
                onChange={(e) => updateField("whoWeAre.headingHighlight", e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-red-500 transition"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Heading Line 2
              </label>
              <input
                type="text"
                value={whoWeAre?.headingLine2 || ""}
                onChange={(e) => updateField("whoWeAre.headingLine2", e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-red-500 transition"
              />
            </div>
          </div>

          {/* Copy Paragraphs */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Lead Bold Paragraph
              </label>
              <textarea
                rows={2}
                value={whoWeAre?.leadParagraph || ""}
                onChange={(e) => updateField("whoWeAre.leadParagraph", e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-red-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Secondary Paragraph
              </label>
              <textarea
                rows={3}
                value={whoWeAre?.secondaryParagraph || ""}
                onChange={(e) => updateField("whoWeAre.secondaryParagraph", e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-red-500 transition"
              />
            </div>
          </div>

          {/* ── SECTION IMAGE & VISUAL COMPOSITION CONTROLS ── */}
          <div className="pt-6 border-t border-slate-200 space-y-6">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <ImageIcon className="w-5 h-5 text-red-600" />
              <span>Who We Are Section Image &amp; Floating Overlays</span>
            </div>

            {/* Main Image Selector */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Featured Section Image
                  </label>
                  <p className="text-[11px] text-slate-500">
                    High-resolution construction / corporate visual displayed on the right side of Who We Are.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => openMediaFor("whoWeAre.image")}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold shadow-sm transition cursor-pointer"
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-red-400" />
                    <span>Media Library</span>
                  </button>

                  <label className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-sm transition cursor-pointer">
                    {uploadingField === "whoWeAre.image" ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>{uploadingField === "whoWeAre.image" ? "Uploading..." : "Upload File"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleDirectUpload(e, "whoWeAre.image")}
                    />
                  </label>
                </div>
              </div>

              {/* URL Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={whoWeAre?.image || ""}
                  onChange={(e) => updateField("whoWeAre.image", e.target.value)}
                  placeholder="e.g. /uploads/From_Saudi_Soil.avif or https://..."
                  className="w-full text-xs font-mono bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-red-500 transition"
                />
                {whoWeAre?.image && (
                  <button
                    type="button"
                    onClick={() => updateField("whoWeAre.image", "")}
                    title="Clear Image"
                    className="p-2.5 text-slate-400 hover:text-red-600 bg-white border border-slate-200 rounded-xl transition cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {/* Image Preview */}
              {whoWeAre?.image ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-w-md h-52 bg-slate-900 shadow-sm group">
                  <img
                    src={whoWeAre.image}
                    alt="Who We Are Preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e: any) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=2070&auto=format&fit=crop";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-2 left-3 text-[11px] text-white/90 font-mono font-medium truncate max-w-[90%]">
                    {whoWeAre.image}
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center text-slate-400 text-xs">
                  No image selected. Default fallback image will be shown.
                </div>
              )}
            </div>

            {/* Overlays / Floating Badges Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Top-Left Red Badge */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 uppercase tracking-wider">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                  <span>Top-Left Red Badge</span>
                </div>
                <label className="block text-[10px] text-slate-500 font-medium">Text (Use Enter for new line)</label>
                <textarea
                  rows={2}
                  value={whoWeAre?.redBoxText || ""}
                  onChange={(e) => updateField("whoWeAre.redBoxText", e.target.value)}
                  placeholder="Saudi Arabia&#10;To The World"
                  className="w-full text-xs font-bold bg-white border border-slate-200 rounded-xl p-2.5 outline-none focus:border-red-500 transition"
                />
              </div>

              {/* Bottom-Left Dark Badge */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                  <span>Bottom-Left Dark Badge</span>
                </div>
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={whoWeAre?.darkBoxTextLine1 || ""}
                    onChange={(e) => updateField("whoWeAre.darkBoxTextLine1", e.target.value)}
                    placeholder="Line 1: More Than Projects"
                    className="w-full text-xs font-bold bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-red-500 transition"
                  />
                  <input
                    type="text"
                    value={whoWeAre?.darkBoxTextLine2 || ""}
                    onChange={(e) => updateField("whoWeAre.darkBoxTextLine2", e.target.value)}
                    placeholder="Line 2: A Stronger Tomorrow"
                    className="w-full text-xs text-slate-600 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-red-500 transition"
                  />
                </div>
              </div>

              {/* Bottom-Right Stat Box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <CheckCircle2 size={12} className="text-red-600" />
                  <span>Bottom-Right Stat Badge</span>
                </div>
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={whoWeAre?.statBoxValue || ""}
                    onChange={(e) => updateField("whoWeAre.statBoxValue", e.target.value)}
                    placeholder="Value (e.g. 100%)"
                    className="w-full text-xs font-black text-red-600 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-red-500 transition"
                  />
                  <input
                    type="text"
                    value={whoWeAre?.statBoxLabel || ""}
                    onChange={(e) => updateField("whoWeAre.statBoxLabel", e.target.value)}
                    placeholder="Label (e.g. Trust & Experience)"
                    className="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-red-500 transition"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* CTA & Tagline */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                CTA Button Text
              </label>
              <input
                type="text"
                value={whoWeAre?.ctaButtonText || ""}
                onChange={(e) => updateField("whoWeAre.ctaButtonText", e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-red-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                CTA Button Link
              </label>
              <input
                type="text"
                value={whoWeAre?.ctaButtonLink || ""}
                onChange={(e) => updateField("whoWeAre.ctaButtonLink", e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-red-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Bottom Tagline
              </label>
              <input
                type="text"
                value={whoWeAre?.bottomTagline || ""}
                onChange={(e) => updateField("whoWeAre.bottomTagline", e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-red-500 transition"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── 5. TAB 3: OUR ETHOS ──────────────────────────────────── */}
      {activeTab === "ethos" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">&quot;Our Ethos&quot; Section Configuration</h2>
            <p className="text-xs text-slate-500">Edit Ethos headline, golden hour refinery visual, corner badge, and 4 core value cards.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Badge
              </label>
              <input
                type="text"
                value={ethos?.badge || ""}
                onChange={(e) => updateField("ethos.badge", e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Heading Line 1
              </label>
              <input
                type="text"
                value={ethos?.headingLine1 || ""}
                onChange={(e) => updateField("ethos.headingLine1", e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Heading Highlight (Red)
              </label>
              <input
                type="text"
                value={ethos?.headingHighlight || ""}
                onChange={(e) => updateField("ethos.headingHighlight", e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Lead Paragraph
              </label>
              <textarea
                rows={2}
                value={ethos?.leadParagraph || ""}
                onChange={(e) => updateField("ethos.leadParagraph", e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Secondary Paragraph
              </label>
              <textarea
                rows={2}
                value={ethos?.secondaryParagraph || ""}
                onChange={(e) => updateField("ethos.secondaryParagraph", e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none"
              />
            </div>
          </div>

          {/* Refinery Image Picker */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Ethos Section Photo
                </label>
                <p className="text-[11px] text-slate-500">
                  Featured industrial/refinery photo displayed on the left side of Our Ethos section.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => openMediaFor("ethos.image")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold shadow-sm transition cursor-pointer"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-red-400" />
                  <span>Media Library</span>
                </button>

                <label className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-sm transition cursor-pointer">
                  {uploadingField === "ethos.image" ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>{uploadingField === "ethos.image" ? "Uploading..." : "Upload File"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleDirectUpload(e, "ethos.image")}
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={ethos?.image || ""}
                onChange={(e) => updateField("ethos.image", e.target.value)}
                placeholder="/uploads/... or https://..."
                className="w-full text-xs font-mono bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-red-500 transition"
              />
              {ethos?.image && (
                <button
                  type="button"
                  onClick={() => updateField("ethos.image", "")}
                  title="Clear Image"
                  className="p-2.5 text-slate-400 hover:text-red-600 bg-white border border-slate-200 rounded-xl transition cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            {ethos?.image && (
              <div className="mt-2.5 h-28 w-full max-w-sm rounded-xl overflow-hidden border border-slate-200 relative bg-slate-900">
                <img src={ethos.image} alt="Ethos Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Corner Badge Pill */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Image Corner Badge Text (3 Lines)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={ethos?.cornerBadge?.line1 || ""}
                onChange={(e) => updateField("ethos.cornerBadge.line1", e.target.value)}
                placeholder="Line 1 (e.g. STRONG)"
                className="text-xs font-bold bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none"
              />
              <input
                type="text"
                value={ethos?.cornerBadge?.line2 || ""}
                onChange={(e) => updateField("ethos.cornerBadge.line2", e.target.value)}
                placeholder="Line 2 (e.g. VALUES)"
                className="text-xs font-bold bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none"
              />
              <input
                type="text"
                value={ethos?.cornerBadge?.line3 || ""}
                onChange={(e) => updateField("ethos.cornerBadge.line3", e.target.value)}
                placeholder="Line 3 (e.g. LASTING IMPACT)"
                className="text-xs font-bold bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none"
              />
            </div>
          </div>

          {/* 4 Ethos Cards */}
          <div className="pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              4 Core Ethos Value Cards
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(ethos?.items || []).map((it: any, idx: number) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                  <span className="text-[10px] font-mono font-bold text-slate-400">Card #{idx + 1}</span>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Title</label>
                    <input
                      type="text"
                      value={it.title || ""}
                      onChange={(e) => {
                        const updated = [...(ethos.items || [])];
                        updated[idx].title = e.target.value;
                        updateField("ethos.items", updated);
                      }}
                      className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Icon</label>
                    <select
                      value={it.icon || "ShieldCheck"}
                      onChange={(e) => {
                        const updated = [...(ethos.items || [])];
                        updated[idx].icon = e.target.value;
                        updateField("ethos.items", updated);
                      }}
                      className="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none"
                    >
                      <option value="ShieldCheck">ShieldCheck (Integrity)</option>
                      <option value="Users">Users (People First)</option>
                      <option value="Cog">Cog (Excellence)</option>
                      <option value="Leaf">Leaf (Sustainability)</option>
                      <option value="Sparkles">Sparkles</option>
                      <option value="Award">Award</option>
                      <option value="Compass">Compass</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Description</label>
                    <textarea
                      rows={2}
                      value={it.desc || ""}
                      onChange={(e) => {
                        const updated = [...(ethos.items || [])];
                        updated[idx].desc = e.target.value;
                        updateField("ethos.items", updated);
                      }}
                      className="w-full text-xs text-slate-600 bg-white border border-slate-200 rounded-lg p-2 outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 6. TAB 4: VISION & MISSION ───────────────────────────── */}
      {activeTab === "visionMission" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">&quot;Vision &amp; Mission&quot; Section Configuration</h2>
            <p className="text-xs text-slate-500">Manage headline, structural steel visual, and dedicated Vision &amp; Mission cards with landscape backdrops.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Badge
              </label>
              <input
                type="text"
                value={visionMission?.badge || ""}
                onChange={(e) => updateField("visionMission.badge", e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Heading Line 1
              </label>
              <input
                type="text"
                value={visionMission?.headingLine1 || ""}
                onChange={(e) => updateField("visionMission.headingLine1", e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Heading Highlight (Red)
              </label>
              <input
                type="text"
                value={visionMission?.headingHighlight || ""}
                onChange={(e) => updateField("visionMission.headingHighlight", e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Description Paragraph
            </label>
            <textarea
              rows={2}
              value={visionMission?.description || ""}
              onChange={(e) => updateField("visionMission.description", e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none"
            />
          </div>

          {/* Left Structure Image */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Left Architectural Steel Photo
                </label>
                <p className="text-[11px] text-slate-500">
                  Visual composition backdrop displayed on the left side of Vision &amp; Mission.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => openMediaFor("visionMission.leftImage")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold shadow-sm transition cursor-pointer"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-red-400" />
                  <span>Media Library</span>
                </button>

                <label className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-sm transition cursor-pointer">
                  {uploadingField === "visionMission.leftImage" ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>{uploadingField === "visionMission.leftImage" ? "Uploading..." : "Upload File"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleDirectUpload(e, "visionMission.leftImage")}
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={visionMission?.leftImage || ""}
                onChange={(e) => updateField("visionMission.leftImage", e.target.value)}
                placeholder="/uploads/... or https://..."
                className="w-full text-xs font-mono bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-red-500 transition"
              />
              {visionMission?.leftImage && (
                <button
                  type="button"
                  onClick={() => updateField("visionMission.leftImage", "")}
                  title="Clear Image"
                  className="p-2.5 text-slate-400 hover:text-red-600 bg-white border border-slate-200 rounded-xl transition cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            {visionMission?.leftImage && (
              <div className="mt-2.5 h-28 w-full max-w-sm rounded-xl overflow-hidden border border-slate-200 relative bg-slate-900">
                <img src={visionMission.leftImage} alt="Left Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Two Cards: Vision & Mission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            
            {/* 1. Vision Card */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Eye size={18} className="text-red-600" />
                <span>Our Vision Card</span>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Title</label>
                <input
                  type="text"
                  value={visionMission?.vision?.title || ""}
                  onChange={(e) => updateField("visionMission.vision.title", e.target.value)}
                  className="w-full text-xs font-bold bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-red-500 transition"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Vision Statement / Description</label>
                <textarea
                  rows={3}
                  value={visionMission?.vision?.desc || ""}
                  onChange={(e) => updateField("visionMission.vision.desc", e.target.value)}
                  className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-red-500 transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Card Backdrop Image</label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openMediaFor("visionMission.vision.image")}
                      className="text-[11px] font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1"
                    >
                      <FolderOpen size={11} className="text-red-600" />
                      <span>Library</span>
                    </button>
                    <label className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer">
                      <Upload size={11} />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleDirectUpload(e, "visionMission.vision.image")}
                      />
                    </label>
                  </div>
                </div>
                <input
                  type="text"
                  value={visionMission?.vision?.image || ""}
                  onChange={(e) => updateField("visionMission.vision.image", e.target.value)}
                  placeholder="/uploads/... or https://..."
                  className="w-full text-xs font-mono bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-red-500 transition"
                />
                {visionMission?.vision?.image && (
                  <div className="mt-2 h-20 w-full rounded-lg overflow-hidden border border-slate-200 relative bg-slate-900">
                    <img src={visionMission.vision.image} alt="Vision Card Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Pill Text (3 lines)</label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={visionMission?.vision?.pill?.line1 || ""}
                    onChange={(e) => updateField("visionMission.vision.pill.line1", e.target.value)}
                    placeholder="Line 1"
                    className="text-[11px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1.5 outline-none"
                  />
                  <input
                    type="text"
                    value={visionMission?.vision?.pill?.line2 || ""}
                    onChange={(e) => updateField("visionMission.vision.pill.line2", e.target.value)}
                    placeholder="Line 2"
                    className="text-[11px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1.5 outline-none"
                  />
                  <input
                    type="text"
                    value={visionMission?.vision?.pill?.line3 || ""}
                    onChange={(e) => updateField("visionMission.vision.pill.line3", e.target.value)}
                    placeholder="Line 3"
                    className="text-[11px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1.5 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 2. Mission Card */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Target size={18} className="text-red-600" />
                <span>Our Mission Card</span>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Title</label>
                <input
                  type="text"
                  value={visionMission?.mission?.title || ""}
                  onChange={(e) => updateField("visionMission.mission.title", e.target.value)}
                  className="w-full text-xs font-bold bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-red-500 transition"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mission Statement / Description</label>
                <textarea
                  rows={3}
                  value={visionMission?.mission?.desc || ""}
                  onChange={(e) => updateField("visionMission.mission.desc", e.target.value)}
                  className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-red-500 transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Card Backdrop Image</label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openMediaFor("visionMission.mission.image")}
                      className="text-[11px] font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1"
                    >
                      <FolderOpen size={11} className="text-red-600" />
                      <span>Library</span>
                    </button>
                    <label className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer">
                      <Upload size={11} />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleDirectUpload(e, "visionMission.mission.image")}
                      />
                    </label>
                  </div>
                </div>
                <input
                  type="text"
                  value={visionMission?.mission?.image || ""}
                  onChange={(e) => updateField("visionMission.mission.image", e.target.value)}
                  placeholder="/uploads/... or https://..."
                  className="w-full text-xs font-mono bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-red-500 transition"
                />
                {visionMission?.mission?.image && (
                  <div className="mt-2 h-20 w-full rounded-lg overflow-hidden border border-slate-200 relative bg-slate-900">
                    <img src={visionMission.mission.image} alt="Mission Card Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Pill Text (3 lines)</label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={visionMission?.mission?.pill?.line1 || ""}
                    onChange={(e) => updateField("visionMission.mission.pill.line1", e.target.value)}
                    placeholder="Line 1"
                    className="text-[11px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1.5 outline-none"
                  />
                  <input
                    type="text"
                    value={visionMission?.mission?.pill?.line2 || ""}
                    onChange={(e) => updateField("visionMission.mission.pill.line2", e.target.value)}
                    placeholder="Line 2"
                    className="text-[11px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1.5 outline-none"
                  />
                  <input
                    type="text"
                    value={visionMission?.mission?.pill?.line3 || ""}
                    onChange={(e) => updateField("visionMission.mission.pill.line3", e.target.value)}
                    placeholder="Line 3"
                    className="text-[11px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1.5 outline-none"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── 7. TAB 5: SEO & SOCIAL ────────────────────────────────── */}
      {activeTab === "seo" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Search Engine Optimization (SEO) &amp; Social Meta</h2>
            <p className="text-xs text-slate-500">Configure page title, meta description, and social share thumbnail preview.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Meta Title
            </label>
            <input
              type="text"
              value={seo?.metaTitle || ""}
              onChange={(e) => updateField("seo.metaTitle", e.target.value)}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-red-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Meta Description
            </label>
            <textarea
              rows={3}
              value={seo?.metaDescription || ""}
              onChange={(e) => updateField("seo.metaDescription", e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-red-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Focus Keyword
              </label>
              <input
                type="text"
                value={seo?.focusKeyword || ""}
                onChange={(e) => updateField("seo.focusKeyword", e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-red-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Canonical URL
              </label>
              <input
                type="text"
                value={seo?.canonicalUrl || ""}
                onChange={(e) => updateField("seo.canonicalUrl", e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-red-500 transition"
              />
            </div>
          </div>

          {/* OG Social Image */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  OG Social Image
                </label>
                <p className="text-[11px] text-slate-500">
                  Thumbnail preview displayed when sharing the About Us page on WhatsApp, LinkedIn, Twitter, etc.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => openMediaFor("seo.ogImage")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold shadow-sm transition cursor-pointer"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-red-400" />
                  <span>Media Library</span>
                </button>

                <label className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-sm transition cursor-pointer">
                  {uploadingField === "seo.ogImage" ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>{uploadingField === "seo.ogImage" ? "Uploading..." : "Upload File"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleDirectUpload(e, "seo.ogImage")}
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={seo?.ogImage || ""}
                onChange={(e) => updateField("seo.ogImage", e.target.value)}
                placeholder="/uploads/... or https://..."
                className="w-full text-xs font-mono bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-red-500 transition"
              />
              {seo?.ogImage && (
                <button
                  type="button"
                  onClick={() => updateField("seo.ogImage", "")}
                  title="Clear Image"
                  className="p-2.5 text-slate-400 hover:text-red-600 bg-white border border-slate-200 rounded-xl transition cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            {seo?.ogImage && (
              <div className="mt-2.5 h-28 w-full max-w-sm rounded-xl overflow-hidden border border-slate-200 relative bg-slate-900">
                <img src={seo.ogImage} alt="OG Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 8. MEDIA LIBRARY MODAL ─────────────────────────────────── */}
      <MediaLibraryModal
        isOpen={mediaModalOpen}
        onClose={() => {
          setMediaModalOpen(false);
          setTargetFieldPath(null);
        }}
        onSelectImage={(url) => {
          if (targetFieldPath) {
            updateField(targetFieldPath, url);
          }
          setMediaModalOpen(false);
          setTargetFieldPath(null);
        }}
      />

    </div>
  );
}
