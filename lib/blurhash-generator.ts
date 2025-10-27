import { encode } from "blurhash";

export interface BlurhashData {
  blurHash: string;
  width: number;
  height: number;
}

export async function generateBlurhash(file: File): Promise<BlurhashData> {
  return new Promise((resolve, reject) => {
    try {
      console.log('Starting blurhash generation for file:', file.name, 'size:', file.size);
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      img.onload = () => {
        try {
          console.log('Image loaded, original dimensions:', { width: img.width, height: img.height });
          
          // Set canvas size to higher resolution for better detail capture
          canvas.width = 64;
          canvas.height = 64;
          
          // Draw resized image to canvas with better quality
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, 64, 64);
          
          // Get image data
          const imageData = ctx.getImageData(0, 0, 64, 64);
          console.log('Image data extracted, pixels length:', imageData.data.length);
          
          // Generate blurhash with more components for better detail
          // 6x6 components give more recognizable shapes while keeping size reasonable
          const blurHash = encode(imageData.data, 64, 64, 6, 6);
          console.log('Generated blurhash:', blurHash);
          
          // Clean up object URL
          URL.revokeObjectURL(objectUrl);
          
          resolve({
            blurHash,
            width: img.width,
            height: img.height
          });
        } catch (error) {
          console.error('Error processing image for blurhash:', error);
          URL.revokeObjectURL(objectUrl);
          reject(error);
        }
      };
      
      img.onerror = (error) => {
        console.error('Error loading image:', error);
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to load image'));
      };
      
      // Create object URL from file and load image
      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;
      
    } catch (error) {
      console.error('Error in generateBlurhash:', error);
      reject(error);
    }
  });
}
