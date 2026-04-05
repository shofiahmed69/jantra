"use client";

import { useState } from "react";
import { 
    Mail, Linkedin, Facebook, Phone, 
    ArrowRight, Sparkles, MessageCircle, 
    Instagram, MapPin
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
        
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/leads`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        })
        .then(() => {
            setStatus("success");
            setFormData({ name: "", email: "", subject: "", message: "" });
        })
        .catch(() => {
             setStatus("idle");
        });
    };

    const contactMethods = [
        {
            icon: Mail,
            label: "Email",
            value: "info@jantrasoft.com",
            href: "mailto:jantrasoftinfo@gmail.com",
        },
        {
            icon: MessageCircle,
            label: "WhatsApp",
            value: "+880 1625 027956",
            href: "https://wa.me/8801625027956",
        },
        {
            icon: Linkedin,
            label: "LinkedIn",
            value: "Jantra Soft",
            href: "https://www.linkedin.com/company/112998098",
        },
        {
            icon: Instagram,
            label: "Instagram",
            value: "@jantra.soft",
            href: "https://instagram.com/jantra.soft",
        },
        {
            icon: Facebook,
            label: "Facebook",
            value: "Jantra Soft",
            href: "https://www.facebook.com/profile.php?id=61578641909784",
        },
        {
            icon: Phone,
            label: "Call",
            value: "+880 1625 027956",
            href: "tel:+8801625027956",
        }
    ];

    return (
        <main className="relative w-full min-h-screen bg-white pb-32">
            {/* ── BACKGROUND ACCENT [DESKTOP ONLY] ── */}
            <div className="hidden lg:block absolute top-[5%] left-0 w-full overflow-hidden opacity-[0.02] pointer-events-none select-none z-0">
                <div className="flex whitespace-nowrap animate-marquee-slow">
                    <span className="text-[12rem] font-black tracking-tighter leading-none mr-24 uppercase">CONNECTION. DISCOVERY. PARTNERSHIP. SCALE.</span>
                </div>
            </div>

            <div className="max-w-[1540px] mx-auto px-4 sm:px-12 pt-24 sm:pt-36 relative z-10">
                
                {/* ── HEADER SECTION ── */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 sm:mb-20">
                    <div className="space-y-4 sm:space-y-6 text-left">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-[2px] bg-orange-500" />
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-orange-600">Initialize Protocol</span>
                        </div>
                        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-slate-900 leading-[0.85] tracking-tighter uppercase">
                            Start <br />
                            <span className="text-transparent" style={{ WebkitTextStroke: "1px #0f172a" }}>Building</span>
                            <span className="text-orange-500">.</span>
                        </h1>
                    </div>

                    <div className="hidden lg:flex items-center gap-12">
                         <div className="space-y-1">
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Base Operations</p>
                             <p className="text-xl font-black text-slate-900 tracking-tighter flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-orange-500" /> Dhaka, BD
                             </p>
                         </div>
                    </div>
                </div>

                {/* ── MAIN CONTENT GRID ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* LEFT SIDEBAR: CONTACT METHODS GRID - 2 COLUMN ON ALL SCREENS */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="grid grid-cols-2 gap-3 sm:gap-6">
                            {contactMethods.map((method, i) => (
                                <motion.a
                                    key={i}
                                    href={method.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group relative flex flex-col p-6 sm:p-10 rounded-[1.5rem] sm:rounded-[3rem] bg-slate-50 border border-slate-100 transition-all duration-700 hover:bg-white hover:shadow-2xl h-full"
                                >
                                     <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-3xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-orange-500 transition-all duration-700 mb-6">
                                         <method.icon className="w-5 h-5 sm:w-8 sm:h-8" />
                                     </div>
                                     <div className="space-y-1">
                                         <span className="text-[8px] sm:text-[10px] font-black uppercase text-slate-300 tracking-widest leading-none">{method.label}</span>
                                         <p className="text-xs sm:text-lg font-black text-slate-950 uppercase tracking-tight leading-tight group-hover:text-orange-600 transition-colors line-clamp-1">{method.value}</p>
                                     </div>
                                </motion.a>
                            ))}
                        </div>

                        <div className="p-10 rounded-[3rem] bg-slate-950 text-white relative overflow-hidden hidden lg:block">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/20 blur-[60px] rounded-full" />
                             <h4 className="text-xl font-black tracking-tighter uppercase relative z-10">Global Scale.</h4>
                             <p className="text-slate-400 text-sm mt-4 font-medium relative z-10 leading-relaxed uppercase tracking-tight">Our squad operates across time zones to ensure elite project delivery speed.</p>
                        </div>
                    </div>

                    {/* RIGHT FORM: EDITORIAL DISCOURSE */}
                    <div className="lg:col-span-7">
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-[2rem] sm:rounded-[4rem] border border-slate-100 p-8 sm:p-16 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/5 blur-[120px] rounded-full" />
                            
                            {status === "success" ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center py-20 text-center space-y-6"
                                >
                                    <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center">
                                        <Sparkles className="w-10 h-10 text-orange-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-3xl font-black text-slate-950 uppercase tracking-tighter">Transmission Successful</h2>
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Your protocol has been logged. Our squad will intersect shortly.</p>
                                    </div>
                                    <button 
                                        onClick={() => setStatus("idle")}
                                        className="px-10 py-4 bg-slate-950 text-white rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-orange-600 transition-all active:scale-95"
                                    >
                                        Send Another
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-12 relative z-10">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Full Identity</label>
                                            <input 
                                                required
                                                type="text" 
                                                placeholder="NAME / CORPORATE ENTITY"
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-[11px] font-black uppercase tracking-widest focus:bg-white focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder:text-slate-200"
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Digital Coordinate</label>
                                            <input 
                                                required
                                                type="email" 
                                                placeholder="EMAIL@SATELLITE.NET"
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-[11px] font-black uppercase tracking-widest focus:bg-white focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder:text-slate-200"
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Subject Vector</label>
                                        <input 
                                            required
                                            type="text" 
                                            placeholder="NATURE OF DISCOURSE"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-[11px] font-black uppercase tracking-widest focus:bg-white focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder:text-slate-200"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Archive Content</label>
                                        <textarea 
                                            required
                                            rows={6} 
                                            placeholder="DETAILED SPECS / ARCHITECTURE REQS..."
                                            className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-6 py-6 text-[11px] font-black uppercase tracking-widest focus:bg-white focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder:text-slate-200 resize-none"
                                            value={formData.message}
                                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                                        />
                                    </div>
                                    <button 
                                        type="submit"
                                        disabled={status === "sending"}
                                        className="w-full py-6 sm:py-8 bg-slate-950 text-white rounded-[1.5rem] sm:rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-[10px] sm:text-[13px] flex items-center justify-center gap-6 group hover:bg-orange-600 transition-all shadow-2xl active:scale-95 disabled:opacity-50"
                                    >
                                        {status === "sending" ? "TRANSMITTING..." : "INITIALIZE PROTOCOL"}
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </main>
    );
}
