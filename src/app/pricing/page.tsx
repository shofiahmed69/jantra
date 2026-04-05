"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Zap, Shield, Rocket, Sparkles, Globe } from "lucide-react";
import { motion } from "framer-motion";

const TIERS = [
    {
        name: "Initial Ops",
        slug: "starter",
        price: "$5k",
        desc: "Rapid deployment for MVPs.",
        icon: Zap,
        features: ["UI/UX System", "Core API Hub", "Infra Sync"],
        highlighted: false
    },
    {
        name: "Scale Protocol",
        slug: "growth",
        price: "$15k",
        desc: "Advanced AI ecosystem.",
        icon: Rocket,
        features: ["Agentic AI", "Microservices", "Data Ops"],
        highlighted: true
    },
    {
        name: "Command Center",
        slug: "enterprise",
        price: "$35k",
        desc: "Mission-critical architecture.",
        icon: Shield,
        features: ["Custom LLM", "Global Compliance", "Squad"],
        highlighted: false
    }
];

export default function PricingPage() {
    return (
        <main className="relative w-full min-h-screen bg-white pb-32">
            {/* ── BACKGROUND ACCENT [DESKTOP ONLY] ── */}
            <div className="hidden lg:block absolute top-[5%] left-0 w-full overflow-hidden opacity-[0.02] pointer-events-none select-none z-0">
                <div className="flex whitespace-nowrap animate-marquee-slow">
                    <span className="text-[12rem] font-black tracking-tighter leading-none mr-24 uppercase">CAPITAL. EFFICIENCY. INVESTMENT. SCALE.</span>
                </div>
            </div>

            <div className="max-w-[1540px] mx-auto px-4 sm:px-12 pt-24 sm:pt-36 relative z-10">
                
                {/* ── HEADER SECTION ── */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 sm:mb-20">
                    <div className="space-y-4 sm:space-y-6 text-left">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-[2px] bg-orange-500" />
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-orange-600">Investment Archive</span>
                        </div>
                        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-slate-900 leading-[0.85] tracking-tighter uppercase">
                            Capital <br />
                            <span className="text-transparent" style={{ WebkitTextStroke: "1px #0f172a" }}>Efficiency</span>
                            <span className="text-orange-500">.</span>
                        </h1>
                    </div>

                    <div className="hidden lg:flex items-center gap-12">
                        {[
                            { label: "SLA", val: "24/7" },
                            { label: "Build", val: "<4wk" }
                        ].map((stat, i) => (
                            <div key={i} className="space-y-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-3xl font-black text-slate-900 tracking-tighter">{stat.val}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── MAIN CONTENT GRID ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* LEFT SIDEBAR [DESKTOP ONLY] */}
                    <div className="hidden lg:block lg:col-span-3 sticky top-36 h-fit space-y-10">
                        <div className="p-10 rounded-[3rem] bg-orange-50 border border-orange-100/50 space-y-8 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[50px] rounded-full" />
                             <p className="text-[14px] font-black text-slate-900 leading-relaxed uppercase tracking-tight relative z-10">Transparent pricing for elite industrial engineering.</p>
                             <Link href="/contact" className="relative z-10 w-full py-5 rounded-2xl bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-orange-600 transition-all shadow-xl active:scale-95">
                                Start Audit <ArrowRight className="w-4 h-4" />
                             </Link>
                        </div>
                    </div>

                    {/* PRICING GRID - 2 COLUMN ON MOBILE */}
                    <div className="lg:col-span-9">
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
                            {TIERS.map((tier, i) => (
                                <motion.div 
                                    key={tier.slug}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    className={`group relative flex flex-col p-5 sm:p-10 rounded-[1.5rem] sm:rounded-[3.5rem] border transition-all duration-700 h-full ${
                                        tier.highlighted 
                                        ? "bg-slate-950 border-slate-900 text-white shadow-2xl" 
                                        : "bg-slate-50 border-slate-100 hover:bg-white hover:border-slate-200"
                                    }`}
                                >
                                    <div className="absolute inset-x-12 -bottom-10 h-32 bg-orange-500/10 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                    
                                    <div className="relative z-10 flex flex-col h-full space-y-4 sm:space-y-10 text-left">
                                        <div className="flex justify-between items-start">
                                            <div className={`w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-3xl flex items-center justify-center transition-colors ${
                                                tier.highlighted ? "bg-orange-600 text-white" : "bg-white text-orange-500 border border-slate-100"
                                            }`}>
                                                <tier.icon className="w-5 h-5 sm:w-8 sm:h-8" />
                                            </div>
                                        </div>

                                        <div className="space-y-2 sm:space-y-4">
                                            <div className="flex items-baseline gap-1 sm:gap-2">
                                                <span className="text-3xl sm:text-7xl font-black tracking-tighter uppercase leading-none">{tier.price}</span>
                                                <span className={`text-[7px] sm:text-[10px] font-black uppercase tracking-widest ${tier.highlighted ? "text-orange-400" : "text-orange-600"}`}>Start</span>
                                            </div>
                                            <h3 className={`text-[8px] sm:text-[12px] font-black uppercase tracking-widest ${tier.highlighted ? "text-slate-500" : "text-slate-400"}`}>{tier.name}</h3>
                                        </div>

                                        <ul className="space-y-2 sm:space-y-5 flex-grow">
                                            {tier.features.map((feat, fIdx) => (
                                                <li key={fIdx} className="flex items-center gap-2 sm:gap-4">
                                                    <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${tier.highlighted ? "bg-orange-500" : "bg-orange-600"}`} />
                                                    <span className={`text-[7px] sm:text-[10px] font-black uppercase tracking-widest leading-none ${tier.highlighted ? "text-slate-300" : "text-slate-900"}`}>{feat}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <Link href="/contact" className={`w-full py-4 sm:py-7 rounded-xl sm:rounded-[2rem] flex items-center justify-center gap-2 sm:gap-4 transition-all duration-500 active:scale-95 shadow-xl ${
                                            tier.highlighted 
                                            ? "bg-orange-600 text-white hover:bg-white hover:text-slate-950" 
                                            : "bg-slate-950 text-white"
                                        }`}>
                                            <span className="text-[7px] sm:text-[11px] font-black uppercase tracking-widest">Enage Protocol</span>
                                            <ArrowRight className="w-3 h-3 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* FAQ SUB-GRID [COMPACT] */}
                        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-8">
                            {[
                                { q: "Timeline?", a: "MVP in 4-6wks." },
                                { q: "Terms?", a: "30-40-30 phased." }
                            ].map((faq, i) => (
                                <div key={i} className="p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[3rem] bg-slate-50/50 border border-slate-100 border-dashed space-y-2 text-left">
                                     <h4 className="text-[8px] sm:text-[11px] font-black text-slate-950 uppercase tracking-widest flex items-center gap-2">
                                        <Sparkles className="w-3 h-3 text-orange-500" /> {faq.q}
                                     </h4>
                                     <p className="text-[10px] sm:text-[13px] text-slate-500 font-medium leading-tight uppercase tracking-tighter">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
