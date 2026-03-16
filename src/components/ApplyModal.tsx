"use client";

import React, { useState } from "react";
import { X, Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import api from "@/lib/api";

interface ApplyModalProps {
    jobId: string;
    jobTitle: string;
    onClose: () => void;
}

export default function ApplyModal({ jobId, jobTitle, onClose }: ApplyModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        coverLetter: "",
        portfolioUrl: "",
        linkedIn: "",
    });
    const [resume, setResume] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setResume(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resume) {
            setErrorMessage("Please upload your resume.");
            return;
        }

        setLoading(true);
        setStatus("idle");
        setErrorMessage("");

        const submitData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            submitData.append(key, value);
        });
        submitData.append("resume", resume);

        try {
            await api.post(`/careers/${jobId}/apply`, submitData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setStatus("success");
        } catch (error: any) {
            console.error("Application error:", error);
            setStatus("error");
            const serverError = error.response?.data;
            if (serverError?.errors) {
                const fieldErrors = Object.entries(serverError.errors)
                    .map(([field, msgs]: any) => `${field}: ${msgs.join(", ")}`)
                    .join(" | ");
                setErrorMessage(fieldErrors);
            } else {
                setErrorMessage(serverError?.error || "Failed to submit application. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 spatial-hover">
                {/* Header */}
                <div className="bg-slate-900 px-8 py-6 flex items-center justify-between text-white">
                    <div>
                        <p className="text-orange-500 font-bold text-[10px] uppercase tracking-widest mb-1">Applying for</p>
                        <h2 className="text-xl font-bold">{jobTitle}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
                    {status === "success" ? (
                        <div className="py-12 text-center animate-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Received!</h2>
                            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                                Good luck, {formData.name.split(" ")[0]}! We've sent a confirmation email to {formData.email}.
                            </p>
                            <button
                                onClick={onClose}
                                className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold hover:bg-orange-600 transition-colors"
                            >
                                Close Window
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {status === "error" && (
                                <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm animate-in slide-in-from-top-2">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <p className="font-medium">{errorMessage}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        className="w-full bg-slate-50 border-0 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-orange-300 text-sm transition-all text-slate-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        className="w-full bg-slate-50 border-0 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-orange-300 text-sm transition-all text-slate-700"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+1 234 567 890"
                                        className="w-full bg-slate-50 border-0 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-orange-300 text-sm transition-all text-slate-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">LinkedIn Profile</label>
                                    <input
                                        type="url"
                                        name="linkedIn"
                                        value={formData.linkedIn}
                                        onChange={handleChange}
                                        placeholder="https://linkedin.com/in/username"
                                        className="w-full bg-slate-50 border-0 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-orange-300 text-sm transition-all text-slate-700"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Resume / CV (PDF/DOC)</label>
                                <div className={`relative border-2 border-dashed rounded-2xl transition-all ${resume ? 'border-orange-200 bg-orange-50/30' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}>
                                    <input
                                        required
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="p-6 flex flex-col items-center text-center">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${resume ? 'bg-orange-500 text-white' : 'bg-white text-slate-400 shadow-sm'}`}>
                                            <Upload className="w-5 h-5" />
                                        </div>
                                        {resume ? (
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm">{resume.name}</p>
                                                <p className="text-xs text-slate-500">{(resume.size / (1024 * 1024)).toFixed(2)} MB</p>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm">Click to upload or drag & drop</p>
                                                <p className="text-xs text-slate-500">Max size 5MB (PDF or Word)</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Brief Cover Note / Highlights</label>
                                <textarea
                                    name="coverLetter"
                                    value={formData.coverLetter}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Tell us what makes you a great fit..."
                                    className="w-full bg-slate-50 border-0 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-orange-300 text-sm transition-all text-slate-700 resize-none"
                                />
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-4 px-6 rounded-full font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all border border-slate-200 active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={loading}
                                    type="submit"
                                    className="flex-[2] py-4 px-6 rounded-full font-bold text-white bg-slate-900 hover:bg-orange-600 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" /> Transmitting...
                                        </>
                                    ) : (
                                        "Submit Application"
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
