"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { api } from "@/lib/api";
import { formatBDT } from "@/lib/currency";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { useLanguage } from "@/lib/i18n/language-provider";

type Expense = { id: string; category: string; description: string; amount: string; expenseDate: string };

type FormState = { category: string; description: string; amount: string; expense_date: string };

const emptyForm: FormState = {
  category: "rent",
  description: "",
  amount: "",
  expense_date: new Date().toISOString().slice(0, 10),
};

export default function ExpensesPage() {
  const { t } = useLanguage();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const load = () => api.get("/api/v1/expenses").then((res) => setExpenses(res.data.data));
  useEffect(() => { load(); }, []);

  const total = useMemo(() => expenses.reduce((s, e) => s + Number(e.amount), 0), [expenses]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return expenses;
    return expenses.filter((e) =>
      e.category.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q)
    );
  }, [search, expenses]);

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setOpenModal(true);
  };

  const openEdit = (e: Expense) => {
    setEditId(e.id);
    setForm({
      category: e.category,
      description: e.description,
      amount: String(e.amount),
      expense_date: e.expenseDate?.slice(0, 10) || new Date().toISOString().slice(0, 10),
    });
    setOpenModal(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, amount: Number(form.amount) };
    if (editId) await api.patch(`/api/v1/expenses/${editId}`, payload);
    else await api.post("/api/v1/expenses", payload);
    setOpenModal(false);
    setEditId(null);
    setForm(emptyForm);
    await load();
  };

  const remove = async (id: string) => {
    await api.delete(`/api/v1/expenses/${id}`);
    await load();
  };

  return (
    <AppShell title={t("expenses.title")}>
      <div className="page-toolbar">
        <input className="input" placeholder={t("expenses.search")} value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="btn btn-primary flex items-center justify-center gap-2 w-full sm:w-auto shrink-0" onClick={openCreate}><Plus className="w-5 h-5" /> {t("expenses.add")}</button>
      </div>

      <div className="kpi-card mb-4"><p className="kpi-label">{t("expenses.total")}</p><p className="kpi-value text-red-600">{formatBDT(total)}</p></div>

      <ResponsiveTable
        rows={filtered}
        rowKey={(e) => e.id}
        columns={[
          { key: "date", header: t("date"), cell: (e) => e.expenseDate },
          { key: "category", header: t("expenses.category"), cell: (e) => e.category },
          { key: "description", header: t("expenses.description"), cell: (e) => e.description },
          { key: "amount", header: t("expenses.amount"), cell: (e) => formatBDT(Number(e.amount)) },
          {
            key: "actions",
            header: t("actions"),
            align: "right",
            cell: (e) => (
              <div className="inline-flex gap-2">
                <button type="button" className="icon-btn icon-btn-edit" onClick={() => openEdit(e)}><Pencil className="w-4 h-4" /></button>
                <button type="button" className="icon-btn icon-btn-delete" onClick={() => remove(e.id)}><Trash2 className="w-4 h-4" /></button>
              </div>
            ),
          },
        ]}
      />

      {openModal ? (
        <div className="modal-overlay">
          <div className="card w-full max-w-2xl p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">{editId ? t("expenses.edit") : t("expenses.create")}</h3>
              <button type="button" className="icon-btn btn-outline" onClick={() => setOpenModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={save} className="grid md:grid-cols-2 gap-3">
              <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="rent">rent</option><option value="electricity">electricity</option><option value="salary">salary</option><option value="internet">internet</option><option value="other">other</option>
              </select>
              <input className="input" type="date" value={form.expense_date} onChange={(e) => setForm({ ...form, expense_date: e.target.value })} required />
              <input className="input md:col-span-2" placeholder={t("expenses.description")} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              <input className="input md:col-span-2" type="number" min={0.01} step="0.01" placeholder={t("expenses.amount")} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
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
