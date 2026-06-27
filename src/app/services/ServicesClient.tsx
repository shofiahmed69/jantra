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

const capabilitiesMap: Record<string, { features: string[]; techStack: string[]; color: string; accentGlow: string }> = {
    "custom-software-development": {
        features: ["UI/UX Design", "Responsive Frontend", "Core REST APIs"],
        techStack: ["React", "Next.js"],
        color: "#f97316",
        accentGlow: "rgba(249, 115, 22, 0.12)"
    },
    "ai-agent-development": {
        features: ["Custom AI Models", "Search Systems", "AI Chat Integration"],
        techStack: ["Python", "OpenAI"],
        color: "#a855f7",
        accentGlow: "rgba(168, 85, 247, 0.12)"
    },
    "workflow-automation": {
        features: ["System Integration", "Automatic Alerts", "Data Syncing"],
        techStack: ["Make.com", "n8n"],
        color: "#ec4899",
        accentGlow: "rgba(236, 72, 153, 0.12)"
    },
    "saas-product-development": {
        features: ["Secure Login", "Subscription Billing", "User Dashboards"],
        techStack: ["Next.js", "Stripe"],
        color: "#10b981",
        accentGlow: "rgba(16, 185, 129, 0.12)"
    },
    "mobile-app-development": {
        features: ["iOS & Android Apps", "Offline Support", "Push Notifications"],
        techStack: ["React Native", "Expo"],
        color: "#3b82f6",
        accentGlow: "rgba(59, 130, 246, 0.12)"
    },
    "cloud-api-systems": {
        features: ["Cloud Hosting", "Custom APIs", "Secure Databases"],
        techStack: ["AWS", "Docker"],
        color: "#8b5cf6",
        accentGlow: "rgba(139, 92, 246, 0.12)"
    }
};

