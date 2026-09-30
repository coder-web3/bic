"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  MessageSquare, 
  Settings,
  LogOut,
  FolderKanban,
  Layers,
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  ShoppingCart,
  Info,
  BookOpen,
} from "lucide-react";

const mainNavItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Shop & Equipment", href: "/admin/shop", icon: ShoppingCart, badge: "Live" },
  { name: "Services Architecture", href: "/admin/services", icon: Briefcase, badge: "3-Tier" },
  { name: "Homepage CMS", href: "/admin/homepage", icon: Layers },
  { name: "About Page CMS", href: "/admin/about", icon: Info },
  { name: "Gallery Page CMS", href: "/admin/gallery", icon: ImageIcon, badge: "Photos" },
  { name: "Blog Articles CMS", href: "/admin/blog", icon: BookOpen, badge: "Articles" },
  { name: "Media Assets", href: "/admin/media", icon: Sparkles },
  { name: "Projects & Portfolio", href: "/admin/portfolio", icon: FolderKanban },
  { name: "Clients & Partners", href: "/admin/clients", icon: Users },
  { name: "Inquiries & Messages", href: "/admin/messages", icon: MessageSquare },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-[#0A0D14] text-white flex flex-col fixed left-0 top-0 border-r border-slate-800/80 z-50 shadow-2xl">
      {/* Brand Logo Header */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800/80 bg-gradient-to-b from-white/[0.03] to-transparent">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-black text-base shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
            B
          </div>
          <div>
            <div className="text-lg font-black tracking-tight text-white leading-none">
              BiC<span className="text-red-500">.</span>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
              Control Center
            </div>
          </div>
        </Link>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-red-950/60 border border-red-800/60 text-red-400">
          PRO
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-3.5 flex flex-col gap-1.5 overflow-y-auto custom-scrollbar">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Core Management
        </div>

        {mainNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 font-medium text-xs group relative ${
                isActive 
                  ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/25 font-semibold" 
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={16} className={isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400 group-hover:bg-slate-700"
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="px-3 pt-4 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          System & Tools
        </div>

        <Link 
          href="/admin/settings"
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 font-medium text-xs group ${
            pathname.startsWith("/admin/settings") 
              ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/25 font-semibold" 
              : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <Settings size={16} className={pathname.startsWith("/admin/settings") ? "text-white" : "text-slate-400 group-hover:text-slate-200"} />
          <span>Footer, Header &amp; Branding</span>
        </Link>

        <a 
          href="/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all text-xs font-medium group mt-1"
        >
          <div className="flex items-center gap-3">
            <ExternalLink size={16} className="text-slate-400 group-hover:text-slate-200" />
            <span>Visit Live Website</span>
          </div>
          <span className="text-[10px] text-slate-500">↗</span>
        </a>
      </nav>

      {/* Bottom User Profile & Logout */}
      <div className="p-3.5 border-t border-slate-800/80 bg-gradient-to-t from-white/[0.02] to-transparent">
        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-bold text-xs shadow-md shrink-0">
              A
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">Administrator</div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Session
              </div>
            </div>
          </div>
        </div>

        <button className="flex items-center justify-center gap-2 px-3 py-2 w-full rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-colors font-medium text-xs border border-transparent hover:border-red-900/30">
          <LogOut size={14} />
          <span>End Session</span>
        </button>
      </div>
    </aside>
  );
}
