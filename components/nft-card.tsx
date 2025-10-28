"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Share2, Users, Calendar, HardDrive, ImageIcon, Loader2 } from "lucide-react";
import { BlurhashImage } from "./blurhash-image";
import { validateBlurHash, ipfsToHttp } from "@/lib/utils";

interface NftMetadata {
  name?: string;
  image?: string;
  properties?: {
    upload_date?: string;
    original_size?: number;
    blur_hash?: string;
    blur_width?: number;
    blur_height?: number;
    allowed_viewers?: Record<string, any>;
  };
}

interface NFTCardProps {
  nft: {
    nft: Record<string, unknown>;
    metadata?: NftMetadata;
    mintAddress: string;
  };
  type: "owned" | "shared";
  className?: string;
}

export function NFTCard({ nft, type, className }: NFTCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Unknown date';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return 'Unknown size';
    const kb = bytes / 1024;
    if (kb < 1024) return `${Math.round(kb)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const getSharedCount = () => {
    const viewers = nft.metadata?.properties?.allowed_viewers;
    if (!viewers) return 0;
    return Object.keys(viewers).length;
  };

  const getImageUrl = () => {
    return "/assets/image.png";
  };

  return (
    <div 
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/gallery/${nft.mintAddress}`}>
        <div>
          <BlurhashImage
            blurHash={validateBlurHash(nft.metadata?.properties?.blur_hash)}
            width={nft.metadata?.properties?.blur_width}
            height={nft.metadata?.properties?.blur_height}
            src={ipfsToHttp(nft.metadata?.image || "") || ""}
            alt={nft.metadata?.name || "NFT Photo"}
            containerClassName="aspect-square"
            className="rounded-lg"
          />
          
          {isHovered && (
            <div>
              <div>
                <span>{nft.metadata?.name || "Untitled Photo"}</span>
              </div>
            </div>
          )}
          
          <div>
            {type === "owned" ? (
              <div>
                <Users />
                <span>{getSharedCount()}</span>
              </div>
            ) : (
              <div>Shared</div>
            )}
          </div>
        </div>

        <div>
          <h3>{nft.metadata?.name || "Untitled Photo"}</h3>
          
          <div>
            <div>
              <Calendar />
              {formatDate(nft.metadata?.properties?.upload_date || "")}
            </div>
            
            {nft.metadata?.properties?.original_size && (
              <div>
                <HardDrive />
                {formatFileSize(nft.metadata.properties.original_size)}
              </div>
            )}
          </div>
          
          <div>
            <span>{type === "owned" ? "Owned" : "Shared with me"}</span>
            
            {type === "owned" && getSharedCount() > 0 && (
              <span>
                Shared with {getSharedCount()} {getSharedCount() === 1 ? 'person' : 'people'}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}