export default function ServicesPage() {
    const router = useRouter();
    const services = useMemo(() => homeServicePreview.map((s, i) => {
        const slug = s.title.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-');
        const cap = capabilitiesMap[slug] || {
            features: ["Digital Solutions", "Custom Architecture"],
            techStack: ["Modern Stack"],
            color: "#f97316",
            accentGlow: "rgba(249, 115, 22, 0.12)"
        };
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
            capabilities: cap
        };
    }), []);

    useEffect(() => {
        for (const service of services) {
            router.prefetch(`/services/${service.slug}`);
        }
    }, [router, services]);

    return (
        <main className="relative w-full min-h-screen bg-[#fcfaf8] pb-24 overflow-x-hidden selection:bg-orange-100">
            {/* Ambient dynamic background glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-500/[0.02] blur-[150px] rounded-full -z-20 pointer-events-none" />
            <div className="absolute top-[35%] right-[-10%] w-[600px] h-[600px] bg-amber-500/[0.015] blur-[140px] rounded-full -z-20 pointer-events-none" />

            {/* Clean minimal background grid */}
            <div className="absolute top-0 inset-x-0 h-[700px] overflow-hidden pointer-events-none select-none -z-10 opacity-[0.02] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_80%,transparent_100%)]">
                <div className="w-full h-full bg-[linear-gradient(to_right,#ea580c_1px,transparent_1px),linear-gradient(to_bottom,#ea580c_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            </div>

            <div className="max-w-[1240px] mx-auto px-5 sm:px-8 pt-28 sm:pt-36">
                
                {/* ── HEADER ── */}
                <div className="max-w-2xl mb-16 text-left relative z-10">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-4 h-[1.5px] bg-orange-500 rounded-full" />
                    <span className="text-orange-600 font-bold tracking-widest text-[9px] uppercase font-mono">Capabilities Registry</span>
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-none uppercase tracking-tighter mb-4">
                    Our Services<span className="text-orange-500">.</span>
                  </h1>
                  <p className="text-slate-500 text-xs sm:text-sm font-semibold uppercase tracking-wider leading-relaxed max-w-xl">
                    High-performance engineering designed for clarity, performance, and scale. We build clean digital tools, AI agents, and workflows.
                  </p>
                </div>

                {/* ── SERVICES GRID ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch relative z-10">
                    {services.map((service, i) => {
                        const cap = service.capabilities;

                        const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = e.clientX - rect.left;
                          const y = e.clientY - rect.top;
                          e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
                          e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
                        };

                        return (
                          <motion.div 
                              key={service.slug} 
                              initial={{ opacity: 0, y: 15 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true, margin: "-50px" }}
                              transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
                              onMouseMove={handleMouseMove}
                              style={{
                                "--spotlight-color": cap.accentGlow
                              } as React.CSSProperties}
                              className="group relative flex flex-col justify-between cursor-pointer"
                              onMouseEnter={() => router.prefetch(`/services/${service.slug}`)}
                              onTouchStart={() => router.prefetch(`/services/${service.slug}`)}
                          >
                              {/* 1. Background offset card layer (Dual layer styling with custom service colors) */}
                              <div 
                                  className="absolute inset-0 rounded-2xl border translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-500 -z-10"
                                  style={{
                                    borderColor: `${cap.color}35`,
                                    backgroundColor: `${cap.color}05`
                                  }}
                              />

                              {/* 2. Foreground main card layer */}
                              <div className="w-full h-full rounded-2xl bg-white border border-slate-200/90 p-6 flex flex-col justify-between transition-all duration-500 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:border-slate-400 group-hover:shadow-[0_15px_35px_rgba(0,0,0,0.03)] before:absolute before:inset-0 before:bg-[radial-gradient(130px_circle_at_var(--mouse-x,0px)_var(--mouse-y,0px),var(--spotlight-color),transparent)] before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300 before:pointer-events-none before:z-0 overflow-hidden relative">
                                  
                                  <div className="flex flex-col text-left relative z-10">
                                      {/* Top Icon & ID Line */}
                                      <div className="flex items-center justify-between mb-4">
                                          <span className="text-[9px] font-black tracking-widest text-slate-300 font-mono">
                                              #{service.id}
                                          </span>
                                          <div 
                                              className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-300"
                                              style={{
                                                color: cap.color,
                                                borderColor: `${cap.color}25`,
                                                backgroundColor: `${cap.color}08`
                                              }}
                                          >
                                              <service.icon className="w-3.5 h-3.5 stroke-[2]" />
                                          </div>
                                      </div>

                                      {/* Floating Lottie Player directly inside card (No inner card design) */}
                                      <div className="w-full aspect-[2/1] max-h-[120px] flex items-center justify-center p-2 mb-4 relative overflow-hidden select-none">
                                          <LottiePlayer 
                                              src={service.animationSrc!} 
                                              className="w-full h-full object-contain opacity-95 transition-transform duration-500 group-hover:scale-[1.02]" 
                                          />
                                      </div>

                                      {/* Title & Description */}
                                      <div className="space-y-1.5 mt-2">
                                          <h3 
                                              className="text-sm font-black tracking-tight uppercase transition-colors duration-300"
                                              style={{ color: "#0f172a" }}
                                              onMouseEnter={(e) => e.currentTarget.style.color = cap.color}
                                              onMouseLeave={(e) => e.currentTarget.style.color = "#0f172a"}
                                          >
                                              {service.title}
                                          </h3>
                                          <p className="text-xs leading-relaxed text-slate-500 font-medium line-clamp-3">
                                              {service.description}
                                          </p>
                                      </div>

                                      {/* Capabilities: Simple List */}
                                      {cap && cap.features && (
                                          <div className="flex flex-wrap gap-x-2.5 gap-y-1 mt-4 text-[8.5px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                                              {cap.features.map((feat, fIdx) => (
                                                  <span key={fIdx} className="after:content-['•'] after:ml-2.5 last:after:content-none">
                                                      {feat}
                                                  </span>
                                              ))}
                                          </div>
                                      )}
                                  </div>
                                  
                                  {/* Bottom row */}
                                  <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between z-10">
                                      <span className="inline-flex items-center gap-1.5 text-[8.5px] font-black text-slate-900 uppercase tracking-widest group-hover:text-orange-600 transition-colors duration-200">
                                          Explore Route 
                                          <ArrowRight className="w-3 h-3 text-orange-500 group-hover:translate-x-0.5 transition-transform" />
                                      </span>
                                      
                                      <div className="font-mono text-[8px] font-extrabold uppercase text-slate-400">
                                          {cap.techStack.join(" / ")}
                                      </div>
                                  </div>
                                  
                                  <Link href={`/services/${service.slug}`} className="absolute inset-0 z-20" />
                              </div>
                          </motion.div>
                        );
                    })}
                </div>

                {/* ── BOTTOM SPATIAL CTA CARD ── */}
                <div className="mt-20">
                    <div className="p-8 sm:p-12 rounded-2xl bg-white border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 text-left relative overflow-hidden transition-all duration-300 hover:border-orange-500/30">
                        <div className="space-y-1.5 text-left relative z-10">
                            <span className="text-orange-600 font-bold tracking-widest text-[9px] uppercase font-mono">Immediate Scoping Available</span>
                            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Ready to Start?</h2>
                            <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed max-w-md">Our engineering team operates globally to ensure quick scoping, transparent deliverables, and fast launch cycles.</p>
                        </div>
                        
                        <Link href="/contact" className="relative z-10 shrink-0 px-7 py-3.5 bg-slate-950 text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-orange-600 transition-all active:scale-95 flex items-center justify-center gap-1.5">
                            Start Project <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
