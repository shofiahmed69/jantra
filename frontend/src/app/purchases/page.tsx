"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { api } from "@/lib/api";
import { formatBDT } from "@/lib/currency";
import { Pencil, Plus, X } from "lucide-react";

type Product = { id: string; name: string };
type Supplier = { id: string; name: string };
type Purchase = { id: string; purchaseDate: string; totalCost: string; paymentStatus: string; supplierId?: string; items?: Array<{ productId: string; quantity: number; costPerUnit: string }> };

type FormState = {
  supplier_id: string;
  purchase_date: string;
  product_id: string;
  quantity: string;
  cost_per_unit: string;
  payment_status: string;
};

const emptyForm: FormState = {
  supplier_id: "",
  purchase_date: new Date().toISOString().slice(0, 10),
  product_id: "",
  quantity: "1",
  cost_per_unit: "1",
  payment_status: "paid",
};

export default function PurchasesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const load = async () => {
    const [a, b, c] = await Promise.all([
      api.get("/api/v1/products"),
      api.get("/api/v1/suppliers"),
      api.get("/api/v1/purchases"),
    ]);
    setProducts(a.data.data);
    setSuppliers(b.data.data);
    setPurchases(c.data.data);
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return purchases;
    return purchases.filter((p) => {
      const sname = suppliers.find((s) => s.id === p.supplierId)?.name || "";
      return sname.toLowerCase().includes(q) || p.paymentStatus.toLowerCase().includes(q);
    });
  }, [search, purchases, suppliers]);

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setOpenModal(true);
  };

  const openEdit = async (purchaseId: string) => {
    const res = await api.get(`/api/v1/purchases/${purchaseId}`);
    const p = res.data.data;
    const firstItem = p.items?.[0];
    setEditId(purchaseId);
    setForm({
      supplier_id: p.supplierId || "",
      purchase_date: p.purchaseDate?.slice(0, 10) || new Date().toISOString().slice(0, 10),
      product_id: firstItem?.productId || "",
      quantity: String(firstItem?.quantity || 1),
      cost_per_unit: String(firstItem?.costPerUnit || 1),
      payment_status: p.paymentStatus || "paid",
    });
    setOpenModal(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      supplier_id: form.supplier_id || undefined,
      purchase_date: form.purchase_date,
      payment_status: form.payment_status,
      items: [{
        product_id: form.product_id,
        quantity: Number(form.quantity),
        cost_per_unit: Number(form.cost_per_unit),
      }],
    };

    if (editId) await api.patch(`/api/v1/purchases/${editId}`, payload);
    else await api.post("/api/v1/purchases", payload);

    setOpenModal(false);
    setEditId(null);
    setForm(emptyForm);
    await load();
  };

  return (
    <AppShell title="Purchases">
      <div className="mb-4 flex items-center justify-between gap-3">
        <input className="input max-w-3xl" placeholder="Search purchases..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="btn btn-primary flex items-center gap-2" onClick={openCreate}><Plus className="w-4 h-4" /> Add purchase</button>
      </div>

      <div className="table-wrap">
        <table className="w-full text-sm">
          <thead className="table-head"><tr><th className="p-4 text-left">Date</th><th className="p-4 text-left">Supplier</th><th className="p-4 text-left">Total</th><th className="p-4 text-left">Status</th><th className="p-4 text-right">Actions</th></tr></thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="table-row border-t border-slate-200">
                <td className="p-4">{p.purchaseDate}</td>
                <td className="p-4">{suppliers.find((s) => s.id === p.supplierId)?.name || "-"}</td>
                <td className="p-4">{formatBDT(Number(p.totalCost))}</td>
                <td className="p-4"><span className={`status-pill ${p.paymentStatus === "paid" ? "status-ok" : "status-warn"}`}>{p.paymentStatus}</span></td>
                <td className="p-4 text-right"><button type="button" className="icon-btn icon-btn-edit" onClick={() => openEdit(p.id)}><Pencil className="w-4 h-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {openModal ? (
        <div className="modal-overlay">
          <div className="card w-full max-w-2xl p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">{editId ? "Edit Purchase" : "Add Purchase"}</h3>
              <button type="button" className="icon-btn btn-outline" onClick={() => setOpenModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={save} className="grid md:grid-cols-2 gap-3">
              <select className="input" value={form.supplier_id} onChange={(e) => setForm({ ...form, supplier_id: e.target.value })}><option value="">No Supplier</option>{suppliers.map((s) => <option value={s.id} key={s.id}>{s.name}</option>)}</select>
              <input className="input" type="date" value={form.purchase_date} onChange={(e) => setForm({ ...form, purchase_date: e.target.value })} required />
              <select className="input md:col-span-2" value={form.product_id} onChange={(e) => setForm({ ...form, product_id: e.target.value })} required><option value="">Select product</option>{products.map((p) => <option value={p.id} key={p.id}>{p.name}</option>)}</select>
              <input className="input" type="number" min={1} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
              <input className="input" type="number" min={0.01} step="0.01" value={form.cost_per_unit} onChange={(e) => setForm({ ...form, cost_per_unit: e.target.value })} required />
              <select className="input md:col-span-2" value={form.payment_status} onChange={(e) => setForm({ ...form, payment_status: e.target.value })}><option value="paid">paid</option><option value="pending">pending</option><option value="partial">partial</option></select>
              <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                <button type="button" className="btn btn-outline" onClick={() => setOpenModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editId ? "Update Purchase" : "Create Purchase"}</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
