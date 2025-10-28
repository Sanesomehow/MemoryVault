import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Validates and sanitizes a blur hash value
 * Returns undefined if the blur hash is invalid
 */
export function validateBlurHash(blurHash: unknown): string | undefined {
  if (!blurHash || 
      typeof blurHash !== 'string' || 
      blurHash === 'undefined' || 
      blurHash.startsWith('undefined') ||
      blurHash.trim() === '') {
    return undefined;
  }
  return blurHash;
}

/**
 * Convert IPFS URI to HTTP URL using configured gateway
 * Falls back to gateway.pinata.cloud if no gateway is configured
 */
export function ipfsToHttp(uri: string): string | undefined {
  if (!uri) return undefined;
  
  if (uri.startsWith('ipfs://')) {
    const cid = uri.replace('ipfs://', '');
    // Use environment variable for gateway, fall back to pinata
    const gateway = process.env.NEXT_PUBLIC_GATEWAY_URL || 'gateway.pinata.cloud';
    return `https://${gateway}/ipfs/${cid}`;
  }
  
  return uri; // Already HTTP URL
}
