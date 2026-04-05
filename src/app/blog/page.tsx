"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Sparkles, MessageSquare, BookOpen } from "lucide-react";
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
        <main className="relative w-full min-h-screen bg-white pb-32">
            {/* ── BACKGROUND ACCENT [DESKTOP ONLY] ── */}
            <div className="hidden lg:block absolute top-[5%] left-0 w-full overflow-hidden opacity-[0.02] pointer-events-none select-none z-0">
                <div className="flex whitespace-nowrap animate-marquee-slow">
                    <span className="text-[12rem] font-black tracking-tighter leading-none mr-24 uppercase">INSIGHTS. PERSPECTIVES. DISCOURSE. INNOVATION.</span>
                </div>
            </div>

            <div className="max-w-[1540px] mx-auto px-4 sm:px-12 pt-24 sm:pt-36 relative z-10">
                
                {/* ── HEADER SECTION ── */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 sm:mb-20">
                    <div className="space-y-4 sm:space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-[2px] bg-orange-500" />
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-orange-600">Discourse Archive</span>
                        </div>
                        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-slate-900 leading-[0.85] tracking-tighter uppercase">
                            Studio <br />
                            <span className="text-transparent" style={{ WebkitTextStroke: "1px #0f172a" }}>Insights</span>
                            <span className="text-orange-500">.</span>
                        </h1>
                    </div>

                    {/* CATEGORY NAV - PREMIUM PILLS */}
                    <div className="w-full lg:w-auto -mx-5 px-5 lg:mx-0 lg:px-0 relative">
                        <div className="flex lg:flex-wrap gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-none relative z-10">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={`whitespace-nowrap px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                                        filter === cat 
                                        ? "bg-slate-950 text-white shadow-xl shadow-slate-900/10 scale-105" 
                                        : "bg-slate-50 text-slate-400 border border-slate-100 hover:bg-white hover:text-slate-950 hover:border-slate-300"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── MAIN CONTENT GRID ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* LEFT SIDEBAR [DESKTOP ONLY] */}
                    <div className="hidden lg:block lg:col-span-3 sticky top-36 h-fit space-y-10">
                        <div className="p-10 rounded-[3rem] bg-orange-50/50 border border-orange-100/50 space-y-8 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[50px] rounded-full" />
                             <p className="text-[14px] font-black text-slate-900 leading-relaxed uppercase tracking-tight relative z-10">Subscribe to our engineering discourse.</p>
                             <div className="space-y-3 relative z-10">
                                 <input type="email" placeholder="YOUR@EMAIL.COM" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-4 text-[9px] font-black uppercase tracking-widest focus:ring-1 focus:ring-orange-500 outline-none" />
                                 <button className="w-full py-5 rounded-2xl bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-orange-600 transition-all shadow-xl active:scale-95">
                                    Notify Me <ArrowRight className="w-4 h-4" />
                                 </button>
                             </div>
                        </div>
                    </div>

                    {/* BLOG GRID - 2 COLUMN ON ALL SCREENS */}
                    <div className="lg:col-span-9">
                        {loading ? (
                            <div className="py-40 text-center flex flex-col items-center gap-6">
                                <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Populating Archive...</p>
                            </div>
                        ) : filteredPosts.length === 0 ? (
                            <div className="py-40 text-center p-20 bg-slate-50 rounded-[3rem] border border-slate-200">
                                <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">No insights in <span className="text-orange-600">{filter}</span> category yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-10">
                                {filteredPosts.map((post, i) => {
                                    const imgUrl = getPostImage(post);
                                    return (
                                        <motion.div 
                                             key={post.id}
                                             layout
                                             initial={{ opacity: 0, y: 20 }}
                                             animate={{ opacity: 1, y: 0 }}
                                             transition={{ delay: i * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                             className="group relative flex flex-col transition-all duration-700 h-full"
                                         >
                                             {/* IMAGE TILE */}
                                             <div className="relative aspect-square sm:aspect-[17/10] rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden bg-slate-100 border border-slate-100/50 mb-4 sm:mb-6 group-hover:shadow-xl transition-all duration-700">
                                                 {imgUrl ? (
                                                     <img 
                                                        src={imgUrl} 
                                                        alt={post.title} 
                                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                     />
                                                 ) : (
                                                     <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white/10">
                                                          <BookOpen className="w-12 h-12" />
                                                     </div>
                                                 )}
                                                 
                                                 {/* TAG */}
                                                 <div className="absolute top-4 left-4 z-20">
                                                     <span className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[7px] font-black uppercase tracking-widest text-slate-900 border border-white/50">{post.category}</span>
                                                 </div>
                                             </div>

                                             {/* CONTENT AREA */}
                                             <div className="px-1 sm:px-4 text-left flex-1 flex flex-col">
                                                 <div className="flex items-center gap-2 mb-2">
                                                     <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest">
                                                        {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                     </span>
                                                     <div className="h-[1px] flex-1 bg-slate-100" />
                                                 </div>
                                                 <h3 className="text-sm sm:text-2xl font-black text-slate-900 tracking-tighter leading-tight uppercase mb-2 sm:mb-4 group-hover:text-orange-600 transition-colors line-clamp-3">
                                                     {post.title}
                                                 </h3>
                                                 <p className="hidden sm:block text-[11px] sm:text-[13px] text-slate-500 font-medium leading-tight mb-4 flex-1">
                                                     {post.excerpt}
                                                 </p>
                                                 <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-[8px] sm:text-[10px] font-black text-slate-950 uppercase tracking-widest mt-auto">
                                                     Read Post <ArrowRight className="w-3 h-3 text-orange-500" />
                                                 </Link>
                                             </div>

                                             <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-30" />
                                         </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .scrollbar-none::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-none {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </main>
    );
}
