import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import LottiePlayer from "@/components/LottiePlayer";
import React from "react";
import { serviceDataMap, ServiceDetail, IconHelper } from "@/data/services";
import { notFound } from "next/navigation";

export const locations = ["new-york", "san-francisco", "london", "austin", "toronto", "berlin"];

export const revalidate = 300;

export function generateStaticParams() {
    const params: { slug: string; location: string }[] = [];
    Object.keys(serviceDataMap).forEach((slug) => {
        locations.forEach((location) => {
            params.push({ slug, location });
        });
    });
    return params;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; location: string }> }): Promise<Metadata> {
    const { slug, location } = await params;
    const service = serviceDataMap[slug];

    if (!service || !locations.includes(location)) {
        return {
            title: "Services",
            description: "Custom software, SaaS, AI agents, and workflow automation services by JANTRA.",
        };
    }

    const formattedLocation = location.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    const title = `${service.title} in ${formattedLocation} | JANTRA`;
    const description = `Top-tier ${service.title.toLowerCase()} services in ${formattedLocation}. ${service.description}`;
    const url = `https://jantrasoft.online/services/${slug}/${location}`;

    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: {
            title,
            description,
            url,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}

export default async function LocationServiceDetailPage({ params }: { params: Promise<{ slug: string; location: string }> }) {
    const { slug, location } = await params;
    const service = serviceDataMap[slug];

    if (!service || !locations.includes(location)) {
        notFound();
    }

    const formattedLocation = location.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": service.faqs.map((faq) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <main className="relative w-full min-h-screen bg-slate-50/30 pb-32 overflow-x-hidden selection:bg-orange-100">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            {/* Dynamic ambient background glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-200/10 blur-[130px] rounded-full -z-20 pointer-events-none" />
            <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-100/5 blur-[120px] rounded-full -z-20 pointer-events-none" />

            {/* Grid pattern background */}
            <div className="absolute top-0 inset-x-0 h-[600px] overflow-hidden pointer-events-none select-none -z-10 opacity-[0.015] md:opacity-[0.02]">
                <div className="w-full h-full bg-[linear-gradient(to_right,#ea580c_1px,transparent_1px),linear-gradient(to_bottom,#ea580c_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            </div>

            <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-28 sm:pt-40">
                
                {/* ── BREADCRUMB ── */}
                <Link href={`/services/${slug}`} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-orange-600 transition-colors mb-12">
                     <ArrowLeft className="w-3.5 h-3.5" /> Back to {service.title}
                </Link>

                {/* ── HERO ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24 sm:mb-32">
                    <div className="lg:col-span-7 space-y-8 text-left">
                         <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-[9px] font-black uppercase tracking-widest text-orange-600 bg-orange-50 px-4 py-2 rounded-full border border-orange-100">{service.category} in {formattedLocation}</span>
                            {service.demoUrl && (
                                <a 
                                    href={service.demoUrl} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-orange-600 bg-slate-50 px-4 py-2 rounded-full border border-slate-100 flex items-center gap-1.5 transition-all"
                                >
                                    View Live Demo <ArrowRight className="w-3 h-3" />
                                </a>
                            )}
                            <div className="w-12 h-[1px] bg-slate-200" />
                         </div>
                         <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-none uppercase">
                             {service.title} in {formattedLocation}<span className="text-orange-500">.</span>
                         </h1>
                         <p className="text-slate-500 text-sm sm:text-base font-medium leading-relaxed max-w-xl">
                             Top-tier {service.title.toLowerCase()} services tailored for businesses in {formattedLocation}. {service.longDescription || service.description}
                         </p>
                    </div>

                    <div className={`lg:col-span-5 aspect-[1.1] ${service.descBg} rounded-[2.5rem] border border-slate-200/40 shadow-sm flex items-center justify-center overflow-hidden ${service.banner ? 'p-0' : 'p-10'} relative`}>
                         <div className="absolute inset-0 bg-[linear-gradient(to_right,#ea580c_1px,transparent_1px),linear-gradient(to_bottom,#ea580c_1px,transparent_1px)] bg-[size:16px_16px] opacity-[0.01]" />
                         {service.banner ? (
                             <img src={service.banner} alt={service.title} className="w-full h-full object-cover" />
                         ) : (
                             <LottiePlayer src={service.lottie} className="w-full h-full max-w-[320px] object-contain" />
                         )}
                    </div>
                </div>

                {/* ── CORE DELIVERABLES ── */}
                <div className="space-y-8 mb-28 sm:mb-36">
                    <div className="text-left max-w-xl">
                        <span className="text-orange-600 font-bold tracking-widest text-[9px] uppercase mb-2 block">Key Capabilities</span>
                        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase">What We Deliver in {formattedLocation}<span className="text-orange-500">.</span></h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        {service.deliverables.map((del, i) => (
                            <div key={i} className="p-8 rounded-[2rem] bg-white border border-slate-200/60 shadow-lg shadow-slate-100/20 transition-all duration-300 hover:shadow-xl hover:border-orange-500/20 hover:-translate-y-1 text-left flex flex-col justify-between group">
                                <div>
                                    <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 border border-orange-100 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                                        <IconHelper name={del.icon} className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight mb-3">{del.title}</h3>
                                    <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">{del.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── PROCESS STEPS ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-28 sm:mb-36">
                    <div className="lg:col-span-4 text-left">
                        <span className="text-orange-600 font-bold tracking-widest text-[9px] uppercase mb-2 block">Methodology</span>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase leading-tight mb-4">Our <br className="hidden lg:block"/>Process.</h2>
                        <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed max-w-sm">We operate in highly organized, iterative sprints to ensure maximum visibility, transparency, and product alignment for our {formattedLocation} clients.</p>
                    </div>
                    <div className="lg:col-span-8 flex flex-col gap-4">
                        {service.process.map((step, i) => (
                            <div key={i} className="group p-6 rounded-[1.75rem] bg-white border border-slate-200/50 shadow-sm flex items-center gap-6 sm:gap-8 hover:border-orange-500/30 hover:shadow-md transition-all duration-300 text-left">
                                <span className="text-3xl sm:text-4xl font-black text-slate-200 group-hover:text-orange-500 transition-colors duration-300">{step.num}</span>
                                <div className="space-y-1">
                                    <h4 className="font-black text-slate-900 text-sm sm:text-base uppercase tracking-tight">{step.title}</h4>
                                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-normal">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── TECH & CALL-TO-ACTION ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-28 sm:mb-36">
                    
                    {/* TECH STACK (LIGHT THEMED) */}
                    <div className="p-8 sm:p-12 rounded-[2.5rem] bg-white border border-slate-200/60 shadow-lg shadow-slate-100/20 space-y-8 flex flex-col justify-between text-left">
                        <div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-orange-600 bg-orange-50 px-3.5 py-1.5 rounded-full border border-orange-100 mb-6 inline-block">Architecture</span>
                            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 uppercase">Tech Stack.</h2>
                            <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed mt-2">
                                We utilize modern, proven tools and frameworks to engineer robust databases and maintain clean module separations.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-4">
                            {service.techStack.map((tech, i) => (
                                <span key={i} className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200/60 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-orange-500/30 hover:text-orange-600 hover:bg-orange-50/20 hover:scale-102 transition-all duration-300">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* REDESIGNED CTA WITH HIGH CONTRAST */}
                    <div className="p-8 sm:p-12 rounded-[2.5rem] bg-gradient-to-br from-orange-500 to-orange-600 text-white flex flex-col justify-between relative overflow-hidden shadow-xl shadow-orange-500/10 text-left">
                         {/* Ambient overlay grid pattern */}
                         <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none select-none opacity-40" />
                         <div className="space-y-4 relative z-10">
                            <span className="text-[9px] font-black uppercase tracking-widest text-orange-100 bg-orange-700/30 px-3.5 py-1.5 rounded-full border border-white/10 inline-block mb-2">{formattedLocation} Consultation</span>
                            <h2 className="text-3xl font-black tracking-tight uppercase leading-none">Ready to Build?</h2>
                            <p className="text-orange-50 text-xs sm:text-sm font-medium leading-relaxed max-w-sm">
                                Schedule a brief discovery call to explore your project architecture and get a comprehensive scope of work.
                            </p>
                         </div>
                         <div className="relative z-10 pt-8 sm:pt-12">
                             <Link href="/contact" className="w-full py-5 rounded-2xl bg-white text-orange-600 font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-950 hover:text-white transition-all duration-300 shadow-xl active:scale-95 cursor-pointer">
                                Get A Quote <ArrowRight className="w-4 h-4" />
                             </Link>
                         </div>
                    </div>
                </div>

                {/* ── INTERACTIVE FAQ SECTION ── */}
                <div className="max-w-3xl mx-auto space-y-8 text-left mb-12">
                    <div className="text-center space-y-2">
                        <span className="text-orange-600 font-bold tracking-widest text-[9px] uppercase">Got Questions?</span>
                        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase">Service FAQs<span className="text-orange-500">.</span></h2>
                    </div>
                    <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
                        {service.faqs.map((faq, i) => (
                            <details key={i} className="group py-6 [&_summary::-webkit-details-marker]:hidden">
                                <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-slate-900 list-none">
                                    <h3 className="font-bold text-sm sm:text-base text-slate-800 uppercase tracking-tight group-open:text-orange-600 transition-colors duration-200">
                                        {faq.question}
                                    </h3>
                                    <span className="shrink-0 rounded-full bg-slate-50 border border-slate-200/80 p-1.5 text-slate-900 group-open:rotate-180 transition-transform duration-300">
                                        <ChevronDown className="w-4 h-4 text-slate-500 group-open:text-orange-600" />
                                    </span>
                                </summary>
                                <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-500 font-medium transition-all duration-200">
                                    {faq.answer}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>

                {/* ── AVAILABLE LOCATIONS ── */}
                <div className="max-w-3xl mx-auto border-t border-slate-200/60 pt-12 text-center">
                    <span className="text-slate-400 font-bold tracking-widest text-[9px] uppercase mb-4 block">Available in Major Tech Hubs</span>
                    <div className="flex flex-wrap justify-center gap-4">
                        {locations.filter(l => l !== location).map((city) => (
                            <Link key={city} href={`/services/${slug}/${city}`} className="text-xs font-semibold text-slate-500 hover:text-orange-600 transition-colors uppercase tracking-wide">
                                {city.replace('-', ' ')}
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </main>
    );
}
