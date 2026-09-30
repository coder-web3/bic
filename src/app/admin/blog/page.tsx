"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
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
  Edit,
  Edit3,
  Upload,
  Calendar,
  Clock,
  Tag,
  User,
  Star,
  Quote,
  AlertTriangle,
  FileText,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Heading as HeadingIcon,
  List as ListIcon,
  Image as ImageIcon,
  Copy,
  ArrowRight,
  Bold,
  Italic,
  Check,
  Globe,
  Info,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  X,
  Filter,
  ArrowUpDown,
  Flame,
  HardHat,
  Factory,
  Wrench,
  ShieldCheck,
  Newspaper,
  TrendingUp,
  SlidersHorizontal,
  LayoutGrid,
  Columns,
  Maximize2,
  Minimize2,
  Smartphone,
  Tablet,
  Monitor,
  CheckCheck,
  FileEdit,
  Send,
  Code,
  Share2,
  Languages,
  FileCode,
  Underline as UnderlineIcon,
  Strikethrough,
  ListOrdered,
  Minus,
  Eraser,
  Undo,
  Redo,
  Camera,
  Users,
  Radio,
} from "lucide-react";
import MediaLibraryModal from "@/components/MediaLibraryModal";

const DEFAULT_CATEGORIES = [
  "Construction",
  "Industrial",
  "Equipment",
  "Safety",
  "Company News",
  "Market Insights",
];

const SCHEMA_PRESETS = [
  { id: "TechArticle", name: "TechArticle (Recommended)", desc: "Engineering specs, technical guidelines & industrial whitepapers" },
  { id: "Article", name: "Article", desc: "General industrial or business publication" },
  { id: "BlogPosting", name: "BlogPosting", desc: "Standard company blog post entry" },
  { id: "NewsArticle", name: "NewsArticle", desc: "Corporate press releases and project awards" },
  { id: "HowTo", name: "HowTo Guide", desc: "Procedural step-by-step engineering execution guide" },
];

const CATEGORY_ICONS: Record<string, any> = {
  "Construction": HardHat,
  "Industrial": Factory,
  "Equipment": Wrench,
  "Safety": ShieldCheck,
  "Company News": Newspaper,
  "Market Insights": TrendingUp,
};

// Helper function to convert legacy content blocks to continuous WordPress HTML
function convertBlocksToHtml(blocks: any[]): string {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return `<p>Start writing your technical publication here...</p>`;
  }

  return blocks.map((block) => {
    const alignStyle = block.align && block.align !== "left" ? ` style="text-align: ${block.align};"` : "";

    if (block.type === "lead") {
      return `<div class="lead-box"${alignStyle}><p>${block.text || ""}</p></div>`;
    }
    if (block.type === "heading") {
      const tag = block.level || "h2";
      return `<${tag}${alignStyle}>${block.text || ""}</${tag}>`;
    }
    if (block.type === "quote") {
      const cite = block.author ? `<cite>— ${block.author}</cite>` : "";
      return `<blockquote${alignStyle}><p>${block.text || ""}</p>${cite}</blockquote>`;
    }
    if (block.type === "callout") {
      const variant = block.variant || "standard";
      const title = block.title ? `<h4>${block.title}</h4>` : "";
      return `<div class="callout-box ${variant}"${alignStyle}>${title}<p>${block.text || ""}</p></div>`;
    }
    if (block.type === "link" || block.type === "cta") {
      const target = block.openInNewTab !== false ? ' target="_blank" rel="noopener noreferrer"' : '';
      const styleClass = block.style === "dark" ? "btn-dark" : block.style === "outline" ? "btn-outline" : "btn-cta";
      return `<p${alignStyle}><a href="${block.url || "#"}" class="${styleClass}"${target}>${block.text || block.label || "Explore Details"}</a></p>`;
    }
    if (block.type === "list") {
      const items = (block.items || []).map((it: string) => `<li>${it}</li>`).join("\n  ");
      return `<ul${alignStyle}>\n  ${items}\n</ul>`;
    }
    if (block.type === "image") {
      const caption = block.caption ? `<figcaption>${block.caption}</figcaption>` : "";
      return `<figure${alignStyle}><img src="${block.url}" alt="${block.alt || ""}" />${caption}</figure>`;
    }
    return `<p${alignStyle}>${block.text || ""}</p>`;
  }).join("\n\n");
}

