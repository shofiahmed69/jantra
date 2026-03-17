import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, LayoutTemplate, Layers, Cpu, ShieldCheck, BarChart4, Send } from "lucide-react";
import LottiePlayer from "@/components/LottiePlayer";

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    // A robust mapping of slugs to specific content for the 10 services.
    const serviceDataMap: Record<string, { title: string, category: string, lottie: string, description: string, descBg: string }> = {
        "custom-software": { title: "Custom Software Development", category: "Core Service", lottie: "/lottie/software-development-green.json", description: "End-to-end bespoke software solutions built for scale and performance. We engineer systems that fit your exact business logic rather than forcing you to conform to off-the-shelf products.", descBg: "bg-orange-100" },
        "mobile-app": { title: "Mobile App Development", category: "Core Service", lottie: "/lottie/app-development.json", description: "High-performance native and cross-platform mobile applications that users love. We build seamless experiences for iOS and Android.", descBg: "bg-slate-200" },
        "ai-agent": { title: "AI Agent Development", category: "Core Service", lottie: "/lottie/assistant-bot.json", description: "Deploy autonomous AI agents that think, act, and execute complex business tasks 24/7. Transform operational efficiency with independent agents.", descBg: "bg-orange-100" },
        "ai-chatbot": { title: "AI Chatbots & Virtual Assistants", category: "Core Service", lottie: "/lottie/live-chatbot.json", description: "Intelligent conversational interfaces that support customers and drive sales. Human-level interaction to scale your support indefinitely.", descBg: "bg-slate-200" },
        "workflow-automation": { title: "Agentic Workflow Automation", category: "Core Service", lottie: "/lottie/automatic.json", description: "Eliminate manual operational bottlenecks with intelligent, end-to-end automated workflows that adapt to unexpected changes.", descBg: "bg-orange-100" },
        "saas": { title: "SaaS Product Development", category: "Core Service", lottie: "/lottie/saas.json", description: "From architecture to deployment, we build scalable Software-as-a-Service platforms designed for massive parallel tenant usage.", descBg: "bg-slate-200" },
        "api-microservices": { title: "API & Microservices Development", category: "Core Service", lottie: "/lottie/3d-web.json", description: "Robust backend systems and APIs to connect and power your digital ecosystem, built with high availability in mind.", descBg: "bg-orange-100" },
        "business-intelligence": { title: "Business Intelligence Dashboards", category: "Core Service", lottie: "/lottie/bpo-3d.json", description: "Actionable insights through beautiful, real-time data visualization platforms. Turn raw data sets into executive-ready dashboards.", descBg: "bg-slate-200" },
        "ui-ux-design": { title: "UI/UX & Product Design", category: "Core Service", lottie: "/lottie/uxui-d.json", description: "User-centric design that creates intuitive and engaging digital experiences, deeply rooted in human psychology and research.", descBg: "bg-orange-100" },
        "cloud-migration": { title: "Cloud Migration & Management", category: "Core Service", lottie: "/lottie/cloud-animation.json", description: "Secure, efficient transition to cloud infrastructure with ongoing optimization, reducing your cloud spend while boosting availability.", descBg: "bg-slate-200" },
    };

    const service = serviceDataMap[slug] || {
        title: "Service Not Found",
        category: "Unknown",
        lottie: "/lottie/cloud.json", // Fallback animation, removed globe as requested
        description: "The requested service could not be found.",
        descBg: "bg-slate-100"
    };

    return (
        <main className="relative w-full min-h-screen pt-24 pb-20 overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-6">

                {/* 1. Hero Introduction */}
                <Link href="/services" className="inline-flex items-center gap-2 text-slate-500 hover:text-orange-600 font-medium text-sm transition-colors mb-8">
                    <ArrowLeft className="w-4 h-4" /> Back to Services
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20 items-center">
                    <div className="text-center lg:text-left">
                        <span className="text-orange-600 font-bold tracking-widest text-[10px] md:text-xs uppercase bg-orange-100/50 px-3 py-1.5 rounded-full inline-block mb-6">
                            {service.category}
                        </span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-tight mb-6 md:mb-8">
                            {service.title}
                        </h1>
                        <p className="text-slate-600 text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            {service.description}
                        </p>
                    </div>
                    <div className={`relative ${service.descBg} rounded-[2.5rem] p-4 flex items-center justify-center h-[350px] md:h-[500px] shadow-sm`}>
                        <LottiePlayer src={service.lottie} className="w-[80%] h-[80%]" />
                    </div>
                </div>

                {/* 2. What the service is */}
                <section className="mb-24 max-w-4xl mx-auto text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">What this service is</h2>
                    <p className="text-slate-600 leading-relaxed text-base md:text-lg px-4 md:px-0">
                        This service is a comprehensive engineering partnership designed to solve your most complex digital challenges. We don't just deliver code; we deliver highly resilient, scalable systems tailored to integrate seamlessly with your existing infrastructure. By leveraging cutting-edge development paradigms and architectural best practices, we ensure your resulting platforms are robust, future-proof, and designed to perform exceptionally well under intense operational loads.
                    </p>
                </section>

                {/* 3. Deliverables */}
                <section className="mb-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 md:mb-10 text-center md:text-left">Key Deliverables</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {[
                            { title: "Architecture Blueprints", desc: "Detailed system diagrams, data flow representations, and scaling matrices.", icon: LayoutTemplate },
                            { title: "Production Code", desc: "Clean, documented, and fully tested source code repository.", icon: Layers },
                            { title: "Infrastructure Configs", desc: "IaC pipelines, Dockerfiles, and CI/CD workflows ready for deployment.", icon: Cpu }
                        ].map((del, i) => (
                            <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)]">
                                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                                    <del.icon className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-slate-900 text-xl mb-3">{del.title}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{del.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. Development Process */}
                <section className="mb-24 bg-orange-600 text-white rounded-[3rem] p-8 md:p-12 lg:p-16 relative overflow-hidden shadow-xl">
                    {/* Background abstract */}
                    <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full opacity-20 pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(circle at 100% 0%, #ffffff 0%, transparent 50%)' }}></div>

                    <h2 className="text-2xl md:text-3xl font-bold mb-10 md:mb-12 relative z-10 text-center md:text-left">Our Development Process</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 relative z-10">
                        {[
                            { num: "01", title: "Discovery & Arch", desc: "Mapping the requirements, drawing boundaries, and designing the schemas." },
                            { num: "02", title: "Sprints & Dev", desc: "Two-week agile coding cycles with frequent artifact delivery." },
                            { num: "03", title: "QA & Pen-Tests", desc: "Rigorous automated testing, manual QA, and security audits." },
                            { num: "04", title: "Go-Live & Support", desc: "Zero-downtime deployment and continuous SLA support." }
                        ].map((step, i) => (
                            <div key={i} className="relative">
                                <div className="text-5xl md:text-6xl font-black text-white/20 mb-3 text-center md:text-left">{step.num}</div>
                                <h3 className="font-bold text-lg md:text-xl text-white mb-2 text-center md:text-left">{step.title}</h3>
                                <p className="text-orange-100 text-sm md:text-base leading-relaxed text-center md:text-left">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 5. Use Cases & 6. Tech Stack Side-by-Side */}
                <section className="mb-24 grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Use Cases */}
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 md:mb-8 text-center md:text-left">Primary Use Cases</h2>
                        <ul className="space-y-4">
                            {[
                                "Modernizing legacy on-premise monolithic applications.",
                                "Building high-concurrency fintech data platforms.",
                                "Automating repetitive Tier 1 support via autonomous LLM agents.",
                                "Creating custom enterprise resource planning (ERP) workflows."
                            ].map((uc, i) => (
                                <li key={i} className="flex items-start gap-4">
                                    <CheckCircle2 className="w-6 h-6 shrink-0 text-orange-500 mt-0.5" />
                                    <span className="text-slate-700 leading-relaxed font-medium">{uc}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Tech Stack */}
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 md:mb-8 text-center md:text-left">Related Tech Stack</h2>
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                            {["React", "Next.js", "Node.js", "Python", "Rust", "PostgreSQL", "MongoDB", "Redis", "AWS", "Google Cloud", "Docker", "Kubernetes", "OpenAI"].map((tech, i) => (
                                <span key={i} className="px-4 py-2 border border-slate-200 rounded-full text-slate-600 bg-slate-50 font-bold text-sm shadow-sm transition-all hover:border-orange-300 hover:text-orange-600">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="mb-24">
                    <div className="text-center mb-10 md:mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 md:mb-4">Pricing Engagements</h2>
                        <p className="text-slate-600 text-sm md:text-base px-4">Scalable models depending on your exact requirements.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-lg md:max-w-none mx-auto">
                        {[
                            { name: "Starter", price: "10K - 20K BDT", desc: "For straightforward MVPs and core foundational setups." },
                            { name: "Growth", price: "20K - 30K BDT", desc: "For scaling platforms requiring complex integrations.", highlighted: true },
                            { name: "Enterprise", price: "30K - 50K BDT", desc: "Mission-critical architectures with SLAs and dedicated teams." }
                        ].map((tier, i) => (
                            <div key={i} className={`p-8 rounded-[2rem] border ${tier.highlighted ? "bg-slate-900 text-white border-slate-800 shadow-xl transform md:-translate-y-2" : "bg-white border-slate-200 text-slate-900 shadow-sm"}`}>
                                <h3 className={`text-xl font-bold mb-2 ${tier.highlighted ? "text-white" : "text-slate-900"}`}>{tier.name}</h3>
                                <div className="text-3xl font-black mb-4">{tier.price}</div>
                                <p className={`text-sm leading-relaxed mb-6 ${tier.highlighted ? "text-slate-300" : "text-slate-600"}`}>{tier.desc}</p>
                                <Link href="/contact" className={`block text-center w-full py-3 rounded-full font-bold transition-all ${tier.highlighted ? "bg-orange-500 hover:bg-orange-400 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-900"}`}>
                                    Get a Quote
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 8. Case Study Teaser */}
                <section className="mb-24 bg-orange-50 border border-orange-100 rounded-[3rem] p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center gap-10">
                    <div className="w-full md:w-1/3 aspect-square bg-orange-500 rounded-[2.5rem] flex items-center justify-center text-7xl font-black text-white/20 relative overflow-hidden shadow-xl">
                        <div className="absolute inset-0 bg-[url('/img/placeholder-abstract.jpg')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
                        C
                    </div>
                    <div className="w-full md:w-2/3 text-center md:text-left">
                        <span className="text-orange-600 font-bold tracking-widest text-[10px] md:text-xs uppercase mb-3 block">Featured Case Study</span>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Transforming logistics with agentic workflows</h2>
                        <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6 md:mb-8">
                            See how we helped a global logistics firm reduce manual processing errors by 98% and increase parallel routing efficiency using custom LLM agents and {service.title.toLowerCase()}.
                        </p>
                        <Link href="/work/logichain-automation" className="inline-flex items-center justify-center md:justify-start gap-2 bg-slate-900 text-white px-8 py-3.5 md:py-4 rounded-full font-bold text-sm md:text-base hover:bg-orange-600 transition-colors shadow-md w-full sm:w-auto">
                            Read the Case Study <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </section>

                {/* 9. FAQ */}
                <section className="mb-24 max-w-4xl mx-auto px-2 md:px-0">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 md:mb-10 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        {[
                            { q: "How quickly can we start the project?", a: "Once the Statement of Work (SOW) is signed, we usually kick off the discovery phase within 3-5 business days." },
                            { q: "Who owns the intellectual property?", a: "Upon final payment, all custom code, designs, and architectural blueprints become your exclusive intellectual property." },
                            { q: "Do you offer post-launch support and maintenance?", a: "Yes, every custom project comes with a 1-month warranty, and we offer dedicated Service Level Agreements (SLAs) for ongoing monitoring and updates." }
                        ].map((faq, i) => (
                            <div key={i} className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
                                <h3 className="font-bold text-lg text-slate-900 mb-3">{faq.q}</h3>
                                <p className="text-slate-600">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 10. CTA */}
                <section className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-[3rem] p-8 md:p-12 lg:p-16 text-center text-white shadow-xl relative overflow-hidden mx-2 md:mx-0">
                    <div className="absolute inset-0 bg-white/10 blur-[50px] mix-blend-overlay"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">Ready to engineer your future?</h2>
                        <p className="text-white/90 text-sm md:text-lg lg:text-xl max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed">
                            Let's get on a brief discovery call to see if JANTRA's engineering team is the right fit to execute your vision.
                        </p>
                        <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-6 md:px-10 py-4 md:py-5 rounded-full font-bold hover:bg-slate-800 transition-all shadow-[0_10px_30px_-10px_rgba(15,23,42,0.8)] active:scale-95 text-sm md:text-lg w-full sm:w-auto">
                            <Send className="w-5 h-5" /> Start completely free consultation
                        </Link>
                    </div>
                </section>

            </div>
        </main>
    );
}
