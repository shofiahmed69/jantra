"use client";

import LottiePlayer from "@/components/LottiePlayer";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { 
    ArrowRight, 
    Code, Smartphone, Bot, Workflow, 
    Cloud, Layout, Cpu, Database
} from "lucide-react";
import { homeServicePreview } from "@/content/site";

const capabilitiesMap: Record<string, { features: string[]; techStack: string[] }> = {
    "custom-software-development": {
        features: ["UI/UX Design", "Responsive Frontend", "Core REST APIs"],
        techStack: ["React", "Next.js"]
    },
    "ai-agent-development": {
        features: ["Custom AI Models", "Search Systems", "AI Chat Integration"],
        techStack: ["Python", "OpenAI"]
    },
    "workflow-automation": {
        features: ["System Integration", "Automatic Alerts", "Data Syncing"],
        techStack: ["Make.com", "n8n"]
    },
    "saas-product-development": {
        features: ["Secure Login", "Subscription Billing", "User Dashboards"],
        techStack: ["Next.js", "Stripe"]
    },
    "mobile-app-development": {
        features: ["iOS & Android Apps", "Offline Support", "Push Notifications"],
        techStack: ["React Native", "Expo"]
    },
    "cloud-api-systems": {
        features: ["Cloud Hosting", "Custom APIs", "Secure Databases"],
        techStack: ["AWS", "Docker"]
    }
};

