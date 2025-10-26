"use client";

import React from "react";
import { X, Upload, RefreshCw } from "lucide-react";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface PhotoPreviewCardProps {
  file: File;
  previewUrl: string;
  onRemove: () => void;
  onUpload: () => void;
  uploading: boolean;
  loadingState: "idle" | "encrypting" | "uploading" | "minting" | "complete";
  disabled?: boolean;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export function PhotoPreviewCard({
  file,
  previewUrl,
  onRemove,
  onUpload,
  uploading,
  loadingState,
  disabled = false
}: PhotoPreviewCardProps) {
  return (
    <div>
      <div>
        <img
          src={previewUrl}
          alt={file.name}
        />
        <button
          onClick={onRemove}
          disabled={uploading}
          aria-label="Remove photo"
        >
          <X />
        </button>
      </div>

      <div>
        <div>
          <h3 title={file.name}>
            {file.name}
          </h3>
          <div>
            <span>{file.type}</span>
            <span>{formatFileSize(file.size)}</span>
          </div>
        </div>

        {file.size > 10 * 1024 * 1024 && (
          <div>
            ⚠️ File is larger than 10MB. Upload may take longer.
          </div>
        )}

        <div>
          <button
            onClick={onUpload}
            disabled={uploading || disabled}
          >
            {loadingState === "idle" ? (
              <>
                <Upload />
                <span>Upload & Mint NFT</span>
              </>
            ) : (
              <LoadingSpinner
                size="sm"
                text={
                  loadingState === "encrypting"
                    ? "Encrypting..."
                    : loadingState === "uploading"
                    ? "Uploading..."
                    : loadingState === "minting"
                    ? "Minting..."
                    : loadingState === "complete"
                    ? "Complete!"
                    : "Processing..."
                }
              />
            )}
          </button>
        </div>

        {loadingState !== "idle" && (
          <div>
            {loadingState === "encrypting" && <span>🔐 Step 1/3 — Encrypting photo</span>}
            {loadingState === "uploading" && <span>📤 Step 2/3 — Uploading to IPFS</span>}
            {loadingState === "minting" && <span>🎨 Step 3/3 — Minting NFT</span>}
            {loadingState === "complete" && <span>✅ Upload complete!</span>}
          </div>
        )}
      </div>
    </div>
  );
}

export default PhotoPreviewCard;