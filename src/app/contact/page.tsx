"use client";

import { useState } from "react";
import { 
    Mail, Linkedin, Facebook, Phone, 
    ArrowRight, MessageCircle, 
    Instagram, MapPin
} from "lucide-react";
import { motion } from "framer-motion";
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
        }
    ];

    return (
        <main className="w-full min-h-screen bg-white pb-32">
            
            <div className="max-w-[1280px] mx-auto px-6 sm:px-12 pt-28 sm:pt-40">
                
                {/* ── HEADER ── */}
                <div className="max-w-2xl mb-20 sm:mb-32 text-left">
                    <span className="text-orange-600 font-bold tracking-widest text-xs uppercase mb-6 block">Initialize Protocol</span>
                    <h1 className="text-5xl sm:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter uppercase mb-8">
                        Start <br /> Building <span className="text-orange-500">.</span>
                    </h1>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed uppercase tracking-tight max-w-lg">Transparent communication for elite industrial engineering.</p>
                </div>

                {/* ── CLEAN CONTACT GRID: 2-COL ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 sm:gap-24 items-start">
                    
                    {/* LEFT: INFO */}
                    <div className="lg:col-span-5 space-y-12">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {contactMethods.map((method, i) => (
                                <motion.a
                                    key={i}
                                    href={method.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group p-10 rounded-[3rem] bg-slate-50 border border-slate-100 hover:bg-white hover:border-slate-300 hover:shadow-2xl transition-all duration-700"
                                >
                                     <div className="w-16 h-16 rounded-[1.5rem] bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-orange-500 transition-all duration-700 mb-8">
                                         <method.icon className="w-6 h-6" />
                                     </div>
                                     <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">{method.label}</h4>
                                     <p className="text-lg font-black text-slate-950 uppercase tracking-tighter leading-tight group-hover:text-orange-600 transition-colors line-clamp-1">{method.value}</p>
                                </motion.a>
                            ))}
                        </div>

                        <div className="p-12 rounded-[4rem] bg-slate-950 text-white flex flex-col items-center text-center gap-6 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/20 blur-[60px] rounded-full" />
                             <MapPin className="w-8 h-8 text-orange-500" />
                             <div className="space-y-2">
                                 <h4 className="text-2xl font-black tracking-tight uppercase">Base Operations</h4>
                                 <p className="text-slate-400 text-xs font-black uppercase tracking-widest leading-relaxed">Dhaka Command Center, BD</p>
                             </div>
                        </div>
                    </div>

                    {/* RIGHT: FORM */}
                    <div className="lg:col-span-7">
                        <motion.form 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onSubmit={handleSubmit} 
                            className="bg-white rounded-[3rem] sm:rounded-[4rem] border border-slate-100 p-8 sm:p-20 space-y-12 relative overflow-hidden shadow-2xl"
                        >
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/5 blur-[120px] rounded-full" />
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Identity</label>
                                    <input required type="text" placeholder="FULL NAME" className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-8 py-6 text-[11px] font-black uppercase tracking-widest outline-none focus:bg-white focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-slate-200" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Coordinate</label>
                                    <input required type="email" placeholder="YOUR@EMAIL.COM" className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-8 py-6 text-[11px] font-black uppercase tracking-widest outline-none focus:bg-white focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-slate-200" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Objective</label>
                                <input required type="text" placeholder="DISCOURSE SUBJECT" className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-8 py-6 text-[11px] font-black uppercase tracking-widest outline-none focus:bg-white focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-slate-200" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Archives</label>
                                <textarea required rows={5} placeholder="DETAILED SPECS..." className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] px-8 py-8 text-[11px] font-black uppercase tracking-widest outline-none focus:bg-white focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-slate-200" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} />
                            </div>
                            <button type="submit" disabled={status === "sending"} className="w-full py-8 bg-slate-950 text-white rounded-[2rem] font-black uppercase tracking-[0.4em] text-[12px] flex items-center justify-center gap-6 shadow-2xl hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50">
                                {status === "sending" ? "TRANSMITTING..." : "INITIALIZE PROTOCOL"}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </button>
                        </motion.form>
                    </div>
                </div>
            </div>
        </main>
    );
}
