"use client";

import { useState, useEffect } from "react";
import { 
  Save, 
  RefreshCw, 
  Image as ImageIcon, 
  Globe, 
  Layers, 
  Phone, 
  Mail, 
  MapPin, 
  Award, 
  Share2, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  ExternalLink,
  Shield,
  Eye,
  Sliders,
  Check,
  PanelTop,
  PanelBottom,
  Sparkles,
  Clock,
  Navigation,
  FileText
} from "lucide-react";
import MediaLibraryModal from "@/components/MediaLibraryModal";
import { SiteSettings, NavLinkItem } from "@/lib/getSiteSettings";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"branding" | "header" | "footer" | "socials">("branding");
  const [notification, setNotification] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Media Library state
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaTargetField, setMediaTargetField] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/settings?_t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Pragma": "no-cache",
          "Cache-Control": "no-cache"
        }
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
      showNotification("Failed to load settings", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (text: string, type: "success" | "error") => {
    setNotification({ text, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        showNotification("Site branding, header & footer settings saved successfully!", "success");
      } else {
        showNotification("Failed to save settings. Please try again.", "error");
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      showNotification("Error connecting to server", "error");
    } finally {
      setSaving(false);
    }
  };

  const openMediaModal = (targetField: string) => {
    setMediaTargetField(targetField);
    setIsMediaModalOpen(true);
  };

  const handleMediaSelect = (url: string) => {
    if (!settings || !mediaTargetField) return;

    if (mediaTargetField === "logoUrl") {
      setSettings({
        ...settings,
        general: { ...settings.general, logoUrl: url }
      });
    } else if (mediaTargetField === "faviconUrl") {
      setSettings({
        ...settings,
        general: { ...settings.general, faviconUrl: url }
      });
    } else if (mediaTargetField === "footerLogoUrl") {
      setSettings({
        ...settings,
        footer: { ...settings.footer, logoUrl: url }
      });
    } else if (mediaTargetField === "footerCtaBg") {
      setSettings({
        ...settings,
        footer: {
          ...settings.footer,
          ctaBanner: {
            ...(settings.footer.ctaBanner || {} as any),
            bgImageUrl: url
          }
        }
      });
    }
    setIsMediaModalOpen(false);
    setMediaTargetField(null);
  };

  // Nav link helpers
  const handleAddNavLink = () => {
    if (!settings) return;
    const newId = Date.now().toString();
    const newLinks = [...(settings.header.navLinks || []), { id: newId, name: "NEW LINK", path: "/new-link" }];
    setSettings({
      ...settings,
      header: { ...settings.header, navLinks: newLinks }
    });
  };

  const handleRemoveNavLink = (index: number) => {
    if (!settings) return;
    const newLinks = settings.header.navLinks.filter((_, i) => i !== index);
    setSettings({
      ...settings,
      header: { ...settings.header, navLinks: newLinks }
    });
  };

  const handleMoveNavLink = (index: number, direction: "up" | "down") => {
    if (!settings) return;
    const links = [...settings.header.navLinks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= links.length) return;
    const [movedItem] = links.splice(index, 1);
    links.splice(targetIndex, 0, movedItem);
    setSettings({
      ...settings,
      header: { ...settings.header, navLinks: links }
    });
  };

  // Footer Link helpers
  const handleAddFooterLink = (type: "quickLinks" | "serviceLinks" | "informationLinks" | "bottomLinks") => {
    if (!settings) return;
    const newId = Date.now().toString();
    const currentList = (settings.footer as any)[type] || [];
    const newLinks = [...currentList, { id: newId, name: "New Link", path: "/" }];
    setSettings({
      ...settings,
      footer: { ...settings.footer, [type]: newLinks }
    });
  };

  const handleRemoveFooterLink = (type: "quickLinks" | "serviceLinks" | "informationLinks" | "bottomLinks", index: number) => {
    if (!settings) return;
    const currentList = (settings.footer as any)[type] || [];
    const newLinks = currentList.filter((_: any, i: number) => i !== index);
    setSettings({
      ...settings,
      footer: { ...settings.footer, [type]: newLinks }
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <RefreshCw size={36} className="animate-spin text-[#E62E2D]" />
        <p className="text-gray-500 font-medium">Loading Site Branding & Settings...</p>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-8 bg-red-50 text-red-700 rounded-2xl border border-red-200">
        <p className="font-bold">Failed to load configuration.</p>
        <button onClick={fetchSettings} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-sm">
          Retry Loading
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-28">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl transition-all duration-300 ${
          notification.type === "success" 
            ? "bg-emerald-600 text-white shadow-emerald-600/30" 
            : "bg-red-600 text-white shadow-red-600/30"
        }`}>
          {notification.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="font-medium text-sm">{notification.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E62E2D] bg-red-50 px-2.5 py-1 rounded-md">
              Global Site Customizer
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            Header, Footer & Branding Customizer
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Customize everything in the Header and Footer: CTA banner, contacts, columns, links, badges, slogans, and copyright notices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a 
            href="/" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
          >
            <ExternalLink size={16} />
            Live Preview
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#E62E2D] hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-500/20 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Saving Changes..." : "Save All Changes"}
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {[
          { id: "branding", label: "Logo & Favicon", icon: Sparkles },
          { id: "header", label: "Header & Navigation", icon: PanelTop },
          { id: "footer", label: "Footer & CTA Banner", icon: PanelBottom },
          { id: "socials", label: "Social Media Links", icon: Share2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                isActive
                  ? "bg-[#111] text-white shadow-md"
                  : "bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200/60"
              }`}
            >
              <Icon size={16} className={isActive ? "text-[#E62E2D]" : "text-gray-400"} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB 1: BRANDING (LOGO & FAVICON)
          ========================================================================= */}
      {activeTab === "branding" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Main Website Logo */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ImageIcon size={20} className="text-[#E62E2D]" />
                Primary Website Logo
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Displayed in the main top navigation bar on all pages. Recommended format: PNG, SVG, or high-res JPG.
              </p>
            </div>

            {/* Logo Preview */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500">Live Logo Preview</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#111] p-6 rounded-xl border border-white/10 flex flex-col items-center justify-center gap-2 min-h-[120px]">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Dark View</span>
                  {settings.general.logoUrl ? (
                    <img 
                      src={settings.general.logoUrl} 
                      alt={settings.general.logoAlt || "Logo"} 
                      className="h-14 object-contain max-w-full drop-shadow" 
                    />
                  ) : (
                    <span className="text-xs text-gray-500">No logo selected</span>
                  )}
                </div>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 flex flex-col items-center justify-center gap-2 min-h-[120px]">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Light View</span>
                  {settings.general.logoUrl ? (
                    <img 
                      src={settings.general.logoUrl} 
                      alt={settings.general.logoAlt || "Logo"} 
                      className="h-14 object-contain max-w-full" 
                    />
                  ) : (
                    <span className="text-xs text-gray-500">No logo selected</span>
                  )}
                </div>
              </div>
            </div>

            {/* Logo URL Input & Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-700">Logo Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={settings.general.logoUrl}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, logoUrl: e.target.value }
                  })}
                  placeholder="/uploads/my-logo.png"
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E62E2D] font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => openMediaModal("logoUrl")}
                  className="px-4 py-2.5 bg-[#111] hover:bg-gray-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shrink-0"
                >
                  <ImageIcon size={14} />
                  Choose / Upload
                </button>
              </div>
            </div>

            {/* Logo Alt Text */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-700">Logo Alt Text</label>
              <input
                type="text"
                value={settings.general.logoAlt}
                onChange={(e) => setSettings({
                  ...settings,
                  general: { ...settings.general, logoAlt: e.target.value }
                })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E62E2D]"
              />
            </div>
          </div>

          {/* Favicon & Site Name */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Globe size={20} className="text-[#E62E2D]" />
                Website Favicon & Tab Icon
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                The small icon that appears in browser tabs, bookmarks, and mobile home screen shortcuts.
              </p>
            </div>

            {/* Favicon URL Input & Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-700">Favicon Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={settings.general.faviconUrl}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, faviconUrl: e.target.value }
                  })}
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E62E2D] font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => openMediaModal("faviconUrl")}
                  className="px-4 py-2.5 bg-[#111] hover:bg-gray-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shrink-0"
                >
                  <ImageIcon size={14} />
                  Choose / Upload
                </button>
              </div>
            </div>

            {/* Site Name & Tagline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-700">Company Name</label>
                <input
                  type="text"
                  value={settings.general.siteName}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, siteName: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E62E2D]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-700">Short Name</label>
                <input
                  type="text"
                  value={settings.general.shortName}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, shortName: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E62E2D]"
                />
              </div>
            </div>

          </div>

          {/* Dedicated Footer Brand Logo Card */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6 lg:col-span-2">
            <div className="border-b border-gray-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <PanelBottom size={20} className="text-[#E62E2D]" />
                  Dedicated Footer Brand Logo
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Customized logo for dark background footer. If left empty, the Primary Website Logo will be used automatically.
                </p>
              </div>
              {settings.footer?.logoUrl && (
                <button
                  type="button"
                  onClick={() => setSettings({
                    ...settings,
                    footer: { ...settings.footer, logoUrl: "" }
                  })}
                  className="text-xs font-bold text-red-600 hover:text-red-700 self-start sm:self-auto"
                >
                  Reset to Default Logo
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Footer Preview Frame */}
              <div className="md:col-span-5 bg-[#0D0D11] p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center gap-2 min-h-[130px]">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Footer Dark Preview</span>
                <img 
                  src={settings.footer?.logoUrl || settings.general?.logoUrl || "/uploads/upload-1790411215652-best_logo-01.png"} 
                  alt={settings.footer?.logoAlt || settings.general?.logoAlt || "Footer Logo"} 
                  className="h-14 object-contain max-w-full drop-shadow brightness-105" 
                />
              </div>

              {/* Footer Logo Input */}
              <div className="md:col-span-7 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-700">Footer Logo URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={settings.footer?.logoUrl || ""}
                      onChange={(e) => setSettings({
                        ...settings,
                        footer: { ...settings.footer, logoUrl: e.target.value }
                      })}
                      placeholder="e.g. /uploads/footer-logo.png"
                      className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E62E2D] font-mono text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => openMediaModal("footerLogoUrl")}
                      className="px-4 py-2.5 bg-[#E62E2D] hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shrink-0"
                    >
                      <ImageIcon size={14} />
                      Choose / Upload
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-700">Footer Logo Alt Text</label>
                  <input
                    type="text"
                    value={settings.footer?.logoAlt || ""}
                    onChange={(e) => setSettings({
                      ...settings,
                      footer: { ...settings.footer, logoAlt: e.target.value }
                    })}
                    placeholder="e.g. Best International Contracting Footer Logo"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#E62E2D]"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 2: HEADER & NAVIGATION
          ========================================================================= */}
      {activeTab === "header" && (
        <div className="flex flex-col gap-8">
          
          {/* Top Utility Bar */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Phone size={20} className="text-[#E62E2D]" />
                  Top Utility Bar (Contact & Accreditation)
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  The slim dark bar located at the very top with phone, email, location, and Aramco badge.
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.header.showTopBar}
                  onChange={(e) => setSettings({
                    ...settings,
                    header: { ...settings.header, showTopBar: e.target.checked }
                  })}
                  className="w-4 h-4 accent-[#E62E2D] rounded"
                />
                <span className="text-sm font-bold text-gray-700">Enable Top Bar</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-700">Header Phone</label>
                <input
                  type="text"
                  value={settings.header.phone}
                  onChange={(e) => setSettings({
                    ...settings,
                    header: { ...settings.header, phone: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E62E2D]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-700">Header Email</label>
                <input
                  type="email"
                  value={settings.header.email}
                  onChange={(e) => setSettings({
                    ...settings,
                    header: { ...settings.header, email: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E62E2D]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-700">Header Location Text</label>
                <input
                  type="text"
                  value={settings.header.address}
                  onChange={(e) => setSettings({
                    ...settings,
                    header: { ...settings.header, address: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E62E2D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-700">Top Bar Accreditation Badge</label>
                <input
                  type="text"
                  value={settings.header.badgeText}
                  onChange={(e) => setSettings({
                    ...settings,
                    header: { ...settings.header, badgeText: e.target.value }
                  })}
                  placeholder="Aramco Approved Contractor"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E62E2D]"
                />
              </div>

              <div className="flex items-center gap-6 pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.header.showBadge !== false}
                    onChange={(e) => setSettings({
                      ...settings,
                      header: { ...settings.header, showBadge: e.target.checked }
                    })}
                    className="w-4 h-4 accent-[#E62E2D] rounded"
                  />
                  <span className="text-sm font-semibold text-gray-700">Display Badge</span>
                </label>
              </div>
            </div>
          </div>

          {/* Navigation Menu Links */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Layers size={20} className="text-[#E62E2D]" />
                  Navigation Menu Items
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Add, edit, reorder or remove main navigation links in the header.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddNavLink}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-colors self-start sm:self-auto"
              >
                <Plus size={14} />
                Add Menu Link
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {settings.header.navLinks.map((link, index) => (
                <div 
                  key={link.id || index}
                  className="flex flex-col sm:flex-row items-center gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-200/80 hover:border-gray-300 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-200 text-gray-600 font-bold text-xs flex items-center justify-center shrink-0">
                    {index + 1}
                  </div>

                  <div className="flex-1 w-full sm:w-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={link.name}
                      onChange={(e) => {
                        const newLinks = [...settings.header.navLinks];
                        newLinks[index].name = e.target.value;
                        setSettings({
                          ...settings,
                          header: { ...settings.header, navLinks: newLinks }
                        });
                      }}
                      placeholder="Label"
                      className="px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-[#E62E2D]"
                    />
                    <input
                      type="text"
                      value={link.path}
                      onChange={(e) => {
                        const newLinks = [...settings.header.navLinks];
                        newLinks[index].path = e.target.value;
                        setSettings({
                          ...settings,
                          header: { ...settings.header, navLinks: newLinks }
                        });
                      }}
                      placeholder="URL"
                      className="px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-sm font-mono text-xs focus:outline-none focus:border-[#E62E2D]"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveNavLink(index, "up")}
                      className="p-2 text-gray-500 hover:text-gray-900 disabled:opacity-30 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      type="button"
                      disabled={index === settings.header.navLinks.length - 1}
                      onClick={() => handleMoveNavLink(index, "down")}
                      className="p-2 text-gray-500 hover:text-gray-900 disabled:opacity-30 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <ArrowDown size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveNavLink(index)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: FOOTER SETTINGS (COMPREHENSIVE CUSTOMIZER)
          ========================================================================= */}
      {activeTab === "footer" && (
        <div className="flex flex-col gap-8">
          
          {/* 1. TOP CALL TO ACTION (CTA) BANNER */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles size={20} className="text-[#E62E2D]" />
                  Footer Call to Action Banner (&quot;Have a Project in Mind?&quot;)
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  The dark industrial card at the top of the footer with headline, buttons, and background photograph.
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.footer.ctaBanner?.show !== false}
                  onChange={(e) => setSettings({
                    ...settings,
                    footer: {
                      ...settings.footer,
                      ctaBanner: {
                        ...(settings.footer.ctaBanner || {} as any),
                        show: e.target.checked
                      }
                    }
                  })}
                  className="w-4 h-4 accent-[#E62E2D] rounded"
                />
                <span className="text-sm font-bold text-gray-700">Display CTA Banner</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-700">Small Badge Tag</label>
                <input
                  type="text"
                  value={settings.footer.ctaBanner?.badge || "LET'S BUILD TOGETHER"}
                  onChange={(e) => setSettings({
                    ...settings,
                    footer: {
                      ...settings.footer,
                      ctaBanner: {
                        ...(settings.footer.ctaBanner || {} as any),
                        badge: e.target.value
                      }
                    }
                  })}
                  placeholder="LET'S BUILD TOGETHER"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E62E2D]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-700">Headline (White text part)</label>
                <input
                  type="text"
                  value={settings.footer.ctaBanner?.titleWhite || "Have a Project"}
                  onChange={(e) => setSettings({
                    ...settings,
                    footer: {
                      ...settings.footer,
                      ctaBanner: {
                        ...(settings.footer.ctaBanner || {} as any),
                        titleWhite: e.target.value
                      }
                    }
                  })}
                  placeholder="Have a Project"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E62E2D] font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-700">Headline (Red highlight part)</label>
                <input
                  type="text"
                  value={settings.footer.ctaBanner?.titleRed || "in Mind?"}
                  onChange={(e) => setSettings({
                    ...settings,
                    footer: {
                      ...settings.footer,
                      ctaBanner: {
                        ...(settings.footer.ctaBanner || {} as any),
                        titleRed: e.target.value
                      }
                    }
                  })}
                  placeholder="in Mind?"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E62E2D] font-bold text-[#E62E2D]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-700">CTA Description Text</label>
              <textarea
                rows={2}
                value={settings.footer.ctaBanner?.description || ""}
                onChange={(e) => setSettings({
                  ...settings,
                  footer: {
                    ...settings.footer,
                    ctaBanner: {
                      ...(settings.footer.ctaBanner || {} as any),
                      description: e.target.value
                    }
                  }
                })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E62E2D]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-gray-700">Primary Button Label</label>
                <input
                  type="text"
                  value={settings.footer.ctaBanner?.quoteButtonText || "GET A QUOTE"}
                  onChange={(e) => setSettings({
                    ...settings,
                    footer: {
                      ...settings.footer,
                      ctaBanner: {
                        ...(settings.footer.ctaBanner || {} as any),
                        quoteButtonText: e.target.value
                      }
                    }
                  })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#E62E2D]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-gray-700">Primary Button URL</label>
                <input
                  type="text"
                  value={settings.footer.ctaBanner?.quoteButtonUrl || "/contact-us"}
                  onChange={(e) => setSettings({
                    ...settings,
                    footer: {
                      ...settings.footer,
                      ctaBanner: {
                        ...(settings.footer.ctaBanner || {} as any),
                        quoteButtonUrl: e.target.value
                      }
                    }
                  })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-none focus:border-[#E62E2D]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-gray-700">Brochure Button Label</label>
                <input
                  type="text"
                  value={settings.footer.ctaBanner?.brochureButtonText || "OUR BROCHURE"}
                  onChange={(e) => setSettings({
                    ...settings,
                    footer: {
                      ...settings.footer,
                      ctaBanner: {
                        ...(settings.footer.ctaBanner || {} as any),
                        brochureButtonText: e.target.value
                      }
                    }
                  })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#E62E2D]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-gray-700">Brochure Button URL</label>
                <input
                  type="text"
                  value={settings.footer.ctaBanner?.brochureButtonUrl || "/about-us"}
                  onChange={(e) => setSettings({
                    ...settings,
                    footer: {
                      ...settings.footer,
                      ctaBanner: {
                        ...(settings.footer.ctaBanner || {} as any),
                        brochureButtonUrl: e.target.value
                      }
                    }
                  })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-none focus:border-[#E62E2D]"
                />
              </div>
            </div>

            {/* Background Image */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <label className="text-xs font-bold uppercase text-gray-700">CTA Card Background Image</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={settings.footer.ctaBanner?.bgImageUrl || ""}
                  onChange={(e) => setSettings({
                    ...settings,
                    footer: {
                      ...settings.footer,
                      ctaBanner: {
                        ...(settings.footer.ctaBanner || {} as any),
                        bgImageUrl: e.target.value
                      }
                    }
                  })}
                  placeholder="https://... or /uploads/..."
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-none focus:border-[#E62E2D]"
                />
                <button
                  type="button"
                  onClick={() => openMediaModal("footerCtaBg")}
                  className="px-4 py-2.5 bg-[#111] hover:bg-gray-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shrink-0"
                >
                  <ImageIcon size={14} />
                  Choose / Upload
                </button>
              </div>
            </div>
          </div>

          {/* 2. BRAND COLUMN & 3 BADGES */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Brand Bio */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <PanelBottom size={20} className="text-[#E62E2D]" />
                  Footer Brand Bio & Logo
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  The company description text rendered under the footer logo.
                </p>
              </div>

              <div className="space-y-3 pb-2 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase text-gray-700">Footer Brand Logo</label>
                  {settings.footer?.logoUrl && (
                    <button
                      type="button"
                      onClick={() => setSettings({
                        ...settings,
                        footer: { ...settings.footer, logoUrl: "" }
                      })}
                      className="text-[11px] font-bold text-red-600 hover:text-red-700"
                    >
                      Use Primary Logo
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={settings.footer?.logoUrl || ""}
                    onChange={(e) => setSettings({
                      ...settings,
                      footer: { ...settings.footer, logoUrl: e.target.value }
                    })}
                    placeholder="Leave empty to use Primary Website Logo"
                    className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-none focus:border-[#E62E2D]"
                  />
                  <button
                    type="button"
                    onClick={() => openMediaModal("footerLogoUrl")}
                    className="px-3.5 py-2.5 bg-[#111] hover:bg-gray-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <ImageIcon size={14} />
                    Choose Logo
                  </button>
                </div>

                <div className="bg-[#0D0D11] p-3 rounded-xl border border-white/10 flex items-center justify-center">
                  <img 
                    src={settings.footer?.logoUrl || settings.general?.logoUrl || "/uploads/upload-1790411215652-best_logo-01.png"} 
                    alt="Footer Logo Preview" 
                    className="h-10 object-contain max-w-full brightness-105"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-700">About Company Bio</label>
                <textarea
                  rows={3}
                  value={settings.footer.aboutText}
                  onChange={(e) => setSettings({
                    ...settings,
                    footer: { ...settings.footer, aboutText: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#E62E2D] leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-gray-700">Blueprint Tagline Top</label>
                  <input
                    type="text"
                    value={settings.footer.sloganTitle || "BUILDING"}
                    onChange={(e) => setSettings({
                      ...settings,
                      footer: { ...settings.footer, sloganTitle: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-gray-700">Blueprint Tagline Main</label>
                  <input
                    type="text"
                    value={settings.footer.sloganSubtitle || "A STRONGER TOMORROW"}
                    onChange={(e) => setSettings({
                      ...settings,
                      footer: { ...settings.footer, sloganSubtitle: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>
            </div>

            {/* 3 Feature Badges */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Award size={20} className="text-[#E62E2D]" />
                  Brand Column Feature Badges
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  The 3 quality badges displayed underneath the brand description.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-gray-700 flex items-center gap-2">
                    <Shield size={14} className="text-[#E62E2D]" /> Badge 1 Label
                  </label>
                  <input
                    type="text"
                    value={settings.footer.badge1 || "Quality Driven"}
                    onChange={(e) => setSettings({
                      ...settings,
                      footer: { ...settings.footer, badge1: e.target.value }
                    })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E62E2D]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-gray-700 flex items-center gap-2">
                    <Shield size={14} className="text-[#E62E2D]" /> Badge 2 Label
                  </label>
                  <input
                    type="text"
                    value={settings.footer.badge2 || "Trusted Partnership"}
                    onChange={(e) => setSettings({
                      ...settings,
                      footer: { ...settings.footer, badge2: e.target.value }
                    })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E62E2D]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-gray-700 flex items-center gap-2">
                    <Shield size={14} className="text-[#E62E2D]" /> Badge 3 Label
                  </label>
                  <input
                    type="text"
                    value={settings.footer.badge3 || "Sustainable Growth"}
                    onChange={(e) => setSettings({
                      ...settings,
                      footer: { ...settings.footer, badge3: e.target.value }
                    })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E62E2D]"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* 3. CONTACT US COLUMN CUSTOMIZER */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Phone size={20} className="text-[#E62E2D]" />
                Footer Contact Us Column
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Configure all 3 phone lines (KSA/UAE), email, operating hours, and location direction link.
              </p>
            </div>

            {/* 3 Phone Rows */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-xs font-bold uppercase text-gray-600">Phone 1 (KSA)</span>
                <input
                  type="text"
                  value={settings.footer.phone1 || "+966 54 750 4465"}
                  onChange={(e) => setSettings({
                    ...settings,
                    footer: { ...settings.footer, phone1: e.target.value }
                  })}
                  placeholder="Number"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-[#E62E2D]"
                />
                <input
                  type="text"
                  value={settings.footer.phone1Label || "KSA"}
                  onChange={(e) => setSettings({
                    ...settings,
                    footer: { ...settings.footer, phone1Label: e.target.value }
                  })}
                  placeholder="Region Label (e.g. KSA)"
                  className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                />
              </div>

              <div className="space-y-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-xs font-bold uppercase text-gray-600">Phone 2 (KSA)</span>
                <input
                  type="text"
                  value={settings.footer.phone2 || "+966 50 206 6423"}
                  onChange={(e) => setSettings({
                    ...settings,
                    footer: { ...settings.footer, phone2: e.target.value }
                  })}
                  placeholder="Number"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-[#E62E2D]"
                />
                <input
                  type="text"
                  value={settings.footer.phone2Label || "KSA"}
                  onChange={(e) => setSettings({
                    ...settings,
                    footer: { ...settings.footer, phone2Label: e.target.value }
                  })}
                  placeholder="Region Label (e.g. KSA)"
                  className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                />
              </div>

              <div className="space-y-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-xs font-bold uppercase text-gray-600">Phone 3 (UAE)</span>
                <input
                  type="text"
                  value={settings.footer.phone3 || "+971 55 601 6007"}
                  onChange={(e) => setSettings({
                    ...settings,
                    footer: { ...settings.footer, phone3: e.target.value }
                  })}
                  placeholder="Number"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-[#E62E2D]"
                />
                <input
                  type="text"
                  value={settings.footer.phone3Label || "UAE"}
                  onChange={(e) => setSettings({
                    ...settings,
                    footer: { ...settings.footer, phone3Label: e.target.value }
                  })}
                  placeholder="Region Label (e.g. UAE)"
                  className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Email, Hours, Directions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-700 flex items-center gap-1.5">
                  <Mail size={14} className="text-[#E62E2D]" /> Contact Email
                </label>
                <input
                  type="email"
                  value={settings.footer.email || "info@bestincontracting.com"}
                  onChange={(e) => setSettings({
                    ...settings,
                    footer: { ...settings.footer, email: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E62E2D]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-700 flex items-center gap-1.5">
                  <Clock size={14} className="text-[#E62E2D]" /> Operating Hours
                </label>
                <input
                  type="text"
                  value={settings.footer.workingHours || "Sat-Thu 8am - 5pm"}
                  onChange={(e) => setSettings({
                    ...settings,
                    footer: { ...settings.footer, workingHours: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E62E2D]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-700 flex items-center gap-1.5">
                  <Navigation size={14} className="text-[#E62E2D]" /> Get Direction Label & URL
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={settings.footer.directionText || "Visit Us"}
                    onChange={(e) => setSettings({
                      ...settings,
                      footer: { ...settings.footer, directionText: e.target.value }
                    })}
                    placeholder="Text"
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#E62E2D]"
                  />
                  <input
                    type="text"
                    value={settings.footer.directionUrl || "/contact-us"}
                    onChange={(e) => setSettings({
                      ...settings,
                      footer: { ...settings.footer, directionUrl: e.target.value }
                    })}
                    placeholder="URL"
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-none focus:border-[#E62E2D]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 4. THREE LINK COLUMNS (QUICK LINKS, SERVICES, INFORMATION) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Quick Links */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <input
                  type="text"
                  value={settings.footer.quickLinksTitle || "Quick Links"}
                  onChange={(e) => setSettings({
                    ...settings,
                    footer: { ...settings.footer, quickLinksTitle: e.target.value }
                  })}
                  className="font-bold text-sm text-gray-900 border-b border-dashed border-gray-300 focus:outline-none focus:border-[#E62E2D]"
                />
                <button
                  type="button"
                  onClick={() => handleAddFooterLink("quickLinks")}
                  className="p-1.5 bg-gray-900 hover:bg-black text-white rounded-lg text-xs font-bold transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-1">
                {(settings.footer.quickLinks || []).map((link, idx) => (
                  <div key={link.id || idx} className="flex items-center gap-1.5 p-2 bg-gray-50 rounded-lg border border-gray-200">
                    <input
                      type="text"
                      value={link.name}
                      onChange={(e) => {
                        const newLinks = [...(settings.footer.quickLinks || [])];
                        newLinks[idx].name = e.target.value;
                        setSettings({
                          ...settings,
                          footer: { ...settings.footer, quickLinks: newLinks }
                        });
                      }}
                      placeholder="Title"
                      className="w-1/2 px-2 py-1 bg-white border border-gray-200 rounded text-xs font-semibold focus:outline-none focus:border-[#E62E2D]"
                    />
                    <input
                      type="text"
                      value={link.path}
                      onChange={(e) => {
                        const newLinks = [...(settings.footer.quickLinks || [])];
                        newLinks[idx].path = e.target.value;
                        setSettings({
                          ...settings,
                          footer: { ...settings.footer, quickLinks: newLinks }
                        });
                      }}
                      placeholder="URL"
                      className="w-1/2 px-2 py-1 bg-white border border-gray-200 rounded text-xs font-mono focus:outline-none focus:border-[#E62E2D]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFooterLink("quickLinks", idx)}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Links */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <input
                  type="text"
                  value={settings.footer.servicesTitle || "Services"}
                  onChange={(e) => setSettings({
                    ...settings,
                    footer: { ...settings.footer, servicesTitle: e.target.value }
                  })}
                  className="font-bold text-sm text-gray-900 border-b border-dashed border-gray-300 focus:outline-none focus:border-[#E62E2D]"
                />
                <button
                  type="button"
                  onClick={() => handleAddFooterLink("serviceLinks")}
                  className="p-1.5 bg-gray-900 hover:bg-black text-white rounded-lg text-xs font-bold transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-1">
                {(settings.footer.serviceLinks || []).map((link, idx) => (
                  <div key={link.id || idx} className="flex items-center gap-1.5 p-2 bg-gray-50 rounded-lg border border-gray-200">
                    <input
                      type="text"
                      value={link.name}
                      onChange={(e) => {
                        const newLinks = [...(settings.footer.serviceLinks || [])];
                        newLinks[idx].name = e.target.value;
                        setSettings({
                          ...settings,
                          footer: { ...settings.footer, serviceLinks: newLinks }
                        });
                      }}
                      placeholder="Title"
                      className="w-1/2 px-2 py-1 bg-white border border-gray-200 rounded text-xs font-semibold focus:outline-none focus:border-[#E62E2D]"
                    />
                    <input
                      type="text"
                      value={link.path}
                      onChange={(e) => {
                        const newLinks = [...(settings.footer.serviceLinks || [])];
                        newLinks[idx].path = e.target.value;
                        setSettings({
                          ...settings,
                          footer: { ...settings.footer, serviceLinks: newLinks }
                        });
                      }}
                      placeholder="URL"
                      className="w-1/2 px-2 py-1 bg-white border border-gray-200 rounded text-xs font-mono focus:outline-none focus:border-[#E62E2D]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFooterLink("serviceLinks", idx)}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Information Links */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <input
                  type="text"
                  value={settings.footer.informationTitle || "Information"}
                  onChange={(e) => setSettings({
                    ...settings,
                    footer: { ...settings.footer, informationTitle: e.target.value }
                  })}
                  className="font-bold text-sm text-gray-900 border-b border-dashed border-gray-300 focus:outline-none focus:border-[#E62E2D]"
                />
                <button
                  type="button"
                  onClick={() => handleAddFooterLink("informationLinks")}
                  className="p-1.5 bg-gray-900 hover:bg-black text-white rounded-lg text-xs font-bold transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-1">
                {((settings.footer as any).informationLinks || []).map((link: any, idx: number) => (
                  <div key={link.id || idx} className="flex items-center gap-1.5 p-2 bg-gray-50 rounded-lg border border-gray-200">
                    <input
                      type="text"
                      value={link.name}
                      onChange={(e) => {
                        const current = (settings.footer as any).informationLinks || [];
                        const newLinks = [...current];
                        newLinks[idx].name = e.target.value;
                        setSettings({
                          ...settings,
                          footer: { ...settings.footer, informationLinks: newLinks } as any
                        });
                      }}
                      placeholder="Title"
                      className="w-1/2 px-2 py-1 bg-white border border-gray-200 rounded text-xs font-semibold focus:outline-none focus:border-[#E62E2D]"
                    />
                    <input
                      type="text"
                      value={link.path}
                      onChange={(e) => {
                        const current = (settings.footer as any).informationLinks || [];
                        const newLinks = [...current];
                        newLinks[idx].path = e.target.value;
                        setSettings({
                          ...settings,
                          footer: { ...settings.footer, informationLinks: newLinks } as any
                        });
                      }}
                      placeholder="URL"
                      className="w-1/2 px-2 py-1 bg-white border border-gray-200 rounded text-xs font-mono focus:outline-none focus:border-[#E62E2D]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFooterLink("informationLinks", idx)}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* 5. LOCATION BEACON & COPYRIGHT BAR */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Location Beacon */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <MapPin size={18} className="text-[#E62E2D]" />
                Location Beacon Widget
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-gray-700">City</label>
                  <input
                    type="text"
                    value={settings.footer.locationCity || "RIYADH"}
                    onChange={(e) => setSettings({
                      ...settings,
                      footer: { ...settings.footer, locationCity: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-gray-700">Country</label>
                  <input
                    type="text"
                    value={settings.footer.locationCountry || "SAUDI ARABIA"}
                    onChange={(e) => setSettings({
                      ...settings,
                      footer: { ...settings.footer, locationCountry: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Bar & Copyright */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <FileText size={18} className="text-[#E62E2D]" />
                Bottom Bar & Copyright Notice
              </h3>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-gray-700">Copyright Text Notice</label>
                <input
                  type="text"
                  value={settings.footer.copyrightText || "Best International Contracting Company, All rights reserved."}
                  onChange={(e) => setSettings({
                    ...settings,
                    footer: { ...settings.footer, copyrightText: e.target.value }
                  })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-gray-700">Bottom CTA Text</label>
                  <input
                    type="text"
                    value={settings.footer.bottomCtaText || "GET A QUOTE"}
                    onChange={(e) => setSettings({
                      ...settings,
                      footer: { ...settings.footer, bottomCtaText: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-gray-700">Bottom CTA URL</label>
                  <input
                    type="text"
                    value={settings.footer.bottomCtaUrl || "/contact-us"}
                    onChange={(e) => setSettings({
                      ...settings,
                      footer: { ...settings.footer, bottomCtaUrl: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 4: SOCIAL MEDIA LINKS
          ========================================================================= */}
      {activeTab === "socials" && (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6 max-w-4xl">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Share2 size={20} className="text-[#E62E2D]" />
              Social Media Channels
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Links configured here are used across both the header top bar and the website footer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-700">LinkedIn Profile URL</label>
              <input
                type="url"
                value={settings.socials?.linkedin || ""}
                onChange={(e) => setSettings({
                  ...settings,
                  socials: { ...(settings.socials || {}), linkedin: e.target.value }
                })}
                placeholder="https://www.linkedin.com/company/..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E62E2D]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-700">Twitter / X Profile URL</label>
              <input
                type="url"
                value={settings.socials?.twitter || ""}
                onChange={(e) => setSettings({
                  ...settings,
                  socials: { ...(settings.socials || {}), twitter: e.target.value }
                })}
                placeholder="https://twitter.com/..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E62E2D]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-700">Facebook Profile URL</label>
              <input
                type="url"
                value={settings.socials?.facebook || ""}
                onChange={(e) => setSettings({
                  ...settings,
                  socials: { ...(settings.socials || {}), facebook: e.target.value }
                })}
                placeholder="https://facebook.com/..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E62E2D]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-700">Instagram Profile URL</label>
              <input
                type="url"
                value={settings.socials?.instagram || ""}
                onChange={(e) => setSettings({
                  ...settings,
                  socials: { ...(settings.socials || {}), instagram: e.target.value }
                })}
                placeholder="https://instagram.com/..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E62E2D]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Save Action Bar */}
      <div className="fixed bottom-6 right-6 z-40 bg-[#111] text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-4">
        <span className="text-xs text-gray-400 font-medium hidden sm:inline-block">
          Unsaved changes will update globally upon saving.
        </span>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#E62E2D] hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {/* Media Library Modal */}
      <MediaLibraryModal
        isOpen={isMediaModalOpen}
        onClose={() => {
          setIsMediaModalOpen(false);
          setMediaTargetField(null);
        }}
        onSelectImage={handleMediaSelect}
      />

    </div>
  );
}
