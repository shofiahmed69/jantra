"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { api } from "@/lib/api";
import { formatBDT } from "@/lib/currency";
import { Pencil, Plus, X } from "lucide-react";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { useLanguage } from "@/lib/i18n/language-provider";
import { availableSellUnits, unitLabel, type UnitLevel } from "@/lib/units";

type Product = { id: string; name: string; unitType?: string; piecesPerStrip?: number; stripsPerBox?: number | null };
type Supplier = { id: string; name: string };
type Purchase = { id: string; purchaseDate: string; totalCost: string; paymentStatus: string; supplierId?: string; items?: Array<{ productId: string; quantity: number; costPerUnit: string }> };

type FormState = {
  supplier_id: string;
  purchase_date: string;
  product_id: string;
  quantity: string;
  purchase_unit: UnitLevel;
  cost_per_unit: string;
  payment_status: string;
};

const emptyForm: FormState = {
  supplier_id: "",
  purchase_date: new Date().toISOString().slice(0, 10),
  product_id: "",
  quantity: "",
  purchase_unit: "piece",
  cost_per_unit: "",
  payment_status: "paid",
};

export default function PurchasesPage() {
  const { t } = useLanguage();
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
      purchase_unit: "piece",
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
        unit: form.purchase_unit,
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

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === form.product_id),
    [products, form.product_id],
  );

  const purchaseUnitOptions = useMemo(
    () => (selectedProduct ? availableSellUnits(selectedProduct) : (["piece", "strip", "box", "bottle"] as UnitLevel[])),
    [selectedProduct],
  );

  const costUnitHint = (() => {
    const u = form.purchase_unit;
    if (u === "strip") return t("units.perStrip");
    if (u === "box") return t("units.perBox");
    if (u === "bottle") return t("units.perBottle");
    return t("units.perPiece");
  })();

  return (
    <AppShell title={t("purchases.title")}>
      <div className="page-toolbar">
        <input className="input" placeholder={t("purchases.search")} value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="btn btn-primary flex items-center justify-center gap-2 w-full sm:w-auto shrink-0" onClick={openCreate}><Plus className="w-5 h-5" /> {t("purchases.add")}</button>
      </div>

      <ResponsiveTable
        rows={filtered}
        rowKey={(p) => p.id}
        columns={[
          { key: "date", header: t("date"), cell: (p) => p.purchaseDate },
          { key: "supplier", header: t("purchases.supplier"), cell: (p) => suppliers.find((s) => s.id === p.supplierId)?.name || "-" },
          { key: "total", header: t("total"), cell: (p) => formatBDT(Number(p.totalCost)) },
          {
            key: "status",
            header: t("status"),
            cell: (p) => {
              const label = p.paymentStatus === "paid" ? t("paid") : p.paymentStatus === "pending" ? t("pending") : t("partial");
              return <span className={`status-pill ${p.paymentStatus === "paid" ? "status-ok" : "status-warn"}`}>{label}</span>;
            },
          },
          {
            key: "actions",
            header: t("actions"),
            align: "right",
            cell: (p) => (
              <button type="button" className="icon-btn icon-btn-edit" onClick={() => openEdit(p.id)}>
                <Pencil className="w-4 h-4" />
              </button>
            ),
          },
        ]}
      />

      {openModal ? (
        <div className="modal-overlay">
          <div className="card w-full max-w-2xl p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">{editId ? t("purchases.edit") : t("purchases.create")}</h3>
              <button type="button" className="icon-btn btn-outline" onClick={() => setOpenModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={save} className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="form-label">{t("purchases.supplier")}</label>
                <select className="input w-full" value={form.supplier_id} onChange={(e) => setForm({ ...form, supplier_id: e.target.value })}><option value="">{t("purchases.noSupplier")}</option>{suppliers.map((s) => <option value={s.id} key={s.id}>{s.name}</option>)}</select>
              </div>
              <div>
                <label className="form-label">{t("purchases.purchaseDate")}</label>
                <input className="input w-full" type="date" value={form.purchase_date} onChange={(e) => setForm({ ...form, purchase_date: e.target.value })} required />
              </div>
              <div className="md:col-span-2">
                <label className="form-label">{t("purchases.product")}</label>
                <select
                  className="input w-full"
                  value={form.product_id}
                  onChange={(e) => {
                    const p = products.find((x) => x.id === e.target.value);
                    const units = p ? availableSellUnits(p) : (["piece"] as UnitLevel[]);
                    setForm({ ...form, product_id: e.target.value, purchase_unit: units[0] });
                  }}
                  required
                >
                  <option value="">{t("purchases.selectProduct")}</option>
                  {products.map((p) => <option value={p.id} key={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">{t("units.buyAs")}</label>
                <select className="input w-full" value={form.purchase_unit} onChange={(e) => setForm({ ...form, purchase_unit: e.target.value as UnitLevel })}>
                  {purchaseUnitOptions.map((u) => (
                    <option key={u} value={u}>{unitLabel(u, t)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">{t("purchases.quantity")}</label>
                <input className="input w-full" type="number" min={1} placeholder={t("purchases.qtyHint")} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
              </div>
              <div className="md:col-span-2">
                <label className="form-label">{t("purchases.costPerUnit")} ({costUnitHint})</label>
                <input className="input w-full" type="number" min={0.01} step="0.01" placeholder={t("purchases.priceHint")} value={form.cost_per_unit} onChange={(e) => setForm({ ...form, cost_per_unit: e.target.value })} required />
              </div>
              <div className="md:col-span-2">
                <label className="form-label">{t("purchases.paymentStatus")}</label>
                <select className="input w-full" value={form.payment_status} onChange={(e) => setForm({ ...form, payment_status: e.target.value })}><option value="paid">{t("paid")}</option><option value="pending">{t("pending")}</option><option value="partial">{t("partial")}</option></select>
              </div>
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
