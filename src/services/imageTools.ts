// src/services/imageTools.ts
// 100% Client-Side HTML5 Canvas Image Processing Engine

export interface ImageCompressionResult {
  blob: Blob;
  originalSize: number;
  compressedSize: number;
  savedPercent: number;
  fileName: string;
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DimensionResult {
  width: number;
  height: number;
}

// 1. Read Image Dimensions
export function getImageDimensions(file: File): Promise<DimensionResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image dimensions."));
    };
    img.src = url;
  });
}

// 2. Compress Image
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

      // WebP and JPEG allow quality compression; PNG is lossless in canvas
      const isPng = file.type === 'image/png';
      const mimeType = isPng ? 'image/png' : 'image/jpeg';

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Image compression failed."));
          return;
        }

        const originalSize = file.size;
        const compressedSize = blob.size;
        const savedPercent = Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100));

        const ext = isPng ? 'png' : 'jpg';
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

// 3. Resize Image
export async function resizeImage(
  file: File,
  targetWidth: number,
  targetHeight: number,
  maintainAspectRatio: boolean = true
): Promise<{ blob: Blob; fileName: string; originalWidth: number; originalHeight: number; newWidth: number; newHeight: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const originalWidth = img.naturalWidth;
      const originalHeight = img.naturalHeight;
      let w = targetWidth;
      let h = targetHeight;

      if (maintainAspectRatio) {
        const ratio = originalWidth / originalHeight;
        if (w / h > ratio) {
          w = Math.round(h * ratio);
        } else {
          h = Math.round(w / ratio);
        }
      }

      w = Math.max(1, w);
      h = Math.max(1, h);

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Canvas context failed."));
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
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
          fileName: `${baseName}_${w}x${h}.${ext}`,
          originalWidth,
          originalHeight,
          newWidth: w,
          newHeight: h
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

// 4. Convert Image Format (JPG, PNG, WebP, GIF, BMP)
export async function convertImageFormat(
  file: File,
  targetFormat: 'jpeg' | 'png' | 'webp',
  quality: number = 0.92
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

      // When converting transparent formats to JPEG, draw solid white background
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
      }, mimeType, quality);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for conversion."));
    };

    img.src = url;
  });
}

// 5. Crop Image
export async function cropImage(
  file: File,
  crop: CropArea
): Promise<{ blob: Blob; fileName: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      const cropW = Math.max(1, Math.min(crop.width, img.naturalWidth - crop.x));
      const cropH = Math.max(1, Math.min(crop.height, img.naturalHeight - crop.y));
      canvas.width = cropW;
      canvas.height = cropH;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Canvas context failed."));
        return;
      }

      ctx.drawImage(
        img,
        Math.max(0, crop.x),
        Math.max(0, crop.y),
        cropW,
        cropH,
        0,
        0,
        cropW,
        cropH
      );

      const mimeType = file.type || 'image/jpeg';
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Failed to crop image."));
          return;
        }
        const baseName = file.name.replace(/\.[^/.]+$/, "");
        const ext = file.name.split('.').pop() || 'jpg';
        resolve({
          blob,
          fileName: `${baseName}_cropped.${ext}`
        });
      }, mimeType, 0.95);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for cropping."));
    };

    img.src = url;
  });
}

// 6. Rotate Image
export async function rotateImage(
  file: File,
  angleDegrees: number = 90
): Promise<{ blob: Blob; fileName: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      const angle = ((angleDegrees % 360) + 360) % 360;

      // Swap dimensions for 90° and 270°
      if (angle === 90 || angle === 270) {
        canvas.width = img.naturalHeight;
        canvas.height = img.naturalWidth;
      } else {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Canvas context failed."));
        return;
      }

      if (file.type === 'image/jpeg' || file.name.toLowerCase().endsWith('.jpg')) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

      const mimeType = file.type || 'image/jpeg';
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Failed to rotate image."));
          return;
        }
        const baseName = file.name.replace(/\.[^/.]+$/, "");
        const ext = file.name.split('.').pop() || 'jpg';
        resolve({
          blob,
          fileName: `${baseName}_rotated_${angle}deg.${ext}`
        });
      }, mimeType, 0.95);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for rotation."));
    };

    img.src = url;
  });
}

// 7. Flip Image (Horizontal / Vertical / Both)
export async function flipImage(
  file: File,
  direction: 'horizontal' | 'vertical' | 'both' = 'horizontal'
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

      ctx.save();
      if (direction === 'horizontal') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      } else if (direction === 'vertical') {
        ctx.translate(0, canvas.height);
        ctx.scale(1, -1);
      } else {
        ctx.translate(canvas.width, canvas.height);
        ctx.scale(-1, -1);
      }

      ctx.drawImage(img, 0, 0);
      ctx.restore();

      const mimeType = file.type || 'image/jpeg';
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Failed to flip image."));
          return;
        }
        const baseName = file.name.replace(/\.[^/.]+$/, "");
        const ext = file.name.split('.').pop() || 'jpg';
        resolve({
          blob,
          fileName: `${baseName}_flipped_${direction}.${ext}`
        });
      }, mimeType, 0.95);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for flipping."));
    };

    img.src = url;
  });
}

// 8. Image to Base64
export function imageToBase64(
  file: File
): Promise<{ base64: string; dataUrl: string; fileName: string; sizeBytes: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      resolve({
        base64,
        dataUrl,
        fileName: `${baseName}_base64.txt`,
        sizeBytes: dataUrl.length
      });
    };
    reader.onerror = () => reject(new Error("Failed to read image as Base64."));
    reader.readAsDataURL(file);
  });
}

// 9. Base64 to Image
export async function base64ToImage(
  input: string,
  fileName: string = 'decoded_image.png'
): Promise<{ blob: Blob; fileName: string; previewUrl: string }> {
  let cleanInput = input.trim();
  if (!cleanInput.startsWith('data:image/')) {
    // Default to PNG data URL header
    cleanInput = `data:image/png;base64,${cleanInput}`;
  }

  const res = await fetch(cleanInput);
  const blob = await res.blob();
  const previewUrl = URL.createObjectURL(blob);
  return {
    blob,
    fileName,
    previewUrl
  };
}
