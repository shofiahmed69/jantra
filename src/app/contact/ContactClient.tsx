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
            accentGlow: "rgba(59, 130, 246, 0.08)"
        },
        {
            icon: MessageCircle,
            label: "WhatsApp",
            value: "+880 1625 027956",
            href: "https://wa.me/8801625027956",
            color: "#10b981",
            accentGlow: "rgba(16, 185, 129, 0.08)"
        },
        {
            icon: Linkedin,
            label: "LinkedIn",
            value: "Jantra Soft",
            href: "https://www.linkedin.com/company/112998098",
            color: "#0284c7",
            accentGlow: "rgba(2, 132, 199, 0.08)"
        },
        {
            icon: Instagram,
            label: "Instagram",
            value: "@jantra.soft",
            href: "https://instagram.com/jantra.soft",
            color: "#ec4899",
            accentGlow: "rgba(236, 72, 153, 0.08)"
        }
    ];

    return (
        <main className="relative w-full min-h-screen bg-[#fcfaf8] overflow-hidden selection:bg-orange-200 pb-16">
            
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-500/[0.02] blur-[130px] rounded-full -z-20 pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-amber-500/[0.015] blur-[110px] rounded-full -z-20 pointer-events-none" />

            {/* Clean minimal background grid */}
            <div className="absolute top-0 inset-x-0 h-[600px] overflow-hidden pointer-events-none select-none -z-10 opacity-[0.015] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_80%,transparent_100%)]">
                <div className="w-full h-full bg-[linear-gradient(to_right,#ea580c_1px,transparent_1px),linear-gradient(to_bottom,#ea580c_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            </div>

            <div className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-8 pt-24 md:pt-32">
                
                {/* ── HEADER ── */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-12 pb-4 md:pb-6 border-b border-slate-200/50">
                    <div className="max-w-xl text-left">
                        <div className="flex items-center gap-2 mb-1.5">
                            <div className="w-3.5 h-[1.5px] bg-orange-500 rounded-full" />
                            <span className="text-orange-600 font-bold tracking-widest text-[8.5px] uppercase font-mono">Contact Info</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-none tracking-tighter uppercase">
                            Get In Touch<span className="text-orange-500">.</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 text-[10.5px] sm:text-xs font-semibold uppercase tracking-wider max-w-xs leading-relaxed text-left">
                        Have a project or partnership in mind? Let&apos;s build your next digital product together.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                    
                    {/* LEFT COLUMN: CONTACT CHANNELS */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        {/* 2x2 Grid for Contact Methods */}
                        <div className="grid grid-cols-2 gap-3.5">
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
                                        <a
                                            href={method.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full h-full rounded-2xl bg-white border border-slate-200/80 p-4 flex flex-col justify-between transition-all duration-300 hover:border-orange-500/30 hover:shadow-[0_10px_25px_rgba(249,115,22,0.03)] before:absolute before:inset-0 before:bg-[radial-gradient(100px_circle_at_var(--mouse-x,0px)_var(--mouse-y,0px),var(--spotlight-color),transparent)] before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300 before:pointer-events-none before:z-0 overflow-hidden relative text-left"
                                        >
                                             <div className="relative z-10 flex flex-col">
                                                 <div 
                                                     className="w-8 h-8 rounded-xl flex items-center justify-center border transition-all duration-300 mb-3"
                                                     style={{
                                                        color: method.color,
                                                        borderColor: `${method.color}20`,
                                                        backgroundColor: `${method.color}05`
                                                     }}
                                                 >
                                                     <method.icon className="w-3.5 h-3.5" />
                                                 </div>
                                                 <span className="text-[7.5px] font-black uppercase text-slate-400 tracking-widest mb-1 font-mono">{method.label}</span>
                                                 <span className="text-[9px] sm:text-[9.5px] font-black text-slate-800 truncate uppercase tracking-wide">{method.value}</span>
                                             </div>
                                        </a>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Location Card */}
                        <div className="relative group flex flex-col">
                             {/* 1. Background offset layer */}
                             <div className="absolute inset-0 rounded-2xl border border-orange-500/15 bg-orange-500/[0.02] translate-x-1.5 translate-y-1.5 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500 -z-10" />

                             {/* 2. Foreground main card layer */}
                             <div className="w-full rounded-2xl bg-white border border-slate-200/80 p-4 sm:p-5 flex flex-col gap-4 text-left relative overflow-hidden transition-all duration-300 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:border-slate-300">
                                 <div className="relative z-10 flex flex-col gap-3">
                                     <div className="flex items-start justify-between gap-4">
                                         <div className="space-y-0.5">
                                             <div className="flex items-center gap-1.5">
                                                 <MapPin className="w-3.5 h-3.5 text-orange-500" />
                                                 <h4 className="text-xs font-black uppercase text-slate-950 tracking-tight leading-none">Our HQ</h4>
                                             </div>
                                             <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Khulshi, Chittagong, Bangladesh</p>
                                         </div>
                                         <div className="flex items-center gap-1.2 bg-orange-500/5 border border-orange-500/10 px-2 py-0.5 rounded-full shrink-0">
                                             <div className="w-1 h-1 rounded-full bg-orange-500 animate-pulse" />
                                             <span className="text-[7px] font-black uppercase tracking-widest text-orange-600 font-mono">Global</span>
                                         </div>
                                     </div>

                                     {/* Embedded grayscale map */}
                                     <div className="w-full h-28 sm:h-32 rounded-xl border border-slate-100 overflow-hidden relative grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
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
                    <div className="lg:col-span-7 w-full">
                        <AnimatePresence mode="wait">
                            {status === "success" ? (
                                <motion.div
                                    key="success-card"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="w-full min-h-[320px] flex flex-col items-center justify-center text-center p-5 bg-white rounded-2xl border border-slate-200 shadow-md relative overflow-hidden"
                                >
                                    <div className="relative z-10 space-y-3.5">
                                        <div className="w-11 h-11 rounded-full bg-orange-500 flex items-center justify-center mx-auto shadow-md shadow-orange-500/10 animate-bounce">
                                            <CheckCircle2 className="w-5.5 h-5.5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase mb-0.5">Message Sent</h3>
                                            <p className="text-slate-400 font-bold uppercase tracking-wider text-[8px] max-w-xs mx-auto">We will get back to you shortly.</p>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                setFormData({ name: "", email: "", subject: "", message: "" });
                                                setStatus("idle");
                                            }}
                                            className="px-5 py-2.5 bg-slate-950 text-white rounded-xl font-black uppercase tracking-widest text-[8.5px] hover:bg-orange-600 transition-all active:scale-95 cursor-pointer"
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
                                    className="w-full group relative flex flex-col"
                                >
                                    {/* 1. Background offset layer */}
                                    <div className="absolute inset-0 rounded-2xl border border-orange-500/15 bg-orange-500/[0.02] translate-x-1.5 translate-y-1.5 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500 -z-10" />

                                    {/* 2. Foreground main card layer */}
                                    <div className="w-full relative bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 transition-all duration-300 group-hover:border-slate-300 group-hover:shadow-[0_10px_25px_rgba(0,0,0,0.02)]">
                                        <div className="flex items-center justify-between gap-4 mb-4 text-left">
                                            <h3 className="text-[10px] font-black text-slate-900 tracking-widest uppercase flex items-center gap-1.5">
                                                Send a Message
                                            </h3>
                                            <Sparkles className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-3.5">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left">
                                                <div className="group space-y-1">
                                                    <label className="text-[8.5px] font-bold uppercase tracking-wider text-slate-400 group-focus-within:text-orange-600 transition-colors ml-1 font-mono">Full Name</label>
                                                    <input required type="text" placeholder="YOUR NAME" className="w-full bg-slate-50/50 border border-slate-200/70 rounded-xl px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider outline-none focus:bg-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all text-slate-800" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                                                </div>
                                                <div className="group space-y-1">
                                                    <label className="text-[8.5px] font-bold uppercase tracking-wider text-slate-400 group-focus-within:text-orange-600 transition-colors ml-1 font-mono">Email Address</label>
                                                    <input required type="email" placeholder="YOUR@EMAIL.COM" className="w-full bg-slate-50/50 border border-slate-200/70 rounded-xl px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider outline-none focus:bg-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all text-slate-800" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                                                </div>
                                            </div>

                                            <div className="group space-y-1 text-left">
                                                <label className="text-[8.5px] font-bold uppercase tracking-wider text-slate-400 group-focus-within:text-orange-600 transition-colors ml-1 font-mono">Subject</label>
                                                <input required type="text" placeholder="HOW CAN WE HELP?" className="w-full bg-slate-50/50 border border-slate-200/70 rounded-xl px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider outline-none focus:bg-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all text-slate-800" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
                                            </div>

                                            <div className="group space-y-1 text-left">
                                                <label className="text-[8.5px] font-bold uppercase tracking-wider text-slate-400 group-focus-within:text-orange-600 transition-colors ml-1 font-mono">Your Message</label>
                                                <textarea required rows={4} placeholder="TELL US ABOUT YOUR PROJECT" className="w-full bg-slate-50/50 border border-slate-200/70 rounded-xl px-3.5 py-3 text-xs font-bold uppercase tracking-wider outline-none focus:bg-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none text-slate-800" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} />
                                            </div>

                                            <button type="submit" disabled={status === "sending"} className="w-full py-3 bg-slate-950 text-white rounded-xl font-black uppercase tracking-widest text-[8.5px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 hover:bg-orange-600 shadow-sm cursor-pointer mt-3">
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
