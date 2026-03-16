"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import {
    Plus,
    Search,
    Edit3,
    Trash2,
    Eye,
    CheckCircle,
    X,
    User,
    ChevronDown,
    Loader2,
    Calendar,
    Tag,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

interface Post {
    id: string;
    title: string;
    category: string;
    published: boolean;
    author: {
        name: string;
    };
    authorId: string;
    content: string;
    excerpt: string;
    readTime: number;
    createdAt: string;
}

interface TeamMember {
    id: string;
    name: string;
}

export default function BlogManagementPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [showPostModal, setShowPostModal] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [authors, setAuthors] = useState<TeamMember[]>([]);

    const fetchAuthors = async () => {
        try {
            const response = await api.get("/team");
            setAuthors(response.data || []);
        } catch (error) {
            console.error("Failed to fetch authors", error);
        }
    };

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await api.get("/blog/admin", {
                params: { page, limit: 10 }
            });
            setPosts(response.data.posts || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error("Failed to fetch posts", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async (id: string) => {
        try {
            await api.put(`/blog/${id}`, { published: true });
            fetchPosts();
        } catch (error) {
            alert("Failed to publish post");
        }
    };

    const handleDelete = async (id: string) => {
        setDeletingId(id);
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        try {
            await api.delete(`/blog/${deletingId}`);
            fetchPosts();
        } catch (error) {
            alert("Failed to delete post");
        } finally {
            setDeletingId(null);
        }
    };

    useEffect(() => {
        fetchPosts();
        fetchAuthors();
    }, [page]);

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Content Management</h2>
                    <p className="text-sm text-slate-500">Curate and publish professional insights.</p>
                </div>

                <button
                    onClick={() => { setEditingPost(null); setShowPostModal(true); }}
                    className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg active:scale-95 text-sm"
                >
                    <Plus className="w-4 h-4" /> Create New Post
                </button>
            </header>

            <div className="glass-panel overflow-hidden border-white/60 shadow-xl rounded-[2.5rem]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/20 bg-slate-900/5">
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Article Title</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Category</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Published</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : posts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400 text-sm">
                                        No blog posts created yet. Start typing!
                                    </td>
                                </tr>
                            ) : (
                                posts.map((post) => (
                                    <tr key={post.id} className="hover:bg-white/40 transition-colors group">
                                        <td className="px-8 py-6 max-w-xs text-sm">
                                            <p className="font-bold text-slate-800 truncate">{post.title}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">By {post.author?.name || "JONTRO Team"}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100/50 px-3 py-1.5 rounded-full font-medium">
                                                <Tag className="w-3 h-3 text-orange-500" />
                                                {post.category}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest ${post.published ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
                                                }`}>
                                                {post.published ? 'LIVE' : 'REVIEW'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                {!post.published && (
                                                    <button
                                                        onClick={() => handlePublish(post.id)}
                                                        className="p-2 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-emerald-500 shadow-sm border border-transparent hover:border-emerald-100"
                                                        title="Approve & Publish"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => { setEditingPost(post); setShowPostModal(true); }}
                                                    className="p-2 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-blue-600 shadow-sm border border-transparent hover:border-blue-100"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(post.id)}
                                                    className="p-2 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-red-500 shadow-sm border border-transparent hover:border-red-100"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-8 py-6 bg-slate-900/5 flex items-center justify-between border-t border-white/20">
                    <p className="text-xs text-slate-500 font-medium">
                        Showing page <span className="text-slate-900">{page}</span> of <span className="text-slate-900">{totalPages}</span>
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(prev => Math.max(1, prev - 1))}
                            disabled={page === 1}
                            className="p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-50 hover:bg-orange-50 transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={page === totalPages}
                            className="p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-50 hover:bg-orange-50 transition-all"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
            {/* BlogPost Create/Edit Modal */}
            {showPostModal && (
                <BlogPostModal
                    post={editingPost}
                    authors={authors}
                    onClose={() => setShowPostModal(false)}
                    onSuccess={() => { fetchPosts(); setShowPostModal(false); }}
                />
            )}

            {/* Delete Confirmation Modal */}
            {deletingId && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl p-8 border border-slate-200 text-center animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Trash2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Remove Article?</h3>
                        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                            Once deleted, this post will be removed from the public blog permanently.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeletingId(null)}
                                className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-xs hover:bg-red-600 transition-all shadow-lg shadow-red-200"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function BlogPostModal({ post, authors, onClose, onSuccess }: {
    post: Post | null,
    authors: TeamMember[],
    onClose: () => void,
    onSuccess: () => void
}) {
    const [formData, setFormData] = useState({
        title: post?.title || "",
        category: post?.category || "Technology",
        authorId: post?.authorId || authors[0]?.id || "",
        excerpt: post?.excerpt || "",
        content: post?.content || "",
        readTime: post?.readTime || 5,
        published: post?.published ?? false
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.authorId) {
            alert("Please select or create an author (Team Member) first.");
            return;
        }
        setLoading(true);
        try {
            if (post) {
                await api.put(`/blog/${post.id}`, formData);
            } else {
                await api.post("/blog", formData);
            }
            onSuccess();
        } catch (error: any) {
            alert(error.response?.data?.error || "Failed to save blog post");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm shadow-2xl">
            <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col scale-in-center animate-in duration-300">
                <div className="bg-slate-900 px-8 py-6 flex items-center justify-between text-white shrink-0">
                    <div>
                        <h3 className="text-xl font-bold">{post ? "Edit Insight" : "Draft New Insight"}</h3>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Content Architecture</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full opacity-50 hover:opacity-100 transition-all"><X className="w-5 h-5" /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Article Title</label>
                            <input
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-300 focus:bg-white transition-all text-lg font-bold text-slate-800"
                                placeholder="E.g., The Future of Data Science in 2024"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-300 focus:bg-white transition-all text-sm font-medium"
                                >
                                    <option>Technology</option>
                                    <option>Data Science</option>
                                    <option>AI & Machine Learning</option>
                                    <option>Business</option>
                                    <option>Engineering</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Assign Author</label>
                                <select
                                    required
                                    value={formData.authorId}
                                    onChange={e => setFormData({ ...formData, authorId: e.target.value })}
                                    className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-300 focus:bg-white transition-all text-sm font-medium"
                                >
                                    <option value="" disabled>Select Author</option>
                                    {authors.map(author => (
                                        <option key={author.id} value={author.id}>{author.name}</option>
                                    ))}
                                </select>
                                {authors.length === 0 && (
                                    <p className="text-[10px] text-red-500 font-bold mt-1 ml-4 italic">* No Team Members found. Add one first!</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Read Time (Mins)</label>
                                <input
                                    type="number"
                                    required
                                    min={1}
                                    value={formData.readTime}
                                    onChange={e => setFormData({ ...formData, readTime: parseInt(e.target.value) })}
                                    className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-300 focus:bg-white transition-all text-sm font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Short Excerpt (Hook)</label>
                            <textarea
                                required
                                rows={2}
                                value={formData.excerpt}
                                onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                                className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-300 focus:bg-white transition-all text-sm leading-relaxed text-slate-600"
                                placeholder="A brief summary that hooks the reader..."
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-4">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Main Content (Markdown)</label>
                                <span className="text-[10px] text-slate-400 italic">Supports full markdown formatting</span>
                            </div>
                            <textarea
                                required
                                rows={10}
                                value={formData.content}
                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                                className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-300 focus:bg-white transition-all text-sm font-mono leading-loose text-slate-700"
                                placeholder="# Write your article here..."
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 ml-4">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, published: !formData.published })}
                            className={`w-12 h-6 rounded-full transition-all relative ${formData.published ? 'bg-orange-500' : 'bg-slate-200'}`}
                        >
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ${formData.published ? 'translate-x-6' : ''}`} />
                        </button>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Live Publication Status</span>
                    </div>
                </form>

                <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
                    <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100">Cancel</button>
                    <button
                        disabled={loading}
                        onClick={handleSubmit}
                        className="px-8 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-orange-600 transition-all shadow-xl disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {loading ? "Optimizing..." : post ? "Update Insight" : "Publish Insight"}
                    </button>
                </div>
            </div>
        </div>
    );
}
