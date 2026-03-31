"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import {
    Plus,
    Edit3,
    Trash2,
    Loader2,
    X,
    ExternalLink,
    Github
} from "lucide-react";

interface Project {
    id: string;
    title: string;
    slug: string;
    client: string;
    thumbnail?: string;
    liveUrl?: string;
    githubUrl?: string;
    category: string[];
    published: boolean;
    featured: boolean;
    createdAt: string;
}

export default function WorkManagementPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState("");
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        client: "",
        categories: "",
        challenge: "",
        approach: "",
        features: "",
        techStack: "",
        results: "",
        liveUrl: "",
        githubUrl: "",
        thumbnail: "",
        featured: false,
        published: true
    });

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const response = await api.get("/admin/work/admin/all");
            setProjects(response.data.data || []);
        } catch (error) {
            console.error("Failed to fetch projects", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => setImagePreview(ev.target?.result as string);
        reader.readAsDataURL(file);
    };

    const uploadImage = async (): Promise<string | null> => {
        if (!imageFile) return null;
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("image", imageFile);
            const token =
                localStorage.getItem("token") ||
                localStorage.getItem("adminToken");
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "https://jontro-backend.onrender.com/api"}/admin/work/upload-image`,
                {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: fd,
                }
            );
            const data = await response.json();
            return data.url;
        } catch (error) {
            console.error("Upload failed:", error);
            return null;
        } finally {
            setUploading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: "", client: "", categories: "", challenge: "",
            approach: "", features: "", techStack: "", results: "",
            liveUrl: "", githubUrl: "", thumbnail: "",
            featured: false, published: true,
        });
        setImageFile(null);
        setImagePreview("");
        setEditingId(null);
    };

    const handleEdit = async (project: Project) => {
        try {
            const response = await api.get(`/work/${project.slug}`);
            const p = response.data.data || project;
            setFormData({
                title: p.title || "",
                client: p.client || "",
                categories: (p.category || []).join(", "),
                challenge: p.challenge || "",
                approach: p.approach || "",
                features: (p.features || []).join("\n"),
                techStack: (p.techStack || []).join(", "),
                results: p.results || "",
                liveUrl: p.liveUrl || "",
                githubUrl: p.githubUrl || "",
                thumbnail: p.thumbnail || "",
                featured: p.featured || false,
                published: p.published || false,
            });
            if (p.thumbnail) setImagePreview(p.thumbnail);
            setEditingId(p.id);
            setModalOpen(true);
        } catch {
            setFormData({
                title: project.title || "",
                client: project.client || "",
                categories: (project.category || []).join(", "),
                challenge: "", approach: "", features: "", techStack: "", results: "",
                liveUrl: project.liveUrl || "",
                githubUrl: project.githubUrl || "",
                thumbnail: project.thumbnail || "",
                featured: project.featured || false,
                published: project.published || false,
            });
            if (project.thumbnail) setImagePreview(project.thumbnail);
            setEditingId(project.id);
            setModalOpen(true);
        }
    };

    const handleSaveProject = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            let thumbnailUrl = formData.thumbnail;
            if (imageFile) {
                const uploadedUrl = await uploadImage();
                if (uploadedUrl) thumbnailUrl = uploadedUrl;
            }

            const payload = {
                ...formData,
                thumbnail: thumbnailUrl,
                category: formData.categories
                    .split(",")
                    .map((c) => c.trim())
                    .filter(Boolean),
                features: formData.features.split("\n").filter(Boolean),
                techStack: formData.techStack
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
            };

            let response;
            if (editingId) {
                response = await api.put(`/admin/work/${editingId}`, payload);
            } else {
                response = await api.post("/admin/work", payload);
            }

            if (response.data.success) {
                setModalOpen(false);
                fetchProjects();
                resetForm();
            }
        } catch (error) {
            console.error("Save project error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this project?")) return;
        try {
            await api.delete(`/admin/work/${id}`);
            fetchProjects();
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const handleTogglePublish = async (id: string) => {
        try {
            await api.patch(`/admin/work/${id}/publish`);
            fetchProjects();
        } catch (error) {
            console.error("Toggle publish error:", error);
        }
    };

    const inputClassName = "w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all";

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Portfolio Management</h2>
                    <p className="text-sm text-slate-500">Manage and showcase your best engineering work.</p>
                </div>

                <button
                    onClick={() => { resetForm(); setModalOpen(true); }}
                    className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg active:scale-95 text-sm"
                >
                    <Plus className="w-4 h-4" /> Add New Project
                </button>
            </header>

            <div className="glass-panel overflow-hidden border-white/60 shadow-xl rounded-[2.5rem]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/20 bg-slate-900/5">
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Project Title</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Client</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Categories</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Links</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center">
                                        <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : projects.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center text-slate-400 text-sm">
                                        No projects found. Time to showcase your work!
                                    </td>
                                </tr>
                            ) : (
                                projects.map((project) => (
                                    <tr key={project.id} className="hover:bg-white/40 transition-colors group">
                                        <td className="px-8 py-6 max-w-xs">
                                            <div className="flex items-center gap-3">
                                                {project.thumbnail ? (
                                                    <img src={project.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white font-bold text-sm">
                                                        {project.title.charAt(0)}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm truncate">{project.title}</p>
                                                    {project.featured && (
                                                        <span className="text-[8px] font-bold bg-orange-500 text-white px-1.5 py-0.5 rounded uppercase tracking-tighter">Featured</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-xs text-slate-600 font-medium">{project.client}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-wrap gap-1">
                                                {project.category.slice(0, 2).map((cat, i) => (
                                                    <span key={i} className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 font-medium whitespace-nowrap">{cat}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                {project.liveUrl && (
                                                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700">
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                )}
                                                {project.githubUrl && (
                                                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-700">
                                                        <Github className="w-4 h-4" />
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <button
                                                onClick={() => handleTogglePublish(project.id)}
                                                className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest transition-colors ${project.published ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                                                {project.published ? 'Live' : 'Draft'}
                                            </button>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(project)}
                                                    className="p-2 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-blue-600 shadow-sm border border-transparent hover:border-blue-100"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(project.id)}
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
            </div>

            {/* Add Project Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between px-8 py-6 bg-slate-50 border-b border-slate-100">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">{editingId ? "Edit Project" : "Add New Project"}</h3>
                                <p className="text-xs text-slate-500">{editingId ? "Update the project details." : "Fill in the details to showcase your work."}</p>
                            </div>
                            <button
                                onClick={() => { setModalOpen(false); resetForm(); }}
                                className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-6">
                            <form id="project-form" onSubmit={handleSaveProject} className="space-y-5">

                                {/* Project Image Upload */}
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1 block mb-2">Project Image</label>
                                    <div
                                        className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-orange-400 transition cursor-pointer"
                                        onClick={() => document.getElementById("img-upload")?.click()}
                                    >
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg mb-2" />
                                        ) : (
                                            <div className="py-6">
                                                <div className="text-4xl mb-2">🖼️</div>
                                                <p className="text-slate-500 text-sm">Click to upload project image</p>
                                                <p className="text-slate-400 text-xs">PNG, JPG up to 5MB</p>
                                            </div>
                                        )}
                                        <input
                                            id="img-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageSelect}
                                        />
                                    </div>
                                    {imagePreview && (
                                        <button
                                            type="button"
                                            onClick={() => { setImageFile(null); setImagePreview(""); }}
                                            className="text-red-500 text-xs mt-1"
                                        >
                                            Remove image
                                        </button>
                                    )}
                                </div>

                                {/* Or paste image URL */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Or paste image URL</label>
                                    <input
                                        type="url"
                                        placeholder="https://example.com/image.jpg"
                                        value={formData.thumbnail}
                                        onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                                        className={inputClassName}
                                    />
                                </div>

                                {/* Project Title */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Project Title *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. NexaFlow CRM"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className={inputClassName}
                                    />
                                </div>

                                {/* Client */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Client</label>
                                    <input
                                        type="text"
                                        placeholder="Company Name"
                                        value={formData.client}
                                        onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                        className={inputClassName}
                                    />
                                </div>

                                {/* Categories */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Categories (comma separated)</label>
                                    <input
                                        type="text"
                                        placeholder="Web, SaaS, AI"
                                        value={formData.categories}
                                        onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
                                        className={inputClassName}
                                    />
                                </div>

                                {/* Tech Stack */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Tech Stack (comma separated)</label>
                                    <input
                                        type="text"
                                        placeholder="React, Node.js, PostgreSQL"
                                        value={formData.techStack}
                                        onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                                        className={inputClassName}
                                    />
                                </div>

                                {/* Live URL */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Live Project URL</label>
                                    <input
                                        type="url"
                                        placeholder="https://yourproject.com"
                                        value={formData.liveUrl}
                                        onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                                        className={inputClassName}
                                    />
                                </div>

                                {/* GitHub URL */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">GitHub URL (optional)</label>
                                    <input
                                        type="url"
                                        placeholder="https://github.com/yourrepo"
                                        value={formData.githubUrl}
                                        onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                                        className={inputClassName}
                                    />
                                </div>

                                {/* Challenge */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Challenge</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Describe the problem..."
                                        value={formData.challenge}
                                        onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                                        className={inputClassName + " resize-none"}
                                    />
                                </div>

                                {/* Approach */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Approach</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Describe your solution..."
                                        value={formData.approach}
                                        onChange={(e) => setFormData({ ...formData, approach: e.target.value })}
                                        className={inputClassName + " resize-none"}
                                    />
                                </div>

                                {/* Features */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Features (one per line)</label>
                                    <textarea
                                        rows={4}
                                        placeholder={"Real-time dashboard\nAI integration\nMobile responsive"}
                                        value={formData.features}
                                        onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                        className={inputClassName + " resize-none"}
                                    />
                                </div>

                                {/* Results */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Results</label>
                                    <textarea
                                        rows={2}
                                        placeholder="50% increase in efficiency..."
                                        value={formData.results}
                                        onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                                        className={inputClassName + " resize-none"}
                                    />
                                </div>

                                {/* Checkboxes */}
                                <div className="flex items-center gap-6 p-2">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={formData.featured}
                                            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                            className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300"
                                        />
                                        <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Mark as Featured</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={formData.published}
                                            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                                            className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300"
                                        />
                                        <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Publish Directly</span>
                                    </label>
                                </div>
                            </form>
                        </div>

                        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                            <button
                                onClick={() => { setModalOpen(false); resetForm(); }}
                                className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-white transition-all border border-transparent hover:border-slate-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="project-form"
                                disabled={isSubmitting || uploading || !formData.title}
                                className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg active:scale-95 text-sm disabled:opacity-50 disabled:pointer-events-none"
                            >
                                {isSubmitting || uploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        {uploading ? "Uploading..." : (editingId ? "Updating..." : "Saving...")}
                                    </>
                                ) : (
                                    editingId ? "Update Project" : "Save Project"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
