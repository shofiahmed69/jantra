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
    MessageSquare,
    Trash2,
    X
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
    phone?: string;
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

            {/* Desktop Table View */}
            <div className="hidden md:block glass-panel overflow-hidden border-white/60 shadow-xl rounded-[2.5rem]">
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
                                            <div className="relative group/status">
                                                <div className={cn(
                                                    "text-[10px] font-bold px-4 py-1.5 rounded-full border border-white/20 shadow-sm flex items-center gap-2",
                                                    lead.status === 'NEW' ? 'bg-orange-500/10 text-orange-600' :
                                                        lead.status === 'CONTACTED' ? 'bg-blue-500/10 text-blue-600' :
                                                            lead.status === 'QUALIFIED' ? 'bg-emerald-500/10 text-emerald-600' :
                                                                'bg-slate-500/10 text-slate-500'
                                                )}>
                                                    <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", 
                                                        lead.status === 'NEW' ? 'bg-orange-500' :
                                                        lead.status === 'CONTACTED' ? 'bg-blue-500' :
                                                        lead.status === 'QUALIFIED' ? 'bg-emerald-500' : 'bg-slate-500'
                                                    )} />
                                                    {lead.status}
                                                </div>
                                                <select
                                                    value={lead.status}
                                                    onChange={(e) => updateStatus(lead.id, e.target.value)}
                                                    className="absolute inset-0 opacity-0 cursor-pointer w-full"
                                                >
                                                    <option value="NEW">NEW</option>
                                                    <option value="CONTACTED">CONTACTED</option>
                                                    <option value="QUALIFIED">QUALIFIED</option>
                                                    <option value="REJECTED">REJECTED</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <button className="p-2 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-blue-600 shadow-sm border border-transparent hover:border-blue-100">
                                                    <ExternalLink className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteLead(lead.id);
                                                    }}
                                                    className="p-2 hover:bg-red-50 rounded-xl transition-all text-slate-400 hover:text-red-500 shadow-sm border border-transparent hover:border-red-100"
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

            {/* Mobile Card View */}
            <div className="block md:hidden space-y-4">
                {loading && !leads.length ? (
                    <div className="flex justify-center py-10">
                        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : leads.length === 0 ? (
                    <p className="text-center text-slate-500 py-10">No leads found.</p>
                ) : (
                    leads.map(lead => (
                        <div key={lead.id} className="glass-panel p-6 rounded-3xl border-white/60 shadow-lg" onClick={() => setSelectedLead(lead)}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold uppercase text-xs">
                                        {lead.name[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">{lead.name}</h3>
                                        <p className="text-xs text-slate-500">{lead.email}</p>
                                    </div>
                                </div>
                                <span className={cn(
                                    "text-[10px] font-bold px-3 py-1 rounded-full",
                                    lead.status === 'NEW' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'
                                )}>
                                    {lead.status}
                                </span>
                            </div>
                            <div className="space-y-2 mb-4">
                                <p className="text-sm text-slate-600 font-medium">Service: {lead.service}</p>
                                <p className="text-xs text-slate-400">Date: {new Date(lead.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-lg shadow-slate-200">
                                    View Details
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteLead(lead.id);
                                    }}
                                    className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-100"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
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
                {/* Lead Detail Modal */}
                {selectedLead && (
                    <div className="fixed inset-0 z-[200] overflow-y-auto bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 custom-scrollbar">
                        <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 text-center">
                            <div 
                                className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col text-left align-middle relative transition-all animate-in zoom-in-95 duration-300 max-h-[calc(100vh-4rem)]"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="px-8 py-6 bg-slate-900 border-b border-white/10 shrink-0 flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-white">
                                        <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center text-xl font-bold text-orange-500 shadow-inner">
                                            {selectedLead.name[0]}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold tracking-tight">{selectedLead.name}</h3>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Signal Intelligence</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedLead(null)}
                                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
                                            <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1 font-bold">Company</p>
                                            <p className="text-sm font-bold text-slate-800">{selectedLead.company || 'Personal'}</p>
                                        </div>
                                        <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
                                            <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1 font-bold">Country</p>
                                            <p className="text-sm font-bold text-slate-800">{selectedLead.country || 'Global'}</p>
                                        </div>
                                        <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
                                            <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1 font-bold">Budget</p>
                                            <p className="text-sm font-bold text-orange-600">{selectedLead.budget || 'Open'}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4 text-orange-500" />
                                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inbound Description</h3>
                                        </div>
                                        <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap min-h-[120px]">
                                            {selectedLead.description}
                                        </div>
                                    </div>

                                    {selectedLead.referral && (
                                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-50/50 border border-blue-100 text-blue-700 text-xs font-medium">
                                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                                            Source: {selectedLead.referral}
                                        </div>
                                    )}
                                </div>

                                <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                        Received: {new Date(selectedLead.createdAt).toLocaleDateString()}
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => deleteLead(selectedLead.id)}
                                            className="px-6 py-2.5 rounded-xl text-slate-600 font-bold text-xs hover:bg-red-50 hover:text-red-600 transition-all border border-transparent hover:border-red-100"
                                        >
                                            Archive Signal
                                        </button>
                                        <a
                                            href={`mailto:${selectedLead.email}`}
                                            className="px-8 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-orange-600 transition-all shadow-lg shadow-slate-200 flex items-center gap-2"
                                        >
                                            Initiate Contact
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


