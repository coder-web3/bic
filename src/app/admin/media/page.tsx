"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Copy, 
  Check, 
  Search, 
  RefreshCw, 
  FolderOpen, 
  ExternalLink,
  Eye,
  FileText,
  Sparkles,
  Layers,
  X,
  Tag,
  Edit3,
  Save,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface MediaItem {
  filename: string;
  url: string;
  size?: number;
  createdAt?: string;
  alt?: string;
  title?: string;
}

// Preset stock industrial images
const presetStockImages = [
  {
    name: "Civil Construction Foundations",
    url: "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=1000&auto=format&fit=crop",
    category: "Civil Works",
    alt: "Civil construction foundations and reinforced concrete structure execution"
  },
  {
    name: "Mechanical & Electrical Plant Erection",
    url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1000&auto=format&fit=crop",
    category: "Mechanical",
    alt: "Industrial mechanical plant and electrical equipment erection"
  },
  {
    name: "High Pressure Piping Fabrication",
    url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop",
    category: "Piping",
    alt: "High pressure industrial process piping spool fabrication and welding"
  },
  {
    name: "Electrical Substation & Instrumentation",
    url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1000&auto=format&fit=crop",
    category: "Electrical",
    alt: "Electrical substation automation, cabling, and instrumentation panel"
  },
  {
    name: "Heavy Machinery & Fleet Erection",
    url: "https://images.unsplash.com/photo-1504307651254-35680f356f12?q=80&w=1000&auto=format&fit=crop",
    category: "Equipment",
    alt: "Heavy construction crane and machinery mobilization on job site"
  },
  {
    name: "Scaffolding & Plant Shutdown Services",
    url: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?q=80&w=1000&auto=format&fit=crop",
    category: "Scaffolding",
    alt: "Certified industrial scaffolding erected for turnaround and maintenance"
  },
  {
    name: "Plant Turnarounds & Refineries",
    url: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=1000&auto=format&fit=crop",
    category: "Refinery",
    alt: "Turnaround maintenance overhaul at Saudi petrochemical refinery plant"
  },
  {
    name: "Industrial Site Logistics & Supplies",
    url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1000&auto=format&fit=crop",
    category: "Logistics",
    alt: "Industrial warehouse materials storage and supply logistics distribution"
  }
];

