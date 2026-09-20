// src/services/backendApi.ts
// Client service for open-source Python backend (FastAPI / PyMuPDF / pdf2docx)

// In dev: Vite proxies /api/* to localhost:8000 (empty string = relative URL)
// In production: VITE_BACKEND_URL = https://pdflex-backend.onrender.com
const BASE_URL = import.meta.env.VITE_BACKEND_URL ?? '';

export interface CompressionResult {
  blob: Blob;
  originalSize: number;
  compressedSize: number;
  savedPercent: number;
  fileName: string;
}

export async function compressPDF(
  file: File,
  level: 'low' | 'recommended' | 'extreme' = 'recommended',
  signal?: AbortSignal
): Promise<CompressionResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('level', level);

  const res = await fetch(`${BASE_URL}/api/compress`, {
    method: 'POST',
    body: formData,
    signal
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Compression failed (HTTP ${res.status})`);
  }

  const blob = await res.blob();
  const originalSize = parseInt(res.headers.get('X-Original-Size') || file.size.toString(), 10);
  const compressedSize = parseInt(res.headers.get('X-Compressed-Size') || blob.size.toString(), 10);
  const savedPercent = parseFloat(res.headers.get('X-Saved-Percent') || '0.0');

  const baseName = file.name.replace(/\.[^/.]+$/, "");
  const fileName = `${baseName}_compressed.pdf`;

  return {
    blob,
    originalSize,
    compressedSize,
    savedPercent,
    fileName
  };
}

export async function convertPDFToWord(
  file: File,
  signal?: AbortSignal
): Promise<{ blob: Blob; fileName: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${BASE_URL}/api/pdf-to-docx`, {
    method: 'POST',
    body: formData,
    signal
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Word conversion failed (HTTP ${res.status})`);
  }

  const blob = await res.blob();
  const baseName = file.name.replace(/\.[^/.]+$/, "");
  const fileName = `${baseName}.docx`;

  return {
    blob,
    fileName
  };
}

export async function convertPDFToTxt(
  file: File,
  signal?: AbortSignal
): Promise<{ blob: Blob; fileName: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${BASE_URL}/api/pdf-to-txt`, {
    method: 'POST',
    body: formData,
    signal
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Text extraction failed (HTTP ${res.status})`);
  }

  const blob = await res.blob();
  const baseName = file.name.replace(/\.[^/.]+$/, "");
  const fileName = `${baseName}.txt`;

  return {
    blob,
    fileName
  };
}

export async function convertPDFToImages(
  file: File,
  fmt: 'jpg' | 'png' = 'jpg',
  signal?: AbortSignal
): Promise<{ blob: Blob; fileName: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fmt', fmt);

  const res = await fetch(`${BASE_URL}/api/pdf-to-images`, {
    method: 'POST',
    body: formData,
    signal
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Image extraction failed (HTTP ${res.status})`);
  }

  const blob = await res.blob();
  const baseName = file.name.replace(/\.[^/.]+$/, "");
  const isZip = blob.type.includes("zip") || res.headers.get("content-type")?.includes("zip");
  const fileName = isZip ? `${baseName}_images.zip` : `${baseName}_page1.${fmt}`;

  return {
    blob,
    fileName
  };
}
