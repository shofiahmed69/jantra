import Link from "next/link";
import { ArrowRight, Clock, User } from "lucide-react";

export default function BlogPage() {
    const featuredPost = {
        title: "The Future of Agentic Workflows in Enterprise Architecture",
        slug: "future-of-agentic-workflows",
        excerpt: "Why static pipelines are dead and how LLM-driven agents are revolutionizing internal operations.",
        category: "Engineering",
        readTime: "8 min read",
        author: "Alex Mercer",
        date: "Oct 24, 2024",
        imgColor: "bg-slate-800"
    };

    const posts = [
        {
            title: "Scaling PostgreSQL for 1M Concurrent Writes",
            slug: "scaling-postgresql-1m-writes",
            excerpt: "A deep dive into our caching, sharding, and connection pooling strategy for high-frequency platforms.",
            category: "Architecture",
            readTime: "12 min read",
            author: "Sarah Jenkins",
            date: "Oct 15, 2024",
            imgColor: "bg-blue-100"
        },
        {
            title: "Why We Chose Rust for the Nexus 3D Engine",
            slug: "why-rust-nexus-engine",
            excerpt: "Memory safety guarantees and zero-cost abstractions made Rust the only viable choice for our spatial computing engine.",
            category: "Web & Systems",
            readTime: "6 min read",
            author: "David Chen",
            date: "Oct 02, 2024",
            imgColor: "bg-orange-100"
        },
        {
            title: "Designing AI Interfaces: Beyond the Chat Window",
            slug: "designing-ai-interfaces",
            excerpt: "Conversational UI is just the beginning. How to design predictive interfaces that anticipate user needs.",
            category: "UI/UX",
            readTime: "5 min read",
            author: "Amanda Royce",
            date: "Sep 28, 2024",
            imgColor: "bg-emerald-100"
        },
        {
            title: "Securing Microservices in Zero-Trust Environments",
            slug: "securing-microservices",
            excerpt: "Implementing strict mTLS, scoped JWTs, and dynamic secret injection in Kubernetes.",
            category: "Security",
            readTime: "9 min read",
            author: "Michael Chang",
            date: "Sep 15, 2024",
            imgColor: "bg-purple-100"
        }
    ];

    return (
        <main className="relative w-full min-h-screen pt-32 pb-24 overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <header className="mb-16 md:mb-24 text-center max-w-3xl mx-auto">
                    <span className="text-orange-600 font-bold tracking-widest text-xs uppercase mb-4 block">Insights</span>
                    <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
                        Dispatches from the <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">frontlines of tech.</span>
                    </h1>
                    <p className="text-slate-600 text-lg leading-relaxed">
                        Deep technical dives, architectural patterns, and product philosophies from the JANTRA engineering team.
                    </p>
                </header>

                {/* Category Filters */}
                <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-20">
                    {["All Topics", "Engineering", "Architecture", "UI/UX", "Security", "AI & ML"].map((cat, i) => (
                        <button key={i} className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${i === 0
                            ? "bg-slate-900 text-white shadow-md hover:bg-orange-600"
                            : "bg-white border border-slate-200 text-slate-600 hover:border-orange-500 hover:text-orange-600 shadow-sm"
                            }`}>
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Featured Post */}
                <section className="mb-20">
                    <Link href={`/blog/${featuredPost.slug}`} className="group block focus:outline-none">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 bg-white rounded-[3rem] p-6 md:p-8 lg:p-12 border border-slate-200 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-15px_rgba(249,115,22,0.15)] transition-all duration-500">

                            <div className={`w-full h-[300px] lg:h-full min-h-[400px] ${featuredPost.imgColor} rounded-[2rem] relative overflow-hidden flex items-center justify-center`}>
                                <div className="text-9xl text-white/5 font-black uppercase tracking-tighter mix-blend-overlay">FEATURED</div>
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>

                            <div className="flex flex-col justify-center">
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md">
                                        {featuredPost.category}
                                    </span>
                                    <span className="text-slate-400 text-sm font-medium">{featuredPost.date}</span>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-6 group-hover:text-orange-600 transition-colors">
                                    {featuredPost.title}
                                </h2>
                                <p className="text-slate-600 text-lg leading-relaxed mb-8">
                                    {featuredPost.excerpt}
                                </p>
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm">
                                            {featuredPost.author.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">{featuredPost.author}</p>
                                            <div className="flex items-center gap-1 text-slate-500 text-xs">
                                                <Clock className="w-3 h-3" /> {featuredPost.readTime}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-orange-500 group-hover:border-orange-500 group-hover:text-white text-slate-400 transition-all shadow-sm">
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </section>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-12">
                    {posts.map((post, i) => (
                        <Link key={i} href={`/blog/${post.slug}`} className="group block focus:outline-none bg-white rounded-[2rem] p-6 md:p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className={`w-full aspect-[16/9] ${post.imgColor} rounded-2xl mb-8 relative overflow-hidden flex items-center justify-center`}>
                                <div className="text-6xl text-slate-900/5 font-black uppercase tracking-tighter">ARTICLE</div>
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-orange-600 text-xs font-bold uppercase tracking-wider">
                                    {post.category}
                                </span>
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 leading-snug mb-4 group-hover:text-orange-600 transition-colors">
                                {post.title}
                            </h3>

                            <p className="text-slate-600 leading-relaxed mb-8 line-clamp-2">
                                {post.excerpt}
                            </p>

                            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                                        {post.author.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-xs md:text-sm">{post.author}</p>
                                        <p className="text-slate-400 text-xs">{post.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-slate-500 text-xs font-medium bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                    <Clock className="w-3.5 h-3.5" /> {post.readTime}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Newsletter CTA */}
                <section className="mt-32 max-w-4xl mx-auto bg-orange-50 rounded-[3rem] p-8 md:p-12 lg:p-16 text-center border border-orange-100/50">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Never miss an insight.</h2>
                    <p className="text-slate-600 mb-8">
                        Join 10,000+ engineers and product leaders receiving our monthly deep-dives. No fluff, just pure engineering.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-lg mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your work email"
                            className="px-6 py-4 rounded-full border border-slate-200 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full outline-none shadow-sm transition-all"
                        />
                        <button className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-orange-600 transition-all shadow-md active:scale-95 whitespace-nowrap">
                            Subscribe
                        </button>
                    </div>
                </section>

            </div>
        </main>
    );
}
