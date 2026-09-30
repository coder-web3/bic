"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Check,
  X,
  Send,
  CheckCircle2,
  Trash2,
  PhoneCall,
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Sparkles,
  Plus,
  Minus,
  MessageSquare,
  Truck,
  Zap,
  RotateCcw,
  FileSpreadsheet,
  AlertCircle,
  Eye
} from "lucide-react";

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
  count?: number;
}

export function renderCategoryIcon(iconKey?: string, name?: string) {
  const key = (iconKey || name || "").toLowerCase();

  if (key.includes("earth") || key.includes("truck") || key.includes("excavat")) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 17h20v4H2z" />
        <path d="m14 17-3-7H4l-2 7" />
        <path d="M14 10h7l2 7" />
        <circle cx="6" cy="17" r="2" />
        <circle cx="18" cy="17" r="2" />
      </svg>
    );
  }
  if (key.includes("lift") || key.includes("crane") || key.includes("rigg")) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v8" />
        <path d="M6 10h12" />
        <path d="m9 10-3 10h12l-3-10" />
        <circle cx="12" cy="14" r="2" />
      </svg>
    );
  }
  if (key.includes("power") || key.includes("gen") || key.includes("zap") || key.includes("electr")) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <path d="m11 10-2 4h6l-2 4" />
        <circle cx="6" cy="12" r="1" />
        <circle cx="18" cy="12" r="1" />
      </svg>
    );
  }
  if (key.includes("compact") || key.includes("roller")) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="16" r="4" />
        <circle cx="18" cy="16" r="3" />
        <path d="M6 12V8h8l4 8" />
        <path d="M10 8v4" />
      </svg>
    );
  }
  if (key.includes("concrete") || key.includes("mix")) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m14 7 3 3-9 9H5v-3l9-9z" />
        <path d="M19 5a2 2 0 0 0-2-2l-3 3 4 4 3-3a2 2 0 0 0-2-2z" />
      </svg>
    );
  }
  if (key.includes("material") || key.includes("forklift") || key.includes("handl")) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 18V6h4v12" />
        <path d="M9 14h5l4 4H5" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
      </svg>
    );
  }
  if (key.includes("access") || key.includes("ladder") || key.includes("scaffold")) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3v18" />
        <path d="M18 3v18" />
        <path d="m6 7 12 4" />
        <path d="m18 7-12 4" />
        <path d="m6 13 12 4" />
        <path d="m18 13-12 4" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

interface ShopListingClientProps {
  products: EquipmentProduct[];
  categories?: ShopCategory[];
}

