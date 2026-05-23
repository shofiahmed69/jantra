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
        <main className="w-full min-h-screen bg-slate-50/50 pb-20">
            
            <div className="max-w-[1280px] mx-auto px-4 sm:px-8 pt-28 sm:pt-36">
                
                {/* ── HEADER ── */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 text-left border-b border-slate-100 pb-8">
                    <div className="max-w-2xl">
                        <span className="text-orange-600 font-bold tracking-widest text-[10px] uppercase mb-2 block">INSIGHTS Archive</span>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight uppercase mb-3">
                            Studio Insights<span className="text-orange-500">.</span>
                        </h1>
                        <p className="text-slate-500 text-sm font-medium tracking-tight">Professional analysis on elite industrial design.</p>
                    </div>

                    <div className="flex lg:flex-wrap gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`whitespace-nowrap px-5 py-2 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all duration-300 ${
                                    filter === cat 
                                    ? "bg-slate-950 text-white shadow-md shadow-slate-950/10" 
                                    : "bg-white text-slate-500 border border-slate-200/80 hover:bg-slate-50 hover:text-slate-950 hover:border-slate-300"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── CLEAN BLOG GRID: 3-COL DESKTOP ── */}
                {loading ? (
                    <div className="py-20 text-center flex flex-col items-center gap-6">
                        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Populating Insights...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {filteredPosts.map((post, i) => {
                            const imgUrl = getPostImage(post);
                            return (
                                <motion.article 
                                    key={post.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="group flex flex-col bg-white border border-slate-100 rounded-2xl p-4 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-900/5 transition-all duration-500 h-full"
                                    onMouseEnter={() => prefetchPost(post)}
                                    onTouchStart={() => prefetchPost(post)}
                                >
                                    <Link href={`/blog/${post.slug}`} prefetch className="flex flex-col h-full">
                                    {/* IMAGE HERO */}
                                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-50 border border-slate-100 mb-5 group-hover:shadow-sm transition-all duration-500">
                                        {imgUrl ? (
                                            <Image
                                                src={imgUrl}
                                                alt={post.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                priority={i < 6}
                                                className="object-cover transition-transform duration-750 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                                                 <BookOpen className="w-10 h-10" />
                                            </div>
                                        )}
                                        
                                        <div className="absolute top-4 left-4">
                                             <span className="px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[8px] font-extrabold uppercase tracking-widest text-slate-950 shadow-sm border border-white/50">{post.category}</span>
                                        </div>
                                    </div>

                                    {/* CONTENT */}
                                    <div className="space-y-3 flex-1 flex flex-col justify-between">
                                        <div className="space-y-2 text-left">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-[1px] bg-slate-200" />
                                                <span className="text-[9px] font-bold text-orange-600 uppercase tracking-widest">{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight uppercase leading-tight group-hover:text-orange-600 transition-colors">{post.title}</h3>
                                            <p className="text-slate-500 text-xs font-normal leading-relaxed line-clamp-3 normal-case tracking-normal">{post.excerpt}</p>
                                        </div>
                                        
                                        <div className="pt-4 border-t border-slate-50">
                                            <span className="inline-flex items-center gap-2 text-[9px] font-bold text-slate-950 uppercase tracking-widest group-hover:text-orange-600 transition-colors">
                                                Read Archive <ArrowRight className="w-3.5 h-3.5 text-orange-600 group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        </div>
                                    </div>
                                    </Link>
                                </motion.article>
                            );
                        })}
                    </div>
                )}

                {/* ── NEWSLETTER BOX ── */}
                <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-slate-950 text-white flex flex-col md:flex-row items-center justify-between gap-8">
                     <div className="space-y-2 text-center md:text-left">
                          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase">Stay Logged In.</h2>
                          <p className="text-slate-400 text-xs sm:text-sm font-medium tracking-tight uppercase">Our team publishes regular updates on software engineering and technology.</p>
                     </div>
                     <div className="flex w-full md:w-auto gap-3">
                          <input type="email" placeholder="YOUR@EMAIL.NET" className="flex-1 md:w-64 bg-white/5 border border-white/10 rounded-xl px-5 py-4 font-bold text-[9px] uppercase text-white outline-none focus:border-orange-500 transition-all placeholder:text-white/20" />
                          <button className="px-6 py-4 rounded-xl bg-orange-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-slate-950 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2">
                             Notify <ArrowRight className="w-3.5 h-3.5" />
                          </button>
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
