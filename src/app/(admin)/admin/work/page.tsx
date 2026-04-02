"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import {
    Plus,
    Edit3,
    Trash2,
    Loader2,
    X,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

interface Project {
    id: string;
    title: string;
    slug: string;
    client: string;
    thumbnail?: string;
    category: string[];
    challenge?: string;
    approach?: string;
    features?: string[];
    techStack?: string[];
    results?: string;
    published: boolean;
    featured: boolean;
    createdAt: string;
}

const AVAILABLE_CATEGORIES = ["Web", "Mobile", "AI", "SaaS", "Automation", "Embedded", "Cloud"];

export default function WorkManagementPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [editingId, setEditingId] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        client: "",
        thumbnail: "",
        category: [] as string[],
        challenge: "",
        approach: "",
        features: [] as string[],
        techStack: [] as string[],
        results: "",
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

    const handleAddProject = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingId) {
                await api.put(`/admin/work/${editingId}`, formData);
            } else {
                await api.post("/admin/work", formData);
            }
            setModalOpen(false);
            setEditingId(null);
            fetchProjects();
            setFormData({
                title: "", slug: "", client: "", thumbnail: "",
                category: [], challenge: "", approach: "",
                features: [], techStack: [], results: "",
                featured: false, published: true
            });
        } catch (error) {
            console.error("Save project error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (project: Project) => {
        setFormData({
            title: project.title,
            slug: project.slug,
            client: project.client,
            thumbnail: project.thumbnail || "",
            category: project.category || [],
            challenge: project.challenge || "",
            approach: project.approach || "",
            features: project.features || [],
            techStack: project.techStack || [],
            results: project.results || "",
            featured: project.featured,
            published: project.published
        });
        setEditingId(project.id);
        setModalOpen(true);
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

    const handleToggleFeatured = async (id: string) => {
        try {
            await api.patch(`/admin/work/${id}/featured`);
            fetchProjects();
        } catch (error) {
            console.error("Toggle featured error:", error);
        }
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Portfolio Management</h2>
                    <p className="text-sm text-slate-500">Manage and showcase your best engineering work.</p>
                </div>

                <button
                    onClick={() => {
                        setEditingId(null);
                        setFormData({
                            title: "", slug: "", client: "", thumbnail: "",
                            category: [], challenge: "", approach: "",
                            features: [], techStack: [], results: "",
                            featured: false, published: true
                        });
                        setModalOpen(true);
                    }}
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
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : projects.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400 text-sm">
                                        No projects found. Time to showcase your work!
                                    </td>
                                </tr>
                            ) : (
                                projects.map((project) => (
                                    <tr key={project.id} className="hover:bg-white/40 transition-colors group">
                                        <td className="px-8 py-6 max-w-xs">
                                            <p className="font-bold text-slate-800 text-sm truncate">{project.title}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                {project.featured && (
                                                    <span className="text-[8px] font-bold bg-orange-500 text-white px-1.5 py-0.5 rounded uppercase tracking-tighter">Featured</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-xs text-slate-600 font-medium">
                                                {project.client}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-wrap gap-1">
                                                {project.category.slice(0, 2).map((cat, i) => (
                                                    <span key={i} className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 font-medium whitespace-nowrap">
                                                        {cat}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleTogglePublish(project.id)}
                                                    className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest transition-colors ${project.published ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
                                                        }`}>
                                                    {project.published ? 'Live' : 'Draft'}
                                                </button>
                                                <button
                                                    onClick={() => handleToggleFeatured(project.id)}
                                                    className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest transition-colors ${project.featured ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                                        }`}>
                                                    {project.featured ? 'Featured' : 'Not Featured'}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleEdit(project)} className="p-2 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-blue-600 shadow-sm border border-transparent hover:border-blue-100">
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
                                <p className="text-xs text-slate-500">Fill in the details to showcase your work.</p>
                            </div>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-6">
                            <form id="project-form" onSubmit={handleAddProject} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Project Title*</label>
                                    <input
                                        type="text" required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                        placeholder="e.g. NexaFlow CRM"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Client*</label>
                                    <input
                                        type="text" required
                                        value={formData.client}
                                        onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                        placeholder="Company Name"
                                    />
                                </div>
                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Categories (Select Multiple)</label>
                                    <div className="flex flex-wrap gap-2">
                                        {AVAILABLE_CATEGORIES.map(cat => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => {
                                                    const active = formData.category.includes(cat);
                                                    setFormData({
                                                        ...formData,
                                                        category: active
                                                            ? formData.category.filter(c => c !== cat)
                                                            : [...formData.category, cat]
                                                    });
                                                }}
                                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${formData.category.includes(cat) ? 'bg-orange-500 text-white border-orange-500 shadow-md transform scale-105' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-orange-300'}`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Challenge</label>
                                    <textarea
                                        rows={3}
                                        value={formData.challenge}
                                        onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                        placeholder="Describe the problem..."
                                    />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Approach</label>
                                    <textarea
                                        rows={3}
                                        value={formData.approach}
                                        onChange={(e) => setFormData({ ...formData, approach: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                        placeholder="Describe your solution..."
                                    />
                                </div>
                                <div className="flex items-center gap-6 md:col-span-2 p-2">
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
                                onClick={() => setModalOpen(false)}
                                className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-white transition-all border border-transparent hover:border-slate-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="project-form"
                                disabled={isSubmitting}
                                className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg active:scale-95 text-sm disabled:opacity-50 disabled:pointer-events-none"
                            >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Project"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
