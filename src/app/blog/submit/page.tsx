"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

export default function SubmitBlogPage() {
    const [formData, setFormData] = useState({
        title: "",
        excerpt: "",
        content: "",
        category: "Technology",
        authorId: "11111111-1111-1111-1111-111111111111", // Placeholder or fetch from session if available
        readTime: 5
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus("idle");
        setErrorMessage("");

        try {
            await api.post("/blog/submit", formData);
            setStatus("success");
        } catch (error: any) {
            console.error("Submission error:", error);
            setStatus("error");
            setErrorMessage(error.response?.data?.error || "Failed to submit post. Please check all fields.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative w-full min-h-screen pt-32 pb-24 bg-slate-50">
            <div className="max-w-3xl mx-auto px-6">
                <Link href="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-orange-600 mb-8 font-medium transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Blog
                </Link>

                <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden">
                    <div className="bg-slate-900 p-10 text-white">
                        <h1 className="text-3xl font-bold mb-4">Submit a Guest Post</h1>
                        <p className="text-slate-400">Share your expertise with the JONTRO community. All submissions are reviewed by our editorial team before publishing.</p>
                    </div>

                    <div className="p-10">
                        {status === "success" ? (
                            <div className="py-12 text-center animate-in zoom-in duration-300">
                                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-10 h-10" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Submission Received!</h2>
                                <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                                    Thank you for your contribution. Our team will review your post and notify you if it's selected for publishing.
                                </p>
                                <Link
                                    href="/blog"
                                    className="inline-block px-8 py-3 bg-slate-900 text-white rounded-full font-bold hover:bg-orange-600 transition-colors"
                                >
                                    Return to Blog
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {status === "error" && (
                                    <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm animate-in slide-in-from-top-2">
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        <p className="font-medium">{errorMessage}</p>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Article Title</label>
                                    <input
                                        required
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="E.g., The Future of AI in Enterprise Scoping"
                                        className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-300 focus:bg-white transition-all text-slate-800 font-medium"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Category</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-300 focus:bg-white transition-all text-slate-800 font-medium appearance-none"
                                        >
                                            <option>Technology</option>
                                            <option>Engineering</option>
                                            <option>Design</option>
                                            <option>Business</option>
                                            <option>AI & Data</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Est. Read Time (Mins)</label>
                                        <input
                                            required
                                            type="number"
                                            name="readTime"
                                            value={formData.readTime}
                                            onChange={handleChange}
                                            min={1}
                                            className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-300 focus:bg-white transition-all text-slate-800 font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Short Excerpt</label>
                                    <textarea
                                        required
                                        name="excerpt"
                                        value={formData.excerpt}
                                        onChange={handleChange}
                                        rows={2}
                                        placeholder="A brief summary that hooks the reader..."
                                        className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-300 focus:bg-white transition-all text-slate-800 resize-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Full Content (Markdown Supported)</label>
                                    <textarea
                                        required
                                        name="content"
                                        value={formData.content}
                                        onChange={handleChange}
                                        rows={12}
                                        placeholder="Write your article here..."
                                        className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-300 focus:bg-white transition-all text-slate-800 resize-none font-mono text-sm"
                                    />
                                </div>

                                <button
                                    disabled={loading}
                                    type="submit"
                                    className="w-full py-5 rounded-2xl font-bold text-white bg-slate-900 hover:bg-orange-600 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-70 active:scale-[0.98]"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-6 h-6 animate-spin" /> Submitting for Review...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" /> Submit Post
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
