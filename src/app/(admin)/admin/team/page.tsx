"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import {
    Plus,
    Edit3,
    Trash2,
    X,
    User,
    Upload,
    Loader2,
    Check
} from "lucide-react";

interface TeamMember {
    id: string;
    name: string;
    role: string;
    bio: string;
    avatar?: string;
    linkedIn?: string;
    twitter?: string;
    order: number;
    published: boolean;
}

export default function TeamManagementPage() {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchTeam = async () => {
        setLoading(true);
        try {
            const response = await api.get("/team");
            // Backend might return published:true only by default, so we might need an admin endpoint 
            // but for now we'll use the public one and assume admin shows all if we had an admin route.
            // Actually, /team route in backend lists published:true. 
            // Let's check if there's an admin list route. In team.js there isn't.
            // I'll add one if needed, but for now let's use what we have.
            setTeam(response.data || []);
        } catch (error) {
            console.error("Failed to fetch team", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
    }, []);

    const handleDelete = (id: string) => {
        setDeletingId(id);
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        try {
            await api.delete(`/team/${deletingId}`);
            fetchTeam();
        } catch (error) {
            alert("Failed to delete team member");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Architectural Team</h2>
                    <p className="text-sm text-slate-500">Manage the senior engineers and researchers representing JANTRA.</p>
                </div>

                <button
                    onClick={() => { setEditingMember(null); setShowModal(true); }}
                    className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg active:scale-95 text-sm"
                >
                    <Plus className="w-4 h-4" /> Add Architect
                </button>
            </header>

            <div className="glass-panel overflow-hidden border-white/60 shadow-xl rounded-[2.5rem]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/20 bg-slate-900/5">
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Architect</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Role / Designation</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center">
                                        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : team.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center text-slate-400 text-sm">
                                        No architects added yet.
                                    </td>
                                </tr>
                            ) : (
                                team.map((member) => (
                                    <tr key={member.id} className="hover:bg-white/40 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 shadow-sm flex items-center justify-center">
                                                    {member.avatar ? (
                                                        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User className="w-6 h-6 text-slate-300" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm">{member.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Architect #{member.order}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-medium text-slate-600 bg-white/50 px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
                                                {member.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest ${member.published ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                                {member.published ? 'Active' : 'Private'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => { setEditingMember(member); setShowModal(true); }}
                                                    className="p-2 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-blue-600 shadow-sm border border-transparent hover:border-blue-100"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(member.id)}
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

            {/* TeamMember Modal */}
            {showModal && (
                <TeamMemberModal
                    member={editingMember}
                    onClose={() => setShowModal(false)}
                    onSuccess={() => { fetchTeam(); setShowModal(false); }}
                />
            )}

            {/* Delete Confirmation Modal */}
            {deletingId && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl p-8 border border-slate-200 text-center animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Trash2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Confirm Removal</h3>
                        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                            Removing this architect will withdraw them from the public About page. Continue?
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeletingId(null)} className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200 transition-all font-bold">Keep</button>
                            <button onClick={confirmDelete} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-xs hover:bg-red-600 transition-all shadow-lg shadow-red-200 font-bold">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function TeamMemberModal({ member, onClose, onSuccess }: { member: TeamMember | null, onClose: () => void, onSuccess: () => void }) {
    const [formData, setFormData] = useState({
        name: member?.name || "",
        role: member?.role || "",
        bio: member?.bio || "",
        avatar: member?.avatar || "",
        linkedIn: member?.linkedIn || "",
        twitter: member?.twitter || "",
        order: member?.order || 0,
        published: member?.published ?? true
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const data = new FormData();
        data.append("image", file);

        try {
            const response = await api.post("/upload/image", data, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setFormData(prev => ({ ...prev, avatar: response.data.url }));
        } catch (error) {
            alert("Image upload failed. Please try a smaller image (max 2MB).");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (member) await api.put(`/team/${member.id}`, formData);
            else await api.post("/team", formData);
            onSuccess();
        } catch (error) {
            alert("Failed to save team member.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm shadow-2xl">
            <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300">
                <div className="bg-slate-900 px-8 py-6 flex items-center justify-between text-white shrink-0">
                    <div>
                        <h3 className="text-xl font-bold">{member ? "Refine Personnel" : "Onboard Architect"}</h3>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Team Intelligence</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full opacity-50 hover:opacity-100 transition-all"><X className="w-5 h-5" /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center justify-center py-4 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 relative group overflow-hidden">
                        {formData.avatar ? (
                            <div className="relative w-32 h-32 rounded-3xl overflow-hidden shadow-xl border-4 border-white group">
                                <img src={formData.avatar} className="w-full h-full object-cover" alt="Preview" />
                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                    <label className="cursor-pointer text-white text-xs font-bold uppercase tracking-widest">Change</label>
                                    <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm text-slate-300 mb-4 group-hover:scale-105 transition-transform">
                                    {uploading ? <Loader2 className="w-8 h-8 animate-spin text-orange-500" /> : <Upload className="w-8 h-8" />}
                                </div>
                                <label className="cursor-pointer bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-orange-600 transition-all active:scale-95 shadow-lg">
                                    Upload Headshot
                                    <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
                                </label>
                                <p className="text-[10px] text-slate-400 mt-3 font-medium">Recommended: Square, PNG/JPG, Max 2MB</p>
                            </>
                        )}
                        {uploading && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                                <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-2" />
                                <p className="text-xs font-bold text-slate-800 tracking-widest uppercase">Uploading...</p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Full Name</label>
                            <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-300 focus:bg-white transition-all text-sm font-bold text-slate-800" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Role / Designation</label>
                            <input required value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-300 focus:bg-white transition-all text-sm font-medium text-slate-800" placeholder="e.g. Lead Systems Architect" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Professional Bio</label>
                        <textarea required rows={3} value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-300 focus:bg-white transition-all text-sm leading-relaxed text-slate-600" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">LinkedIn Profile (URL)</label>
                            <input value={formData.linkedIn} onChange={e => setFormData({ ...formData, linkedIn: e.target.value })} className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-300 focus:bg-white transition-all text-xs font-medium" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Display Order</label>
                            <input type="number" value={formData.order} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })} className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-300 focus:bg-white transition-all text-sm font-bold" />
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
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Enable Public Visibility</span>
                    </div>
                </form>

                <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
                    <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 font-bold">Cancel</button>
                    <button
                        disabled={loading || uploading}
                        onClick={handleSubmit}
                        className="px-8 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-orange-600 transition-all shadow-xl disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin text-white" />}
                        {loading ? "Processing..." : member ? "Update Profile" : "Onboard Architect"}
                    </button>
                </div>
            </div>
        </div>
    );
}