export default function AdminMediaLibraryPage() {
  const [activeTab, setActiveTab] = useState<"uploads" | "presets">("uploads");
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<{ 
    url: string; 
    name: string; 
    alt?: string;
    size?: number;
    createdAt?: string;
    isPreset?: boolean;
  } | null>(null);
  
  // Alt tag editing states
  const [editingAltItem, setEditingAltItem] = useState<MediaItem | null>(null);
  const [altInputValue, setAltInputValue] = useState("");
  const [savingAlt, setSavingAlt] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/upload");
      if (res.ok) {
        const data = await res.json();
        setMediaList(data.files || []);
      }
    } catch (err) {
      console.error("Failed to fetch media:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        // Auto-generate clean friendly alt tag from filename
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        formData.append("alt", cleanName);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setMediaList((prev) => [
              {
                filename: data.filename,
                url: data.url,
                size: data.size,
                createdAt: new Date().toISOString(),
                alt: data.alt || cleanName,
              },
              ...prev,
            ]);
          }
        }
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSaveAltTag = async (key: string, newAlt: string) => {
    setSavingAlt(true);
    try {
      const res = await fetch("/api/upload", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: key, alt: newAlt }),
      });

      if (res.ok) {
        setMediaList((prev) =>
          prev.map((item) =>
            item.filename === key || item.url === key ? { ...item, alt: newAlt } : item
          )
        );
        if (previewItem && (previewItem.name === key || previewItem.url === key)) {
          setPreviewItem({ ...previewItem, alt: newAlt });
        }
        setSaveSuccessMsg(true);
        setTimeout(() => setSaveSuccessMsg(false), 2500);
        setEditingAltItem(null);
      }
    } catch (err) {
      console.error("Failed to save alt tag:", err);
    } finally {
      setSavingAlt(false);
    }
  };

  const openQuickAltEditor = (item: MediaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAltItem(item);
    setAltInputValue(item.alt || "");
  };

  const handleDelete = async (filename: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to permanently delete "${filename}"?`)) return;

    try {
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMediaList((prev) => prev.filter((item) => item.filename !== filename));
        if (previewItem?.name === filename) setPreviewItem(null);
      }
    } catch (err) {
      console.error("Failed to delete file:", err);
    }
  };

  const copyToClipboard = (url: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Filtered lists (search by filename OR alt tag)
  const filteredUploads = mediaList.filter((item) =>
    item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.alt && item.alt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredPresets = presetStockImages.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.alt && item.alt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-16">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ImageIcon className="text-[#E62E2D]" size={24} />
            Media & Asset Library
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Upload images, customize SEO Alt tags for accessibility & search ranking, and copy URLs across your site.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMedia}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors cursor-pointer"
            title="Refresh assets"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#E62E2D]" : ""}`} />
            Refresh
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#E62E2D] hover:bg-red-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 cursor-pointer"
          >
            {uploading ? <RefreshCw className="animate-spin" size={16} /> : <Upload size={16} />}
            {uploading ? "Uploading..." : "Upload from Device"}
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileUpload(e.target.files)}
      />

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFileUpload(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
          dragActive
            ? "border-[#E62E2D] bg-red-50/50 scale-[1.01]"
            : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50/60 shadow-sm"
        }`}
      >
        <div className="w-14 h-14 rounded-2xl bg-red-100/70 text-[#E62E2D] flex items-center justify-center mx-auto mb-3 shadow-inner">
          <Upload size={24} />
        </div>
        <h3 className="text-base font-bold text-gray-900">
          Drag & Drop Images Here, or <span className="text-[#E62E2D] underline">Browse Files</span>
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Supports JPG, PNG, WEBP, GIF, SVG, and AVIF (Up to 10MB per file). Alt tags are automatically indexed.
        </p>
      </div>

      {/* Navigation & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        {/* Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("uploads")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              activeTab === "uploads"
                ? "bg-[#111] text-white shadow-md"
                : "bg-white text-gray-600 hover:text-gray-900 border border-gray-100 hover:bg-gray-50"
            }`}
          >
            <FolderOpen size={16} className={activeTab === "uploads" ? "text-[#E62E2D]" : "text-gray-400"} />
            Uploaded Images ({mediaList.length})
          </button>

          <button
            onClick={() => setActiveTab("presets")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              activeTab === "presets"
                ? "bg-[#111] text-white shadow-md"
                : "bg-white text-gray-600 hover:text-gray-900 border border-gray-100 hover:bg-gray-50"
            }`}
          >
            <Sparkles size={16} className={activeTab === "presets" ? "text-[#E62E2D]" : "text-gray-400"} />
            Stock Industrial Presets ({presetStockImages.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by file name or alt tag..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:border-[#E62E2D] focus:ring-1 focus:ring-[#E62E2D] outline-none"
          />
        </div>
      </div>

      {/* Asset Grid */}
      {activeTab === "uploads" ? (
        loading ? (
          <div className="flex items-center justify-center py-20 bg-white rounded-2xl border">
            <RefreshCw className="w-8 h-8 animate-spin text-[#E62E2D]" />
            <span className="ml-3 text-sm font-medium text-gray-600">Loading uploaded media...</span>
          </div>
        ) : filteredUploads.length === 0 ? (
          <div className="bg-white rounded-2xl border p-16 text-center text-gray-500 shadow-sm">
            <ImageIcon className="w-14 h-14 text-gray-300 mx-auto mb-3" />
            <p className="font-bold text-lg text-gray-800">
              {searchQuery ? "No matching assets found" : "No uploaded images yet"}
            </p>
            <p className="text-sm mt-1 text-gray-500">
              {searchQuery ? "Try a different search keyword" : "Upload your first asset from device above"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredUploads.map((item) => (
              <div
                key={item.filename}
                onClick={() => setPreviewItem({ 
                  url: item.url, 
                  name: item.filename, 
                  alt: item.alt,
                  size: item.size,
                  createdAt: item.createdAt,
                  isPreset: false 
                })}
                className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:border-red-300"
              >
                {/* Image Preview Container */}
                <div className="relative aspect-[4/3] w-full bg-gray-950 overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.alt || item.filename}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e: any) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=600&auto=format&fit=crop";
                    }}
                  />

                  {/* Alt Tag Presence Indicator Top Banner */}
                  <div className="absolute top-2 left-2 max-w-[85%] z-10 pointer-events-none">
                    {item.alt ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/75 text-emerald-300 border border-emerald-500/40 text-[10px] font-semibold backdrop-blur-sm truncate">
                        <Tag size={10} className="shrink-0" />
                        <span className="truncate">ALT: {item.alt}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-900/80 text-amber-200 border border-amber-500/40 text-[10px] font-semibold backdrop-blur-sm">
                        <AlertCircle size={10} className="shrink-0" />
                        No Alt Tag
                      </span>
                    )}
                  </div>

                  {/* Hover Overlay with Action Buttons */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2 z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewItem({ 
                          url: item.url, 
                          name: item.filename, 
                          alt: item.alt,
                          size: item.size,
                          createdAt: item.createdAt,
                          isPreset: false 
                        });
                      }}
                      className="p-2 bg-white/90 hover:bg-white text-gray-900 rounded-lg transition"
                      title="Preview & Edit Alt"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={(e) => openQuickAltEditor(item, e)}
                      className="p-2 bg-white/90 hover:bg-white text-blue-700 rounded-lg transition"
                      title="Edit Alt Tag"
                    >
                      <Edit3 size={16} />
                    </button>

                    <button
                      onClick={(e) => copyToClipboard(item.url, e)}
                      className="p-2 bg-white/90 hover:bg-white text-gray-900 rounded-lg transition"
                      title="Copy URL"
                    >
                      {copiedUrl === item.url ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                    </button>

                    <button
                      onClick={(e) => handleDelete(item.filename, e)}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                      title="Delete asset"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Card Meta Footer */}
                <div className="p-3.5 flex flex-col justify-between flex-1 bg-white space-y-2">
                  <div>
                    <p className="text-xs font-bold text-gray-900 truncate" title={item.filename}>
                      {item.filename}
                    </p>
                    
                    {/* Alt Tag Display Row */}
                    <div className="mt-1.5 flex items-center justify-between gap-1.5">
                      <div className="flex-1 min-w-0">
                        {item.alt ? (
                          <span 
                            className="block text-[11px] text-gray-600 font-medium truncate" 
                            title={item.alt}
                          >
                            <span className="font-bold text-gray-400">ALT:</span> {item.alt}
                          </span>
                        ) : (
                          <span className="text-[11px] text-amber-600 italic">
                            Alt tag missing
                          </span>
                        )}
                      </div>
                      
                      <button
                        type="button"
                        onClick={(e) => openQuickAltEditor(item, e)}
                        className="text-[10px] font-bold text-[#E62E2D] hover:underline shrink-0 flex items-center gap-0.5"
                      >
                        <Edit3 size={11} /> {item.alt ? "Edit" : "+ Add Alt"}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px] text-gray-400">
                    <span>{formatFileSize(item.size)}</span>
                    <button
                      onClick={(e) => copyToClipboard(item.url, e)}
                      className="text-[#E62E2D] hover:underline font-bold"
                    >
                      {copiedUrl === item.url ? "Copied!" : "Copy URL"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Presets Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredPresets.map((preset, idx) => (
            <div
              key={idx}
              onClick={() => setPreviewItem({ 
                url: preset.url, 
                name: preset.name, 
                alt: preset.alt,
                isPreset: true 
              })}
              className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:border-red-300"
            >
              <div className="relative aspect-[4/3] w-full bg-gray-950 overflow-hidden">
                <img
                  src={preset.url}
                  alt={preset.alt || preset.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-bold tracking-wider uppercase backdrop-blur-sm z-10">
                  {preset.category}
                </span>

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2 z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewItem({ 
                        url: preset.url, 
                        name: preset.name, 
                        alt: preset.alt,
                        isPreset: true 
                      });
                    }}
                    className="p-2 bg-white/90 hover:bg-white text-gray-900 rounded-lg transition"
                    title="Preview"
                  >
                    <Eye size={16} />
                  </button>

                  <button
                    onClick={(e) => copyToClipboard(preset.url, e)}
                    className="p-2 bg-[#E62E2D] hover:bg-red-700 text-white rounded-lg transition"
                    title="Copy URL"
                  >
                    {copiedUrl === preset.url ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <div className="p-3.5 flex flex-col justify-between flex-1 bg-white space-y-2">
                <div>
                  <p className="text-xs font-bold text-gray-900 line-clamp-1" title={preset.name}>
                    {preset.name}
                  </p>
                  <p className="text-[11px] text-gray-500 truncate mt-1" title={preset.alt}>
                    <span className="font-bold text-gray-400">ALT:</span> {preset.alt}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px]">
                  <span className="text-gray-400">Stock Preset</span>
                  <button
                    onClick={(e) => copyToClipboard(preset.url, e)}
                    className="text-[#E62E2D] hover:underline font-bold"
                  >
                    {copiedUrl === preset.url ? "Copied!" : "Copy URL"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Alt Tag Editor Modal */}
      {editingAltItem && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setEditingAltItem(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-[#E62E2D] flex items-center justify-center">
                  <Tag size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900">Edit Image Alt Tag</h3>
                  <p className="text-xs text-gray-500 truncate max-w-xs">{editingAltItem.filename}</p>
                </div>
              </div>
              <button 
                onClick={() => setEditingAltItem(null)}
                className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-900 shrink-0 border">
                <img 
                  src={editingAltItem.url} 
                  alt={editingAltItem.filename} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="text-xs space-y-1">
                <p className="font-bold text-gray-800 truncate">{editingAltItem.filename}</p>
                <p className="text-gray-500">{formatFileSize(editingAltItem.size)}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                Image Alt Tag (Alternative Text)
              </label>
              <textarea
                rows={3}
                value={altInputValue}
                onChange={(e) => setAltInputValue(e.target.value)}
                placeholder="e.g. Civil construction team installing reinforced foundations in Jubail..."
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-[#E62E2D] outline-none leading-relaxed"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Used by search engines for Google Image SEO and screen readers for accessibility.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setEditingAltItem(null)}
                className="px-4 py-2 border rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveAltTag(editingAltItem.filename, altInputValue)}
                disabled={savingAlt}
                className="flex items-center gap-1.5 px-5 py-2 bg-[#E62E2D] hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow transition disabled:opacity-50"
              >
                {savingAlt ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />}
                {savingAlt ? "Saving..." : "Save Alt Tag"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox / Preview & Alt Tag Editor Modal */}
      {previewItem && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setPreviewItem(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex items-center justify-between bg-gray-50 sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <ImageIcon size={18} className="text-[#E62E2D]" />
                <h3 className="font-bold text-sm text-gray-900 truncate max-w-md">{previewItem.name}</h3>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative w-full min-h-[260px] max-h-[50vh] bg-gray-950 flex items-center justify-center p-4">
              <img
                src={previewItem.url}
                alt={previewItem.alt || previewItem.name}
                className="max-h-[46vh] max-w-full object-contain rounded-lg"
              />
            </div>

            <div className="p-6 bg-gray-50 border-t space-y-4">
              
              {/* Alt Tag Editor Card inside Preview */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <Tag size={15} className="text-[#E62E2D]" />
                    Image Alt Tag (SEO & Accessibility)
                  </label>
                  {saveSuccessMsg && (
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 animate-pulse">
                      <CheckCircle2 size={13} /> Alt tag updated successfully!
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    defaultValue={previewItem.alt || ""}
                    id="preview-alt-input"
                    placeholder="Enter descriptive alt text for this image..."
                    className="flex-1 px-3.5 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 focus:ring-2 focus:ring-[#E62E2D] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById("preview-alt-input") as HTMLInputElement;
                      if (input) {
                        handleSaveAltTag(previewItem.name || previewItem.url, input.value);
                      }
                    }}
                    disabled={savingAlt}
                    className="flex items-center justify-center gap-1.5 px-5 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg transition shadow-sm shrink-0 disabled:opacity-50"
                  >
                    {savingAlt ? <RefreshCw className="animate-spin" size={13} /> : <Save size={13} />}
                    {savingAlt ? "Saving..." : "Save Alt Tag"}
                  </button>
                </div>
                <p className="text-[11px] text-gray-500">
                  Visible to search engines to boost Google rank for your services and site images.
                </p>
              </div>

              {/* URL & Actions Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t">
                <div className="flex-1 w-full truncate">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Asset URL</p>
                  <p className="text-xs font-mono text-gray-700 truncate bg-white px-3 py-2 rounded-lg border mt-1 select-all">
                    {previewItem.url}
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-3 sm:pt-0">
                  <a
                    href={previewItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 border rounded-xl text-xs font-semibold text-gray-700 bg-white hover:bg-gray-100 transition shadow-sm"
                  >
                    <ExternalLink size={14} /> Open Full
                  </a>

                  <button
                    onClick={() => copyToClipboard(previewItem.url)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2 bg-[#E62E2D] hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    {copiedUrl === previewItem.url ? <Check size={14} /> : <Copy size={14} />}
                    {copiedUrl === previewItem.url ? "Copied!" : "Copy URL"}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
