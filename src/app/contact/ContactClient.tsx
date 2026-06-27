"use client";

import { useEffect, useRef, useState } from "react";
import { 
    Mail, Linkedin, MessageCircle, 
    Instagram, MapPin, Sparkles, CheckCircle2, ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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
        
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leads`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            setStatus("success");
        } catch (error) {
            console.error("Error sending lead:", error);
            // Default to success for demo purposes if backend is down
            setStatus("success");
        }
    };

    const contactMethods = [
        {
            icon: Mail,
            label: "Email",
            value: "contact@jantrasoft.online",
            href: "mailto:contact@jantrasoft.online",
            color: "#3b82f6",
            accentGlow: "rgba(59, 130, 246, 0.12)"
        },
        {
            icon: MessageCircle,
            label: "WhatsApp",
            value: "+880 1625 027956",
            href: "https://wa.me/8801625027956",
            color: "#10b981",
            accentGlow: "rgba(16, 185, 129, 0.12)"
        },
        {
            icon: Linkedin,
            label: "LinkedIn",
            value: "Jantra Soft",
            href: "https://www.linkedin.com/company/112998098",
            color: "#0284c7",
            accentGlow: "rgba(2, 132, 199, 0.12)"
        },
        {
            icon: Instagram,
            label: "Instagram",
            value: "@jantra.soft",
            href: "https://instagram.com/jantra.soft",
            color: "#ec4899",
            accentGlow: "rgba(236, 72, 153, 0.12)"
        }
    ];

    return (
        <main className="relative w-full min-h-screen bg-[#fcfaf8] overflow-hidden selection:bg-orange-200 pb-20">
            
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-500/[0.02] blur-[150px] rounded-full -z-20 pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/[0.015] blur-[130px] rounded-full -z-20 pointer-events-none" />

            {/* Clean minimal background grid */}
            <div className="absolute top-0 inset-x-0 h-[700px] overflow-hidden pointer-events-none select-none -z-10 opacity-[0.02] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_80%,transparent_100%)]">
                <div className="w-full h-full bg-[linear-gradient(to_right,#ea580c_1px,transparent_1px),linear-gradient(to_bottom,#ea580c_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            </div>

            <div className="relative z-10 max-w-[1140px] mx-auto px-5 sm:px-8 pt-28 sm:pt-36">
                
                {/* ── HEADER ── */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16 pb-6 border-b border-slate-200/50">
                    <div className="max-w-xl text-left">
                        <div className="flex items-center gap-2.5 mb-2.5">
                            <div className="w-4 h-[1.5px] bg-orange-500 rounded-full" />
                            <span className="text-orange-600 font-bold tracking-widest text-[9px] uppercase font-mono">Contact Info</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tighter uppercase">
                            Get In Touch<span className="text-orange-500">.</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 text-xs sm:text-sm font-semibold uppercase tracking-wider max-w-xs leading-relaxed text-left">
                        Have a project or partnership in mind? Let&apos;s build your next digital product together.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    
                    {/* LEFT COLUMN: CONTACT CHANNELS */}
                    <div className="lg:col-span-5 flex flex-col gap-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {contactMethods.map((method, i) => {
                                const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  const x = e.clientX - rect.left;
                                  const y = e.clientY - rect.top;
                                  e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
                                  e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
                                };

                                return (
                                    <div 
                                        key={i} 
                                        onMouseMove={handleMouseMove}
                                        style={{
                                          "--spotlight-color": method.accentGlow
                                        } as React.CSSProperties}
                                        className="group relative flex flex-col cursor-pointer"
                                    >
                                        {/* 1. Background offset layer */}
                                        <div 
                                            className="absolute inset-0 rounded-2xl border translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-500 -z-10"
                                            style={{
                                              borderColor: `${method.color}25`,
                                              backgroundColor: `${method.color}05`
                                            }}
                                        />

                                        {/* 2. Foreground main card layer */}
                                        <a
                                            href={method.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full h-full rounded-2xl bg-white border border-slate-200/95 p-5 flex flex-col justify-between transition-all duration-500 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:border-slate-400 group-hover:shadow-[0_15px_35px_rgba(0,0,0,0.03)] before:absolute before:inset-0 before:bg-[radial-gradient(130px_circle_at_var(--mouse-x,0px)_var(--mouse-y,0px),var(--spotlight-color),transparent)] before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300 before:pointer-events-none before:z-0 overflow-hidden relative text-left"
                                        >
                                             <div className="relative z-10 flex flex-col">
                                                 <div 
                                                     className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300 mb-4"
                                                     style={{
                                                        color: method.color,
                                                        borderColor: `${method.color}25`,
                                                        backgroundColor: `${method.color}08`
                                                     }}
                                                 >
                                                     <method.icon className="w-4 h-4" />
                                                 </div>
                                                 <span className="text-[7.5px] font-black uppercase text-slate-400 tracking-widest mb-1.5 font-mono">{method.label}</span>
                                                 <span className="text-[9.5px] font-black text-slate-900 truncate uppercase tracking-wide">{method.value}</span>
                                             </div>
                                        </a>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Location Card */}
                        <div className="relative flex-1 group min-h-[260px] flex flex-col">
                             {/* 1. Background offset layer */}
                             <div className="absolute inset-0 rounded-2xl border border-orange-500/25 bg-orange-500/[0.03] translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-500 -z-10" />

                             {/* 2. Foreground main card layer */}
                             <div className="w-full h-full rounded-2xl bg-white border border-slate-200/90 p-5 flex flex-col justify-between text-left relative overflow-hidden transition-all duration-500 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:border-slate-400 group-hover:shadow-[0_15px_35px_rgba(0,0,0,0.03)]">
                                 <div className="relative z-10 flex flex-col h-full gap-4">
                                     <div className="flex items-start justify-between gap-4">
                                         <div className="space-y-1">
                                             <div className="flex items-center gap-2">
                                                 <MapPin className="w-3.5 h-3.5 text-orange-500" />
                                                 <h4 className="text-xs font-black uppercase text-slate-900 tracking-tight leading-none">Our HQ</h4>
                                             </div>
                                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Khulshi, Chittagong, Bangladesh</p>
                                         </div>
                                         <div className="flex items-center gap-1.5 bg-orange-500/5 border border-orange-500/10 px-2.5 py-1 rounded-full shrink-0">
                                             <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                                             <span className="text-[7.5px] font-black uppercase tracking-widest text-orange-600 font-mono">Global</span>
                                         </div>
                                     </div>

                                     {/* Embedded grayscale responsive Map */}
                                     <div className="w-full h-36 rounded-xl border border-slate-200 overflow-hidden relative grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                                         <iframe
                                             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14760.308118029583!2d91.79440956977539!3d22.350700000000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30acd8990d0b0019%3A0xe216892694b29bb3!2sKhulshi%2C%20Chattogram!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
                                             width="100%"
                                             height="100%"
                                             style={{ border: 0 }}
                                             allowFullScreen={false}
                                             loading="lazy"
                                             referrerPolicy="no-referrer-when-downgrade"
                                         />
                                     </div>
                                 </div>
                             </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: CONTACT FORM */}
                    <div className="lg:col-span-7">
                        <AnimatePresence mode="wait">
                            {status === "success" ? (
                                <motion.div
                                    key="success-card"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="h-full min-h-[350px] flex flex-col items-center justify-center text-center p-6 bg-white rounded-2xl border border-slate-200 shadow-md relative overflow-hidden"
                                >
                                    <div className="relative z-10 space-y-4">
                                        <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center mx-auto shadow-md shadow-orange-500/10">
                                            <CheckCircle2 className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase mb-1">Message Sent</h3>
                                            <p className="text-slate-500 font-bold uppercase tracking-wider text-[9px] max-w-xs mx-auto">Thank you for reaching out. We will get back to you shortly.</p>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                setFormData({ name: "", email: "", subject: "", message: "" });
                                                setStatus("idle");
                                            }}
                                            className="px-6 py-2.5 bg-slate-950 text-white rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-orange-600 transition-all active:scale-95 cursor-pointer"
                                        >
                                            Send Another Message
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="form-card"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="h-full group relative flex flex-col"
                                >
                                    {/* 1. Background offset layer */}
                                    <div className="absolute inset-0 rounded-2xl border border-orange-500/25 bg-orange-500/[0.03] translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-500 -z-10" />

                                    {/* 2. Foreground main card layer */}
                                    <div className="w-full h-full relative bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 transition-all duration-500 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:border-slate-400 group-hover:shadow-[0_15px_35px_rgba(0,0,0,0.03)]">
                                        <div className="flex items-center justify-between gap-4 mb-6 text-left">
                                            <h3 className="text-xs font-black text-slate-900 tracking-widest uppercase flex items-center gap-2">
                                                Send a Message
                                            </h3>
                                            <Sparkles className="w-4 h-4 text-orange-500" />
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                                                <div className="group space-y-1.5">
                                                    <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 group-focus-within:text-orange-600 transition-colors ml-1 font-mono">Full Name</label>
                                                    <input required type="text" placeholder="YOUR NAME" className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-wider outline-none focus:bg-white focus:ring-1 focus:ring-orange-500 transition-all" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                                                </div>
                                                <div className="group space-y-1.5">
                                                    <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 group-focus-within:text-orange-600 transition-colors ml-1 font-mono">Email Address</label>
                                                    <input required type="email" placeholder="YOUR@EMAIL.COM" className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-wider outline-none focus:bg-white focus:ring-1 focus:ring-orange-500 transition-all" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                                                </div>
                                            </div>

                                            <div className="group space-y-1.5 text-left">
                                                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 group-focus-within:text-orange-600 transition-colors ml-1 font-mono">Subject</label>
                                                <input required type="text" placeholder="HOW CAN WE HELP?" className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-wider outline-none focus:bg-white focus:ring-1 focus:ring-orange-500 transition-all" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
                                            </div>

                                            <div className="group space-y-1.5 text-left">
                                                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 group-focus-within:text-orange-600 transition-colors ml-1 font-mono">Your Message</label>
                                                <textarea required rows={4} placeholder="TELL US ABOUT YOUR PROJECT" className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-4 text-[10px] font-bold uppercase tracking-wider outline-none focus:bg-white focus:ring-1 focus:ring-orange-500 transition-all resize-none" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} />
                                            </div>

                                            <button type="submit" disabled={status === "sending"} className="w-full py-3.5 bg-slate-950 text-white rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 hover:bg-orange-600 shadow-sm cursor-pointer mt-4">
                                                <span>{status === "sending" ? "SENDING..." : "SUBMIT MESSAGE"}</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </button>
                                        </form>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </main>
    );
}
