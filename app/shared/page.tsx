"use client"

import { useWallet } from "@solana/wallet-adapter-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorAlert } from "@/components/ui/error-alert";
import { WalletConnectButton } from "@/components/wallet-connect-button";
import { BlurhashImage } from "@/components/blurhash-image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Users, Upload, Inbox, Share2 } from "lucide-react";

export default function SharedPhotos() {
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const [sharedNfts, setSharedNfts] = useState<any[]>([]);
  
  // Structured error handling
  const [error, setError] = useState<{
    title: string;
    message: string;
    type: "fetch_failed" | "network" | "general";
  } | null>(null);

  const fetchSharedNfts = async () => {
    if (!publicKey) return;
    
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const res = await fetch("/api/shared", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ walletAddress: publicKey?.toBase58() }),
      });

      if (!res.ok) {
        const errorMessage = res.status === 500 ? 
          "Server error - please try again later" : 
          `Failed to fetch shared NFTs (${res.status})`;
        throw new Error(errorMessage);
      }

      const data = await res.json();
      console.log("API Response:", data);
      console.log("Shared NFTs count:", data.sharedNfts?.length);
      if (data.sharedNfts && data.sharedNfts.length > 0) {
        console.log(data.sharedNfts[0].name);
      }
      setSharedNfts(data.sharedNfts || []);
    } catch (e) {
      console.error("Error fetching shared NFTs:", e);
      const errorMessage = (e as Error).message;
      
      if (errorMessage.includes("NetworkError") || errorMessage.includes("fetch")) {
        setError({
          title: "Network Error",
          message: "Unable to connect to the server. Please check your internet connection.",
          type: "network"
        });
      } else if (errorMessage.includes("500")) {
        setError({
          title: "Server Error",
          message: "The server encountered an error. Please try again later.",
          type: "fetch_failed"
        });
      } else {
        setError({
          title: "Failed to Load Photos",
          message: `Unable to load shared photos: ${errorMessage}`,
          type: "general"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSharedNfts();
  }, [publicKey]);

  if (!publicKey) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Photos Shared With You
          </h1>
          <p className="text-gray-600">
            Discover encrypted photos that have been securely shared with your wallet
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6 text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Connect Your Wallet</h2>
            <p className="text-gray-600 mb-8">
              Connect your Solana wallet to view photos that have been shared with you.
            </p>
            <WalletConnectButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-9 w-72 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 w-8 bg-gray-200 rounded-full animate-pulse" />
          </div>
          <div className="h-5 w-96 bg-gray-200 rounded animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square bg-gray-200 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="flex items-center justify-between">
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                    <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Show error with retry option
  if (error) {
    const retryFetch = () => {
      if (publicKey) {
        fetchSharedNfts();
      }
    };

    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Photos Shared With You
          </h1>
          <p className="text-gray-600">
            Discover encrypted photos that have been securely shared with your wallet
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <ErrorAlert
            title={error.title}
            message={error.message}
            retry={retryFetch}
            onDismiss={() => setError(null)}
          />
        </div>
      </div>
    );
  }

  if (!sharedNfts.length) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Photos Shared With You
            </h1>
            <Badge variant="secondary" className="px-3 py-1">
              0
            </Badge>
          </div>
          <p className="text-gray-600">
            Discover encrypted photos that have been securely shared with your wallet
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">No photos shared with you yet</h2>
            <p className="text-gray-600 mb-8">
              When someone shares an encrypted photo with you, it will appear here. 
              Share your wallet address to start receiving photos!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200">
                <Upload className="w-4 h-4 mr-2" />
                Upload Your First Photo
              </Link>
              <Link href="/requests" className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <Inbox className="w-4 h-4 mr-2" />
                View Requests
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Photos Shared With You
          </h1>
          <Badge variant="secondary" className="px-3 py-1">
            {sharedNfts.length}
          </Badge>
        </div>
        <p className="text-gray-600">
          Discover encrypted photos that have been securely shared with your wallet
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sharedNfts.map((nft, i) => (
          <Link key={i} href={`/gallery/${nft.mintAddress}`} className="group">
            <Card className="overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
              <CardContent className="p-0">
                <div className="relative overflow-hidden aspect-square">
                  {nft.metadata?.properties?.blur_hash ? (
                    <BlurhashImage
                      blurHash={nft.metadata.properties.blur_hash}
                      width={nft.metadata.properties.blur_width}
                      height={nft.metadata.properties.blur_height}
                      src={nft.image}
                      alt={nft.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/placeholder-image.svg';
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                    {nft.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span className="block">Shared by:</span>
                      <code className="text-xs">{shortenAddress(nft.ownerWallet || "Unknown")}</code>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Shared
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
