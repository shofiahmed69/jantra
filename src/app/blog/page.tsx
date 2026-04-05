"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, BookOpen } from "lucide-react";
import api from "@/lib/api";
import { blogPosts as staticPosts } from "@/data/blogPosts";
import { motion } from "framer-motion";

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

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get("/blog");
                const apiData = response.data?.data || response.data || [];
                const merged = Array.isArray(apiData) && apiData.length > 0 
                  ? apiData.map((ap: any) => {
                      const local = staticPosts.find(sp => sp.slug === ap.slug);
                      return { ...local, ...ap };
                    })
                  : staticPosts as unknown as BlogPost[];
                setPosts(merged);
            } catch (error) {
                setPosts(staticPosts as unknown as BlogPost[]);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const filteredPosts = filter === "All" ? posts : posts.filter(p => p.category === filter);

    const getPostImage = (p: BlogPost) => {
        if (!p.image) return null;
        if (p.image.startsWith('http')) return p.image;
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/api$/, '');
        const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        const cleanPath = p.image.startsWith('/') ? p.image : `/${p.image}`;
        return `${cleanBase}${cleanPath}`;
    };

    return (
        <main className="w-full min-h-screen bg-white pb-32">
            
            <div className="max-w-[1280px] mx-auto px-6 sm:px-12 pt-28 sm:pt-40">
                
                {/* ── HEADER ── */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20 sm:mb-32">
                    <div className="max-w-2xl text-left">
                        <span className="text-orange-600 font-bold tracking-widest text-xs uppercase mb-6 block">INSIGHTS Archive</span>
                        <h1 className="text-5xl sm:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter uppercase mb-8">
                            Studio <br /> Insights <span className="text-orange-500">.</span>
                        </h1>
                        <p className="text-slate-500 text-lg font-medium leading-relaxed uppercase tracking-tight">Professional analysis on elite industrial design.</p>
                    </div>

                    <div className="flex lg:flex-wrap gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-none">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`whitespace-nowrap px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                                    filter === cat 
                                    ? "bg-slate-950 text-white shadow-xl" 
                                    : "bg-slate-50 text-slate-400 border border-slate-100 hover:bg-white hover:text-slate-950 hover:border-slate-300"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── CLEAN BLOG GRID: 1-COL MOBILE, 2-COL DESKTOP ── */}
                {loading ? (
                    <div className="py-20 text-center flex flex-col items-center gap-6">
                        <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Populating Insights...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 sm:gap-20">
                        {filteredPosts.map((post, i) => {
                            const imgUrl = getPostImage(post);
                            return (
                                <motion.div 
                                    key={post.id}
                                    layout
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group relative flex flex-col transition-all duration-700 h-full"
                                >
                                    {/* IMAGE HERO */}
                                    <div className="relative aspect-video rounded-[2.5rem] sm:rounded-[4rem] overflow-hidden bg-slate-50 border border-slate-100 mb-8 sm:mb-10 group-hover:shadow-2xl transition-all duration-700">
                                        {imgUrl ? (
                                            <img 
                                                src={imgUrl} 
                                                alt={post.title} 
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                                                 <BookOpen className="w-16 h-16" />
                                            </div>
                                        )}
                                        
                                        <div className="absolute top-8 left-8">
                                             <span className="px-6 py-2.5 rounded-full bg-white/90 backdrop-blur-md text-[9px] font-black uppercase tracking-widest text-slate-950 shadow-sm border border-white/50">{post.category}</span>
                                        </div>
                                    </div>

                                    {/* CONTENT */}
                                    <div className="px-4 space-y-4 text-left">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-[1px] bg-slate-200" />
                                            <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                        <h3 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tighter uppercase leading-none group-hover:text-orange-600 transition-colors">{post.title}</h3>
                                        <p className="text-slate-500 text-sm sm:text-lg font-medium leading-relaxed line-clamp-2 uppercase tracking-tight">{post.excerpt}</p>
                                        <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-4 text-[10px] sm:text-xs font-black text-slate-950 uppercase tracking-widest pt-4 group-hover:translate-x-2 transition-transform">
                                            Read Archive <ArrowRight className="w-5 h-5 text-orange-600" />
                                        </Link>
                                    </div>
                                    <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-30" />
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* ── NEWSLETTER BOX ── */}
                <div className="mt-32 p-12 sm:p-20 rounded-[4rem] bg-slate-950 text-white flex flex-col md:flex-row items-center justify-between gap-12">
                     <div className="space-y-4 text-center md:text-left">
                         <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">Stay Logged In.</h2>
                         <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-sm uppercase tracking-tight">Our squad operates across time zones to investigate future tech.</p>
                     </div>
                     <div className="flex w-full md:w-auto gap-3">
                         <input type="email" placeholder="YOUR@EMAIL.NET" className="flex-1 md:w-64 bg-white/5 border border-white/10 rounded-2xl px-6 font-black text-[10px] uppercase text-white outline-none focus:border-orange-500 transition-all placeholder:text-white/20" />
                         <button className="px-10 py-6 rounded-2xl bg-orange-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-950 transition-all shadow-xl active:scale-95">
                            Notify <ArrowRight className="w-4 h-4 ml-2" />
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
