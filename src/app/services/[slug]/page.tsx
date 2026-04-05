import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, LayoutTemplate, Layers, Cpu, ShieldCheck, Mail } from "lucide-react";
import LottiePlayer from "@/components/LottiePlayer";
import api from "@/lib/api";

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    
    const serviceDataMap: Record<string, { title: string, category: string, lottie: string, description: string, descBg: string }> = {
        "custom-software-development": { title: "Custom Software", category: "Engineering", lottie: "/lottie/software-development-green.json", description: "Bespoke software solutions built for scale and performance. We engineer systems that fit your exact business logic.", descBg: "bg-slate-50" },
        "mobile-app-development": { title: "Mobile Apps", category: "Product", lottie: "/lottie/mobile-app-promo/animations/12345.json", description: "High-performance native and cross-platform mobile applications for iOS and Android.", descBg: "bg-slate-50" },
        "ai-agent-development": { title: "AI Agents", category: "AI & ML", lottie: "/lottie/ai-assistant-animation.json", description: "Autonomous AI agents that execute complex business tasks 24/7. Transform operational efficiency.", descBg: "bg-slate-50" },
        "workflow-automation": { title: "Automation", category: "Optimization", lottie: "/lottie/live_chatbot.json", description: "Eliminate manual operational bottlenecks with intelligent, end-to-end automated workflows.", descBg: "bg-slate-50" },
        "saas-product-development": { title: "SaaS Products", category: "Cloud", lottie: "/lottie/saas.json", description: "Scalable Software-as-a-Service platforms designed for massive parallel tenant usage.", descBg: "bg-slate-50" },
        "cloud-api-systems": { title: "API Systems", category: "Infrastructure", lottie: "/lottie/cloud.json", description: "Robust backend systems and APIs to connect and power your digital ecosystem.", descBg: "bg-slate-50" },
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
        <main className="w-full min-h-screen bg-white pb-32">
            
            <div className="max-w-[1280px] mx-auto px-6 sm:px-12 pt-28 sm:pt-40">
                
                {/* ── BREADCRUMB ── */}
                <Link href="/services" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-orange-600 transition-colors mb-12">
                     <ArrowLeft className="w-4 h-4" /> BACK TO SERVICES
                </Link>

                {/* ── HERO: CLEAN FORMAT ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-20 sm:mb-32">
                    <div className="lg:col-span-7 space-y-8">
                         <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 bg-orange-50 px-4 py-2 rounded-full border border-orange-100">{service.category}</span>
                            <div className="w-12 h-[1px] bg-slate-200" />
                         </div>
                         <h1 className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tight leading-[0.9] uppercase">
                             {service.title} <span className="text-orange-500">.</span>
                         </h1>
                         <p className="text-slate-500 text-lg sm:text-xl font-medium leading-relaxed max-w-xl">
                             {service.description}
                         </p>
                    </div>

                    <div className={`lg:col-span-5 aspect-square ${service.descBg} rounded-[3rem] border border-slate-100 flex items-center justify-center p-12 overflow-hidden`}>
                         <LottiePlayer src={service.lottie} className="w-full h-full max-w-[350px]" />
                    </div>
                </div>

                {/* ── CORE DETAILS: 3 CARDS ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10 mb-32">
                    {[
                        { title: "Discovery", desc: "Detailed system diagrams & data maps.", icon: LayoutTemplate },
                        { title: "Building", desc: "Production code with full documentation.", icon: Layers },
                        { title: "Scaling", desc: "Infrastructure pipelines & CI/CD workflows.", icon: ShieldCheck }
                    ].map((del, i) => (
                        <div key={i} className="p-10 rounded-[2.5rem] bg-white border border-slate-100 transition-all hover:bg-slate-50 hover:border-slate-200">
                            <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                                <del.icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-black text-slate-900 text-xl uppercase tracking-tighter mb-4">{del.title}</h3>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed">{del.desc}</p>
                        </div>
                    ))}
                </div>

                {/* ── PROCESS STEPS: CLEAN LIST ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-32">
                    <div className="lg:col-span-4">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-6">Our <br />Process.</h2>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-sm">We operate in focused development cycles to ensure maximum transparency and technical accuracy.</p>
                    </div>
                    <div className="lg:col-span-8 flex flex-col gap-4">
                        {[
                            { num: "01", title: "Architecture Design", desc: "Mapping business logic into technical schemas." },
                            { num: "02", title: "Agile Development", desc: "2-week sprints with constant feedback loops." },
                            { num: "03", title: "QA & Security", desc: "Automated testing and rigorous code audits." },
                            { num: "04", title: "Deployment", desc: "Smooth go-live with continuous support." }
                        ].map((step, i) => (
                            <div key={i} className="group p-8 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center gap-10 hover:bg-white hover:border-slate-300 transition-all">
                                <span className="text-4xl font-black text-slate-200 group-hover:text-orange-500 transition-colors">{step.num}</span>
                                <div className="space-y-1">
                                    <h4 className="font-black text-slate-950 uppercase tracking-tight">{step.title}</h4>
                                    <p className="text-[12px] text-slate-500 font-medium">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── TECH & PRICING: SIMPLE CARDS ── */}
                <div className="grid lg:grid-cols-2 gap-10 mb-32">
                    
                    {/* TECH STACK CLOUD */}
                    <div className="p-12 rounded-[3.5rem] bg-slate-900 text-white space-y-10">
                        <h2 className="text-3xl font-black tracking-tighter uppercase">Tech Stack.</h2>
                        <div className="flex flex-wrap gap-2">
                             {["React", "Node.js", "Python", "AWS", "PostgreSQL", "OpenAI", "Docker"].map((tech, i) => (
                                <span key={i} className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-all">
                                    {tech}
                                </span>
                             ))}
                        </div>
                    </div>

                    {/* SIMPLE CALL TO ACTION BOX */}
                    <div className="p-12 rounded-[3.5rem] bg-orange-600 text-white flex flex-col justify-between">
                         <div className="space-y-4">
                            <h2 className="text-3xl font-black tracking-tighter uppercase">Ready to Build?</h2>
                            <p className="text-white/80 font-medium leading-relaxed max-w-xs">Let's schedule a brief discovery call to explore your project architecture.</p>
                         </div>
                         <Link href="/contact" className="mt-8 w-full py-6 rounded-2xl bg-slate-950 text-white font-black uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-white hover:text-slate-950 transition-all shadow-2xl active:scale-95">
                            Get A Quote <ArrowRight className="w-5 h-5" />
                         </Link>
                    </div>
                </div>

            </div>
        </main>
    );
}
