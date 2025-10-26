// Test utility to verify blurhash implementation
import sharp from "sharp";
import { encode, decode } from "blurhash";

export async function testBlurhashGeneration(imageBuffer: Buffer) {
  try {
    // Get original image dimensions
    const metadata = await sharp(imageBuffer).metadata();
    console.log('Original dimensions:', { width: metadata.width, height: metadata.height });
    
    // Resize to 32x32 and get raw pixel data
    const { data, info } = await sharp(imageBuffer)
      .resize(32, 32, { fit: 'cover' })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    console.log('Processed dimensions:', info);
    
    // Generate blurhash
    const blurHash = encode(new Uint8ClampedArray(data), info.width, info.height, 4, 4);
    console.log('Generated blur hash:', blurHash);
    
    // Test decode
    const pixels = decode(blurHash, 32, 32);
    console.log('Decoded pixels length:', pixels.length);
    
    return {
      blurHash,
      width: metadata.width || 0,
      height: metadata.height || 0,
    };
  } catch (error) {
    console.error('Blurhash test error:', error);
    throw error;
  }
}