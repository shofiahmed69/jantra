"use client";

import { useState, useEffect } from "react";
import { 
    Mail, Linkedin, Facebook, Phone, 
    ArrowRight, MessageCircle, 
    Instagram, MapPin, Sparkles, Send, CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassFilter, GlassEffect } from "@/components/ui/liquid-glass";
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
        
        // Instant success feedback
        setStatus("success");
        
        // Background API call
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/leads`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        })
        .catch(err => console.error("Contact sync error:", err));
    };

    const contactMethods = [
        {
            icon: Mail,
            label: "Email",
            value: "contact@jantrasoft.online",
            href: "mailto:contact@jantrasoft.online",
            color: "from-blue-500/20 to-indigo-500/10"
        },
        {
            icon: MessageCircle,
            label: "WhatsApp",
            value: "+880 1625 027956",
            href: "https://wa.me/8801625027956",
            color: "from-emerald-500/20 to-teal-500/10"
        },
        {
            icon: Linkedin,
            label: "LinkedIn",
            value: "Jantra Soft",
            href: "https://www.linkedin.com/company/112998098",
            color: "from-sky-500/20 to-blue-500/10"
        },
        {
            icon: Instagram,
            label: "Instagram",
            value: "@jantra.soft",
            href: "https://instagram.com/jantra.soft",
            color: "from-pink-500/20 to-rose-500/10"
        }
    ];

    return (
        <main className="relative w-full min-h-screen bg-[#f8fafc] overflow-hidden selection:bg-orange-200">
            <GlassFilter />
            
            {/* Immersive Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                        rotate: [0, 90, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[20%] -left-[10%] w-[80vw] h-[80vw] bg-orange-200/40 blur-[150px] rounded-full"
                />
                <motion.div 
                    animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                        rotate: [0, -90, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] bg-rose-200/30 blur-[120px] rounded-full"
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-40 pb-12 sm:pt-48">
                
                {/* ── HEADER — Simple & Clear ── */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 sm:mb-16">
                    <div className="max-w-2xl">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-3 mb-4"
                        >
                            <div className="w-8 h-[2px] bg-orange-500" />
                            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-orange-600">Get in Touch</span>
                        </motion.div>
                        
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl sm:text-7xl font-black text-slate-900 leading-[0.85] tracking-tighter uppercase"
                        >
                            Work <br /> With Us<span className="text-orange-500">.</span>
                        </motion.h1>
                    </div>
                    
                    <motion.p 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 text-xs sm:text-sm font-black uppercase tracking-[0.2em] max-w-xs leading-relaxed lg:text-right border-l-2 lg:border-l-0 lg:border-r-2 border-orange-500/20 pl-4 lg:pl-0 lg:pr-4"
                    >
                        Professional <span className="text-slate-900 font-black">Software Services</span> for your next big idea.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-stretch">
                    
                    {/* LEFT: INFO BENTO */}
                    <div className="lg:col-span-5 flex flex-col gap-6 order-2 lg:order-1">
                        <div className="grid grid-cols-2 gap-4">
                            {contactMethods.map((method, i) => (
                                <motion.a
                                    key={i}
                                    href={method.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group relative flex flex-col p-6 rounded-[2rem] bg-white border border-slate-100 hover:border-orange-500/50 shadow-sm transition-all duration-500 overflow-hidden"
                                >
                                     <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br", method.color)} />
                                     <div className="relative z-10 flex flex-col">
                                         <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-orange-500 transition-all duration-500 mb-4 border border-slate-100">
                                             <method.icon className="w-4 h-4" />
                                         </div>
                                         <h4 className="text-[7px] font-black uppercase text-slate-400 tracking-[0.3em] mb-1">{method.label}</h4>
                                         <p className="text-[10px] font-black text-slate-900 uppercase truncate">{method.value}</p>
                                     </div>
                                </motion.a>
                            ))}
                        </div>

                        {/* Location Card */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="relative flex-1 group p-8 rounded-[2.5rem] bg-slate-900 text-white overflow-hidden shadow-xl"
                        >
                             <div className="absolute top-0 right-0 w-48 h-48 bg-orange-600/20 blur-[60px] rounded-full pointer-events-none" />
                             <div className="relative z-10 h-full flex flex-col justify-between gap-6">
                                 <div className="space-y-4">
                                     <div className="p-3 w-fit rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                                         <MapPin className="w-5 h-5 text-orange-500" />
                                     </div>
                                     <div className="space-y-1">
                                         <h4 className="text-xl font-black tracking-tighter uppercase">Our Location</h4>
                                         <p className="text-slate-500 text-[8px] font-black uppercase tracking-widest">Dhaka, Bangladesh</p>
                                     </div>
                                 </div>
                                 <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                     <span className="text-[7px] font-black uppercase tracking-widest text-emerald-500">We are currently accepting new projects</span>
                                 </div>
                             </div>
                        </motion.div>
                    </div>

                    {/* RIGHT: THE FORM */}
                    <div className="lg:col-span-7 order-1 lg:order-2">
                        <AnimatePresence mode="wait">
                            {status === "success" ? (
                                <motion.div
                                    key="success-card"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="h-full min-h-[450px] flex flex-col items-center justify-center text-center p-8 bg-white rounded-[3rem] border border-emerald-100 shadow-xl relative overflow-hidden"
                                >
                                    <div className="relative z-10 space-y-6">
                                        <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                                            <CheckCircle2 className="w-8 h-8 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-2">Message Sent</h3>
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] max-w-xs mx-auto">Thank you for reaching out. Our HR team will be calling you shortly.</p>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                setFormData({ name: "", email: "", subject: "", message: "" });
                                                setStatus("idle");
                                            }}
                                            className="px-8 py-3 bg-slate-900 text-white rounded-full font-black uppercase tracking-widest text-[9px] hover:bg-orange-600 transition-all shadow-lg active:scale-95"
                                        >
                                            Send Another Message
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="form-card"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="h-full"
                                >
                                    <div className="relative bg-white/90 backdrop-blur-xl rounded-[3rem] border border-white p-8 sm:p-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]">
                                        <div className="flex items-center justify-between gap-4 mb-8">
                                            <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase">Send a Message</h3>
                                            <Sparkles className="w-5 h-5 text-orange-400/50" />
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div className="group space-y-2">
                                                    <label className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 group-focus-within:text-orange-600 transition-colors ml-4">Full Name</label>
                                                    <input required type="text" placeholder="YOUR NAME" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-[10px] font-bold uppercase tracking-widest outline-none focus:bg-white focus:ring-1 focus:ring-orange-500 transition-all" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                                                </div>
                                                <div className="group space-y-2">
                                                    <label className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 group-focus-within:text-orange-600 transition-colors ml-4">Email Address</label>
                                                    <input required type="email" placeholder="YOUR@EMAIL.COM" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-[10px] font-bold uppercase tracking-widest outline-none focus:bg-white focus:ring-1 focus:ring-orange-500 transition-all" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                                                </div>
                                            </div>

                                            <div className="group space-y-2">
                                                <label className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 group-focus-within:text-orange-600 transition-colors ml-4">Subject</label>
                                                <input required type="text" placeholder="HOW CAN WE HELP?" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-[10px] font-bold uppercase tracking-widest outline-none focus:bg-white focus:ring-1 focus:ring-orange-500 transition-all" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
                                            </div>

                                            <div className="group space-y-2">
                                                <label className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 group-focus-within:text-orange-600 transition-colors ml-4">Your Message</label>
                                                <textarea required rows={3} placeholder="TELL US ABOUT YOUR PROJECT" className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-6 py-6 text-[10px] font-bold uppercase tracking-widest outline-none focus:bg-white focus:ring-1 focus:ring-orange-500 transition-all resize-none" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} />
                                            </div>

                                            <button type="submit" disabled={status === "sending"} className="group/btn relative w-full overflow-hidden py-6 bg-slate-950 text-white rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-4 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg">
                                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-rose-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                                                <span className="relative z-10">{status === "sending" ? "SENDING..." : "SUBMIT MESSAGE"}</span>
                                            </button>
                                        </form>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>



            {/* Bottom Marquee Decorative Line */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-slate-200 flex items-center justify-center opacity-30">
                <div className="whitespace-nowrap flex gap-12 font-black uppercase tracking-[1em] text-[8px] text-slate-400">
                    <span>JANTRA ENTERPRISE</span>
                    <span>PROTOCOLS ACTIVE</span>
                    <span>DESIGN SYSTEMS</span>
                    <span>TRANSFORMING VISION</span>
                    <span>JANTRA ENTERPRISE</span>
                </div>
            </div>
        </main>
    );
}

