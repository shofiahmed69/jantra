"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { api } from "@/lib/api";
import { formatBDT } from "@/lib/currency";
import { Pencil, X } from "lucide-react";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { SearchField } from "@/components/ui/search-field";
import { useLanguage } from "@/lib/i18n/language-provider";

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
  const { t } = useLanguage();
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
    <AppShell title={t("inventory.title")}>
      <div className="kpi-grid kpi-grid-4 mb-4">
        <div className="kpi-card"><p className="kpi-label">{t("inventory.totalProducts")}</p><p className="kpi-value">{items.length}</p></div>
        <div className="kpi-card"><p className="kpi-label">{t("inventory.lowStock")}</p><p className="kpi-value text-amber-600">{low.length}</p></div>
        <div className="kpi-card"><p className="kpi-label">{t("inventory.outOfStock")}</p><p className="kpi-value text-red-600">{out.length}</p></div>
        <div className="kpi-card"><p className="kpi-label">{t("inventory.stockValue")}</p><p className="kpi-value">{formatBDT(totalValue)}</p></div>
      </div>

      <div className="page-toolbar">
        <SearchField value={search} onChange={setSearch} placeholder={t("inventory.search")} />
      </div>

      <ResponsiveTable
        rows={filtered}
        rowKey={(s) => s.id}
        columns={[
          { key: "name", header: t("name"), cell: (s) => <span className="font-medium text-lg">{s.name}</span> },
          { key: "stock", header: t("stock"), cell: (s) => s.stockQuantity },
          { key: "min", header: t("inventory.minAlert"), cell: (s) => s.minStockAlert },
          {
            key: "status",
            header: t("status"),
            cell: (s) => {
              const st = s.stockQuantity === 0 ? t("out") : s.stockQuantity <= s.minStockAlert ? t("low") : t("active");
              const cls = s.stockQuantity === 0 ? "status-bad" : s.stockQuantity <= s.minStockAlert ? "status-warn" : "status-ok";
              return <span className={`status-pill ${cls}`}>{st}</span>;
            },
          },
          { key: "expiry", header: t("inventory.expiry"), cell: (s) => s.expiryDate || "-" },
          {
            key: "actions",
            header: t("actions"),
            align: "right",
            cell: (s) => (
              <button type="button" className="icon-btn icon-btn-edit" onClick={() => openEdit(s)}>
                <Pencil className="w-4 h-4" />
              </button>
            ),
          },
        ]}
      />

      {openModal ? (
        <div className="modal-overlay">
          <div className="card w-full max-w-xl p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">{t("inventory.updateStock")}</h3>
              <button type="button" className="icon-btn btn-outline" onClick={() => setOpenModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={save} className="grid md:grid-cols-2 gap-3">
              <input className="input" type="number" min={0} placeholder={t("products.stockQty")} value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} required />
              <input className="input" type="number" min={0} placeholder={t("inventory.minAlert")} value={form.minStockAlert} onChange={(e) => setForm({ ...form, minStockAlert: e.target.value })} required />
              <input className="input md:col-span-2" type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
              <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                <button type="button" className="btn btn-outline" onClick={() => setOpenModal(false)}>{t("cancel")}</button>
                <button type="submit" className="btn btn-primary">{t("inventory.updateBtn")}</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
