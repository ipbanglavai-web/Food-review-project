/**
 * Utility to compress image files or base64 strings using HTML5 Canvas.
 * Keeps image sizes well under the 1MB Firestore document payload limit.
 */

export async function compressImageFile(
  file: File,
  maxWidth = 1200,
  maxHeight = 800,
  quality = 0.75
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not a valid image.'));
      return;
    }

    // For SVG images: rasterize via canvas if possible to compress huge SVGs (>500KB)
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onerror = (e) => reject(e);
      reader.onload = async (e) => {
        const rawSvgData = e.target?.result as string;
        if (!rawSvgData) {
          reject(new Error('Failed to read SVG file.'));
          return;
        }

        // If SVG is small (under ~600KB), keep SVG vector format as is
        if (rawSvgData.length <= 600000) {
          resolve(rawSvgData);
          return;
        }

        // Otherwise rasterize SVG to compressed JPEG canvas
        try {
          const compressed = await compressDataUrl(rawSvgData, maxWidth, maxHeight, quality);
          if (compressed.length > 900000) {
            reject(new Error('SVG file is too large for database (must be under 800KB). Please use a smaller SVG or JPG/PNG file.'));
          } else {
            resolve(compressed);
          }
        } catch (err) {
          reject(new Error('SVG file is too large to process. Please select an image under 1MB.'));
        }
      };
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onerror = (err) => reject(err);
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (!src) {
        reject(new Error('Failed to read image file.'));
        return;
      }

      compressDataUrl(src, maxWidth, maxHeight, quality)
        .then(resolve)
        .catch(() => resolve(src)); // Fallback to raw dataUrl if canvas fails
    };
    reader.readAsDataURL(file);
  });
}

export function compressDataUrl(
  dataUrl: string,
  maxWidth = 1000,
  maxHeight = 667,
  quality = 0.7
): Promise<string> {
  return new Promise((resolve) => {
    // If not a base64 image or small data, return as is
    if (!dataUrl || !dataUrl.startsWith('data:image')) {
      resolve(dataUrl);
      return;
    }

    // If it's already small enough (under 300KB base64), return directly
    if (dataUrl.length <= 300000) {
      resolve(dataUrl);
      return;
    }

    const img = new Image();
    if (dataUrl.startsWith('http')) {
      img.crossOrigin = 'anonymous';
    }
    img.onerror = () => resolve(dataUrl);
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Scale down if larger than max dimensions
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      // Smooth rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'medium';
      ctx.drawImage(img, 0, 0, width, height);

      let compressed = canvas.toDataURL('image/jpeg', quality);

      // If still over 500KB string length, shrink canvas further
      if (compressed.length > 500000) {
        const shrinkCanvas = document.createElement('canvas');
        shrinkCanvas.width = Math.round(width * 0.75);
        shrinkCanvas.height = Math.round(height * 0.75);
        const sCtx = shrinkCanvas.getContext('2d');
        if (sCtx) {
          sCtx.drawImage(canvas, 0, 0, shrinkCanvas.width, shrinkCanvas.height);
          compressed = shrinkCanvas.toDataURL('image/jpeg', 0.6);
        }
      }

      resolve(compressed);
    };
    img.src = dataUrl;
  });
}
