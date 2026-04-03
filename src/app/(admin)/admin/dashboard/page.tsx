"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import {
    Users,
    Briefcase,
    FileText,
    Bell,
    TrendingUp,
    Clock,
    ArrowRight,
    Mail,
    MessageSquare,
    X
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface DashboardStats {
    counts: {
        leads: number;
        blogs: number;
        projects: number;
        applications: number;
    };
    recentLeads: any[];
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState<any | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get("/admin/dashboard-stats");
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const statCards = [
        { label: "New Leads", value: stats?.counts.leads || 0, icon: Bell, color: "text-orange-600", bg: "bg-orange-100" },
        { label: "Applicants", value: stats?.counts.applications || 0, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
        { label: "Blog Posts", value: stats?.counts.blogs || 0, icon: FileText, color: "text-emerald-600", bg: "bg-emerald-100" },
        { label: "Projects", value: stats?.counts.projects || 0, icon: Briefcase, color: "text-purple-600", bg: "bg-purple-100" },
    ];

    return (
        <div className="space-y-6 md:space-y-10 animate-fade-up min-h-[85vh]">
            <div className="flex flex-col mb-8 pt-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Mission Control</h2>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mt-1">Real-time business insights & signals</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {statCards.map((stat, i) => (
                    <div key={i} className="relative group p-[1px] rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br from-white via-white to-slate-200 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="bg-white/80 backdrop-blur-3xl h-full w-full rounded-[2rem] md:rounded-[2.5rem] p-5 sm:p-6 md:p-8 flex flex-col justify-between">
                             <div className="flex items-center justify-between mb-6 md:mb-8">
                                 <div className={`w-12 h-12 md:w-14 md:h-14 ${stat.bg} ${stat.color} rounded-[1rem] md:rounded-[1.2rem] flex items-center justify-center shadow-inner`}>
                                     <stat.icon className="w-6 h-6 md:w-7 md:h-7" />
                                 </div>
                                 <TrendingUp className="w-5 h-5 text-slate-300" />
                             </div>
                             <div>
                                 <p className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
                                 <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">{stat.label}</p>
                             </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Leads */}
                <div className="lg:col-span-2 bg-white/60 backdrop-blur-2xl p-5 sm:p-7 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-white shadow-2xl shadow-slate-200/50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900">Recent Signals</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Live from Contact & Pricing</p>
                        </div>
                        <Link href="/admin/leads" className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-orange-500 text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-orange-600 px-6 py-3 rounded-full transition-all group shadow-sm hover:shadow-md">
                            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="space-y-5">
                        {stats?.recentLeads.length === 0 ? (
                            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-12 text-center">
                                <Bell className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No Recent Signals</p>
                            </div>
                        ) : (
                            stats?.recentLeads.map((lead: any, i: number) => (
                                <div
                                    key={i}
                                    onClick={() => setSelectedLead(lead)}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-white border border-slate-100 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center gap-4 sm:gap-6 mb-4 sm:mb-0 min-w-0">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-50 border-2 border-white shadow-sm flex items-center justify-center text-orange-600 font-black uppercase text-lg sm:text-xl group-hover:bg-orange-500 group-hover:text-white transition-colors shrink-0">
                                            {lead.name[0]}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-base sm:text-lg text-slate-800 group-hover:text-orange-600 transition-colors truncate">{lead.name}</p>
                                            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider truncate">{lead.service}</p>
                                        </div>
                                    </div>
                                    <div className="text-left sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto gap-3">
                                        <span className="text-[10px] font-black text-white bg-slate-900 px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-sm">{lead.status}</span>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">
                                            <Clock className="w-3.5 h-3.5 text-orange-400" />
                                            {new Date(lead.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* System Status / Quick Info */}
                <div className="bg-slate-900 p-5 sm:p-7 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[50%] bg-orange-500/20 blur-[80px] rounded-full pointer-events-none" />
                    
                    <div className="relative z-10">
                        <div className="w-12 h-1 h-1.5 bg-orange-500 rounded-full mb-8" />
                        <h3 className="text-2xl font-black text-white mb-8">System<br/>Diagnostics</h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">API Engine</span>
                                <span className="text-[10px] font-black text-emerald-400 flex items-center gap-2 uppercase tracking-widest">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse" />
                                    Stable
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Database</span>
                                <span className="text-[10px] font-black text-emerald-400 flex items-center gap-2 uppercase tracking-widest">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                                    Connected
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">SMTP Network</span>
                                <span className="text-[10px] font-black text-emerald-400 flex items-center gap-2 uppercase tracking-widest">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 mt-12">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-orange-500 mb-2">Build Environment</p>
                        <h4 className="font-black text-white text-xl uppercase tracking-widest">JANTRA X.01</h4>
                        <p className="text-xs font-medium text-slate-500 mt-3 leading-relaxed">Enterprise management interface deployed on ultra-resilient edge infrastructure.</p>
                    </div>
                </div>
            </div>

            {/* Lead Detail Modal */}
            {selectedLead && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div
                        className="glass-panel w-full max-w-2xl rounded-[2rem] md:rounded-[3rem] p-5 sm:p-6 md:p-12 shadow-2xl relative animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedLead(null)}
                            className="absolute right-8 top-8 p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="flex flex-col md:flex-row gap-8 mb-10">
                            <div className="w-20 h-20 rounded-3xl bg-orange-100 flex items-center justify-center text-3xl font-bold text-orange-600 shadow-inner">
                                {selectedLead.name[0]}
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{selectedLead.name}</h2>
                                    <span className="text-[10px] font-bold px-3 py-1 bg-orange-500 text-white rounded-full uppercase tracking-widest">
                                        {selectedLead.status}
                                    </span>
                                </div>
                                <p className="text-slate-500 flex items-center gap-2 font-medium">
                                    <Mail className="w-4 h-4 text-orange-500" /> {selectedLead.email}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
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

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-white/30">
                            <p className="text-xs text-slate-400 font-medium italic">
                                Signal received on {new Date(selectedLead.createdAt).toLocaleString()}
                                {selectedLead.referral && ` via ${selectedLead.referral}`}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                                <a
                                    href={`mailto:${selectedLead.email}`}
                                    className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-orange-600 transition-all shadow-lg active:scale-95 flex items-center justify-center"
                                >
                                    Send Email
                                </a>
                                <Link
                                    href="/admin/leads"
                                    className="px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-800 font-bold text-sm hover:bg-orange-50 transition-all shadow-sm active:scale-95 flex items-center justify-center text-center"
                                >
                                    Manage
                                </Link>
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
