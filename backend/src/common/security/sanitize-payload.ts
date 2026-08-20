/** Strip tenant/control fields clients must not set on update/create spreads */
export function stripTenantFields<T extends Record<string, unknown>>(payload: T): Omit<T, 'pharmacyId' | 'pharmacy_id' | 'id' | 'createdAt' | 'updatedAt'> {
  const { pharmacyId, pharmacy_id, id, createdAt, updatedAt, ...rest } = payload;
  void pharmacyId;
  void pharmacy_id;
  void id;
  void createdAt;
  void updatedAt;
  return rest;
}

export function pickFields<T extends Record<string, unknown>, K extends keyof T>(payload: T, keys: K[]): Pick<T, K> {
  const out = {} as Pick<T, K>;
  for (const key of keys) {
    if (payload[key] !== undefined) out[key] = payload[key];
  }
  return out;
}
