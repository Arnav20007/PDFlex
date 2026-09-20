// src/services/imageTools.ts
// 100% Client-Side HTML5 Canvas Image Processing Engine

export interface ImageCompressionResult {
  blob: Blob;
  originalSize: number;
  compressedSize: number;
  savedPercent: number;
  fileName: string;
}

export async function compressImage(
  file: File,
  quality: number = 0.75 // 0.1 to 1.0
): Promise<ImageCompressionResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Unable to create canvas rendering context."));
        return;
      }

      ctx.drawImage(img, 0, 0);

      const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Image compression failed."));
          return;
        }

        const originalSize = file.size;
        const compressedSize = blob.size;
        const savedPercent = Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100));

        const ext = mimeType === 'image/png' ? 'png' : 'jpg';
        const baseName = file.name.replace(/\.[^/.]+$/, "");
        resolve({
          blob,
          originalSize,
          compressedSize,
          savedPercent,
          fileName: `${baseName}_compressed.${ext}`
        });
      }, mimeType, quality);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for compression."));
    };

    img.src = url;
  });
}

export async function resizeImage(
  file: File,
  targetWidth: number,
  targetHeight: number,
  maintainAspectRatio: boolean = true
): Promise<{ blob: Blob; fileName: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      let w = targetWidth;
      let h = targetHeight;

      if (maintainAspectRatio) {
        const ratio = img.naturalWidth / img.naturalHeight;
        if (w / h > ratio) {
          w = Math.round(h * ratio);
        } else {
          h = Math.round(w / ratio);
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Canvas context failed."));
        return;
      }

      ctx.drawImage(img, 0, 0, w, h);
      const mimeType = file.type || 'image/jpeg';

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Image resize failed."));
          return;
        }
        const baseName = file.name.replace(/\.[^/.]+$/, "");
        const ext = file.name.split('.').pop() || 'jpg';
        resolve({
          blob,
          fileName: `${baseName}_resized.${ext}`
        });
      }, mimeType, 0.92);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for resizing."));
    };

    img.src = url;
  });
}

export async function convertImageFormat(
  file: File,
  targetFormat: 'jpeg' | 'png' | 'webp'
): Promise<{ blob: Blob; fileName: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Canvas context failed."));
        return;
      }

      // If converting to JPEG, fill white background for transparent PNGs
      if (targetFormat === 'jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);
      const mimeType = `image/${targetFormat}`;

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error(`Failed to convert image to ${targetFormat}.`));
          return;
        }
        const baseName = file.name.replace(/\.[^/.]+$/, "");
        const ext = targetFormat === 'jpeg' ? 'jpg' : targetFormat;
        resolve({
          blob,
          fileName: `${baseName}.${ext}`
        });
      }, mimeType, 0.92);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for conversion."));
    };

    img.src = url;
  });
}
