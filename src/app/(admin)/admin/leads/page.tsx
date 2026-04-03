"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import {
    Search,
    Filter,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    Mail,
    Calendar,
    MessageSquare,
    Trash2,
    X,
    Eye,
    ArrowUpRight,
    Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
            setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
            if (selectedLead?.id === id) {
                setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
            }
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const deleteLead = async (leadId: string) => {
        if (!confirm('Archive this signal permanently?')) return;
        try {
            await api.delete(`/leads/admin/${leadId}`);
            setLeads(leads.filter(lead => lead.id !== leadId));
            if (selectedLead?.id === leadId) setSelectedLead(null);
        } catch (error) {
            alert('Failed to delete lead');
        }
    };

    return (
        <div className="space-y-10 pb-20">
            <motion.header 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-6"
            >
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-1 bg-orange-500 rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">Pipeline Intelligence</span>
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase whitespace-pre-line leading-none">
                        Lead<br/>Signals
                    </h2>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <form onSubmit={handleSearch} className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Identify prospect..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-white border-slate-100 rounded-[1.5rem] pl-12 pr-6 py-4 text-sm focus:ring-2 focus:ring-orange-300 w-full sm:w-64 transition-all shadow-sm font-medium"
                        />
                    </form>
                    <div className="relative group">
                        <Filter className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-orange-500 transition-colors pointer-events-none" />
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="bg-white border-slate-100 rounded-[1.5rem] pl-12 pr-10 py-4 text-sm focus:ring-2 focus:ring-orange-300 appearance-none cursor-pointer shadow-sm font-bold text-slate-700 w-full sm:w-48"
                        >
                            <option value="">All Vectors</option>
                            <option value="NEW">New Signal</option>
                            <option value="CONTACTED">Engaged</option>
                            <option value="QUALIFIED">High-Value</option>
                            <option value="REJECTED">Archived</option>
                        </select>
                    </div>
                </div>
            </motion.header>

            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white border border-slate-100 overflow-hidden shadow-2xl shadow-slate-200/50 rounded-[3rem]"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/[0.02] border-b border-slate-100">
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Prospect Identity</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Service Vector</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Signal Date</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Status Node</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Tactical Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 italic-none">
                            {loading && !leads.length ? (
                                <tr>
                                    <td colSpan={5} className="px-10 py-32 text-center">
                                        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto shadow-xl" />
                                    </td>
                                </tr>
                            ) : leads.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-10 py-32 text-center">
                                        <Target className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No Active Signals Detected</p>
                                    </td>
                                </tr>
                            ) : (
                                leads.map((lead, i) => (
                                    <motion.tr 
                                        key={lead.id} 
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="hover:bg-slate-50/50 transition-colors group cursor-pointer" 
                                        onClick={() => setSelectedLead(lead)}
                                    >
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-xl shadow-xl group-hover:bg-orange-500 transition-colors">
                                                    {lead.name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-extrabold text-slate-900 text-lg tracking-tight">{lead.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-1.5 group-hover:text-slate-600 transition-colors">
                                                        <Mail className="w-3 h-3 text-orange-500" /> {lead.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-sm">
                                            <p className="font-black text-slate-800 tracking-tight">{lead.service}</p>
                                            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mt-1">{lead.budget || 'UNDISCLOSED'}</p>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                <Calendar className="w-3.5 h-3.5 text-slate-300" />
                                                {new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8" onClick={(e) => e.stopPropagation()}>
                                            <div className="relative group/status flex items-center gap-2">
                                                <div className={cn(
                                                    "text-[9px] font-black px-4 py-2 rounded-full border shadow-sm transition-all flex items-center gap-1.5",
                                                    lead.status === 'NEW' ? 'bg-orange-500/5 text-orange-600 border-orange-200' :
                                                        lead.status === 'CONTACTED' ? 'bg-blue-500/5 text-blue-600 border-blue-200' :
                                                            lead.status === 'QUALIFIED' ? 'bg-emerald-500/5 text-emerald-600 border-emerald-200' :
                                                                'bg-slate-500/5 text-slate-500 border-slate-200 opacity-50'
                                                )}>
                                                    <div className={cn("w-1.5 h-1.5 rounded-full", 
                                                        lead.status === 'NEW' ? 'bg-orange-500 animate-pulse' :
                                                        lead.status === 'CONTACTED' ? 'bg-blue-500' :
                                                        lead.status === 'QUALIFIED' ? 'bg-emerald-500' : 'bg-slate-500'
                                                    )} />
                                                    {lead.status}
                                                </div>
                                                <select
                                                    value={lead.status}
                                                    onChange={(e) => updateStatus(lead.id, e.target.value)}
                                                    className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all text-[8px] bg-white cursor-pointer shadow-sm"
                                                >
                                                    <option value="NEW">NEW</option>
                                                    <option value="CONTACTED">ENGAGED</option>
                                                    <option value="QUALIFIED">VALUED</option>
                                                    <option value="REJECTED">VOID</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-3">
                                                <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-orange-500 hover:shadow-lg transition-all">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteLead(lead.id);
                                                    }}
                                                    className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-red-500 hover:shadow-lg transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-10 py-8 bg-slate-900/[0.02] flex items-center justify-between border-t border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                        Vector Sequence <span className="text-slate-900">{page}</span> // Total Capacitance <span className="text-slate-900">{totalPages}</span>
                    </p>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setPage(prev => Math.max(1, prev - 1))}
                            disabled={page === 1}
                            className="p-3 rounded-2xl bg-white border border-slate-200 disabled:opacity-30 hover:bg-orange-500 hover:text-white transition-all shadow-sm"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={page === totalPages}
                            className="p-3 rounded-2xl bg-white border border-slate-200 disabled:opacity-30 hover:bg-orange-500 hover:text-white transition-all shadow-sm"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                {selectedLead && (
                    <div className="fixed inset-0 z-[200] overflow-y-auto bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-4xl bg-white rounded-[3.5rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row relative max-h-[90vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="w-full md:w-80 bg-slate-950 p-10 text-white shrink-0 relative flex flex-col justify-between">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Target className="w-32 h-32 rotate-12" />
                                </div>
                                <div className="relative z-10">
                                    <div className="w-20 h-20 rounded-[2rem] bg-orange-500 flex items-center justify-center text-3xl font-black shadow-2xl mb-8">
                                        {selectedLead.name[0]}
                                    </div>
                                    <h3 className="text-3xl font-black tracking-tighter uppercase leading-none mb-3">{selectedLead.name}</h3>
                                    <div className="flex items-center gap-2 mb-8">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Live Connection</span>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Signal Source</p>
                                            <p className="text-xs font-bold text-slate-300 italic opacity-80">{selectedLead.referral || 'Direct Infrastructure'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Network Identity</p>
                                            <p className="text-xs font-bold text-slate-300 flex items-center gap-2">
                                                <Mail className="w-3.5 h-3.5 text-orange-500" /> {selectedLead.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button onClick={() => setSelectedLead(null)} className="absolute top-8 left-8 p-3 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white md:hidden">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar bg-slate-50/50 flex flex-col">
                                <div className="flex items-center justify-between mb-8 shrink-0">
                                    <div className="flex items-center gap-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Signal Reconstruction</h4>
                                    </div>
                                    <button onClick={() => setSelectedLead(null)} className="p-3 hover:bg-slate-200/50 rounded-full transition-colors text-slate-400 hover:text-slate-900 hidden md:block">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10 shrink-0">
                                    <div className="p-5 rounded-[2rem] bg-white border border-slate-100 shadow-sm relative overflow-hidden group">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Company Vector</p>
                                        <p className="text-base font-black text-slate-900 tracking-tight leading-none truncate">{selectedLead.company || 'Personal Node'}</p>
                                    </div>
                                    <div className="p-5 rounded-[2rem] bg-white border border-slate-100 shadow-sm relative overflow-hidden group">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Geographic Node</p>
                                        <p className="text-base font-black text-slate-900 tracking-tight leading-none truncate">{selectedLead.country || 'Global Grid'}</p>
                                    </div>
                                    <div className="p-5 rounded-[2rem] bg-white border border-slate-100 shadow-sm relative overflow-hidden group">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Resource Budget</p>
                                        <p className="text-base font-black text-orange-600 tracking-tight leading-none">{selectedLead.budget || 'Undetermined'}</p>
                                    </div>
                                </div>

                                <div className="space-y-8 flex-1">
                                    <div className="flex flex-col h-full min-h-[300px]">
                                        <div className="flex items-center gap-3 mb-4 shrink-0">
                                            <MessageSquare className="w-4 h-4 text-orange-500" />
                                            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Inbound Transmission</h3>
                                        </div>
                                        <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap shadow-inner-xl flex-1 font-medium opacity-90 overflow-y-auto custom-scrollbar border-dashed">
                                            {selectedLead.description}
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-200 shrink-0">
                                        <div className="text-center sm:text-left">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Signal Timestamp</p>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                                                {new Date(selectedLead.createdAt).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        <div className="flex gap-3 w-full sm:w-auto">
                                            <button
                                                onClick={() => deleteLead(selectedLead.id)}
                                                className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-400 font-black text-[9px] uppercase tracking-widest hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all"
                                            >
                                                Archive
                                            </button>
                                            <a
                                                href={`mailto:${selectedLead.email}`}
                                                className="flex-1 sm:flex-none px-8 py-3 rounded-2xl bg-slate-950 text-white font-black text-[9px] uppercase tracking-[0.2em] hover:bg-orange-600 transition-all shadow-2xl flex items-center justify-center gap-2 group"
                                            >
                                                Respond <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}


