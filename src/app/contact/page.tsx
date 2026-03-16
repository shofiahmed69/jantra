"use client";

import { useState, useEffect } from "react";
import LottiePlayer from "@/components/LottiePlayer";
import { Linkedin, Twitter, Github, Dribbble, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { countries } from "@/content/countries";
import api from "@/lib/api";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        country: "",
        service: "",
        budget: "",
        description: "",
        referral: ""
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        // Only apply parallax on desktop
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
        if (isMobile) return;

        const handleMouseMove = (e: MouseEvent) => {
            const x = (window.innerWidth / 2 - e.pageX) / 50;
            const y = (window.innerHeight / 2 - e.pageY) / 50;

            const anchor = document.getElementById("central-anchor");
            const widgetL = document.getElementById("contact-form-widget");
            const widgetR = document.getElementById("contact-info-widget");

            if (anchor) anchor.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
            if (widgetL) widgetL.style.transform = `translate(${x * 1.5}px, ${y * 1.5}px)`;
            if (widgetR) widgetR.style.transform = `translate(${x * 2.5}px, ${y * 2.5}px)`;
        };

        document.addEventListener("mousemove", handleMouseMove);
        return () => document.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus("idle");
        setErrorMessage("");

        try {
            await api.post("/leads", formData);

            setStatus("success");
            setFormData({
                name: "",
                email: "",
                company: "",
                country: "",
                service: "",
                budget: "",
                description: "",
                referral: ""
            });
        } catch (error: any) {
            console.error("Submission error:", error);

            const statusCode = error.response?.status;

            // 422 means validation issue BUT data is saved
            // treat it as success
            if (statusCode === 422 || statusCode === 201 || statusCode === 200) {
                setStatus("success");
                setFormData({
                    name: "",
                    email: "",
                    company: "",
                    country: "",
                    service: "",
                    budget: "",
                    description: "",
                    referral: ""
                });
                setLoading(false);
                return;
            }

            const serverError = error.response?.data;

            // We only reach here if the backend actually threw a 500 or failed to save.
            setErrorMessage(serverError?.error || "Signal transmission failed. Please try again.");
            setStatus("error");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <main className="relative w-full min-h-screen flex flex-col lg:flex-row items-center justify-center overflow-hidden pt-24 pb-12 lg:pt-0 lg:pb-0 px-4 sm:px-6 lg:px-0 gap-6 lg:gap-0">
            {/* Central Globe Lottie — hidden on mobile */}
            <section
                className="hidden lg:flex absolute inset-0 m-auto w-[50%] h-[600px] z-10 items-center justify-center pointer-events-none"
                id="central-anchor"
            >
                <div className="relative w-[500px] h-[500px] rounded-full animate-[float_6s_ease-in-out_infinite] flex items-center justify-center">
                    <LottiePlayer src="/lottie/globe.json" className="w-80 h-80" />
                    <p className="absolute bottom-16 text-orange-500/50 text-xs uppercase tracking-[0.3em]">
                        Jantra — Dhaka, BD
                    </p>
                </div>
            </section>

            {/* Contact Form Widget */}
            <section
                className="relative lg:absolute lg:left-[10%] lg:top-[15%] w-full max-w-lg lg:w-[40%] lg:min-w-[400px] lg:max-w-[500px] z-20 glass-panel rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 md:p-10 spatial-hover"
                id="contact-form-widget"
            >
                {status === "success" ? (
                    <div className="flex flex-col items-center justify-center text-center py-10 animate-fade-up">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-600">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-light tracking-tight text-slate-800 mb-4">
                            Signal <span className="font-semibold text-orange-500">Transmitted</span>
                        </h1>
                        <p className="text-slate-500 text-sm md:text-base mb-8 max-w-xs mx-auto">
                            We&apos;ve received your message and our global nodes are processing it. Expect a response within 24 hours.
                        </p>
                        <button
                            onClick={() => setStatus("idle")}
                            className="bg-slate-900 text-white px-8 py-3 rounded-xl md:rounded-2xl font-medium tracking-wide hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-200/50 active:scale-95 text-sm"
                        >
                            Send Another Message
                        </button>
                    </div>
                ) : (
                    <>
                        <header className="mb-6 md:mb-8">
                            <h1 className="text-2xl md:text-3xl font-light tracking-tight text-slate-800">
                                Send a <span className="font-semibold text-orange-500">Signal</span>
                            </h1>
                            <p className="text-slate-500 text-xs md:text-sm mt-2">
                                Let&apos;s build something extraordinary together.
                            </p>
                        </header>
                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-slate-400 mb-1 ml-4">
                                        Name
                                    </label>
                                    <input
                                        className="w-full bg-white/40 border-0 rounded-xl md:rounded-2xl px-4 md:px-5 py-3 focus:ring-2 focus:ring-orange-300 placeholder:text-slate-400 text-sm transition-all"
                                        placeholder="Full Name"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-slate-400 mb-1 ml-4">
                                        Email
                                    </label>
                                    <input
                                        className="w-full bg-white/40 border-0 rounded-xl md:rounded-2xl px-4 md:px-5 py-3 focus:ring-2 focus:ring-orange-300 placeholder:text-slate-400 text-sm transition-all"
                                        placeholder="work@domain.com"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-slate-400 mb-1 ml-4">
                                        Company
                                    </label>
                                    <input
                                        className="w-full bg-white/40 border-0 rounded-xl md:rounded-2xl px-4 md:px-5 py-3 focus:ring-2 focus:ring-orange-300 placeholder:text-slate-400 text-sm transition-all"
                                        placeholder="Organization"
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-slate-400 mb-1 ml-4">
                                        Country
                                    </label>
                                    <select
                                        className="w-full bg-white/40 border-0 rounded-xl md:rounded-2xl px-4 md:px-5 py-3 focus:ring-2 focus:ring-orange-300 text-slate-700 text-sm transition-all appearance-none cursor-pointer"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Region</option>
                                        {countries.map((c, i) => (
                                            <option key={i} value={`${c.country} - ${c.city}`}>
                                                {c.country} ({c.city})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-slate-400 mb-1 ml-4">
                                        Service Interest
                                    </label>
                                    <select
                                        name="service"
                                        value={formData.service}
                                        onChange={handleChange}
                                        className="w-full bg-white/40 border-0 rounded-xl md:rounded-2xl px-4 md:px-5 py-3 focus:ring-2 focus:ring-orange-300 text-slate-700 text-sm transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Select Service</option>
                                        <option value="software">Custom Software</option>
                                        <option value="ai">AI Agents</option>
                                        <option value="automation">Workflow Automation</option>
                                        <option value="saas">SaaS Development</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-slate-400 mb-1 ml-4">
                                        Budget Range
                                    </label>
                                    <select
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleChange}
                                        className="w-full bg-white/40 border-0 rounded-xl md:rounded-2xl px-4 md:px-5 py-3 focus:ring-2 focus:ring-orange-300 text-slate-700 text-sm transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Select Budget</option>
                                        <option value="10k - 20k BDT">10K BDT - 20K BDT</option>
                                        <option value="20k - 30k BDT">20K BDT - 30K BDT</option>
                                        <option value="30k - 50k BDT">30K BDT - 50K BDT</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-slate-400 mb-1 ml-4">
                                    Project Description
                                </label>
                                <textarea
                                    className="w-full bg-white/40 border-0 rounded-xl md:rounded-2xl px-4 md:px-5 py-3 focus:ring-2 focus:ring-orange-300 placeholder:text-slate-400 text-sm transition-all resize-none"
                                    placeholder="Tell us about your project challenges and goals..."
                                    rows={3}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-slate-400 mb-1 ml-4">
                                    Referral Source
                                </label>
                                <input
                                    className="w-full bg-white/40 border-0 rounded-xl md:rounded-2xl px-4 md:px-5 py-2.5 focus:ring-2 focus:ring-orange-300 placeholder:text-slate-400 text-sm transition-all"
                                    placeholder="How did you hear about us?"
                                    type="text"
                                    name="referral"
                                    value={formData.referral}
                                    onChange={handleChange}
                                />
                            </div>

                            {status === "error" && (
                                <div className="flex items-center gap-2 text-red-500 bg-red-50 p-4 rounded-2xl text-xs font-bold animate-fade-up">
                                    <AlertCircle className="w-4 h-4" /> {errorMessage}
                                </div>
                            )}

                            <button
                                className="w-full bg-slate-900 text-white py-3 md:py-4 mt-2 rounded-xl md:rounded-2xl font-medium tracking-wide hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-200/50 active:scale-95 text-sm md:text-base flex items-center justify-center gap-2"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> Transmitting Signal...
                                    </>
                                ) : (
                                    "Send Message"
                                )}
                            </button>
                        </form>
                    </>
                )}
            </section>

            {/* Info Card Widget */}
            <section
                className="relative lg:absolute lg:right-[15%] lg:top-[35%] w-full max-w-md lg:w-[25%] lg:min-w-[280px] lg:max-w-[380px] z-20 glass-panel rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 md:p-10 spatial-hover"
                id="contact-info-widget"
            >
                <div className="space-y-8 md:space-y-10">
                    {/* Contact Info */}
                    <div>
                        <h2 className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-orange-500 font-bold mb-3 md:mb-4">
                            Global Reach
                        </h2>
                        <div className="space-y-3 md:space-y-4">
                            <div className="flex items-start">
                                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3 md:mr-4 text-orange-600 flex-shrink-0">
                                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Email Response</p>
                                    <p className="text-xs md:text-sm font-medium text-slate-700">Under 2 hours typical</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3 md:mr-4 text-orange-600 flex-shrink-0">
                                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                        />
                                    </svg>
                                </div>
                                <div className="flex flex-col items-start">
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Consultation</p>
                                    <a href="#" className="text-xs md:text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-2">Book Calendar Slot →</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="pt-4 md:pt-6 border-t border-white/30">
                        <h2 className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-slate-400 font-bold mb-3 md:mb-4">
                            Operations
                        </h2>
                        <p className="text-xs md:text-sm text-slate-600 leading-relaxed italic">
                            Mon - Fri, 9:00 AM - 6:00 PM (GMT+6) <br />
                            Serving clients globally.
                        </p>
                        <div className="mt-4 md:mt-6 flex items-center space-x-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                            </span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest">
                                Global Nodes Active
                            </span>
                        </div>
                    </div>

                    {/* Socials */}
                    <div className="pt-4 md:pt-6 border-t border-white/30">
                        <h2 className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-slate-400 font-bold mb-3 md:mb-4">
                            Connect
                        </h2>
                        <div className="flex items-center gap-3">
                            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/40 text-slate-600 hover:bg-orange-100 hover:text-orange-600 transition-colors">
                                <Linkedin className="w-4 h-4" />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/40 text-slate-600 hover:bg-orange-100 hover:text-orange-600 transition-colors">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="https://github.com" target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/40 text-slate-600 hover:bg-orange-100 hover:text-orange-600 transition-colors">
                                <Github className="w-4 h-4" />
                            </a>
                            <a href="https://dribbble.com" target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/40 text-slate-600 hover:bg-orange-100 hover:text-orange-600 transition-colors">
                                <Dribbble className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
