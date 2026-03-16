"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import {
    Search,
    Filter,
    MoreVertical,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    Mail,
    User,
    Calendar,
    MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Lead {
    id: string;
    name: string;
    email: string;
    company?: string;
    country?: string;
    service: string;
    budget?: string;
    description: string;
    status: string;
    createdAt: string;
    referral?: string;
}

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const response = await api.get("/leads/admin", {
                params: { page, limit: 10, search, status }
            });
            setLeads(response.data.leads || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error("Failed to fetch leads", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, [page, status]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchLeads();
    };

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            await api.patch(`/leads/admin/${id}`, { status: newStatus });
            fetchLeads();
            if (selectedLead?.id === id) {
                setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
            }
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const deleteLead = async (leadId: string) => {
        if (!confirm('Are you sure you want to delete this lead?')) return;

        try {
            await api.delete(`/leads/admin/${leadId}`);
            // Remove from local state
            setLeads(leads.filter(lead => lead.id !== leadId));
            alert('Lead deleted successfully');
            if (selectedLead?.id === leadId) {
                setSelectedLead(null);
            }
        } catch (error) {
            alert('Failed to delete lead');
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Lead Intelligence</h2>
                    <p className="text-sm text-slate-500">Manage incoming signals and conversion pipeline.</p>
                </div>

                <div className="flex items-center gap-3">
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-white border-0 glass-panel rounded-2xl pl-11 pr-5 py-2.5 text-sm focus:ring-2 focus:ring-orange-300 w-full sm:w-64 transition-all"
                        />
                    </form>
                    <div className="relative">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="bg-white border-0 glass-panel rounded-2xl pl-11 pr-10 py-2.5 text-sm focus:ring-2 focus:ring-orange-300 appearance-none cursor-pointer"
                        >
                            <option value="">All Status</option>
                            <option value="NEW">New</option>
                            <option value="CONTACTED">Contacted</option>
                            <option value="QUALIFIED">Qualified</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                    </div>
                </div>
            </header>

            {/* Table Section */}
            <div className="glass-panel overflow-hidden border-white/60 shadow-xl rounded-[2.5rem]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/20 bg-slate-900/5">
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Prospect</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Service / Budget</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Signal Date</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {loading && !leads.length ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : leads.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400 text-sm">
                                        No leads matching your current filters.
                                    </td>
                                </tr>
                            ) : (
                                leads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-white/40 transition-colors group cursor-pointer" onClick={() => setSelectedLead(lead)}>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold uppercase text-xs">
                                                    {lead.name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm">{lead.name}</p>
                                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                                        <Mail className="w-3 h-3" /> {lead.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-medium text-slate-700">{lead.service}</p>
                                            <p className="text-xs text-slate-500">{lead.budget || 'Unspecified'}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(lead.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6" onClick={(e) => e.stopPropagation()}>
                                            <select
                                                value={lead.status}
                                                onChange={(e) => updateStatus(lead.id, e.target.value)}
                                                className={cn(
                                                    "text-[10px] font-bold px-3 py-1.5 rounded-full border-0 focus:ring-2 focus:ring-orange-300 appearance-none cursor-pointer",
                                                    lead.status === 'NEW' ? 'bg-orange-100 text-orange-600' :
                                                        lead.status === 'CONTACTED' ? 'bg-blue-100 text-blue-600' :
                                                            lead.status === 'QUALIFIED' ? 'bg-emerald-100 text-emerald-600' :
                                                                'bg-slate-100 text-slate-500'
                                                )}
                                            >
                                                <option value="NEW">NEW</option>
                                                <option value="CONTACTED">CONTACTED</option>
                                                <option value="QUALIFIED">QUALIFIED</option>
                                                <option value="REJECTED">REJECTED</option>
                                            </select>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <button className="p-2 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-orange-600 group-hover:bg-white shadow-sm border border-transparent group-hover:border-slate-100">
                                                    <ExternalLink className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteLead(lead.id);
                                                    }}
                                                    className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition flex items-center gap-1 shadow-sm"
                                                >
                                                    🗑️ Delete
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

            {/* Lead Detail Modal */}
            {selectedLead && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div
                        className="glass-panel w-full max-w-2xl rounded-[3rem] p-8 md:p-12 shadow-2xl relative animate-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedLead(null)}
                            className="absolute right-8 top-8 p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="flex flex-col md:flex-row gap-8 mb-10">
                            <div className="w-20 h-20 rounded-3xl bg-orange-100 flex items-center justify-center text-3xl font-bold text-orange-600 shadow-inner">
                                {selectedLead.name[0]}
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{selectedLead.name}</h2>
                                    <span className={cn(
                                        "text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest",
                                        selectedLead.status === 'NEW' ? 'bg-orange-500 text-white' : 'bg-slate-900 text-white'
                                    )}>
                                        {selectedLead.status}
                                    </span>
                                </div>
                                <p className="text-slate-500 flex items-center gap-2 font-medium">
                                    <Mail className="w-4 h-4 text-orange-500" /> {selectedLead.email}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                            <div className="p-4 rounded-3xl bg-white/40 border border-white/60">
                                <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Company</p>
                                <p className="text-sm font-bold text-slate-800">{selectedLead.company || 'N/A'}</p>
                            </div>
                            <div className="p-4 rounded-3xl bg-white/40 border border-white/60">
                                <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Country</p>
                                <p className="text-sm font-bold text-slate-800">{selectedLead.country || 'N/A'}</p>
                            </div>
                            <div className="p-4 rounded-3xl bg-white/40 border border-white/60">
                                <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Budget</p>
                                <p className="text-sm font-bold text-orange-600">{selectedLead.budget || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="mb-10">
                            <div className="flex items-center gap-2 mb-4">
                                <MessageSquare className="w-4 h-4 text-orange-500" />
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Project Description</h3>
                            </div>
                            <div className="p-6 rounded-[2rem] bg-white/60 border border-white shadow-inner min-h-[120px]">
                                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                                    {selectedLead.description}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-white/30">
                            <p className="text-xs text-slate-400 font-medium italic">
                                Signal received on {new Date(selectedLead.createdAt).toLocaleString()}
                                {selectedLead.referral && ` via ${selectedLead.referral}`}
                            </p>
                            <div className="flex gap-3">
                                <a
                                    href={`mailto:${selectedLead.email}`}
                                    className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-orange-600 transition-all shadow-lg active:scale-95 flex items-center justify-center"
                                >
                                    Send Email
                                </a>
                                <button
                                    onClick={() => updateStatus(selectedLead.id, 'QUALIFIED')}
                                    className="px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-800 font-bold text-sm hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-100 transition-all shadow-sm active:scale-95"
                                >
                                    Mark Qualified
                                </button>
                                <button
                                    onClick={() => deleteLead(selectedLead.id)}
                                    className="px-6 py-3 rounded-2xl bg-white border border-red-200 text-red-600 font-bold text-sm hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all shadow-sm active:scale-95 flex items-center gap-2"
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Backgrop Close Area */}
                    <div className="absolute inset-0 z-[-1]" onClick={() => setSelectedLead(null)} />
                </div>
            )}
        </div>
    );
}
