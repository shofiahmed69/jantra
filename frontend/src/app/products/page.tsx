"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { api } from "@/lib/api";
import { formatBDT } from "@/lib/currency";
import { Pencil, Trash2, Plus, X, Upload } from "lucide-react";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { ProductThumb } from "@/components/ui/product-thumb";
import { useLanguage } from "@/lib/i18n/language-provider";
import { formatStockPieces, isBottleProduct } from "@/lib/units";

type Product = {
  id: string;
  name: string;
  barcode?: string;
  stockQuantity: number;
  sellingPrice: string;
  costPrice: string;
  imageUrl?: string;
  piecesPerStrip: number;
  stripsPerBox?: number | null;
  unitType?: string;
};

type PackType = "tablet" | "bottle";

type FormState = {
  name: string;
  barcode: string;
  costPrice: string;
  sellingPrice: string;
  stockQuantity: string;
  packType: PackType;
  piecesPerStrip: string;
  stripsPerBox: string;
  imageUrl: string;
};

const emptyForm: FormState = {
  name: "",
  barcode: "",
  costPrice: "",
  sellingPrice: "",
  stockQuantity: "",
  packType: "tablet",
  piecesPerStrip: "1",
  stripsPerBox: "",
  imageUrl: "",
};

export default function ProductsPage() {
  const { t } = useLanguage();
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
      packType: p.unitType === "bottle" ? "bottle" : "tablet",
      piecesPerStrip: String(p.piecesPerStrip ?? 1),
      stripsPerBox: p.stripsPerBox ? String(p.stripsPerBox) : "",
      imageUrl: p.imageUrl || "",
    });
    setOpenModal(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError(t("products.uploadFail"));
      return;
    }
    setUploadError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const token = typeof window !== "undefined" ? localStorage.getItem("apex_token") : null;
      const res = await fetch("/api/upload", {
        method: "POST",
        body,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.message || "Upload failed");
      setForm((prev) => ({ ...prev, imageUrl: data.url }));
    } catch {
      setUploadError(t("products.uploadFail"));
    } finally {
      e.target.value = "";
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError("");
    const isBottle = form.packType === "bottle";
    const payload = {
      name: form.name,
      barcode: form.barcode || undefined,
      costPrice: Number(form.costPrice),
      sellingPrice: Number(form.sellingPrice),
      stockQuantity: Number(form.stockQuantity),
      unitType: isBottle ? "bottle" : "tablet",
      piecesPerStrip: isBottle ? 1 : Number(form.piecesPerStrip) || 1,
      stripsPerBox: isBottle ? null : form.stripsPerBox ? Number(form.stripsPerBox) : null,
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
      setSaveError(t("products.saveFail"));
    }
  };

  const remove = async (id: string) => {
    await api.delete(`/api/v1/products/${id}`);
    await load();
  };

  const columns = useMemo(
    () => [
      {
        key: "image",
        header: t("image"),
        hideOnMobile: true,
        cell: (p: Product) => <ProductThumb src={p.imageUrl} alt={p.name} size="lg" />,
      },
      {
        key: "name",
        header: t("name"),
        cell: (p: Product) => (
          <span className="font-medium flex items-center gap-3">
            <span className="md:hidden"><ProductThumb src={p.imageUrl} alt={p.name} size="md" /></span>
            {p.name}
          </span>
        ),
      },
      { key: "barcode", header: t("barcode"), cell: (p: Product) => p.barcode || "-" },
      {
        key: "retail",
        header: t("retail"),
        cell: (p: Product) => (
          <span>
            {formatBDT(Number(p.sellingPrice))}/{isBottleProduct(p) ? t("units.perBottle") : t("units.perPiece")}
          </span>
        ),
      },
      { key: "stock", header: t("stock"), cell: (p: Product) => formatStockPieces(p.stockQuantity, p) },
      {
        key: "status",
        header: t("status"),
        cell: (p: Product) => {
          const statusClass = p.stockQuantity === 0 ? "bg-red-100 text-red-700" : p.stockQuantity <= 10 ? "bg-amber-100 text-amber-700" : "bg-orange-100 text-orange-700";
          const status = p.stockQuantity === 0 ? t("out") : p.stockQuantity <= 10 ? t("low") : t("active");
          return <span className={`status-pill ${statusClass}`}>{status}</span>;
        },
      },
      {
        key: "actions",
        header: t("actions"),
        align: "right" as const,
        cell: (p: Product) => (
          <div className="inline-flex gap-2">
            <button type="button" className="icon-btn icon-btn-edit" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></button>
            <button type="button" className="icon-btn icon-btn-delete" onClick={() => remove(p.id)}><Trash2 className="w-4 h-4" /></button>
          </div>
        ),
      },
    ],
    [t],
  );

  return (
    <AppShell title={t("products.title")}>
      <div className="page-toolbar">
        <input className="input" placeholder={t("products.search")} value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="btn btn-primary flex items-center justify-center gap-2 w-full sm:w-auto shrink-0" onClick={openCreate}><Plus className="w-5 h-5" /> {t("products.add")}</button>
      </div>

      <ResponsiveTable rows={filtered} rowKey={(p) => p.id} columns={columns} />

      {openModal ? (
        <div className="modal-overlay">
          <div className="card w-full max-w-2xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">{editingId ? t("products.edit") : t("products.create")}</h3>
              <button type="button" className="icon-btn btn-outline" onClick={() => setOpenModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={save} className="grid md:grid-cols-2 gap-3">
              <input className="input" placeholder={t("products.medicineName")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <input className="input" placeholder={t("products.barcodeOpt")} value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} />
              <div className="md:col-span-2">
                <label className="form-label">{t("units.medicineType")}</label>
                <select
                  className="input w-full"
                  value={form.packType}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      packType: e.target.value as PackType,
                      piecesPerStrip: e.target.value === "bottle" ? "1" : form.piecesPerStrip,
                      stripsPerBox: e.target.value === "bottle" ? "" : form.stripsPerBox,
                    })
                  }
                >
                  <option value="tablet">{t("units.typeTablet")}</option>
                  <option value="bottle">{t("units.typeBottle")}</option>
                </select>
              </div>
              <input
                className="input"
                placeholder={form.packType === "bottle" ? t("units.costPerBottle") : t("units.costPerPiece")}
                value={form.costPrice}
                onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
                required
              />
              <input
                className="input"
                placeholder={form.packType === "bottle" ? t("units.pricePerBottle") : t("units.pricePerPiece")}
                value={form.sellingPrice}
                onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })}
                required
              />
              {form.packType === "tablet" ? (
                <>
                  <input className="input" type="number" min={1} placeholder={t("units.piecesPerStrip")} value={form.piecesPerStrip} onChange={(e) => setForm({ ...form, piecesPerStrip: e.target.value })} required />
                  <input className="input" type="number" min={1} placeholder={t("units.stripsPerBox")} value={form.stripsPerBox} onChange={(e) => setForm({ ...form, stripsPerBox: e.target.value })} />
                </>
              ) : null}
              <input
                className="input md:col-span-2"
                type="number"
                min={0}
                placeholder={form.packType === "bottle" ? t("units.stockBottles") : t("units.stockPieces")}
                value={form.stockQuantity}
                onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
                required
              />

              <div className="md:col-span-2 grid md:grid-cols-2 gap-3 items-center">
                <label className="input flex items-center gap-2 cursor-pointer">
                  <Upload className="w-5 h-5" />
                  <span>{t("products.uploadImage")}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
                <input
                  className="input"
                  placeholder={form.imageUrl ? t("products.imageUploaded") : t("products.imageUrlOpt")}
                  value={form.imageUrl.startsWith("http") ? form.imageUrl : ""}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                />
              </div>
              {uploadError ? <p className="md:col-span-2 text-base text-red-600">{uploadError}</p> : null}
              {saveError ? <p className="md:col-span-2 text-base text-red-600">{saveError}</p> : null}

              {form.imageUrl ? (
                <div className="md:col-span-2">
                  <ProductThumb src={form.imageUrl} alt="Preview" size="xl" />
                </div>
              ) : null}

              <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                <button type="button" className="btn btn-outline" onClick={() => setOpenModal(false)}>{t("cancel")}</button>
                <button type="submit" className="btn btn-primary">{editingId ? t("update") : t("create")}</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
