import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";

const projects = [
    {
        title: "FinEdge Analytics",
        slug: "finedge-analytics",
        category: "Web",
        description: "A high-performance financial dashboard handling millions of transactions in real-time.",
        bgColor: "bg-slate-200",
        logo: "F",
        tags: ["React", "Node.js", "WebSockets"]
    },
    {
        title: "HealthSync Mobile",
        slug: "healthsync-mobile",
        category: "Mobile",
        description: "Patient management and telemedicine app with end-to-end encryption.",
        bgColor: "bg-orange-100",
        logo: "H",
        tags: ["React Native", "WebRTC", "HIPAA"]
    },
    {
        title: "AutoServe Support Agent",
        slug: "autoserve-agent",
        category: "AI",
        description: "Autonomous customer service LLM agent resolving 80% of tier 1 tickets.",
        bgColor: "bg-slate-800",
        logo: "A",
        textWhite: true,
        tags: ["OpenAI", "Python", "Vector DB"]
    },
    {
        title: "RetailFlow Platform",
        slug: "retailflow-platform",
        category: "SaaS",
        description: "Multi-tenant inventory management system for global retail chains.",
        bgColor: "bg-blue-100",
        logo: "R",
        tags: ["Next.js", "PostgreSQL", "AWS"]
    },
    {
        title: "LogiChain Automation",
        slug: "logichain-automation",
        category: "Automation",
        description: "Agentic workflow automating entire supply chain logistics from warehouse to delivery.",
        bgColor: "bg-emerald-100",
        logo: "L",
        tags: ["Zapier", "Custom Microservices", "IoT"]
    },
    {
        title: "Nexus 3D Engine",
        slug: "nexus-3d-engine",
        category: "Web",
        description: "In-browser spatial computing environment for architectural rendering.",
        bgColor: "bg-purple-100",
        logo: "N",
        tags: ["Three.js", "WebGL", "Rust"]
    }
];

export default function PortfolioPage() {
    return (
        <main className="relative w-full min-h-screen pt-32 pb-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <header className="mb-16 md:mb-24 text-center max-w-3xl mx-auto">
                    <span className="text-orange-600 font-bold tracking-widest text-xs uppercase mb-3 block">Our Work</span>
                    <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6">
                        Building the <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">future of digital</span>.
                    </h1>
                    <p className="text-slate-600 text-lg md:text-xl">
                        Explore our portfolio of cutting-edge solutions across scalable SaaS, autonomous AI, and high-performance applications.
                    </p>
                </header>

                {/* Category Filters */}
                <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-16">
                    {["All Work", "Web", "Mobile", "AI", "SaaS", "Automation"].map((cat, i) => (
                        <button key={i} className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${i === 0
                            ? "bg-slate-900 text-white shadow-md hover:bg-orange-600"
                            : "bg-white border border-slate-200 text-slate-600 hover:border-orange-500 hover:text-orange-600 shadow-sm"
                            }`}>
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, i) => (
                        <Link key={i} href={`/work/${project.slug}`} className="group block focus:outline-none">
                            <div className={`w-full aspect-[4/3] ${project.bgColor} rounded-3xl mb-6 flex items-center justify-center relative overflow-hidden group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] transition-all duration-500`}>
                                <div className={`text-8xl font-black ${project.textWhite ? 'text-white/20' : 'text-slate-900/10'} group-hover:scale-110 transition-transform duration-700`}>
                                    {project.logo}
                                </div>

                                {/* Overlay hover */}
                                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center">
                                    <div className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        View Case Study <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            <div className="md:hidden mt-3 font-bold text-orange-600 flex items-center gap-1 text-sm">
                                View Case Study <ArrowRight className="w-3.5 h-3.5" />
                            </div>

                            <div className="px-2">
                                <div className="flex items-center justify-between mb-2 mt-4">
                                    <span className="text-orange-600 text-xs font-bold uppercase tracking-wider">{project.category}</span>
                                    <div className="flex gap-2">
                                        {project.tags.slice(0, 2).map((tag, t) => (
                                            <span key={t} className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors flex items-center justify-between">
                                    {project.title}
                                </h3>
                                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                                    {project.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-24 bg-orange-50 rounded-[2.5rem] p-8 md:p-12 lg:p-16 text-center border border-orange-100/50">
                    <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-4">Have a project in mind?</h2>
                    <p className="text-slate-600 mb-8 max-w-lg mx-auto">
                        Let's collaborate to build your next big digital product. Our team is ready to deliver.
                    </p>
                    <Link href="/contact" className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-orange-600 transition-colors shadow-lg active:scale-95">
                        Start a Conversation <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </main>
    );
}
