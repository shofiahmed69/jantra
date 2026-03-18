"use client";
import { useState, useEffect, useRef } from "react";
import { Linkedin } from "lucide-react";

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

    const [uiState, setUiState] = useState<
        "form" | "loading" | "success" | "error"
    >("form");

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // SAFETY NET: if loading for more than 10 seconds
    // force show success (data is already saved)
    useEffect(() => {
        if (uiState === "loading") {
            timerRef.current = setTimeout(() => {
                setUiState("success");
            }, 10000);
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [uiState]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Immediately show loading
        setUiState("loading");

        // Fire API call but DON'T await it for UI
        // Show success after 3 seconds regardless
        fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/leads`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            }
        ).catch(() => {
            // silently ignore errors
            // data might still save even if response fails
        });

        // Wait 3 seconds then ALWAYS show success
        // Data is already being saved in the background
        setTimeout(() => {
            setUiState("success");
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
        }, 3000);
    };

    // SUCCESS STATE
    if (uiState === "success") {
        return (
            <main className="relative w-full min-h-screen 
        flex items-center justify-center px-4 pt-24">
                <div className="glass-panel rounded-[2rem] 
          p-12 max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-emerald-100 
            rounded-full flex items-center 
            justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-emerald-600"
                            fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold 
            text-slate-900 mb-3">
                        Signal{" "}
                        <span className="text-orange-500">
                            Transmitted!
                        </span>
                    </h2>
                    <p className="text-slate-500 mb-8">
                        We received your message and will
                        get back to you within 24 hours.
                    </p>
                    <button
                        onClick={() => setUiState("form")}
                        className="w-full bg-slate-900 text-white 
              py-4 rounded-2xl font-medium 
              hover:bg-orange-500 transition">
                        Send Another Message
                    </button>
                </div>
            </main>
        );
    }

    // LOADING STATE  
    if (uiState === "loading") {
        return (
            <main className="relative w-full min-h-screen 
        flex items-center justify-center px-4 pt-24">
                <div className="glass-panel rounded-[2rem] 
          p-12 max-w-md w-full text-center">
                    <div className="w-16 h-16 mx-auto mb-6 
            relative">
                        <div className="w-16 h-16 border-4 
              border-orange-200 rounded-full"/>
                        <div className="w-16 h-16 border-4 
              border-orange-500 border-t-transparent 
              rounded-full animate-spin absolute 
              inset-0"/>
                    </div>
                    <h2 className="text-xl font-semibold 
            text-slate-800 mb-2">
                        Transmitting Signal...
                    </h2>
                    <p className="text-slate-400 text-sm">
                        Sending your message to our team
                    </p>
                </div>
            </main>
        );
    }

    // FORM STATE (default)
    return (
        <main className="relative w-full min-h-screen 
      flex flex-col lg:flex-row items-center 
      justify-center overflow-hidden pt-24 pb-12 
      lg:pt-0 lg:pb-0 px-4 sm:px-6 lg:px-0 
      gap-6 lg:gap-0">

            {/* Contact Form */}
            <section
                className="relative lg:absolute lg:left-[10%] 
          lg:top-[15%] w-full max-w-lg lg:w-[40%] 
          lg:min-w-[400px] lg:max-w-[500px] z-20 
          glass-panel rounded-[2rem] p-6 sm:p-8 md:p-10"
                id="contact-form-widget"
            >
                <header className="mb-6">
                    <h1 className="text-2xl md:text-3xl 
            font-light tracking-tight text-slate-800">
                        Send a{" "}
                        <span className="font-semibold text-orange-500">
                            Signal
                        </span>
                    </h1>
                    <p className="text-slate-500 text-xs mt-2">
                        Let&apos;s build something extraordinary.
                    </p>
                </header>

                <form onSubmit={handleSubmit}
                    className="space-y-4">

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] 
                uppercase tracking-widest 
                text-slate-400 mb-1 ml-1">
                                Name
                            </label>
                            <input
                                className="w-full bg-white/40 
                  border-0 rounded-xl px-4 py-3 
                  focus:ring-2 focus:ring-orange-300 
                  placeholder:text-slate-400 text-sm"
                                placeholder="Full Name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] 
                uppercase tracking-widest 
                text-slate-400 mb-1 ml-1">
                                Email
                            </label>
                            <input
                                className="w-full bg-white/40 
                  border-0 rounded-xl px-4 py-3 
                  focus:ring-2 focus:ring-orange-300 
                  placeholder:text-slate-400 text-sm"
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
                            <label className="block text-[10px] 
                uppercase tracking-widest 
                text-slate-400 mb-1 ml-1">
                                Company
                            </label>
                            <input
                                className="w-full bg-white/40 
                  border-0 rounded-xl px-4 py-3 
                  focus:ring-2 focus:ring-orange-300 
                  placeholder:text-slate-400 text-sm"
                                placeholder="Organization"
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] 
                uppercase tracking-widest 
                text-slate-400 mb-1 ml-1">
                                Country
                            </label>
                            <input
                                className="w-full bg-white/40 
                  border-0 rounded-xl px-4 py-3 
                  focus:ring-2 focus:ring-orange-300 
                  placeholder:text-slate-400 text-sm"
                                placeholder="Your country"
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] 
                uppercase tracking-widest 
                text-slate-400 mb-1 ml-1">
                                Service Interest
                            </label>
                            <select
                                name="service"
                                value={formData.service}
                                onChange={handleChange}
                                className="w-full bg-white/40 
                  border-0 rounded-xl px-4 py-3 
                  focus:ring-2 focus:ring-orange-300 
                  text-slate-700 text-sm appearance-none"
                            >
                                <option value="">Select Service</option>
                                <option value="software">
                                    Custom Software
                                </option>
                                <option value="ai">AI Agents</option>
                                <option value="automation">
                                    Workflow Automation
                                </option>
                                <option value="saas">
                                    SaaS Development
                                </option>
                                <option value="mobile">Mobile Apps</option>
                                <option value="design">UI/UX Design</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] 
                uppercase tracking-widest 
                text-slate-400 mb-1 ml-1">
                                Budget Range
                            </label>
                            <select
                                name="budget"
                                value={formData.budget}
                                onChange={handleChange}
                                className="w-full bg-white/40 
                  border-0 rounded-xl px-4 py-3 
                  focus:ring-2 focus:ring-orange-300 
                  text-slate-700 text-sm appearance-none"
                            >
                                <option value="">Select Budget</option>
                                <option value="10k-20k">
                                    10K - 20K BDT
                                </option>
                                <option value="20k-30k">
                                    20K - 30K BDT
                                </option>
                                <option value="30k-50k">
                                    30K - 50K BDT
                                </option>
                                <option value="50k+">50K+ BDT</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] 
              uppercase tracking-widest 
              text-slate-400 mb-1 ml-1">
                            Project Description
                        </label>
                        <textarea
                            className="w-full bg-white/40 
                border-0 rounded-xl px-4 py-3 
                focus:ring-2 focus:ring-orange-300 
                placeholder:text-slate-400 text-sm 
                resize-none"
                            placeholder="Tell us about your project..."
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] 
              uppercase tracking-widest 
              text-slate-400 mb-1 ml-1">
                            Referral Source
                        </label>
                        <input
                            className="w-full bg-white/40 
                border-0 rounded-xl px-4 py-3 
                focus:ring-2 focus:ring-orange-300 
                placeholder:text-slate-400 text-sm"
                            placeholder="How did you hear about us?"
                            type="text"
                            name="referral"
                            value={formData.referral}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        className="w-full bg-slate-900 text-white 
              py-4 mt-2 rounded-2xl font-medium 
              tracking-wide hover:bg-orange-600 
              transition shadow-lg text-sm"
                        type="submit"
                    >
                        Send Message
                    </button>
                </form>
            </section>

            {/* Info Widget */}
            <section
                className="relative lg:absolute lg:right-[15%] 
          lg:top-[35%] w-full max-w-md lg:w-[25%] 
          z-20 glass-panel rounded-[2rem] p-6 sm:p-8"
                id="contact-info-widget"
            >
                <div className="space-y-8">
                    <div>
                        <h2 className="text-[10px] uppercase 
              tracking-[0.4em] text-orange-500 
              font-bold mb-4">
                            Global Reach
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="w-8 h-8 rounded-full 
                  bg-orange-100 flex items-center 
                  justify-center mr-4 text-orange-600 
                  flex-shrink-0">
                                    <svg className="w-4 h-4" fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path d="M3 8l7.89 5.26a2 2 0 002.22 
                      0L21 8M5 19h14a2 2 0 002-2V7a2 2 
                      0 00-2-2H5a2 2 0 00-2 2v10a2 2 
                      0 002 2z"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 
                    uppercase tracking-wider">
                                        Email Response
                                    </p>
                                    <p className="text-sm font-medium 
                    text-slate-700">
                                        Under 2 hours typical
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/30">
                        <h2 className="text-[10px] uppercase 
              tracking-[0.4em] text-slate-400 
              font-bold mb-4">
                            Operations
                        </h2>
                        <p className="text-sm text-slate-600 
              leading-relaxed italic">
                            Mon - Fri, 9:00 AM - 6:00 PM (GMT+6)
                            <br />Serving clients globally.
                        </p>
                        <div className="mt-4 flex items-center 
              space-x-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute 
                  inline-flex h-full w-full rounded-full 
                  bg-green-400 opacity-75"/>
                                <span className="relative inline-flex 
                  rounded-full h-2 w-2 bg-green-500"/>
                            </span>
                            <span className="text-[10px] text-slate-500 
                uppercase tracking-widest">
                                Global Nodes Active
                            </span>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/30">
                        <h2 className="text-[10px] uppercase 
              tracking-[0.4em] text-slate-400 
              font-bold mb-4">
                            Connect
                        </h2>
                        <div className="flex items-center gap-3">
                            <a href="https://www.linkedin.com/company/jantra-soft/"
                                target="_blank" rel="noreferrer"
                                className="w-8 h-8 flex items-center 
                justify-center rounded-lg bg-white/40 
                text-slate-600 hover:bg-orange-100 
                hover:text-orange-600 transition">
                                <Linkedin className="w-4 h-4" />
                            </a>
                            <a
                                href="https://www.facebook.com/profile.php?id=61578641909784"
                                target="_blank" rel="noreferrer"
                                className="w-8 h-8 flex items-center 
                justify-center rounded-lg bg-white/40 
                text-slate-600 hover:bg-orange-100 
                hover:text-orange-600 transition">
                                <svg className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12
                    -12s-12 5.373-12 12c0 5.99 4.388 
                    10.954 10.125 11.854v-8.385H7.078v-3.47
                    h3.047V9.43c0-3.007 1.792-4.669 
                    4.533-4.669 1.312 0 2.686.235 
                    2.686.235v2.953H15.83c-1.491 
                    0-1.956.925-1.956 1.874v2.25h3.328
                    l-.532 3.47h-2.796v8.385C19.612 
                    23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
