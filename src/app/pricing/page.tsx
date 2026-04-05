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

export default function PricingPage() {
    return (
        <main className="w-full min-h-screen bg-white pb-32">
            
            <div className="max-w-[1280px] mx-auto px-6 sm:px-12 pt-28 sm:pt-40">
                
                {/* ── HEADER ── */}
                <div className="max-w-2xl mb-20 sm:mb-32 text-left">
                    <span className="text-orange-600 font-bold tracking-widest text-xs uppercase mb-6 block">Investment Archive</span>
                    <h1 className="text-5xl sm:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter uppercase mb-8">
                        Capital <br /> Efficiency <span className="text-orange-500">.</span>
                    </h1>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed uppercase tracking-tight max-w-lg">Transparent pricing modules for elite industrial engineering.</p>
                </div>

                {/* ── CLEAN PRICING GRID: 1-COL MOBILE, 3-COL DESKTOP ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
                    {TIERS.map((tier, i) => (
                        <motion.div 
                            key={tier.slug}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className={`group relative p-8 sm:p-12 rounded-[3rem] border flex flex-col transition-all duration-700 h-full ${
                                tier.highlighted ? "bg-slate-950 border-slate-900 text-white shadow-2xl scale-105" : "bg-white border-slate-100 text-slate-950 hover:bg-slate-50 hover:border-slate-300"
                            }`}
                        >
                            <div className="mb-10 space-y-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${tier.highlighted ? "bg-orange-600 text-white" : "bg-orange-50 text-orange-600"}`}>
                                    <tier.icon className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-black tracking-tight">{tier.price}</span>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${tier.highlighted ? "text-orange-400" : "text-orange-600"}`}>Starting Unit</span>
                                    </div>
                                    <h3 className={`text-[10px] font-black uppercase tracking-widest ${tier.highlighted ? "text-slate-500" : "text-slate-400"}`}>{tier.name}</h3>
                                </div>
                                <p className={`text-sm font-medium leading-relaxed ${tier.highlighted ? "text-slate-400" : "text-slate-500"}`}>{tier.desc}</p>
                            </div>

                            <ul className="space-y-4 mb-12 flex-grow">
                                {tier.features.map((feat, f) => (
                                    <li key={f} className="flex items-center gap-4">
                                        <div className={`w-1.5 h-1.5 rounded-full ${tier.highlighted ? "bg-orange-500" : "bg-orange-600"}`} />
                                        <span className={`text-[9px] font-black uppercase tracking-widest leading-none ${tier.highlighted ? "text-slate-300" : "text-slate-950"}`}>{feat}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link href="/contact" className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 transition-all ${
                                tier.highlighted ? "bg-orange-600 text-white hover:bg-white hover:text-slate-950 shadow-xl shadow-orange-500/20" : "bg-slate-950 text-white hover:bg-orange-600"
                            }`}>
                                Engage Tier <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* ── FAQ BOX ── */}
                <div className="mt-24 grid sm:grid-cols-2 gap-8">
                     {[
                        { q: "Timeline?", a: "MVP in 4-6wks." },
                        { q: "Ownership?", a: "Full IP Transfer." }
                     ].map((item, i) => (
                        <div key={i} className="p-10 rounded-[3rem] bg-slate-50 border border-slate-100 flex items-start gap-8">
                            <Sparkles className="w-6 h-6 text-orange-500 shrink-0" />
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-950">{item.q}</h4>
                                <p className="text-sm font-medium text-slate-500 lowercase first-letter:uppercase">{item.a}</p>
                            </div>
                        </div>
                     ))}
                </div>
            </div>
        </main>
    );
}
