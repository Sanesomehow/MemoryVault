"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { fetchAllNft } from "@/lib/nft/nftFetch";
import { PublicKey } from "@solana/web3.js";
import { Search, ImagePlus, Calendar, Eye, ChevronDown, SortAsc } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BlurhashImage } from "./blurhash-image";
import Link from "next/link";

interface GallaryProps {
  publicKey: PublicKey;
  sharedNfts?: any[];
}

type SortOption = "date-newest" | "date-oldest" | "name-asc" | "name-desc" | "size-asc" | "size-desc";
type TabType = "owned" | "shared";

export function Gallary({ publicKey, sharedNfts = [] }: GallaryProps) {
  const [ownedNfts, setOwnedNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("owned");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("date-newest");

  useEffect(() => {
    const loadNFTs = async () => {
      try {
        setLoading(true);
        const result = await fetchAllNft(publicKey);
        setOwnedNfts(result);
      } catch (err) {
        console.error("Error fetching NFTs:", err);
      } finally {
        setLoading(false);
      }
    };

    if (publicKey) {
      loadNFTs();
    }
  }, [publicKey]);

  const currentNfts = activeTab === "owned" ? ownedNfts : sharedNfts;

  const filteredAndSortedNfts = useMemo(() => {
    let filtered = currentNfts.filter(nft => {
      const name = nft.metadata?.name?.toLowerCase() || "";
      return name.includes(searchQuery.toLowerCase());
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-newest":
          return new Date(b.metadata?.properties?.upload_date || 0).getTime() - 
                 new Date(a.metadata?.properties?.upload_date || 0).getTime();
        case "date-oldest":
          return new Date(a.metadata?.properties?.upload_date || 0).getTime() - 
                 new Date(b.metadata?.properties?.upload_date || 0).getTime();
        case "name-asc":
          return (a.metadata?.name || "").localeCompare(b.metadata?.name || "");
        case "name-desc":
          return (b.metadata?.name || "").localeCompare(a.metadata?.name || "");
        case "size-asc":
          return (a.metadata?.properties?.original_size || 0) - (b.metadata?.properties?.original_size || 0);
        case "size-desc":
          return (b.metadata?.properties?.original_size || 0) - (a.metadata?.properties?.original_size || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [currentNfts, searchQuery, sortBy]);

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

  const getImageUrl = () => {
    return "/assets/image.png";
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-0">
            <div className="animate-pulse bg-gray-200 aspect-square rounded-lg" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const EmptyState = ({ type }: { type: TabType }) => (
    <div className="text-center py-12">
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-12 pb-12">
          {type === "owned" ? (
            <>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImagePlus className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No photos yet</h3>
              <p className="text-gray-600 mb-6">
                Upload your first encrypted photo to start building your collection
              </p>
              <Button asChild>
                <Link 
                  href="#upload"
                  onClick={() => {
                    const uploadSection = document.querySelector('[data-upload-section]');
                    uploadSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <ImagePlus className="h-4 w-4 mr-2" />
                  Upload Your First Photo
                </Link>
              </Button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImagePlus className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No shared photos yet</h3>
              <p className="text-gray-600 mb-4">
                Photos shared with you will appear here
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 Your wallet: <code className="bg-blue-100 px-2 py-1 rounded text-xs">
                    {publicKey.toBase58().slice(0, 16)}...
                  </code>
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const sortOptions = [
    { value: "date-newest", label: "Date (Newest)" },
    { value: "date-oldest", label: "Date (Oldest)" },
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "size-asc", label: "Size (Smallest)" },
    { value: "size-desc", label: "Size (Largest)" },
  ];

  if (loading && activeTab === "owned") {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-24" />
          </div>
        </div>
        
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold text-gray-900">Your Encrypted Photos</h2>
          <Badge variant="secondary" className="text-sm">
            {filteredAndSortedNfts.length} photos
          </Badge>
        </div>

        {/* Tab Navigation */}
        <div className="flex border border-gray-200 rounded-lg p-1 bg-gray-50">
          <button
            onClick={() => setActiveTab("owned")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 hover:scale-105 ${
              activeTab === "owned"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            }`}
          >
            My Photos ({ownedNfts.length})
          </button>
          <button
            onClick={() => setActiveTab("shared")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 hover:scale-105 ${
              activeTab === "shared"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            }`}
          >
            Shared ({sharedNfts.length})
          </button>
        </div>
      </div>

      {/* Search and Sort */}
      {currentNfts.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search photos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              aria-label="Search through your photos"
              role="searchbox"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="gap-2 hover:scale-105 transition-all duration-200"
                aria-label="Sort photos"
              >
                <SortAsc className="h-4 w-4" />
                {sortOptions.find(opt => opt.value === sortBy)?.label}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setSortBy(option.value as SortOption)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Photo Grid */}
      {filteredAndSortedNfts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedNfts.map((nft, i) => (
            <Card key={`${nft.mintAddress}-${i}`} className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <CardContent className="p-0">
                <Link href={`/gallery/${nft.mintAddress}`} className="block">
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden rounded-lg">
                    <BlurhashImage
                      blurHash={nft.metadata?.properties?.blur_hash}
                      width={nft.metadata?.properties?.blur_width}
                      height={nft.metadata?.properties?.blur_height}
                      src={getImageUrl()}
                      alt={nft.metadata?.name || "NFT Photo"}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-center text-white space-y-3">
                        <h3 className="font-semibold text-lg">
                          {nft.metadata?.name || "Untitled Photo"}
                        </h3>
                        <Button size="sm" variant="secondary">
                          <Eye className="h-4 w-4 mr-2" />
                          View Photo
                        </Button>
                        <p className="text-white/80 text-sm">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {formatDate(nft.metadata?.properties?.upload_date)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card Footer */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-medium text-gray-900 truncate">
                      {nft.metadata?.name || "Untitled Photo"}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {formatDate(nft.metadata?.properties?.upload_date)}
                    </p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState type={activeTab} />
      )}
    </div>
  );
}
