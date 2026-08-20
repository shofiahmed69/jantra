export type UnitLevel = 'piece' | 'strip' | 'box' | 'bottle';

export type UnitProduct = {
  unitType?: string | null;
  piecesPerStrip?: number | null;
  stripsPerBox?: number | null;
};

export function isBottleProduct(product: UnitProduct): boolean {
  return product.unitType === 'bottle';
}

export function piecesPerStrip(product: UnitProduct): number {
  const n = Number(product.piecesPerStrip ?? 1);
  return n > 0 ? Math.floor(n) : 1;
}

export function stripsPerBox(product: UnitProduct): number | null {
  const n = product.stripsPerBox;
  if (n == null || n <= 0) return null;
  return Math.floor(n);
}

/** Convert a quantity in piece / strip / box / bottle into base stock units (pieces). */
export function toPieces(qty: number, unit: UnitLevel, product: UnitProduct): number {
  const q = Math.floor(Number(qty));
  if (q <= 0) return 0;
  if (unit === 'bottle' || (unit === 'piece' && isBottleProduct(product))) return q;
  const pps = piecesPerStrip(product);
  if (unit === 'piece') return q;
  if (unit === 'strip') return q * pps;
  const spb = stripsPerBox(product);
  if (!spb) throw new Error('This product has no box size configured');
  return q * spb * pps;
}

export function costPerPiece(totalLineCost: number, qty: number, unit: UnitLevel, product: UnitProduct): number {
  const pieces = toPieces(qty, unit, product);
  if (pieces <= 0) return 0;
  return Number((totalLineCost / pieces).toFixed(4));
}
