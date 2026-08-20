import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

const MAX_BYTES = 3 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

async function verifyAuth(request: Request): Promise<boolean> {
  const auth = request.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return false;

  const backend = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!backend) return false;

  const res = await fetch(`${backend.replace(/\/$/, '')}/api/v1/auth/profile`, {
    headers: { Authorization: auth },
    cache: 'no-store',
  });
  return res.ok;
}

export async function POST(request: Request) {
  try {
    if (!(await verifyAuth(request))) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const form = await request.formData();
    const file = form.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ success: false, message: 'Only JPEG, PNG, WebP, or GIF images are allowed' }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ success: false, message: 'Image must be 3MB or smaller' }, { status: 400 });
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80);
    const blob = await put(`products/${Date.now()}-${safeName}`, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    return NextResponse.json({ success: true, url: blob.url });
  } catch {
    return NextResponse.json({ success: false, message: 'Upload failed' }, { status: 500 });
  }
}
