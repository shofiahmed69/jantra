const WEAK_JWT_SECRETS = new Set(['change-me', 'secret', 'jwt-secret', 'your-secret']);

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
}

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret || WEAK_JWT_SECRETS.has(secret)) {
    if (isProduction()) {
      throw new Error('JWT_SECRET must be set to a strong random value in production');
    }
    return 'dev-only-change-me-not-for-production';
  }
  return secret;
}

export function getCorsOrigins(): string[] | boolean {
  const raw = process.env.CORS_ORIGINS?.trim();
  if (!raw) {
    if (isProduction()) {
      return ['https://frontend-xi-three-35.vercel.app'];
    }
    return true;
  }
  if (raw === '*') return true;
  return raw.split(',').map((o) => o.trim()).filter(Boolean);
}

export function assertProductionSecrets(): void {
  if (!isProduction()) return;
  getJwtSecret();
  if (!process.env.DATABASE_URL?.trim()) {
    throw new Error('DATABASE_URL is required in production');
  }
}
