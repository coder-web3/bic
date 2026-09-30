"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Image as ImageIcon,
  Save,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Layers,
  Sliders,
  Search,
  Eye,
  Settings2,
  FolderPlus,
  Upload,
} from "lucide-react";
import MediaLibraryModal from "@/components/MediaLibraryModal";

const DEFAULT_CATEGORIES = [
  "Fleet Operations",
  "Civil Works",
  "Plant Maintenance",
  "Industrial Access",
  "Heavy Lifting",
  "Mechanical Works",
  "Electrical Works",
  "Material Supply",
  "Site Delivery",
];

export default function AdminGalleryPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"media" | "hero" | "settings" | "seo">("media");
  
  // Media search / filter in admin
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // Media Library Modal state
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [targetFieldPath, setTargetFieldPath] = useState<string | null>(null);

  // New Image draft state
  const [newImage, setNewImage] = useState({
    src: "",
    category: "Fleet Operations",
  });
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch initial data
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/gallery");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to load gallery data:", err);
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

      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3500);
      } else {
        alert("Failed to save gallery data. Please try again.");
      }
    } catch (err) {
      console.error("Error saving gallery data:", err);
      alert("Error saving gallery data.");
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

  // Helper to update specific image item by index directly
  const updateImageItem = (index: number, field: string, value: any) => {
    setData((prev: any) => {
      const copy = JSON.parse(JSON.stringify(prev || {}));
      const imgs = Array.isArray(copy.images) ? [...copy.images] : [];
      if (index >= 0 && index < imgs.length) {
        imgs[index] = { ...imgs[index], [field]: value };
      }
      return { ...copy, images: imgs };
    });
  };

  // Open Media Library Modal for a specific path
  const openMediaFor = (pathStr: string) => {
    setTargetFieldPath(pathStr);
    setMediaModalOpen(true);
  };

  // Callback when an image is selected in the media library
  const handleSelectMedia = (url: string) => {
    if (!url) {
      setMediaModalOpen(false);
      setTargetFieldPath(null);
      return;
    }

    if (targetFieldPath === "newImage.src") {
      setNewImage((prev) => ({ ...prev, src: url }));
    } else if (targetFieldPath === "quickAdd") {
      const newItem = {
        id: `gal-${Date.now()}`,
        src: url,
        category: filterCategory !== "All" ? filterCategory : "Fleet Operations",
      };
      setData((prev: any) => ({
        ...prev,
        images: [newItem, ...(prev?.images || [])],
      }));
    } else if (targetFieldPath?.startsWith("images.")) {
      const parts = targetFieldPath.split(".");
      const idx = parseInt(parts[1], 10);
      const field = parts[2] || "src";
      updateImageItem(idx, field, url);
    } else if (targetFieldPath) {
      updateField(targetFieldPath, url);
    }
    setMediaModalOpen(false);
    setTargetFieldPath(null);
  };

  // Add a new image item
  const handleAddImage = () => {
    if (!newImage.src.trim()) {
      alert("Please provide an image URL or choose from Media Library.");
      return;
    }
    const newItem = {
      id: `gal-${Date.now()}`,
      src: newImage.src.trim(),
      category: newImage.category.trim() || "Fleet Operations",
    };
    setData((prev: any) => ({
      ...prev,
      images: [newItem, ...(prev?.images || [])],
    }));
    setNewImage({ src: "", category: "Fleet Operations" });
    setShowAddModal(false);
  };

  // Delete image
  const handleDeleteImage = (index: number) => {
    if (confirm("Are you sure you want to remove this image from the gallery?")) {
      setData((prev: any) => {
        const updated = [...(prev?.images || [])];
        updated.splice(index, 1);
        return { ...prev, images: updated };
      });
    }
  };

  // Move image up / down
  const handleMoveImage = (index: number, direction: "up" | "down") => {
    setData((prev: any) => {
      const updated = [...(prev?.images || [])];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= updated.length) return prev;
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return { ...prev, images: updated };
    });
  };

  // Add / Remove Tagline
  const handleAddTagline = () => {
    setData((prev: any) => ({
      ...prev,
      hero: {
        ...prev.hero,
        taglines: [...(prev.hero?.taglines || []), "NEW INDUSTRIAL CAPABILITY"],
      },
    }));
  };

  const handleRemoveTagline = (index: number) => {
    setData((prev: any) => {
      const copy = [...(prev.hero?.taglines || [])];
      copy.splice(index, 1);
      return {
        ...prev,
        hero: { ...prev.hero, taglines: copy },
      };
    });
  };

  // Add / Remove Stat
  const handleAddStat = () => {
    setData((prev: any) => ({
      ...prev,
      hero: {
        ...prev.hero,
        stats: [...(prev.hero?.stats || []), { value: "100+", label: "Verified Landmark" }],
      },
    }));
  };

  const handleRemoveStat = (index: number) => {
    setData((prev: any) => {
      const copy = [...(prev.hero?.stats || [])];
      copy.splice(index, 1);
      return {
        ...prev,
        hero: { ...prev.hero, stats: copy },
      };
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <RefreshCw className="w-8 h-8 text-[#E62E2D] animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading Gallery CMS...</p>
      </div>
    );
  }

  const images = data?.images || [];
  const filteredImages = images.filter((img: any, idx: number) => {
    const matchesQuery = !searchQuery || (img.category || "").toLowerCase().includes(searchQuery.toLowerCase()) || (img.src || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategory === "All" || img.category === filterCategory;
    return matchesQuery && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24">
      {/* ── TOP HEADER BAR ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5 text-xs font-bold text-[#E62E2D] uppercase tracking-wider mb-1">
            <ImageIcon size={16} />
            <span>Visual Assets Management</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Gallery Page <span className="text-[#E62E2D]">CMS & Media Archive</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage live project site photos, category tags, pagination limits, hero banner metrics, and SEO metadata.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/gallery"
            target="_blank"
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition"
          >
            <Eye size={14} />
            <span>View Live Gallery</span>
            <ExternalLink size={12} className="text-slate-400" />
          </Link>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-600/20 transition cursor-pointer disabled:opacity-50"
          >
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            <span>{saving ? "Saving Changes..." : "Save All Changes"}</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>Gallery CMS successfully updated and revalidated live!</span>
        </div>
      )}

      {/* ── NAVIGATION TABS ───────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("media")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === "media"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <ImageIcon size={15} />
          <span>Media Archive ({images.length} Photos)</span>
        </button>

        <button
          onClick={() => setActiveTab("hero")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === "hero"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Layers size={15} />
          <span>Hero Section & Stats</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === "settings"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Sliders size={15} />
          <span>Display & Pagination</span>
        </button>

        <button
          onClick={() => setActiveTab("seo")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === "seo"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Sparkles size={15} />
          <span>SEO & Metadata</span>
        </button>
      </div>

      {/* ── TAB 1: MEDIA ARCHIVE & PHOTOS (CRUD) ───────────────────── */}
      {activeTab === "media" && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by category or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#E62E2D]"
                />
              </div>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:border-[#E62E2D]"
              >
                <option value="All">All Categories ({images.length})</option>
                {DEFAULT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openMediaFor("quickAdd")}
                className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                title="Pick an image from Media Library and immediately add to gallery"
              >
                <Upload size={14} />
                <span>+ Pick from Media Library</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-xs"
              >
                <Plus size={14} />
                <span>Add Custom URL</span>
              </button>
            </div>
          </div>

          {/* Add Image Modal */}
          {showAddModal && (
            <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FolderPlus size={16} className="text-[#E62E2D]" />
                  <h3 className="font-bold text-sm">Add New Photo to Media Archive</h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Image Source URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://... or /uploads/..."
                      value={newImage.src}
                      onChange={(e) => setNewImage({ ...newImage, src: e.target.value })}
                      className="flex-1 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                    />
                    <button
                      type="button"
                      onClick={() => openMediaFor("newImage.src")}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Upload size={13} />
                      <span>Library</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Category Tag
                  </label>
                  <select
                    value={newImage.category}
                    onChange={(e) => setNewImage({ ...newImage, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                  >
                    {DEFAULT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preview */}
              {newImage.src && (
                <div className="mt-2 w-36 h-24 rounded-xl overflow-hidden border border-slate-700 relative">
                  <img src={newImage.src} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Insert Photo into Gallery</span>
                </button>
              </div>
            </div>
          )}

          {/* Photos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredImages.map((item: any, idx: number) => {
              const originalIndex = images.findIndex((x: any) => x === item || (x.id && x.id === item.id) || (x.src === item.src && x.category === item.category));
              const safeIndex = originalIndex >= 0 ? originalIndex : idx;
              const num = String(safeIndex + 1).padStart(2, "0");

              return (
                <div
                  key={item.id || `gal-${safeIndex}`}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group"
                >
                  {/* Image Preview Container */}
                  <div 
                    onClick={() => openMediaFor(`images.${safeIndex}.src`)}
                    className="relative h-48 sm:h-52 bg-slate-950 overflow-hidden cursor-pointer group/img"
                    title="Click to change image from Media Library"
                  >
                    <img
                      src={item.src}
                      alt={`Gallery Asset ${num}`}
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    {/* Number Badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-mono font-bold">
                      #{num}
                    </div>

                    {/* Category Tag */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-[#E62E2D] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                      {item.category || "Fleet Operations"}
                    </div>

                    {/* Replace Image Overlay Prompt */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-3 py-1.5 rounded-lg bg-white/90 text-slate-900 text-xs font-bold flex items-center gap-1.5 shadow-lg">
                        <Upload size={13} className="text-[#E62E2D]" /> Change Photo
                      </span>
                    </div>

                    {/* Quick Move & Delete Actions Overlay */}
                    <div 
                      onClick={(e) => e.stopPropagation()}
                      className="absolute bottom-3 right-3 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition z-10"
                    >
                      <button
                        type="button"
                        onClick={() => handleMoveImage(safeIndex, "up")}
                        disabled={safeIndex === 0}
                        title="Move Up"
                        className="w-7 h-7 rounded-lg bg-black/70 hover:bg-black text-white flex items-center justify-center disabled:opacity-30 transition cursor-pointer"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveImage(safeIndex, "down")}
                        disabled={safeIndex === images.length - 1}
                        title="Move Down"
                        className="w-7 h-7 rounded-lg bg-black/70 hover:bg-black text-white flex items-center justify-center disabled:opacity-30 transition cursor-pointer"
                      >
                        <ArrowDown size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(safeIndex)}
                        title="Delete Image"
                        className="w-7 h-7 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition cursor-pointer shadow-xs"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Edit Controls Body */}
                  <div className="p-4 space-y-3 bg-white flex-1 flex flex-col justify-between">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Category Tag
                      </label>
                      <select
                        value={item.category || "Fleet Operations"}
                        onChange={(e) => updateImageItem(safeIndex, "category", e.target.value)}
                        className="w-full text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white font-medium text-slate-800 focus:outline-none focus:border-[#E62E2D]"
                      >
                        {DEFAULT_CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Image URL / Replace
                      </label>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={item.src}
                          onChange={(e) => updateImageItem(safeIndex, "src", e.target.value)}
                          className="flex-1 text-[11px] py-1 px-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white text-slate-700 font-mono truncate"
                        />
                        <button
                          type="button"
                          onClick={() => openMediaFor(`images.${safeIndex}.src`)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                          title="Choose from media library"
                        >
                          <Upload size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredImages.length === 0 && (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
              No gallery images found matching your search.
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: HERO SECTION & STATS ────────────────────────────── */}
      {activeTab === "hero" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-6">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Layers size={16} className="text-[#E62E2D]" />
              <span>Hero Header Configuration</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Badge Text
                </label>
                <input
                  type="text"
                  value={data?.hero?.badge || ""}
                  onChange={(e) => updateField("hero.badge", e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#E62E2D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Watermark Label
                </label>
                <input
                  type="text"
                  value={data?.hero?.watermark || ""}
                  onChange={(e) => updateField("hero.watermark", e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#E62E2D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Main Title
                </label>
                <input
                  type="text"
                  value={data?.hero?.title || ""}
                  onChange={(e) => updateField("hero.title", e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#E62E2D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Title Accent (Red Highlighted)
                </label>
                <input
                  type="text"
                  value={data?.hero?.titleAccent || ""}
                  onChange={(e) => updateField("hero.titleAccent", e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#E62E2D]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Hero Background Image
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={data?.hero?.bgImage || ""}
                    onChange={(e) => updateField("hero.bgImage", e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#E62E2D] font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => openMediaFor("hero.bgImage")}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <Upload size={13} />
                    <span>Media Library</span>
                  </button>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Description Paragraph
                </label>
                <textarea
                  rows={3}
                  value={data?.hero?.description || ""}
                  onChange={(e) => updateField("hero.description", e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#E62E2D]"
                />
              </div>
            </div>

            {/* Taglines List */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Hero Taglines (Bullet Tickers)
                </label>
                <button
                  type="button"
                  onClick={handleAddTagline}
                  className="text-xs font-bold text-[#E62E2D] hover:underline flex items-center gap-1"
                >
                  <Plus size={13} />
                  <span>Add Tagline</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(data?.hero?.taglines || []).map((tag: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => updateField(`hero.taglines.${idx}`, e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveTagline(idx)}
                      className="p-1.5 text-slate-400 hover:text-red-600 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Metrics Counters */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Stats Counter Badges
                </label>
                <button
                  type="button"
                  onClick={handleAddStat}
                  className="text-xs font-bold text-[#E62E2D] hover:underline flex items-center gap-1"
                >
                  <Plus size={13} />
                  <span>Add Stat Badge</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {(data?.hero?.stats || []).map((stat: any, idx: number) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 relative group">
                    <button
                      type="button"
                      onClick={() => handleRemoveStat(idx)}
                      className="absolute top-2 right-2 text-slate-300 hover:text-red-600 transition"
                    >
                      <Trash2 size={13} />
                    </button>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Value</span>
                      <input
                        type="text"
                        value={stat.value || ""}
                        onChange={(e) => updateField(`hero.stats.${idx}.value`, e.target.value)}
                        className="w-full px-2 py-1 text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Label</span>
                      <input
                        type="text"
                        value={stat.label || ""}
                        onChange={(e) => updateField(`hero.stats.${idx}.label`, e.target.value)}
                        className="w-full px-2 py-1 text-xs text-slate-600 bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: DISPLAY & PAGINATION SETTINGS ───────────────────── */}
      {activeTab === "settings" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-6">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Sliders size={16} className="text-[#E62E2D]" />
            <span>Showcase & Pagination Settings</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Items Per Page (Pagination Limit)
              </label>
              <select
                value={data?.settings?.itemsPerPage || 6}
                onChange={(e) => updateField("settings.itemsPerPage", parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-bold text-slate-800 focus:outline-none focus:border-[#E62E2D]"
              >
                <option value={3}>3 Items per page</option>
                <option value={6}>6 Items per page (Recommended)</option>
                <option value={9}>9 Items per page</option>
                <option value={12}>12 Items per page</option>
                <option value={18}>18 Items per page</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Controls how many photos appear before triggering bottom pagination page buttons.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Section Mini Badge
              </label>
              <input
                type="text"
                value={data?.settings?.sectionBadge || ""}
                onChange={(e) => updateField("settings.sectionBadge", e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#E62E2D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Section Heading
              </label>
              <input
                type="text"
                value={data?.settings?.sectionTitle || ""}
                onChange={(e) => updateField("settings.sectionTitle", e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#E62E2D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Section Heading Accent
              </label>
              <input
                type="text"
                value={data?.settings?.sectionTitleAccent || ""}
                onChange={(e) => updateField("settings.sectionTitleAccent", e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#E62E2D]"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: SEO & METADATA ─────────────────────────────────── */}
      {activeTab === "seo" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-6">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Sparkles size={16} className="text-[#E62E2D]" />
            <span>Search Engine Optimization (SEO)</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Meta Title
              </label>
              <input
                type="text"
                value={data?.seo?.title || ""}
                onChange={(e) => updateField("seo.title", e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#E62E2D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Focus Keyword
              </label>
              <input
                type="text"
                value={data?.seo?.focusKeyword || ""}
                onChange={(e) => updateField("seo.focusKeyword", e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#E62E2D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Meta Description
              </label>
              <textarea
                rows={3}
                value={data?.seo?.description || ""}
                onChange={(e) => updateField("seo.description", e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#E62E2D]"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── STICKY BOTTOM SAVE BAR ────────────────────────────────── */}
      <div className="fixed bottom-6 right-8 left-72 bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl border border-slate-800 shadow-2xl flex items-center justify-between z-40">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#E62E2D] animate-pulse" />
          <span className="text-xs font-medium text-slate-300">
            You have unsaved changes in Gallery CMS. Click Save to publish immediately.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition"
          >
            Discard
          </button>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-600/20 transition cursor-pointer disabled:opacity-50"
          >
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            <span>{saving ? "Saving..." : "Publish Live Updates"}</span>
          </button>
        </div>
      </div>

      {/* ── MEDIA LIBRARY MODAL ───────────────────────────────────── */}
      <MediaLibraryModal
        isOpen={mediaModalOpen}
        onClose={() => {
          setMediaModalOpen(false);
          setTargetFieldPath(null);
        }}
        onSelect={handleSelectMedia}
        onSelectMedia={handleSelectMedia}
        onSelectImage={handleSelectMedia}
      />
    </div>
  );
}
