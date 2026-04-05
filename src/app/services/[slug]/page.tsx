import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, LayoutTemplate, Layers, Cpu, ShieldCheck, Sparkles, Send, Binary } from "lucide-react";
import LottiePlayer from "@/components/LottiePlayer";
import api from "@/lib/api";

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    
    const serviceDataMap: Record<string, { title: string, category: string, lottie: string, description: string, descBg: string }> = {
        "custom-software-development": { title: "Custom Software", category: "Core Service", lottie: "/lottie/software-development-green.json", description: "End-to-end bespoke software solutions built for scale and performance. We engineer systems that fit your exact business logic rather than forcing you to conform to off-the-shelf products.", descBg: "bg-orange-50" },
        "mobile-app-development": { title: "Mobile App Development", category: "Core Service", lottie: "/lottie/mobile-app-promo/animations/12345.json", description: "High-performance native and cross-platform mobile applications that users love. We build seamless experiences for iOS and Android.", descBg: "bg-slate-50" },
        "ai-agent-development": { title: "AI Agent Development", category: "Core Service", lottie: "/lottie/ai-assistant-animation.json", description: "Deploy autonomous AI agents that think, act, and execute complex business tasks 24/7. Transform operational efficiency with independent agents.", descBg: "bg-orange-50" },
        "workflow-automation": { title: "Workflow Automation", category: "Core Service", lottie: "/lottie/live_chatbot.json", description: "Eliminate manual operational bottlenecks with intelligent, end-to-end automated workflows that adapt to unexpected changes.", descBg: "bg-orange-50" },
        "saas-product-development": { title: "SaaS Development", category: "Core Service", lottie: "/lottie/saas.json", description: "From architecture to deployment, we build scalable Software-as-a-Service platforms designed for massive parallel tenant usage.", descBg: "bg-slate-50" },
        "cloud-api-systems": { title: "Cloud & API Systems", category: "Core Service", lottie: "/lottie/cloud.json", description: "Robust backend systems and APIs to connect and power your digital ecosystem, built with high availability in mind.", descBg: "bg-orange-50" },
    };

    let service = null;
    try {
        const response = await api.get("/services");
        const apiData = response.data?.data || response.data || [];
        if (Array.isArray(apiData) && apiData.length > 0) {
            const apiService = apiData.find((s: any) => s.slug === slug);
            if (apiService) {
                const local = serviceDataMap[slug];
                service = local ? { ...local, ...apiService } : apiService;
            }
        }
    } catch { }

    if (!service) {
        service = serviceDataMap[slug] || {
            title: "Expert Engineering",
            category: "Core Service",
            lottie: "/lottie/cloud.json",
            description: "High-performance technical solutions designed for global scale.",
            descBg: "bg-slate-50"
        };
    }

    return (
        <main className="relative w-full min-h-screen bg-white pb-32">
            {/* ── BACKGROUND SYMBOL ── */}
            <div className="absolute top-[10%] right-0 w-[600px] h-[600px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-[1540px] mx-auto px-4 sm:px-12 pt-24 sm:pt-36 relative z-10">
                
                {/* ── NAVIGATION ── */}
                <Link href="/services" className="inline-flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-orange-600 transition-colors mb-12">
                     <ArrowLeft className="w-3 h-3" /> Back to Registry
                </Link>

                {/* ── HERO GRID ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-24 sm:mb-40">
                    <div className="lg:col-span-7 space-y-6 sm:space-y-10">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-[2px] bg-orange-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600">{service.category}</span>
                         </div>
                         <h1 className="text-4xl sm:text-7xl lg:text-[100px] font-black text-slate-900 leading-[0.85] tracking-tighter uppercase">
                             {service.title.split(' ')[0]} <br />
                             <span className="text-transparent" style={{ WebkitTextStroke: "1px #0f172a" }}>{service.title.split(' ').slice(1).join(' ')}</span>
                             <span className="text-orange-500">.</span>
                         </h1>
                         <p className="text-slate-500 text-sm sm:text-2xl font-medium leading-[1.3] max-w-2xl border-l-[3px] border-orange-500/10 pl-8">
                             {service.description}
                         </p>
                    </div>

                    <div className={`lg:col-span-5 relative aspect-square sm:aspect-video lg:aspect-square ${service.descBg} rounded-[2rem] sm:rounded-[4rem] border border-slate-100 flex items-center justify-center p-12 overflow-hidden group hover:bg-white hover:shadow-2xl transition-all duration-1000`}>
                         <div className="absolute top-6 left-6 flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
                             <span className="text-[8px] font-black text-orange-950 uppercase tracking-widest">Active Render</span>
                         </div>
                         <LottiePlayer src={service.lottie} className="w-full h-full max-w-[400px] group-hover:scale-110 transition-transform duration-1000" />
                    </div>
                </div>

                {/* ── CORE ARCHITECTURE [HIGH DENSITY] ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-20 mb-32">
                    
                    <div className="lg:col-span-4 space-y-8">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">The <br />Architecture.</h2>
                        <p className="text-[13px] font-medium text-slate-500 leading-relaxed uppercase tracking-tight">We build resilient, scalable systems tailored to integrate seamlessly with your existing infrastructure. By leveraging cutting-edge dev paradigms and architectural best practices, we ensure your platforms are future-proof.</p>
                        <div className="grid grid-cols-2 gap-4 pt-4">
                             {[
                                { icon: Binary, val: "0% Leak" },
                                { icon: Cpu, val: "H-F Node" }
                             ].map((st, i) => (
                                <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-3">
                                    <st.icon className="w-4 h-4 text-orange-500" />
                                    <span className="text-[9px] font-black uppercase text-slate-900 tracking-widest">{st.val}</span>
                                </div>
                             ))}
                        </div>
                    </div>

                    <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
                        {[
                            { title: "Blueprints", desc: "Detailed system diagrams, data maps, and scaling matrices.", icon: LayoutTemplate },
                            { title: "Production", desc: "Clean, documented, and fully tested source code repositories.", icon: Layers },
                            { title: "Infrastructure", desc: "IaC pipelines, Dockerfiles, and CI/CD ready for deployment.", icon: ShieldCheck }
                        ].map((del, i) => (
                            <div key={i} className="group p-8 sm:p-10 rounded-[2.5rem] bg-white border border-slate-100 hover:border-orange-500/20 hover:shadow-2xl transition-all duration-700">
                                <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-600 transition-colors duration-700">
                                    <del.icon className="w-5 h-5" />
                                </div>
                                <h3 className="font-black text-slate-900 text-[11px] sm:text-lg uppercase tracking-tight mb-3">{del.title}</h3>
                                <p className="text-slate-500 text-[10px] sm:text-[13px] font-medium leading-tight">{del.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── DEVELOPMENT PROTOCOL [ORANGE MODULE] ── */}
                <section className="mb-32 bg-slate-950 text-white rounded-[2rem] sm:rounded-[4rem] p-8 sm:p-20 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600 opacity-10 blur-[140px] rounded-full translate-x-1/2 -translate-y-1/2" />
                    
                    <div className="grid lg:grid-cols-12 gap-12 items-start relative z-10">
                        <div className="lg:col-span-4 space-y-4">
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-orange-500">Operation Pipeline</span>
                            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter leading-none uppercase">Studio <br />Protocol.</h2>
                        </div>
                        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10">
                            {[
                                { num: "01", title: "Discovery", desc: "Architecture design & schema mapping." },
                                { num: "02", title: "Sprints", desc: "Focused 2-week coding iterations." },
                                { num: "03", title: "QA/Audit", desc: "Pen-tests & automated validation." },
                                { num: "04", title: "Go-Live", desc: "Zero-downtime deployment." }
                            ].map((step, i) => (
                                <div key={i} className="space-y-4">
                                    <span className="text-4xl sm:text-6xl font-black text-white/10">{step.num}</span>
                                    <h3 className="font-black text-[10px] sm:text-[13px] text-white uppercase tracking-widest">{step.title}</h3>
                                    <p className="text-slate-400 text-[9px] sm:text-[11px] uppercase font-bold leading-tight">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── TECH CLOUD & PRICING [2 COLUMN] ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start mb-32">
                    
                    {/* TECH STACK */}
                    <div className="lg:col-span-4 space-y-8">
                         <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Primary <br />Stack.</h2>
                         <div className="flex flex-wrap gap-2">
                             {["React", "Next.js", "Node.js", "Python", "Rust", "PostgreSQL", "MongoDB", "Redis", "AWS", "Google Cloud", "Docker", "Kubernetes", "OpenAI"].map((tech, i) => (
                                <span key={i} className="px-5 py-3 rounded-full bg-slate-50 border border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-orange-600 hover:border-orange-500/20 transition-all cursor-crosshair">
                                    {tech}
                                </span>
                             ))}
                         </div>
                    </div>

                    {/* PRICING TIERS */}
                    <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-8">
                        {[
                            { name: "Starter", price: "$5k", desc: "Base Foundational setups." },
                            { name: "Growth", price: "$15k", desc: "Massive scaling & AI.", highlighted: true },
                            { name: "Global", price: "$35k", desc: "SLA & Mission Critical." }
                        ].map((tier, i) => (
                            <div key={i} className={`p-6 sm:p-10 rounded-[2rem] border h-full flex flex-col justify-between transition-all duration-700 ${tier.highlighted ? "bg-orange-600 border-orange-500 text-white shadow-2xl scale-105" : "bg-white border-slate-100 text-slate-900 hover:border-orange-500/20"}`}>
                                <div className="space-y-4">
                                    <h3 className={`text-[9px] font-black uppercase tracking-widest ${tier.highlighted ? "text-orange-200" : "text-slate-400"}`}>{tier.name}</h3>
                                    <div className="text-3xl sm:text-5xl font-black tracking-tighter leading-none">{tier.price}</div>
                                    <p className={`text-[9px] sm:text-[11px] font-bold uppercase tracking-tight leading-tight ${tier.highlighted ? "text-white" : "text-slate-500"}`}>{tier.desc}</p>
                                </div>
                                <button className={`mt-8 w-full py-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${tier.highlighted ? "bg-white text-orange-600" : "bg-slate-950 text-white hover:bg-orange-600"}`}>
                                    Audit Req
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── CTA PROTOCOL ── */}
                <section className="bg-orange-600 rounded-[2rem] sm:rounded-[4rem] p-8 sm:p-20 text-center text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-slate-950/20 blur-[80px] mix-blend-overlay"></div>
                    <div className="relative z-10 max-w-4xl mx-auto space-y-8">
                        <h2 className="text-4xl sm:text-7xl font-black tracking-tighter leading-none uppercase">Initialize <br />Discovery Now?</h2>
                        <p className="text-white/80 text-sm sm:text-2xl font-medium leading-tight uppercase tracking-tight">
                            Let's get on an architectural audit to see if JANTRA's engineering team is the right fit.
                        </p>
                        <Link href="/contact" className="inline-flex items-center gap-6 bg-slate-950 text-white px-10 py-5 sm:px-16 sm:py-8 rounded-[1.5rem] sm:rounded-[2.5rem] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-slate-950 transition-all shadow-2xl active:scale-95 text-[10px] sm:text-[13px]">
                             Start Consultation <Send className="w-5 h-5" />
                        </Link>
                    </div>
                </section>

            </div>
        </main>
    );
}