export default function ServicesPage() {
    const router = useRouter();
    const services = useMemo(() => homeServicePreview.map((s, i) => {
        const slug = s.title.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-');
        return {
            ...s,
            id: `0${i + 1}`,
            slug,
            icon: slug.includes('mobile') ? Smartphone :
                  slug.includes('ai') ? Bot :
                  slug.includes('automation') ? Workflow :
                  slug.includes('cloud') ? Cloud :
                  slug.includes('saas') ? Cpu :
                  slug.includes('software') ? Code :
                  slug.includes('interface') ? Layout : Database,
            capabilities: capabilitiesMap[slug]
        };
    }), []);

    useEffect(() => {
        for (const service of services) {
            router.prefetch(`/services/${service.slug}`);
        }
    }, [router, services]);

    return (
        <main className="relative w-full min-h-screen bg-slate-50/50 pb-24 overflow-x-hidden selection:bg-orange-100">
            {/* Dynamic ambient background glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-200/15 blur-[140px] rounded-full -z-20 pointer-events-none" />
            <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-100/10 blur-[130px] rounded-full -z-20 pointer-events-none" />

            {/* Grid pattern background */}
            <div className="absolute top-0 inset-x-0 h-[500px] overflow-hidden pointer-events-none select-none -z-10 opacity-[0.02] md:opacity-[0.03]">
                <div className="w-full h-full bg-[linear-gradient(to_right,#ea580c_1px,transparent_1px),linear-gradient(to_bottom,#ea580c_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            </div>

            <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-28 sm:pt-36">
                
                {/* ── HEADER ── */}
                <div className="max-w-2xl mb-16 text-left">
                    <span className="text-orange-600 font-bold tracking-widest text-[10px] uppercase mb-3 block">Expertise Registry</span>
                    <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-none tracking-tight uppercase mb-4">
                        Our Services<span className="text-orange-500">.</span>
                    </h1>
                    <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed max-w-xl">
                        High-performance engineering solutions designed to solve complex digital challenges. Modular architectures, clean systems, and robust execution.
                    </p>
                </div>

                {/* ── SERVICES GRID ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                    {services.map((service, i) => (
                        <motion.div 
                            key={service.slug} 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="group relative p-6 rounded-[2rem] bg-white border border-slate-200/60 shadow-lg shadow-slate-100/30 hover:border-orange-500/25 hover:shadow-2xl hover:shadow-orange-500/5 hover:-translate-y-1.5 flex flex-col justify-between transition-all duration-300 h-full overflow-hidden"
                            onMouseEnter={() => router.prefetch(`/services/${service.slug}`)}
                            onTouchStart={() => router.prefetch(`/services/${service.slug}`)}
                        >
                            {/* Subtle background glow on card hover */}
                            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-orange-50/0 via-transparent to-orange-500/0 group-hover:from-orange-500/1 group-hover:to-orange-500/3 transition-all duration-500" />

                            <div>
                                {/* Icon & ID Row */}
                                <div className="flex items-center justify-between mb-5">
                                    <div className="w-11 h-11 rounded-xl bg-white text-orange-600 flex items-center justify-center shadow-md border border-orange-100/80 group-hover:bg-orange-600 group-hover:text-white group-hover:scale-105 transition-all duration-300">
                                        <service.icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-[7.5px] font-black text-orange-600/85 uppercase tracking-[0.25em] bg-orange-50 border border-orange-100 px-3 py-1 rounded-full shadow-sm">
                                        #{service.id}
                                    </span>
                                </div>

                                {/* Blueprint Canvas Lottie Preview */}
                                <div className="relative w-full aspect-[2/1] max-h-[140px] flex items-center justify-center bg-slate-50/60 rounded-[1.25rem] p-4 overflow-hidden border border-slate-200/20 shadow-inner mb-6 shrink-0">
                                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ea580c_1px,transparent_1px),linear-gradient(to_bottom,#ea580c_1px,transparent_1px)] bg-[size:16px_16px] opacity-[0.015]" />
                                    <LottiePlayer 
                                        src={service.animationSrc!} 
                                        className="w-full h-full opacity-90 group-hover:scale-102 transition-transform duration-700 object-contain" 
                                    />
                                </div>

                                {/* Service details */}
                                <div className="space-y-2.5 text-left">
                                    <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase leading-snug group-hover:text-orange-600 transition-colors">
                                        {service.title}
                                    </h3>
                                    <p className="text-[11px] leading-relaxed text-slate-500 font-medium line-clamp-3">
                                        {service.description}
                                    </p>
                                </div>

                                {/* Capability Tags list */}
                                {service.capabilities && (
                                    <div className="flex flex-wrap gap-1.5 mt-5">
                                        {service.capabilities.features.map((feat, fIdx) => (
                                            <span key={fIdx} className="text-[7.5px] font-black uppercase tracking-widest bg-orange-50/50 text-orange-700/80 border border-orange-100/40 px-2.5 py-0.5 rounded-full">
                                                {feat}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            {/* Action link */}
                            <div className="pt-4 mt-5 border-t border-slate-100/70 flex items-center justify-between">
                                <span className="inline-flex items-center gap-1.5 text-[8.5px] font-black text-slate-950 uppercase tracking-[0.2em] group-hover:text-orange-600 transition-colors">
                                    View Details <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300 text-orange-500" />
                                </span>
                            </div>
                            
                            <Link href={`/services/${service.slug}`} className="absolute inset-0 z-20" />
                        </motion.div>
                    ))}
                </div>

                {/* ── BOTTOM SPATIAL CTA CARD ── */}
                <div className="mt-24 p-8 sm:p-12 rounded-[2rem] bg-slate-950 text-white flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative overflow-hidden shadow-2xl border border-white/5">
                    {/* Glowing backdrops for spatial depth */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 blur-[110px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 left-[-5%] w-80 h-80 bg-blue-500/5 blur-[90px] rounded-full pointer-events-none" />

                    <div className="space-y-3 relative z-10">
                        <span className="text-orange-500 font-black tracking-widest text-[9px] uppercase">Immediate Scoping Available</span>
                        <h2 className="text-2xl sm:text-4xl font-black tracking-tighter uppercase leading-none">Ready to Start?</h2>
                        <p className="text-slate-400 text-xs sm:text-sm font-medium leading-relaxed max-w-md">Our engineering team operates globally to ensure quick scoping, transparent deliverables, and fast launch cycles.</p>
                    </div>
                    
                    <Link href="/contact" className="relative z-10 px-8 py-4.5 rounded-xl bg-orange-600 text-white text-[9.5px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-white hover:text-slate-950 transition-all shadow-lg hover:shadow-orange-500/10 active:scale-95">
                        Start Project <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </main>
    );
}
