"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Zap, Shield, Rocket, Sparkles, BarChart3, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function PricingPage() {
    const tiers = [
        {
            name: "Initial Ops",
            slug: "starter",
            price: "$5k",
            desc: "Rapid deployment for high-growth MVPs.",
            icon: Zap,
            features: ["UI/UX Systems", "Frontend Web", "Core API Hub", "SaaS Sync", "Infrastructure"],
            highlighted: false
        },
        {
            name: "Scale Protocol",
            slug: "growth",
            price: "$15k",
            desc: "Advanced ecosystem with AI & global scale.",
            icon: Rocket,
            features: ["Agentic AI", "Multi-platform", "Microservices", "Enterprise Sec", "Data Ops"],
            highlighted: true
        },
        {
            name: "Command Center",
            slug: "enterprise",
            price: "$35k",
            desc: "Mission-critical architectural sovereignty.",
            icon: Shield,
            features: ["Custom LLMs", "H-F Infra", "Global Compliance", "Autonomous Grid", "Dedicated Squad"],
            highlighted: false
        }
    ];

    return (
        <main className="relative w-full min-h-screen bg-white overflow-hidden pb-32">
            <div className="absolute top-[5%] left-0 w-full overflow-hidden opacity-[0.03] pointer-events-none select-none z-0">
                <div className="flex whitespace-nowrap animate-marquee-slow">
                    <span className="text-[12rem] font-black tracking-tighter leading-none mr-24 uppercase">CAPITAL. EFFICIENCY. INVESTMENT. SCALE.</span>
                </div>
            </div>

            <div className="max-w-[1540px] mx-auto px-6 sm:px-12 pt-28 sm:pt-36 relative z-10">
                <div className="grid lg:grid-cols-12 gap-12 items-start mb-12">
                    
                    {/* LEFT SIDEBAR HERO */}
                    <div className="lg:col-span-3 space-y-12 sticky top-36">
                        <div className="flex flex-col gap-6 text-left">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-[2px] bg-orange-500" />
                                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-orange-600">Investment Archive</span>
                            </div>
                            <h1 className="text-5xl sm:text-6xl font-black text-slate-900 leading-[0.85] tracking-tighter uppercase">
                                Capital <br />
                                <span className="text-transparent" style={{ WebkitTextStroke: "1px #0f172a" }}>Efficiency</span>
                                <span className="text-orange-500">.</span>
                            </h1>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed border-l-2 border-slate-100 pl-6">
                                Transparent pricing modules for elite industrial engineering. No hidden variables.
                            </p>
                        </div>

                        {/* ENGAGEMENT STATS */}
                        <div className="space-y-6">
                             <div className="flex items-center gap-3">
                                <Sparkles className="w-3 h-3 text-orange-500" />
                                <span className="text-[10px] font-black uppercase tracking-[.4em] text-slate-400">Core Metrics</span>
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: "Success", val: "99%" },
                                    { label: "SLA", val: "24/7" },
                                    { label: "Build", val: "<4wk" },
                                    { label: "Nodes", val: "1k+" }
                                ].map((stat, i) => (
                                    <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                        <p className="text-lg font-black text-slate-900 tracking-tighter">{stat.val}</p>
                                    </div>
                                ))}
                             </div>
                        </div>

                        <div className="p-8 rounded-[3rem] bg-orange-50 border border-orange-100 space-y-6 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[50px] rounded-full" />
                             <p className="text-[11px] font-bold text-orange-900 leading-relaxed uppercase tracking-tight relative z-10">All projects include architectural sovereignty and full IP ownership.</p>
                             <Link href="/contact" className="relative z-10 w-full py-4 rounded-xl bg-slate-950 text-white text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-orange-600 transition-all shadow-xl active:scale-95">
                                Start Audit <ArrowRight className="w-3 h-3" />
                             </Link>
                        </div>
                    </div>

                    {/* RIGHT CONTENT — PRICING GRID */}
                    <div className="lg:col-span-9">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
                            {tiers.map((tier, i) => (
                                <motion.div 
                                    key={tier.slug}
                                    whileHover={{ y: -6 }}
                                    className={`group relative flex flex-col p-8 rounded-[3.5rem] border transition-all duration-700 ${
                                        tier.highlighted 
                                        ? "bg-slate-950 border-slate-900 text-white shadow-2xl" 
                                        : "bg-slate-50 border-slate-100 hover:bg-white hover:border-slate-200"
                                    }`}
                                >
                                    <div className="absolute inset-x-12 -bottom-10 h-32 bg-orange-500/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                                    <div className="relative z-10 space-y-6 flex flex-col h-full">
                                        <div className="flex justify-between items-start">
                                            <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center transition-colors ${
                                                tier.highlighted ? "bg-orange-600 text-white shadow-xl shadow-orange-500/20" : "bg-white text-orange-500 border border-slate-100 shadow-sm"
                                            }`}>
                                                <tier.icon className="w-6 h-6" />
                                            </div>
                                            {tier.highlighted && (
                                                <span className="text-[9px] font-black uppercase tracking-[0.4em] bg-white/10 px-4 py-2 rounded-full border border-white/10">Priority Cluster</span>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-5xl font-black tracking-tighter uppercase">{tier.price}</span>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${tier.highlighted ? "text-orange-400" : "text-orange-600"}`}>Starting Unit</span>
                                            </div>
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">{tier.name}</h3>
                                        </div>

                                        <div className="pb-8 border-b border-orange-500/10 h-[80px]">
                                            <p className={`text-sm font-medium leading-relaxed ${tier.highlighted ? "text-slate-400" : "text-slate-500"}`}>{tier.desc}</p>
                                        </div>

                                        <ul className="space-y-4 mb-10 flex-grow pt-4">
                                            {tier.features.map((feat, fIdx) => (
                                                <li key={fIdx} className="flex items-center gap-4">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${tier.highlighted ? "bg-orange-500" : "bg-orange-600"}`} />
                                                    <span className={`text-[9px] font-black uppercase tracking-widest ${tier.highlighted ? "text-slate-300" : "text-slate-900"}`}>{feat}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <Link href="/contact" className={`w-full py-6 rounded-[1.5rem] flex items-center justify-center gap-4 group/btn transition-all duration-500 ${
                                            tier.highlighted 
                                            ? "bg-orange-600 text-white hover:bg-white hover:text-slate-950 shadow-xl shadow-orange-500/30" 
                                            : "bg-slate-950 text-white hover:bg-orange-600 shadow-xl shadow-slate-900/10"
                                        }`}>
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Engage Tier</span>
                                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* FAQ SUB-GRID */}
                        <div className="mt-12 grid md:grid-cols-2 gap-6">
                            {[
                                { q: "Payment Terms?", a: "30-40-30 milestone-locked transfers. We prefer cryptographic or traditional wire." },
                                { q: "Project Timeline?", a: "MVP deployments typically transition from audit to production within 4-6 weeks." }
                            ].map((faq, i) => (
                                <div key={i} className="p-8 rounded-[3rem] bg-slate-50/50 border border-slate-100 border-dashed space-y-4 text-left">
                                     <h4 className="text-[10px] font-black text-slate-950 uppercase tracking-[0.3em] flex items-center gap-3">
                                        <Shield className="w-4 h-4 text-orange-500" /> {faq.q}
                                     </h4>
                                     <p className="text-[12px] text-slate-500 font-medium leading-relaxed uppercase tracking-tighter">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
