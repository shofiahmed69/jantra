import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronRight, BarChart } from "lucide-react";

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    // In a real app, this would fetch data based on slug. 
    // We use static mock data here to showcase the PRD requirements.
    const project = {
        title: "FinEdge Analytics",
        client: "FinEdge Partners",
        category: "Fintech Web App",
        timeline: "4 Months",
        heroImage: "bg-slate-200",
        logo: "F",
        overview: "FinEdge required a complete overhaul of their legacy data processing tools to handle high-frequency trading analytics. JANTRA delivered a real-time web application capable of processing millions of transactions with zero perceivable latency.",
        challenge: "The primary bottleneck was the existing system's inability to scale concurrently. The monolithic architecture caused frequent timeouts during market opening hours, leading to significant trading delays.",
        approach: "We decoupled the entire monolithic structure into microservices, utilizing a high-performance vector database combined with WebSocket connections to stream data instantly to the React frontend.",
        features: [
            "Real-time WebSocket data streaming",
            "Custom WebGL charts for rendering 100k+ data points",
            "Role-based access control (RBAC)",
            "Automated reporting engine"
        ],
        techStack: ["React", "Node.js", "WebSockets", "TimescaleDB", "Redis"],
        results: [
            { label: "Latency Reduction", value: "94%" },
            { label: "Concurrent Users", value: "50,000+" },
            { label: "System Uptime", value: "99.999%" }
        ],
        testimonial: {
            quote: "JANTRA entirely transformed our chaotic backend logic into a streamlined, high-performance microservices architecture. The new system handles our peak loads without breaking a sweat.",
            author: "Sarah Jenkins",
            role: "CTO, FinEdge"
        }
    };

    return (
        <main className="relative w-full min-h-screen pt-24 pb-20 overflow-x-hidden">
            <div className="max-w-4xl mx-auto px-6">

                <Link href="/work" className="inline-flex items-center gap-2 text-slate-500 hover:text-orange-600 font-medium text-sm transition-colors mb-8">
                    <ArrowLeft className="w-4 h-4" /> Back to Portfolio
                </Link>

                {/* Hero Section */}
                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-orange-600 font-bold tracking-widest text-[10px] md:text-xs uppercase bg-orange-100/50 px-3 py-1.5 rounded-full inline-block">
                            {project.category}
                        </span>
                        <span className="text-slate-400 text-sm font-medium">{project.timeline}</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
                        {project.title}
                    </h1>
                </header>

                <div className={`w-full aspect-[21/9] ${project.heroImage} rounded-3xl mb-16 flex items-center justify-center relative overflow-hidden shadow-sm`}>
                    <div className="text-[12rem] md:text-[20rem] font-black text-slate-900/5 leading-none absolute select-none">
                        {project.logo}
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">

                    {/* Main Content (Left) */}
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Project Overview</h2>
                            <p className="text-slate-600 leading-relaxed text-lg">{project.overview}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">The Challenge</h2>
                            <p className="text-slate-600 leading-relaxed">{project.challenge}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Approach</h2>
                            <p className="text-slate-600 leading-relaxed">{project.approach}</p>
                        </section>

                        <section className="bg-slate-50 rounded-[2rem] p-8 md:p-10 border border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <CheckCircle2 className="w-6 h-6 text-orange-500" /> Features Built
                            </h2>
                            <ul className="space-y-4">
                                {project.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0"></div>
                                        <span className="text-slate-700 font-medium">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    {/* Sidebar (Right) */}
                    <div className="space-y-10">
                        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)]">
                            <h3 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-xs block">Technology Stack</h3>
                            <div className="flex flex-wrap gap-2">
                                {project.techStack.map((tech, i) => (
                                    <span key={i} className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200/50">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-xs block flex items-center gap-2">
                                <BarChart className="w-4 h-4 text-orange-500" /> Metrics & Results
                            </h3>
                            <div className="space-y-4">
                                {project.results.map((res, i) => (
                                    <div key={i} className="border-b border-slate-200 pb-4 last:border-0">
                                        <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400 mb-1">
                                            {res.value}
                                        </div>
                                        <div className="text-sm font-medium text-slate-500">{res.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Testimonial Section */}
                <section className="mt-16 md:mt-24 pt-16 border-t border-slate-200 pb-16">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="flex justify-center gap-1 text-orange-400 mb-6">
                            {[...Array(5)].map((_, j) => <svg key={j} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 italic mb-8 leading-snug">
                            "{project.testimonial.quote}"
                        </h2>
                        <div className="flex flex-col items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600 mb-3 shadow-inner">
                                {project.testimonial.author.charAt(0)}
                            </div>
                            <h4 className="font-bold text-slate-900">{project.testimonial.author}</h4>
                            <p className="text-sm text-slate-500">{project.testimonial.role}</p>
                        </div>
                    </div>
                </section>

                {/* Next Project Nav */}
                <div className="mt-10 border-t border-slate-200 pt-8 flex justify-between items-center">
                    <Link href="/work" className="text-slate-500 hover:text-slate-900 font-medium transition-colors text-sm md:text-base">
                        View All Projects
                    </Link>
                    <Link href="/work/healthsync-mobile" className="flex items-center gap-2 font-bold text-orange-600 hover:text-orange-700 transition-colors text-sm md:text-base group">
                        Next Case Study <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </main>
    );
}
