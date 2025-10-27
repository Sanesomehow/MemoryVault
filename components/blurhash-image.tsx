"use client";

import { useEffect, useRef, useState } from "react";
import { decode } from "blurhash";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

interface BlurhashImageProps {
  blurHash?: string;
  width?: number;
  height?: number;
  src?: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export function BlurhashImage({
  blurHash,
  width = 400,
  height = 400,
  src,
  alt,
  className,
  containerClassName
}: BlurhashImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasReady, setCanvasReady] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(null);

  // Canvas ref callback
  const canvasRefCallback = (element: HTMLCanvasElement | null) => {
    canvasRef.current = element;
    setCanvasElement(element);
    console.log('Canvas ref callback called with element:', !!element);
  };

  // Log received props
  useEffect(() => {
    console.log('BlurhashImage props received:', {
      blurHash,
      blurHashLength: blurHash?.length,
      width,
      height,
      src,
      alt,
      hasBlurHash: !!blurHash,
      hasSrc: !!src
    });
  }, [blurHash, width, height, src, alt]);

  // Generate blurhash canvas - use simpler timeout approach
  useEffect(() => {
    console.log('BlurhashImage useEffect triggered:', { 
      hasBlurHash: !!blurHash, 
      hasCanvas: !!canvasRef.current,
      blurHashValue: blurHash,
      blurHashLength: blurHash?.length,
      isValidBlurHash: blurHash && blurHash.length > 0
    });

    if (!blurHash || blurHash.trim() === '') {
      console.log('Skipping blurhash rendering - no valid blurhash');
      setCanvasReady(true);
      return;
    }

    // Use a simple timeout to wait for canvas to be ready
    const timeout = setTimeout(() => {
      const canvas = canvasRef.current || canvasElement;
      if (!canvas) {
        console.log('Canvas ref not available after timeout');
        setCanvasReady(true);
        return;
      }

      console.log('Canvas ref available, starting blurhash rendering');

      try {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          console.error('Failed to get canvas context');
          setCanvasReady(true);
          return;
        }

        // Set canvas size to higher resolution for better quality
        canvas.width = 64;
        canvas.height = 64;
        console.log('Canvas size set to 64x64');

        // Decode blurhash and draw to canvas
        console.log('Decoding blurhash:', blurHash);
        
        try {
          const pixels = decode(blurHash, 64, 64);
          console.log('Blurhash decoded, pixels length:', pixels.length);
          
          // Validate pixels array
          if (!pixels || pixels.length === 0) {
            throw new Error('No pixels returned from blurhash decode');
          }
          
          const imageData = new ImageData(new Uint8ClampedArray(pixels), 64, 64);
          ctx.putImageData(imageData, 0, 0);
          console.log('Image data applied to canvas successfully');
          
        } catch (decodeError) {
          console.error('Blurhash decode failed:', decodeError);
          // Fallback: draw a simple colored rectangle for debugging
          ctx.fillStyle = '#3B82F6'; // Blue color for debugging
          ctx.fillRect(0, 0, 64, 64);
          console.log('Applied fallback blue color to canvas');
        }
        
        setCanvasReady(true);
        console.log('Canvas ready set to true');
      } catch (error) {
        console.error('Error decoding blurhash:', error);
        console.error('BlurHash that failed:', blurHash);
        setCanvasReady(true); // Continue without blurhash
      }
    }, 100); // Wait 100ms for canvas to be ready

    return () => clearTimeout(timeout);
  }, [blurHash, canvasElement]);

  const shouldShowCanvas = blurHash && canvasReady && (!src || (!imageLoaded && !imageError));
  const shouldShowFallback = !blurHash && !src;
  
  console.log('BlurhashImage render state:', { 
    hasBlurHash: !!blurHash, 
    canvasReady, 
    shouldShowCanvas,
    shouldShowFallback,
    hasSrc: !!src,
    imageLoaded,
    imageError,
    blurHashValue: blurHash?.substring(0, 10) + '...' // Show first 10 chars
  });

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {/* Blurhash canvas - shows as placeholder when no src or while image is loading */}
      {shouldShowCanvas && (
        <canvas
          ref={canvasRefCallback}
          className={cn(
            "w-full h-full object-cover",
            className
          )}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            imageRendering: 'auto', // Better scaling quality
            filter: 'blur(0.5px)', // Slight additional blur for smoother look
          }}
        />
      )}

      {/* Actual image - shows after loading */}
      {src && (
        <img
          src={src}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            imageLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          onLoad={() => {
            console.log('Image loaded successfully');
            setImageLoaded(true);
            setImageError(false);
          }}
          onError={() => {
            console.error('Image failed to load:', src);
            setImageError(true);
            setImageLoaded(false);
          }}
        />
      )}

      {/* Fallback for no blurhash and no src */}
      {!blurHash && !src && (
        <div className={cn(
          "w-full h-full bg-gray-200 flex items-center justify-center",
          className
        )}>
          <div className="flex flex-col items-center justify-center text-gray-400">
            <ImageIcon className="w-12 h-12 mb-2" />
            <span className="text-sm">No preview available</span>
          </div>
        </div>
      )}

      {/* Fallback for image error */}
      {src && imageError && (
        <div className={cn(
          "w-full h-full bg-gray-200 flex items-center justify-center",
          className
        )}>
          <div className="flex flex-col items-center justify-center text-gray-400">
            <ImageIcon className="w-12 h-12 mb-2" />
            <span className="text-sm">Failed to load image</span>
          </div>
        </div>
      )}
    </div>
  );
}