// Helper function for preview text formatting & links
function PreviewFormattedText({ text, className = "" }: { text?: string; className?: string }) {
  if (!text) return null;

  const hasHtml = /<[a-z][\s\S]*>/i.test(text);
  if (hasHtml) {
    const processed = text.replace(
      /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1([^>]*)>/gi,
      (match, quote, href, rest) => {
        const isTargetBlank = /target=(["'])_blank\1/i.test(rest) || /target=(["'])_blank\1/i.test(match);
        const hasRel = /rel=(["'])(.*?)\1/i.test(match);
        const targetAttr = isTargetBlank ? ' target="_blank"' : '';
        const relAttr = isTargetBlank ? (hasRel ? '' : ' rel="noopener noreferrer"') : '';
        const classAttr = ' class="text-[#E62E2D] font-semibold underline hover:text-red-700 transition-colors inline-flex items-center gap-1"';
        const cleanRest = rest.replace(/class=(["'])(.*?)\1/gi, '').trim();
        return `<a href="${href}"${targetAttr}${relAttr}${classAttr} ${cleanRest}>`;
      }
    );
    return <span className={className} dangerouslySetInnerHTML={{ __html: processed }} />;
  }

  // Handle markdown links: [Text](url)
  const parts: React.ReactNode[] = [];
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)(?:\s+"([^"]*)")?\)/g;
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const label = match[1];
    const url = match[2];
    parts.push(
      <a
        key={match.index}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#E62E2D] font-semibold underline hover:text-red-700 inline-flex items-center gap-1 transition-colors cursor-pointer"
      >
        <span>{label}</span>
        <ExternalLink size={12} className="inline opacity-80 shrink-0" />
      </a>
    );
    lastIndex = linkRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return <span className={className}>{parts}</span>;
}

function getAlignClass(align?: string) {
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  if (align === "justify") return "text-justify";
  return "text-left";
}

export default function AdminBlogPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"articles" | "hero" | "settings" | "seo">("articles");
  
  // Articles search, category filter, status filter, sorting, and pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
  const [sortBy, setSortBy] = useState<"default" | "newest" | "oldest" | "title" | "blocks">("default");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);

  // Media Library Modal state
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [targetFieldPath, setTargetFieldPath] = useState<string | null>(null);

  // Article Edit / Add Modal state
  const [editingArticle, setEditingArticle] = useState<any | null>(null);
  const [isNewArticle, setIsNewArticle] = useState(false);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [modalActiveTab, setModalActiveTab] = useState<"basics" | "content" | "seo" | "preview">("basics");
  const [isSplitView, setIsSplitView] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [newTagInput, setNewTagInput] = useState("");

  // WordPress Classic Editor States
  const [editorMode, setEditorMode] = useState<"visual" | "html">("visual");
  const [activeBlockTag, setActiveBlockTag] = useState<string>("p");
  const visualEditorRef = React.useRef<HTMLDivElement>(null);
  const [wpLinkModal, setWpLinkModal] = useState({ isOpen: false, text: "", url: "https://", openInNewTab: true });
  const [wpImageModal, setWpImageModal] = useState({ isOpen: false, url: "", alt: "", caption: "", align: "none" });
  const [wpCalloutModal, setWpCalloutModal] = useState({ isOpen: false, variant: "standard", title: "Compliance Benchmark", text: "" });
  const [wpButtonModal, setWpButtonModal] = useState({ isOpen: false, label: "Explore Solutions", url: "/services", style: "primary", openInNewTab: true });

  const contentStats = useMemo(() => {
    const rawHtml = editingArticle?.bodyHtml || "";
    const textContent = rawHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const words = textContent ? textContent.split(/\s+/).filter(Boolean).length : 0;
    const chars = textContent.length;
    const readTimeMinutes = Math.max(1, Math.ceil(words / 180));
    return { words, chars, readTimeMinutes, readTime: `${readTimeMinutes} min read`, textContent };
  }, [editingArticle?.bodyHtml]);

  // SEO Tab specific states
  const [seoSerpDevice, setSeoSerpDevice] = useState<"desktop" | "mobile">("desktop");
  const [seoSubTab, setSeoSubTab] = useState<"serp" | "keywords" | "canonical" | "schema" | "social" | "indexing">("serp");
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [customSchemaError, setCustomSchemaError] = useState<string | null>(null);

  // Link Inserter Tool sub-dialog state
  const [linkHelper, setLinkHelper] = useState<{
    isOpen: boolean;
    blockIndex: number | null;
    field: string;
    text: string;
    url: string;
    openInNewTab: boolean;
  }>({
    isOpen: false,
    blockIndex: null,
    field: "text",
    text: "",
    url: "",
    openInNewTab: true,
  });

  // Real-time synchronization state
  const [lastSyncedTime, setLastSyncedTime] = useState<string>("Just now");
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Helper to persist data immediately to server disk and trigger live revalidation
  const persistDataToServer = async (payload: any) => {
    try {
      setSaving(true);
      setSaveSuccess(false);
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Error persisting blog data to server:", err);
    } finally {
      setSaving(false);
    }
  };

  // Fetch data with background mode
  const fetchData = async (isBackground: boolean = false) => {
    try {
      if (!isBackground) setLoading(true);
      else setIsSyncing(true);

      const res = await fetch("/api/blog?t=" + Date.now(), {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
      });

      if (res.ok) {
        const json = await res.json();
        setData(json);
        setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch (err) {
      console.error("Failed to load blog data:", err);
    } finally {
      if (!isBackground) setLoading(false);
      else setIsSyncing(false);
    }
  };

  // Live Auto-Sync: Refreshes whenever tab gains focus or every 8s when modal is closed
  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      // Only auto-poll when user is not actively editing inside the modal
      if (!showArticleModal && !saving) {
        fetchData(true);
      }
    }, 8000);

    const handleFocus = () => {
      if (!showArticleModal && !saving) {
        fetchData(true);
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, [showArticleModal, saving]);

  // Detect active formatting block at cursor position
  const detectActiveBlockTag = () => {
    if (typeof window === "undefined" || !visualEditorRef.current) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    let node: Node | null = sel.anchorNode;
    if (!node) return;
    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentNode;
    }
    while (node && node !== visualEditorRef.current) {
      if (node instanceof HTMLElement) {
        if (node.classList?.contains("lead-box")) {
          setActiveBlockTag("lead");
          return;
        }
        if (node.classList?.contains("callout-box")) {
          setActiveBlockTag("callout");
          return;
        }
        const tag = node.tagName.toLowerCase();
        if (["h1", "h2", "h3", "h4", "h5", "h6", "p", "blockquote", "pre"].includes(tag)) {
          setActiveBlockTag(tag);
          return;
        }
      }
      node = node.parentNode;
    }
    setActiveBlockTag("p");
  };

  useEffect(() => {
    if (!showArticleModal || editorMode !== "visual") return;
    const handleSelChange = () => {
      detectActiveBlockTag();
    };
    document.addEventListener("selectionchange", handleSelChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelChange);
    };
  }, [showArticleModal, editorMode]);

  // Manual save all changes to API
  const handleSaveAll = async () => {
    if (!data) return;
    await persistDataToServer(data);
  };

  // Helper to update deeply nested fields in main data
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

  // Callback when an image is selected in the media library
  const handleSelectMedia = (url: string, alt?: string) => {
    if (targetFieldPath === "wpImageModal.url") {
      setWpImageModal((prev) => ({
        ...prev,
        url,
        alt: alt || prev.alt || "Article publication image",
      }));
    } else if (targetFieldPath?.startsWith("wpImageModal.")) {
      const field = targetFieldPath.replace("wpImageModal.", "");
      setWpImageModal((prev: any) => ({ ...prev, [field]: url }));
    } else if (targetFieldPath?.startsWith("editingArticle.content[")) {
      const match = targetFieldPath.match(/editingArticle\.content\[(\d+)\]\.(.+)/);
      if (match && editingArticle) {
        const blockIdx = parseInt(match[1], 10);
        const fieldName = match[2];
        const copy = JSON.parse(JSON.stringify(editingArticle));
        if (copy.content[blockIdx]) {
          copy.content[blockIdx][fieldName] = url;
          setEditingArticle(copy);
        }
      }
    } else if (targetFieldPath?.startsWith("editingArticle.")) {
      const field = targetFieldPath.replace("editingArticle.", "");
      setEditingArticle((prev: any) => ({ ...prev, [field]: url }));
    } else if (targetFieldPath) {
      updateField(targetFieldPath, url);
    }
    setMediaModalOpen(false);
    setTargetFieldPath(null);
  };

  // Start adding a new article
  const handleStartAddArticle = () => {
    setIsNewArticle(true);
    setModalActiveTab("basics");
    setIsSplitView(false);
    setCustomSchemaError(null);
    setEditorMode("visual");

    const defaultHtml = `
<div class="lead-box">
  <p>Executive summary and industrial context for this technical publication under Vision 2030.</p>
</div>

<h2>1. Core Engineering Standards & Protocol</h2>

<p>Saudi Aramco and Royal Commission safety benchmarks mandate strict compliance for heavy civil and mechanical site execution across key industrial zones in Saudi Arabia.</p>

<div class="callout-box standard">
  <h4>Compliance Benchmark</h4>
  <p>All personnel and equipment must carry current third-party certification prior to site mobilization.</p>
</div>

<h2>2. Integrated Civil & EPC Operations</h2>

<p>Contractors capable of supplying integrated services — combining earthmoving fleets, piping fabrication, certified scaffolding, and Aramco-approved HSE supervisors — achieve accelerated timelines and lower total execution costs.</p>

<p><a href="/services/equipment-rental" class="btn-cta" target="_blank">Explore Equipment Fleet &amp; Rental Specifications &rarr;</a></p>
`.trim();

    setEditingArticle({
      id: `post-${Date.now()}`,
      slug: `new-article-${Date.now().toString().slice(-4)}`,
      status: "published", // Default published, can be draft
      title: "",
      category: "Construction",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      readTime: "5 min read",
      author: "BIC Team",
      authorRole: "Lead Technical Strategist, BiC",
      authorImage: "/uploads/upload-1790411215652-best_logo-01.png",
      image: "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=1200&auto=format&fit=crop",
      summary: "A comprehensive analysis of industrial engineering practices, equipment readiness, and safety standards in Saudi Arabia.",
      featured: false,
      tags: ["Vision 2030", "Industrial", "Engineering", "Aramco Standards"],
      // WordPress Body HTML
      bodyHtml: defaultHtml,
      // SEO & Structured Data fields
      seoTitle: "",
      seoDescription: "",
      focusKeyword: "Saudi industrial contracting",
      secondaryKeywords: "EPC engineering, heavy equipment rental, Aramco standards, Jubail logistics",
      canonicalUrl: "",
      hreflangAr: "",
      hreflangEn: "",
      hreflangDefault: "",
      schemaType: "TechArticle",
      customJsonLd: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      twitterCard: "summary_large_image",
      noIndex: false,
      noFollow: false,
    });
    setShowArticleModal(true);
  };

  // Start editing an article
  const handleStartEditArticle = (article: any) => {
    setIsNewArticle(false);
    setModalActiveTab("basics");
    setIsSplitView(false);
    setCustomSchemaError(null);
    setEditorMode("visual");
    const copy = JSON.parse(JSON.stringify(article));
    if (!copy.status) copy.status = "published";
    if (!copy.schemaType) copy.schemaType = "TechArticle";
    if (copy.noIndex === undefined) copy.noIndex = false;
    if (copy.noFollow === undefined) copy.noFollow = false;
    if (!copy.bodyHtml) {
      copy.bodyHtml = convertBlocksToHtml(copy.content || []);
    }
    setEditingArticle(copy);
    setShowArticleModal(true);
  };

  // Toggle Featured status directly from card
  const handleToggleFeatured = async (articleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedArticles = (data?.articles || []).map((a: any) => {
      if (a.id === articleId) {
        return { ...a, featured: !a.featured };
      }
      return a;
    });
    const updatedData = { ...data, articles: updatedArticles };
    setData(updatedData);
    await persistDataToServer(updatedData);
  };

  // Toggle Draft / Published status directly from card
  const handleToggleStatus = async (articleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedArticles = (data?.articles || []).map((a: any) => {
      if (a.id === articleId) {
        const nextStatus = a.status === "draft" ? "published" : "draft";
        return { ...a, status: nextStatus };
      }
      return a;
    });
    const updatedData = { ...data, articles: updatedArticles };
    setData(updatedData);
    await persistDataToServer(updatedData);
  };

  // Save Article from Modal back to data state and immediately persist to server
  const handleSaveArticleModal = async (statusOverride?: "published" | "draft") => {
    if (!editingArticle.title.trim()) {
      alert("Please provide an article title.");
      return;
    }
    
    // Auto-generate slug if empty
    if (!editingArticle.slug.trim()) {
      editingArticle.slug = editingArticle.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    const finalBodyHtml = editingArticle.bodyHtml || convertBlocksToHtml(editingArticle.content || []);

    const finalArticle = {
      ...editingArticle,
      bodyHtml: finalBodyHtml,
      status: statusOverride || editingArticle.status || "published",
    };

    let updatedArticles: any[];
    if (isNewArticle) {
      updatedArticles = [finalArticle, ...(data?.articles || [])];
    } else {
      updatedArticles = (data?.articles || []).map((item: any) =>
        item.id === finalArticle.id ? finalArticle : item
      );
    }

    const updatedData = {
      ...data,
      articles: updatedArticles,
    };

    setData(updatedData);
    setShowArticleModal(false);
    setEditingArticle(null);

    // Save to disk immediately so coworkers see it in real time
    await persistDataToServer(updatedData);
  };

  // Delete article and persist immediately
  const handleDeleteArticle = async (articleId: string) => {
    if (confirm("Are you sure you want to remove this article from the blog?")) {
      const updatedArticles = (data?.articles || []).filter((item: any) => item.id !== articleId);
      const updatedData = { ...data, articles: updatedArticles };
      setData(updatedData);
      await persistDataToServer(updatedData);
    }
  };

  // Move article up / down and persist immediately
  const handleMoveArticle = async (index: number, direction: "up" | "down") => {
    const updated = [...(data?.articles || [])];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    const updatedData = { ...data, articles: updated };
    setData(updatedData);
    await persistDataToServer(updatedData);
  };

  // ── CONTENT BLOCK BUILDER HANDLERS ────────────────────────────────
  const handleAddContentBlock = (type: string) => {
    if (!editingArticle) return;
    let newBlock: any = { type, align: "left" };

    if (type === "paragraph") {
      newBlock.text = "New paragraph text explaining technical details and procedures.";
    } else if (type === "heading") {
      newBlock.level = "h2";
      newBlock.text = "New Section Heading";
    } else if (type === "lead") {
      newBlock.text = "Key executive summary highlighting important industrial insights.";
    } else if (type === "link") {
      newBlock.text = "View Related Service Details";
      newBlock.url = "/services";
      newBlock.openInNewTab = true;
      newBlock.style = "primary";
    } else if (type === "callout") {
      newBlock.title = "Important Technical Benchmark";
      newBlock.text = "Crucial safety or engineering guideline to take into consideration.";
      newBlock.variant = "standard";
    } else if (type === "quote") {
      newBlock.text = "Safety and engineering excellence form the foundation of sustainable heavy industry.";
      newBlock.author = "BiC Technical Directorate";
    } else if (type === "list") {
      newBlock.items = [
        "First standard compliance requirement",
        "Second operational procedure metric",
        "Third safety inspection protocol"
      ];
    } else if (type === "image") {
      newBlock.url = "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=1200&auto=format&fit=crop";
      newBlock.caption = "Engineering team conducting on-site quality assurance inspection.";
      newBlock.alt = "Industrial quality inspection";
    }

    setEditingArticle((prev: any) => ({
      ...prev,
      content: [...(prev.content || []), newBlock]
    }));
  };

  const handleUpdateContentBlock = (index: number, field: string, value: any) => {
    if (!editingArticle) return;
    const copy = JSON.parse(JSON.stringify(editingArticle));
    if (!copy.content) copy.content = [];
    if (copy.content[index]) {
      copy.content[index][field] = value;
      setEditingArticle(copy);
    }
  };

  const handleMoveContentBlock = (index: number, direction: "up" | "down") => {
    if (!editingArticle) return;
    const copy = JSON.parse(JSON.stringify(editingArticle));
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= copy.content.length) return;
    const temp = copy.content[index];
    copy.content[index] = copy.content[targetIndex];
    copy.content[targetIndex] = temp;
    setEditingArticle(copy);
  };

  const handleDeleteContentBlock = (index: number) => {
    if (!editingArticle) return;
    const copy = JSON.parse(JSON.stringify(editingArticle));
    copy.content.splice(index, 1);
    setEditingArticle(copy);
  };

  const handleDuplicateContentBlock = (index: number) => {
    if (!editingArticle) return;
    const copy = JSON.parse(JSON.stringify(editingArticle));
    const duplicated = JSON.parse(JSON.stringify(copy.content[index]));
    copy.content.splice(index + 1, 0, duplicated);
    setEditingArticle(copy);
  };

  // ── LINK INSERTER TOOL HANDLER ────────────────────────────────────
  const handleOpenLinkHelper = (blockIndex: number, field: string = "text") => {
    setLinkHelper({
      isOpen: true,
      blockIndex,
      field,
      text: "Explore Details",
      url: "https://",
      openInNewTab: true,
    });
  };

  const handleApplyLinkHelper = () => {
    if (!linkHelper.url.trim() || linkHelper.blockIndex === null || !editingArticle) {
      setLinkHelper((prev) => ({ ...prev, isOpen: false }));
      return;
    }

    const copy = JSON.parse(JSON.stringify(editingArticle));
    const block = copy.content[linkHelper.blockIndex];
    if (!block) return;

    const label = linkHelper.text.trim() || linkHelper.url.trim();
    const linkTag = linkHelper.openInNewTab
      ? `<a href="${linkHelper.url.trim()}" target="_blank" rel="noopener noreferrer">${label}</a>`
      : `<a href="${linkHelper.url.trim()}">${label}</a>`;

    const currentText = block[linkHelper.field] || "";
    block[linkHelper.field] = currentText ? `${currentText} ${linkTag}` : linkTag;

    setEditingArticle(copy);
    setLinkHelper({
      isOpen: false,
      blockIndex: null,
      field: "text",
      text: "",
      url: "",
      openInNewTab: true,
    });
  };

  // ── WORDPRESS CLASSIC EDITOR HANDLERS & SYNC ─────────────────────
  useEffect(() => {
    if (showArticleModal && modalActiveTab === "content" && editorMode === "visual" && visualEditorRef.current) {
      if (visualEditorRef.current.innerHTML !== (editingArticle?.bodyHtml || "")) {
        visualEditorRef.current.innerHTML = editingArticle?.bodyHtml || "";
      }
    }
  }, [showArticleModal, modalActiveTab, editorMode, editingArticle?.id]);

  const handleExecCommand = (command: string, value: string | undefined = undefined) => {
    if (editorMode === "visual" && visualEditorRef.current) {
      visualEditorRef.current.focus();
      document.execCommand(command, false, value);
      const newHtml = visualEditorRef.current.innerHTML;
      setEditingArticle((prev: any) => ({ ...prev, bodyHtml: newHtml }));
    }
  };

  const handleInsertFormatBlock = (tag: string) => {
    if (editorMode === "visual" && visualEditorRef.current) {
      visualEditorRef.current.focus();
      if (tag === "lead") {
        handleInsertHtml('<div class="lead-box"><p>Lead highlight paragraph summarizing strategic technical takeaways.</p></div>');
        setActiveBlockTag("lead");
        return;
      }
      try {
        document.execCommand("formatBlock", false, `<${tag}>`);
      } catch (e) {
        document.execCommand("formatBlock", false, tag);
      }
      const newHtml = visualEditorRef.current.innerHTML;
      setEditingArticle((prev: any) => ({ ...prev, bodyHtml: newHtml }));
      setActiveBlockTag(tag);
    } else if (editorMode === "html") {
      if (tag === "lead") {
        const leadHtml = '<div class="lead-box">\n  <p>Lead highlight summary text.</p>\n</div>';
        setEditingArticle((prev: any) => ({
          ...prev,
          bodyHtml: `${prev.bodyHtml || ""}\n${leadHtml}\n`
        }));
        setActiveBlockTag("lead");
        return;
      }
      const openTag = `<${tag}>`;
      const closeTag = `</${tag}>`;
      setEditingArticle((prev: any) => ({
        ...prev,
        bodyHtml: `${prev.bodyHtml || ""}\n${openTag}Heading text${closeTag}\n`
      }));
      setActiveBlockTag(tag);
    }
  };

  const handleInsertHtml = (htmlSnippet: string) => {
    if (editorMode === "visual" && visualEditorRef.current) {
      visualEditorRef.current.focus();
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        range.deleteContents();
        const el = document.createElement("div");
        el.innerHTML = htmlSnippet;
        const frag = document.createDocumentFragment();
        let node;
        let lastNode;
        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node);
        }
        range.insertNode(frag);
        if (lastNode) {
          range.setStartAfter(lastNode);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      } else {
        visualEditorRef.current.innerHTML += htmlSnippet;
      }
      const newHtml = visualEditorRef.current.innerHTML;
      setEditingArticle((prev: any) => ({ ...prev, bodyHtml: newHtml }));
    } else {
      setEditingArticle((prev: any) => ({
        ...prev,
        bodyHtml: `${prev.bodyHtml || ""}\n${htmlSnippet}\n`
      }));
    }
  };

  const handleApplyWpLink = () => {
    if (!wpLinkModal.url.trim()) {
      setWpLinkModal((prev) => ({ ...prev, isOpen: false }));
      return;
    }
    const label = wpLinkModal.text.trim() || wpLinkModal.url.trim();
    const linkHtml = wpLinkModal.openInNewTab
      ? `<a href="${wpLinkModal.url.trim()}" target="_blank" rel="noopener noreferrer">${label}</a>`
      : `<a href="${wpLinkModal.url.trim()}">${label}</a>`;
    
    handleInsertHtml(linkHtml);
    setWpLinkModal({ isOpen: false, text: "", url: "https://", openInNewTab: true });
  };

  const handleApplyWpButton = () => {
    if (!wpButtonModal.url.trim()) {
      setWpButtonModal((prev) => ({ ...prev, isOpen: false }));
      return;
    }
    const label = wpButtonModal.label.trim() || "Explore More";
    const targetAttr = wpButtonModal.openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
    let btnCls = "btn-cta";
    if (wpButtonModal.style === "dark") btnCls = "btn-dark";
    else if (wpButtonModal.style === "outline") btnCls = "btn-outline";

    const btnHtml = `<p><a href="${wpButtonModal.url.trim()}" class="${btnCls}"${targetAttr}>${label}</a></p>`;
    handleInsertHtml(btnHtml);
    setWpButtonModal({ isOpen: false, label: "Explore Solutions", url: "/services", style: "primary", openInNewTab: true });
  };

  const handleApplyWpCallout = () => {
    const title = wpCalloutModal.title.trim() || "Technical Benchmark";
    const text = wpCalloutModal.text.trim() || "Important operational or engineering guideline.";
    let boxCls = "callout-box";
    if (wpCalloutModal.variant === "warning") boxCls = "callout-box warning";
    else if (wpCalloutModal.variant === "info") boxCls = "callout-box info";

    const calloutHtml = `<div class="${boxCls}">\n  <div class="callout-title">${title}</div>\n  <p>${text}</p>\n</div>`;
    handleInsertHtml(calloutHtml);
    setWpCalloutModal({ isOpen: false, variant: "standard", title: "Compliance Benchmark", text: "" });
  };

  const handleApplyWpImage = () => {
    if (!wpImageModal.url.trim()) {
      setWpImageModal((prev) => ({ ...prev, isOpen: false }));
      return;
    }
    let alignCls = "";
    if (wpImageModal.align === "center") alignCls = ' style="display:block;margin:0 auto;text-align:center;"';
    else if (wpImageModal.align === "right") alignCls = ' style="display:block;margin-left:auto;text-align:right;"';

    const captionHtml = wpImageModal.caption ? `<figcaption style="text-align:center;font-size:0.875rem;color:#64748b;margin-top:0.5rem;font-style:italic;">${wpImageModal.caption}</figcaption>` : "";
    const imgHtml = `<figure${alignCls}>\n  <img src="${wpImageModal.url.trim()}" alt="${wpImageModal.alt || "Article visual"}" style="border-radius:1rem;max-width:100%;height:auto;margin:0 auto;" />\n  ${captionHtml}\n</figure>`;
    
    handleInsertHtml(imgHtml);
    setWpImageModal({ isOpen: false, url: "", alt: "", caption: "", align: "none" });
  };

  // ── TAGS HELPER ───────────────────────────────────────────────────
  const handleAddTag = () => {
    if (!newTagInput.trim() || !editingArticle) return;
    const cleanTag = newTagInput.trim().replace(/^#/, "");
    const tags = Array.isArray(editingArticle.tags) ? editingArticle.tags : [];
    if (!tags.includes(cleanTag)) {
      setEditingArticle((prev: any) => ({
        ...prev,
        tags: [...tags, cleanTag],
      }));
    }
    setNewTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!editingArticle) return;
    setEditingArticle((prev: any) => ({
      ...prev,
      tags: (prev.tags || []).filter((t: string) => t !== tagToRemove),
    }));
  };

  // Taglines in Hero
  const handleAddTagline = () => {
    setData((prev: any) => ({
      ...prev,
      hero: {
        ...prev.hero,
        taglines: [...(prev.hero?.taglines || []), "NEW TECHNICAL PAPER"],
      },
    }));
  };

  const handleRemoveTagline = (index: number) => {
    setData((prev: any) => {
      const copy = [...(prev.hero?.taglines || [])];
      copy.splice(index, 1);
      return { ...prev, hero: { ...prev.hero, taglines: copy } };
    });
  };

  // ── FILTER, SORT & PAGINATE ARTICLES ──────────────────────────────
  const articlesList: any[] = data?.articles || [];

  // Derived Metrics
  const totalArticles = articlesList.length;
  const publishedCount = articlesList.filter((a) => a.status !== "draft").length;
  const draftCount = articlesList.filter((a) => a.status === "draft").length;
  const featuredCount = articlesList.filter((a) => a.featured).length;
  const totalBlocks = articlesList.reduce((acc, a) => acc + (a.content?.length || 0), 0);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { "All": totalArticles };
    DEFAULT_CATEGORIES.forEach((c) => {
      counts[c] = articlesList.filter((a) => a.category?.toLowerCase() === c.toLowerCase()).length;
    });
    return counts;
  }, [articlesList, totalArticles]);

  const filteredAndSortedArticles = useMemo(() => {
    let result = articlesList.filter((article: any) => {
      const matchesCat = filterCategory === "All" || article.category?.toLowerCase() === filterCategory.toLowerCase();
      
      const isDraft = article.status === "draft";
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "published" && !isDraft) ||
        (filterStatus === "draft" && isDraft);

      const matchesSearch =
        !searchQuery ||
        article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCat && matchesStatus && matchesSearch;
    });

    if (sortBy === "newest") {
      result = [...result].sort((a, b) => new Date(b.date || "").getTime() - new Date(a.date || "").getTime());
    } else if (sortBy === "oldest") {
      result = [...result].sort((a, b) => new Date(a.date || "").getTime() - new Date(b.date || "").getTime());
    } else if (sortBy === "title") {
      result = [...result].sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else if (sortBy === "blocks") {
      result = [...result].sort((a, b) => (b.content?.length || 0) - (a.content?.length || 0));
    }

    return result;
  }, [articlesList, filterCategory, filterStatus, searchQuery, sortBy]);

  // Admin Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedArticles.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedArticles = filteredAndSortedArticles.slice(startIndex, startIndex + pageSize);

  const handleCategoryFilter = (cat: string) => {
    setFilterCategory(cat);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status: "all" | "published" | "draft") => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // ── LIVE SEO AUDIT & SCORING CALCULATIONS ─────────────────────────
  const seoAnalysis = useMemo(() => {
    if (!editingArticle) {
      return {
        score: 0,
        titleLen: 0,
        isTitleOptimal: false,
        isTitleWarning: false,
        descLen: 0,
        isDescOptimal: false,
        isDescWarning: false,
        focusKw: "",
        kwInTitle: false,
        kwInDesc: false,
        kwInSlug: false,
        kwCount: 0,
        hasCanonical: false,
        hasHreflang: false,
        hasSchema: false,
        hasImage: false,
      };
    }

    const title = (editingArticle.seoTitle || editingArticle.title || "").trim();
    const description = (editingArticle.seoDescription || editingArticle.summary || "").trim();
    const slug = (editingArticle.slug || "").trim();
    const focusKw = (editingArticle.focusKeyword || "").trim().toLowerCase();

    // Aggregate body content text from both HTML editor and blocks
    const htmlClean = (editingArticle.bodyHtml || "").replace(/<[^>]*>/g, " ");
    const blocksText = (editingArticle.content || [])
      .map((b: any) => {
        if (b.text) return b.text;
        if (b.items) return b.items.join(" ");
        if (b.title) return b.title;
        return "";
      })
      .join(" ");
    
    const bodyText = `${htmlClean} ${blocksText}`.toLowerCase();

    const kwInTitle = focusKw ? title.toLowerCase().includes(focusKw) : false;
    const kwInDesc = focusKw ? description.toLowerCase().includes(focusKw) : false;
    const kwInSlug = focusKw ? slug.toLowerCase().includes(focusKw.replace(/\s+/g, "-")) : false;

    // Count keyword occurrences
    let kwCount = 0;
    if (focusKw) {
      const escaped = focusKw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b${escaped}\\b`, "gi");
      kwCount = (bodyText.match(regex) || []).length;
    }

    const titleLen = title.length;
    const isTitleOptimal = titleLen >= 40 && titleLen <= 65;
    const isTitleWarning = titleLen > 65 || (titleLen > 0 && titleLen < 40);

    const descLen = description.length;
    const isDescOptimal = descLen >= 110 && descLen <= 165;
    const isDescWarning = descLen > 165 || (descLen > 0 && descLen < 110);

    const hasCanonical = Boolean(editingArticle.canonicalUrl?.trim());
    const hasHreflang = Boolean(editingArticle.hreflangAr?.trim() || editingArticle.hreflangEn?.trim());
    const hasSchema = Boolean(editingArticle.schemaType || editingArticle.customJsonLd);
    const hasImage = Boolean(editingArticle.ogImage || editingArticle.image);

    // Calculate score
    let score = 25;
    if (isTitleOptimal) score += 18; else if (titleLen > 0) score += 8;
    if (isDescOptimal) score += 18; else if (descLen > 0) score += 8;
    if (focusKw) score += 10;
    if (kwInTitle) score += 10;
    if (kwInDesc) score += 6;
    if (kwInSlug) score += 5;
    if (kwCount >= 2) score += 8;
    if (hasCanonical) score += 5;

    return {
      score: Math.min(score, 100),
      titleLen,
      isTitleOptimal,
      isTitleWarning,
      descLen,
      isDescOptimal,
      isDescWarning,
      focusKw,
      kwInTitle,
      kwInDesc,
      kwInSlug,
      kwCount,
      hasCanonical,
      hasHreflang,
      hasSchema,
      hasImage,
    };
  }, [editingArticle]);

  // Auto-generate Schema.org JSON-LD preview
  const autoGeneratedJsonLd = useMemo(() => {
    if (!editingArticle) return "";
    const slug = editingArticle.slug || "article-slug";
    const canonical = editingArticle.canonicalUrl?.trim() || `https://bestinternational.com.sa/blog/${slug}`;
    const title = editingArticle.seoTitle?.trim() || editingArticle.title?.trim() || "Untitled Article";
    const desc = editingArticle.seoDescription?.trim() || editingArticle.summary?.trim() || "Article summary.";
    const imgUrl = editingArticle.ogImage?.trim() || editingArticle.image?.trim() || "https://bestinternational.com.sa/uploads/og-default.jpg";
    const authorName = editingArticle.author?.trim() || "BiC Engineering Directorate";
    const authorRole = editingArticle.authorRole?.trim() || "Industrial Technical Specialist";
    const schemaType = editingArticle.schemaType || "TechArticle";

    const obj = {
      "@context": "https://schema.org",
      "@type": schemaType,
      "headline": title,
      "description": desc,
      "image": [imgUrl],
      "datePublished": editingArticle.datePublished || "2026-09-20T08:00:00+03:00",
      "dateModified": editingArticle.dateModified || new Date().toISOString(),
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": canonical,
      },
      "keywords": editingArticle.focusKeyword
        ? `${editingArticle.focusKeyword}, ${(editingArticle.tags || []).join(", ")}`
        : (editingArticle.tags || []).join(", "),
      "author": {
        "@type": "Person",
        "name": authorName,
        "jobTitle": authorRole,
      },
      "publisher": {
        "@type": "Organization",
        "name": "Best International Contracting Company",
        "url": "https://bestinternational.com.sa",
        "logo": {
          "@type": "ImageObject",
          "url": "https://bestinternational.com.sa/uploads/logo.png",
        },
      },
    };

    return JSON.stringify(obj, null, 2);
  }, [editingArticle]);

  if (loading) {
    return (
      <div className="p-10 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw size={28} className="animate-spin text-[#E62E2D]" />
          <p className="text-xs font-bold text-slate-600">Loading Blog CMS Architecture...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-28 text-slate-800">
      
      {/* ── TOP HEADER WITH STATUS & GLOBAL ACTIONS ───────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-[#E62E2D] font-black text-[10px] tracking-wider uppercase border border-red-100">
              Enterprise CMS
            </span>
            <span className="text-xs text-slate-400 font-mono">/blog & /blog/[slug]</span>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-bold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Users size={12} className="text-emerald-600" />
              <span>Multi-User Live Sync Active</span>
              {lastSyncedTime && (
                <span className="text-[10px] font-medium text-emerald-600/80 pl-1 border-l border-emerald-300">
                  {lastSyncedTime}
                </span>
              )}
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <BookOpen size={28} className="text-[#E62E2D]" />
            <span>Blog Articles & Insights CMS</span>
          </h1>

          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            Manage your technical engineering publications, block-based structured content, draft vs published workflow, and live coworker updates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <button
            onClick={() => fetchData(false)}
            disabled={isSyncing || loading}
            title="Fetch latest articles and updates created by coworkers"
            className="px-3.5 py-2.5 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-2 transition shadow-2xs hover:border-slate-300 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={13} className={`text-slate-600 ${isSyncing ? "animate-spin text-[#E62E2D]" : ""}`} />
            <span>{isSyncing ? "Syncing..." : "Sync Now"}</span>
          </button>

          <Link
            href="/blog"
            target="_blank"
            className="px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-2 transition shadow-2xs hover:border-slate-300 cursor-pointer"
          >
            <ExternalLink size={14} className="text-[#E62E2D]" />
            <span>View Live Blog</span>
          </Link>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="px-6 py-2.5 bg-gradient-to-r from-[#E62E2D] to-red-700 hover:from-red-600 hover:to-red-800 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-600/25 transition disabled:opacity-50 cursor-pointer"
          >
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            <span>{saving ? "Publishing Updates..." : "Save Blog CMS"}</span>
          </button>
        </div>
      </div>

      {/* ── TABS NAVIGATION BAR ────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200">
        <button
          onClick={() => setActiveTab("articles")}
          className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
            activeTab === "articles"
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/15 ring-2 ring-slate-900"
              : "bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <BookOpen size={15} className={activeTab === "articles" ? "text-red-400" : "text-slate-400"} />
          <span>Articles Archive</span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
            activeTab === "articles" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
          }`}>
            {totalArticles}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("hero")}
          className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
            activeTab === "hero"
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/15 ring-2 ring-slate-900"
              : "bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <Layers size={15} className={activeTab === "hero" ? "text-red-400" : "text-slate-400"} />
          <span>Hero Banner & Stats</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
            activeTab === "settings"
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/15 ring-2 ring-slate-900"
              : "bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <Sliders size={15} className={activeTab === "settings" ? "text-red-400" : "text-slate-400"} />
          <span>Listing Page Settings</span>
        </button>

        <button
          onClick={() => setActiveTab("seo")}
          className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
            activeTab === "seo"
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/15 ring-2 ring-slate-900"
              : "bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <Sparkles size={15} className={activeTab === "seo" ? "text-red-400" : "text-slate-400"} />
          <span>SEO & Metadata</span>
        </button>
      </div>

      {/* ── TAB 1: ARTICLES ARCHIVE WITH EXECUTIVE METRICS & PAGINATION ─ */}
      {activeTab === "articles" && (
        <div className="space-y-6">
          
          {/* 4 EXECUTIVE METRIC CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Metric 1: Total Publications */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs relative overflow-hidden flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Publications</span>
                <div className="text-2xl font-black text-slate-900">{totalArticles}</div>
                <div className="text-[11px] text-slate-500 font-medium">{publishedCount} Live · {draftCount} Drafts</div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E62E2D] flex items-center justify-center">
                <BookOpen size={22} />
              </div>
            </div>

            {/* Metric 2: Live Published Articles */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs relative overflow-hidden flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Live Published</span>
                <div className="text-2xl font-black text-emerald-600">{publishedCount}</div>
                <div className="text-[11px] text-emerald-700 font-medium">Active on public site</div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCheck size={22} />
              </div>
            </div>

            {/* Metric 3: Draft Articles */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs relative overflow-hidden flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Draft Articles</span>
                <div className="text-2xl font-black text-amber-600">{draftCount}</div>
                <div className="text-[11px] text-amber-700 font-medium">Unlisted / Work in progress</div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <FileEdit size={22} />
              </div>
            </div>

            {/* Metric 4: Total Structured Blocks */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs relative overflow-hidden flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Structured Blocks</span>
                <div className="text-2xl font-black text-slate-900">{totalBlocks}</div>
                <div className="text-[11px] text-slate-500 font-medium">Headings, links & callouts</div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Layers size={22} />
              </div>
            </div>

          </div>

          {/* ── FILTER, SEARCH & SORT CONTROLS BAR ────────────────── */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
            
            {/* Top row: Status Filter Tabs (All / Published / Drafts) + Domain Category Chips */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-100">
              
              {/* Status Switcher Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl shrink-0">
                <button
                  type="button"
                  onClick={() => handleStatusFilter("all")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    filterStatus === "all" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  All ({totalArticles})
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusFilter("published")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    filterStatus === "published" ? "bg-emerald-600 text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-300" />
                  <span>Published ({publishedCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusFilter("draft")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    filterStatus === "draft" ? "bg-amber-500 text-slate-950 shadow-2xs font-black" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-300" />
                  <span>Drafts ({draftCount})</span>
                </button>
              </div>

              {/* Category Chips Bar with Counts */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
                <span className="text-xs font-bold text-slate-400 mr-1 shrink-0 flex items-center gap-1">
                  <Filter size={13} />
                  <span>Domain:</span>
                </span>

                {["All", ...DEFAULT_CATEGORIES].map((catName) => {
                  const isSelected = filterCategory === catName;
                  const count = categoryCounts[catName] || 0;
                  const Icon = CATEGORY_ICONS[catName] || LayoutGrid;

                  return (
                    <button
                      key={catName}
                      onClick={() => handleCategoryFilter(catName)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                        isSelected
                          ? "bg-[#E62E2D] text-white shadow-md shadow-red-600/20"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80"
                      }`}
                    >
                      <Icon size={12} className={isSelected ? "text-white" : "text-slate-400"} />
                      <span>{catName}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                        isSelected ? "bg-white/25 text-white" : "bg-slate-200/80 text-slate-600"
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Search Input, Sort Select, and Create Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto">
                {/* Search */}
                <div className="relative flex-1 sm:w-80">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search articles by title, author, keyword..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:border-[#E62E2D] transition font-medium"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => handleSearchChange("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Sort Order */}
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 shrink-0">
                  <ArrowUpDown size={13} className="text-slate-400" />
                  <select
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className="text-xs font-bold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="default">Default Archive Order</option>
                    <option value="newest">Newest Date First</option>
                    <option value="oldest">Oldest Date First</option>
                    <option value="title">Title (A to Z)</option>
                    <option value="blocks">Most Content Blocks</option>
                  </select>
                </div>
              </div>

              {/* Compose Button */}
              <button
                onClick={handleStartAddArticle}
                className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-[#E62E2D] to-red-700 hover:from-red-600 hover:to-red-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-red-600/20 transition cursor-pointer shrink-0"
              >
                <Plus size={15} />
                <span>Compose New Article</span>
              </button>

            </div>
          </div>

          {/* ── PREMIUM ARTICLE CARDS LIST ─────────────────────────── */}
          <div className="space-y-3.5">
            {paginatedArticles.map((article: any, index: number) => {
              const originalIndex = articlesList.findIndex((a: any) => a.id === article.id);
              const isFeatured = !!article.featured;
              const isDraft = article.status === "draft";
              const blockCount = article.content?.length || 0;

              return (
                <div
                  key={article.id || index}
                  className={`bg-white p-5 rounded-3xl border transition-all duration-200 flex flex-col lg:flex-row lg:items-center justify-between gap-5 group hover:shadow-lg ${
                    isDraft
                      ? "border-amber-200 bg-amber-50/15"
                      : isFeatured
                      ? "border-red-200/90 shadow-xs bg-gradient-to-r from-red-50/20 via-white to-white"
                      : "border-slate-200/90 shadow-2xs hover:border-slate-300"
                  }`}
                >
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-start sm:items-center gap-4.5 flex-1 min-w-0">
                    
                    {/* High-res Thumbnail */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-950 overflow-hidden shrink-0 border border-slate-200 relative group/img shadow-inner">
                      <img
                        src={article.image || "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=200&auto=format&fit=crop"}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover/img:scale-108 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60" />

                      {/* Featured Indicator Star */}
                      {isFeatured && (
                        <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-lg bg-[#E62E2D] text-white flex items-center justify-center shadow-md" title="Featured Article">
                          <Star size={11} className="fill-white" />
                        </div>
                      )}

                      <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-[9px] font-mono font-bold">
                        {article.readTime || "5 min"}
                      </div>
                    </div>

                    {/* Metadata, Title & Author */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      
                      {/* Top Badges Row */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        
                        {/* Status Badge & 1-Click Toggle */}
                        <button
                          type="button"
                          onClick={(e) => handleToggleStatus(article.id, e)}
                          className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition cursor-pointer ${
                            isDraft
                              ? "bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                          }`}
                          title="Click to toggle between Published and Draft"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isDraft ? "bg-amber-500" : "bg-emerald-500"}`} />
                          <span>{isDraft ? "DRAFT (Unlisted)" : "PUBLISHED (Live)"}</span>
                        </button>

                        <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-800 font-bold text-[11px] uppercase tracking-wider">
                          {article.category || "General"}
                        </span>

                        <span className="text-slate-300 text-[10px]">•</span>

                        <div className="flex items-center gap-1 text-slate-500 text-[11px] font-medium font-mono">
                          <Calendar size={12} className="text-[#E62E2D]" />
                          <span>{article.date}</span>
                        </div>

                        <span className="text-slate-300 text-[10px]">•</span>

                        <div className="flex items-center gap-1 text-slate-600 text-[11px] font-mono font-bold bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                          <Layers size={11} className="text-blue-600" />
                          <span>{blockCount} Blocks</span>
                        </div>

                        {/* Featured Toggle Switch Button */}
                        <button
                          type="button"
                          onClick={(e) => handleToggleFeatured(article.id, e)}
                          className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition cursor-pointer ${
                            isFeatured
                              ? "bg-red-50 text-[#E62E2D] border border-red-200 hover:bg-red-100"
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                          }`}
                          title="Click to toggle featured status"
                        >
                          <Star size={10} className={isFeatured ? "fill-[#E62E2D]" : ""} />
                          <span>{isFeatured ? "Featured" : "Pin"}</span>
                        </button>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-base text-slate-900 line-clamp-1 group-hover:text-[#E62E2D] transition-colors">
                        {article.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-xs text-slate-500 line-clamp-1 leading-relaxed">
                        {article.summary || "No summary excerpt available."}
                      </p>

                      {/* Author Info */}
                      <div className="flex items-center gap-2 pt-0.5 text-[11px] text-slate-400">
                        <span className="font-medium text-slate-600">{article.author || "BiC Engineering"}</span>
                        <span>—</span>
                        <span className="truncate">{article.authorRole || "Technical Advisory"}</span>
                      </div>

                    </div>
                  </div>

                  {/* Right: Reordering & Action Buttons */}
                  <div className="flex items-center gap-3 shrink-0 self-end lg:self-center pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 w-full lg:w-auto justify-between lg:justify-end">
                    
                    {/* Move Up / Down Reorder */}
                    <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-200">
                      <button
                        onClick={() => handleMoveArticle(originalIndex, "up")}
                        disabled={originalIndex === 0}
                        className="p-2 rounded-xl text-slate-600 hover:bg-white hover:text-black hover:shadow-2xs disabled:opacity-25 disabled:hover:bg-transparent transition cursor-pointer"
                        title="Move Article Up"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => handleMoveArticle(originalIndex, "down")}
                        disabled={originalIndex === articlesList.length - 1}
                        className="p-2 rounded-xl text-slate-600 hover:bg-white hover:text-black hover:shadow-2xs disabled:opacity-25 disabled:hover:bg-transparent transition cursor-pointer"
                        title="Move Article Down"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/blog/${article.slug}`}
                        target="_blank"
                        className="p-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-black hover:border-slate-300 transition shadow-2xs"
                        title="Live Article Preview"
                      >
                        <Eye size={15} />
                      </Link>

                      <button
                        onClick={() => handleStartEditArticle(article)}
                        className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-md shadow-slate-900/10 hover:shadow-slate-900/20"
                      >
                        <Edit3 size={13} className="text-red-400" />
                        <span>Edit Content</span>
                      </button>

                      <button
                        onClick={() => handleDeleteArticle(article.id)}
                        className="p-2.5 rounded-2xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer"
                        title="Delete Article"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>

          {/* If No Articles Found */}
          {filteredAndSortedArticles.length === 0 && (
            <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 space-y-3 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E62E2D] flex items-center justify-center mx-auto">
                <Search size={22} />
              </div>
              <h4 className="text-base font-bold text-slate-800">No articles matched your filter criteria</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try switching status (Published / Drafts) or clearing your search term.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setFilterCategory("All");
                  setFilterStatus("all");
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* ── PAGINATION CONTROLS (HIGH-END ENTERPRISE BAR) ──────── */}
          {filteredAndSortedArticles.length > 0 && (
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Left: Range Info & Items Per Page */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span>
                  Showing <span className="font-bold text-slate-900">{startIndex + 1}</span>–
                  <span className="font-bold text-slate-900">
                    {Math.min(startIndex + pageSize, filteredAndSortedArticles.length)}
                  </span>{" "}
                  of <span className="font-bold text-slate-900">{filteredAndSortedArticles.length}</span> publications
                </span>

                <span className="text-slate-300">•</span>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">Show:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(parseInt(e.target.value, 10));
                      setCurrentPage(1);
                    }}
                    className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-slate-50 cursor-pointer"
                  >
                    <option value={4}>4 per page</option>
                    <option value={6}>6 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                  </select>
                </div>
              </div>

              {/* Right: Page Navigation Buttons */}
              <div className="flex items-center gap-1.5">
                
                {/* First Page */}
                <button
                  type="button"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="w-8 h-8 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer shadow-2xs"
                  title="First Page"
                >
                  <ChevronsLeft size={14} />
                </button>

                {/* Previous Page */}
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-8 h-8 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer shadow-2xs"
                  title="Previous Page"
                >
                  <ChevronLeft size={14} />
                </button>

                {/* Page Number Buttons */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  const isActive = pageNum === currentPage;
                  if (
                    totalPages > 7 &&
                    pageNum !== 1 &&
                    pageNum !== totalPages &&
                    Math.abs(pageNum - currentPage) > 2
                  ) {
                    if (Math.abs(pageNum - currentPage) === 3) {
                      return <span key={pageNum} className="text-xs text-slate-400 px-1">...</span>;
                    }
                    return null;
                  }

                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer ${
                        isActive
                          ? "bg-[#E62E2D] text-white shadow-md shadow-red-600/20 ring-2 ring-[#E62E2D]"
                          : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-2xs"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* Next Page */}
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer shadow-2xs"
                  title="Next Page"
                >
                  <ChevronRight size={14} />
                </button>

                {/* Last Page */}
                <button
                  type="button"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer shadow-2xs"
                  title="Last Page"
                >
                  <ChevronsRight size={14} />
                </button>

              </div>

            </div>
          )}

        </div>
      )}

      {/* ── ARTICLE FULL-WIDTH MODAL WITH REAL-TIME LIVE PREVIEW ──── */}
      {showArticleModal && editingArticle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-2 sm:p-4 md:p-6 flex items-center justify-center overflow-hidden">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-[98vw] 2xl:max-w-[1780px] h-[96vh] flex flex-col overflow-hidden shadow-2xl">
            
            {/* Modal Top Header */}
            <div className="bg-white px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 shrink-0">
              
              {/* Left Title & Status */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#E62E2D] flex items-center justify-center shrink-0">
                  <BookOpen size={20} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 truncate">
                      {isNewArticle ? "Compose New Technical Publication" : (editingArticle.title || "Edit Article")}
                    </h3>
                    
                    {/* Status Pill Badge */}
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                      editingArticle.status === "draft"
                        ? "bg-amber-100 text-amber-800 border border-amber-300"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}>
                      {editingArticle.status === "draft" ? "Draft Mode" : "Published (Live)"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    Slug: <span className="font-mono text-slate-600">/blog/{editingArticle.slug || "..."}</span> · {editingArticle.content?.length || 0} Content Blocks
                  </p>
                </div>
              </div>

              {/* Middle Modal Navigation Tabs & Split View Toggle */}
              <div className="flex items-center gap-2">
                
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setModalActiveTab("basics")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      modalActiveTab === "basics"
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    1. Overview & Author
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalActiveTab("content")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      modalActiveTab === "content"
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <FileEdit size={13} className="text-[#E62E2D]" />
                    <span>2. Article Editor (Classic)</span>
                    <span className="px-1.5 py-0.2 bg-red-50 text-[#E62E2D] rounded-md font-mono text-[10px]">
                      {contentStats.words}w
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalActiveTab("seo")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      modalActiveTab === "seo"
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Globe size={13} className="text-blue-600" />
                    <span>3. SEO & Schema</span>
                    <span className={`px-1.5 py-0.2 rounded-md font-mono text-[10px] font-bold ${
                      seoAnalysis.score >= 80
                        ? "bg-emerald-100 text-emerald-800"
                        : seoAnalysis.score >= 50
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {seoAnalysis.score}%
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalActiveTab("preview")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      modalActiveTab === "preview"
                        ? "bg-[#E62E2D] text-white shadow-md shadow-red-600/20"
                        : "text-slate-600 hover:text-slate-900 bg-red-50/50"
                    }`}
                  >
                    <Eye size={13} />
                    <span>4. Live Article Preview</span>
                  </button>
                </div>

                {/* Split Screen Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsSplitView(!isSplitView)}
                  className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    isSplitView
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                  title="Toggle Split-Screen Side-by-Side Editor & Live Preview"
                >
                  <Columns size={15} />
                  <span className="hidden xl:inline">{isSplitView ? "Split Active" : "Split View"}</span>
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowArticleModal(false)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition cursor-pointer shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body (Single Pane or Split Screen View) */}
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-200">
              
              {/* LEFT PANE: ACTIVE EDITOR (Full width if no split, or 55% if split) */}
              <div className={`overflow-y-auto p-6 lg:p-8 space-y-6 ${
                isSplitView ? "md:w-7/12" : modalActiveTab === "preview" ? "hidden" : "w-full"
              }`}>
                
                {/* ── MODAL TAB A: OVERVIEW & AUTHOR ─────────────────────── */}
                {modalActiveTab === "basics" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Article Title
                        </label>
                        <input
                          type="text"
                          value={editingArticle.title || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditingArticle((prev: any) => ({
                              ...prev,
                              title: val,
                              slug: isNewArticle ? val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") : prev.slug,
                            }));
                          }}
                          className="w-full px-4 py-2.5 text-sm font-bold rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#E62E2D] text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          URL Slug (/blog/[slug])
                        </label>
                        <input
                          type="text"
                          value={editingArticle.slug || ""}
                          onChange={(e) => setEditingArticle((prev: any) => ({ ...prev, slug: e.target.value }))}
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white font-mono text-slate-700"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Domain Category
                        </label>
                        <select
                          value={editingArticle.category || "Construction"}
                          onChange={(e) => setEditingArticle((prev: any) => ({ ...prev, category: e.target.value }))}
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white font-medium"
                        >
                          {DEFAULT_CATEGORIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Publication Date
                        </label>
                        <input
                          type="text"
                          value={editingArticle.date || ""}
                          onChange={(e) => setEditingArticle((prev: any) => ({ ...prev, date: e.target.value }))}
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Estimated Read Time
                        </label>
                        <input
                          type="text"
                          value={editingArticle.readTime || "5 min read"}
                          onChange={(e) => setEditingArticle((prev: any) => ({ ...prev, readTime: e.target.value }))}
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Featured Banner Image URL
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editingArticle.image || ""}
                            onChange={(e) => setEditingArticle((prev: any) => ({ ...prev, image: e.target.value }))}
                            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => openMediaFor("editingArticle.image")}
                            className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                          >
                            <Upload size={13} />
                            <span>Media Library</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Author Name
                        </label>
                        <input
                          type="text"
                          value={editingArticle.author || ""}
                          onChange={(e) => setEditingArticle((prev: any) => ({ ...prev, author: e.target.value }))}
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Author Technical Title
                        </label>
                        <input
                          type="text"
                          value={editingArticle.authorRole || ""}
                          onChange={(e) => setEditingArticle((prev: any) => ({ ...prev, authorRole: e.target.value }))}
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Summary Excerpt (Card Summary)
                        </label>
                        <textarea
                          rows={2}
                          value={editingArticle.summary || ""}
                          onChange={(e) => setEditingArticle((prev: any) => ({ ...prev, summary: e.target.value }))}
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white leading-relaxed"
                        />
                      </div>

                      {/* Topic Tags */}
                      <div className="md:col-span-2 space-y-2">
                        <label className="block text-xs font-bold text-slate-700">
                          Topic Tags
                        </label>
                        <div className="flex flex-wrap items-center gap-2">
                          {(editingArticle.tags || []).map((tag: string, tagIdx: number) => (
                            <span
                              key={tagIdx}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-medium text-slate-700 flex items-center gap-1.5"
                            >
                              <span>#{tag}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="text-slate-400 hover:text-red-600 transition"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))}
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              placeholder="Add tag..."
                              value={newTagInput}
                              onChange={(e) => setNewTagInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddTag();
                                }
                              }}
                              className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white w-28 focus:w-36 transition-all"
                            />
                            <button
                              type="button"
                              onClick={handleAddTag}
                              className="p-1.5 rounded-lg bg-slate-900 text-white hover:bg-black transition cursor-pointer"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="flex items-center gap-2.5 cursor-pointer bg-red-50/50 p-3 rounded-2xl border border-red-100">
                          <input
                            type="checkbox"
                            checked={editingArticle.featured || false}
                            onChange={(e) => setEditingArticle((prev: any) => ({ ...prev, featured: e.target.checked }))}
                            className="w-4 h-4 rounded text-[#E62E2D] focus:ring-red-500"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <Star size={13} className="text-[#E62E2D] fill-[#E62E2D]" />
                              <span>Pin as Featured Article (Top Priority Placement)</span>
                            </span>
                            <p className="text-[11px] text-slate-500">Displays with special badge on the listing page and in related sidebars.</p>
                          </div>
                        </label>
                      </div>

                    </div>
                  </div>
                )}

                {/* ── MODAL TAB B: WORDPRESS CLASSIC STYLE EDITOR ─────────────── */}
                {modalActiveTab === "content" && (
                  <div className="space-y-4">
                    {/* Header Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <FileEdit size={16} className="text-[#E62E2D]" />
                          <span>WordPress Classic Article Editor</span>
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Continuous full-article visual canvas and direct HTML source mode. No fragmented blocks needed.
                        </p>
                      </div>
                      
                      {/* Editor Mode Tabs (Visual / Text HTML) */}
                      <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => {
                            if (editorMode !== "visual" && visualEditorRef.current) {
                              visualEditorRef.current.innerHTML = editingArticle.bodyHtml || "";
                            }
                            setEditorMode("visual");
                          }}
                          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                            editorMode === "visual"
                              ? "bg-white text-slate-900 shadow-xs border border-slate-200/80"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          <Eye size={13} className={editorMode === "visual" ? "text-[#E62E2D]" : ""} />
                          <span>Visual</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditorMode("html")}
                          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                            editorMode === "html"
                              ? "bg-white text-slate-900 shadow-xs border border-slate-200/80"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          <Code size={13} className={editorMode === "html" ? "text-[#E62E2D]" : ""} />
                          <span>Text (HTML)</span>
                        </button>
                      </div>
                    </div>

                    {/* Classic "Add Media" & Custom Component Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-50/90 p-2.5 rounded-2xl border border-slate-200/90">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Add Media Button */}
                        <button
                          type="button"
                          onClick={() => setWpImageModal({ isOpen: true, url: "", alt: "", caption: "", align: "none" })}
                          className="px-3.5 py-1.5 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                        >
                          <Camera size={14} className="text-[#E62E2D]" />
                          <span>Add Media / Image</span>
                        </button>

                        {/* Add CTA Button */}
                        <button
                          type="button"
                          onClick={() => setWpButtonModal({ isOpen: true, label: "Explore Solutions", url: "/services", style: "primary", openInNewTab: true })}
                          className="px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                        >
                          <LinkIcon size={13} className="text-blue-600" />
                          <span>+ CTA Button</span>
                        </button>

                        {/* Add Callout Box */}
                        <button
                          type="button"
                          onClick={() => setWpCalloutModal({ isOpen: true, variant: "standard", title: "Compliance Benchmark", text: "" })}
                          className="px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                        >
                          <CheckCircle2 size={13} className="text-emerald-600" />
                          <span>+ Benchmark Callout</span>
                        </button>

                        {/* Add Lead Highlight */}
                        <button
                          type="button"
                          onClick={() => handleInsertHtml('<div class="lead-box"><p>Executive summary key insight highlighting critical project metrics and standards.</p></div>')}
                          className="px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                        >
                          <Sparkles size={13} className="text-amber-500" />
                          <span>+ Lead Box</span>
                        </button>
                      </div>

                      {/* Live Word Metric Badge */}
                      <div className="text-[11px] font-mono text-slate-500 px-2 py-1 bg-white rounded-lg border border-slate-200">
                        <span className="font-bold text-slate-800">{contentStats.words}</span> words · <span className="font-bold text-slate-800">{contentStats.readTimeMinutes}</span> min read
                      </div>
                    </div>

                    {/* WordPress Editor Container Frame */}
                    <div className="border border-slate-300 rounded-2xl overflow-hidden shadow-sm bg-white focus-within:border-slate-400 transition">
                      
                      {/* Classic WP Formatting Toolbar */}
                      <div className="bg-slate-100 border-b border-slate-200 px-3 py-2 flex flex-wrap items-center gap-1">
                        
                        {/* Heading / Format Selector */}
                        <div className="flex items-center gap-1.5 mr-1">
                          <select
                            value={["h1", "h2", "h3", "h4", "blockquote", "lead", "p"].includes(activeBlockTag) ? activeBlockTag : "p"}
                            onChange={(e) => {
                              handleInsertFormatBlock(e.target.value);
                            }}
                            title="Paragraph / Heading Format"
                            className="text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 hover:border-slate-400 focus:border-[#E62E2D] cursor-pointer shadow-2xs"
                          >
                            <option value="p">Paragraph (Normal Text)</option>
                            <option value="h2">Heading 2 (H2 - Major Section)</option>
                            <option value="h3">Heading 3 (H3 - Sub Section)</option>
                            <option value="h4">Heading 4 (H4 - Topic Header)</option>
                            <option value="blockquote">Blockquote (Quote Callout)</option>
                            <option value="lead">Lead Highlight Box</option>
                          </select>

                          {/* Dynamic Active Heading / Format Pill Indicator */}
                          {activeBlockTag === "h2" && (
                            <span className="px-2.5 py-1 rounded-lg bg-red-100 text-[#E62E2D] font-mono text-[11px] font-black border border-red-200 flex items-center gap-1 shadow-2xs">
                              <span>&lt;H2&gt;</span>
                              <span className="text-[10px] font-semibold text-red-700 hidden sm:inline">Heading 2</span>
                            </span>
                          )}
                          {activeBlockTag === "h3" && (
                            <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 font-mono text-[11px] font-black border border-amber-200 flex items-center gap-1 shadow-2xs">
                              <span>&lt;H3&gt;</span>
                              <span className="text-[10px] font-semibold text-amber-700 hidden sm:inline">Heading 3</span>
                            </span>
                          )}
                          {activeBlockTag === "h4" && (
                            <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 font-mono text-[11px] font-black border border-blue-200 flex items-center gap-1 shadow-2xs">
                              <span>&lt;H4&gt;</span>
                              <span className="text-[10px] font-semibold text-blue-700 hidden sm:inline">Heading 4</span>
                            </span>
                          )}
                          {activeBlockTag === "h1" && (
                            <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 font-mono text-[11px] font-black border border-rose-200 flex items-center gap-1 shadow-2xs">
                              <span>&lt;H1&gt;</span>
                              <span className="text-[10px] font-semibold text-rose-700 hidden sm:inline">Heading 1</span>
                            </span>
                          )}
                          {activeBlockTag === "blockquote" && (
                            <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 font-mono text-[11px] font-bold border border-purple-200 flex items-center gap-1 shadow-2xs">
                              <span>&lt;quote&gt;</span>
                            </span>
                          )}
                          {activeBlockTag === "lead" && (
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-mono text-[11px] font-bold border border-emerald-200 flex items-center gap-1 shadow-2xs">
                              <span>&lt;lead-box&gt;</span>
                            </span>
                          )}
                          {activeBlockTag === "p" && (
                            <span className="px-2 py-0.5 rounded-lg bg-slate-200/80 text-slate-600 font-mono text-[10px] font-bold border border-slate-300 hidden sm:inline">
                              &lt;p&gt;
                            </span>
                          )}
                        </div>

                        <div className="w-px h-5 bg-slate-300 mx-1" />

                        {/* Bold */}
                        <button
                          type="button"
                          title="Bold (Ctrl+B)"
                          onClick={() => handleExecCommand("bold")}
                          className="p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-black transition cursor-pointer border border-transparent hover:border-slate-200"
                        >
                          <Bold size={14} />
                        </button>

                        {/* Italic */}
                        <button
                          type="button"
                          title="Italic (Ctrl+I)"
                          onClick={() => handleExecCommand("italic")}
                          className="p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-black transition cursor-pointer border border-transparent hover:border-slate-200"
                        >
                          <Italic size={14} />
                        </button>

                        {/* Underline */}
                        <button
                          type="button"
                          title="Underline (Ctrl+U)"
                          onClick={() => handleExecCommand("underline")}
                          className="p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-black transition cursor-pointer border border-transparent hover:border-slate-200"
                        >
                          <UnderlineIcon size={14} />
                        </button>

                        {/* Strikethrough */}
                        <button
                          type="button"
                          title="Strikethrough"
                          onClick={() => handleExecCommand("strikeThrough")}
                          className="p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-black transition cursor-pointer border border-transparent hover:border-slate-200"
                        >
                          <Strikethrough size={14} />
                        </button>

                        <div className="w-px h-5 bg-slate-300 mx-1" />

                        {/* Bulleted List */}
                        <button
                          type="button"
                          title="Bulleted List"
                          onClick={() => handleExecCommand("insertUnorderedList")}
                          className="p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-black transition cursor-pointer border border-transparent hover:border-slate-200"
                        >
                          <ListIcon size={14} />
                        </button>

                        {/* Numbered List */}
                        <button
                          type="button"
                          title="Numbered List"
                          onClick={() => handleExecCommand("insertOrderedList")}
                          className="p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-black transition cursor-pointer border border-transparent hover:border-slate-200"
                        >
                          <ListOrdered size={14} />
                        </button>

                        {/* Blockquote */}
                        <button
                          type="button"
                          title="Blockquote"
                          onClick={() => handleInsertFormatBlock("blockquote")}
                          className="p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-black transition cursor-pointer border border-transparent hover:border-slate-200"
                        >
                          <Quote size={14} />
                        </button>

                        <div className="w-px h-5 bg-slate-300 mx-1" />

                        {/* Align Left */}
                        <button
                          type="button"
                          title="Align Left"
                          onClick={() => handleExecCommand("justifyLeft")}
                          className="p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-black transition cursor-pointer border border-transparent hover:border-slate-200"
                        >
                          <AlignLeft size={14} />
                        </button>

                        {/* Align Center */}
                        <button
                          type="button"
                          title="Align Center"
                          onClick={() => handleExecCommand("justifyCenter")}
                          className="p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-black transition cursor-pointer border border-transparent hover:border-slate-200"
                        >
                          <AlignCenter size={14} />
                        </button>

                        {/* Align Right */}
                        <button
                          type="button"
                          title="Align Right"
                          onClick={() => handleExecCommand("justifyRight")}
                          className="p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-black transition cursor-pointer border border-transparent hover:border-slate-200"
                        >
                          <AlignRight size={14} />
                        </button>

                        {/* Justify */}
                        <button
                          type="button"
                          title="Justify Full"
                          onClick={() => handleExecCommand("justifyFull")}
                          className="p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-black transition cursor-pointer border border-transparent hover:border-slate-200"
                        >
                          <AlignJustify size={14} />
                        </button>

                        <div className="w-px h-5 bg-slate-300 mx-1" />

                        {/* Insert / Edit Link */}
                        <button
                          type="button"
                          title="Insert / Edit Link"
                          onClick={() => {
                            let selectedText = "";
                            if (typeof window !== "undefined") {
                              const sel = window.getSelection();
                              if (sel) selectedText = sel.toString();
                            }
                            setWpLinkModal({
                              isOpen: true,
                              text: selectedText || "Learn More",
                              url: "https://",
                              openInNewTab: true,
                            });
                          }}
                          className="p-1.5 rounded-lg hover:bg-white text-blue-700 hover:text-blue-900 transition cursor-pointer border border-transparent hover:border-slate-200"
                        >
                          <LinkIcon size={14} />
                        </button>

                        {/* Remove Link */}
                        <button
                          type="button"
                          title="Remove Link"
                          onClick={() => handleExecCommand("unlink")}
                          className="p-1.5 rounded-lg hover:bg-white text-slate-500 hover:text-red-600 transition cursor-pointer border border-transparent hover:border-slate-200"
                        >
                          <X size={14} />
                        </button>

                        {/* Horizontal Line */}
                        <button
                          type="button"
                          title="Insert Horizontal Line"
                          onClick={() => handleExecCommand("insertHorizontalRule")}
                          className="p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-black transition cursor-pointer border border-transparent hover:border-slate-200"
                        >
                          <Minus size={14} />
                        </button>

                        {/* Remove Formatting */}
                        <button
                          type="button"
                          title="Clear Formatting"
                          onClick={() => handleExecCommand("removeFormat")}
                          className="p-1.5 rounded-lg hover:bg-white text-slate-500 hover:text-slate-800 transition cursor-pointer border border-transparent hover:border-slate-200"
                        >
                          <Eraser size={14} />
                        </button>

                      </div>

                      {/* Active Editor Canvas Area */}
                      {editorMode === "visual" ? (
                        <div
                          ref={visualEditorRef}
                          contentEditable
                          suppressContentEditableWarning
                          onInput={(e) => {
                            const html = e.currentTarget.innerHTML;
                            setEditingArticle((prev: any) => ({ ...prev, bodyHtml: html }));
                            detectActiveBlockTag();
                          }}
                          onKeyUp={detectActiveBlockTag}
                          onMouseUp={detectActiveBlockTag}
                          onClick={detectActiveBlockTag}
                          onFocus={detectActiveBlockTag}
                          className="w-full min-h-[480px] max-h-[640px] p-6 bg-white outline-none focus:outline-none blog-prose-content text-slate-800 text-sm leading-relaxed overflow-y-auto"
                          style={{ minHeight: "480px" }}
                        />
                      ) : (
                        <textarea
                          value={editingArticle.bodyHtml || ""}
                          onChange={(e) => {
                            setEditingArticle((prev: any) => ({ ...prev, bodyHtml: e.target.value }));
                          }}
                          className="w-full min-h-[480px] max-h-[640px] p-5 bg-slate-950 text-slate-100 font-mono text-xs leading-relaxed outline-none focus:outline-none resize-y border-0"
                          style={{ minHeight: "480px" }}
                          placeholder="<p>Enter clean article HTML here or use Visual mode...</p>"
                        />
                      )}

                      {/* Footer Word Count & Helper Bar */}
                      <div className="bg-slate-50 border-t border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                        <div className="flex items-center gap-4">
                          <span>
                            Word count: <strong className="text-slate-800 font-semibold">{contentStats.words}</strong>
                          </span>
                          <span>
                            Characters: <strong className="text-slate-800 font-semibold">{contentStats.chars}</strong>
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {editorMode === "visual"
                            ? "Press Enter for new paragraph, Shift+Enter for soft line break"
                            : "HTML mode active: edits will sync directly to live preview"}
                        </div>
                      </div>

                    </div>

                    {/* ── SUB-MODAL 1: INSERT LINK MODAL ── */}
                    {wpLinkModal.isOpen && (
                      <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 space-y-4">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                              <LinkIcon size={16} className="text-[#E62E2D]" />
                              <span>Insert / Edit Hyperlink</span>
                            </h4>
                            <button
                              type="button"
                              onClick={() => setWpLinkModal((prev) => ({ ...prev, isOpen: false }))}
                              className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                            >
                              <X size={16} />
                            </button>
                          </div>

                          <div className="space-y-3 text-xs">
                            <div>
                              <label className="font-bold text-slate-700 block mb-1">Link URL (Destination)</label>
                              <input
                                type="text"
                                value={wpLinkModal.url}
                                onChange={(e) => setWpLinkModal((prev) => ({ ...prev, url: e.target.value }))}
                                placeholder="https://example.com or /services"
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#E62E2D] text-xs font-mono"
                              />
                            </div>

                            <div>
                              <label className="font-bold text-slate-700 block mb-1">Link Text (Anchor Label)</label>
                              <input
                                type="text"
                                value={wpLinkModal.text}
                                onChange={(e) => setWpLinkModal((prev) => ({ ...prev, text: e.target.value }))}
                                placeholder="e.g. Read Aramco Engineering Guidelines"
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#E62E2D] text-xs font-medium"
                              />
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer pt-1">
                              <input
                                type="checkbox"
                                checked={wpLinkModal.openInNewTab}
                                onChange={(e) => setWpLinkModal((prev) => ({ ...prev, openInNewTab: e.target.checked }))}
                                className="w-4 h-4 rounded text-[#E62E2D] focus:ring-red-500"
                              />
                              <span className="text-slate-700 font-semibold">Open link in new tab (target="_blank")</span>
                            </label>
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => setWpLinkModal((prev) => ({ ...prev, isOpen: false }))}
                              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleApplyWpLink}
                              className="px-4 py-2 rounded-xl bg-[#E62E2D] text-white hover:bg-red-700 text-xs font-bold transition shadow-xs"
                            >
                              Insert Link
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── SUB-MODAL 2: INSERT CTA BUTTON MODAL ── */}
                    {wpButtonModal.isOpen && (
                      <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 space-y-4">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                              <Sparkles size={16} className="text-[#E62E2D]" />
                              <span>Insert Interactive CTA Button</span>
                            </h4>
                            <button
                              type="button"
                              onClick={() => setWpButtonModal((prev) => ({ ...prev, isOpen: false }))}
                              className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                            >
                              <X size={16} />
                            </button>
                          </div>

                          <div className="space-y-3 text-xs">
                            <div>
                              <label className="font-bold text-slate-700 block mb-1">Button Text</label>
                              <input
                                type="text"
                                value={wpButtonModal.label}
                                onChange={(e) => setWpButtonModal((prev) => ({ ...prev, label: e.target.value }))}
                                placeholder="e.g. Request Industrial Equipment Quote"
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#E62E2D] text-xs font-medium"
                              />
                            </div>

                            <div>
                              <label className="font-bold text-slate-700 block mb-1">Button Link URL</label>
                              <input
                                type="text"
                                value={wpButtonModal.url}
                                onChange={(e) => setWpButtonModal((prev) => ({ ...prev, url: e.target.value }))}
                                placeholder="e.g. /contact or /services"
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#E62E2D] text-xs font-mono"
                              />
                            </div>

                            <div>
                              <label className="font-bold text-slate-700 block mb-1">Visual Style</label>
                              <select
                                value={wpButtonModal.style}
                                onChange={(e) => setWpButtonModal((prev) => ({ ...prev, style: e.target.value }))}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#E62E2D] text-xs font-bold"
                              >
                                <option value="primary">Brand Red Accent (Primary CTA)</option>
                                <option value="dark">Solid Dark Slate</option>
                                <option value="outline">Clean Light Outline</option>
                              </select>
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer pt-1">
                              <input
                                type="checkbox"
                                checked={wpButtonModal.openInNewTab}
                                onChange={(e) => setWpButtonModal((prev) => ({ ...prev, openInNewTab: e.target.checked }))}
                                className="w-4 h-4 rounded text-[#E62E2D] focus:ring-red-500"
                              />
                              <span className="text-slate-700 font-semibold">Open in new tab</span>
                            </label>
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => setWpButtonModal((prev) => ({ ...prev, isOpen: false }))}
                              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleApplyWpButton}
                              className="px-4 py-2 rounded-xl bg-[#E62E2D] text-white hover:bg-red-700 text-xs font-bold transition shadow-xs"
                            >
                              Insert Button
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── SUB-MODAL 3: INSERT BENCHMARK / CALLOUT BOX ── */}
                    {wpCalloutModal.isOpen && (
                      <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 space-y-4">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                              <CheckCircle2 size={16} className="text-[#E62E2D]" />
                              <span>Insert Benchmark / Callout Box</span>
                            </h4>
                            <button
                              type="button"
                              onClick={() => setWpCalloutModal((prev) => ({ ...prev, isOpen: false }))}
                              className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                            >
                              <X size={16} />
                            </button>
                          </div>

                          <div className="space-y-3 text-xs">
                            <div>
                              <label className="font-bold text-slate-700 block mb-1">Callout Type / Tone</label>
                              <select
                                value={wpCalloutModal.variant}
                                onChange={(e) => setWpCalloutModal((prev) => ({ ...prev, variant: e.target.value }))}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#E62E2D] text-xs font-bold"
                              >
                                <option value="standard">Standard Red Accent (Compliance Benchmark)</option>
                                <option value="info">Blue Insight (Operational Notice)</option>
                                <option value="warning">Amber Caution (Critical Safety Warning)</option>
                              </select>
                            </div>

                            <div>
                              <label className="font-bold text-slate-700 block mb-1">Header Title</label>
                              <input
                                type="text"
                                value={wpCalloutModal.title}
                                onChange={(e) => setWpCalloutModal((prev) => ({ ...prev, title: e.target.value }))}
                                placeholder="e.g. Saudi Aramco Safety Benchmark"
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#E62E2D] text-xs font-medium"
                              />
                            </div>

                            <div>
                              <label className="font-bold text-slate-700 block mb-1">Benchmark Message</label>
                              <textarea
                                value={wpCalloutModal.text}
                                onChange={(e) => setWpCalloutModal((prev) => ({ ...prev, text: e.target.value }))}
                                rows={3}
                                placeholder="Describe the engineering standard, compliance rule, or benchmark..."
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#E62E2D] text-xs font-normal"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => setWpCalloutModal((prev) => ({ ...prev, isOpen: false }))}
                              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleApplyWpCallout}
                              className="px-4 py-2 rounded-xl bg-[#E62E2D] text-white hover:bg-red-700 text-xs font-bold transition shadow-xs"
                            >
                              Insert Callout Box
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── SUB-MODAL 4: INSERT MEDIA IMAGE ── */}
                    {wpImageModal.isOpen && (
                      <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-200 space-y-4">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                              <ImageIcon size={16} className="text-[#E62E2D]" />
                              <span>Insert Media / Image</span>
                            </h4>
                            <button
                              type="button"
                              onClick={() => setWpImageModal((prev) => ({ ...prev, isOpen: false }))}
                              className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                            >
                              <X size={16} />
                            </button>
                          </div>

                          <div className="space-y-3 text-xs">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="font-bold text-slate-700">Image Source URL</label>
                                <button
                                  type="button"
                                  onClick={() => openMediaFor("wpImageModal.url")}
                                  className="text-[11px] font-bold text-[#E62E2D] hover:underline flex items-center gap-1"
                                >
                                  <Upload size={11} />
                                  <span>Choose from Media Library</span>
                                </button>
                              </div>
                              <input
                                type="text"
                                value={wpImageModal.url}
                                onChange={(e) => setWpImageModal((prev) => ({ ...prev, url: e.target.value }))}
                                placeholder="https://images.unsplash.com/... or /images/..."
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#E62E2D] text-xs font-mono"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="font-bold text-slate-700 block mb-1">Alt Text (SEO & Access)</label>
                                <input
                                  type="text"
                                  value={wpImageModal.alt}
                                  onChange={(e) => setWpImageModal((prev) => ({ ...prev, alt: e.target.value }))}
                                  placeholder="e.g. Heavy crane operations"
                                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#E62E2D] text-xs"
                                />
                              </div>

                              <div>
                                <label className="font-bold text-slate-700 block mb-1">Alignment</label>
                                <select
                                  value={wpImageModal.align}
                                  onChange={(e) => setWpImageModal((prev) => ({ ...prev, align: e.target.value }))}
                                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#E62E2D] text-xs font-bold"
                                >
                                  <option value="none">Full Width / Default</option>
                                  <option value="center">Centered</option>
                                  <option value="right">Right Aligned</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="font-bold text-slate-700 block mb-1">Caption (Optional)</label>
                              <input
                                type="text"
                                value={wpImageModal.caption}
                                onChange={(e) => setWpImageModal((prev) => ({ ...prev, caption: e.target.value }))}
                                placeholder="e.g. On-site industrial engineering quality inspection."
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#E62E2D] text-xs"
                              />
                            </div>

                            {/* Image Preview Thumbnail */}
                            {wpImageModal.url && (
                              <div className="p-2 rounded-2xl border border-slate-200 bg-slate-50 flex items-center gap-3">
                                <img
                                  src={wpImageModal.url}
                                  alt="Preview"
                                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 bg-black"
                                />
                                <div className="text-[11px] text-slate-500 overflow-hidden text-ellipsis">
                                  <p className="font-bold text-slate-800">Media Preview</p>
                                  <p className="truncate">{wpImageModal.url}</p>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => setWpImageModal((prev) => ({ ...prev, isOpen: false }))}
                              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleApplyWpImage}
                              disabled={!wpImageModal.url.trim()}
                              className="px-4 py-2 rounded-xl bg-[#E62E2D] text-white hover:bg-red-700 disabled:opacity-50 text-xs font-bold transition shadow-xs"
                            >
                              Insert Into Post
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                )}
                
                {/* ── MODAL TAB C: SEO, HREFLANG, CANONICAL & SCHEMA SUITE ── */}
                {modalActiveTab === "seo" && (
                  <div className="space-y-6">

                    {/* Top SEO Health Audit Banner */}
                    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 p-6 rounded-3xl text-white shadow-xl space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-400/30">
                            <Globe size={20} />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                              <span>Search Engine Optimization & Structured Data Suite</span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/30 text-blue-200 border border-blue-400/30">
                                Google & Schema.org Compliant
                              </span>
                            </h4>
                            <p className="text-xs text-slate-300">
                              Optimize search visibility, canonical URLs, hreflang language alternates, social sharing cards, and JSON-LD structured data.
                            </p>
                          </div>
                        </div>

                        {/* Overall SEO Score Pill */}
                        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 flex items-center gap-3 shrink-0">
                          <div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">SEO Health Score</div>
                            <div className="text-lg font-black text-white flex items-center gap-1.5">
                              <span>{seoAnalysis.score}</span>
                              <span className="text-xs text-slate-400 font-medium">/ 100</span>
                            </div>
                          </div>
                          <div className={`w-3 h-3 rounded-full ${
                            seoAnalysis.score >= 80
                              ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                              : seoAnalysis.score >= 50
                              ? "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]"
                              : "bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.8)]"
                          }`} />
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="w-full bg-slate-700/60 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 rounded-full ${
                              seoAnalysis.score >= 80 ? "bg-gradient-to-r from-emerald-500 to-teal-400" : seoAnalysis.score >= 50 ? "bg-gradient-to-r from-amber-500 to-yellow-400" : "bg-gradient-to-r from-red-500 to-rose-400"
                            }`}
                            style={{ width: `${seoAnalysis.score}%` }}
                          />
                        </div>
                        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-300 gap-2">
                          <div className="flex items-center gap-3">
                            <span>Focus Keyword: <strong className="text-white">{editingArticle.focusKeyword ? `"${editingArticle.focusKeyword}"` : "Not set"}</strong></span>
                            <span>•</span>
                            <span>Occurrences: <strong className="text-white">{seoAnalysis.kwCount}</strong></span>
                            <span>•</span>
                            <span>Schema: <strong className="text-blue-300">{editingArticle.schemaType || "TechArticle"}</strong></span>
                          </div>
                          <span className="text-slate-400">
                            {seoAnalysis.score >= 80 ? "🎉 Highly Optimized for Google Search" : "⚠️ Add focus keyword & meta details to boost score"}
                          </span>
                        </div>
                      </div>

                      {/* SEO Sub-Navigation Tabs Bar */}
                      <div className="pt-2 flex flex-wrap gap-1.5 border-t border-slate-700/60">
                        <button
                          type="button"
                          onClick={() => setSeoSubTab("serp")}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            seoSubTab === "serp"
                              ? "bg-white text-slate-900 shadow-md"
                              : "text-slate-300 hover:text-white hover:bg-slate-800"
                          }`}
                        >
                          <Search size={13} />
                          <span>1. Google SERP & Metadata</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSeoSubTab("keywords")}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            seoSubTab === "keywords"
                              ? "bg-white text-slate-900 shadow-md"
                              : "text-slate-300 hover:text-white hover:bg-slate-800"
                          }`}
                        >
                          <Tag size={13} />
                          <span>2. Focus Keywords ({seoAnalysis.kwCount})</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSeoSubTab("canonical")}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            seoSubTab === "canonical"
                              ? "bg-white text-slate-900 shadow-md"
                              : "text-slate-300 hover:text-white hover:bg-slate-800"
                          }`}
                        >
                          <Languages size={13} />
                          <span>3. Canonical & Hreflang</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSeoSubTab("schema")}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            seoSubTab === "schema"
                              ? "bg-white text-slate-900 shadow-md"
                              : "text-slate-300 hover:text-white hover:bg-slate-800"
                          }`}
                        >
                          <FileCode size={13} />
                          <span>4. Schema.org JSON-LD</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSeoSubTab("social")}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            seoSubTab === "social"
                              ? "bg-white text-slate-900 shadow-md"
                              : "text-slate-300 hover:text-white hover:bg-slate-800"
                          }`}
                        >
                          <Share2 size={13} />
                          <span>5. Social Sharing (OG)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSeoSubTab("indexing")}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            seoSubTab === "indexing"
                              ? "bg-white text-slate-900 shadow-md"
                              : "text-slate-300 hover:text-white hover:bg-slate-800"
                          }`}
                        >
                          <ShieldCheck size={13} />
                          <span>6. Robots Indexing</span>
                        </button>
                      </div>

                    </div>

                    {/* ── SUB-TAB 1: GOOGLE SERP SNIPPET & CORE METADATA ──────── */}
                    {seoSubTab === "serp" && (
                      <div className="space-y-6">
                        {/* Google SERP Live Simulation Box */}
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                              <Globe size={15} className="text-blue-600" />
                              <span>Google Search Engine Results Snippet (SERP)</span>
                            </span>
                            
                            {/* SERP Device Switcher */}
                            <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl">
                              <button
                                type="button"
                                onClick={() => setSeoSerpDevice("desktop")}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                                  seoSerpDevice === "desktop" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                                }`}
                              >
                                <Monitor size={12} />
                                <span>Desktop</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setSeoSerpDevice("mobile")}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                                  seoSerpDevice === "mobile" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                                }`}
                              >
                                <Smartphone size={12} />
                                <span>Mobile</span>
                              </button>
                            </div>
                          </div>

                          {/* SERP Box */}
                          <div className={`p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-1.5 font-sans transition-all ${
                            seoSerpDevice === "mobile" ? "max-w-md mx-auto" : "w-full"
                          }`}>
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <div className="w-5 h-5 rounded-full bg-red-100 text-[#E62E2D] font-black text-[10px] flex items-center justify-center shrink-0">
                                B
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="font-medium text-slate-800 text-[11px] leading-tight">Best International Contracting</span>
                                <span className="text-slate-400 text-[10px] truncate leading-tight">
                                  https://bestinternational.com.sa › blog › {editingArticle.slug || "article-slug"}
                                </span>
                              </div>
                            </div>
                            <div className="text-blue-700 hover:underline text-base sm:text-lg font-medium line-clamp-1 cursor-pointer pt-0.5">
                              {editingArticle.seoTitle || `${editingArticle.title || "Article Title"} - BiC Technical Insights`}
                            </div>
                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                              {editingArticle.seoDescription || editingArticle.summary || "Explore industrial contracting, safety guidelines, and turnkey engineering insights across Saudi Arabia."}
                            </p>
                          </div>

                          {/* Character Meters Bar */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200 text-xs">
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-slate-600">
                                <span>Meta Title Length:</span>
                                <span className={`font-bold ${
                                  seoAnalysis.isTitleOptimal ? "text-emerald-700" : seoAnalysis.isTitleWarning ? "text-amber-600" : "text-slate-500"
                                }`}>
                                  {seoAnalysis.titleLen} / 60 characters
                                </span>
                              </div>
                              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    seoAnalysis.isTitleOptimal ? "bg-emerald-500" : seoAnalysis.titleLen > 65 ? "bg-red-500" : "bg-amber-400"
                                  }`}
                                  style={{ width: `${Math.min((seoAnalysis.titleLen / 60) * 100, 100)}%` }}
                                />
                              </div>
                              <p className="text-[10px] text-slate-400">Optimal Google title range is 40 to 60 characters.</p>
                            </div>

                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-slate-600">
                                <span>Meta Description Length:</span>
                                <span className={`font-bold ${
                                  seoAnalysis.isDescOptimal ? "text-emerald-700" : seoAnalysis.isDescWarning ? "text-amber-600" : "text-slate-500"
                                }`}>
                                  {seoAnalysis.descLen} / 160 characters
                                </span>
                              </div>
                              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    seoAnalysis.isDescOptimal ? "bg-emerald-500" : seoAnalysis.descLen > 165 ? "bg-red-500" : "bg-amber-400"
                                  }`}
                                  style={{ width: `${Math.min((seoAnalysis.descLen / 160) * 100, 100)}%` }}
                                />
                              </div>
                              <p className="text-[10px] text-slate-400">Optimal search snippet range is 120 to 160 characters.</p>
                            </div>
                          </div>

                        </div>

                        {/* Interactive Title & Description Inputs */}
                        <div className="grid grid-cols-1 gap-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                <FileText size={13} className="text-[#E62E2D]" />
                                <span>Custom SEO Meta Title Tag</span>
                              </label>
                              <button
                                type="button"
                                onClick={() => setEditingArticle((prev: any) => ({ ...prev, seoTitle: `${prev.title} - BiC Technical Insights` }))}
                                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                              >
                                Auto-fill from Article Title
                              </button>
                            </div>
                            <input
                              type="text"
                              value={editingArticle.seoTitle || ""}
                              placeholder={`${editingArticle.title || "Article Title"} - BiC Technical Insights`}
                              onChange={(e) => setEditingArticle((prev: any) => ({ ...prev, seoTitle: e.target.value }))}
                              className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white text-slate-900 focus:outline-none focus:border-blue-500"
                            />
                            <p className="text-[11px] text-slate-500 mt-1">
                              Custom &lt;title&gt; for Google search results and browser tab names.
                            </p>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                <FileText size={13} className="text-[#E62E2D]" />
                                <span>Custom SEO Meta Description</span>
                              </label>
                              <button
                                type="button"
                                onClick={() => setEditingArticle((prev: any) => ({ ...prev, seoDescription: prev.summary }))}
                                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                              >
                                Auto-fill from Summary Excerpt
                              </button>
                            </div>
                            <textarea
                              rows={3}
                              value={editingArticle.seoDescription || ""}
                              placeholder={editingArticle.summary || "Explore industrial contracting, safety guidelines, and turnkey engineering insights across Saudi Arabia."}
                              onChange={(e) => setEditingArticle((prev: any) => ({ ...prev, seoDescription: e.target.value }))}
                              className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white text-slate-900 focus:outline-none focus:border-blue-500 leading-relaxed"
                            />
                            <p className="text-[11px] text-slate-500 mt-1">
                              Search engines use this summary snippet below your title in organic search result pages.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── SUB-TAB 2: FOCUS & LSI KEYWORDS ─────────────────────── */}
                    {seoSubTab === "keywords" && (
                      <div className="space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-5 shadow-2xs">
                          <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">
                              Primary Focus Keyword Target
                            </label>
                            <input
                              type="text"
                              value={editingArticle.focusKeyword || ""}
                              placeholder="e.g. Saudi Arabia industrial contracting"
                              onChange={(e) => setEditingArticle((prev: any) => ({ ...prev, focusKeyword: e.target.value }))}
                              className="w-full px-4 py-2.5 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-900"
                            />
                            <p className="text-[11px] text-slate-500 mt-1">
                              The main search phrase you want this article to rank for on Google, Bing, and Saudi industrial search queries.
                            </p>
                          </div>

                          {/* Live Keyword Audit Checklist Grid */}
                          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                              Focus Keyword Placement Audit
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                                seoAnalysis.kwInTitle
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                                  : "bg-white border-slate-200 text-slate-700"
                              }`}>
                                <span className="font-semibold">Present in Title Tag:</span>
                                <span className="font-bold flex items-center gap-1">
                                  {seoAnalysis.kwInTitle ? <Check size={14} className="text-emerald-600" /> : <X size={14} className="text-red-500" />}
                                  <span>{seoAnalysis.kwInTitle ? "Yes" : "Missing"}</span>
                                </span>
                              </div>

                              <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                                seoAnalysis.kwInDesc
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                                  : "bg-white border-slate-200 text-slate-700"
                              }`}>
                                <span className="font-semibold">In Meta Description:</span>
                                <span className="font-bold flex items-center gap-1">
                                  {seoAnalysis.kwInDesc ? <Check size={14} className="text-emerald-600" /> : <X size={14} className="text-red-500" />}
                                  <span>{seoAnalysis.kwInDesc ? "Yes" : "Missing"}</span>
                                </span>
                              </div>

                              <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                                seoAnalysis.kwInSlug
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                                  : "bg-white border-slate-200 text-slate-700"
                              }`}>
                                <span className="font-semibold">In URL / Slug:</span>
                                <span className="font-bold flex items-center gap-1">
                                  {seoAnalysis.kwInSlug ? <Check size={14} className="text-emerald-600" /> : <X size={14} className="text-red-500" />}
                                  <span>{seoAnalysis.kwInSlug ? "Yes" : "Missing"}</span>
                                </span>
                              </div>

                              <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                                seoAnalysis.kwCount >= 2
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                                  : "bg-white border-slate-200 text-slate-700"
                              }`}>
                                <span className="font-semibold">Body Content Mentions:</span>
                                <span className="font-bold text-slate-900">
                                  {seoAnalysis.kwCount} {seoAnalysis.kwCount === 1 ? "time" : "times"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Secondary / Semantic LSI Keywords */}
                          <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">
                              Secondary / Semantic (LSI) Keywords
                            </label>
                            <input
                              type="text"
                              value={editingArticle.secondaryKeywords || ""}
                              placeholder="e.g. EPC engineering, heavy equipment rental, Aramco safety standards, Jubail industrial logistics"
                              onChange={(e) => setEditingArticle((prev: any) => ({ ...prev, secondaryKeywords: e.target.value }))}
                              className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-900"
                            />
                            <p className="text-[11px] text-slate-500 mt-1">
                              Comma-separated semantic keywords to support broad topical authority.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── SUB-TAB 3: CANONICAL & HREFLANG MULTI-LANGUAGE ──────── */}
                    {seoSubTab === "canonical" && (
                      <div className="space-y-6">
                        {/* Canonical URL */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                <LinkIcon size={14} className="text-[#E62E2D]" />
                                <span>Canonical URL (Authoritative Link Tag)</span>
                              </h5>
                              <p className="text-[11px] text-slate-500">
                                Specifies the canonical URL to prevent duplicate content penalties across syndicated feeds.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setEditingArticle((prev: any) => ({ ...prev, canonicalUrl: `https://bestinternational.com.sa/blog/${prev.slug}` }))}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                            >
                              Auto-Generate Standard URL
                            </button>
                          </div>

                          <input
                            type="text"
                            value={editingArticle.canonicalUrl || ""}
                            placeholder={`https://bestinternational.com.sa/blog/${editingArticle.slug || "article-slug"}`}
                            onChange={(e) => setEditingArticle((prev: any) => ({ ...prev, canonicalUrl: e.target.value }))}
                            className="w-full px-4 py-2.5 text-xs font-mono rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-900"
                          />
                        </div>

                        {/* Hreflang Multi-Language Alternates */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-5 shadow-2xs">
                          <div>
                            <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <Languages size={15} className="text-blue-600" />
                              <span>Hreflang Multi-Language & Regional Alternates</span>
                            </h5>
                            <p className="text-[11px] text-slate-500">
                              Helps Google serve the right language edition (Arabic for Saudi Arabia & MENA regional queries, English for international EPC partners).
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">
                                Arabic Alternate URL (hreflang=&quot;ar&quot; / &quot;ar-SA&quot;)
                              </label>
                              <input
                                type="text"
                                value={editingArticle.hreflangAr || ""}
                                placeholder={`https://bestinternational.com.sa/ar/blog/${editingArticle.slug || "slug"}`}
                                onChange={(e) => setEditingArticle((prev: any) => ({ ...prev, hreflangAr: e.target.value }))}
                                className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-900"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">
                                English Alternate URL (hreflang=&quot;en&quot; / &quot;en-SA&quot;)
                              </label>
                              <input
                                type="text"
                                value={editingArticle.hreflangEn || ""}
                                placeholder={`https://bestinternational.com.sa/blog/${editingArticle.slug || "slug"}`}
                                onChange={(e) => setEditingArticle((prev: any) => ({ ...prev, hreflangEn: e.target.value }))}
                                className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-900"
                              />
                            </div>

                            <div className="md:col-span-2">
                              <label className="block text-xs font-bold text-slate-700 mb-1">
                                Fallback Default URL (hreflang=&quot;x-default&quot;)
                              </label>
                              <input
                                type="text"
                                value={editingArticle.hreflangDefault || ""}
                                placeholder={`https://bestinternational.com.sa/blog/${editingArticle.slug || "slug"}`}
                                onChange={(e) => setEditingArticle((prev: any) => ({ ...prev, hreflangDefault: e.target.value }))}
                                className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-900"
                              />
                            </div>
                          </div>

                          <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200/80 text-xs text-blue-900 flex items-start gap-2.5">
                            <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
                            <div className="leading-relaxed">
                              <strong>Automated Tag Emission:</strong> These values inject <code className="bg-blue-100/80 px-1 py-0.5 rounded font-mono text-[11px]">&lt;link rel=&quot;alternate&quot; hreflang=&quot;ar&quot; href=&quot;...&quot; /&gt;</code> into Next.js metadata for multi-lingual ranking.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── SUB-TAB 4: SCHEMA.ORG STRUCTURED DATA (JSON-LD) ─────── */}
                    {seoSubTab === "schema" && (
                      <div className="space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-5 shadow-2xs">
                          
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                <FileCode size={15} className="text-[#E62E2D]" />
                                <span>Schema.org JSON-LD Structured Data Builder</span>
                              </h5>
                              <p className="text-[11px] text-slate-500">
                                Powers Google Rich Results, Article Knowledge Graphs, and AI Answer Engine citations.
                              </p>
                            </div>

                            {/* Schema Type Preset Selector */}
                            <div className="flex items-center gap-2">
                              <label className="text-xs font-bold text-slate-700">Schema Type:</label>
                              <select
                                value={editingArticle.schemaType || "TechArticle"}
                                onChange={(e) => setEditingArticle((prev: any) => ({ ...prev, schemaType: e.target.value }))}
                                className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900"
                              >
                                {SCHEMA_PRESETS.map((p) => (
                                  <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Schema Preset Description Pill */}
                          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between gap-3">
                            <span>
                              Active Type: <strong className="text-slate-900">{editingArticle.schemaType || "TechArticle"}</strong> — {SCHEMA_PRESETS.find((p) => p.id === (editingArticle.schemaType || "TechArticle"))?.desc}
                            </span>
                            <a
                              href="https://search.google.com/test/rich-results"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1 shrink-0"
                            >
                              <span>Test on Google Rich Results</span>
                              <ExternalLink size={12} />
                            </a>
                          </div>

                          {/* Live Generated JSON-LD Viewer */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                                Live Auto-Generated JSON-LD Payload
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(autoGeneratedJsonLd);
                                  setCopiedSchema(true);
                                  setTimeout(() => setCopiedSchema(false), 2500);
                                }}
                                className="px-3 py-1 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                              >
                                {copiedSchema ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                                <span>{copiedSchema ? "Copied to Clipboard!" : "Copy JSON-LD"}</span>
                              </button>
                            </div>
                            <pre className="p-4 bg-slate-950 text-emerald-400 text-xs font-mono rounded-2xl overflow-x-auto max-h-64 leading-relaxed border border-slate-800">
                              {autoGeneratedJsonLd}
                            </pre>
                          </div>

                          {/* Custom JSON-LD Schema Override Toggle */}
                          <div className="pt-3 border-t border-slate-200 space-y-3">
                            <label className="flex items-center gap-2.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={Boolean(editingArticle.customJsonLd)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setEditingArticle((prev: any) => ({ ...prev, customJsonLd: autoGeneratedJsonLd }));
                                  } else {
                                    setEditingArticle((prev: any) => ({ ...prev, customJsonLd: "" }));
                                    setCustomSchemaError(null);
                                  }
                                }}
                                className="w-4 h-4 rounded text-[#E62E2D] focus:ring-red-500"
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-900">Enable Custom Schema.org JSON-LD Override</span>
                                <p className="text-[11px] text-slate-500">Allows advanced SEO specialists to inject bespoke schema blocks (e.g. FAQs, HowTo steps, VideoObject).</p>
                              </div>
                            </label>

                            {Boolean(editingArticle.customJsonLd) && (
                              <div className="space-y-2 pt-2">
                                <label className="block text-xs font-bold text-slate-700">Custom JSON-LD Code:</label>
                                <textarea
                                  rows={8}
                                  value={editingArticle.customJsonLd || ""}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setEditingArticle((prev: any) => ({ ...prev, customJsonLd: val }));
                                    try {
                                      if (val.trim()) JSON.parse(val);
                                      setCustomSchemaError(null);
                                    } catch (err: any) {
                                      setCustomSchemaError(err.message);
                                    }
                                  }}
                                  className="w-full p-4 text-xs font-mono rounded-2xl border border-slate-300 bg-slate-900 text-emerald-300 focus:bg-black focus:outline-none leading-relaxed"
                                />
                                {customSchemaError ? (
                                  <div className="text-xs text-red-600 font-bold flex items-center gap-1">
                                    <AlertTriangle size={13} />
                                    <span>JSON Syntax Error: {customSchemaError}</span>
                                  </div>
                                ) : (
                                  <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                                    <CheckCircle2 size={13} />
                                    <span>Valid JSON syntax verified.</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                        </div>
                      </div>
                    )}

                    {/* ── SUB-TAB 5: SOCIAL SHARING & OPEN GRAPH (OG) ─────────── */}
                    {seoSubTab === "social" && (
                      <div className="space-y-6">
                        {/* Live Social Card Simulation */}
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <Share2 size={15} className="text-blue-600" />
                            <span>Social Sharing Card Live Simulation (LinkedIn, Twitter, WhatsApp)</span>
                          </span>

                          <div className="max-w-lg mx-auto bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md">
                            <div className="h-48 bg-slate-900 overflow-hidden relative">
                              <img
                                src={editingArticle.ogImage || editingArticle.image || "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=1200&auto=format&fit=crop"}
                                alt="OG Banner"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-4 space-y-1">
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">bestinternational.com.sa</div>
                              <h6 className="font-bold text-sm text-slate-900 line-clamp-1">
                                {editingArticle.ogTitle || editingArticle.seoTitle || editingArticle.title || "Article Title"}
                              </h6>
                              <p className="text-xs text-slate-600 line-clamp-2">
                                {editingArticle.ogDescription || editingArticle.seoDescription || editingArticle.summary || "Article summary for social previews."}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Social Inputs */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-2xs">
                          <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">OpenGraph Title</label>
                            <input
                              type="text"
                              value={editingArticle.ogTitle || ""}
                              placeholder={editingArticle.seoTitle || editingArticle.title || ""}
                              onChange={(e) => setEditingArticle((prev: any) => ({ ...prev, ogTitle: e.target.value }))}
                              className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-900"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">OpenGraph Description</label>
                            <textarea
                              rows={2}
                              value={editingArticle.ogDescription || ""}
                              placeholder={editingArticle.seoDescription || editingArticle.summary || ""}
                              onChange={(e) => setEditingArticle((prev: any) => ({ ...prev, ogDescription: e.target.value }))}
                              className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-900 leading-relaxed"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">OpenGraph Share Image URL</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={editingArticle.ogImage || ""}
                                placeholder={editingArticle.image || ""}
                                onChange={(e) => setEditingArticle((prev: any) => ({ ...prev, ogImage: e.target.value }))}
                                className="flex-1 px-4 py-2 text-xs font-mono rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-900"
                              />
                              <button
                                type="button"
                                onClick={() => openMediaFor("editingArticle.ogImage")}
                                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                              >
                                <Upload size={13} />
                                <span>Media</span>
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">Twitter Card Format</label>
                            <select
                              value={editingArticle.twitterCard || "summary_large_image"}
                              onChange={(e) => setEditingArticle((prev: any) => ({ ...prev, twitterCard: e.target.value }))}
                              className="w-full px-3.5 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-900"
                            >
                              <option value="summary_large_image">summary_large_image (Large Hero Banner)</option>
                              <option value="summary">summary (Compact Square Thumbnail)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── SUB-TAB 6: ROBOTS & INDEXING DIRECTIVES ─────────────── */}
                    {seoSubTab === "indexing" && (
                      <div className="space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-5 shadow-2xs">
                          <div>
                            <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <ShieldCheck size={15} className="text-[#E62E2D]" />
                              <span>Search Engine Bot Indexing & Crawling Controls</span>
                            </h5>
                            <p className="text-[11px] text-slate-500">
                              Fine-tune how Googlebot, Bingbot, and other web crawlers index this specific blog post.
                            </p>
                          </div>

                          <div className="space-y-4">
                            <label className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={Boolean(editingArticle.noIndex)}
                                onChange={(e) => setEditingArticle((prev: any) => ({ ...prev, noIndex: e.target.checked }))}
                                className="w-4 h-4 mt-0.5 rounded text-[#E62E2D] focus:ring-red-500"
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-900 block">
                                  noindex (Exclude from Search Engines)
                                </span>
                                <span className="text-[11px] text-slate-500 leading-relaxed block">
                                  Instructs search engines not to show this article in organic search results. (Draft mode automatically sets this).
                                </span>
                              </div>
                            </label>

                            <label className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={Boolean(editingArticle.noFollow)}
                                onChange={(e) => setEditingArticle((prev: any) => ({ ...prev, noFollow: e.target.checked }))}
                                className="w-4 h-4 mt-0.5 rounded text-[#E62E2D] focus:ring-red-500"
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-900 block">
                                  nofollow (Do Not Follow Outbound Links)
                                </span>
                                <span className="text-[11px] text-slate-500 leading-relaxed block">
                                  Instructs search engine crawlers not to endorse or follow hyperlinks placed in this article.
                                </span>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                )}

              </div>

              {/* RIGHT PANE: REAL-TIME LIVE BLOG PREVIEW (Split or Preview Tab) */}
              <div className={`overflow-y-auto bg-[#f8f9fb] flex flex-col ${
                isSplitView ? "md:w-5/12 border-l border-slate-200" : modalActiveTab === "preview" ? "w-full" : "hidden"
              }`}>
                
                {/* Preview Top Header Controls */}
                <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between gap-4 shrink-0 shadow-md">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold tracking-wide uppercase">Real-Time Live Article Preview</span>
                  </div>

                  {/* Device Switcher */}
                  <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setPreviewDevice("desktop")}
                      className={`p-1.5 rounded-lg text-xs transition ${
                        previewDevice === "desktop" ? "bg-[#E62E2D] text-white" : "text-slate-400 hover:text-white"
                      }`}
                      title="Desktop Layout"
                    >
                      <Monitor size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewDevice("tablet")}
                      className={`p-1.5 rounded-lg text-xs transition ${
                        previewDevice === "tablet" ? "bg-[#E62E2D] text-white" : "text-slate-400 hover:text-white"
                      }`}
                      title="Tablet Layout"
                    >
                      <Tablet size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewDevice("mobile")}
                      className={`p-1.5 rounded-lg text-xs transition ${
                        previewDevice === "mobile" ? "bg-[#E62E2D] text-white" : "text-slate-400 hover:text-white"
                      }`}
                      title="Mobile Layout"
                    >
                      <Smartphone size={14} />
                    </button>
                  </div>
                </div>

                {/* Preview Viewport Frame */}
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex justify-center">
                  <div className={`transition-all duration-300 w-full space-y-6 ${
                    previewDevice === "mobile"
                      ? "max-w-[390px] bg-white rounded-3xl p-4 shadow-2xl border-4 border-slate-900"
                      : previewDevice === "tablet"
                      ? "max-w-[768px] bg-white rounded-3xl p-6 shadow-2xl border border-slate-200"
                      : "max-w-[1200px]"
                  }`}>
                    
                    {/* Live Preview Hero Header */}
                    <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-white p-6 sm:p-10 shadow-xl space-y-4">
                      <div className="absolute inset-0 z-0">
                        <img
                          src={editingArticle.image || "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=1200&auto=format&fit=crop"}
                          alt="Hero banner"
                          className="w-full h-full object-cover opacity-25"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
                      </div>

                      <div className="relative z-10 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-[#E62E2D] text-white text-[10px] font-black tracking-wider uppercase shadow-sm">
                            {editingArticle.category || "TECHNICAL"}
                          </span>
                          {editingArticle.status === "draft" && (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase">
                              Draft Preview
                            </span>
                          )}
                          <span className="text-slate-400 text-xs font-mono">{editingArticle.readTime || "5 min read"}</span>
                        </div>

                        <h1 className="text-xl sm:text-3xl font-bold leading-tight text-white">
                          {editingArticle.title || "Untitled Technical Publication"}
                        </h1>

                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                          {editingArticle.summary || "Summary excerpt goes here."}
                        </p>

                        <div className="flex items-center gap-3 pt-3 border-t border-white/10 text-xs text-slate-300">
                          <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 bg-white p-0.5 shrink-0 flex items-center justify-center">
                            <img
                              src={editingArticle.authorImage || "/uploads/upload-1790411215652-best_logo-01.png"}
                              alt={editingArticle.author || "BIC Team"}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-white">{editingArticle.author || "BiC Engineering"}</div>
                            <div className="text-[10px] text-slate-400">{editingArticle.authorRole || "Technical Strategist"}</div>
                          </div>
                          <div className="ml-auto text-[11px] font-mono text-slate-400">
                            {editingArticle.date}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Live Preview Article Structured Body */}
                    <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
                      
                      {/* Featured Image */}
                      <div className="relative h-60 sm:h-80 rounded-2xl overflow-hidden bg-slate-950 border border-slate-100">
                        <img
                          src={editingArticle.image || "https://images.unsplash.com/photo-1541888081622-19e48710b144?q=80&w=1200&auto=format&fit=crop"}
                          alt={editingArticle.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold">
                          <ShieldCheck size={13} className="text-[#E62E2D]" />
                          <span>Saudi Aramco & ISO 9001 Benchmark</span>
                        </div>
                      </div>

                      {/* Content Live Render */}
                      <div className="blog-prose-content text-slate-700 leading-relaxed text-sm">
                        {editingArticle.bodyHtml ? (
                          <div dangerouslySetInnerHTML={{ __html: editingArticle.bodyHtml }} />
                        ) : (
                          <div dangerouslySetInnerHTML={{ __html: convertBlocksToHtml(editingArticle.content || []) }} />
                        )}
                      </div>

                      {/* Topic Tags */}
                      {(editingArticle.tags || []).length > 0 && (
                        <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mr-1">
                            <Tag size={13} className="text-[#E62E2D]" />
                            <span>Tags:</span>
                          </div>
                          {(editingArticle.tags || []).map((tag: string, tIdx: number) => (
                            <span key={tIdx} className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                    </div>

                  </div>
                </div>

              </div>

            </div>

            {/* Modal Bottom Sticky Footer Bar (Draft vs Publish Controls) */}
            <div className="bg-white px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 shadow-lg">
              
              {/* Left: Status Toggle Switch */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700">Publishing Status:</span>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setEditingArticle((prev: any) => ({ ...prev, status: "draft" }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      editingArticle.status === "draft"
                        ? "bg-amber-500 text-slate-950 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Draft (Unlisted)
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingArticle((prev: any) => ({ ...prev, status: "published" }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      editingArticle.status !== "draft"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Check size={13} />
                    <span>Published (Live)</span>
                  </button>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowArticleModal(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>

                {/* Save as Draft Button */}
                <button
                  type="button"
                  onClick={() => handleSaveArticleModal("draft")}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-2xl border border-slate-300 transition cursor-pointer flex items-center gap-2 shadow-2xs"
                >
                  <FileEdit size={14} className="text-amber-600" />
                  <span>Save as Draft</span>
                </button>

                {/* Publish Live Button */}
                <button
                  type="button"
                  onClick={() => handleSaveArticleModal("published")}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#E62E2D] to-red-700 hover:from-red-600 hover:to-red-800 text-white text-xs font-bold rounded-2xl shadow-md shadow-red-600/25 transition cursor-pointer flex items-center gap-2"
                >
                  <Send size={14} />
                  <span>Publish Article</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ── LINK INSERTER SUB-DIALOG ───────────────────────────────── */}
      {linkHelper.isOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <LinkIcon size={16} className="text-[#E62E2D]" />
                <h4 className="font-bold text-sm text-slate-900">Insert Link into Text</h4>
              </div>
              <button
                type="button"
                onClick={() => setLinkHelper((prev) => ({ ...prev, isOpen: false }))}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Link Text / Anchor Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. Saudi Aramco Standards"
                  value={linkHelper.text}
                  onChange={(e) => setLinkHelper((prev) => ({ ...prev, text: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Destination URL
                </label>
                <input
                  type="text"
                  placeholder="https://... or /services/..."
                  value={linkHelper.url}
                  onChange={(e) => setLinkHelper((prev) => ({ ...prev, url: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-mono"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    checked={linkHelper.openInNewTab}
                    onChange={(e) => setLinkHelper((prev) => ({ ...prev, openInNewTab: e.target.checked }))}
                    className="w-4 h-4 rounded text-[#E62E2D] focus:ring-red-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <ExternalLink size={12} className="text-[#E62E2D]" />
                      <span>Open link in new tab (target="_blank")</span>
                    </span>
                    <p className="text-[11px] text-slate-500">Adds secure rel="noopener noreferrer"</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setLinkHelper((prev) => ({ ...prev, isOpen: false }))}
                className="px-3.5 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyLinkHelper}
                className="px-5 py-2 bg-[#E62E2D] hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: HERO BANNER & STATS ────────────────────────────── */}
      {activeTab === "hero" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
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
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#E62E2D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Watermark Background Text
              </label>
              <input
                type="text"
                value={data?.hero?.watermark || ""}
                onChange={(e) => updateField("hero.watermark", e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#E62E2D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Main Title Prefix
              </label>
              <input
                type="text"
                value={data?.hero?.title || ""}
                onChange={(e) => updateField("hero.title", e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#E62E2D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Red Accent Title (Highlighted)
              </label>
              <input
                type="text"
                value={data?.hero?.titleAccent || ""}
                onChange={(e) => updateField("hero.titleAccent", e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#E62E2D]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Hero Description Text
              </label>
              <textarea
                rows={3}
                value={data?.hero?.description || ""}
                onChange={(e) => updateField("hero.description", e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#E62E2D] leading-relaxed"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Hero Background Banner Image
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={data?.hero?.bgImage || ""}
                  onChange={(e) => updateField("hero.bgImage", e.target.value)}
                  className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-mono"
                />
                <button
                  type="button"
                  onClick={() => openMediaFor("hero.bgImage")}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Upload size={13} />
                  <span>Media Library</span>
                </button>
              </div>
            </div>
          </div>

          {/* Taglines */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800">
                Hero Animated / Bullet Taglines
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
              {(data?.hero?.taglines || []).map((tagline: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => {
                      const copy = [...(data?.hero?.taglines || [])];
                      copy[idx] = e.target.value;
                      setData((prev: any) => ({
                        ...prev,
                        hero: { ...prev.hero, taglines: copy },
                      }));
                    }}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveTagline(idx)}
                    className="p-2 text-slate-400 hover:text-red-600 transition"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Metric Stats */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <label className="block text-xs font-bold text-slate-800">
              Hero Metric Counters (4 Stats)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(data?.hero?.stats || []).map((stat: any, idx: number) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Value</label>
                    <input
                      type="text"
                      value={stat.value || ""}
                      onChange={(e) => {
                        const copy = [...(data?.hero?.stats || [])];
                        copy[idx] = { ...copy[idx], value: e.target.value };
                        setData((prev: any) => ({
                          ...prev,
                          hero: { ...prev.hero, stats: copy },
                        }));
                      }}
                      className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Label</label>
                    <input
                      type="text"
                      value={stat.label || ""}
                      onChange={(e) => {
                        const copy = [...(data?.hero?.stats || [])];
                        copy[idx] = { ...copy[idx], label: e.target.value };
                        setData((prev: any) => ({
                          ...prev,
                          hero: { ...prev.hero, stats: copy },
                        }));
                      }}
                      className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ── TAB 3: SETTINGS & SECTION HEADINGS ────────────────────── */}
      {activeTab === "settings" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Sliders size={16} className="text-[#E62E2D]" />
            <span>Listing Page Layout & Section Typography</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Front-End Articles Per Page (Pagination Limit)
              </label>
              <select
                value={data?.settings?.itemsPerPage || 6}
                onChange={(e) => updateField("settings.itemsPerPage", parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-bold"
              >
                <option value={3}>3 Articles Per Page</option>
                <option value={6}>6 Articles Per Page (Default Standard)</option>
                <option value={9}>9 Articles Per Page</option>
                <option value={12}>12 Articles Per Page</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Section Red Sub-Badge
              </label>
              <input
                type="text"
                value={data?.settings?.sectionBadge || "BLOG & INSIGHTS"}
                onChange={(e) => updateField("settings.sectionBadge", e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Section Main Title
              </label>
              <input
                type="text"
                value={data?.settings?.sectionTitle || "Latest"}
                onChange={(e) => updateField("settings.sectionTitle", e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Section Highlight Accent (Red with Glow Line)
              </label>
              <input
                type="text"
                value={data?.settings?.sectionTitleAccent || "Articles"}
                onChange={(e) => updateField("settings.sectionTitleAccent", e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Section Sub-Description Text
              </label>
              <textarea
                rows={3}
                value={data?.settings?.sectionDescription || ""}
                onChange={(e) => updateField("settings.sectionDescription", e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: SEO & METADATA ─────────────────────────────────── */}
      {activeTab === "seo" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Sparkles size={16} className="text-[#E62E2D]" />
            <span>Search Engine Optimization (SEO) & Social Sharing</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Meta Title Tag
              </label>
              <input
                type="text"
                value={data?.seo?.title || ""}
                onChange={(e) => updateField("seo.title", e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Focus Keywords
              </label>
              <input
                type="text"
                value={data?.seo?.focusKeyword || ""}
                onChange={(e) => updateField("seo.focusKeyword", e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Meta Description Tag
              </label>
              <textarea
                rows={3}
                value={data?.seo?.description || ""}
                onChange={(e) => updateField("seo.description", e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── STICKY BOTTOM SAVE BAR ────────────────────────────────── */}
      <div className="fixed bottom-6 right-8 z-40 flex items-center gap-3 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl border border-slate-700 shadow-2xl">
        <div className="flex items-center gap-2">
          {saveSuccess ? (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
              <CheckCircle2 size={15} />
              <span>Saved & Revalidated Live!</span>
            </span>
          ) : (
            <span className="text-xs text-slate-300 font-medium">
              Changes auto-saved in memory
            </span>
          )}
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="px-5 py-2 bg-gradient-to-r from-[#E62E2D] to-red-700 hover:from-red-600 hover:to-red-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-600/20 transition disabled:opacity-50 cursor-pointer"
        >
          {saving ? <RefreshCw size={13} className="animate-spin" /> : <Save size={13} />}
          <span>{saving ? "Publishing..." : "Save Now"}</span>
        </button>
      </div>

      {/* ── MEDIA LIBRARY MODAL ────────────────────────────────────── */}
      <MediaLibraryModal
        isOpen={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        onSelectImage={handleSelectMedia}
        onSelect={handleSelectMedia}
      />

    </div>
  );
}
