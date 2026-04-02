import Link from "next/link";
import { ArrowLeft, Clock, Share2, Twitter, Linkedin, Github } from "lucide-react";
import { getBlogPostBySlug, getAllPosts } from "@/data/blogPosts";
import { notFound } from "next/navigation";
import api from "@/lib/api";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    let post = null;

    try {
        const response = await api.get("/blog");
        const data = response.data?.posts || response.data?.data || response.data || [];
        if (Array.isArray(data) && data.length > 0) {
            const apiPost = data.find((p: any) => p.slug === slug);
            if (apiPost) {
                const local = getAllPosts().find(l => l.slug === apiPost.slug);
                post = { ...local, ...apiPost, author: local?.author || apiPost.author || { name: 'Admin', role: 'Editor' } };
            } else {
                post = getBlogPostBySlug(slug);
            }
        } else {
            post = getBlogPostBySlug(slug);
        }
    } catch {
        post = getBlogPostBySlug(slug);
    }

    if (!post) {
        notFound();
    }

    return (
        <main className="relative w-full min-h-screen pt-24 pb-24 overflow-x-hidden">
            <div className="max-w-4xl mx-auto px-6">

                <Link href="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-orange-600 font-medium text-sm transition-colors mb-10">
                    <ArrowLeft className="w-4 h-4" /> Back to Blog
                </Link>

                {/* Article Header */}
                <header className="mb-12">
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        <span className="bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md">
                            {post.category}
                        </span>
                        <span className="text-slate-400 text-sm font-medium">{post.publishedAt}</span>
                        <span className="flex items-center gap-1 text-slate-400 text-sm font-medium">
                            <Clock className="w-4 h-4" /> {post.readTime} min read
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight mb-10">
                        {post.title}
                    </h1>

                    <div className="flex items-center justify-between border-y border-slate-200 py-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                                {post.author.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">{post.author.name}</p>
                                <p className="text-sm text-slate-500">{post.author.role}</p>
                            </div>
                        </div>

                        {/* Social Share */}
                        <div className="flex flex-col md:flex-row items-end md:items-center gap-3">
                            <span className="text-xs uppercase tracking-widest text-slate-400 font-bold hidden md:inline-block">Share</span>
                            <div className="flex items-center gap-2">
                                <button className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 hover:bg-[#1DA1F2] hover:text-white flex items-center justify-center transition-colors">
                                    <Twitter className="w-4 h-4" />
                                </button>
                                <button className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 hover:bg-[#0077b5] hover:text-white flex items-center justify-center transition-colors">
                                    <Linkedin className="w-4 h-4" />
                                </button>
                                <button className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 hover:bg-orange-500 hover:text-white flex items-center justify-center transition-colors">
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero Image */}
                <div className="w-full h-64 rounded-2xl bg-gradient-to-br from-slate-700 via-slate-800 to-orange-900 flex items-center justify-center mb-8">
                    <span className="text-white font-black opacity-10 select-none uppercase" style={{ fontSize: '6rem' }}>
                        {post.category}
                    </span>
                </div>

                {/* Article Content */}
                <article className="prose prose-slate prose-lg lg:prose-xl max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-orange-600 hover:prose-a:text-orange-700 prose-img:rounded-2xl">
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </article>

                {/* Author Bio Footer */}
                <div className="mt-20 border-t border-slate-200 pt-16">
                    <div className="bg-slate-50 rounded-3xl p-8 flex flex-col md:flex-row items-center md:items-start gap-6 border border-slate-100">
                        <div className="w-24 h-24 rounded-full bg-slate-300 flex items-center justify-center font-bold text-3xl text-slate-600 shrink-0">
                            {post.author.name.charAt(0)}
                        </div>
                        <div className="text-center md:text-left">
                            <h3 className="text-xl font-bold text-slate-900">{post.author.name}</h3>
                            <p className="text-orange-600 font-medium text-sm mb-4">{post.author.role}</p>
                            <p className="text-slate-600 leading-relaxed mb-4">
                                The engineering and product team at JANTRA. We build world-class digital products and agentic systems.
                            </p>
                            <div className="flex justify-center md:justify-start gap-3">
                                <a href="#" className="text-slate-400 hover:text-orange-600 transition-colors"><Twitter className="w-5 h-5" /></a>
                                <a href="#" className="text-slate-400 hover:text-orange-600 transition-colors"><Linkedin className="w-5 h-5" /></a>
                                <a href="#" className="text-slate-400 hover:text-orange-600 transition-colors"><Github className="w-5 h-5" /></a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Inline CTA */}
                <div className="mt-16 bg-gradient-to-r from-slate-900 to-slate-800 rounded-[2.5rem] p-8 md:p-12 lg:p-16 text-center shadow-xl">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to implement agentic automation?</h2>
                    <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                        Speak with our engineering team to discover how LLM-backed workflows can eliminate your operational bottlenecks.
                    </p>
                    <Link href="/contact" className="inline-block bg-orange-500 hover:bg-orange-400 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg active:scale-95">
                        Consult with an Architect
                    </Link>
                </div>

                {/* Return Nav */}
                <div className="mt-10 pt-8 border-t border-slate-200 text-center">
                    <Link href="/blog" className="text-orange-600 font-bold hover:underline underline-offset-4 transition-all">
                        ← Explore more articles
                    </Link>
                </div>

            </div>
        </main>
    );
}
