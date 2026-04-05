"use client";

import { useState } from "react";
import { 
    Mail, Linkedin, Facebook, Phone, 
    MessageSquare, CheckCircle2, ArrowRight,
    Send, Sparkles, MessageCircle, ExternalLink,
    MapPin, Globe, Instagram
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");
        
        // Simulating API call
        setTimeout(() => {
            setStatus("success");
            setFormData({ name: "", email: "", subject: "", message: "" });
        }, 2000);

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/leads`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        }).catch(() => {});
    };

    const contactMethods = [
        {
            icon: Mail,
            label: "Email us",
            value: "jantrasoftinfo@gmail.com",
            href: "mailto:jantrasoftinfo@gmail.com",
            color: "bg-blue-50 text-blue-600"
        },
        {
            icon: MessageCircle,
            label: "WhatsApp",
            value: "+880 1700 000000",
            href: "https://wa.me/8801700000000",
            color: "bg-emerald-50 text-emerald-600"
        },
        {
            icon: Linkedin,
            label: "LinkedIn",
            value: "Jantra Soft",
            href: "https://linkedin.com/company/jantro-soft",
            color: "bg-indigo-50 text-indigo-600"
        },
        {
            icon: Facebook,
            label: "Facebook",
            value: "Jantra Soft",
            href: "https://www.facebook.com/profile.php?id=61578641909784",
            color: "bg-sky-50 text-sky-600"
        },
        {
            icon: Phone,
            label: "Call us",
            value: "+880 1700 000000",
            href: "tel:+8801700000000",
            color: "bg-orange-50 text-orange-600"
        },
        {
            icon: Instagram,
            label: "Instagram",
            value: "@jantra.soft",
            href: "https://instagram.com/jantra.soft",
            color: "bg-rose-50 text-rose-600"
        }
    ];

    return (
        <main className="relative w-full min-h-screen bg-white selection:bg-orange-500 selection:text-white pb-20">
            {/* ── AMBIENT GLASS BACKGROUND ── */}
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-slate-50 to-transparent -z-10" />
            <div className="absolute top-40 right-[10%] w-96 h-96 bg-orange-500/5 blur-[120px] rounded-full -z-10" />
            
            <div className="max-w-[1280px] mx-auto px-6 sm:px-12 pt-16 sm:pt-24 relative z-10">
                
                {/* ── HEADER SECTION ── */}
                <div className="text-center max-w-[800px] mx-auto mb-12 sm:mb-16">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 mb-6"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-orange-600">Available for projects</span>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl sm:text-6xl font-black text-slate-900 leading-[0.9] tracking-tighter uppercase mb-6"
                    >
                        Say <span className="text-orange-500">Hello</span><span className="text-slate-200">.</span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-[13px] sm:text-[15px] text-slate-500 font-bold uppercase tracking-widest max-w-lg mx-auto opacity-70"
                    >
                        Let's bring your creative vision to life.
                    </motion.p>
                </div>

                <div className="flex flex-col gap-8 sm:gap-12">
                    
                    {/* ── CONTACT METHODS GRID (FIRST & COMPACT) ── */}
                    <div className="w-full">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                            {contactMethods.map((method, i) => (
                                <motion.a
                                    key={method.label}
                                    href={method.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group relative p-4 rounded-2xl bg-slate-50/50 border border-slate-100 flex flex-col items-center justify-center text-center transition-all duration-500 hover:bg-white hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/40"
                                >
                                    <div className={`w-10 h-10 rounded-xl ${method.color} flex items-center justify-center mb-3 transition-all duration-700 group-hover:scale-110 group-hover:rotate-12`}>
                                        <method.icon className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <h3 className="text-[7.5px] font-black uppercase tracking-widest text-slate-400 group-hover:text-orange-500 transition-colors">{method.label}</h3>
                                        <p className="text-[10px] font-black text-slate-900 tracking-tight truncate max-w-[100px]">{method.value.split('@')[0].split('.')[0]}</p>
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* ── CONTACT FORM ── */}
                    <div className="w-full max-w-4xl mx-auto">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="p-6 sm:p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]"
                        >
                            <AnimatePresence mode="wait">
                                {status === "success" ? (
                                    <motion.div 
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="py-12 text-center flex flex-col items-center justify-center"
                                    >
                                        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                                            <CheckCircle2 className="w-8 h-8" />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-4">Message Sent!</h2>
                                        <p className="text-slate-500 font-bold text-[11px] uppercase tracking-widest mb-8">We'll get back to you shortly.</p>
                                        <button 
                                            onClick={() => setStatus("idle")}
                                            className="px-10 py-4 bg-slate-950 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-orange-600 transition-all active:scale-95 flex items-center gap-3"
                                        >
                                            Reset <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                                            <div className="space-y-1.5">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Name</label>
                                                <input 
                                                    required
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                    placeholder="Full name"
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 text-slate-900 font-bold uppercase text-[11px] outline-none focus:border-orange-500 focus:bg-white transition-all placeholder:text-slate-300"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Email</label>
                                                <input 
                                                    required
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                    placeholder="Email address"
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 text-slate-900 font-bold uppercase text-[11px] outline-none focus:border-orange-500 focus:bg-white transition-all placeholder:text-slate-300"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">How can we help?</label>
                                            <textarea 
                                                required
                                                rows={4}
                                                value={formData.message}
                                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                                                placeholder="Tell us about your goals..."
                                                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 text-slate-900 font-bold uppercase text-[11px] outline-none focus:border-orange-500 focus:bg-white transition-all resize-none placeholder:text-slate-300 min-h-[120px]"
                                            />
                                        </div>

                                        <div className="pt-2">
                                            <button 
                                                disabled={status === "sending"}
                                                type="submit" 
                                                className="w-full py-4 bg-orange-600 text-white rounded-xl font-black uppercase tracking-[0.4em] text-[11px] hover:bg-slate-950 transition-all shadow-xl shadow-orange-500/10 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4 group"
                                            >
                                                {status === "sending" ? "Sending..." : "Send Message"}
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                </div>
            </div>
        </main>
    );
}
