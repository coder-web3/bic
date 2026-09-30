import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import { getBlogData } from "@/lib/getBlogData";
import { getSiteSettings } from "@/lib/getSiteSettings";
import { constructMetadata, buildBreadcrumbJsonLd, siteConfig } from "@/lib/seo";
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  Share2,
  Bookmark,
  CheckCircle2,
  Tag,
  BookOpen,
  User,
  Building2,
  ShieldCheck,
  Flame,
  Mail,
  ChevronRight,
  ExternalLink,
  AlertTriangle,
  Info,
  HardHat,
  Truck,
  Users,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const blogData = getBlogData();
  const articles = blogData?.articles || [];
  return articles.map((article: any) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blogData = getBlogData();
  const articles = blogData?.articles || [];
  const article = articles.find((a: any) => a.slug === slug);

  if (!article) {
    return constructMetadata({
      title: "Article Not Found - BiC Blog",
      description: "The requested industrial insight article could not be found.",
    });
  }

  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.summary;
  const canonical = article.canonicalUrl || `${siteConfig.url}/blog/${article.slug}`;
  const focusKeyword = article.focusKeyword || `${article.title} Saudi Arabia`;
  const image = article.ogImage || article.image || `${siteConfig.url}/uploads/upload-1790407774913-Civil_Works.avif`;
  const isDraft = article.status === "draft";
  const noIndex = Boolean(article.noIndex) || isDraft;

  // Hreflang multi-language alternates mapping
  const languages: Record<string, string> = {};
  if (article.hreflangEn) languages["en"] = article.hreflangEn;
  if (article.hreflangAr) languages["ar"] = article.hreflangAr;
  if (article.hreflangDefault) languages["x-default"] = article.hreflangDefault;

  // Secondary keywords
  let secondaryKw: string[] = [];
  if (Array.isArray(article.secondaryKeywords)) {
    secondaryKw = article.secondaryKeywords;
  } else if (typeof article.secondaryKeywords === "string" && article.secondaryKeywords.trim()) {
    secondaryKw = article.secondaryKeywords.split(",").map((s: string) => s.trim()).filter(Boolean);
  } else if (Array.isArray(article.tags)) {
    secondaryKw = article.tags;
  }

  return constructMetadata({
    title,
    description,
    canonical,
    focusKeyword,
    keywords: secondaryKw,
    image,
    noIndex,
    languages: Object.keys(languages).length > 0 ? languages : undefined,
    ogType: "article",
    authors: article.author ? [article.author] : ["BiC Engineering Directorate"],
  });
}

// ── Helper functions for rich content, alignments & secure links ──
function getAlignClass(align?: string) {
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  if (align === "justify") return "text-justify";
  return "text-left";
}

