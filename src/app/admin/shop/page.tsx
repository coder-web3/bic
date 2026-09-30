"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Save,
  Plus,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Star,
  Check,
  RefreshCw,
  Layers,
  ArrowUp,
  ArrowDown,
  Copy,
  SlidersHorizontal,
  FolderPlus,
  X,
  Edit3,
  Sparkles,
  ShoppingCart,
  Tag,
  Package,
  CheckCircle,
  Clock,
  Eye,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import MediaLibraryModal from "@/components/MediaLibraryModal";

export interface EquipmentProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  availability: "In Stock" | "On Request";
  featured?: boolean;
  image: string;
  shortDesc?: string;
}

export interface ShopCategory {
  id: string;
  name: string;
  slug?: string;
  icon?: string;
}

const DEFAULT_CATEGORIES: ShopCategory[] = [
  { id: "cat-01", name: "Earth Moving Equipment", icon: "truck" },
  { id: "cat-02", name: "Lifting Equipment", icon: "crane" },
  { id: "cat-03", name: "Power & Generators", icon: "zap" },
  { id: "cat-04", name: "Compaction Equipment", icon: "roller" },
  { id: "cat-05", name: "Concrete Equipment", icon: "mixer" },
  { id: "cat-06", name: "Material Handling", icon: "forklift" },
  { id: "cat-07", name: "Access Equipment", icon: "lift" },
  { id: "cat-08", name: "Other Equipment", icon: "tool" }
];

