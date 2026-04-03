"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Sparkles, MessageSquare } from "lucide-react";
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
                // Merge static posts if API is empty or as additional data
                const merged = Array.isArray(apiData) && apiData.length > 0 
                  ? apiData.map((ap: any) => {
                      const local = staticPosts.find(sp => sp.slug === ap.slug);
                      return { ...local, ...ap };
                    })
                  : staticPosts as unknown as BlogPost[];
                setPosts(merged);
            } catch (error) {
                console.error("Failed to fetch posts, using fallback", error);
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
        <main className="relative w-full min-h-screen bg-white overflow-hidden pb-32">
            <div className="absolute top-[5%] left-0 w-full overflow-hidden opacity-[0.03] pointer-events-none select-none z-0">
                <div className="flex whitespace-nowrap animate-marquee-slow">
                    <span className="text-[12rem] font-black tracking-tighter leading-none mr-24 uppercase">INSIGHTS. PERSPECTIVES. DISCOURSE. INNOVATION.</span>
                </div>
            </div>

            <div className="max-w-[1540px] mx-auto px-6 sm:px-12 pt-28 sm:pt-36 relative z-10">
                <div className="grid lg:grid-cols-12 gap-12 items-start mb-12">
                    
                    {/* LEFT SIDEBAR HERO */}
                    <div className="lg:col-span-3 space-y-12 sticky top-36">
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-[2px] bg-orange-500" />
                                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-orange-600">Discourse Archive</span>
                            </div>
                            <h1 className="text-5xl sm:text-6xl font-black text-slate-900 leading-[0.85] tracking-tighter uppercase whitespace-nowrap">
                                Studio <br />
                                <span className="text-transparent" style={{ WebkitTextStroke: "1px #0f172a" }}>Insights</span>
                                <span className="text-orange-500">.</span>
                            </h1>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed border-l-2 border-slate-100 pl-6">
                                Professional analysis on the intersection of engineering and elite digital design.
                            </p>
                        </div>

                        {/* CATEGORY FILTER */}
                        <div className="space-y-6">
                             <div className="flex items-center gap-3">
                                <Sparkles className="w-3 h-3 text-orange-500" />
                                <span className="text-[10px] font-black uppercase tracking-[.4em] text-slate-400">All Topics</span>
                             </div>
                             <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setFilter(cat)}
                                        className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                            filter === cat 
                                            ? "bg-slate-950 text-white shadow-2xl" 
                                            : "bg-slate-50 text-slate-400 border border-slate-200 hover:bg-white hover:text-slate-950"
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                             </div>
                        </div>

                        <div className="p-8 rounded-[3rem] bg-slate-50 border border-slate-200 space-y-6">
                             <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-tighter flex items-center gap-3">
                                <MessageSquare className="w-4 h-4" /> Subscribe for Updates
                             </p>
                             <div className="flex gap-2">
                                <input type="email" placeholder="email@address.com" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[10px] uppercase font-black tracking-widest focus:ring-1 focus:ring-orange-500 outline-none" />
                             </div>
                             <button className="w-full py-4 rounded-xl bg-orange-600 text-white text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-950 transition-all shadow-xl active:scale-95">
                                Notify Me <ArrowRight className="w-3 h-3" />
                             </button>
                        </div>
                    </div>

                    {/* BLOG GRID — COMPACT EDITORIAL */}
                    <div className="lg:col-span-9">
                        {loading ? (
                            <div className="py-32 text-center flex flex-col items-center gap-6">
                                <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.5em]">Syncing Archive...</p>
                            </div>
                        ) : filteredPosts.length === 0 ? (
                            <div className="py-32 text-center p-20 bg-slate-50 rounded-[3rem] border border-slate-200">
                                <p className="text-slate-400 italic">No insights found in this category.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredPosts.map((post, i) => {
                                    const imgUrl = getPostImage(post);
                                    return (
                                        <motion.div 
                                            key={post.id}
                                            whileHover={{ y: -6 }}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="group relative flex flex-col rounded-[3.5rem] bg-slate-50 border border-slate-100 p-4 transition-all duration-700 hover:bg-white hover:border-slate-200"
                                        >
                                            <div className="absolute inset-x-20 -bottom-5 h-20 bg-orange-500/10 blur-[70px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                            
                                            <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden bg-slate-200 mb-6 group-hover:shadow-xl transition-all duration-700">
                                                 {imgUrl ? (
                                                     <img 
                                                        src={imgUrl} 
                                                        alt={post.title} 
                                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                     />
                                                 ) : (
                                                     <div className="w-full h-full flex items-center justify-center bg-slate-900">
                                                         <span className="text-white/10 font-black text-6xl">JANTRA</span>
                                                     </div>
                                                 )}
                                                 <div className="absolute top-4 left-4">
                                                      <div className="px-4 py-2 rounded-full bg-white/90 backdrop-blur-md text-[8px] font-black uppercase tracking-widest text-slate-900 shadow-sm border border-white/20">
                                                          {post.category}
                                                      </div>
                                                 </div>
                                            </div>

                                            <div className="px-4 pb-4 space-y-3 relative z-10 text-left">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">
                                                       {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                                    <span className="text-[8px] font-black text-orange-600 uppercase tracking-widest">Article</span>
                                                </div>
                                                <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none group-hover:text-orange-600 transition-colors uppercase line-clamp-3">
                                                    {post.title}
                                                </h3>
                                                <p className="text-[12px] text-slate-500 font-medium leading-relaxed line-clamp-2">
                                                    {post.excerpt}
                                                </p>
                                            </div>

                                            <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-20" />
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
