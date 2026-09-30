"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Users, BarChart3, ArrowRight } from "lucide-react";

export interface ClientItem {
  id: string;
  name: string;
  arabic?: string;
  type?: string;
  logo?: string;
}

export function renderClientLogo(
  type?: string,
  name?: string,
  arabic?: string,
  logoUrl?: string
) {
  // 1. If custom logo URL is provided (or type is custom)
  if (logoUrl && logoUrl.trim() !== "") {
    return (
      <div className="w-full h-full flex items-center justify-center p-1">
        <img
          src={logoUrl}
          alt={name || "Client Partner"}
          className="max-h-16 md:max-h-20 max-w-[92%] w-auto h-auto object-contain"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
    );
  }

  // 2. Vector brand presets (scaled up, bold and prominent)
  switch (type?.toLowerCase()) {
    case "aramco":
      return (
        <div className="flex items-center gap-3.5">
          <div className="text-right">
            <div className="text-[16px] md:text-[17px] font-black text-[#003865] leading-tight font-sans">أرامكو السعودية</div>
            <div className="text-[13px] md:text-[14px] font-black text-[#003865] tracking-tight leading-tight">Saudi Aramco</div>
          </div>
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-[#00A3E0] flex items-center justify-center text-white relative overflow-hidden shrink-0 shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00A3E0] to-[#009A44]" />
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="relative z-10 text-white">
              <path d="M12 2L13.5 9.5L21 11L14.5 14L16 22L11 16.5L5 19L8 13L2 10.5L9.5 9.5L12 2Z" fill="white" opacity="0.95" />
            </svg>
          </div>
        </div>
      );

    case "sabic":
      return (
        <div className="flex flex-col items-center justify-center">
          <div className="text-[24px] md:text-[27px] font-black text-[#004B87] tracking-tighter leading-none">سابك</div>
          <div className="text-[18px] md:text-[20px] font-extrabold text-[#F39200] tracking-wider -mt-1 lowercase font-sans">sabic</div>
        </div>
      );

    case "neom":
      return (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 md:w-10 md:h-10 relative flex items-center justify-center shrink-0">
            <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke="#D97706" strokeWidth="2.5" strokeDasharray="3 3" opacity="0.85" />
              <polygon points="16,4 20,12 28,16 20,20 16,28 12,20 4,16 12,12" fill="#0D9488" opacity="0.85" />
              <circle cx="16" cy="16" r="4.5" fill="#1E293B" />
            </svg>
          </div>
          <span className="text-[20px] md:text-[22px] font-black text-[#0F172A] tracking-wider uppercase font-sans">NEOM</span>
        </div>
      );

    case "maaden":
      return (
        <div className="flex flex-col items-center text-center">
          <div className="w-5 h-5 text-[#D97706] mb-0.5">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12,2 15,9 22,9 16.5,14 18.5,21 12,16.5 5.5,21 7.5,14 2,9 9,9" />
            </svg>
          </div>
          <div className="text-[18px] md:text-[20px] font-black text-[#006A4E] leading-tight font-sans">معادن</div>
          <div className="text-[11px] md:text-[12px] font-black text-[#006A4E] tracking-widest uppercase leading-none">MA&#39;ADEN</div>
        </div>
      );

    case "royal_commission":
      return (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 md:w-10 md:h-10 relative shrink-0">
            <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
              <path d="M16 2L28 9V23L16 30L4 23V9L16 2Z" fill="#3B82F6" opacity="0.9" />
              <path d="M16 6L24 11V21L16 26L8 21V11L16 6Z" fill="#6366F1" />
              <circle cx="16" cy="16" r="4" fill="white" />
            </svg>
          </div>
          <div className="text-left">
            <div className="text-[13px] md:text-[14px] font-bold text-[#4338CA] leading-tight font-sans">الهيئة الملكية</div>
            <div className="text-[11px] md:text-[12px] font-extrabold text-[#4338CA] tracking-tight leading-tight">Royal Commission</div>
          </div>
        </div>
      );

    case "sec":
      return (
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 md:w-10 md:h-10 relative shrink-0">
            <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
              <circle cx="16" cy="16" r="12" stroke="#F59E0B" strokeWidth="2.5" />
              <path d="M8 20C12 10 20 10 24 16" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
              <circle cx="12" cy="12" r="2.5" fill="#0284C7" />
            </svg>
          </div>
          <div className="text-left">
            <div className="text-[12px] md:text-[13px] font-bold text-[#0369A1] leading-tight font-sans">الشركة السعودية للكهرباء</div>
            <div className="text-[10px] md:text-[11px] font-bold text-[#0369A1] tracking-tight leading-tight">Saudi Electricity Company<br/><span className="font-black text-[11px]">SEC</span></div>
          </div>
        </div>
      );

    case "marafiq":
      return (
        <div className="flex flex-col items-center text-center">
          <div className="text-[21px] md:text-[23px] font-black text-[#0284C7] leading-tight font-sans">مــرافــق</div>
          <div className="text-[13px] md:text-[14px] font-black text-[#EA580C] tracking-widest uppercase -mt-0.5 font-sans">MARAFIQ</div>
        </div>
      );

    case "tasnee":
      return (
        <div className="flex items-center gap-2.5">
          <span className="text-[17px] md:text-[19px] font-black text-[#004B87] tracking-tight font-sans">TASNEE</span>
          <span className="text-[17px] md:text-[19px] font-black text-[#004B87] tracking-tight font-sans">التصنيع</span>
        </div>
      );

    case "petro_rabigh":
      return (
        <div className="flex items-center gap-2.5">
          <div className="text-right">
            <div className="text-[14px] md:text-[15px] font-bold text-[#0F172A] leading-tight font-sans">بترو رابغ</div>
            <div className="text-[10.5px] md:text-[11.5px] font-extrabold text-[#0F172A] tracking-wider uppercase leading-tight font-sans">PETRO RABIGH</div>
          </div>
          <div className="w-8 h-8 md:w-9 md:h-9 relative shrink-0">
            <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
              <path d="M16 28V8" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M16 12C21 8 26 12 28 16" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
              <path d="M16 16C22 13 25 18 26 22" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
              <path d="M16 12C11 8 6 12 4 16" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
              <path d="M16 16C10 13 7 18 6 22" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      );

    case "swcc":
      return (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#0284C7] flex items-center justify-center text-white shrink-0 shadow-xs">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="white" />
            </svg>
          </div>
          <div className="text-left">
            <div className="text-[14px] md:text-[15px] font-black text-[#0369A1] uppercase tracking-wider font-sans leading-tight">SWCC</div>
            <div className="text-[9.5px] md:text-[10px] font-bold text-[#475569] leading-tight font-sans">المؤسسة العامة لتحلية المياه</div>
          </div>
        </div>
      );

    case "nwc":
      return (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-tr from-[#0284C7] to-[#38BDF8] flex items-center justify-center shrink-0 shadow-xs">
            <div className="w-4 h-4 rounded-full bg-white/30" />
          </div>
          <div className="text-left">
            <div className="text-[18px] md:text-[20px] font-black text-[#0369A1] lowercase tracking-tight leading-none font-sans">nwc</div>
            <div className="text-[10px] md:text-[11px] font-bold text-[#0284C7] leading-tight font-sans">شركة المياه الوطنية</div>
          </div>
        </div>
      );

    case "riyadh_metro":
      return (
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[14px] md:text-[15px] font-bold text-[#0F172A] leading-tight font-sans">قطار الرياض</div>
            <div className="text-[10.5px] md:text-[11.5px] font-extrabold text-[#0F172A] uppercase tracking-wider leading-tight font-sans">RIYADH METRO</div>
          </div>
          <div className="w-8 h-8 text-[#16A34A] shrink-0">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12 2L2 9L5 12L12 7L19 12L22 9L12 2Z" />
              <path d="M12 11L2 18L5 21L12 16L19 21L22 18L12 11Z" />
            </svg>
          </div>
        </div>
      );

    case "red_sea_global":
      return (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-9 md:h-9 text-[#B45309] shrink-0">
            <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
              <circle cx="16" cy="16" r="13" strokeDasharray="3 2" />
              <circle cx="16" cy="16" r="9" strokeDasharray="4 2" />
              <circle cx="16" cy="16" r="5" />
            </svg>
          </div>
          <div className="text-left">
            <div className="text-[12px] md:text-[13px] font-bold text-[#92400E] leading-tight font-sans">البحر الأحمر الدولية</div>
            <div className="text-[12.5px] md:text-[13.5px] font-black text-[#92400E] tracking-tight leading-tight font-sans">Red Sea Global</div>
          </div>
        </div>
      );

    case "qiddiya":
      return (
        <div className="flex flex-col items-center text-center">
          <div className="flex items-end gap-1 h-6 mb-0.5">
            <div className="w-2 h-3.5 bg-[#EAB308] rounded-t-xs" />
            <div className="w-2 h-4.5 bg-[#F97316] rounded-t-xs" />
            <div className="w-2 h-6 bg-[#EF4444] rounded-t-xs" />
            <div className="w-2 h-4.5 bg-[#EC4899] rounded-t-xs" />
            <div className="w-2 h-3.5 bg-[#8B5CF6] rounded-t-xs" />
          </div>
          <div className="text-[15px] md:text-[16px] font-bold text-[#4338CA] leading-none font-sans">القدية</div>
          <div className="text-[13px] md:text-[14px] font-black text-[#4338CA] tracking-wider uppercase font-sans">Qiddiya</div>
        </div>
      );

    case "abb":
      return (
        <div className="text-[32px] md:text-[36px] font-black text-[#E62E2D] tracking-tighter uppercase font-sans">
          ABB
        </div>
      );

    case "schneider":
      return (
        <div className="flex flex-col items-center text-center">
          <div className="text-[16px] md:text-[18px] font-black text-[#009A44] tracking-tight leading-tight font-sans">
            Schneider
          </div>
          <div className="text-[13px] md:text-[14px] font-bold text-[#009A44] tracking-wider leading-none flex items-center gap-1 font-sans">
            <span>Electric</span>
            <span className="w-2 h-2 rounded-full bg-[#009A44]" />
          </div>
        </div>
      );

    case "hyundai":
      return (
        <div className="flex items-center gap-2.5">
          <div className="w-4 h-4 md:w-5 md:h-5 text-[#16A34A]">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <polygon points="12,2 22,20 2,20" />
            </svg>
          </div>
          <span className="text-[19px] md:text-[21px] font-black text-[#003087] tracking-wider uppercase font-sans">
            HYUNDAI
          </span>
        </div>
      );

    case "doosan":
      return (
        <div className="text-[24px] md:text-[28px] font-black italic text-[#003865] tracking-wide uppercase font-sans">
          DOOSAN
        </div>
      );

    default:
      return (
        <div className="flex flex-col items-center justify-center text-center p-1">
          {arabic && (
            <div className="text-[16px] md:text-[17px] font-bold text-slate-800 leading-tight">
              {arabic}
            </div>
          )}
          <div className="text-[15px] md:text-[16px] font-black tracking-wider text-slate-800 uppercase font-sans">
            {name || "Enterprise Client"}
          </div>
        </div>
      );
  }
}

interface ClientsListingClientProps {
  clients: ClientItem[];
}

export default function ClientsListingClient({ clients }: ClientsListingClientProps) {
  return (
    <div className="bg-[#f8f9fb] min-h-screen text-slate-900 py-12 px-3 sm:px-6 lg:px-10">
      <div className="max-w-[1650px] mx-auto space-y-12">
        
        {/* ── 1. CLEAN 18-LOGO CLIENTS GRID (6x3) ────────────────────── */}
        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4.5">
          {clients.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded-2xl border border-gray-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-gray-300 transition-all duration-300 px-3 py-4 sm:px-4 sm:py-5 flex items-center justify-center min-h-[110px] md:min-h-[125px] group cursor-default overflow-hidden"
            >
              <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                {renderClientLogo(client.type, client.name, client.arabic, client.logo)}
              </div>
            </div>
          ))}
        </section>

        {/* ── 2. EXACT BOTTOM CTA BANNER ──────────────────────────────── */}
        <section className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-[#090D15] text-white border border-slate-800 shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12">
          
          {/* Industrial Backdrop Image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity pointer-events-none"
            style={{
              backgroundImage:
                "url('/uploads/upload-1790407774913-Civil_Works.avif')"
            }}
          />

          {/* Dark Multi-layer Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#060810]/95 via-[#0A0E17]/90 to-[#060810]/95 pointer-events-none" />

          {/* Left Angled Red Wedge */}
          <div
            className="absolute top-0 left-0 w-32 md:w-48 h-full bg-[#E62E2D] pointer-events-none opacity-90"
            style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
          />

          {/* Right Angled Red Wedge */}
          <div
            className="absolute bottom-0 right-0 w-32 md:w-48 h-full bg-[#E62E2D] pointer-events-none opacity-90"
            style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
          />

          {/* Banner Main Row */}
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            
            {/* Left Column: Headline */}
            <div className="space-y-2 lg:max-w-xs shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-6 h-0.5 bg-[#E62E2D]" />
                <span className="text-[10.5px] font-extrabold uppercase tracking-widest text-[#E62E2D]">
                  PARTNER WITH CONFIDENCE
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none text-white">
                Let&apos;s Build <br />
                <span className="text-[#E62E2D]">Together</span>
              </h2>
            </div>

            {/* Middle Column: Description & Action */}
            <div className="space-y-4 max-w-xl">
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Join our network of valued clients and experience reliable contracting, equipment and industrial solutions for your next project.
              </p>

              <div>
                <Link
                  href="/contact-us"
                  className="inline-flex items-center justify-center gap-1.5 px-6 py-3.5 rounded-xl bg-[#E62E2D] hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <span>GET A QUOTE</span>
                  <span className="text-sm">→</span>
                </Link>
              </div>
            </div>

            {/* Right Column: 3 Trust Badges */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-4 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-white/10 lg:pl-8">
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/80 shrink-0">
                  <ShieldCheck size={17} className="text-slate-300" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Quality</div>
                  <div className="text-[11px] text-slate-400 font-medium">Assured</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/80 shrink-0">
                  <Users size={17} className="text-slate-300" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Trusted</div>
                  <div className="text-[11px] text-slate-400 font-medium">Partnerships</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/80 shrink-0">
                  <BarChart3 size={17} className="text-slate-300" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Proven</div>
                  <div className="text-[11px] text-slate-400 font-medium">Results</div>
                </div>
              </div>

            </div>

          </div>

        </section>

      </div>
    </div>
  );
}
