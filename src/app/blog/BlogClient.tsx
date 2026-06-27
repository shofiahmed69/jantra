"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Loader2, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { PREFETCH_TTL_MS, prefetchStore } from "@/lib/prefetchStore";

interface BlogPost {
    id: string;
    title: string;
    category: string;
    image: string;
    slug: string;
    excerpt: string;
    createdAt: string;
}

const CATEGORIES = ["All", "Engineering", "Design", "Automation", "Strategy", "AI"];

interface BlogClientProps {
    initialPosts: BlogPost[];
}

export default function BlogClient({ initialPosts }: BlogClientProps) {
    const [posts] = useState<BlogPost[]>(initialPosts);
    const [loading] = useState(false);
    const [filter, setFilter] = useState("All");
    const router = useRouter();
    const prefetchedSlugsRef = useRef<Set<string>>(new Set());

    const filteredPosts = filter === "All" ? posts : posts.filter(p => p.category === filter);
    const sortedForPrefetch = useMemo(() => filteredPosts.slice(0, 4), [filteredPosts]);

    const prefetchPost = (post: BlogPost) => {
        if (!post?.slug) return;
        if (prefetchedSlugsRef.current.has(post.slug)) return;

        const key = `blog:${post.slug}`;
        if (!prefetchStore.fresh(key, PREFETCH_TTL_MS)) {
            prefetchStore.set(key, post);
        }
        prefetchStore.set("blog:list", posts);
        prefetchedSlugsRef.current.add(post.slug);
        router.prefetch(`/blog/${post.slug}`);
    };

    useEffect(() => {
        for (const post of sortedForPrefetch) {
            prefetchPost(post);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortedForPrefetch]);

    const getPostImage = (p: BlogPost) => {
        if (!p.image) return null;
        if (p.image.startsWith('http')) return p.image;
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4005').replace(/\/api$/, '');
        const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        const cleanPath = p.image.startsWith('/') ? p.image : `/${p.image}`;
        return `${cleanBase}${cleanPath}`;
    };

    return (
        <main className="w-full min-h-screen bg-[#fcfaf8] pb-20 selection:bg-orange-100 relative overflow-x-hidden">
            {/* Ambient background glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-500/[0.02] blur-[150px] rounded-full -z-20 pointer-events-none" />
            <div className="absolute top-[35%] right-[-10%] w-[600px] h-[600px] bg-amber-500/[0.015] blur-[140px] rounded-full -z-20 pointer-events-none" />

            {/* Clean minimal background grid */}
            <div className="absolute top-0 inset-x-0 h-[700px] overflow-hidden pointer-events-none select-none -z-10 opacity-[0.02] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_80%,transparent_100%)]">
                <div className="w-full h-full bg-[linear-gradient(to_right,#ea580c_1px,transparent_1px),linear-gradient(to_bottom,#ea580c_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            </div>

            <div className="max-w-[1240px] mx-auto px-5 sm:px-8 pt-28 sm:pt-36">
                
                {/* ── HEADER ── */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16 text-left border-b border-slate-200/50 pb-8 relative z-10">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2.5 mb-2.5">
                            <div className="w-4 h-[1.5px] bg-orange-500 rounded-full" />
                            <span className="text-orange-600 font-bold tracking-widest text-[9px] uppercase font-mono">INSIGHTS Archive</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tighter uppercase mb-3">
                            Studio Insights<span className="text-orange-500">.</span>
                        </h1>
                        <p className="text-slate-500 text-xs sm:text-sm font-semibold uppercase tracking-wider">Analysis and updates on software engineering and technology.</p>
                    </div>

                    <div className="flex lg:flex-wrap gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none max-w-full">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all duration-300 ${
                                    filter === cat 
                                    ? "bg-slate-950 text-white border-transparent shadow-md shadow-slate-950/15" 
                                    : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-slate-950 hover:border-slate-300"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── CLEAN BLOG GRID: 3-COL DESKTOP ── */}
                {loading ? (
                    <div className="py-20 text-center flex flex-col items-center gap-6 relative z-10">
                        <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Populating Insights...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                        {filteredPosts.map((post, i) => {
                            const imgUrl = getPostImage(post);
                            
                            const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              const x = e.clientX - rect.left;
                              const y = e.clientY - rect.top;
                              e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
                              e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
                            };

                            return (
                                <motion.article 
                                    key={post.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
                                    onMouseMove={handleMouseMove}
                                    style={{
                                      "--spotlight-color": "rgba(249, 115, 22, 0.12)"
                                    } as React.CSSProperties}
                                    className="group relative flex flex-col justify-between cursor-pointer"
                                    onMouseEnter={() => prefetchPost(post)}
                                    onTouchStart={() => prefetchPost(post)}
                                >
                                    {/* 1. Background offset card layer (Dual layer styling) */}
                                    <div className="absolute inset-0 rounded-2xl border border-orange-500/25 bg-orange-500/[0.03] translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-500 -z-10" />

                                    {/* 2. Foreground main card layer */}
                                    <div className="w-full h-full rounded-2xl bg-white border border-slate-200/90 p-4 flex flex-col justify-between transition-all duration-500 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:border-slate-400 group-hover:shadow-[0_15px_35px_rgba(0,0,0,0.03)] before:absolute before:inset-0 before:bg-[radial-gradient(130px_circle_at_var(--mouse-x,0px)_var(--mouse-y,0px),var(--spotlight-color),transparent)] before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300 before:pointer-events-none before:z-0 overflow-hidden relative">
                                        
                                        <div className="flex flex-col text-left relative z-10">
                                            {/* Image Box - floats directly inside foreground card */}
                                            <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-50 border border-slate-200/40 mb-4 group-hover:shadow-sm transition-all duration-500">
                                                {imgUrl ? (
                                                    <Image
                                                        src={imgUrl}
                                                        alt={post.title}
                                                        fill
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                        priority={i < 6}
                                                        className="object-cover transition-transform duration-750 group-hover:scale-102"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                                                         <BookOpen className="w-10 h-10" />
                                                    </div>
                                                )}
                                                
                                                {/* Floating Category Tag */}
                                                <div className="absolute top-2.5 left-2.5 z-20">
                                                     <span className="px-2.5 py-1 rounded bg-slate-950/90 text-[7.5px] font-black uppercase tracking-widest text-white shadow-sm border border-white/10 font-mono">
                                                         {post.category}
                                                     </span>
                                                </div>
                                            </div>

                                            {/* Details */}
                                            <div className="space-y-1.5 px-0.5">
                                                <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-orange-600 font-mono">
                                                    <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                </div>
                                                <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase leading-snug group-hover:text-orange-600 transition-colors">
                                                    {post.title}
                                                </h3>
                                                {post.excerpt && (
                                                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mt-0.5">
                                                        {post.excerpt}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action link & Footer */}
                                        <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between px-0.5 z-10">
                                            <span className="inline-flex items-center gap-1.5 text-[8.5px] font-black text-slate-950 uppercase tracking-widest group-hover:text-orange-600 transition-colors">
                                                Read Insight <ArrowRight className="w-3.5 h-3.5 text-orange-600 group-hover:translate-x-0.5 transition-transform" />
                                            </span>
                                        </div>
                                        
                                        <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-20" />
                                    </div>
                                </motion.article>
                            );
                        })}
                    </div>
                )}

                {/* ── NEWSLETTER BOX ── */}
                <div className="mt-20 relative group">
                     {/* Dynamic glowing backdrop offset */}
                     <div className="absolute inset-0 rounded-2xl border border-orange-500/25 bg-orange-500/[0.04] translate-x-2.5 translate-y-2.5 group-hover:translate-x-3.5 group-hover:translate-y-3.5 transition-transform duration-500 z-0" />

                     <div className="relative z-10 p-8 sm:p-12 rounded-2xl bg-white border border-slate-200 shadow-[0_12px_40px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden transition-all duration-500 hover:border-orange-500/40 hover:shadow-[0_20px_50px_rgba(255,69,0,0.08)]">
                          {/* Inner light orange ambient glow */}
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/[0.01] via-transparent to-orange-500/[0.01] pointer-events-none" />
                          
                          <div className="space-y-1.5 text-left relative z-10">
                               <span className="text-orange-600 font-bold tracking-widest text-[9.5px] uppercase font-mono">Newsletter Registry</span>
                               <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Stay Logged In.</h2>
                               <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed max-w-md">Our team publishes regular updates on software engineering and technology.</p>
                          </div>
                          
                          <div className="flex w-full md:w-auto gap-3 relative z-10 shrink-0">
                               <input type="email" placeholder="YOUR@EMAIL.NET" className="flex-1 md:w-64 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-[9px] uppercase text-slate-900 outline-none focus:border-orange-500 focus:bg-white transition-all placeholder:text-slate-400" />
                               <button className="px-6 py-3 rounded-xl bg-slate-950 text-white text-[9px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5">
                                  Notify <ArrowRight className="w-3.5 h-3.5" />
                               </button>
                          </div>
                     </div>
                </div>
            </div>

            <style jsx global>{`
                .scrollbar-none::-webkit-scrollbar { display: none; }
                .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </main>
    );
}
