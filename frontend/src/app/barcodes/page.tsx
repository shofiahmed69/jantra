"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { api } from "@/lib/api";
import { Eye, X } from "lucide-react";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { SearchField } from "@/components/ui/search-field";
import { useLanguage } from "@/lib/i18n/language-provider";

type Product = { id: string; name: string; barcode?: string };
type Generated = { productId: string; productName: string; barcode: string; imageBase64: string; mimeType: string };

export default function BarcodesPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [generated, setGenerated] = useState<Generated | null>(null);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    api.get("/api/v1/products?page=1&limit=100").then((res) => setProducts(res.data.data)).catch(() => null);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q) || (p.barcode || "").toLowerCase().includes(q));
  }, [products, search]);

  const printSheet = async () => {
    const ids = selected.length ? selected : filtered.map((p) => p.id);
    if (!ids.length) {
      alert(t("barcodes.selectProducts"));
      return;
    }
    setPrinting(true);
    try {
      const res = await api.get(`/api/v1/barcodes/print-sheet?productIds=${ids.join(",")}`, { responseType: "blob" });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const opened = window.open(url, "_blank");
      if (!opened) {
        const a = document.createElement("a");
        a.href = url;
        a.download = "barcode-sheet.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
      window.setTimeout(() => window.URL.revokeObjectURL(url), 60_000);
    } catch {
      alert(t("barcodes.printFail"));
    } finally {
      setPrinting(false);
    }
  };

  const generate = async (productId: string) => {
    const res = await api.get(`/api/v1/barcodes/generate/${productId}`);
    setGenerated(res.data.data);
    setSelected((prev) => (prev.includes(productId) ? prev : [...prev, productId]));
    setOpenModal(true);
  };

  const toggleSelect = (productId: string) => {
    setSelected((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]));
  };

  return (
    <AppShell title={t("barcodes.title")}>
      <div className="page-toolbar">
        <SearchField value={search} onChange={setSearch} placeholder={t("barcodes.search")} />
        <button
          type="button"
          className="btn btn-outline w-full sm:w-auto shrink-0"
          disabled={printing || filtered.length === 0}
          onClick={printSheet}
        >
          {printing ? t("barcodes.printing") : t("barcodes.print")}
        </button>
      </div>

      <ResponsiveTable
        rows={filtered}
        rowKey={(p) => p.id}
        columns={[
          {
            key: "select",
            header: "",
            hideOnMobile: true,
            cell: (p) => (
              <input
                type="checkbox"
                checked={selected.includes(p.id)}
                onChange={() => toggleSelect(p.id)}
                aria-label={`Select ${p.name}`}
              />
            ),
          },
          { key: "product", header: t("barcodes.product"), cell: (p) => <span className="font-medium text-lg">{p.name}</span> },
          {
            key: "barcode",
            header: t("barcode"),
            cell: (p) => <span className="break-all text-sm sm:text-base">{p.barcode || "-"}</span>,
          },
          {
            key: "actions",
            header: t("actions"),
            align: "right",
            cell: (p) => (
              <div className="inline-flex gap-2 items-center">
                <input
                  type="checkbox"
                  className="md:hidden h-5 w-5"
                  checked={selected.includes(p.id)}
                  onChange={() => toggleSelect(p.id)}
                  aria-label={`Select ${p.name}`}
                />
                <button type="button" className="icon-btn icon-btn-edit" onClick={() => generate(p.id)}>
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            ),
          },
        ]}
      />

      {openModal && generated ? (
        <div className="modal-overlay">
          <div className="card w-full max-w-lg p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">{t("barcodes.preview")}</h3>
              <button type="button" className="icon-btn btn-outline" onClick={() => setOpenModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <p className="font-medium mb-2">{generated.productName}</p>
            <img src={`data:${generated.mimeType};base64,${generated.imageBase64}`} alt={generated.barcode} className="w-full bg-white border rounded" />
            <p className="mt-2 text-base break-all">{t("barcode")}: {generated.barcode}</p>
            <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-end">
              <button type="button" className="btn btn-primary" onClick={printSheet} disabled={printing}>
                {printing ? t("barcodes.printing") : t("barcodes.print")}
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setOpenModal(false)}>{t("close")}</button>
            </div>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
