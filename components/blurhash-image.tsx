"use client";

import { useEffect, useRef, useState } from "react";
import { decode } from "blurhash";
import { cn } from "@/lib/utils";
import { ImageIcon, Loader2 } from "lucide-react";

interface BlurhashImageProps {
  blurHash?: string;
  width?: number;
  height?: number;
  src: string;
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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);

  // Generate blurhash canvas
  useEffect(() => {
    if (!blurHash || !canvasRef.current) {
      setCanvasReady(true); // Skip blurhash if not available
      return;
    }

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size
      canvas.width = 32;
      canvas.height = 32;

      // Decode blurhash and draw to canvas
      const pixels = decode(blurHash, 32, 32);
      const imageData = new ImageData(new Uint8ClampedArray(pixels), 32, 32);
      ctx.putImageData(imageData, 0, 0);
      
      setCanvasReady(true);
    } catch (error) {
      console.error('Error decoding blurhash:', error);
      setCanvasReady(true); // Continue without blurhash
    }
  }, [blurHash]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {/* Blurhash canvas - shown while image loads */}
      {blurHash && canvasReady && !imageLoaded && (
        <canvas
          ref={canvasRef}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
            imageLoaded ? "opacity-0" : "opacity-100",
            className
          )}
          style={{
            filter: "blur(0.5px)",
            transform: "scale(1.1)", // Slight scale to hide canvas edges
          }}
        />
      )}

      {/* Fallback gray placeholder for images without blurhash */}
      {!blurHash && !imageLoaded && !imageError && (
        <div className={cn(
          "absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center transition-opacity duration-300",
          imageLoaded ? "opacity-0" : "opacity-100"
        )}>
          <div className="flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <span className="text-sm">Loading...</span>
          </div>
        </div>
      )}

      {/* Error state */}
      {imageError && (
        <div className={cn(
          "absolute inset-0 bg-gray-100 flex items-center justify-center",
          className
        )}>
          <div className="flex flex-col items-center justify-center text-gray-400">
            <ImageIcon className="w-12 h-12 mb-2" />
            <span className="text-sm">Failed to load</span>
          </div>
        </div>
      )}

      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          imageLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        loading="lazy"
      />
    </div>
  );
}