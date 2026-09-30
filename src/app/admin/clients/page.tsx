"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Copy,
  Save,
  RefreshCw,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Image as ImageIcon,
  Building2,
  Search,
  LayoutGrid,
  List,
  X,
  ShieldCheck,
  Tag
} from "lucide-react";
import MediaLibraryModal from "@/components/MediaLibraryModal";
import { renderClientLogo } from "@/components/ClientsListingClient";

export interface ClientItem {
  id: string;
  name: string;
  arabic?: string;
  type: string;
  logo?: string;
}

const PRESET_LOGO_TYPES = [
  { value: "aramco", label: "Saudi Aramco (أرامكو السعودية)" },
  { value: "sabic", label: "SABIC (سابك)" },
  { value: "neom", label: "NEOM (نيوم)" },
  { value: "maaden", label: "MA'ADEN (معادن)" },
  { value: "royal_commission", label: "Royal Commission (الهيئة الملكية)" },
  { value: "sec", label: "Saudi Electricity Company (الشركة السعودية للكهرباء)" },
  { value: "marafiq", label: "MARAFIQ (مرافق)" },
  { value: "tasnee", label: "TASNEE (التصنيع)" },
  { value: "petro_rabigh", label: "PETRO RABIGH (بترو رابغ)" },
  { value: "swcc", label: "SWCC (المؤسسة العامة لتحلية المياه المالحة)" },
  { value: "nwc", label: "NWC (شركة المياه الوطنية)" },
  { value: "riyadh_metro", label: "RIYADH METRO (قطار الرياض)" },
  { value: "red_sea_global", label: "Red Sea Global (البحر الأحمر الدولية)" },
  { value: "qiddiya", label: "Qiddiya (القدية)" },
  { value: "abb", label: "ABB" },
  { value: "schneider", label: "Schneider Electric" },
  { value: "hyundai", label: "HYUNDAI" },
  { value: "doosan", label: "DOOSAN" },
  { value: "custom", label: "Custom Uploaded Logo / Image" }
];

