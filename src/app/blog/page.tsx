import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { getAllPosts, getFeaturedPost } from "@/data/blogPosts";

export default function BlogPage() {
    const featuredPost = getFeaturedPost();
    const posts = getAllPosts();

    if (!featuredPost) return null;

    const defaultGradient = "bg-gradient-to-br from-slate-700 via-slate-800 to-orange-900";

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

                            <div className={`w-full h-[300px] lg:h-full min-h-[400px] ${defaultGradient} rounded-[2rem] relative overflow-hidden flex items-center justify-center`}>
                                <div className="text-9xl text-white/5 font-black uppercase tracking-tighter mix-blend-overlay">FEATURED</div>
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>

                            <div className="flex flex-col justify-center">
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md">
                                        {featuredPost.category}
                                    </span>
                                    <span className="text-slate-400 text-sm font-medium">{featuredPost.publishedAt}</span>
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
                                            {featuredPost.author.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">{featuredPost.author.name}</p>
                                            <div className="flex items-center gap-1 text-slate-500 text-xs">
                                                <Clock className="w-3 h-3" /> {featuredPost.readTime} min read
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
                            <div className={`w-full aspect-[16/9] ${defaultGradient} rounded-2xl mb-8 relative overflow-hidden flex items-center justify-center`}>
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
                                        {post.author.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-xs md:text-sm">{post.author.name}</p>
                                        <p className="text-slate-400 text-xs">{post.publishedAt}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-slate-500 text-xs font-medium bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                    <Clock className="w-3.5 h-3.5" /> {post.readTime} min read
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </main>
    );
}
