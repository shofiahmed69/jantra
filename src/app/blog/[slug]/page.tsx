import Link from "next/link";
import { ArrowLeft, Clock, Share2, Twitter, Linkedin, Github, User, Binary, Sparkles } from "lucide-react";
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
        <main className="relative w-full min-h-screen bg-white overflow-hidden pb-40">
            {/* ── BACKGROUND MONIKER ── */}
            <div className="absolute top-[5%] left-[-5%] w-[110%] overflow-hidden opacity-[0.02] pointer-events-none select-none z-0">
                <div className="flex whitespace-nowrap animate-marquee-slow">
                    <span className="text-[18rem] font-black tracking-tighter leading-none mr-24 uppercase">SIGNAL. DISPATCH. INSIGHT. ARCHIVE.</span>
                </div>
            </div>

            {/* ── CINEMATIC HEADER ── */}
            <header className="relative pt-32 sm:pt-48 pb-20 sm:pb-32 px-6 sm:px-12 bg-slate-950 text-white overflow-hidden">
                <div className="absolute inset-x-20 -bottom-20 h-64 bg-orange-500/20 blur-[150px] rounded-full opacity-40" />
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                
                <div className="max-w-5xl mx-auto relative z-10">
                    <Link href="/blog" className="inline-flex items-center gap-3 text-white/40 hover:text-orange-500 font-bold uppercase tracking-[0.4em] text-[10px] transition-all mb-12 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Archive
                    </Link>

                    <div className="space-y-8">
                        <div className="flex flex-wrap items-center gap-6">
                            <div className="flex items-center gap-3">
                                <Binary className="w-4 h-4 text-orange-500" />
                                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60">{post.category}</span>
                            </div>
                            <div className="h-4 w-[1px] bg-white/10" />
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{post.publishedAt}</span>
                            <div className="h-4 w-[1px] bg-white/10" />
                            <span className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-widest">
                                <Clock className="w-3.5 h-3.5 text-orange-500" /> {post.readTime || 5}M READ
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9] max-w-4xl">
                            {post.title}
                        </h1>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 pt-10 border-t border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                                    <User className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-black uppercase tracking-tight text-white">{post.author.name}</span>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/30 leading-none">{post.author.role || "Primary Architect"}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-orange-500 transition-all group">
                                    <Twitter className="w-4 h-4" />
                                </button>
                                <button className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#0077b5] transition-all">
                                    <Linkedin className="w-4 h-4" />
                                </button>
                                <button className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-slate-800 transition-all">
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── CONTENT STAGE ── */}
            <div className="relative z-20 -mt-20 max-w-5xl mx-auto px-6 sm:px-12">
                <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl p-10 sm:p-20 overflow-hidden relative">
                    {/* Atmospheric Glow inside white card */}
                    <div className="absolute inset-x-20 -bottom-10 h-40 bg-orange-500/5 blur-[80px] rounded-full pointer-events-none" />

                    <article className="prose prose-slate prose-lg lg:prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-slate-900 prose-p:text-slate-500 prose-p:leading-relaxed prose-a:text-orange-600 hover:prose-a:text-orange-700 prose-img:rounded-[2.5rem] prose-img:shadow-2xl prose-blockquote:border-orange-500 prose-blockquote:bg-slate-50 prose-blockquote:p-8 prose-blockquote:rounded-3xl prose-blockquote:not-italic prose-blockquote:font-medium prose-blockquote:text-slate-700">
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </article>

                    {/* Author Bio Ledger */}
                    <footer className="mt-24 pt-16 border-t border-slate-100 flex flex-col md:flex-row items-center gap-12">
                        <div className="w-32 h-32 rounded-3xl bg-slate-950 flex items-center justify-center text-white shrink-0 shadow-2xl relative overflow-hidden group">
                           <div className="absolute inset-0 bg-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                           <User className="w-12 h-12 relative z-10" />
                        </div>
                        <div className="space-y-4 text-center md:text-left">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{post.author.name}</h3>
                                <div className="h-2 w-2 rounded-full bg-orange-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">{post.author.role}</span>
                            </div>
                            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl">
                                Engineering and product lead at JANTRA. Dedicated to architecting the infrastructure for the next generation of digital sovereignty.
                            </p>
                            <div className="flex justify-center md:justify-start gap-3 pt-4">
                                <a href="#" className="p-3 bg-slate-50 rounded-xl hover:bg-slate-950 hover:text-white transition-all"><Twitter className="w-4 h-4" /></a>
                                <a href="#" className="p-3 bg-slate-50 rounded-xl hover:bg-slate-950 hover:text-white transition-all"><Linkedin className="w-4 h-4" /></a>
                                <a href="#" className="p-3 bg-slate-50 rounded-xl hover:bg-slate-950 hover:text-white transition-all"><Github className="w-4 h-4" /></a>
                            </div>
                        </div>
                    </footer>
                </div>

                {/* ── CONTEXTUAL CTA ── */}
                <div className="mt-20 relative overflow-hidden rounded-[4rem] bg-orange-600 p-10 sm:p-20 text-center">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white opacity-10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
                    <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 rounded-full border border-white/10">
                            <Sparkles className="w-3.5 h-3.5 text-white" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Protocol Activation</span>
                        </div>
                        <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter leading-[0.9] uppercase">
                            Ready to <br /> Implement?
                        </h2>
                        <p className="text-orange-100 text-lg font-medium opacity-80">
                            Consult with our architects to deploy this framework for your enterprise operations.
                        </p>
                        <Link href="/contact" className="inline-flex items-center gap-4 px-12 py-5 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-slate-900 hover:text-white transition-all shadow-2xl group">
                            Start Consultation <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <Link href="/blog" className="text-[10px] font-black text-slate-400 hover:text-orange-600 uppercase tracking-[0.5em] transition-all">
                        ← RETURN TO ARCHIVE
                    </Link>
                </div>
            </div>
        </main>
    );
}