export default function ShopListingClient({ products, categories: initialCategories }: ShopListingClientProps) {
  const dynamicCategories = useMemo(() => {
    if (initialCategories && initialCategories.length > 0) {
      return initialCategories;
    }
    const catMap = new Map<string, number>();
    products.forEach((p) => {
      catMap.set(p.category, (catMap.get(p.category) || 0) + 1);
    });
    return Array.from(catMap.keys()).map((catName, idx) => ({
      id: `cat-${idx + 1}`,
      name: catName,
      slug: catName.toLowerCase().replace(/\s+/g, "-"),
      count: catMap.get(catName) || 0
    }));
  }, [initialCategories, products]);

  const [selectedCategory, setSelectedCategory] = useState<string>("All Equipments");
  const [inStockChecked, setInStockChecked] = useState<boolean>(false);
  const [onRequestChecked, setOnRequestChecked] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("Latest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortDropdownOpen, setSortDropdownOpen] = useState<boolean>(false);

  // Dynamic stock counts
  const inStockCount = useMemo(
    () => products.filter((p) => p.availability === "In Stock").length,
    [products]
  );
  const onRequestCount = useMemo(
    () => products.filter((p) => p.availability === "On Request").length,
    [products]
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(8);

  // Cart state
  const [cart, setCart] = useState<{ product: EquipmentProduct; qty: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [cartToast, setCartToast] = useState<string | null>(null);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<EquipmentProduct | null>(null);

  // Reset page when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, inStockChecked, onRequestChecked, sortBy]);

  // Form state inside drawer
  const [quoteForm, setQuoteForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    projectLocation: "",
    rentalDuration: "1-3 Months",
    notes: "",
    submitted: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRfqId, setSubmittedRfqId] = useState<string>("");

  const totalUnits = useMemo(
    () => cart.reduce((acc, c) => acc + c.qty, 0),
    [cart]
  );

  const handleAddToCart = (product: EquipmentProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { product, qty: 1 }];
    });

    setCartToast(`Added ${product.name} to RFQ Cart`);
    setTimeout(() => setCartToast(null), 2500);
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear all items from the Enquiry Cart?")) {
      setCart([]);
    }
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as { product: EquipmentProduct; qty: number }[]
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const rfqCode = `RFQ-BIC-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmittedRfqId(rfqCode);

    setTimeout(() => {
      setIsSubmitting(false);
      setQuoteForm((prev) => ({ ...prev, submitted: true }));
    }, 700);
  };

  const handleResetQuote = () => {
    setQuoteForm({
      name: "",
      company: "",
      phone: "",
      email: "",
      projectLocation: "",
      rentalDuration: "1-3 Months",
      notes: "",
      submitted: false
    });
    setCart([]);
    setIsCartOpen(false);
    setSubmittedRfqId("");
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (selectedCategory && selectedCategory !== "All Equipments" && selectedCategory !== "All") {
      list = list.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Availability filter
    if (inStockChecked && !onRequestChecked) {
      list = list.filter((p) => p.availability === "In Stock");
    } else if (onRequestChecked && !inStockChecked) {
      list = list.filter((p) => p.availability === "On Request");
    }

    // Sorting
    if (sortBy === "Name: A-Z") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "Featured") {
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return list;
  }, [products, selectedCategory, inStockChecked, onRequestChecked, sortBy]);

  const totalResultsCount = filteredProducts.length;
  const totalPages = Math.ceil(totalResultsCount / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  const showingStart = totalResultsCount > 0 ? startIndex + 1 : 0;
  const showingEnd = Math.min(startIndex + itemsPerPage, totalResultsCount);

  return (
    <div className="bg-[#f8f9fb] min-h-screen py-10 px-4 sm:px-6 lg:px-12 relative">
      
      {/* Toast Notification */}
      {cartToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111827] text-white px-5 py-3 rounded-xl shadow-2xl border border-gray-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 size={18} className="text-[#E62E2D]" />
          <span className="text-xs font-semibold">{cartToast}</span>
        </div>
      )}

      <div className="max-w-[1650px] mx-auto">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          
          {/* ══════════ LEFT SIDEBAR ══════════ */}
          <aside className="w-full lg:w-[290px] shrink-0 bg-white rounded-2xl p-5 border border-gray-100 shadow-xs">
            
            {/* Categories Header */}
            <div className="mb-3">
              <h3 className="text-[15px] font-extrabold text-gray-900 tracking-tight">Categories</h3>
            </div>

            {/* Categories List */}
            <nav className="space-y-1">
              {/* All Equipments Option (Default) */}
              <button
                onClick={() => setSelectedCategory("All Equipments")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === "All Equipments" || selectedCategory === "All"
                    ? "bg-[#FEF2F2] text-[#E62E2D]"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={selectedCategory === "All Equipments" || selectedCategory === "All" ? "text-[#E62E2D]" : "text-gray-500"}>
                    <LayoutGrid size={17} />
                  </span>
                  <span className="truncate font-bold">All Equipments</span>
                </div>
                <span
                  className={`text-[11px] font-bold ${
                    selectedCategory === "All Equipments" || selectedCategory === "All" ? "text-[#E62E2D]" : "text-gray-400"
                  }`}
                >
                  {products.length}
                </span>
              </button>

              {/* Specific Categories */}
              {dynamicCategories.map((cat) => {
                const isActive = selectedCategory.toLowerCase() === cat.name.toLowerCase();
                const count = products.filter(
                  (p) => p.category?.toLowerCase() === cat.name?.toLowerCase()
                ).length || cat.count || 0;

                return (
                  <button
                    key={cat.id || cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#FEF2F2] text-[#E62E2D]"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? "text-[#E62E2D]" : "text-gray-500"}>
                        {renderCategoryIcon(cat.icon, cat.name)}
                      </span>
                      <span className="truncate">{cat.name}</span>
                    </div>
                    <span
                      className={`text-[11px] font-bold ${
                        isActive ? "text-[#E62E2D]" : "text-gray-400"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Divider */}
            <hr className="my-5 border-gray-100" />

            {/* Availability Filter */}
            <div>
              <h3 className="text-[15px] font-extrabold text-gray-900 tracking-tight mb-3">
                Availability
              </h3>

              <div className="space-y-2.5">
                <label className="flex items-center gap-3 text-xs font-medium text-gray-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={inStockChecked}
                    onChange={(e) => setInStockChecked(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#E62E2D] focus:ring-[#E62E2D] accent-[#E62E2D]"
                  />
                  <span>In Stock ({inStockCount})</span>
                </label>

                <label className="flex items-center gap-3 text-xs font-medium text-gray-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={onRequestChecked}
                    onChange={(e) => setOnRequestChecked(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#E62E2D] focus:ring-[#E62E2D] accent-[#E62E2D]"
                  />
                  <span>On Request ({onRequestCount})</span>
                </label>
              </div>
            </div>

          </aside>

          {/* ══════════ RIGHT MAIN CONTENT ══════════ */}
          <main className="flex-1 w-full">
            
            {/* Top Results Bar & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              
              {/* Left count indicator */}
              <div className="text-xs font-medium text-gray-500">
                Showing {showingStart}–{showingEnd} of {totalResultsCount} results
              </div>

              {/* Right sorting, page-size and view toggles */}
              <div className="flex items-center gap-3">
                
                {/* Items Per Page */}
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-2.5 py-2 rounded-xl shadow-2xs outline-none cursor-pointer"
                >
                  <option value={4}>4 per page</option>
                  <option value={8}>8 per page</option>
                  <option value={12}>12 per page</option>
                  <option value={16}>16 per page</option>
                </select>

                {/* Sort Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                    className="bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-2xs hover:border-gray-300 transition cursor-pointer"
                  >
                    <span>Sort by: {sortBy}</span>
                    <ChevronDown size={14} className="text-gray-500" />
                  </button>

                  {sortDropdownOpen && (
                    <div className="absolute right-0 mt-1.5 w-40 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-30 animate-in fade-in">
                      {["Latest", "Featured", "Name: A-Z"].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => {
                            setSortBy(opt);
                            setSortDropdownOpen(false);
                          }}
                          className="w-full text-left px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-[#E62E2D] transition cursor-pointer"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Grid / List View Toggles */}
                <div className="flex items-center gap-1.5 bg-white border border-gray-200 p-1 rounded-xl shadow-2xs">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      viewMode === "grid"
                        ? "bg-[#E62E2D] text-white"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid size={15} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      viewMode === "list"
                        ? "bg-[#E62E2D] text-white"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                    title="List View"
                  >
                    <List size={15} />
                  </button>
                </div>

              </div>
            </div>

            {/* Products Grid / List */}
            {totalResultsCount === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center my-6">
                <p className="text-sm font-bold text-gray-800">No equipment found for this filter.</p>
                <button
                  onClick={() => {
                    setSelectedCategory("All Equipments");
                    setInStockChecked(false);
                    setOnRequestChecked(false);
                    setCurrentPage(1);
                  }}
                  className="mt-3 text-xs text-[#E62E2D] font-bold underline cursor-pointer"
                >
                  Reset to All Equipments
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {paginatedProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-white rounded-2xl border border-gray-100/90 shadow-2xs hover:shadow-md transition-all duration-300 p-4 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image Frame */}
                      <div className="relative h-48 w-full bg-slate-100 rounded-xl overflow-hidden mb-3.5 flex items-center justify-center">
                        {prod.featured && (
                          <span className="absolute top-2.5 left-2.5 bg-[#E62E2D] text-white font-bold text-[9.5px] px-2 py-0.5 rounded-md shadow-xs z-10">
                            Featured
                          </span>
                        )}
                        <img
                          src={prod.image || "/uploads/upload-1790414661695-Integrated_Contracting_Support.avif"}
                          alt={prod.name}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/uploads/upload-1790414661695-Integrated_Contracting_Support.avif";
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Title & Category */}
                      <h4 className="text-[13.5px] font-bold text-gray-900 leading-tight group-hover:text-[#E62E2D] transition-colors line-clamp-1">
                        {prod.name}
                      </h4>
                      <p className="text-[11.5px] text-gray-400 font-normal mt-1 mb-4 truncate">
                        {prod.category}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-1">
                      {/* Top Action Row: Enquiry & View Enquiry Cart */}
                      <div className="flex items-center gap-2">
                        {/* Enquiry Button */}
                        <button
                          onClick={() => handleAddToCart(prod)}
                          className="flex-1 bg-white border border-[#E62E2D] text-[#E62E2D] hover:bg-red-50 text-[11.5px] font-bold py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <ShoppingCart size={13} className="text-[#E62E2D]" />
                          <span>Enquiry</span>
                        </button>

                        {/* View Enquiry Cart Button */}
                        <button
                          onClick={() => setIsCartOpen(true)}
                          className="flex-1 bg-[#E62E2D] hover:bg-red-700 text-white text-[11px] font-bold py-2 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors shadow-xs cursor-pointer whitespace-nowrap"
                        >
                          <span>View Enquiry Cart</span>
                          <span className="text-[12px]">→</span>
                        </button>
                      </div>

                      {/* View Details Button */}
                      <button
                        onClick={() => setSelectedProductForDetail(prod)}
                        className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-[#E62E2D] border border-slate-200/90 text-[11.5px] font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer group/btn shadow-2xs"
                      >
                        <Eye size={13} className="text-slate-400 group-hover/btn:text-[#E62E2D] transition-colors" />
                        <span>View Details</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              /* List View */
              <div className="space-y-3">
                {paginatedProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-white rounded-2xl border border-gray-100 p-4 shadow-2xs hover:shadow-md transition flex flex-col sm:flex-row items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-28 h-24 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
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
                      <div>
                        {prod.featured && (
                          <span className="bg-[#E62E2D] text-white font-bold text-[9px] px-2 py-0.5 rounded-md inline-block mb-1">
                            Featured
                          </span>
                        )}
                        <h4 className="text-sm font-bold text-gray-900">{prod.name}</h4>
                        <p className="text-xs text-gray-400">{prod.category}</p>
                        {prod.shortDesc && (
                          <p className="text-xs text-gray-500 mt-1 max-w-md line-clamp-1">{prod.shortDesc}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => setSelectedProductForDetail(prod)}
                        className="flex-1 sm:flex-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-[#E62E2D] text-xs font-bold py-2.5 px-3.5 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Eye size={14} className="text-slate-400" />
                        <span>View Details</span>
                      </button>
                      <button
                        onClick={() => handleAddToCart(prod)}
                        className="flex-1 sm:flex-none bg-white border border-[#E62E2D] text-[#E62E2D] hover:bg-red-50 text-xs font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <ShoppingCart size={14} />
                        <span>Enquiry</span>
                      </button>
                      <button
                        onClick={() => setIsCartOpen(true)}
                        className="flex-1 sm:flex-none bg-[#E62E2D] hover:bg-red-700 text-white text-xs font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-1 transition shadow-xs cursor-pointer"
                      >
                        <span>View Enquiry Cart →</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── PAGINATION BAR ───────────────────────────────────────── */}
            {totalPages > 1 && (
              <div className="mt-8 pt-6 border-t border-gray-200/70 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-gray-500 font-medium">
                  Showing page <strong className="text-gray-900">{currentPage}</strong> of <strong className="text-gray-900">{totalPages}</strong> ({totalResultsCount} total items)
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setCurrentPage((prev) => Math.max(prev - 1, 1));
                      window.scrollTo({ top: 380, behavior: "smooth" });
                    }}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <ChevronLeft size={14} />
                    <span>Previous</span>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        window.scrollTo({ top: 380, behavior: "smooth" });
                      }}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs ${
                        currentPage === pageNum
                          ? "bg-[#E62E2D] text-white shadow-xs"
                          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    onClick={() => {
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                      window.scrollTo({ top: 380, behavior: "smooth" });
                    }}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <span>Next</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

          </main>

        </div>
      </div>

      {/* ══════════ ENQUIRY CART DRAWER / MODAL ══════════ */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-end transition-all duration-300">
          <div className="bg-[#f8f9fc] w-full max-w-lg md:max-w-xl h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 border-l border-slate-200">
            
            {/* ── 1. LUXURY EXECUTIVE HEADER ────────────────────────── */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#0B0F17] via-[#111625] to-[#0A0D14] text-white p-5 md:p-6 border-b border-white/10 shrink-0">
              {/* Ambient Glows */}
              <div className="absolute top-0 right-0 -mt-6 -mr-6 w-48 h-48 bg-red-600/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-10 -mb-6 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/[0.08] border border-white/10 text-[10.5px] font-semibold text-red-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span>Aramco &amp; ISO Certified Fleet RFQ</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400">
                      <ShoppingCart size={16} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white tracking-tight leading-tight">
                        Equipment Commercial RFQ
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium">
                        Instant B2B stamped quotation dispatched across KSA
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-xl bg-white/10 border border-white/15 text-xs font-bold text-white shadow-xs">
                    {totalUnits} Units
                  </span>

                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
                    title="Close Cart"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* ── 2. DRAWER SCROLLABLE BODY ─────────────────────────── */}
            <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200/90 p-10 text-center shadow-xs my-8">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <ShoppingCart size={28} className="text-slate-400" />
                  </div>
                  <h4 className="text-base font-black text-slate-800">Your Enquiry Cart is Empty</h4>
                  <p className="text-xs text-slate-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
                    Click &quot;Enquiry&quot; on any machine or equipment card in the catalog to add items to your RFQ quotation list.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-5 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition cursor-pointer"
                  >
                    Browse Equipment Catalog
                  </button>
                </div>
              ) : (
                <>
                  {/* Selected Items Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-600" />
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                          Selected Equipment ({cart.length})
                        </h4>
                      </div>
                      <button
                        onClick={handleClearCart}
                        className="text-[11px] font-bold text-slate-400 hover:text-red-600 transition flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw size={11} />
                        <span>Clear All</span>
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {cart.map((item) => (
                        <div
                          key={item.product.id}
                          className="bg-white border border-slate-200/90 hover:border-slate-300 p-3.5 rounded-2xl shadow-2xs hover:shadow-md transition-all duration-300 flex items-center justify-between gap-3 group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-2xs">
                              <img
                                src={item.product.image || "/uploads/upload-1790414661695-Integrated_Contracting_Support.avif"}
                                alt={item.product.name}
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = "/uploads/upload-1790414661695-Integrated_Contracting_Support.avif";
                                }}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>

                            <div className="min-w-0">
                              <h5 className="text-xs font-bold text-slate-900 truncate leading-tight group-hover:text-red-600 transition-colors">
                                {item.product.name}
                              </h5>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md truncate max-w-[130px]">
                                  {item.product.category}
                                </span>
                                <span className="text-[9.5px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-md flex items-center gap-1">
                                  <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                  <span>{item.product.availability}</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Stepper & Delete */}
                          <div className="flex items-center gap-2.5 shrink-0">
                            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-0.5 shadow-2xs">
                              <button
                                onClick={() => handleUpdateQty(item.product.id, -1)}
                                className="w-6 h-6 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs transition cursor-pointer border border-slate-200/60 shadow-2xs"
                                title="Decrease Quantity"
                              >
                                <Minus size={11} />
                              </button>
                              <span className="w-7 text-center text-xs font-black text-slate-900">
                                {item.qty}
                              </span>
                              <button
                                onClick={() => handleUpdateQty(item.product.id, 1)}
                                className="w-6 h-6 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs transition cursor-pointer border border-slate-200/60 shadow-2xs"
                                title="Increase Quantity"
                              >
                                <Plus size={11} />
                              </button>
                            </div>

                            <button
                              onClick={() => handleRemoveFromCart(item.product.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                              title="Remove Item"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── 3. RFQ SUBMISSION FORM / CONFIRMATION ─────── */}
                  {quoteForm.submitted ? (
                    <div className="bg-white border-2 border-emerald-500/30 rounded-2xl p-6 md:p-8 text-center shadow-lg space-y-4 animate-in zoom-in-95 duration-300">
                      <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-md">
                        <CheckCircle2 size={32} />
                      </div>

                      <div className="space-y-1">
                        <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-mono font-bold">
                          {submittedRfqId || "RFQ-BIC-COMMERCIAL"}
                        </span>
                        <h4 className="text-lg font-black text-slate-900">
                          Quotation Request Dispatched!
                        </h4>
                        <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                          Our industrial procurement engineering team in Saudi Arabia has received your equipment list. An official stamped commercial quotation will be emailed and sent via WhatsApp shortly.
                        </p>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2">
                        <div className="flex justify-between text-slate-600">
                          <span>Recipient:</span>
                          <strong className="text-slate-900">{quoteForm.name} ({quoteForm.company || "Direct RFQ"})</strong>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Mobilization Target:</span>
                          <strong className="text-slate-900">{quoteForm.projectLocation || "Kingdom of Saudi Arabia"}</strong>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Duration / Scope:</span>
                          <strong className="text-slate-900">{quoteForm.rentalDuration}</strong>
                        </div>
                      </div>

                      {/* Post-submit Quick Triggers */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                        <a
                          href={`https://wa.me/966547504485?text=Hello%20BIC,%20I%20have%20submitted%20RFQ%20${submittedRfqId}%20for%20equipment%20procurement.`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
                        >
                          <MessageSquare size={14} />
                          <span>WhatsApp Dispatch</span>
                        </a>

                        <button
                          onClick={handleResetQuote}
                          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
                        >
                          <span>Close &amp; Continue</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleFormSubmit} className="bg-white border border-slate-200/90 rounded-2xl p-5 md:p-6 shadow-xs space-y-4">
                      
                      {/* Form Header with Red Brand Bar */}
                      <div className="border-l-3 border-[#E62E2D] pl-3">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                          Official Commercial RFQ Details
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium">
                          Receive an official stamped quotation within 2 hours
                        </p>
                      </div>

                      <div className="space-y-3.5">
                        
                        {/* Name Input */}
                        <div>
                          <label className="block text-[10.5px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                            Your Full Name *
                          </label>
                          <div className="relative">
                            <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. Eng. Abdullah Al-Mansoor"
                              value={quoteForm.name}
                              onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                              className="w-full text-xs font-semibold pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition text-slate-900"
                            />
                          </div>
                        </div>

                        {/* Company Input */}
                        <div>
                          <label className="block text-[10.5px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                            Company / Contractor Name *
                          </label>
                          <div className="relative">
                            <Building2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. Al-Rashid Construction Co."
                              value={quoteForm.company}
                              onChange={(e) => setQuoteForm({ ...quoteForm, company: e.target.value })}
                              className="w-full text-xs font-semibold pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition text-slate-900"
                            />
                          </div>
                        </div>

                        {/* Phone & Email Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10.5px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                              Phone / Mobile *
                            </label>
                            <div className="relative">
                              <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input
                                type="tel"
                                required
                                placeholder="+966 5X XXX XXXX"
                                value={quoteForm.phone}
                                onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                                className="w-full text-xs font-semibold pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition text-slate-900"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10.5px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                              Email Address *
                            </label>
                            <div className="relative">
                              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input
                                type="email"
                                required
                                placeholder="name@company.com"
                                value={quoteForm.email}
                                onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                                className="w-full text-xs font-semibold pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition text-slate-900"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Project Site Location */}
                        <div>
                          <label className="block text-[10.5px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                            Project Site Location *
                          </label>
                          <div className="relative">
                            <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. Jubail Industrial City, Yanbu, Riyadh, NEOM"
                              value={quoteForm.projectLocation}
                              onChange={(e) => setQuoteForm({ ...quoteForm, projectLocation: e.target.value })}
                              className="w-full text-xs font-semibold pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition text-slate-900"
                            />
                          </div>
                        </div>

                        {/* Rental Duration Chips */}
                        <div>
                          <label className="block text-[10.5px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                            Estimated Rental / Project Duration
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {["1-3 Months", "3-6 Months", "6-12 Months", "1+ Year", "Urgent Mobilization"].map((dur) => (
                              <button
                                key={dur}
                                type="button"
                                onClick={() => setQuoteForm({ ...quoteForm, rentalDuration: dur })}
                                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                                  quoteForm.rentalDuration === dur
                                    ? "bg-red-600 text-white shadow-xs"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                              >
                                {dur}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Notes / Special Requirements */}
                        <div>
                          <label className="block text-[10.5px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                            Specific Scope Requirements or Aramco Standards (Optional)
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Specify operators, fuel supply, shift patterns, site safety gate passes, or technical certifications..."
                            value={quoteForm.notes}
                            onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                            className="w-full text-xs font-medium p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition text-slate-900 leading-relaxed"
                          />
                        </div>

                      </div>

                      {/* ── 4. TRUST & SLA ASSURANCE STRIP ─────────── */}
                      <div className="pt-2 grid grid-cols-3 gap-2 border-t border-slate-100">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                          <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
                          <span className="truncate">Aramco Approved</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                          <Zap size={13} className="text-amber-500 shrink-0" />
                          <span className="truncate">2-Hr Quote SLA</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                          <Truck size={13} className="text-blue-600 shrink-0" />
                          <span className="truncate">KSA Mobilization</span>
                        </div>
                      </div>

                      {/* ── 5. SUBMIT BUTTON ────────────────────────── */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-[#E62E2D] via-[#D32221] to-[#B91C1C] hover:from-red-600 hover:to-rose-600 text-white font-black text-xs uppercase tracking-wider py-4 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 hover:shadow-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Preparing Official RFQ...</span>
                          </>
                        ) : (
                          <>
                            <Send size={15} className="text-white" />
                            <span>Request Official Commercial Quote</span>
                            <ArrowRight size={14} className="text-white/80" />
                          </>
                        )}
                      </button>

                    </form>
                  )}
                </>
              )}
            </div>

            {/* ── 6. EXECUTIVE FOOTER ───────────────────────────────── */}
            <div className="p-4 bg-slate-900 text-white border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-slate-400 font-medium">Commercial Hotline:</span>
                <a
                  href="tel:+966547504485"
                  className="text-white font-bold hover:text-red-400 transition"
                >
                  +966 54 750 4485
                </a>
              </div>

              <a
                href="https://wa.me/966547504485"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition"
              >
                <MessageSquare size={13} />
                <span>WhatsApp RFQ</span>
              </a>
            </div>

          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ── EQUIPMENT QUICK DETAIL MODAL ─────────────────────────────────── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {selectedProductForDetail && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => setSelectedProductForDetail(null)}
        >
          <div 
            className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-red-50 text-[#E62E2D] border border-red-200/60 rounded-md text-[11px] font-bold tracking-wide uppercase">
                  {selectedProductForDetail.category}
                </span>
                {selectedProductForDetail.featured && (
                  <span className="bg-[#E62E2D] text-white font-bold text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Sparkles size={11} />
                    <span>Featured</span>
                  </span>
                )}
              </div>

              <button
                onClick={() => setSelectedProductForDetail(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                title="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                
                {/* Product Image Section */}
                <div className="space-y-3">
                  <div className="relative aspect-4/3 w-full bg-slate-100 rounded-xl overflow-hidden border border-slate-100 group">
                    <img
                      src={selectedProductForDetail.image || "/uploads/upload-1790414661695-Integrated_Contracting_Support.avif"}
                      alt={selectedProductForDetail.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/uploads/upload-1790414661695-Integrated_Contracting_Support.avif";
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 right-2.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs backdrop-blur-md ${
                        selectedProductForDetail.availability === "In Stock"
                          ? "bg-emerald-500/90 text-white"
                          : "bg-amber-500/90 text-white"
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        {selectedProductForDetail.availability}
                      </span>
                    </div>
                  </div>

                  {/* Mobilization info box */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px]">
                      <MapPin size={13} className="text-[#E62E2D]" />
                      <span>Ready for Site Deployment</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Jubail, Yanbu, Riyadh, Dammam, NEOM & industrial corridors across KSA.
                    </p>
                  </div>
                </div>

                {/* Product Details Section */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                      {selectedProductForDetail.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#E62E2D] mt-1">
                      Category: {selectedProductForDetail.category}
                    </p>
                  </div>

                  {/* Description */}
                  <div className="text-xs text-slate-600 leading-relaxed bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
                    {selectedProductForDetail.shortDesc || 
                      "Heavy-duty industrial machinery engineered to stringent Saudi Aramco & SABIC safety standards, fully inspected and ready for prompt site mobilization."
                    }
                  </div>

                  {/* Key Highlights */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Standards & Support
                    </span>
                    <div className="grid grid-cols-1 gap-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                        <span className="text-[11.5px] font-medium">Aramco & SABIC HSE Compliant</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                        <span className="text-[11.5px] font-medium">Certified Operator Support Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                        <span className="text-[11.5px] font-medium">24/7 Field Maintenance & Backup Units</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                        <span className="text-[11.5px] font-medium">Flexible Short & Long-Term Leases</span>
                      </div>
                    </div>
                  </div>

                  {/* Action CTAs */}
                  <div className="pt-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          handleAddToCart(selectedProductForDetail);
                        }}
                        className="flex-1 bg-[#E62E2D] hover:bg-red-700 text-white text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-red-600/20 cursor-pointer"
                      >
                        <ShoppingCart size={15} />
                        <span>Add to RFQ Cart</span>
                      </button>

                      <a
                        href={`https://wa.me/966547504485?text=${encodeURIComponent(
                          `Hello BiC Team, I would like to enquire about: ${selectedProductForDetail.name} (${selectedProductForDetail.category}). Please provide rental rates and availability.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare size={15} />
                        <span>WhatsApp</span>
                      </a>
                    </div>

                    <button
                      onClick={() => {
                        handleAddToCart(selectedProductForDetail);
                        setSelectedProductForDetail(null);
                        setIsCartOpen(true);
                      }}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Proceed to Complete RFQ Request →</span>
                    </button>
                  </div>

                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-900 text-white flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <PhoneCall size={13} className="text-red-400" />
                <span className="text-slate-400">Direct Support:</span>
                <a href="tel:+966547504485" className="font-bold hover:text-red-400 transition">
                  +966 54 750 4485
                </a>
              </div>
              <button
                onClick={() => setSelectedProductForDetail(null)}
                className="text-slate-400 hover:text-white font-medium text-xs transition"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
