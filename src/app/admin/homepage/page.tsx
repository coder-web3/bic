"use client";

import { useState, useEffect } from "react";
import { 
  Save, 
  RefreshCw, 
  ExternalLink, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Sliders, 
  Info, 
  Award, 
  Wrench, 
  ShieldCheck, 
  Users,
  FolderOpen,
  Image as ImageIcon,
  Search,
  Copy,
  Check,
  Code,
  Link as LinkIcon
} from "lucide-react";
import MediaLibraryModal from "@/components/MediaLibraryModal";

export default function AdminHomepageManager() {
  const [activeTab, setActiveTab] = useState("hero");
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Media Library Modal State
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<{
    section: string;
    field: string;
    arrayIndex?: number;
    currentValue: string;
  } | null>(null);

  // Fetch initial content
  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/homepage?_t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Pragma": "no-cache",
          "Cache-Control": "no-cache"
        }
      });
      if (res.ok) {
        const data = await res.json();
        setContent(data);
      }
    } catch (err) {
      console.error("Failed to fetch homepage content:", err);
      setMessage({ text: "Failed to load homepage content.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/homepage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      if (res.ok) {
        setMessage({ text: "Homepage content updated successfully!", type: "success" });
        setTimeout(() => setMessage(null), 4000);
      } else {
        setMessage({ text: "Error saving homepage content.", type: "error" });
      }
    } catch (err) {
      console.error("Error saving content:", err);
      setMessage({ text: "Failed to connect to API.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  // Media picker helpers
  const openMediaPicker = (
    section: string,
    field: string,
    currentValue: string,
    arrayIndex?: number
  ) => {
    setMediaTarget({ section, field, currentValue, arrayIndex });
    setIsMediaModalOpen(true);
  };

  const handleMediaSelect = (newUrl: string) => {
    if (!mediaTarget || !content) return;
    const updated = { ...content };

    if (mediaTarget.section === "about") {
      updated.about = { ...(updated.about || {}), [mediaTarget.field]: newUrl };
    } else if (mediaTarget.section === "whyChooseUs") {
      if (mediaTarget.arrayIndex !== undefined) {
        const features = [...(updated.whyChooseUs?.features || [])];
        if (features[mediaTarget.arrayIndex]) {
          features[mediaTarget.arrayIndex] = { ...features[mediaTarget.arrayIndex], [mediaTarget.field]: newUrl };
          updated.whyChooseUs = { ...updated.whyChooseUs, features };
        }
      } else {
        updated.whyChooseUs = { ...(updated.whyChooseUs || {}), [mediaTarget.field]: newUrl };
      }
    } else if (mediaTarget.section === "heroSlides" && mediaTarget.arrayIndex !== undefined) {
      const slides = [...(updated.hero?.slides || [])];
      if (slides[mediaTarget.arrayIndex]) {
        slides[mediaTarget.arrayIndex] = { ...slides[mediaTarget.arrayIndex], [mediaTarget.field]: newUrl };
        updated.hero = { ...updated.hero, slides };
      }
    } else if (mediaTarget.section === "services" && mediaTarget.arrayIndex !== undefined) {
      const items = [...(updated.services?.items || [])];
      if (items[mediaTarget.arrayIndex]) {
        items[mediaTarget.arrayIndex] = { ...items[mediaTarget.arrayIndex], [mediaTarget.field]: newUrl };
        updated.services = { ...updated.services, items };
      }
    } else if (mediaTarget.section === "coreValues" && mediaTarget.arrayIndex !== undefined) {
      const items = [...(updated.coreValues?.items || [])];
      if (items[mediaTarget.arrayIndex]) {
        items[mediaTarget.arrayIndex] = { ...items[mediaTarget.arrayIndex], [mediaTarget.field]: newUrl };
        updated.coreValues = { ...updated.coreValues, items };
      }
    } else if (mediaTarget.section === "clients" && mediaTarget.arrayIndex !== undefined) {
      const clientList = [...(updated.clients?.clients || [])];
      if (clientList[mediaTarget.arrayIndex]) {
        clientList[mediaTarget.arrayIndex] = { ...clientList[mediaTarget.arrayIndex], [mediaTarget.field]: newUrl };
        updated.clients = { ...updated.clients, clients: clientList };
      }
    } else if (mediaTarget.section === "seo") {
      updated.seo = { ...(updated.seo || {}), [mediaTarget.field]: newUrl };
    }

    setContent(updated);
  };

  if (loading || !content) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-gray-500 font-medium">
          <RefreshCw className="animate-spin text-[#E62E2D]" size={24} />
          Loading Homepage Editor...
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "hero", label: "Hero Slider", icon: Sliders },
    { id: "about", label: "Who We Are", icon: Info },
    { id: "coreValues", label: "Core Values", icon: Award },
    { id: "services", label: "Our Expertise", icon: Wrench },
    { id: "whyChooseUs", label: "Why Choose Us", icon: ShieldCheck },
    { id: "clients", label: "Partners & Stats", icon: Users },
    { id: "seo", label: "SEO & Metadata", icon: Search },
  ];

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-16">
      
      {/* Top Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Homepage Content Manager
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Update text, headings, badges, and upload images from device or media library for every section.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a 
            href="/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors"
          >
            <ExternalLink size={16} />
            Preview Live Site
          </a>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#E62E2D] hover:bg-red-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 cursor-pointer"
          >
            {saving ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
            {saving ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </div>

      {/* Message Toast */}
      {message && (
        <div className={`p-4 rounded-xl flex items-center justify-between border ${
          message.type === "success" 
            ? "bg-green-50 border-green-200 text-green-800" 
            : "bg-red-50 border-red-200 text-red-800"
        }`}>
          <div className="flex items-center gap-3 font-medium text-sm">
            <CheckCircle2 size={18} />
            {message.text}
          </div>
          <button onClick={() => setMessage(null)} className="text-xs underline font-bold">Dismiss</button>
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-[#111] text-white shadow-md"
                  : "bg-white text-gray-600 hover:text-gray-900 border border-gray-100 hover:bg-gray-50"
              }`}
            >
              <Icon size={18} className={isActive ? "text-[#E62E2D]" : "text-gray-400"} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: HERO SLIDER
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "hero" && (
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col gap-8">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">
            Hero Section General Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Watermark Text
              </label>
              <input
                type="text"
                value={content.hero?.watermark || ""}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, watermark: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E62E2D] focus:ring-1 focus:ring-[#E62E2D] outline-none text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Scroll Down Indicator Text
              </label>
              <input
                type="text"
                value={content.hero?.scrollDownText || ""}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, scrollDownText: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E62E2D] focus:ring-1 focus:ring-[#E62E2D] outline-none text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Bottom Tagline
              </label>
              <input
                type="text"
                value={content.hero?.bottomTagline || ""}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, bottomTagline: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E62E2D] focus:ring-1 focus:ring-[#E62E2D] outline-none text-sm font-medium"
              />
            </div>
          </div>

          {/* Hero Slides List */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <h3 className="text-md font-bold text-gray-900">Hero Slides ({content.hero?.slides?.length || 0})</h3>
              <p className="text-xs text-gray-500 mt-0.5">Manage slides with custom backgrounds, headings, and descriptions.</p>
            </div>
            <button
              onClick={() => {
                const newSlides = [...(content.hero?.slides || []), {
                  image: "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=2070&auto=format&fit=crop",
                  subheading: "New Industrial Subheading",
                  heading1: "New Heading",
                  headingHighlight: "Highlight",
                  heading2: "Suffix",
                  desc: "Slide description goes here."
                }];
                setContent({ ...content, hero: { ...content.hero, slides: newSlides } });
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gray-900 hover:bg-black text-white text-xs font-bold cursor-pointer transition shadow-sm"
            >
              <Plus size={14} /> Add Slide
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {content.hero?.slides?.map((slide: any, idx: number) => (
              <div key={idx} className="p-6 rounded-2xl border border-gray-200 bg-gray-50/70 flex flex-col gap-4 relative shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-red-100 text-[#E62E2D] flex items-center justify-center font-extrabold text-xs">
                      {idx + 1}
                    </span>
                    <span className="font-extrabold text-sm text-gray-900">Slide #{idx + 1}</span>
                  </div>
                  <button
                    onClick={() => {
                      const newSlides = content.hero.slides.filter((_: any, i: number) => i !== idx);
                      setContent({ ...content, hero: { ...content.hero, slides: newSlides } });
                    }}
                    className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition"
                    title="Delete slide"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Subheading Badge</label>
                    <input
                      type="text"
                      value={slide.subheading || ""}
                      onChange={(e) => {
                        const newSlides = [...content.hero.slides];
                        newSlides[idx].subheading = e.target.value;
                        setContent({ ...content, hero: { ...content.hero, slides: newSlides } });
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm"
                    />
                  </div>

                  {/* HERO SLIDE BACKGROUND IMAGE WITH MEDIA LIBRARY / DEVICE UPLOAD */}
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Background Image</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={slide.image || ""}
                        onChange={(e) => {
                          const newSlides = [...content.hero.slides];
                          newSlides[idx].image = e.target.value;
                          setContent({ ...content, hero: { ...content.hero, slides: newSlides } });
                        }}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm"
                        placeholder="Image URL or uploaded file..."
                      />
                      <button
                        type="button"
                        onClick={() => openMediaPicker("heroSlides", "image", slide.image || "", idx)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition text-xs font-semibold shrink-0 shadow-sm cursor-pointer"
                      >
                        <FolderOpen className="w-3.5 h-3.5 text-red-400" />
                        Device Upload / Library
                      </button>
                    </div>

                    {slide.image && (
                      <div className="mt-2 relative w-full h-24 rounded-lg overflow-hidden border bg-gray-900">
                        <img 
                          src={slide.image} 
                          alt={`Slide ${idx + 1} Preview`} 
                          className="w-full h-full object-cover"
                          onError={(e: any) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=2070&auto=format&fit=crop";
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Heading Line 1</label>
                    <input
                      type="text"
                      value={slide.heading1 || ""}
                      onChange={(e) => {
                        const newSlides = [...content.hero.slides];
                        newSlides[idx].heading1 = e.target.value;
                        setContent({ ...content, hero: { ...content.hero, slides: newSlides } });
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#E62E2D] mb-1">Heading Highlight (Red)</label>
                    <input
                      type="text"
                      value={slide.headingHighlight || ""}
                      onChange={(e) => {
                        const newSlides = [...content.hero.slides];
                        newSlides[idx].headingHighlight = e.target.value;
                        setContent({ ...content, hero: { ...content.hero, slides: newSlides } });
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-red-200 bg-white text-sm text-[#E62E2D] font-bold"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Heading Line 2</label>
                    <input
                      type="text"
                      value={slide.heading2 || ""}
                      onChange={(e) => {
                        const newSlides = [...content.hero.slides];
                        newSlides[idx].heading2 = e.target.value;
                        setContent({ ...content, hero: { ...content.hero, slides: newSlides } });
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Slide Description</label>
                    <textarea
                      rows={2}
                      value={slide.desc || ""}
                      onChange={(e) => {
                        const newSlides = [...content.hero.slides];
                        newSlides[idx].desc = e.target.value;
                        setContent({ ...content, hero: { ...content.hero, slides: newSlides } });
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: WHO WE ARE (ABOUT)
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "about" && (
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col gap-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">
            Who We Are (About Section) Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Badge Subtitle</label>
              <input
                type="text"
                value={content.about?.badge || ""}
                onChange={(e) => setContent({ ...content, about: { ...content.about, badge: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Heading Line 1</label>
              <input
                type="text"
                value={content.about?.headingLine1 || ""}
                onChange={(e) => setContent({ ...content, about: { ...content.about, headingLine1: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#E62E2D] mb-2">Heading Highlight (Red)</label>
              <input
                type="text"
                value={content.about?.headingHighlight || ""}
                onChange={(e) => setContent({ ...content, about: { ...content.about, headingHighlight: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl border border-red-200 text-sm font-bold text-[#E62E2D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Heading Line 2</label>
              <input
                type="text"
                value={content.about?.headingLine2 || ""}
                onChange={(e) => setContent({ ...content, about: { ...content.about, headingLine2: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">CTA Button Text</label>
              <input
                type="text"
                value={content.about?.ctaButtonText || ""}
                onChange={(e) => setContent({ ...content, about: { ...content.about, ctaButtonText: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">CTA Button Route</label>
              <input
                type="text"
                value={content.about?.ctaButtonLink || ""}
                onChange={(e) => setContent({ ...content, about: { ...content.about, ctaButtonLink: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium"
              />
            </div>
          </div>

          {/* MAIN ABOUT IMAGE WITH DEVICE UPLOAD / MEDIA LIBRARY */}
          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 mb-2">
              Who We Are Main Image
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={content.about?.image || ""}
                onChange={(e) => setContent({ ...content, about: { ...content.about, image: e.target.value } })}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm"
                placeholder="Image URL or uploaded file..."
              />
              <button
                type="button"
                onClick={() => openMediaPicker("about", "image", content.about?.image || "")}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition text-xs font-bold shrink-0 shadow-sm cursor-pointer"
              >
                <FolderOpen className="w-4 h-4 text-red-400" />
                Device Upload / Media Library
              </button>
            </div>

            {content.about?.image && (
              <div className="mt-3 relative w-full max-w-md h-40 rounded-xl overflow-hidden border bg-gray-900 shadow-sm">
                <img 
                  src={content.about.image} 
                  alt="About Section Preview" 
                  className="w-full h-full object-cover"
                  onError={(e: any) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=2070&auto=format&fit=crop";
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Lead Bold Paragraph</label>
            <textarea
              rows={2}
              value={content.about?.leadParagraph || ""}
              onChange={(e) => setContent({ ...content, about: { ...content.about, leadParagraph: e.target.value } })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Secondary Paragraph</label>
            <textarea
              rows={3}
              value={content.about?.secondaryParagraph || ""}
              onChange={(e) => setContent({ ...content, about: { ...content.about, secondaryParagraph: e.target.value } })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
            />
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 3: OUR CORE VALUES
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "coreValues" && (
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Our Core Values Section Settings
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage the Core Values showcase carousel, cards, industrial cut images, icons, and CTA on the homepage.
              </p>
            </div>
            <div className="px-3 py-1 bg-red-50 text-[#E62E2D] font-bold text-xs rounded-full border border-red-100">
              {content.coreValues?.items?.length || 0} Principles Configured
            </div>
          </div>

          {/* Section Header Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 bg-gray-50/60 p-5 rounded-2xl border border-gray-100">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Badge Subtitle</label>
              <input
                type="text"
                value={content.coreValues?.badge || ""}
                onChange={(e) => setContent({ ...content, coreValues: { ...content.coreValues, badge: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium"
                placeholder="OUR CORE VALUES"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Heading Line 1</label>
              <input
                type="text"
                value={content.coreValues?.headingLine1 || ""}
                onChange={(e) => setContent({ ...content, coreValues: { ...content.coreValues, headingLine1: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium"
                placeholder="Core Principles"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#E62E2D] mb-2">Heading Highlight (Red)</label>
              <input
                type="text"
                value={content.coreValues?.headingHighlight || ""}
                onChange={(e) => setContent({ ...content, coreValues: { ...content.coreValues, headingHighlight: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl border border-red-200 bg-white text-sm font-bold text-[#E62E2D]"
                placeholder="That Define"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Heading Line 2</label>
              <input
                type="text"
                value={content.coreValues?.headingLine2 || ""}
                onChange={(e) => setContent({ ...content, coreValues: { ...content.coreValues, headingLine2: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium"
                placeholder="Our Culture"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Description Paragraph</label>
              <textarea
                rows={3}
                value={content.coreValues?.desc || ""}
                onChange={(e) => setContent({ ...content, coreValues: { ...content.coreValues, desc: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm leading-relaxed"
                placeholder="Guided by strong values..."
              />
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">CTA Button Text</label>
                <input
                  type="text"
                  value={content.coreValues?.ctaText || ""}
                  onChange={(e) => setContent({ ...content, coreValues: { ...content.coreValues, ctaText: e.target.value } })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold"
                  placeholder="DISCOVER OUR PROCESS"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">CTA Button Link</label>
                <input
                  type="text"
                  value={content.coreValues?.ctaLink || ""}
                  onChange={(e) => setContent({ ...content, coreValues: { ...content.coreValues, ctaLink: e.target.value } })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs"
                  placeholder="/about-us"
                />
              </div>
            </div>
          </div>

          {/* Values Cards */}
          <div className="flex items-center justify-between pt-5 border-t border-gray-100">
            <div>
              <h3 className="text-md font-bold text-gray-900">Core Values Cards ({content.coreValues?.items?.length || 0})</h3>
              <p className="text-xs text-gray-500">Each card appears in the interactive carousel with slanted cut photo, number, and floating icon.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                const count = (content.coreValues?.items?.length || 0) + 1;
                const num = count < 10 ? `0${count}` : `${count}`;
                const newItems = [...(content.coreValues?.items || []), {
                  num,
                  title: "New Core Value",
                  desc: "Description of the core principle and how it drives project outcomes.",
                  image: "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=800&auto=format&fit=crop",
                  imageAlt: "Core Value representation",
                  icon: "award"
                }];
                setContent({ ...content, coreValues: { ...content.coreValues, items: newItems } });
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold cursor-pointer transition shadow-sm hover:shadow"
            >
              <Plus size={15} /> Add Value Card
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {content.coreValues?.items?.map((item: any, idx: number) => (
              <div key={idx} className="p-5 rounded-2xl border border-gray-200 bg-gray-50/70 flex flex-col justify-between gap-4 shadow-sm hover:border-gray-300 transition">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs px-2 py-0.5 rounded bg-[#E62E2D] text-white">#{item.num || idx + 1}</span>
                    <span className="font-bold text-xs text-gray-800 truncate max-w-[130px]">{item.title?.replace("\n", " ") || "Value Card"}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newItems = content.coreValues.items.filter((_: any, i: number) => i !== idx);
                      setContent({ ...content, coreValues: { ...content.coreValues, items: newItems } });
                    }}
                    className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    title="Delete Card"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={item.num || ""}
                      onChange={(e) => {
                        const newItems = [...content.coreValues.items];
                        newItems[idx].num = e.target.value;
                        setContent({ ...content, coreValues: { ...content.coreValues, items: newItems } });
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs font-bold"
                      placeholder="01"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Card Icon</label>
                    <select
                      value={item.icon || "users"}
                      onChange={(e) => {
                        const newItems = [...content.coreValues.items];
                        newItems[idx].icon = e.target.value;
                        setContent({ ...content, coreValues: { ...content.coreValues, items: newItems } });
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs font-bold text-gray-800"
                    >
                      <option value="users">Users / People</option>
                      <option value="shield">Shield / Trust</option>
                      <option value="chart">BarChart / Data</option>
                      <option value="lightbulb">Lightbulb / Innovation</option>
                      <option value="hardhat">HardHat / Safety</option>
                      <option value="award">Award / Quality</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={item.title || ""}
                    onChange={(e) => {
                      const newItems = [...content.coreValues.items];
                      newItems[idx].title = e.target.value;
                      setContent({ ...content, coreValues: { ...content.coreValues, items: newItems } });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs font-bold"
                    placeholder="Accountability & Professionalism"
                  />
                </div>

                {/* Card Image Picker */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Card Header Image</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.image || ""}
                      onChange={(e) => {
                        const newItems = [...content.coreValues.items];
                        newItems[idx].image = e.target.value;
                        setContent({ ...content, coreValues: { ...content.coreValues, items: newItems } });
                      }}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs"
                      placeholder="Image URL or upload..."
                    />
                    <button
                      type="button"
                      onClick={() => openMediaPicker("coreValues", "image", item.image || "", idx)}
                      className="flex items-center gap-1 px-2.5 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition text-[11px] font-semibold shrink-0 cursor-pointer shadow-sm"
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-red-400" />
                      Upload
                    </button>
                  </div>

                  {item.image && (
                    <div className="mt-2 relative w-full h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-900">
                      <img 
                        src={item.image} 
                        alt={item.imageAlt || item.title || "Card Preview"} 
                        className="w-full h-full object-cover"
                        onError={(e: any) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=800&auto=format&fit=crop";
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Image Alt Tag (Optional)</label>
                  <input
                    type="text"
                    value={item.imageAlt || ""}
                    onChange={(e) => {
                      const newItems = [...content.coreValues.items];
                      newItems[idx].imageAlt = e.target.value;
                      setContent({ ...content, coreValues: { ...content.coreValues, items: newItems } });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs"
                    placeholder="e.g. Accountability and execution on site"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={item.desc || ""}
                    onChange={(e) => {
                      const newItems = [...content.coreValues.items];
                      newItems[idx].desc = e.target.value;
                      setContent({ ...content, coreValues: { ...content.coreValues, items: newItems } });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs leading-relaxed"
                    placeholder="Value description text..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 4: OUR EXPERTISE (SERVICES)
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "services" && (
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col gap-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">
            Our Expertise Section Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Badge Subtitle</label>
              <input
                type="text"
                value={content.services?.badge || ""}
                onChange={(e) => setContent({ ...content, services: { ...content.services, badge: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Heading Line 1</label>
              <input
                type="text"
                value={content.services?.headingLine1 || ""}
                onChange={(e) => setContent({ ...content, services: { ...content.services, headingLine1: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#E62E2D] mb-2">Heading Highlight (Red)</label>
              <input
                type="text"
                value={content.services?.headingHighlight || ""}
                onChange={(e) => setContent({ ...content, services: { ...content.services, headingHighlight: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl border border-red-200 text-sm font-bold text-[#E62E2D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Section Description</label>
            <textarea
              rows={2}
              value={content.services?.desc || ""}
              onChange={(e) => setContent({ ...content, services: { ...content.services, desc: e.target.value } })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
            />
          </div>

          {/* Service Cards List */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <h3 className="text-md font-bold text-gray-900">Expertise Cards ({content.services?.items?.length || 0})</h3>
            <button
              onClick={() => {
                const count = (content.services?.items?.length || 0) + 1;
                const num = count < 10 ? `0${count}` : `${count}`;
                const newItems = [...(content.services?.items || []), {
                  num,
                  title: "New Expertise Service",
                  slug: "/services",
                  desc: "Service description goes here.",
                  img: "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=800&auto=format&fit=crop"
                }];
                setContent({ ...content, services: { ...content.services, items: newItems } });
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gray-900 hover:bg-black text-white text-xs font-bold cursor-pointer transition shadow-sm"
            >
              <Plus size={14} /> Add Expertise Card
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {content.services?.items?.map((srv: any, idx: number) => (
              <div key={idx} className="p-5 rounded-2xl border border-gray-200 bg-gray-50/70 flex flex-col gap-3 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="font-extrabold text-sm text-[#E62E2D]">Card #{srv.num || idx + 1}</span>
                  <button
                    onClick={() => {
                      const newItems = content.services.items.filter((_: any, i: number) => i !== idx);
                      setContent({ ...content, services: { ...content.services, items: newItems } });
                    }}
                    className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={srv.title || ""}
                      onChange={(e) => {
                        const newItems = [...content.services.items];
                        newItems[idx].title = e.target.value;
                        setContent({ ...content, services: { ...content.services, items: newItems } });
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Target Route (Slug)</label>
                    <input
                      type="text"
                      value={srv.slug || ""}
                      onChange={(e) => {
                        const newItems = [...content.services.items];
                        newItems[idx].slug = e.target.value;
                        setContent({ ...content, services: { ...content.services, items: newItems } });
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm"
                    />
                  </div>
                </div>

                {/* CARD BACKGROUND IMAGE WITH MEDIA LIBRARY / DEVICE UPLOAD */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Background Image</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={srv.img || ""}
                      onChange={(e) => {
                        const newItems = [...content.services.items];
                        newItems[idx].img = e.target.value;
                        setContent({ ...content, services: { ...content.services, items: newItems } });
                      }}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs"
                      placeholder="Image URL or uploaded file..."
                    />
                    <button
                      type="button"
                      onClick={() => openMediaPicker("services", "img", srv.img || "", idx)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition text-xs font-semibold shrink-0 shadow-sm cursor-pointer"
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-red-400" />
                      Upload / Library
                    </button>
                  </div>

                  {srv.img && (
                    <div className="mt-2 relative w-full h-24 rounded-lg overflow-hidden border bg-gray-900">
                      <img 
                        src={srv.img} 
                        alt={srv.title || "Card Preview"} 
                        className="w-full h-full object-cover"
                        onError={(e: any) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=800&auto=format&fit=crop";
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={srv.desc || ""}
                    onChange={(e) => {
                      const newItems = [...content.services.items];
                      newItems[idx].desc = e.target.value;
                      setContent({ ...content, services: { ...content.services, items: newItems } });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 5: WHY CHOOSE US
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "whyChooseUs" && (
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Why Choose Us Section Settings
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage the Why Choose Us panoramic showcase, feature cards with red ribbon folds, and heroic construction site image.
              </p>
            </div>
            <div className="px-3 py-1 bg-red-50 text-[#E62E2D] font-bold text-xs rounded-full border border-red-100">
              {content.whyChooseUs?.features?.length || 0} Benefits Configured
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Badge Subtitle</label>
              <input
                type="text"
                value={content.whyChooseUs?.badge || ""}
                onChange={(e) => setContent({ ...content, whyChooseUs: { ...content.whyChooseUs, badge: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium"
                placeholder="WHY CHOOSE US"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Heading Line 1</label>
              <input
                type="text"
                value={content.whyChooseUs?.headingLine1 || ""}
                onChange={(e) => setContent({ ...content, whyChooseUs: { ...content.whyChooseUs, headingLine1: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium"
                placeholder="We Provide The"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#E62E2D] mb-2">Heading Highlight (Red)</label>
              <input
                type="text"
                value={content.whyChooseUs?.headingHighlight || ""}
                onChange={(e) => setContent({ ...content, whyChooseUs: { ...content.whyChooseUs, headingHighlight: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl border border-red-200 text-sm font-bold text-[#E62E2D]"
                placeholder="Guaranteed Quality"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Section Description</label>
            <textarea
              rows={2}
              value={content.whyChooseUs?.desc || ""}
              onChange={(e) => setContent({ ...content, whyChooseUs: { ...content.whyChooseUs, desc: e.target.value } })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm leading-relaxed"
              placeholder="Trusted by industry leaders..."
            />
          </div>

          {/* MAIN WHY CHOOSE US IMAGE WITH MEDIA LIBRARY / DEVICE UPLOAD */}
          <div className="p-5 rounded-2xl bg-gray-50/80 border border-gray-200">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 mb-2">
              Right Heroic Construction Photo
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={content.whyChooseUs?.image || ""}
                onChange={(e) => setContent({ ...content, whyChooseUs: { ...content.whyChooseUs, image: e.target.value } })}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm"
                placeholder="Image URL or uploaded file..."
              />
              <button
                type="button"
                onClick={() => openMediaPicker("whyChooseUs", "image", content.whyChooseUs?.image || "")}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition text-xs font-bold shrink-0 shadow-sm cursor-pointer"
              >
                <FolderOpen className="w-4 h-4 text-red-400" />
                Upload / Media Library
              </button>
            </div>

            {content.whyChooseUs?.image && (
              <div className="mt-3 relative w-full max-w-md h-44 rounded-xl overflow-hidden border bg-gray-900 shadow-sm">
                <img 
                  src={content.whyChooseUs.image} 
                  alt="Why Choose Us Preview" 
                  className="w-full h-full object-cover"
                  onError={(e: any) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1504307651254-35680f356f12?q=80&w=1600&auto=format&fit=crop";
                  }}
                />
              </div>
            )}
          </div>

          {/* Features Grid */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <h3 className="text-md font-bold text-gray-900">Why Choose Us Cards ({content.whyChooseUs?.features?.length || 0})</h3>
              <p className="text-xs text-gray-500">Each card features a header photo with red ribbon accent and floating icon.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                const newFeatures = [...(content.whyChooseUs?.features || []), {
                  title: "New Benefit\nTitle",
                  desc: "Description of this service benefit.",
                  image: "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=800&auto=format&fit=crop",
                  imageAlt: "Feature representation",
                  icon: "shield"
                }];
                setContent({ ...content, whyChooseUs: { ...content.whyChooseUs, features: newFeatures } });
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold cursor-pointer transition shadow-sm"
            >
              <Plus size={14} /> Add Card
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {content.whyChooseUs?.features?.map((feat: any, idx: number) => (
              <div key={idx} className="p-5 rounded-2xl border border-gray-200 bg-gray-50/70 flex flex-col justify-between gap-3 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="font-bold text-xs text-[#E62E2D]">Card #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newFeatures = content.whyChooseUs.features.filter((_: any, i: number) => i !== idx);
                      setContent({ ...content, whyChooseUs: { ...content.whyChooseUs, features: newFeatures } });
                    }}
                    className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    title="Delete Card"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Icon</label>
                    <select
                      value={feat.icon || "users"}
                      onChange={(e) => {
                        const newFeatures = [...content.whyChooseUs.features];
                        newFeatures[idx].icon = e.target.value;
                        setContent({ ...content, whyChooseUs: { ...content.whyChooseUs, features: newFeatures } });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-bold text-gray-800"
                    >
                      <option value="users">Users / Team</option>
                      <option value="shield">Shield / Trust</option>
                      <option value="hardhat">HardHat / Safety</option>
                      <option value="award">Award / Quality</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Alt Tag (Opt)</label>
                    <input
                      type="text"
                      value={feat.imageAlt || ""}
                      onChange={(e) => {
                        const newFeatures = [...content.whyChooseUs.features];
                        newFeatures[idx].imageAlt = e.target.value;
                        setContent({ ...content, whyChooseUs: { ...content.whyChooseUs, features: newFeatures } });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs"
                      placeholder="Alt text"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={feat.title || ""}
                    onChange={(e) => {
                      const newFeatures = [...content.whyChooseUs.features];
                      newFeatures[idx].title = e.target.value;
                      setContent({ ...content, whyChooseUs: { ...content.whyChooseUs, features: newFeatures } });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-bold"
                    placeholder="Feature Title"
                  />
                </div>

                {/* Card Image */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Card Header Image</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={feat.image || ""}
                      onChange={(e) => {
                        const newFeatures = [...content.whyChooseUs.features];
                        newFeatures[idx].image = e.target.value;
                        setContent({ ...content, whyChooseUs: { ...content.whyChooseUs, features: newFeatures } });
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs"
                      placeholder="Image URL..."
                    />
                    <button
                      type="button"
                      onClick={() => openMediaPicker("whyChooseUs", "image", feat.image || "", idx)}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition text-[11px] font-semibold shrink-0 cursor-pointer shadow-sm"
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-red-400" />
                      Upload
                    </button>
                  </div>

                  {feat.image && (
                    <div className="mt-2 relative w-full h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-900">
                      <img 
                        src={feat.image} 
                        alt={feat.imageAlt || feat.title || "Card Preview"} 
                        className="w-full h-full object-cover"
                        onError={(e: any) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=800&auto=format&fit=crop";
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={feat.desc || ""}
                    onChange={(e) => {
                      const newFeatures = [...content.whyChooseUs.features];
                      newFeatures[idx].desc = e.target.value;
                      setContent({ ...content, whyChooseUs: { ...content.whyChooseUs, features: newFeatures } });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs leading-relaxed"
                    placeholder="Feature Description"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 6: TRUSTED PARTNERSHIPS & STATS (CLIENTS)
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "clients" && (
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col gap-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">
            Trusted Partnerships & Live Stats Ticker Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Badge Subtitle</label>
              <input
                type="text"
                value={content.clients?.badge || ""}
                onChange={(e) => setContent({ ...content, clients: { ...content.clients, badge: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Heading Line 1</label>
              <input
                type="text"
                value={content.clients?.headingLine1 || ""}
                onChange={(e) => setContent({ ...content, clients: { ...content.clients, headingLine1: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#E62E2D] mb-2">Heading Highlight (Red)</label>
              <input
                type="text"
                value={content.clients?.headingHighlight || ""}
                onChange={(e) => setContent({ ...content, clients: { ...content.clients, headingHighlight: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl border border-red-200 text-sm font-bold text-[#E62E2D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Section Description</label>
            <textarea
              rows={2}
              value={content.clients?.desc || ""}
              onChange={(e) => setContent({ ...content, clients: { ...content.clients, desc: e.target.value } })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
            />
          </div>

          {/* Stats Ticker Row Editors */}
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-md font-bold text-gray-900 mb-3">Live Animating Stats Ticker (4 Counters)</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {content.clients?.stats?.map((stat: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex flex-col gap-2">
                  <span className="font-extrabold text-xs text-[#E62E2D]">Stat #{idx + 1}</span>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500">Target Value Number</label>
                    <input
                      type="number"
                      value={stat.raw ?? 100}
                      onChange={(e) => {
                        const newStats = [...content.clients.stats];
                        newStats[idx].raw = parseInt(e.target.value) || 0;
                        newStats[idx].num = `${newStats[idx].raw}${newStats[idx].suffix || '+'}`;
                        setContent({ ...content, clients: { ...content.clients, stats: newStats } });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500">Suffix Symbol (+ / %)</label>
                    <input
                      type="text"
                      value={stat.suffix || "+"}
                      onChange={(e) => {
                        const newStats = [...content.clients.stats];
                        newStats[idx].suffix = e.target.value;
                        newStats[idx].num = `${newStats[idx].raw}${newStats[idx].suffix}`;
                        setContent({ ...content, clients: { ...content.clients, stats: newStats } });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500">Label Text</label>
                    <input
                      type="text"
                      value={stat.label || ""}
                      onChange={(e) => {
                        const newStats = [...content.clients.stats];
                        newStats[idx].label = e.target.value;
                        setContent({ ...content, clients: { ...content.clients, stats: newStats } });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Client Logos List */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <h3 className="text-md font-bold text-gray-900">Partner Client Logos ({content.clients?.clients?.length || 0})</h3>
              <p className="text-xs text-gray-500 mt-0.5">Upload client logos or pick from media library.</p>
            </div>
            <button
              onClick={() => {
                const newClients = [...(content.clients?.clients || []), {
                  name: "New Client",
                  logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/320px-Samsung_Logo.svg.png",
                  fallback: "NEW CLIENT",
                  color: "#111111"
                }];
                setContent({ ...content, clients: { ...content.clients, clients: newClients } });
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gray-900 hover:bg-black text-white text-xs font-bold cursor-pointer transition shadow-sm"
            >
              <Plus size={14} /> Add Partner Logo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.clients?.clients?.map((client: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex flex-col gap-3 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="font-bold text-xs text-[#E62E2D]">Partner #{idx + 1}: {client.name}</span>
                  <button
                    onClick={() => {
                      const newClients = content.clients.clients.filter((_: any, i: number) => i !== idx);
                      setContent({ ...content, clients: { ...content.clients, clients: newClients } });
                    }}
                    className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500">Partner Name</label>
                    <input
                      type="text"
                      value={client.name || ""}
                      onChange={(e) => {
                        const newClients = [...content.clients.clients];
                        newClients[idx].name = e.target.value;
                        setContent({ ...content, clients: { ...content.clients, clients: newClients } });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500">Fallback Short Text</label>
                    <input
                      type="text"
                      value={client.fallback || ""}
                      onChange={(e) => {
                        const newClients = [...content.clients.clients];
                        newClients[idx].fallback = e.target.value;
                        setContent({ ...content, clients: { ...content.clients, clients: newClients } });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs"
                    />
                  </div>
                </div>

                {/* LOGO IMAGE WITH MEDIA LIBRARY / DEVICE UPLOAD */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Logo Image URL</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={client.logo || ""}
                      onChange={(e) => {
                        const newClients = [...content.clients.clients];
                        newClients[idx].logo = e.target.value;
                        setContent({ ...content, clients: { ...content.clients, clients: newClients } });
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs"
                      placeholder="Logo URL or uploaded file..."
                    />
                    <button
                      type="button"
                      onClick={() => openMediaPicker("clients", "logo", client.logo || "", idx)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition text-xs font-semibold shrink-0 shadow-sm cursor-pointer"
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-red-400" />
                      Upload / Library
                    </button>
                  </div>

                  {client.logo && (
                    <div className="mt-2 w-28 h-12 rounded-lg border bg-white flex items-center justify-center p-2 shadow-sm">
                      <img 
                        src={client.logo} 
                        alt={client.name || "Client Logo"} 
                        className="max-h-8 max-w-full object-contain"
                        onError={(e: any) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 7: SEO & METADATA
          ───────────────────────────────────────────────────────────── */}
      {activeTab === "seo" && (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] flex flex-col gap-8">
          <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Search className="text-[#E62E2D]" size={20} />
                Homepage SEO, Canonical & Schema Setup
              </h2>
              <p className="text-gray-500 text-xs mt-1">
                Configure primary Google search meta tags, focus keywords, canonical URL, social share image, and inspect Organization schema.
              </p>
            </div>
            <span className="text-xs bg-red-100 text-red-700 font-bold px-3 py-1 rounded-full">
              Global Site Ranking
            </span>
          </div>

          {/* Primary Focus Keyword */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                Primary Focus Keyword
              </label>
              <input
                type="text"
                placeholder="e.g. Best International Contracting Company Saudi Arabia"
                value={content.seo?.focusKeyword || ""}
                onChange={(e) => setContent({ ...content, seo: { ...(content.seo || {}), focusKeyword: e.target.value } })}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 font-medium focus:ring-2 focus:ring-[#E62E2D] outline-none"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                The main search query targeted on Google for the entire Best International Contracting brand.
              </p>
            </div>

            {content.seo?.focusKeyword && (
              <div className="pt-3 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className={`flex items-center gap-2 p-2 rounded-lg border ${
                  (content.seo?.metaTitle || "").toLowerCase().includes((content.seo?.focusKeyword || "").toLowerCase())
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-medium"
                    : "bg-amber-50 border-amber-200 text-amber-800"
                }`}>
                  <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>In Meta Title</span>
                </div>

                <div className={`flex items-center gap-2 p-2 rounded-lg border ${
                  (content.seo?.metaDescription || "").toLowerCase().includes((content.seo?.focusKeyword || "").toLowerCase())
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-medium"
                    : "bg-amber-50 border-amber-200 text-amber-800"
                }`}>
                  <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>In Meta Description</span>
                </div>
              </div>
            )}
          </div>

          {/* Meta Title */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
                Meta Title (Homepage SEO Title)
              </label>
              <span className={`text-xs font-semibold ${
                (content.seo?.metaTitle || "").length >= 50 && (content.seo?.metaTitle || "").length <= 60
                  ? "text-emerald-600"
                  : (content.seo?.metaTitle || "").length > 60
                  ? "text-red-500"
                  : "text-gray-400"
              }`}>
                {(content.seo?.metaTitle || "").length} / 60 characters (Optimal: 50-60)
              </span>
            </div>
            <input
              type="text"
              placeholder="Best International Contracting Company | Industrial Solutions Saudi Arabia"
              value={content.seo?.metaTitle || ""}
              onChange={(e) => setContent({ ...content, seo: { ...(content.seo || {}), metaTitle: e.target.value } })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 font-medium focus:ring-2 focus:ring-[#E62E2D] outline-none"
            />
          </div>

          {/* Meta Description */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
                Meta Description
              </label>
              <span className={`text-xs font-semibold ${
                (content.seo?.metaDescription || "").length >= 140 && (content.seo?.metaDescription || "").length <= 160
                  ? "text-emerald-600"
                  : (content.seo?.metaDescription || "").length > 160
                  ? "text-red-500"
                  : "text-gray-400"
              }`}>
                {(content.seo?.metaDescription || "").length} / 160 characters (Optimal: 140-160)
              </span>
            </div>
            <textarea
              rows={3}
              placeholder="Leading industrial contractor in Saudi Arabia delivering turnkey civil, mechanical, piping, electrical contracting, heavy equipment rental, and certified manpower."
              value={content.seo?.metaDescription || ""}
              onChange={(e) => setContent({ ...content, seo: { ...(content.seo || {}), metaDescription: e.target.value } })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-[#E62E2D] outline-none"
            />
          </div>

          {/* Canonical URL */}
          <div>
            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
              Homepage Canonical URL
            </label>
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-gray-100 border border-gray-300 rounded-xl text-gray-500">
                <LinkIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="https://bestinternational.com.sa"
                value={content.seo?.canonicalUrl || ""}
                onChange={(e) => setContent({ ...content, seo: { ...(content.seo || {}), canonicalUrl: e.target.value } })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 font-mono focus:ring-2 focus:ring-[#E62E2D] outline-none"
              />
            </div>
          </div>

          {/* Social Share / OG Image */}
          <div>
            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
              Social Share & OpenGraph Image (1200x630)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="/uploads/og-default.jpg or https://..."
                value={content.seo?.ogImage || ""}
                onChange={(e) => setContent({ ...content, seo: { ...(content.seo || {}), ogImage: e.target.value } })}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-[#E62E2D] outline-none"
              />
              <button
                type="button"
                onClick={() => openMediaPicker("seo", "ogImage", content.seo?.ogImage || "")}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-[#111] hover:bg-black text-white rounded-xl text-xs font-bold shadow-sm"
              >
                <FolderOpen className="w-4 h-4" />
                Media Library
              </button>
            </div>
            {content.seo?.ogImage && (
              <div className="mt-3 relative w-48 h-28 rounded-xl overflow-hidden border bg-gray-100">
                <img
                  src={content.seo?.ogImage}
                  alt="Social Share Preview"
                  className="w-full h-full object-cover"
                  onError={(e: any) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=600";
                  }}
                />
              </div>
            )}
          </div>

          {/* LIVE GOOGLE SEARCH SERP PREVIEW */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-600" />
                Live Google Search (SERP) Preview
              </h3>
              <span className="text-[11px] text-gray-500 font-medium">Desktop & Mobile Snippet</span>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-4 h-4 rounded-full bg-[#E62E2D] text-white flex items-center justify-center font-black text-[9px]">
                  B
                </div>
                <span className="font-medium text-gray-800">Best International Contracting</span>
                <span className="text-gray-400">›</span>
                <span className="text-gray-500">https://bestinternational.com.sa</span>
              </div>

              <div className="text-lg text-[#1a0dab] hover:underline font-medium cursor-pointer leading-snug">
                {content.seo?.metaTitle || "Best International Contracting Company | Industrial Solutions Saudi Arabia"}
              </div>

              <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                {content.seo?.metaDescription ||
                  "Leading industrial contractor in Saudi Arabia delivering turnkey civil, mechanical, piping, electrical contracting, heavy equipment rental, and certified manpower."}
              </p>
            </div>
          </div>

          {/* ORGANIZATION & LOCAL BUSINESS SCHEMA INSPECTOR */}
          <div className="pt-4 border-t border-gray-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Code className="w-4 h-4 text-emerald-600" />
                  Organization & LocalBusiness Schema (JSON-LD)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Structured data injected automatically into Google search results for corporate brand authority.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const orgSchema = {
                    "@context": "https://schema.org",
                    "@type": "GeneralContractor",
                    name: "Best International Contracting Company",
                    alternateName: "BiC",
                    url: "https://bestinternational.com.sa",
                    telephone: "+966 13 800 0000",
                    email: "info@bestinternational.com.sa",
                    address: {
                      "@type": "PostalAddress",
                      streetAddress: "King Abdulaziz Road",
                      addressLocality: "Dammam",
                      addressRegion: "Eastern Province",
                      addressCountry: "SA"
                    },
                    areaServed: "Saudi Arabia"
                  };
                  navigator.clipboard.writeText(JSON.stringify(orgSchema, null, 2));
                  setCopiedSchema(true);
                  setTimeout(() => setCopiedSchema(false), 2500);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-semibold transition"
              >
                {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSchema ? "Copied Schema!" : "Copy Schema"}
              </button>
            </div>

            <pre className="p-4 bg-[#111] text-emerald-400 rounded-xl text-xs font-mono overflow-x-auto max-h-56 leading-relaxed border border-gray-800">
{JSON.stringify(
  {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "name": "Best International Contracting Company",
    "alternateName": "BiC",
    "url": "https://bestinternational.com.sa",
    "logo": "https://bestinternational.com.sa/images/logo.png",
    "telephone": "+966 13 800 0000",
    "email": "info@bestinternational.com.sa",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "King Abdulaziz Road",
      "addressLocality": "Dammam",
      "addressRegion": "Eastern Province",
      "addressCountry": "SA"
    },
    "areaServed": "Saudi Arabia"
  },
  null,
  2
)}
            </pre>
          </div>
        </div>
      )}

      {/* Bottom Sticky Action Bar */}
      <div className="flex items-center justify-between p-4 bg-[#111] text-white rounded-2xl shadow-xl border border-white/10 mt-4">
        <span className="text-xs font-medium text-gray-400">
          Make sure to click <strong className="text-white">Save All Changes</strong> to persist changes live across the site.
        </span>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#E62E2D] hover:bg-red-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
        >
          {saving ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      {/* Media Library Modal Popup */}
      <MediaLibraryModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelectImage={handleMediaSelect}
        currentImageUrl={mediaTarget?.currentValue || ""}
      />

    </div>
  );
}
