"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import {
    Plus,
    Search,
    Edit3,
    Trash2,
    Eye,
    Briefcase,
    Globe,
    ChevronLeft,
    ChevronRight,
    Loader2
} from "lucide-react";

interface Project {
    id: string;
    title: string;
    client: string;
    category: string[];
    published: boolean;
    featured: boolean;
    createdAt: string;
}

export default function WorkManagementPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const response = await api.get("/work/admin", {
                params: { page, limit: 10 }
            });
            setProjects(response.data.projects || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error("Failed to fetch projects", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [page]);

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Portfolio Management</h2>
                    <p className="text-sm text-slate-500">Manage and showcase your best engineering work.</p>
                </div>

                <button className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg active:scale-95 text-sm">
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
                                        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
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
                                                {project.category.length > 2 && <span className="text-[10px] text-slate-400">+{project.category.length - 2}</span>}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest ${project.published ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
                                                }`}>
                                                {project.published ? 'Live' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <button className="p-2 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-blue-600 shadow-sm border border-transparent hover:border-blue-100">
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-red-500 shadow-sm border border-transparent hover:border-red-100">
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
        </div>
    );
}
