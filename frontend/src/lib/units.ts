export type UnitLevel = "piece" | "strip" | "box" | "bottle";

export type UnitProduct = {
  unitType?: string | null;
  piecesPerStrip?: number | null;
  stripsPerBox?: number | null;
};

export function isBottleProduct(p: UnitProduct): boolean {
  return p.unitType === "bottle";
}

export function piecesPerStrip(p: UnitProduct): number {
  const n = Number(p.piecesPerStrip ?? 1);
  return n > 0 ? Math.floor(n) : 1;
}

export function stripsPerBox(p: UnitProduct): number | null {
  const n = p.stripsPerBox;
  if (n == null || n <= 0) return null;
  return Math.floor(n);
}

export function toPieces(qty: number, unit: UnitLevel, product: UnitProduct): number {
  const q = Math.floor(Number(qty));
  if (q <= 0) return 0;
  if (unit === "bottle" || (unit === "piece" && isBottleProduct(product))) return q;
  const pps = piecesPerStrip(product);
  if (unit === "piece") return q;
  if (unit === "strip") return q * pps;
  const spb = stripsPerBox(product);
  if (!spb) return q * pps;
  return q * spb * pps;
}

export function formatStockPieces(pieces: number, product: UnitProduct): string {
  if (isBottleProduct(product)) {
    return pieces === 1 ? "1 bottle" : `${pieces} bottles`;
  }
  const pps = piecesPerStrip(product);
  if (pps <= 1) return `${pieces} pcs`;
  const strips = Math.floor(pieces / pps);
  const rem = pieces % pps;
  if (rem === 0) return `${pieces} pcs (${strips} strips)`;
  return `${pieces} pcs (${strips} strips + ${rem})`;
}

export function unitLabel(unit: UnitLevel, t: (k: string) => string): string {
  if (unit === "piece") return t("units.piece");
  if (unit === "strip") return t("units.strip");
  if (unit === "box") return t("units.box");
  if (unit === "bottle") return t("units.bottle");
  return unit;
}

export function availableSellUnits(product: UnitProduct): UnitLevel[] {
  if (isBottleProduct(product)) return ["bottle"];
  const pps = piecesPerStrip(product);
  const spb = stripsPerBox(product);
  const units: UnitLevel[] = ["piece"];
  if (pps > 1) units.push("strip");
  if (spb) units.push("box");
  return units;
}

export function sellUnitOptionsForPos(): UnitLevel[] {
  return ["piece", "strip", "box", "bottle"];
}
