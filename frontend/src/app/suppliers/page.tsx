"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { api } from "@/lib/api";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { useLanguage } from "@/lib/i18n/language-provider";

type Supplier = { id: string; name: string; contactPerson?: string; phone?: string; email?: string };

type FormState = { name: string; contactPerson: string; phone: string; email: string };

const emptyForm: FormState = { name: "", contactPerson: "", phone: "", email: "" };

export default function SuppliersPage() {
  const { t } = useLanguage();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const load = () => api.get("/api/v1/suppliers").then((res) => setSuppliers(res.data.data));
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return suppliers;
    return suppliers.filter((s) =>
      s.name.toLowerCase().includes(q) ||
      (s.contactPerson || "").toLowerCase().includes(q) ||
      (s.phone || "").toLowerCase().includes(q) ||
      (s.email || "").toLowerCase().includes(q)
    );
  }, [search, suppliers]);

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setOpenModal(true);
  };

  const openEdit = (s: Supplier) => {
    setEditId(s.id);
    setForm({ name: s.name, contactPerson: s.contactPerson || "", phone: s.phone || "", email: s.email || "" });
    setOpenModal(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) await api.patch(`/api/v1/suppliers/${editId}`, form);
    else await api.post("/api/v1/suppliers", form);
    setOpenModal(false);
    setEditId(null);
    setForm(emptyForm);
    await load();
  };

  const remove = async (id: string) => {
    await api.delete(`/api/v1/suppliers/${id}`);
    await load();
  };

  return (
    <AppShell title={t("suppliers.title")}>
      <div className="page-toolbar">
        <input className="input" placeholder={t("suppliers.search")} value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="btn btn-primary flex items-center justify-center gap-2 w-full sm:w-auto shrink-0" onClick={openCreate}><Plus className="w-5 h-5" /> {t("suppliers.add")}</button>
      </div>

      <ResponsiveTable
        rows={filtered}
        rowKey={(s) => s.id}
        columns={[
          { key: "name", header: t("name"), cell: (s) => <span className="font-medium text-lg">{s.name}</span> },
          { key: "contact", header: t("suppliers.contact"), cell: (s) => s.contactPerson || "-" },
          { key: "phone", header: t("suppliers.phone"), cell: (s) => s.phone || "-" },
          { key: "email", header: t("email"), cell: (s) => <span className="break-all">{s.email || "-"}</span> },
          {
            key: "actions",
            header: t("actions"),
            align: "right",
            cell: (s) => (
              <div className="inline-flex gap-2">
                <button type="button" className="icon-btn icon-btn-edit" onClick={() => openEdit(s)}><Pencil className="w-4 h-4" /></button>
                <button type="button" className="icon-btn icon-btn-delete" onClick={() => remove(s.id)}><Trash2 className="w-4 h-4" /></button>
              </div>
            ),
          },
        ]}
      />

      {openModal ? (
        <div className="modal-overlay">
          <div className="card w-full max-w-2xl p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">{editId ? t("suppliers.edit") : t("suppliers.create")}</h3>
              <button type="button" className="icon-btn btn-outline" onClick={() => setOpenModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={save} className="grid md:grid-cols-2 gap-3">
              <input className="input md:col-span-2" placeholder={t("name")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <input className="input" placeholder={t("suppliers.contact")} value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} />
              <input className="input" placeholder={t("suppliers.phone")} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <input className="input md:col-span-2" placeholder={t("email")} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                <button type="button" className="btn btn-outline" onClick={() => setOpenModal(false)}>{t("cancel")}</button>
                <button type="submit" className="btn btn-primary">{editId ? t("update") : t("create")}</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
