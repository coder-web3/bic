import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import ContactFormClient from "@/components/ContactFormClient";
import { getSiteSettings } from "@/lib/getSiteSettings";
import { constructMetadata, buildBreadcrumbJsonLd, siteConfig } from "@/lib/seo";
import { MapPin, Phone, Mail, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: "Contact Us & Request Technical RFQ | Best International KSA",
    description: "Connect with Best International Contracting in Saudi Arabia. Request a commercial quote for industrial contracting, equipment rental, material procurement, or manpower supply.",
    canonical: `${siteConfig.url}/contact-us`,
    focusKeyword: "Contact Best International Contracting Saudi Arabia",
    image: `${siteConfig.url}/uploads/og-default.jpg`,
  });
}

export default function ContactPage() {
  const settings = getSiteSettings();
  const general = settings?.general;
  const header = settings?.header;
  const footer = settings?.footer;

  const phone = general?.phone || header?.phone || "+966 54 750 4485";
  const email = general?.email || header?.email || "info@bestincontracting.com";
  const address = general?.address || header?.address || "King Fahd Road, Al Olaya District, Riyadh, Saudi Arabia";

  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Contact Us", url: "/contact-us" },
  ]);

  return (
    <main className="min-h-screen bg-[#fdfdfd]">
      <JsonLd data={breadcrumbs} />
      <Header />

      {/* Premium Page Hero (Exact Services Listing Page Hero Design Standard) */}
      <div className="pt-[var(--header-h,88px)]">
        <PageHero
          badge="GET IN TOUCH"
          title="Contact Our Team &"
          titleAccent="Request Technical RFQ"
          description="Connect with our technical engineering consultants, heavy equipment dispatch coordinators, and procurement specialists across Saudi Arabia for rapid commercial proposals."
          breadcrumbs={[{ label: "Contact Us" }]}
          bgImage="https://images.unsplash.com/photo-1504307651254-35680f356f12?q=80&w=2070&auto=format&fit=crop"
          watermark="CONTACT"
          taglines={[
            "RAPID 24-HOUR RFQ RESPONSE",
            "HEADQUARTERED IN RIYADH & DAMMAM",
            "SAUDI ARAMCO APPROVED",
            "KINGDOM-WIDE MOBILIZATION"
          ]}
          stats={[
            { value: "< 24h", label: "RFQ Turnaround" },
            { value: "100%", label: "Kingdom Coverage" },
            { value: "30+", label: "Years Experience" },
            { value: "24/7", label: "Operations Support" },
          ]}
        />
      </div>

      {/* Section Sub-heading Banner */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 pt-14 pb-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-8">
          <div>
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-10 h-[2px] bg-[#E62E2D]" />
              <span className="text-[#E62E2D] font-bold text-xs sm:text-sm tracking-widest uppercase">
                DIRECT COMMUNICATION
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-[34px] font-bold leading-[1.2] tracking-tight text-[#111]">
              Let&apos;s Build Your Next <br className="hidden sm:inline" />
              <span className="text-[#E62E2D] relative inline-block">
                Industrial Milestone
                <span className="absolute bottom-1 left-0 w-full h-[8px] bg-[#E62E2D]/20 -z-10" />
              </span>
            </h2>
          </div>
          <p className="text-gray-600 text-sm sm:text-base max-w-md leading-relaxed">
            Reach out through our inquiry channels below or submit a detailed Scope of Work (SOW) for prompt evaluation by our estimating team.
          </p>
        </div>
      </div>

      {/* Contact Cards & Form Grid */}
      <section className="max-w-[1650px] mx-auto px-6 sm:px-10 lg:px-12 py-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Contact Channels & Credentials (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xs font-black tracking-widest text-[#E62E2D] uppercase">
                    HEADQUARTERS &amp; HUBS
                  </span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <div className="space-y-6 text-gray-700">
                  {/* Address */}
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E62E2D] flex items-center justify-center font-bold shrink-0 border border-red-100 group-hover:bg-[#E62E2D] group-hover:text-white transition-all duration-300 shadow-xs">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#111] text-base mb-1">Corporate Headquarters</h4>
                      <p className="text-gray-600 leading-relaxed text-sm">
                        {address}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E62E2D] flex items-center justify-center font-bold shrink-0 border border-red-100 group-hover:bg-[#E62E2D] group-hover:text-white transition-all duration-300 shadow-xs">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#111] text-base mb-1">Direct Phone &amp; Dispatch</h4>
                      <p className="text-gray-600 text-sm">
                        <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-[#E62E2D] transition-colors font-medium">
                          {phone}
                        </a>
                        {footer?.phone2 && (
                          <>
                            <br />
                            <a href={`tel:${footer.phone2.replace(/\s+/g, '')}`} className="hover:text-[#E62E2D] transition-colors font-medium">
                              {footer.phone2} (Support)
                            </a>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E62E2D] flex items-center justify-center font-bold shrink-0 border border-red-100 group-hover:bg-[#E62E2D] group-hover:text-white transition-all duration-300 shadow-xs">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#111] text-base mb-1">Electronic Correspondence</h4>
                      <p className="text-gray-600 text-sm">
                        <a href={`mailto:${email}`} className="hover:text-[#E62E2D] transition-colors font-medium">
                          {email}
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E62E2D] flex items-center justify-center font-bold shrink-0 border border-red-100 group-hover:bg-[#E62E2D] group-hover:text-white transition-all duration-300 shadow-xs">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#111] text-base mb-1">Business Operating Hours</h4>
                      <p className="text-gray-600 text-sm">
                        {footer?.workingHours || "Sunday – Thursday: 8:00 AM – 5:00 PM (AST)"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quality Standards Guarantee Box */}
              <div className="mt-8 pt-6 border-t border-gray-100 bg-[#fafafa] -mx-8 -mb-8 sm:-mx-10 sm:-mb-10 p-6 sm:p-8 rounded-b-3xl">
                <div className="flex items-center gap-3 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-2">
                  <ShieldCheck size={18} className="text-emerald-600" />
                  <span>Saudi Aramco &amp; ISO 9001 Certified Partner</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  All requests and technical submittals are handled by qualified engineers adhering to strict Saudi Aramco, SABIC, and Royal Commission compliance frameworks.
                </p>
              </div>
            </div>

            {/* Response Commitment Card */}
            <div className="bg-[#0f172a] text-white p-7 rounded-3xl shadow-lg border border-slate-800 flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-[#E62E2D] flex items-center justify-center text-white shrink-0 shadow-md">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-1">Guaranteed Fast Response</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Commercial bids &amp; equipment availability are dispatched within 24 business hours.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: RFQ Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-sm">
            <div className="mb-8">
              <span className="text-xs font-bold text-[#E62E2D] uppercase tracking-widest block mb-2">
                COMMERCIAL &amp; TECHNICAL INQUIRY
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111] mb-2">
                Submit RFQ or Project Scope
              </h2>
              <p className="text-gray-500 text-sm">
                Provide your project specifications, required equipment models, manpower quantities, or service requirements below.
              </p>
            </div>
            <ContactFormClient />
          </div>

        </div>
      </section>

      {/* ── Full-Width Interactive Google Map Section ── */}
      <section className="w-full relative border-t border-gray-200 bg-gray-100 overflow-hidden">
        {/* Floating Headquarters Location Badge Overlay */}
        <div className="absolute top-6 left-6 md:top-8 md:left-12 z-10 bg-white/95 backdrop-blur-md px-5 py-4 rounded-2xl border border-gray-200 shadow-xl max-w-sm pointer-events-none hidden sm:flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#E62E2D] text-white flex items-center justify-center shrink-0 shadow-md">
            <MapPin size={22} />
          </div>
          <div>
            <div className="text-[10px] font-black tracking-widest text-[#E62E2D] uppercase mb-0.5">
              CENTRAL HEADQUARTERS
            </div>
            <h4 className="font-bold text-gray-900 text-sm leading-tight">
              Best International Contracting
            </h4>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
              {address}
            </p>
          </div>
        </div>

        {/* Full-width responsive Google Maps Iframe */}
        <iframe
          title="Best International Contracting Location Map"
          src="https://maps.google.com/maps?q=King+Fahd+Road,+Al+Olaya,+Riyadh,+Saudi+Arabia&t=&z=14&ie=UTF8&iwloc=&output=embed"
          className="w-full h-[400px] sm:h-[480px] lg:h-[520px] border-0 grayscale-[20%] contrast-[1.05] hover:grayscale-0 transition-all duration-500 block"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

      <Footer />
    </main>
  );
}
