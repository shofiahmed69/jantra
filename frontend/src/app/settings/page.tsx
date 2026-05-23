"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { api } from "@/lib/api";

export default function SettingsPage() {
  const [form, setForm] = useState({ name: "", phone: "", shopName: "", shopAddress: "" });

  useEffect(() => {
    api.get("/api/v1/auth/profile").then((res) => {
      const d = res.data.data;
      setForm({ name: d?.name || "", phone: d?.phone || "", shopName: d?.shopName || "", shopAddress: d?.shopAddress || "" });
    }).catch(() => null);
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.patch("/api/v1/auth/profile", form);
  };

  return (
    <AppShell title="Settings">
      <form onSubmit={save} className="card p-5 max-w-3xl space-y-3">
        <p className="text-2xl font-semibold">Profile & Store Settings</p>
        <input className="input" placeholder="Owner Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className="input" placeholder="Shop Name" value={form.shopName} onChange={(e) => setForm({ ...form, shopName: e.target.value })} />
        <textarea className="input" placeholder="Shop Address" value={form.shopAddress} onChange={(e) => setForm({ ...form, shopAddress: e.target.value })} />
        <button className="btn btn-primary" type="submit">Save Settings</button>
      </form>
    </AppShell>
  );
}
