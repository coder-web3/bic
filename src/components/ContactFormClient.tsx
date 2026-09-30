"use client";

import { useState } from "react";
import { Send, CheckCircle2, RefreshCw } from "lucide-react";

export default function ContactFormClient() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  if (submitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-8 sm:p-10 rounded-2xl text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xs">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-xl font-bold mb-2 text-emerald-900">RFQ Inquiry Submitted Successfully!</h3>
        <p className="text-sm text-emerald-700 max-w-md mx-auto leading-relaxed">
          Thank you for contacting Best International Contracting. Our estimation and dispatch team will evaluate your scope and reply within 24 business hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-6 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
        >
          Send Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
          Full Name <span className="text-[#E62E2D]">*</span>
        </label>
        <input
          required
          type="text"
          placeholder="e.g. Eng. Mohammed Al-Otaibi"
          className="w-full px-4 py-3.5 bg-[#f8fafc] border border-gray-200 rounded-xl focus:outline-none focus:border-[#E62E2D] focus:bg-white text-sm text-gray-900 transition-all shadow-2xs"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
            Corporate Email <span className="text-[#E62E2D]">*</span>
          </label>
          <input
            required
            type="email"
            placeholder="m.otaibi@company.com"
            className="w-full px-4 py-3.5 bg-[#f8fafc] border border-gray-200 rounded-xl focus:outline-none focus:border-[#E62E2D] focus:bg-white text-sm text-gray-900 transition-all shadow-2xs"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
            Phone / Mobile Number <span className="text-[#E62E2D]">*</span>
          </label>
          <input
            required
            type="tel"
            placeholder="+966 50 000 0000"
            className="w-full px-4 py-3.5 bg-[#f8fafc] border border-gray-200 rounded-xl focus:outline-none focus:border-[#E62E2D] focus:bg-white text-sm text-gray-900 transition-all shadow-2xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
            Primary Division / Service
          </label>
          <select className="w-full px-4 py-3.5 bg-[#f8fafc] border border-gray-200 rounded-xl focus:outline-none focus:border-[#E62E2D] focus:bg-white text-sm text-gray-900 transition-all shadow-2xs">
            <option>Contracting Services (Civil, Mech, Electrical)</option>
            <option>Heavy Equipment Rental Fleet</option>
            <option>Industrial Material Supply &amp; Piping</option>
            <option>Certified Technical Manpower Supply</option>
            <option>Turnkey Industrial Facility Maintenance</option>
            <option>General Commercial Inquiry</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
            Project Location / Region
          </label>
          <input
            type="text"
            placeholder="e.g. Jubail, Ras Tanura, Riyadh, Dammam"
            className="w-full px-4 py-3.5 bg-[#f8fafc] border border-gray-200 rounded-xl focus:outline-none focus:border-[#E62E2D] focus:bg-white text-sm text-gray-900 transition-all shadow-2xs"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
          Scope of Work / Specifications / Equipment Models <span className="text-[#E62E2D]">*</span>
        </label>
        <textarea
          required
          rows={4}
          placeholder="Please describe your required machinery tonnage, crew headcounts, bill of quantities, project timelines, or attachable requirements..."
          className="w-full px-4 py-3.5 bg-[#f8fafc] border border-gray-200 rounded-xl focus:outline-none focus:border-[#E62E2D] focus:bg-white text-sm text-gray-900 transition-all shadow-2xs resize-y"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-[#E62E2D] to-red-600 hover:from-red-600 hover:to-red-700 text-white font-extrabold py-4 px-8 uppercase text-xs tracking-widest rounded-xl transition-all duration-300 cursor-pointer shadow-lg shadow-red-900/20 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2.5 disabled:opacity-75"
      >
        {loading ? (
          <>
            <RefreshCw size={16} className="animate-spin" />
            <span>Processing RFQ...</span>
          </>
        ) : (
          <>
            <span>Submit Technical RFQ</span>
            <Send size={15} />
          </>
        )}
      </button>
    </form>
  );
}
