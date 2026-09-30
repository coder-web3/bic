"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Check, 
  Search, 
  RefreshCw, 
  Link as LinkIcon,
  Plus,
  FolderOpen,
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

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage?: (url: string, alt?: string) => void;
  onSelect?: (url: string, alt?: string) => void;
  currentImageUrl?: string;
}

// Sample stock industrial images as preset library options
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

export default function MediaLibraryModal({
  isOpen,
  onClose,
  onSelectImage,
  onSelect,
  currentImageUrl = ""
}: MediaLibraryModalProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"uploads" | "presets" | "customUrl">("uploads");
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(currentImageUrl);
  const [selectedAlt, setSelectedAlt] = useState("");
  const [customInputUrl, setCustomInputUrl] = useState("");
  const [customInputAlt, setCustomInputAlt] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [savingAlt, setSavingAlt] = useState(false);
  const [savedAltSuccess, setSavedAltSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchUploadedMedia();
      setSelectedUrl(currentImageUrl);
    }
  }, [isOpen, currentImageUrl]);

  // When selectedUrl changes, auto-find its alt tag
  useEffect(() => {
    if (!selectedUrl) {
      setSelectedAlt("");
      return;
    }
    const uploadedMatch = mediaList.find((m) => m.url === selectedUrl || m.filename === selectedUrl);
    if (uploadedMatch) {
      setSelectedAlt(uploadedMatch.alt || "");
      return;
    }
    const presetMatch = presetStockImages.find((p) => p.url === selectedUrl);
    if (presetMatch) {
      setSelectedAlt(presetMatch.alt || "");
    }
  }, [selectedUrl, mediaList]);

  const fetchUploadedMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/upload");
      if (res.ok) {
        const data = await res.json();
        setMediaList(data.files || []);
      }
    } catch (err) {
      console.error("Error fetching uploaded media:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      // Auto-generate clean alt tag from filename
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      formData.append("alt", cleanName);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData
        });
        if (res.ok) {
          const data = await res.json();
          setSelectedUrl(data.url);
          setSelectedAlt(data.alt || cleanName);
        }
      } catch (err) {
        console.error("Failed to upload file:", err);
      }
    }
    setUploading(false);
    fetchUploadedMedia();
  };

  const handleSaveSelectedAlt = async () => {
    if (!selectedUrl) return;
    setSavingAlt(true);
    try {
      const filenameMatch = mediaList.find((m) => m.url === selectedUrl)?.filename || selectedUrl;
      const res = await fetch("/api/upload", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: filenameMatch, url: selectedUrl, alt: selectedAlt }),
      });

      if (res.ok) {
        setMediaList((prev) =>
          prev.map((item) =>
            item.url === selectedUrl || item.filename === filenameMatch
              ? { ...item, alt: selectedAlt }
              : item
          )
        );
        setSavedAltSuccess(true);
        setTimeout(() => setSavedAltSuccess(false), 2000);
      }
    } catch (err) {
      console.error("Failed to save alt tag:", err);
    } finally {
      setSavingAlt(false);
    }
  };

  const handleDeleteMedia = async (filename: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${filename}"?`)) {
      try {
        const res = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
          method: "DELETE"
        });
        if (res.ok) {
          setMediaList((prev) => prev.filter((m) => m.filename !== filename));
          if (selectedUrl.includes(filename)) {
            setSelectedUrl("");
            setSelectedAlt("");
          }
        }
      } catch (err) {
        console.error("Error deleting media:", err);
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleConfirmSelection = () => {
    const callback = onSelectImage || onSelect;
    const finalUrl = activeTab === "customUrl" && customInputUrl.trim() ? customInputUrl.trim() : selectedUrl;
    const finalAlt = (activeTab === "customUrl" ? customInputAlt.trim() : selectedAlt.trim()) || undefined;

    if (finalUrl && typeof callback === "function") {
      callback(finalUrl, finalAlt);
    }
    onClose();
  };

  if (!isOpen || !mounted) return null;

  const filteredUploads = mediaList.filter((m) =>
    m.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.alt && m.alt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredPresets = presetStockImages.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.alt && p.alt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="relative z-10 bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/90 text-white flex items-center justify-center shadow">
              <FolderOpen size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Media Library & Asset Manager</h3>
              <p className="text-xs text-slate-300">
                Pick or upload images, preview or edit image Alt Tags for SEO & accessibility.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between px-6 pt-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("uploads")}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-lg transition border-b-2 ${
                activeTab === "uploads"
                  ? "border-red-600 text-red-600 bg-white shadow-sm"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <Upload size={15} />
              Device Uploads ({mediaList.length})
            </button>

            <button
              onClick={() => setActiveTab("presets")}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-lg transition border-b-2 ${
                activeTab === "presets"
                  ? "border-red-600 text-red-600 bg-white shadow-sm"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <ImageIcon size={15} />
              Stock Industrial Gallery ({presetStockImages.length})
            </button>

            <button
              onClick={() => setActiveTab("customUrl")}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-lg transition border-b-2 ${
                activeTab === "customUrl"
                  ? "border-red-600 text-red-600 bg-white shadow-sm"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <LinkIcon size={15} />
              Paste External URL
            </button>
          </div>

          {activeTab === "uploads" && (
            <button
              onClick={fetchUploadedMedia}
              className="p-1.5 text-slate-500 hover:text-red-600 transition"
              title="Refresh Gallery"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          )}
        </div>

        {/* Modal Main Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {/* TAB 1: DEVICE UPLOADS */}
          {activeTab === "uploads" && (
            <div className="space-y-6">
              {/* Drag and Drop Device Upload Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  dragActive
                    ? "border-red-600 bg-red-50/70"
                    : "border-slate-300 bg-slate-50/50 hover:bg-slate-100/60 hover:border-slate-400"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                />

                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center mb-2 shadow-sm">
                  {uploading ? <RefreshCw className="animate-spin" size={20} /> : <Upload size={20} />}
                </div>

                <p className="font-bold text-slate-800 text-sm">
                  {uploading ? "Uploading file from device..." : "Click or Drag & Drop image files here"}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supports JPEG, PNG, WEBP, GIF, SVG (Max file size 10MB)
                </p>
              </div>

              {/* Search Uploaded Files */}
              <div className="flex items-center justify-between gap-4">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  Uploaded Media Gallery
                </h4>

                <div className="relative w-72">
                  <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or alt tag..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
              </div>

              {/* Uploaded Files Gallery Grid */}
              {loading ? (
                <div className="py-12 text-center text-slate-500 flex items-center justify-center gap-2">
                  <RefreshCw className="animate-spin text-red-600" size={18} />
                  <span>Loading uploaded media...</span>
                </div>
              ) : filteredUploads.length === 0 ? (
                <div className="py-12 border rounded-xl text-center text-slate-400 bg-slate-50">
                  <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="font-semibold text-sm">No uploaded images found</p>
                  <p className="text-xs text-slate-400 mt-1">Upload an image from your device above.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {filteredUploads.map((media) => {
                    const isSelected = selectedUrl === media.url;
                    return (
                      <div
                        key={media.filename}
                        onClick={() => {
                          setSelectedUrl(media.url);
                          setSelectedAlt(media.alt || "");
                        }}
                        className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all bg-slate-100 flex flex-col justify-between ${
                          isSelected
                            ? "border-red-600 ring-2 ring-red-500 shadow-md"
                            : "border-slate-200 hover:border-red-400 hover:shadow"
                        }`}
                      >
                        <div className="h-32 w-full overflow-hidden bg-slate-900 relative">
                          <img
                            src={media.url}
                            alt={media.alt || media.filename}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />

                          {isSelected && (
                            <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow z-10">
                              <Check size={14} />
                            </div>
                          )}

                          <button
                            onClick={(e) => handleDeleteMedia(media.filename, e)}
                            className="absolute top-2 right-2 p-1.5 bg-slate-900/80 hover:bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition shadow z-10"
                            title="Delete file"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="p-2.5 bg-white text-left space-y-1">
                          <p className="text-xs font-semibold text-slate-800 truncate" title={media.filename}>
                            {media.filename}
                          </p>

                          {/* Alt Tag Row */}
                          <div className="flex items-center gap-1">
                            {media.alt ? (
                              <span 
                                className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-medium truncate block max-w-full"
                                title={media.alt}
                              >
                                ALT: {media.alt}
                              </span>
                            ) : (
                              <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded font-medium">
                                No Alt Tag
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PRESET STOCK INDUSTRIAL GALLERY */}
          {activeTab === "presets" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs text-slate-600 font-medium">
                  Select from our high-resolution preset industrial imagery with pre-indexed SEO Alt tags:
                </p>

                <div className="relative w-64">
                  <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search presets..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {filteredPresets.map((stock, idx) => {
                  const isSelected = selectedUrl === stock.url;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedUrl(stock.url);
                        setSelectedAlt(stock.alt || "");
                      }}
                      className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all bg-slate-100 flex flex-col justify-between ${
                        isSelected
                          ? "border-red-600 ring-2 ring-red-500 shadow-md"
                          : "border-slate-200 hover:border-red-400 hover:shadow"
                      }`}
                    >
                      <div className="h-32 w-full overflow-hidden bg-slate-900 relative">
                        <img
                          src={stock.url}
                          alt={stock.alt || stock.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        {isSelected && (
                          <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow z-10">
                            <Check size={14} />
                          </div>
                        )}
                        <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/70 text-white text-[9px] font-bold uppercase tracking-wider">
                          {stock.category}
                        </span>
                      </div>

                      <div className="p-2.5 bg-white text-left space-y-1">
                        <p className="text-xs font-bold text-slate-800 line-clamp-1" title={stock.name}>
                          {stock.name}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate" title={stock.alt}>
                          ALT: {stock.alt}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOM PASTE URL */}
          {activeTab === "customUrl" && (
            <div className="space-y-4 max-w-lg mx-auto py-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Image URL Address
                </label>
                <input
                  type="text"
                  value={customInputUrl}
                  onChange={(e) => {
                    setCustomInputUrl(e.target.value);
                    setSelectedUrl(e.target.value);
                  }}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Image Alt Tag (Optional)
                </label>
                <input
                  type="text"
                  value={customInputAlt}
                  onChange={(e) => {
                    setCustomInputAlt(e.target.value);
                    setSelectedAlt(e.target.value);
                  }}
                  placeholder="e.g. Turnkey civil engineering works..."
                  className="w-full px-4 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-red-500 outline-none text-slate-900"
                />
              </div>

              {customInputUrl.trim() && (
                <div className="border rounded-xl p-3 bg-slate-50 space-y-2">
                  <p className="text-xs font-bold text-slate-600">Image Preview</p>
                  <img
                    src={customInputUrl}
                    alt={customInputAlt || "Custom URL Preview"}
                    className="max-h-48 rounded-lg mx-auto object-cover border"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Selected Asset Alt Tag Bar & Modal Footer Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col gap-3 shrink-0">
          
          {/* Active Image Alt Tag Editor Bar */}
          {selectedUrl && (
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Tag size={15} className="text-red-600 shrink-0" />
                <label className="text-xs font-bold text-slate-800 shrink-0">
                  Image Alt Tag:
                </label>
                <input
                  type="text"
                  value={selectedAlt}
                  onChange={(e) => setSelectedAlt(e.target.value)}
                  placeholder="Enter descriptive alt text for this image..."
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleSaveSelectedAlt}
                  disabled={savingAlt}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-black text-white text-xs font-semibold rounded-lg transition disabled:opacity-50"
                  title="Save Alt Tag to Media Library"
                >
                  {savingAlt ? <RefreshCw className="animate-spin" size={13} /> : savedAltSuccess ? <CheckCircle2 className="text-emerald-400" size={13} /> : <Save size={13} />}
                  {savedAltSuccess ? "Saved!" : "Save Alt Tag"}
                </button>
              </div>
            </div>
          )}

          {/* Action Footer Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0 max-w-md">
              <span className="text-xs font-bold text-slate-500 uppercase shrink-0">Selected:</span>
              <span className="text-xs text-slate-700 truncate font-mono bg-white px-2 py-1 rounded border">
                {selectedUrl || "None selected"}
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmSelection}
                disabled={!selectedUrl && !(activeTab === "customUrl" && customInputUrl.trim())}
                className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition shadow disabled:opacity-50 cursor-pointer"
              >
                <Check size={15} />
                Use Selected Image
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
