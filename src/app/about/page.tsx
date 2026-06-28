"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Target, Users, Zap, Shield, Globe, User, Sparkles, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

interface TeamMember {
    id: string;
    name: string;
    role: string;
    avatar?: string;
    bio?: string;
    linkedIn?: string;
    twitter?: string;
}

export default function AboutPage() {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const response = await api.get("/team");
                setTeam(response.data || []);
            } finally {
                setLoading(false);
            }
        };
        fetchTeam();
    }, []);

    const values = [
        { icon: <Target className="w-5 h-5" />, title: "Precision Engineering", desc: "We write clean, maintainable code with thorough documentation and test coverage." },
        { icon: <Zap className="w-5 h-5" />, title: "Fast Delivery", desc: "Our agile sprints and no-waste processes get your product live faster." },
        { icon: <Shield className="w-5 h-5" />, title: "Security First", desc: "Every system we build is hardened with security best practices from day one." },
        { icon: <Globe className="w-5 h-5" />, title: "Global Standards", desc: "We build to international quality standards serving clients worldwide." },
    ];

    return (
        <main className="min-h-screen">
            {/* Hero */}
            <section className="px-6 pt-24 pb-16 max-w-5xl mx-auto text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <span className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 text-orange-600 text-xs font-bold px-4 py-1.5 rounded-full mb-6">
                        <Sparkles className="w-3.5 h-3.5" /> About JANTRA
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
                        Bangladesh's Leading<br />
                        <span className="text-orange-500">Software Company</span>
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        JANTRA Software is a Dhaka-based custom software development company building SaaS platforms, AI agents, mobile apps, and workflow automation systems for businesses across Bangladesh and worldwide.
                    </p>
                </motion.div>
            </section>

            {/* Mission */}
            <section className="px-6 py-16 max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 mb-4">Our Mission</h2>
                        <p className="text-slate-500 leading-relaxed mb-6">
                            We exist to make world-class software accessible to businesses of all sizes. From startups in Dhaka to enterprises across the globe, we engineer reliable, scalable, and beautifully designed software that drives real results.
                        </p>
                        <Link href="/services" className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-orange-600 transition-all">
                            View Our Services <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {values.map((v, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                                className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm">
                                <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-3">
                                    {v.icon}
                                </div>
                                <h3 className="font-bold text-slate-800 text-sm mb-1">{v.title}</h3>
                                <p className="text-xs text-slate-500 leading-relaxed">{v.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="px-6 py-16 max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-black text-slate-900 mb-3">Meet the Team</h2>
                    <p className="text-slate-500">The engineers and designers behind every product we ship.</p>
                </div>
                {loading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                    </div>
                ) : team.length === 0 ? (
                    <p className="text-center text-slate-400">Team information coming soon.</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {team.map((member, i) => (
                                <motion.div key={member.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                    className="text-center p-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                                        {member.avatar ? (
                                            <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-7 h-7 text-orange-500" />
                                        )}
                                    </div>
                                    <h3 className="font-bold text-slate-800 text-sm">{member.name}</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">{member.role}</p>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </section>

            {/* CTA */}
            <section className="px-6 py-20 max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-black text-slate-900 mb-4">Ready to Build Something Great?</h2>
                <p className="text-slate-500 mb-8">Let's discuss your project and build the software your business needs.</p>
                <Link href="/contact" className="inline-flex items-center gap-2 bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200">
                    Start a Project <ArrowRight className="w-4 h-4" />
                </Link>
            </section>
        </main>
    );
}
