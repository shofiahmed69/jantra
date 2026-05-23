"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { api } from "@/lib/api";
import { formatBDT } from "@/lib/currency";
import { Pencil, Search, X } from "lucide-react";

type Product = {
  id: string;
  name: string;
  stockQuantity: number;
  minStockAlert: number;
  costPrice?: string;
  sellingPrice?: string;
  expiryDate?: string;
};

type FormState = {
  stockQuantity: string;
  minStockAlert: string;
  expiryDate: string;
};

const emptyForm: FormState = { stockQuantity: "", minStockAlert: "", expiryDate: "" };

export default function InventoryPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const load = () => api.get("/api/v1/products?page=1&limit=100").then((res) => setItems(res.data.data));
  useEffect(() => { load(); }, []);

  const totalValue = useMemo(() => items.reduce((s, x) => s + x.stockQuantity * Number(x.costPrice || 0), 0), [items]);
  const low = useMemo(() => items.filter((i) => i.stockQuantity > 0 && i.stockQuantity <= i.minStockAlert), [items]);
  const out = useMemo(() => items.filter((i) => i.stockQuantity === 0), [items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => i.name.toLowerCase().includes(q));
  }, [items, search]);

  const openEdit = (p: Product) => {
    setEditId(p.id);
    setForm({
      stockQuantity: String(p.stockQuantity),
      minStockAlert: String(p.minStockAlert),
      expiryDate: p.expiryDate ? p.expiryDate.slice(0, 10) : "",
    });
    setOpenModal(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    await api.patch(`/api/v1/products/${editId}`, {
      stockQuantity: Number(form.stockQuantity),
      minStockAlert: Number(form.minStockAlert),
      expiryDate: form.expiryDate || undefined,
    });
    setOpenModal(false);
    setEditId(null);
    setForm(emptyForm);
    await load();
  };

  return (
    <AppShell title="Inventory">
      <div className="grid md:grid-cols-4 gap-4 mb-4">
        <div className="kpi-card"><p className="kpi-label">Total Products</p><p className="kpi-value">{items.length}</p></div>
        <div className="kpi-card"><p className="kpi-label">Low Stock</p><p className="kpi-value text-amber-600">{low.length}</p></div>
        <div className="kpi-card"><p className="kpi-label">Out of Stock</p><p className="kpi-value text-red-600">{out.length}</p></div>
        <div className="kpi-card"><p className="kpi-label">Stock Value</p><p className="kpi-value">{formatBDT(totalValue)}</p></div>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="relative max-w-3xl w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input pl-9" placeholder="Search inventory..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="table-wrap">
        <table className="w-full text-sm">
          <thead className="table-head"><tr><th className="p-4 text-left">Name</th><th className="p-4 text-left">Stock</th><th className="p-4 text-left">Min Alert</th><th className="p-4 text-left">Status</th><th className="p-4 text-left">Expiry</th><th className="p-4 text-right">Actions</th></tr></thead>
          <tbody>
            {filtered.map((s) => {
              const st = s.stockQuantity === 0 ? "Out" : s.stockQuantity <= s.minStockAlert ? "Low" : "Active";
              const cls = s.stockQuantity === 0 ? "status-bad" : s.stockQuantity <= s.minStockAlert ? "status-warn" : "status-ok";
              return (
                <tr className="table-row border-t border-slate-200" key={s.id}>
                  <td className="p-4">{s.name}</td>
                  <td className="p-4">{s.stockQuantity}</td>
                  <td className="p-4">{s.minStockAlert}</td>
                  <td className="p-4"><span className={`status-pill ${cls}`}>{st}</span></td>
                  <td className="p-4">{s.expiryDate || "-"}</td>
                  <td className="p-4 text-right"><button type="button" className="icon-btn icon-btn-edit" onClick={() => openEdit(s)}><Pencil className="w-4 h-4" /></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {openModal ? (
        <div className="modal-overlay">
          <div className="card w-full max-w-xl p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">Update Stock</h3>
              <button type="button" className="icon-btn btn-outline" onClick={() => setOpenModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={save} className="grid md:grid-cols-2 gap-3">
              <input className="input" type="number" min={0} placeholder="Stock Quantity" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} required />
              <input className="input" type="number" min={0} placeholder="Min Stock Alert" value={form.minStockAlert} onChange={(e) => setForm({ ...form, minStockAlert: e.target.value })} required />
              <input className="input md:col-span-2" type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
              <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                <button type="button" className="btn btn-outline" onClick={() => setOpenModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Update Inventory</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
