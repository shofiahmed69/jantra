"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { api } from "@/lib/api";
import { formatBDT } from "@/lib/currency";
import { Pencil, Trash2, Plus, X, Upload } from "lucide-react";

type Product = {
  id: string;
  name: string;
  barcode?: string;
  stockQuantity: number;
  sellingPrice: string;
  costPrice: string;
  imageUrl?: string;
  unitType: string;
};

type FormState = {
  name: string;
  barcode: string;
  costPrice: string;
  sellingPrice: string;
  stockQuantity: string;
  unitType: string;
  imageUrl: string;
};

const emptyForm: FormState = {
  name: "",
  barcode: "",
  costPrice: "",
  sellingPrice: "",
  stockQuantity: "",
  unitType: "piece",
  imageUrl: "",
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [saveError, setSaveError] = useState("");

  const load = () => api.get('/api/v1/products?page=1&limit=100').then((res) => setProducts(res.data.data));
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q) || (p.barcode || '').toLowerCase().includes(q));
  }, [products, search]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpenModal(true);
  };

  const openEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      barcode: p.barcode || "",
      costPrice: String(p.costPrice),
      sellingPrice: String(p.sellingPrice),
      stockQuantity: String(p.stockQuantity),
      unitType: p.unitType || "piece",
      imageUrl: p.imageUrl || "",
    });
    setOpenModal(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Please choose an image file (JPG, PNG, etc.).");
      return;
    }
    setUploadError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.message || "Upload failed");
      setForm((prev) => ({ ...prev, imageUrl: data.url }));
    } catch {
      setUploadError("Could not upload image. Try again.");
    } finally {
      e.target.value = "";
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError("");
    const payload = {
      name: form.name,
      barcode: form.barcode || undefined,
      costPrice: Number(form.costPrice),
      sellingPrice: Number(form.sellingPrice),
      stockQuantity: Number(form.stockQuantity),
      unitType: form.unitType,
      imageUrl: form.imageUrl || undefined,
    };

    try {
      if (editingId) await api.patch(`/api/v1/products/${editingId}`, payload);
      else await api.post('/api/v1/products', payload);
      setOpenModal(false);
      setEditingId(null);
      setForm(emptyForm);
      await load();
    } catch {
      setSaveError("Could not save product. Check image size and try again.");
    }
  };

  const remove = async (id: string) => {
    await api.delete(`/api/v1/products/${id}`);
    await load();
  };

  return (
    <AppShell title="Products">
      <div className="mb-4 flex items-center justify-between gap-3">
        <input className="input max-w-3xl" placeholder="Search name, SKU, barcode..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="btn btn-primary flex items-center gap-2" onClick={openCreate}><Plus className="w-4 h-4" /> Add product</button>
      </div>

      <div className="table-wrap">
        <table className="w-full text-sm">
          <thead className="table-head">
            <tr>
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Barcode</th>
              <th className="p-4 text-left">Retail</th>
              <th className="p-4 text-left">Stock</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const statusClass = p.stockQuantity === 0 ? "bg-red-100 text-red-700" : p.stockQuantity <= 10 ? "bg-amber-100 text-amber-700" : "bg-orange-100 text-orange-700";
              const status = p.stockQuantity === 0 ? "Out" : p.stockQuantity <= 10 ? "Low" : "Active";
              return (
                <tr key={p.id} className="table-row border-t border-slate-200">
                  <td className="p-4">{p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="h-9 w-9 rounded object-cover" /> : <span className="text-xl">💊</span>}</td>
                  <td className="p-4 font-medium">{p.name}</td>
                  <td className="p-4">{p.barcode || '-'}</td>
                  <td className="p-4">{formatBDT(Number(p.sellingPrice))}</td>
                  <td className="p-4">{p.stockQuantity}</td>
                  <td className="p-4"><span className={`status-pill ${statusClass}`}>{status}</span></td>
                  <td className="p-4 text-right">
                    <div className="inline-flex gap-2">
                      <button type="button" className="icon-btn icon-btn-edit" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></button>
                      <button type="button" className="icon-btn icon-btn-delete" onClick={() => remove(p.id)}><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {openModal ? (
        <div className="modal-overlay">
          <div className="card w-full max-w-2xl p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">{editingId ? 'Edit Product' : 'Add Product'}</h3>
              <button type="button" className="icon-btn btn-outline" onClick={() => setOpenModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={save} className="grid md:grid-cols-2 gap-3">
              <input className="input" placeholder="Medicine Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <input className="input" placeholder="Barcode (optional)" value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} />
              <input className="input" placeholder="Cost Price (BDT)" value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: e.target.value })} required />
              <input className="input" placeholder="Selling Price (BDT)" value={form.sellingPrice} onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })} required />
              <input className="input" placeholder="Stock Quantity" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} required />
              <select className="input" value={form.unitType} onChange={(e) => setForm({ ...form, unitType: e.target.value })}><option value="box">box</option><option value="strip">strip</option><option value="bottle">bottle</option><option value="piece">piece</option></select>

              <div className="md:col-span-2 grid md:grid-cols-2 gap-3 items-center">
                <label className="input flex items-center gap-2 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>Upload Image</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
                <input
                  className="input"
                  placeholder={form.imageUrl ? "Image uploaded (CDN URL stored)" : "Or paste image URL (optional)"}
                  value={form.imageUrl.startsWith("http") ? form.imageUrl : ""}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                />
              </div>
              {uploadError ? <p className="md:col-span-2 text-sm text-red-600">{uploadError}</p> : null}
              {saveError ? <p className="md:col-span-2 text-sm text-red-600">{saveError}</p> : null}

              {form.imageUrl ? (
                <div className="md:col-span-2">
                  <img src={form.imageUrl} alt="Preview" className="h-20 w-20 rounded object-cover border border-slate-300" />
                </div>
              ) : null}

              <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                <button type="button" className="btn btn-outline" onClick={() => setOpenModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Update Product' : 'Create Product'}</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