function FormattedText({ text, className = "" }: { text?: string; className?: string }) {
  if (!text) return null;

  // Check if text has HTML tags
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

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const blogData = getBlogData();
  const articles = blogData?.articles || [];
  const articleIndex = articles.findIndex((a: any) => a.slug === slug);

  if (articleIndex === -1) {
    notFound();
  }

  const article = articles[articleIndex];
  const prevArticle = articleIndex > 0 ? articles[articleIndex - 1] : null;
  const nextArticle = articleIndex < articles.length - 1 ? articles[articleIndex + 1] : null;
  const publishedArticles = articles.filter((a: any) => a.status !== "draft");
  const otherPublished = publishedArticles.filter((a: any) => a.slug !== slug).slice(0, 4);
  const recentPosts = otherPublished.length > 0 ? otherPublished : publishedArticles.slice(0, 3);

  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: article.title, url: `/blog/${article.slug}` },
  ]);

  // Construct Schema.org JSON-LD (Custom override or dynamic structured data)
  let articleSchema: any = null;
  if (article.customJsonLd && typeof article.customJsonLd === "string" && article.customJsonLd.trim()) {
    try {
      articleSchema = JSON.parse(article.customJsonLd);
    } catch (e) {
      console.warn("Invalid custom JSON-LD schema provided, falling back to dynamic generation:", e);
    }
  }

  if (!articleSchema) {
    articleSchema = {
      "@context": "https://schema.org",
      "@type": article.schemaType || "Article",
      headline: article.seoTitle || article.title,
      description: article.seoDescription || article.summary,
      image: [article.ogImage || article.image || `${siteConfig.url}/uploads/upload-1790407774913-Civil_Works.avif`],
      datePublished: article.datePublished || "2026-09-20T08:00:00+03:00",
      dateModified: article.dateModified || "2026-09-20T08:00:00+03:00",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": article.canonicalUrl || `${siteConfig.url}/blog/${article.slug}`,
      },
      keywords: article.focusKeyword ? `${article.focusKeyword}, ${(article.tags || []).join(", ")}` : (article.tags || []).join(", "),
      author: {
        "@type": "Person",
        name: article.author || "BiC Engineering Directorate",
        jobTitle: article.authorRole || "Lead Infrastructure Strategist",
      },
      publisher: {
        "@type": "Organization",
        name: "Best International Contracting Company",
        logo: {
          "@type": "ImageObject",
          url: `${siteConfig.url}/uploads/logo.png`,
        },
      },
    };
  }

  const siteSettings = getSiteSettings();
  const faviconLogo = siteSettings?.general?.faviconUrl || siteSettings?.general?.logoUrl || "/uploads/upload-1790411215652-best_logo-01.png";
  const authorImgSrc = (!article.authorImage || article.authorImage.includes("unsplash.com"))
    ? faviconLogo
    : article.authorImage;

  return (
    <main className="min-h-screen bg-[#f8f9fb] text-gray-900 selection:bg-[#E62E2D] selection:text-white">
      <JsonLd data={breadcrumbs} />
      <JsonLd data={articleSchema} />
      <Header />

      {/* Draft Mode Notification Banner for Admins & Preview */}
      {article.status === "draft" && (
        <div className="bg-amber-500 text-slate-950 font-bold text-xs py-2 px-4 text-center sticky top-0 z-50 shadow-md flex items-center justify-center gap-2">
          <AlertTriangle size={14} className="text-slate-950" />
          <span>DRAFT PREVIEW MODE</span>
          <span>•</span>
          <span className="font-medium">This article is currently saved as a draft and is unlisted from public search feeds.</span>
        </div>
      )}

      {/* ── HERO SECTION (Exact Shop & Blog Listing Standard) ─────────────── */}
      <div className="pt-[var(--header-h,88px)]">
        <PageHero
          badge={`TECHNICAL PUBLICATION · ${(article.category || "INDUSTRIAL").toUpperCase()}`}
          title={article.title}
          description={article.summary}
          breadcrumbs={[
            { label: "Blog", href: "/blog" },
            { label: article.title.length > 35 ? `${article.title.substring(0, 35)}...` : article.title }
          ]}
          bgImage={article.image || "/uploads/upload-1790407774913-Civil_Works.avif"}
          watermark="INSIGHTS"
          taglines={[
            "TECHNICAL ENGINEERING PAPER",
            "ARAMCO & SABIC COMPLIANT",
            "FIELD EXECUTION PROTOCOLS",
            "KINGDOM-WIDE INDUSTRIAL EPC"
          ]}
          stats={[
            { value: article.readTime, label: "Read Time" },
            { value: "100%", label: "Peer Reviewed" },
            { value: article.category, label: "Specialty" },
            { value: article.date, label: "Published" }
          ]}
        />
      </div>

      {/* ── ARTICLE CONTENT & SIDEBAR SECTION ─────────────────────────────── */}
      <div className="max-w-[1650px] mx-auto px-4 sm:px-6 lg:px-12 py-12 md:py-16">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#E62E2D] bg-white px-4 py-2 rounded-xl border border-gray-200/90 shadow-2xs transition"
          >
            <ArrowLeft size={14} />
            <span>Back to All Articles</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT 8/9 COLS: MAIN ARTICLE */}
          <article className="lg:col-span-8 space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-gray-200/90 shadow-2xs">
            
            {/* Meta / Author Bar (Matches About Who We Are Typography) */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-white p-1 overflow-hidden border border-slate-200 shrink-0 shadow-2xs flex items-center justify-center">
                  <img
                    src={authorImgSrc}
                    alt={article.author || "BiC Team"}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="font-bold text-[#111] text-[15px] sm:text-[15.5px] tracking-tight">{article.author || "BiC Engineering Directorate"}</div>
                  <div className="text-[12.5px] text-gray-500 font-medium">{article.authorRole || "Lead Technical Strategist"}</div>
                </div>
              </div>

              <div className="flex items-center gap-3.5 text-[12.5px] text-gray-600 font-medium">
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                  <Calendar size={13.5} className="text-[#E62E2D]" />
                  <span>{article.date}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                  <Clock size={13.5} className="text-[#E62E2D]" />
                  <span>{article.readTime}</span>
                </div>
              </div>
            </div>

            {/* Featured Image Banner */}
            <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-950 border border-slate-100 shadow-inner">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-mono font-bold">
                <ShieldCheck size={14} className="text-[#E62E2D]" />
                <span>Saudi Aramco & ISO 9001 Certified Standards</span>
              </div>
            </div>

            {/* Article Structured Body (Supports WordPress Classic HTML & Block formats) */}
            <div className="blog-prose-content space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base font-normal">
              {article.bodyHtml ? (
                <div
                  className="blog-prose-content"
                  dangerouslySetInnerHTML={{ __html: article.bodyHtml }}
                />
              ) : article.content && Array.isArray(article.content) && article.content.length > 0 ? (
                article.content.map((block: any, idx: number) => {
                  const alignCls = getAlignClass(block.align);

                  // 1. LEAD PARAGRAPH
                  if (block.type === "lead") {
                    return (
                      <div key={idx} className={`p-4 bg-red-50/40 rounded-2xl border-l-4 border-[#E62E2D] ${alignCls}`}>
                        <p className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed">
                          <FormattedText text={block.text} />
                        </p>
                      </div>
                    );
                  }

                  // 2. HEADINGS (H2, H3, H4)
                  if (block.type === "heading") {
                    const level = block.level || "h2";
                    if (level === "h3") {
                      return (
                        <h3 key={idx} className={`text-xl sm:text-2xl font-bold text-slate-900 pt-5 pb-1 border-b border-gray-100 ${alignCls}`}>
                          <FormattedText text={block.text} />
                        </h3>
                      );
                    }
                    if (level === "h4") {
                      return (
                        <h4 key={idx} className={`text-lg sm:text-xl font-bold text-slate-900 pt-3 pb-1 ${alignCls}`}>
                          <FormattedText text={block.text} />
                        </h4>
                      );
                    }
                    return (
                      <h2 key={idx} className={`text-2xl sm:text-3xl font-bold text-slate-900 pt-6 pb-2 border-b border-gray-100 ${alignCls}`}>
                        <FormattedText text={block.text} />
                      </h2>
                    );
                  }

                  // 3. BLOCKQUOTE
                  if (block.type === "quote") {
                    return (
                      <blockquote key={idx} className={`p-5 bg-slate-900 text-white rounded-2xl border-l-4 border-[#E62E2D] space-y-2 shadow-md ${alignCls}`}>
                        <p className="italic text-sm sm:text-base text-slate-200">
                          "<FormattedText text={block.text} />"
                        </p>
                        {block.author && (
                          <div className="text-xs font-bold text-[#E62E2D] uppercase tracking-wider">
                            — {block.author}
                          </div>
                        )}
                      </blockquote>
                    );
                  }

                  // 4. CALLOUT BOX
                  if (block.type === "callout") {
                    const variant = block.variant || "standard";
                    const isWarning = variant === "warning";
                    const isInfo = variant === "info";

                    return (
                      <div
                        key={idx}
                        className={`p-5 rounded-2xl space-y-1.5 ${alignCls} ${
                          isWarning
                            ? "bg-amber-50 border border-amber-200/90 text-amber-950"
                            : isInfo
                            ? "bg-blue-50 border border-blue-200/90 text-blue-950"
                            : "bg-red-50/80 border border-red-200/80 text-slate-900"
                        }`}
                      >
                        <div
                          className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
                            isWarning ? "text-amber-700" : isInfo ? "text-blue-700" : "text-[#E62E2D]"
                          } ${block.align === "center" ? "justify-center" : block.align === "right" ? "justify-end" : "justify-start"}`}
                        >
                          {isWarning ? <AlertTriangle size={16} /> : isInfo ? <Info size={16} /> : <CheckCircle2 size={16} />}
                          <span>{block.title || "Key Takeaway"}</span>
                        </div>
                        <p className="text-xs sm:text-sm leading-relaxed">
                          <FormattedText text={block.text} />
                        </p>
                      </div>
                    );
                  }

                  // 5. ACTION LINK / CTA BUTTON (WITH OPEN IN NEW TAB OPTION)
                  if (block.type === "link" || block.type === "cta") {
                    const isNewTab = block.openInNewTab !== false;
                    const style = block.style || "primary";

                    return (
                      <div
                        key={idx}
                        className={`my-4 flex ${
                          block.align === "center"
                            ? "justify-center"
                            : block.align === "right"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <a
                          href={block.url || "#"}
                          target={isNewTab ? "_blank" : "_self"}
                          rel={isNewTab ? "noopener noreferrer" : undefined}
                          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer shadow-xs ${
                            style === "dark"
                              ? "bg-slate-900 hover:bg-black text-white shadow-slate-900/20"
                              : style === "outline"
                              ? "bg-white hover:bg-slate-50 text-slate-800 border border-slate-300"
                              : style === "link"
                              ? "text-[#E62E2D] hover:underline font-bold p-0 shadow-none"
                              : "bg-[#E62E2D] hover:bg-red-700 text-white shadow-red-600/20"
                          }`}
                        >
                          <span>{block.text || block.label || "Explore Details"}</span>
                          {isNewTab ? <ExternalLink size={13} /> : <ArrowRight size={13} />}
                        </a>
                      </div>
                    );
                  }

                  // 6. BULLET LIST / CHECKLIST
                  if (block.type === "list") {
                    const items = Array.isArray(block.items) ? block.items : [];
                    return (
                      <ul key={idx} className={`space-y-2.5 my-3 ${alignCls}`}>
                        {items.map((itemText: string, itemIdx: number) => (
                          <li key={itemIdx} className="flex items-start gap-3 text-slate-700 text-sm sm:text-[15px]">
                            <span className="w-2 h-2 rounded-full bg-[#E62E2D] mt-2 shrink-0" />
                            <span className="flex-1">
                              <FormattedText text={itemText} />
                            </span>
                          </li>
                        ))}
                      </ul>
                    );
                  }

                  // 7. INLINE IMAGE WITH CAPTION
                  if (block.type === "image") {
                    return (
                      <figure key={idx} className={`my-6 space-y-2 ${alignCls}`}>
                        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 shadow-md">
                          <img
                            src={block.url}
                            alt={block.alt || block.caption || "Article visual"}
                            className="w-full h-auto object-cover max-h-[480px]"
                          />
                        </div>
                        {block.caption && (
                          <figcaption className="text-xs text-slate-500 italic px-2">
                            <FormattedText text={block.caption} />
                          </figcaption>
                        )}
                      </figure>
                    );
                  }

                  // 8. STANDARD PARAGRAPH
                  return (
                    <p key={idx} className={`text-slate-600 leading-relaxed text-sm sm:text-[15px] ${alignCls}`}>
                      <FormattedText text={block.text} />
                    </p>
                  );
                })
              ) : (
                <div className="space-y-4">
                  <p className="text-base font-medium text-slate-900 leading-relaxed border-l-4 border-[#E62E2D] pl-4 py-1 bg-red-50/40 rounded-r-xl">
                    {article.summary}
                  </p>
                  <p className="text-slate-600 leading-relaxed text-sm sm:text-[15px]">
                    Best International Contracting Company operates across the Kingdom of Saudi Arabia, providing industrial contracting, heavy equipment rentals, manpower provision, and industrial materials supply. Our engineering teams apply rigorous ISO and Saudi Aramco standards to every project landmark.
                  </p>
                </div>
              )}
            </div>

            {/* Tags Bar */}
            {article.tags && article.tags.length > 0 && (
              <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mr-2">
                  <Tag size={13} className="text-[#E62E2D]" />
                  <span>Topic Tags:</span>
                </div>
                {article.tags.map((tag: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium hover:bg-red-50 hover:text-[#E62E2D] transition cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Previous & Next Post Navigation */}
            <div className="pt-8 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevArticle ? (
                <Link
                  href={`/blog/${prevArticle.slug}`}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-red-500/80 hover:bg-slate-50 transition group"
                >
                  <div className="text-[10px] font-bold uppercase text-slate-400 mb-1 flex items-center gap-1">
                    <ArrowLeft size={11} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Previous Article</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-[#E62E2D] transition-colors line-clamp-1">
                    {prevArticle.title}
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {nextArticle ? (
                <Link
                  href={`/blog/${nextArticle.slug}`}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-red-500/80 hover:bg-slate-50 transition group text-right"
                >
                  <div className="text-[10px] font-bold uppercase text-slate-400 mb-1 flex items-center justify-end gap-1">
                    <span>Next Article</span>
                    <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-[#E62E2D] transition-colors line-clamp-1">
                    {nextArticle.title}
                  </div>
                </Link>
              ) : (
                <div />
              )}
            </div>

          </article>

          {/* RIGHT 4 COLS: STICKY SIDEBAR (RECENT POSTS & CONTACT) */}
          <aside className="lg:col-span-4 h-full">
            
            {/* STICKY CONTAINER */}
            <div className="sticky top-28 lg:top-32 space-y-6">
              
              {/* WIDGET 1: RECENT POSTS (STICKY - MATCHES WHO WE ARE TYPOGRAPHY) */}
              <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-6 shadow-2xs space-y-4 relative overflow-hidden">
                {/* Top red glow accent */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#E62E2D] via-red-500 to-rose-600" />

                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-[2px] bg-[#E62E2D]" />
                    <h3 className="font-bold text-[12.5px] sm:text-[13px] uppercase tracking-widest text-[#111]">
                      Recent Posts
                    </h3>
                  </div>
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#E62E2D] bg-red-50 border border-red-100 px-2 py-0.5 rounded-md">
                    Latest
                  </span>
                </div>

                <div className="space-y-3.5">
                  {recentPosts.map((post: any, pIdx: number) => (
                    <Link
                      key={post.id || pIdx}
                      href={`/blog/${post.slug}`}
                      className="flex items-center gap-3.5 p-2 -mx-2 rounded-2xl hover:bg-slate-50 transition group/post cursor-pointer"
                    >
                      <div className="w-14 h-14 rounded-xl bg-slate-950 overflow-hidden shrink-0 border border-slate-100 relative">
                        <img
                          src={post.image || "/uploads/upload-1790407774913-Civil_Works.avif"}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover/post:scale-108 transition-transform duration-500"
                        />
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-[11.5px] text-gray-500 font-medium">
                          <span>{post.date}</span>
                          <span>•</span>
                          <span>{post.readTime || "5 min read"}</span>
                        </div>
                        <h4 className="text-[13.5px] sm:text-[14px] font-bold text-[#111] group-hover/post:text-[#E62E2D] transition-colors line-clamp-2 leading-snug tracking-tight">
                          {post.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <Link
                    href="/blog"
                    className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-[#E62E2D] text-[12.5px] sm:text-[13px] font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <span>View All Posts</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>

              {/* WIDGET 2: CONTRACTING ADVISORY CTA */}
              <div className="bg-[#0b0f17] text-white rounded-3xl p-6 sm:p-7 shadow-xl space-y-4 border border-white/10 relative overflow-hidden">
                <div className="w-10 h-10 rounded-2xl bg-[#E62E2D]/20 text-[#E62E2D] flex items-center justify-center">
                  <Building2 size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[15px] sm:text-[16.5px] font-bold text-white leading-snug">
                    Need Engineering &amp; Turnkey Contracting Support?
                  </h4>
                  <p className="text-[12.5px] sm:text-[13px] text-slate-300 leading-relaxed">
                    Consult with BiC technical experts for heavy equipment fleets, industrial material procurement, and civil turnaround services.
                  </p>
                </div>
                <Link
                  href="/contact-us"
                  className="w-full py-2.5 rounded-xl bg-[#E62E2D] hover:bg-red-700 text-white text-[12.5px] sm:text-[13px] font-bold flex items-center justify-center gap-2 shadow-md transition"
                >
                  <Mail size={13.5} />
                  <span>Request Engineering Consultation</span>
                </Link>
              </div>

            </div>

          </aside>

        </div>

      </div>

      <Footer />
    </main>
  );
}