export default function AdminClientsPage() {
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewLayout, setViewLayout] = useState<"grid" | "table">("grid");

  // Media Modal state
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [targetClientIndex, setTargetClientIndex] = useState<number | null>(null);

  // Add Client Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newClient, setNewClient] = useState<{
    name: string;
    arabic: string;
    type: string;
    logo?: string;
  }>({
    name: "",
    arabic: "",
    type: "aramco",
    logo: ""
  });

  // Fetch initial clients
  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/clients");
      if (res.ok) {
        const data = await res.json();
        setClients(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load clients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Save changes to API
  const handleSaveAll = async () => {
    try {
      setSaving(true);
      setSaveSuccess(false);

      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clients)
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3500);
      } else {
        alert("Failed to save clients. Please try again.");
      }
    } catch (err) {
      console.error("Error saving clients:", err);
      alert("Error saving clients.");
    } finally {
      setSaving(false);
    }
  };

  // Reorder clients
  const moveClient = (index: number, direction: "up" | "down") => {
    const newIdx = direction === "up" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= clients.length) return;

    const list = [...clients];
    const [moved] = list.splice(index, 1);
    list.splice(newIdx, 0, moved);
    setClients(list);
  };

  // Update field
  const updateClientField = (index: number, field: keyof ClientItem, value: any) => {
    setClients((prev) => {
      const list = [...prev];
      list[index] = { ...list[index], [field]: value };
      return list;
    });
  };

  // Duplicate
  const duplicateClient = (index: number) => {
    const orig = clients[index];
    const copy: ClientItem = {
      ...orig,
      id: `c-${Date.now().toString().slice(-4)}`,
      name: `${orig.name} (Copy)`
    };
    const list = [...clients];
    list.splice(index + 1, 0, copy);
    setClients(list);
  };

  // Delete
  const deleteClient = (index: number) => {
    if (confirm(`Are you sure you want to delete "${clients[index].name}"?`)) {
      setClients((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Add new
  const handleAddNewClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name.trim()) return;

    const created: ClientItem = {
      id: `c-${Date.now().toString().slice(-4)}`,
      name: newClient.name.trim(),
      arabic: newClient.arabic.trim(),
      type: newClient.type || "aramco",
      logo: newClient.logo || ""
    };

    setClients((prev) => [...prev, created]);
    setIsAddModalOpen(false);
    setNewClient({
      name: "",
      arabic: "",
      type: "aramco",
      logo: ""
    });
  };

  // Filter clients for search
  const filteredClients = clients.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.arabic && c.arabic.toLowerCase().includes(q)) ||
      c.type.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-red-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Loading Client Partners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1650px] mx-auto space-y-8 font-sans">
      
      {/* ── 1. EXECUTIVE HEADER BANNER ────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B0F17] via-[#111625] to-[#0A0D14] p-6 md:p-8 text-white border border-slate-800 shadow-2xl">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-16 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/10 text-xs font-semibold text-red-400 backdrop-blur-md shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span>BIC Strategic Client Partners CMS</span>
              <span className="text-white/30">|</span>
              <span className="text-slate-300 font-mono text-[11px]">Real-Time Store Sync</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Client Partners &amp; Industry Brands
            </h1>

            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Manage enterprise client logos, brand vector presets, Arabic titles, and live ordering showcased on the public clients directory.
            </p>

            {/* Quick Metrics Strip */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs backdrop-blur-sm">
                <Users className="w-3.5 h-3.5 text-red-400" />
                <span className="text-slate-400">Total Brands:</span>
                <strong className="text-white font-bold">{clients.length}</strong>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs backdrop-blur-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-400">Status:</span>
                <strong className="text-emerald-400 font-bold">18-Logo Grid Active</strong>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs backdrop-blur-sm">
                <Tag className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-slate-400">Display Layout:</span>
                <strong className="text-amber-300 font-bold">6 Columns × 3 Rows</strong>
              </div>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/clients"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/15 rounded-xl transition-all duration-200 text-xs md:text-sm font-semibold shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              <ExternalLink className="w-4 h-4 text-slate-300" />
              <span>Live Page</span>
            </Link>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/15 rounded-xl transition-all duration-200 text-xs md:text-sm font-bold shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-4 h-4 text-red-400" />
              <span>Add Partner</span>
            </button>

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
          <span>Client Partners saved successfully! Live website cache updated.</span>
        </div>
      )}

      {/* ── 2. SEARCH & CONTROLS ROW ──────────────────────────────── */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search partner by name or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-semibold pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition"
          />
        </div>

        {/* Layout & Total Count */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-semibold">
            Showing <strong>{filteredClients.length}</strong> of <strong>{clients.length}</strong> brands
          </span>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewLayout("grid")}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewLayout === "grid" ? "bg-white text-red-600 shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
              title="Grid View"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewLayout("table")}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewLayout === "table" ? "bg-white text-red-600 shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
              title="Table View"
            >
              <List size={15} />
            </button>
          </div>
        </div>

      </div>

      {/* ── 3. CLIENT CARDS GRID / TABLE ───────────────────────────── */}
      {filteredClients.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Building2 size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-800">No client brands found</h3>
          <p className="text-xs text-slate-500 mt-1">No brands match your search query.</p>
        </div>
      ) : viewLayout === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredClients.map((client) => {
            const originalIndex = clients.findIndex((c) => c.id === client.id);
            if (originalIndex === -1) return null;

            return (
              <div
                key={client.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Logo Live Preview Frame */}
                <div className="p-5 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100 relative">
                  <div className="h-24 w-full bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-center p-3">
                    {renderClientLogo(client.type, client.name, client.arabic, client.logo)}
                  </div>

                  {/* Position Pill */}
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-mono font-bold shadow-xs">
                    #{originalIndex + 1}
                  </span>
                </div>

                {/* Card Inputs */}
                <div className="p-5 flex-1 space-y-3.5">
                  {/* Brand Name */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Brand / Company Name
                    </label>
                    <input
                      type="text"
                      value={client.name}
                      onChange={(e) => updateClientField(originalIndex, "name", e.target.value)}
                      placeholder="e.g. Saudi Aramco"
                      className="w-full text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:bg-white focus:border-red-500 outline-none transition"
                    />
                  </div>

                  {/* Arabic Name */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Arabic Title (Optional)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={client.arabic || ""}
                      onChange={(e) => updateClientField(originalIndex, "arabic", e.target.value)}
                      placeholder="e.g. أرامكو السعودية"
                      className="w-full text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:bg-white focus:border-red-500 outline-none transition"
                    />
                  </div>

                  {/* Logo Type Selector */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Vector Logo Preset / Format
                    </label>
                    <select
                      value={client.logo ? "custom" : client.type}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "custom") {
                          setTargetClientIndex(originalIndex);
                          setMediaModalOpen(true);
                        } else {
                          updateClientField(originalIndex, "type", val);
                          updateClientField(originalIndex, "logo", "");
                        }
                      }}
                      className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:bg-white focus:border-red-500 outline-none cursor-pointer transition"
                    >
                      {PRESET_LOGO_TYPES.map((pt) => (
                        <option key={pt.value} value={pt.value}>
                          {pt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Custom Logo Upload Helper Button */}
                  <div className="pt-1 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setTargetClientIndex(originalIndex);
                        setMediaModalOpen(true);
                      }}
                      className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                    >
                      <ImageIcon size={13} />
                      <span>{client.logo ? "Change Custom Image" : "Upload Custom Logo"}</span>
                    </button>

                    {client.logo && (
                      <button
                        type="button"
                        onClick={() => updateClientField(originalIndex, "logo", "")}
                        className="text-[10px] font-semibold text-slate-400 hover:text-red-500"
                      >
                        Reset to Vector
                      </button>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400">
                    ID: {client.id}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => moveClient(originalIndex, "up")}
                      disabled={originalIndex === 0}
                      title="Move Left / Up"
                      className="p-1.5 rounded-lg bg-white hover:bg-slate-200 text-slate-600 border border-slate-200 disabled:opacity-30 transition cursor-pointer"
                    >
                      <ArrowUp size={13} />
                    </button>

                    <button
                      onClick={() => moveClient(originalIndex, "down")}
                      disabled={originalIndex === clients.length - 1}
                      title="Move Right / Down"
                      className="p-1.5 rounded-lg bg-white hover:bg-slate-200 text-slate-600 border border-slate-200 disabled:opacity-30 transition cursor-pointer"
                    >
                      <ArrowDown size={13} />
                    </button>

                    <button
                      onClick={() => duplicateClient(originalIndex)}
                      title="Duplicate Brand"
                      className="p-1.5 rounded-lg bg-white hover:bg-slate-200 text-slate-600 border border-slate-200 transition cursor-pointer"
                    >
                      <Copy size={13} />
                    </button>

                    <button
                      onClick={() => deleteClient(originalIndex)}
                      title="Delete Brand"
                      className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filteredClients.map((client) => {
              const originalIndex = clients.findIndex((c) => c.id === client.id);
              if (originalIndex === -1) return null;

              return (
                <div
                  key={client.id}
                  className="p-4 hover:bg-slate-50/80 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-xs font-mono font-bold text-slate-400 w-6">
                      #{originalIndex + 1}
                    </span>

                    <div className="w-24 h-14 bg-white rounded-xl border border-slate-200 flex items-center justify-center p-2 shrink-0">
                      {renderClientLogo(client.type, client.name, client.arabic, client.logo)}
                    </div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={client.name}
                        onChange={(e) => updateClientField(originalIndex, "name", e.target.value)}
                        className="font-bold text-xs text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-red-500 outline-none"
                      />
                      <input
                        type="text"
                        dir="rtl"
                        value={client.arabic || ""}
                        onChange={(e) => updateClientField(originalIndex, "arabic", e.target.value)}
                        placeholder="Arabic title"
                        className="text-xs text-slate-600 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-red-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end md:self-center">
                    <select
                      value={client.type}
                      onChange={(e) => updateClientField(originalIndex, "type", e.target.value)}
                      className="text-xs font-semibold bg-slate-100 rounded-lg px-2 py-1 border border-slate-200 outline-none"
                    >
                      {PRESET_LOGO_TYPES.map((pt) => (
                        <option key={pt.value} value={pt.value}>
                          {pt.label}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => moveClient(originalIndex, "up")}
                      disabled={originalIndex === 0}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg disabled:opacity-30"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      onClick={() => moveClient(originalIndex, "down")}
                      disabled={originalIndex === clients.length - 1}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg disabled:opacity-30"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      onClick={() => deleteClient(originalIndex)}
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 4. ADD CLIENT MODAL ─────────────────────────────────────── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Plus size={16} className="text-red-400" />
                <span>Add Client Partner</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddNewClient} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Company / Brand Name *</label>
                <input
                  type="text"
                  required
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  placeholder="e.g. Petro Rabigh"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-red-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Arabic Title (Optional)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={newClient.arabic}
                  onChange={(e) => setNewClient({ ...newClient, arabic: e.target.value })}
                  placeholder="e.g. بترو رابغ"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-red-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Logo Type / Preset</label>
                <select
                  value={newClient.type}
                  onChange={(e) => setNewClient({ ...newClient, type: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 outline-none cursor-pointer"
                >
                  {PRESET_LOGO_TYPES.map((pt) => (
                    <option key={pt.value} value={pt.value}>
                      {pt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Logo URL / Media Picker */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-700 font-bold">Custom Logo Image URL</label>
                  <button
                    type="button"
                    onClick={() => {
                      setTargetClientIndex(-1);
                      setMediaModalOpen(true);
                    }}
                    className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                  >
                    <ImageIcon size={12} />
                    <span>Choose from Media Library</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={newClient.logo || ""}
                  onChange={(e) => setNewClient({ ...newClient, logo: e.target.value })}
                  placeholder="https://... or /uploads/..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-red-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Add Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 5. MEDIA LIBRARY PICKER MODAL ─────────────────────────── */}
      <MediaLibraryModal
        isOpen={mediaModalOpen}
        onClose={() => {
          setMediaModalOpen(false);
          setTargetClientIndex(null);
        }}
        onSelectImage={(url) => {
          if (targetClientIndex === -1) {
            setNewClient((prev) => ({ ...prev, logo: url, type: "custom" }));
          } else if (targetClientIndex !== null && targetClientIndex >= 0) {
            updateClientField(targetClientIndex, "logo", url);
            updateClientField(targetClientIndex, "type", "custom");
          }
          setMediaModalOpen(false);
          setTargetClientIndex(null);
        }}
        currentImageUrl={
          targetClientIndex === -1
            ? newClient.logo
            : targetClientIndex !== null && clients[targetClientIndex]
            ? clients[targetClientIndex].logo
            : undefined
        }
      />

    </div>
  );
}
