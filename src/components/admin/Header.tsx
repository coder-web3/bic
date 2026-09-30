"use client";

import { Bell, Search, Sparkles, ShieldCheck } from "lucide-react";

export default function Header() {
  return (
    <header className="h-18 bg-white/85 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-8 sticky top-0 z-40 transition-all">
      {/* Search Bar */}
      <div className="relative w-96 hidden md:block">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input 
          type="text" 
          placeholder="Search services, media, settings..." 
          className="w-full bg-slate-100/70 border border-slate-200/80 rounded-xl py-2 pl-10 pr-12 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all duration-200 shadow-2xs"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-400">
          ⌘K
        </span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Environment Status Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-[11px] font-medium text-slate-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Production CMS</span>
          <span className="text-slate-300">|</span>
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[10px] text-slate-500">Saudi Standards Ready</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full ring-2 ring-white" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 cursor-pointer pl-4 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-slate-900 leading-tight">Admin Executive</div>
            <div className="text-[10px] text-slate-500 font-medium">Super Admin</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-red-500/20 border border-white/20">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
