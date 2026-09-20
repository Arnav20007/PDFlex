// src/services/pdfTools.ts
import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib';

export interface LocalToolProgress {
  percent: number;
  message: string;
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

// 1. Merge PDFs (Client-Side)
export async function mergePDFs(
  files: File[],
  onProgress?: (p: LocalToolProgress) => void
): Promise<{ blob: Blob; fileName: string }> {
  if (files.length < 2) {
    throw new Error("Please select at least 2 PDF files to merge.");
  }

  onProgress?.({ percent: 10, message: 'Initializing PDF merger...' });
  const mergedPdf = await PDFDocument.create();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    onProgress?.({
      percent: Math.round(15 + ((i + 1) / files.length) * 70),
      message: `Merging ${file.name} (${i + 1} of ${files.length})...`
    });

    const fileBytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(fileBytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  onProgress?.({ percent: 90, message: 'Saving merged document...' });
  const mergedPdfBytes = await mergedPdf.save();
  const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });

  onProgress?.({ percent: 100, message: 'Merged successfully!' });
  return {
    blob,
    fileName: `merged_${Date.now()}.pdf`
  };
}

// 2. Split PDF (Client-Side)
export async function splitPDF(
  file: File,
  pageRangeStr: string = "1",
  onProgress?: (p: LocalToolProgress) => void
): Promise<{ blob: Blob; fileName: string }> {
  onProgress?.({ percent: 20, message: 'Reading document...' });
  const fileBytes = await file.arrayBuffer();
  const srcPdf = await PDFDocument.load(fileBytes);
  const totalPages = srcPdf.getPageCount();

  onProgress?.({ percent: 50, message: 'Extracting pages...' });
  const newPdf = await PDFDocument.create();

  const pageIndices: number[] = [];
  const parts = pageRangeStr.split(',').map(s => s.trim());

  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(n => parseInt(n.trim()));
      if (!isNaN(start) && !isNaN(end)) {
        for (let p = Math.max(1, start); p <= Math.min(totalPages, end); p++) {
          pageIndices.push(p - 1);
        }
      }
    } else {
      const pageNum = parseInt(part);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        pageIndices.push(pageNum - 1);
      }
    }
  }

  const uniqueIndices = Array.from(new Set(pageIndices)).sort((a, b) => a - b);
  const pagesToCopy = uniqueIndices.length > 0 ? uniqueIndices : [0];

  const copiedPages = await newPdf.copyPages(srcPdf, pagesToCopy);
  copiedPages.forEach((page) => newPdf.addPage(page));

  onProgress?.({ percent: 85, message: 'Building separated PDF...' });
  const pdfBytes = await newPdf.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });

  onProgress?.({ percent: 100, message: 'Extracted successfully!' });
  return {
    blob,
    fileName: `${file.name.replace(/\.[^/.]+$/, "")}_split.pdf`
  };
}

// 3. Rotate PDF (Client-Side)
export async function rotatePDF(
  file: File,
  rotationAngle: number = 90,
  onProgress?: (p: LocalToolProgress) => void
): Promise<{ blob: Blob; fileName: string }> {
  onProgress?.({ percent: 25, message: 'Loading PDF...' });
  const fileBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(fileBytes);

  onProgress?.({ percent: 60, message: `Rotating pages by ${rotationAngle}°...` });
  const pages = pdfDoc.getPages();
  pages.forEach((page) => {
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees((currentRotation + rotationAngle) % 360));
  });

  onProgress?.({ percent: 85, message: 'Saving rotated document...' });
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });

  onProgress?.({ percent: 100, message: 'Rotated successfully!' });
  return {
    blob,
    fileName: `${file.name.replace(/\.[^/.]+$/, "")}_rotated.pdf`
  };
}

// 4. Delete PDF Pages (Client-Side)
export async function deletePDFPages(
  file: File,
  pagesToDeleteStr: string,
  onProgress?: (p: LocalToolProgress) => void
): Promise<{ blob: Blob; fileName: string }> {
  onProgress?.({ percent: 20, message: 'Analyzing PDF pages...' });
  const fileBytes = await file.arrayBuffer();
  const srcPdf = await PDFDocument.load(fileBytes);
  const totalPages = srcPdf.getPageCount();

  const deleteIndices = new Set<number>();
  const parts = pagesToDeleteStr.split(',').map(s => s.trim());
  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(n => parseInt(n.trim()));
      if (!isNaN(start) && !isNaN(end)) {
        for (let p = start; p <= end; p++) {
          if (p >= 1 && p <= totalPages) deleteIndices.add(p - 1);
        }
      }
    } else {
      const p = parseInt(part);
      if (!isNaN(p) && p >= 1 && p <= totalPages) deleteIndices.add(p - 1);
    }
  }

  const remainingIndices: number[] = [];
  for (let i = 0; i < totalPages; i++) {
    if (!deleteIndices.has(i)) remainingIndices.push(i);
  }

  if (remainingIndices.length === 0) {
    throw new Error("Cannot delete all pages from the PDF document.");
  }

  onProgress?.({ percent: 60, message: 'Rebuilding PDF without removed pages...' });
  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(srcPdf, remainingIndices);
  copiedPages.forEach(page => newPdf.addPage(page));

  const pdfBytes = await newPdf.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });

  onProgress?.({ percent: 100, message: 'Pages deleted successfully!' });
  return {
    blob,
    fileName: `${file.name.replace(/\.[^/.]+$/, "")}_clean.pdf`
  };
}

