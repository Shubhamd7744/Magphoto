import { PixelCrop } from 'react-image-crop';
import { FilterType } from '../types';

export const getCroppedImg = (
  image: HTMLImageElement,
  crop: PixelCrop,
  fileName: string
): Promise<File> => {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  
  canvas.width = crop.width * scaleX;
  canvas.height = crop.height * scaleY;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
      throw new Error('No 2d context');
  }

  // Draw the cropped image onto the canvas
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width * scaleX,
    crop.height * scaleY
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      // Create a new File from the Blob
      const file = new File([blob], fileName, { type: 'image/png' });
      resolve(file);
    }, 'image/png');
  });
};

export const applyImageFilter = (file: File, filterType: FilterType): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Apply filter
      switch (filterType) {
        case 'GRAYSCALE':
          ctx.filter = 'grayscale(100%)';
          break;
        case 'SEPIA':
          ctx.filter = 'sepia(100%)';
          break;
        case 'INVERT':
          ctx.filter = 'invert(100%)';
          break;
        case 'BLUR':
          ctx.filter = 'blur(5px)';
          break;
        case 'BRIGHTNESS':
          ctx.filter = 'brightness(130%)';
          break;
        case 'CONTRAST':
          ctx.filter = 'contrast(130%)';
          break;
        default:
          ctx.filter = 'none';
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create blob from canvas'));
          return;
        }
        const filteredFile = new File([blob], `filtered-${filterType.toLowerCase()}.png`, { type: 'image/png' });
        resolve(filteredFile);
      }, 'image/png');
    };
    
    img.onerror = () => reject(new Error('Failed to load image for filtering'));
    img.src = URL.createObjectURL(file);
  });
};