const ICON_OPTIONS = [
  { label: "Earth Moving (Truck / Excavator)", value: "truck" },
  { label: "Lifting (Crane / Rigging)", value: "crane" },
  { label: "Power & Energy (Generator / Lightning)", value: "zap" },
  { label: "Compaction (Road Roller)", value: "roller" },
  { label: "Concrete (Mixer / Pouring)", value: "mixer" },
  { label: "Material Handling (Forklift / Pallet)", value: "forklift" },
  { label: "Access (Scissor Lift / Ladder)", value: "lift" },
  { label: "Tools & Hardware (Wrench / Gear)", value: "tool" }
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminShopPage() {
  const [products, setProducts] = useState<EquipmentProduct[]>([]);
  const [categories, setCategories] = useState<ShopCategory[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("All");
  const [onlyFeatured, setOnlyFeatured] = useState<boolean>(false);
  const [viewLayout, setViewLayout] = useState<"cards" | "compact">("cards");

  // Pagination
  const [adminPage, setAdminPage] = useState<number>(1);
  const [adminPageSize, setAdminPageSize] = useState<number>(9);

  // Media Modal state
  const [mediaModalOpen, setMediaModalOpen] = useState<boolean>(false);
  const [targetProductIndex, setTargetProductIndex] = useState<number | null>(null);

  // Reset page on filter changes
  useEffect(() => {
    setAdminPage(1);
  }, [selectedCategory, searchQuery, availabilityFilter, onlyFeatured]);

  // Quick Add Product Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newProduct, setNewProduct] = useState<Partial<EquipmentProduct>>({
    name: "",
    category: "",
    availability: "In Stock",
    featured: false,
    image: "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=800&auto=format&fit=crop",
    shortDesc: ""
  });

  // Category Manager Modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [newCategoryIcon, setNewCategoryIcon] = useState<string>("truck");
  const [categorySaving, setCategorySaving] = useState<boolean>(false);
  const [categorySuccess, setCategorySuccess] = useState<boolean>(false);

  // Load data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/shop"),
        fetch("/api/shop/categories")
      ]);

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData || []);
      }

      if (catRes.ok) {
        const catData = await catRes.json();
        if (Array.isArray(catData) && catData.length > 0) {
          setCategories(catData);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Error connecting to shop API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Save changes
  const handleSaveAll = async () => {
    try {
      setSaving(true);
      setErrorMessage(null);
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/shop", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(products)
        }),
        fetch("/api/shop/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categories)
        })
      ]);

      if (prodRes.ok && catRes.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3500);
      } else {
        setErrorMessage("Failed to save changes.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Network error saving shop data.");
    } finally {
      setSaving(false);
    }
  };

  // Field change
  const updateProductField = (index: number, field: keyof EquipmentProduct, value: any) => {
    setProducts((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
        ...(field === "name" ? { slug: slugify(value) } : {})
      };
      return updated;
    });
  };

  // Reorder Products
  const moveProduct = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= products.length) return;
    setProducts((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIdx];
      updated[targetIdx] = temp;
      return updated;
    });
  };

  // Duplicate Product
  const duplicateProduct = (index: number) => {
    const item = products[index];
    const copy: EquipmentProduct = {
      ...item,
      id: `prod-${Date.now().toString().slice(-4)}`,
      name: `${item.name} (Copy)`,
      slug: slugify(`${item.name}-copy`),
      featured: false
    };
    setProducts((prev) => {
      const updated = [...prev];
      updated.splice(index + 1, 0, copy);
      return updated;
    });
  };

  // Delete Product
  const deleteProduct = (index: number) => {
    if (confirm(`Are you sure you want to delete "${products[index].name}"?`)) {
      setProducts((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Add new Product
  const handleAddNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name) return;

    const chosenCat = newProduct.category || categories[0]?.name || "Earth Moving Equipment";

    const created: EquipmentProduct = {
      id: `prod-${Date.now().toString().slice(-4)}`,
      name: newProduct.name,
      slug: slugify(newProduct.name),
      category: chosenCat,
      availability: (newProduct.availability as any) || "In Stock",
      featured: Boolean(newProduct.featured),
      image: newProduct.image || "/uploads/upload-1790414661695-Integrated_Contracting_Support.avif",
      shortDesc: newProduct.shortDesc || ""
    };

    setProducts((prev) => [created, ...prev]);
    setIsAddModalOpen(false);
    setNewProduct({
      name: "",
      category: categories[0]?.name || "Earth Moving Equipment",
      availability: "In Stock",
      featured: false,
      image: "/uploads/upload-1790414661695-Integrated_Contracting_Support.avif",
      shortDesc: ""
    });
  };

  // ── CATEGORY MANAGEMENT FUNCTIONS ──────────────────────────────
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;

    const exists = categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      alert("A category with this name already exists.");
      return;
    }

    const createdCat: ShopCategory = {
      id: `cat-${Date.now().toString().slice(-4)}`,
      name: trimmed,
      slug: slugify(trimmed),
      icon: newCategoryIcon
    };

    setCategories((prev) => [...prev, createdCat]);
    setNewCategoryName("");
    setCategorySuccess(true);
    setTimeout(() => setCategorySuccess(false), 2000);
  };

  const handleUpdateCategory = (catId: string, field: "name" | "icon", value: string) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === catId) {
          return {
            ...c,
            [field]: value,
            ...(field === "name" ? { slug: slugify(value) } : {})
          };
        }
        return c;
      })
    );
  };

  const moveCategory = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= categories.length) return;
    setCategories((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIdx];
      updated[targetIdx] = temp;
      return updated;
    });
  };

  const handleDeleteCategory = (cat: ShopCategory) => {
    const count = products.filter((p) => p.category?.toLowerCase() === cat.name.toLowerCase()).length;
    if (count > 0) {
      if (!confirm(`Warning: ${count} product(s) are currently assigned to "${cat.name}". Are you sure you want to delete this category?`)) {
        return;
      }
    } else {
      if (!confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
        return;
      }
    }

    setCategories((prev) => prev.filter((c) => c.id !== cat.id));
  };

  const handleSaveCategoriesDirectly = async () => {
    try {
      setCategorySaving(true);
      const res = await fetch("/api/shop/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categories)
      });
      if (res.ok) {
        setCategorySuccess(true);
        setTimeout(() => setCategorySuccess(false), 2500);
      }
    } catch (e) {
      alert("Failed to save categories.");
    } finally {
      setCategorySaving(false);
    }
  };

  // Filtered view
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
      const matchesAvail = availabilityFilter === "All" || p.availability === availabilityFilter;
      const matchesFeatured = !onlyFeatured || p.featured;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.shortDesc && p.shortDesc.toLowerCase().includes(q));

      return matchesCat && matchesAvail && matchesFeatured && matchesSearch;
    });
  }, [products, selectedCategory, availabilityFilter, onlyFeatured, searchQuery]);

  const totalInStock = products.filter((p) => p.availability === "In Stock").length;
  const totalOnRequest = products.filter((p) => p.availability === "On Request").length;
  const totalFeatured = products.filter((p) => p.featured).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-red-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Loading Shop &amp; Equipment Inventory...</p>
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
              <span>BIC Equipment &amp; Material Shop CMS</span>
              <span className="text-white/30">|</span>
              <span className="text-slate-300 font-mono text-[11px]">Real-Time Store Sync</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Shop &amp; Equipment Inventory Control
            </h1>

            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Create and manage equipment categories, inventory availability, technical specifications, and featured gear showcased on the live public shop.
            </p>

            {/* Quick Metrics Strip */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs backdrop-blur-sm">
                <Package className="w-3.5 h-3.5 text-red-400" />
                <span className="text-slate-400">Total Items:</span>
                <strong className="text-white font-bold">{products.length}</strong>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs backdrop-blur-sm">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-400">Categories:</span>
                <strong className="text-white font-bold">{categories.length}</strong>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs backdrop-blur-sm">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-400">In Stock:</span>
                <strong className="text-emerald-400 font-bold">{totalInStock}</strong>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs backdrop-blur-sm">
                <Star className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-slate-400">Featured:</span>
                <strong className="text-amber-300 font-bold">{totalFeatured}</strong>
              </div>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/shop"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/15 rounded-xl transition-all duration-200 text-xs md:text-sm font-semibold shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              <ExternalLink className="w-4 h-4 text-slate-300" />
              <span>Live Shop</span>
            </Link>

            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 rounded-xl transition-all duration-200 text-xs md:text-sm font-bold shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <FolderPlus className="w-4 h-4 text-amber-400" />
              <span>Categories ({categories.length})</span>
            </button>

            <button
              onClick={() => {
                setNewProduct((prev) => ({
                  ...prev,
                  category: categories[0]?.name || "Earth Moving Equipment"
                }));
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/15 rounded-xl transition-all duration-200 text-xs md:text-sm font-bold shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-4 h-4 text-red-400" />
              <span>Add Equipment</span>
            </button>

            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl transition-all duration-200 text-xs md:text-sm font-bold shadow-lg shadow-red-600/30 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving Live...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-300" />
                  <span>Saved Live!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save All Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── ALERTS & MESSAGES ─────────────────────────────────────── */}
      {saveSuccess && (
        <div className="p-4 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-900 flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold text-xs md:text-sm">
              Shop catalog and categories updated and revalidated live across Saudi Arabia!
            </span>
          </div>
          <button onClick={() => setSaveSuccess(false)} className="text-xs font-bold text-emerald-800 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl border bg-red-50 border-red-200 text-red-900 flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span className="font-semibold text-xs md:text-sm">{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-xs font-bold text-red-800 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* ── 2. FILTER & TOOLBAR CARD ──────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] p-5 space-y-4">
        
        {/* Top Search & Controls Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search equipment by name, category, or specifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Status Selector */}
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-red-500/20 cursor-pointer"
            >
              <option value="All">All Statuses ({products.length})</option>
              <option value="In Stock">In Stock ({totalInStock})</option>
              <option value="On Request">On Request ({totalOnRequest})</option>
            </select>

            {/* Featured Only Toggle */}
            <button
              onClick={() => setOnlyFeatured(!onlyFeatured)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                onlyFeatured
                  ? "bg-amber-50 text-amber-700 border-amber-200 shadow-xs"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Star size={13} className={onlyFeatured ? "fill-amber-500 text-amber-500" : "text-slate-400"} />
              <span>Featured Only ({totalFeatured})</span>
            </button>

            {/* Layout Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewLayout("cards")}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewLayout === "cards" ? "bg-white text-red-600 shadow-xs" : "text-slate-500 hover:text-slate-900"
                }`}
                title="Expanded Cards View"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewLayout("compact")}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewLayout === "compact" ? "bg-white text-red-600 shadow-xs" : "text-slate-500 hover:text-slate-900"
                }`}
                title="Compact Table View"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pill Tabs Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none border-t border-slate-100">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              selectedCategory === "All"
                ? "bg-red-600 text-white shadow-xs shadow-red-600/30"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Categories ({products.length})
          </button>

          {categories.map((cat) => {
            const count = products.filter(
              (p) => p.category?.toLowerCase() === cat.name.toLowerCase()
            ).length;

            const isActive = selectedCategory === cat.name;

            return (
              <button
                key={cat.id || cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "bg-red-600 text-white shadow-xs shadow-red-600/30"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? "bg-white/25 text-white" : "bg-slate-200 text-slate-500"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* ── 3. PRODUCT CATALOG GRID / LIST ────────────────────────── */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Package size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-800">No equipment items found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No equipment matches the active filter or search criteria.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setAvailabilityFilter("All");
              setOnlyFeatured(false);
              setSearchQuery("");
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {viewLayout === "cards" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts
                .slice((adminPage - 1) * adminPageSize, adminPage * adminPageSize)
                .map((prod) => {
                  const originalIndex = products.findIndex((p) => p.id === prod.id);
                  if (originalIndex === -1) return null;

                  return (
                    <div
                      key={prod.id}
                      className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                    >
                      {/* Card Top: Image & Status Badges */}
                      <div className="bg-slate-100 border-b border-slate-100">
                        <div className="relative h-48 w-full bg-slate-100 overflow-hidden flex items-center justify-center group/img">
                          <img
                            src={prod.image || "/uploads/upload-1790414661695-Integrated_Contracting_Support.avif"}
                            alt={prod.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "/uploads/upload-1790414661695-Integrated_Contracting_Support.avif";
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />

                          {/* Featured Pill */}
                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 z-10">
                            <button
                              type="button"
                              onClick={() => updateProductField(originalIndex, "featured", !prod.featured)}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wide uppercase transition cursor-pointer flex items-center gap-1 shadow-xs ${
                                prod.featured
                                  ? "bg-red-600 text-white"
                                  : "bg-white/90 text-slate-500 hover:text-slate-800 border border-slate-200"
                              }`}
                            >
                              <Star size={10} className={prod.featured ? "fill-white" : ""} />
                              <span>{prod.featured ? "Featured" : "Standard"}</span>
                            </button>
                          </div>

                          {/* Change Image Button on Hover */}
                          <button
                            onClick={() => {
                              setTargetProductIndex(originalIndex);
                              setMediaModalOpen(true);
                            }}
                            className="absolute inset-0 bg-slate-900/75 opacity-0 group-hover/img:opacity-100 flex flex-col items-center justify-center text-white text-xs font-bold transition-opacity duration-200 cursor-pointer backdrop-blur-xs z-10"
                          >
                            <ImageIcon size={20} className="text-red-400 mb-1" />
                            <span>Change Image (Media Library)</span>
                          </button>

                          {/* Stock Status Badge */}
                          <div className="absolute top-2.5 right-2.5 z-10">
                            <select
                              value={prod.availability}
                              onChange={(e) => updateProductField(originalIndex, "availability", e.target.value as any)}
                              className={`text-[10px] font-extrabold uppercase tracking-wider rounded-md px-2 py-0.5 border outline-none cursor-pointer shadow-xs ${
                                prod.availability === "In Stock"
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                  : "bg-amber-50 border-amber-200 text-amber-700"
                              }`}
                            >
                              <option value="In Stock">In Stock</option>
                              <option value="On Request">On Request</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Card Body: Info & Inputs */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          {/* Name */}
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              Equipment Title
                            </label>
                            <input
                              type="text"
                              value={prod.name}
                              onChange={(e) => updateProductField(originalIndex, "name", e.target.value)}
                              placeholder="e.g. Hydraulic Excavator 20 Ton"
                              className="w-full text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition"
                            />
                          </div>

                          {/* Category Dropdown */}
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              Category
                            </label>
                            <select
                              value={prod.category}
                              onChange={(e) => updateProductField(originalIndex, "category", e.target.value)}
                              className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:bg-white focus:border-red-500 outline-none cursor-pointer transition"
                            >
                              {categories.map((cat) => (
                                <option key={cat.id || cat.name} value={cat.name}>
                                  {cat.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Short Description */}
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              Specifications &amp; Overview
                            </label>
                            <textarea
                              rows={2}
                              value={prod.shortDesc || ""}
                              onChange={(e) => updateProductField(originalIndex, "shortDesc", e.target.value)}
                              placeholder="Key tonnage, boom length, engine specs or certifications..."
                              className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:bg-white focus:border-red-500 outline-none transition"
                            />
                          </div>
                        </div>

                        {/* Card Bottom: Management Actions */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] font-mono text-slate-400 font-semibold">
                            #{originalIndex + 1} · {prod.id}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => moveProduct(originalIndex, "up")}
                              disabled={originalIndex === 0}
                              title="Move Up"
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 transition cursor-pointer"
                            >
                              <ArrowUp size={13} />
                            </button>

                            <button
                              onClick={() => moveProduct(originalIndex, "down")}
                              disabled={originalIndex === products.length - 1}
                              title="Move Down"
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 transition cursor-pointer"
                            >
                              <ArrowDown size={13} />
                            </button>

                            <button
                              onClick={() => duplicateProduct(originalIndex)}
                              title="Duplicate Equipment"
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                            >
                              <Copy size={13} />
                            </button>

                            <button
                              onClick={() => deleteProduct(originalIndex)}
                              title="Delete Equipment"
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            /* Compact List View */
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="divide-y divide-slate-100">
                {filteredProducts
                  .slice((adminPage - 1) * adminPageSize, adminPage * adminPageSize)
                  .map((prod) => {
                    const originalIndex = products.findIndex((p) => p.id === prod.id);
                    if (originalIndex === -1) return null;

                    return (
                      <div
                        key={prod.id}
                        className="p-4 hover:bg-slate-50/80 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="relative w-14 h-14 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                            <img
                              src={prod.image || "/uploads/upload-1790414661695-Integrated_Contracting_Support.avif"}
                              alt={prod.name}
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "/uploads/upload-1790414661695-Integrated_Contracting_Support.avif";
                              }}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={prod.name}
                                onChange={(e) => updateProductField(originalIndex, "name", e.target.value)}
                                className="font-bold text-sm text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-red-500 outline-none w-full max-w-md"
                              />
                              {prod.featured && (
                                <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.2 rounded-md">
                                  Featured
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-3 text-xs text-slate-500">
                              <select
                                value={prod.category}
                                onChange={(e) => updateProductField(originalIndex, "category", e.target.value)}
                                className="text-xs font-semibold text-slate-700 bg-transparent border border-slate-200 rounded px-2 py-0.5"
                              >
                                {categories.map((cat) => (
                                  <option key={cat.id || cat.name} value={cat.name}>
                                    {cat.name}
                                  </option>
                                ))}
                              </select>

                              <select
                                value={prod.availability}
                                onChange={(e) => updateProductField(originalIndex, "availability", e.target.value as any)}
                                className={`text-xs font-bold px-2 py-0.5 rounded border ${
                                  prod.availability === "In Stock" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
                                }`}
                              >
                                <option value="In Stock">In Stock</option>
                                <option value="On Request">On Request</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 self-end md:self-center">
                          <button
                            onClick={() => {
                              setTargetProductIndex(originalIndex);
                              setMediaModalOpen(true);
                            }}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1"
                          >
                            <ImageIcon size={13} />
                            <span>Image</span>
                          </button>

                          <button
                            onClick={() => duplicateProduct(originalIndex)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition"
                            title="Duplicate"
                          >
                            <Copy size={14} />
                          </button>

                          <button
                            onClick={() => deleteProduct(originalIndex)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ── ADMIN PAGINATION BAR ───────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
              <span>
                Showing <strong className="text-slate-900">{filteredProducts.length > 0 ? (adminPage - 1) * adminPageSize + 1 : 0}</strong>–<strong className="text-slate-900">{Math.min(adminPage * adminPageSize, filteredProducts.length)}</strong> of <strong className="text-slate-900">{filteredProducts.length}</strong> items
              </span>

              <span className="text-slate-300">|</span>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 text-[11px]">Per Page:</span>
                <select
                  value={adminPageSize}
                  onChange={(e) => {
                    setAdminPageSize(Number(e.target.value));
                    setAdminPage(1);
                  }}
                  className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg px-2 py-1 outline-none cursor-pointer"
                >
                  <option value={6}>6</option>
                  <option value={9}>9</option>
                  <option value={18}>18</option>
                  <option value={36}>36</option>
                </select>
              </div>
            </div>

            {Math.ceil(filteredProducts.length / adminPageSize) > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setAdminPage((prev) => Math.max(prev - 1, 1))}
                  disabled={adminPage === 1}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <ChevronLeft size={14} />
                  <span>Prev</span>
                </button>

                {Array.from({ length: Math.ceil(filteredProducts.length / adminPageSize) }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setAdminPage(pageNum)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs ${
                      adminPage === pageNum
                        ? "bg-red-600 text-white shadow-xs shadow-red-600/30"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => setAdminPage((prev) => Math.min(prev + 1, Math.ceil(filteredProducts.length / adminPageSize)))}
                  disabled={adminPage === Math.ceil(filteredProducts.length / adminPageSize)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <span>Next</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 4. CATEGORY MANAGEMENT MODAL ──────────────────────────── */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <FolderPlus className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold">Manage Shop Categories</h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Add, edit, reorder, or delete category tabs shown on the public Shop sidebar.
                </p>
              </div>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Creator Box */}
              <form onSubmit={handleCreateCategory} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Create New Category
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      required
                      placeholder="Category Name (e.g. Scaffolding &amp; Rigging)"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <select
                      value={newCategoryIcon}
                      onChange={(e) => setNewCategoryIcon(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-xs text-slate-800 outline-none"
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Plus size={14} />
                  <span>Add Category</span>
                </button>
              </form>

              {/* Category Items List */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                  Active Categories ({categories.length})
                </span>

                {categories.map((cat, catIdx) => {
                  const prodCount = products.filter(
                    (p) => p.category?.toLowerCase() === cat.name.toLowerCase()
                  ).length;

                  return (
                    <div
                      key={cat.id || catIdx}
                      className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
                        <span className="text-xs font-mono font-bold text-slate-400 w-6">
                          #{catIdx + 1}
                        </span>

                        <input
                          type="text"
                          value={cat.name}
                          onChange={(e) => handleUpdateCategory(cat.id, "name", e.target.value)}
                          className="text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 flex-1 focus:bg-white focus:border-red-500 outline-none"
                        />

                        <select
                          value={cat.icon || "truck"}
                          onChange={(e) => handleUpdateCategory(cat.id, "icon", e.target.value)}
                          className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2 py-1.5 outline-none"
                        >
                          {ICON_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                          {prodCount} items
                        </span>

                        <button
                          onClick={() => moveCategory(catIdx, "up")}
                          disabled={catIdx === 0}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30"
                          title="Move Up"
                        >
                          <ArrowUp size={13} />
                        </button>

                        <button
                          onClick={() => moveCategory(catIdx, "down")}
                          disabled={catIdx === categories.length - 1}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30"
                          title="Move Down"
                        >
                          <ArrowDown size={13} />
                        </button>

                        <button
                          onClick={() => handleDeleteCategory(cat)}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                          title="Delete Category"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <div>
                {categorySuccess && (
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 size={14} />
                    <span>Categories Saved &amp; Synced!</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold"
                >
                  Done
                </button>
                <button
                  onClick={handleSaveCategoriesDirectly}
                  disabled={categorySaving}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  {categorySaving ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <Save size={14} />
                  )}
                  <span>Save Categories Live</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── 5. ADD EQUIPMENT MODAL ─────────────────────────────────── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Plus size={16} className="text-red-400" />
                <span>Add New Shop Equipment</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddNewProduct} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Equipment Name *</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. Telescopic Boom Lift 28m"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category *</label>
                  <select
                    value={newProduct.category || categories[0]?.name}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 outline-none cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id || cat.name} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Availability *</label>
                  <select
                    value={newProduct.availability}
                    onChange={(e) => setNewProduct({ ...newProduct, availability: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 outline-none cursor-pointer"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="On Request">On Request</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-700 font-bold">Equipment Image</label>
                  <button
                    type="button"
                    onClick={() => {
                      setTargetProductIndex(-1);
                      setMediaModalOpen(true);
                    }}
                    className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                  >
                    <ImageIcon size={12} />
                    <span>Choose from Media Library</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    placeholder="https://... or /uploads/..."
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-red-500"
                  />
                  {newProduct.image && (
                    <div className="w-12 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                      <img
                        src={newProduct.image}
                        alt="Preview"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/uploads/upload-1790414661695-Integrated_Contracting_Support.avif";
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <p className="text-[10.5px] text-slate-400 mt-1">
                  Recommended size: <strong>800 × 600 px</strong> (4:3 ratio) or <strong>800 × 500 px</strong>. Formats: WebP, PNG, JPG (&lt; 500 KB).
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Short Specifications</label>
                <textarea
                  rows={2}
                  value={newProduct.shortDesc}
                  onChange={(e) => setNewProduct({ ...newProduct, shortDesc: e.target.value })}
                  placeholder="Capacity, engine, boom length, or KSA standard approvals..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={newProduct.featured}
                  onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })}
                  className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                />
                <label htmlFor="featured-check" className="text-slate-800 font-bold cursor-pointer">
                  Mark as Featured on Shop Page
                </label>
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
                  Add Equipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 6. MEDIA LIBRARY PICKER MODAL ─────────────────────────── */}
      <MediaLibraryModal
        isOpen={mediaModalOpen}
        onClose={() => {
          setMediaModalOpen(false);
          setTargetProductIndex(null);
        }}
        onSelectImage={(url) => {
          if (targetProductIndex === -1) {
            setNewProduct((prev) => ({ ...prev, image: url }));
          } else if (targetProductIndex !== null && targetProductIndex >= 0) {
            updateProductField(targetProductIndex, "image", url);
          }
          setMediaModalOpen(false);
          setTargetProductIndex(null);
        }}
        currentImageUrl={
          targetProductIndex === -1
            ? newProduct.image
            : targetProductIndex !== null && products[targetProductIndex]
            ? products[targetProductIndex].image
            : undefined
        }
      />

    </div>
  );
}