// 5. Watermark PDF (Client-Side)
export async function watermarkPDF(
  file: File,
  text: string,
  options?: { size?: number; opacity?: number; rotation?: number },
  onProgress?: (p: LocalToolProgress) => void
): Promise<{ blob: Blob; fileName: string }> {
  if (!text || text.trim().length === 0) {
    throw new Error("Watermark text cannot be empty.");
  }

  onProgress?.({ percent: 20, message: 'Loading PDF for watermarking...' });
  const fileBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(fileBytes);
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const pages = pdfDoc.getPages();

  const fontSize = options?.size || 48;
  const opacity = options?.opacity || 0.25;
  const rotationDeg = options?.rotation || 45;

  onProgress?.({ percent: 50, message: 'Applying watermark across pages...' });
  pages.forEach((page) => {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, fontSize);

    page.drawText(text, {
      x: width / 2 - textWidth / 2,
      y: height / 2,
      size: fontSize,
      font,
      color: rgb(0.3, 0.3, 0.3),
      opacity,
      rotate: degrees(rotationDeg),
    });
  });

  onProgress?.({ percent: 85, message: 'Exporting watermarked PDF...' });
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });

  onProgress?.({ percent: 100, message: 'Watermark applied successfully!' });
  return {
    blob,
    fileName: `${file.name.replace(/\.[^/.]+$/, "")}_watermarked.pdf`
  };
}

// 6. Add Page Numbers (Client-Side)
export async function addPageNumbers(
  file: File,
  startNumber: number = 1,
  onProgress?: (p: LocalToolProgress) => void
): Promise<{ blob: Blob; fileName: string }> {
  onProgress?.({ percent: 20, message: 'Loading document...' });
  const fileBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(fileBytes);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  const total = pages.length;

  onProgress?.({ percent: 50, message: 'Numbering pages...' });
  pages.forEach((page, idx) => {
    const { width } = page.getSize();
    const pageNumText = `Page ${idx + startNumber} of ${total + startNumber - 1}`;
    const textWidth = font.widthOfTextAtSize(pageNumText, 10);

    page.drawText(pageNumText, {
      x: width / 2 - textWidth / 2,
      y: 20,
      size: 10,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });

  onProgress?.({ percent: 100, message: 'Page numbers added!' });
  return {
    blob,
    fileName: `${file.name.replace(/\.[^/.]+$/, "")}_numbered.pdf`
  };
}

// Helper: convert any image format (including webp, bmp, gif) to PNG/JPG ArrayBuffer for pdf-lib
async function imageToEmbeddable(file: File): Promise<{ bytes: Uint8Array; format: 'jpg' | 'png' }> {
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext === 'png') {
    const buf = await file.arrayBuffer();
    return { bytes: new Uint8Array(buf), format: 'png' };
  }
  if (ext === 'jpg' || ext === 'jpeg') {
    const buf = await file.arrayBuffer();
    return { bytes: new Uint8Array(buf), format: 'jpg' };
  }

  // WebP, GIF, BMP, etc. -> convert via canvas to standard JPEG
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error("Canvas context failed"));
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(async (blob) => {
        if (!blob) return reject(new Error("Failed to process image"));
        const buf = await blob.arrayBuffer();
        resolve({ bytes: new Uint8Array(buf), format: 'jpg' });
      }, 'image/jpeg', 0.95);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for PDF embedding"));
    };
    img.src = url;
  });
}

// 7. Images to PDF (Client-Side, Multi-Image, Universal Format Support)
export async function imagesToPDF(
  files: File[],
  onProgress?: (p: LocalToolProgress) => void
): Promise<{ blob: Blob; fileName: string }> {
  if (files.length === 0) {
    throw new Error("Please select at least one image.");
  }

  onProgress?.({ percent: 10, message: 'Initializing document...' });
  const pdfDoc = await PDFDocument.create();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    onProgress?.({
      percent: Math.round(15 + ((i + 1) / files.length) * 70),
      message: `Embedding ${file.name} (${i + 1} of ${files.length})...`
    });

    const { bytes, format } = await imageToEmbeddable(file);
    const embeddedImg = format === 'png'
      ? await pdfDoc.embedPng(bytes)
      : await pdfDoc.embedJpg(bytes);

    const { width, height } = embeddedImg.scale(1);
    const page = pdfDoc.addPage([width, height]);
    page.drawImage(embeddedImg, {
      x: 0,
      y: 0,
      width,
      height,
    });
  }

  onProgress?.({ percent: 90, message: 'Saving PDF...' });
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });

  onProgress?.({ percent: 100, message: 'Images compiled into PDF!' });
  return {
    blob,
    fileName: `images_${Date.now()}.pdf`
  };
}

// 8. Compress PDF (100% Client-Side Stream & Object Optimization)
export async function compressPDF(
  file: File,
  _level: 'low' | 'recommended' | 'extreme' = 'recommended',
  onProgress?: (p: LocalToolProgress) => void
): Promise<{
  blob: Blob;
  originalSize: number;
  compressedSize: number;
  savedPercent: number;
  fileName: string;
}> {
  onProgress?.({ percent: 15, message: 'Analyzing PDF stream structure in browser...' });
  const fileBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });

  onProgress?.({ percent: 55, message: 'Compressing object streams and stripping duplicate xref tables...' });
  const compressedBytes = await pdfDoc.save({ useObjectStreams: true });

  const originalSize = file.size;
  const compressedSize = compressedBytes.byteLength;
  const savedPercent = Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100));

  const baseName = file.name.replace(/\.[^/.]+$/, "");
  const blob = new Blob([compressedBytes], { type: 'application/pdf' });

  onProgress?.({ percent: 100, message: 'PDF compressed successfully!' });
  return {
    blob,
    originalSize,
    compressedSize,
    savedPercent,
    fileName: `${baseName}_compressed.pdf`
  };
}

