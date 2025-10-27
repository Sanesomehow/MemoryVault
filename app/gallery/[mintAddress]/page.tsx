"use client";

import { decryptPhoto } from "@/lib/crypto/encrypt";
import { decryptAESKey, encryptAESKey } from "@/lib/crypto/keyEncryption";
import { fetchSingleNft } from "@/lib/nft/nftFetch";
import { umi } from "@/lib/umi";
import {
  DataArgs,
  updateV1,
  usesToggle,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  divideAmount,
  publicKey as umiPublicKey,
} from "@metaplex-foundation/umi";
import {
  createSignerFromWalletAdapter,
  walletAdapterIdentity,
} from "@metaplex-foundation/umi-signer-wallet-adapters";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ErrorAlert from "@/components/ui/error-alert";
import ShareAccessDialog from "@/components/share-access-dialog";
import { RequestAccessModal } from "@/components/request-access-modal";
import { BlurhashImage } from "@/components/blurhash-image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  Calendar, 
  HardDrive, 
  Copy, 
  Share2, 
  ShieldX, 
  Check, 
  Loader2, 
  Eye, 
  Lock, 
  Shield,
  ExternalLink,
  Twitter
} from "lucide-react";

enum UserRole {
  owner = "owner",
  viewer = "viewer",
  none = "none",
}

// Component for access denied screen
function AccessDeniedScreen({ 
  nftData, 
  mintAddress, 
  publicKey 
}: { 
  nftData: any; 
  mintAddress: string; 
  publicKey: any; 
}) {
  const [requestStatus, setRequestStatus] = useState<"none" | "pending" | "approved" | "denied">("none");
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  // Check request status from API
  const checkRequestStatus = async () => {
    if (!publicKey) return;
    
    try {
      const response = await fetch(
        `/api/requests/create?requester=${publicKey.toBase58()}&mint=${mintAddress}`
      );
      
      if (response.ok) {
        const data = await response.json();
        const status = data.status || "none";
        setRequestStatus(status);
        
        // Update localStorage
        if (status !== "none") {
          localStorage.setItem(`access_request_${mintAddress}`, JSON.stringify({
            status,
            timestamp: Date.now(),
            requestId: data.requestId
          }));
        }
        
        // If approved, reload the page to show photo
        if (status === "approved") {
          toast.success("Access granted! Loading photo...");
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      }
    } catch (error) {
      console.error("Failed to check request status:", error);
    }
  };

  // Check localStorage for existing request status on mount
  useEffect(() => {
    const stored = localStorage.getItem(`access_request_${mintAddress}`);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setRequestStatus(data.status || "none");
      } catch (e) {
        console.error("Failed to parse stored request status:", e);
      }
    }
    
    // Also check API for latest status
    checkRequestStatus();
  }, [mintAddress, publicKey]);

  // Set up polling for pending requests
  useEffect(() => {
    if (requestStatus === "pending" && publicKey) {
      const interval = setInterval(checkRequestStatus, 30000); // Poll every 30 seconds
      setPollingInterval(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    } else if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  }, [requestStatus, publicKey]);

  const handleRequestSent = () => {
    setRequestStatus("pending");
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Extract owner address from NFT data
  const ownerAddress = nftData?.nft?.updateAuthority || nftData?.nft?.metadata?.updateAuthority;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardContent className="pt-12 pb-12 text-center">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
            <ShieldX className="w-8 h-8 text-red-500" />
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            This photo is private
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            Request access from the owner to view this encrypted photo
          </p>

          {/* Photo Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Photo:</span>
              <span className="text-sm text-gray-900 truncate ml-2">{nftData?.metadata?.name || "Untitled"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Owner:</span>
              <code className="text-xs bg-gray-200 px-2 py-1 rounded">{shortenAddress(ownerAddress)}</code>
            </div>
          </div>

          {/* Request Status & Action */}
          {requestStatus === "pending" ? (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Eye className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Request Pending</span>
                </div>
                <p className="text-sm text-yellow-700">
                  Your access request has been sent. You'll be notified when the owner responds.
                </p>
              </div>
              <Button disabled className="w-full">
                Request Sent - Awaiting Response
              </Button>
            </div>
          ) : requestStatus === "denied" ? (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <ShieldX className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-800">Request Denied</span>
                </div>
                <p className="text-sm text-red-700">
                  The owner has declined your access request for this photo.
                </p>
              </div>
            </div>
          ) : (
            <RequestAccessModal
              ownerAddress={ownerAddress}
              mintAddress={mintAddress}
              requesterAddress={publicKey?.toBase58() || ""}
              nftName={nftData?.metadata?.name || "Untitled Photo"}
              onRequestSent={handleRequestSent}
            />
          )}

          {/* Info */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              🔐 This photo is encrypted and stored securely on IPFS
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PhotoDetail() {
  const { publicKey, signTransaction, signAllTransactions, connected } =
    useWallet();
  umi.use(
    walletAdapterIdentity({
      publicKey,
      signTransaction,
      signAllTransactions,
    })
  );
  const params = useParams();
  const mintAddress = params.mintAddress as string;

  const [loading, setLoading] = useState(true);
  const [nftData, setNftData] = useState<any>(null);
  const [decryptedUrl, setDecryptedUrl] = useState<string>();
  const [decrypting, setDecrypting] = useState<boolean>(false);
  const [canView, setCanView] = useState<UserRole>(UserRole.none);
  const [grantingAccess, setGrantingAccess] = useState<boolean>(false);
  const [blinkUrl, setBlinkUrl] = useState<string>();
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  
  // Structured error handling
  const [error, setError] = useState<{
    title: string;
    message: string;
    type: "nft_not_found" | "load_failed" | "decrypt_failed" | "access_denied" | "grant_failed" | "general";
  } | null>(null);

function generateBlink() {
  if (!publicKey) {
    toast.error("Please connect your wallet first");
    return;
  }

  if (!mintAddress) {
    toast.error("Invalid NFT address");
    return;
  }

  try {
    const ownerAddress = publicKey.toBase58();
    const actionUrl = `${window.location.origin}/api/action/share/${mintAddress}?owner=${ownerAddress}`;
    const blink = `https://dial.to/?action=solana-action:${encodeURIComponent(actionUrl)}`;

    setBlinkUrl(blink);
    navigator.clipboard.writeText(blink);
    
    toast.success("Blink URL copied!", {
      description: "Share this link on Twitter or Discord"
    });
  } catch (error) {
    console.error("Failed to generate Blink:", error);
    toast.error("Failed to generate shareable link");
  }
}

  // Handle access granting from dialog
  const handleGrantAccess = async (
    walletAddress: string, 
    options?: { timeLimit?: string; viewLimit?: number }
  ) => {
    setGrantingAccess(true);
    try {
      if (!publicKey) {
        throw new Error("Wallet not connected");
      }
      
      const encryptedKey = nftData.metadata.properties.owner_encrypted_key;
      const nonce = nftData.metadata.properties.encryption_params.nonce;
      
      const viewerBytes = bs58.decode(walletAddress);
      console.log("viewer: ", walletAddress);
      console.log("viewer bytes: ", viewerBytes);

      const ownerBytes = publicKey.toBytes();
      console.log("ownerBytes: ", ownerBytes);

      const originalKey = decryptAESKey(encryptedKey, nonce, ownerBytes);
      console.log("originalKey: ", originalKey);

      if (!originalKey) {
        throw new Error("Decryption failed");
      }

      const newKey = encryptAESKey(originalKey, viewerBytes);
      console.log("new key: ", newKey);

      // Create new metadata with access controls
      const viewerAccess: any = {
        encrypted_key: newKey.encrypted,
        nonce: newKey.nonce,
      };

      // Add optional time and view limits
      if (options?.timeLimit && options.timeLimit !== "never") {
        const expirationDate = new Date();
        switch (options.timeLimit) {
          case "1h": expirationDate.setHours(expirationDate.getHours() + 1); break;
          case "1d": expirationDate.setDate(expirationDate.getDate() + 1); break;
          case "1w": expirationDate.setDate(expirationDate.getDate() + 7); break;
          case "1m": expirationDate.setMonth(expirationDate.getMonth() + 1); break;
        }
        viewerAccess.expires_at = expirationDate.toISOString();
      }

      if (options?.viewLimit && options.viewLimit > 0) {
        viewerAccess.view_limit = options.viewLimit;
        viewerAccess.views_remaining = options.viewLimit;
      }

      const newMetadata = {
        ...nftData.metadata,
        properties: {
          ...nftData.metadata.properties,
          allowed_viewers: {
            ...nftData.metadata.properties.allowed_viewers,
            [walletAddress]: viewerAccess,
          },
        },
      };
      
      console.log("new metadata: ", newMetadata);
      
      const updateRequest = await fetch("/api/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metadata: newMetadata,
          viewerWallet: walletAddress,
          mintAddress: mintAddress,
          owner: publicKey.toBase58(),
        }),
      });

      if (!updateRequest.ok) {
        const errorData = await updateRequest.json().catch(() => ({}));
        console.error("Update request failed:", {
          status: updateRequest.status,
          statusText: updateRequest.statusText,
          errorData
        });
        throw new Error(`Update failed: ${errorData.details || updateRequest.statusText}`);
      }

      const result = await updateRequest.json();
      console.log("update request result: ", result);

      const newMetadataUri = `ipfs://${result.metadataCid}`;
      console.log("new metadata uri", newMetadataUri);

      const creatorsArray = nftData.nft.metadata.creators ?? [
        {
          address: nftData.nft.metadata.updateAuthority,
          verified: true,
          share: 100,
        },
      ];

      const updatedData: DataArgs = {
        name: nftData.nft.name || "MemoryVault Photo",
        symbol: "MVLT",
        sellerFeeBasisPoints: nftData.nft.seller_fee_basis_points,
        uri: newMetadataUri,
        creators: creatorsArray,
      };

      const changeUri = await updateV1(umi, {
        mint: umiPublicKey(mintAddress),
        authority: umi.identity,
        data: updatedData,
      }).sendAndConfirm(umi);

      console.log("change uri", changeUri);
      
      // Refresh NFT data to show updated viewers
      setNftData(null);
      // This will trigger the useEffect to reload the data
      
    } catch (e) {
      console.error("Error granting access:", e);
      setError({
        title: "Failed to Grant Access",
        message: `Unable to grant access to ${walletAddress}: ${(e as Error).message}`,
        type: "grant_failed"
      });
      throw e; // Re-throw to let dialog handle the error
    } finally {
      setGrantingAccess(false);
    }
  };

  useEffect(() => {
    async function loadNFT() {
      if (!publicKey || !mintAddress) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { nft, metadata, metadataCid, isOwner } = await fetchSingleNft(
          publicKey,
          mintAddress
        );
        console.log("nft: ", nft);
        console.log("metadata: ", metadata);
        setNftData({ nft, metadata, metadataCid, isOwner });
        setLoading(false);
      } catch (e) {
        console.error("Error loading NFT:", e);
        const errorMessage = (e as Error).message;
        if (errorMessage.includes("not found") || errorMessage.includes("404")) {
          setError({
            title: "Photo Not Found",
            message: "This photo doesn't exist or may have been deleted.",
            type: "nft_not_found"
          });
        } else {
          setError({
            title: "Failed to Load Photo",
            message: `Unable to load photo metadata: ${errorMessage}`,
            type: "load_failed"
          });
        }
        setLoading(false);
      }
    }

    loadNFT();
  }, [publicKey, mintAddress]);

  useEffect(() => {
    if (!nftData || !publicKey) return;

    async function checkAccessAndDecrypt() {
      if (!publicKey) return;
      try {
        const { nft, metadata, metadataCid, isOwner } = nftData;
        const walletAddress = publicKey.toBase58();

        const {
          encrypted_content_cid,
          encryption_params,
          owner_encrypted_key,
          allowed_viewers,
        } = metadata.properties;

        let encryptedKey: string | undefined;
        let role: UserRole = UserRole.none;
        console.log("nft: ", nft);
        // console.log("nft.token.owner: ", nft.token.owner);
        console.log("walletAddress: ", walletAddress);

        const keys = Object.keys(allowed_viewers);
        const viewerAccessKey = keys.find(
          (k) => k.trim() === walletAddress.trim()
        );
        const viewerAccessObj = viewerAccessKey
          ? allowed_viewers[viewerAccessKey]
          : null;

        // if (nft.token?.owner === walletAddress) {
        if (isOwner) {
          role = UserRole.owner;
          encryptedKey = owner_encrypted_key;
        } else if (viewerAccessObj) {
          role = UserRole.viewer;
          encryptedKey = viewerAccessObj.encrypted_key;

          var decryptionParams = {
            ...metadata.properties.encryption_params,
            nonce: viewerAccessObj.nonce,
          };
          // metadata.properties.encryption_params.nonce = viewerAccessObj.nonce;
        } else {
          role = UserRole.none;
        }

        setCanView(role);

        if (role !== UserRole.none && encryptedKey) {
          console.log("Decrypting photo...");
          setDecrypting(true);

          console.log(metadata.properties);
          console.log("metadata: ", metadata);

          const decrypted = await decryptPhoto({
            encryptedContentCid: encrypted_content_cid,
            encryptionParams:
              role === UserRole.viewer
                ? decryptionParams
                : metadata.properties.encryption_params,
            publicKey: publicKey.toBytes(),
            encryptedKey: encryptedKey,
            fileType: metadata.properties.files[0].type,
          });

          console.log("Photo decrypted successfully");
          setDecryptedUrl(decrypted);
          setDecrypting(false);
        }
      } catch (e) {
        console.error("Error checking access or decrypting:", e);
        const errorMessage = (e as Error).message;
        if (errorMessage.includes("decrypt")) {
          setError({
            title: "Decryption Failed",
            message: "Unable to decrypt photo. The key may be corrupted or invalid.",
            type: "decrypt_failed"
          });
        } else if (errorMessage.includes("access") || errorMessage.includes("permission")) {
          setError({
            title: "Access Denied",
            message: "You don't have permission to view this photo.",
            type: "access_denied"
          });
        } else {
          setError({
            title: "Error Loading Photo",
            message: `An error occurred: ${errorMessage}`,
            type: "general"
          });
        }
      }
    }

    checkAccessAndDecrypt();
  }, [nftData, publicKey]);

  if (!publicKey) {
    return (
      <div className="p-8">
        <p>Please connect your wallet to view this photo.</p>
      </div>
    );
  }

  const formatFileSize = (bytes: number) => {
    if (!bytes) return 'Unknown size';
    const kb = bytes / 1024;
    if (kb < 1024) return `${Math.round(kb)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const copyToClipboard = async (text: string, key: string = text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [key]: true }));
      toast.success("Copied to clipboard!");
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  const shareOnTwitter = (url: string) => {
    const text = `Check out this encrypted photo NFT on Solana! 🖼️🔒`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Skeleton */}
          <Card className="p-0">
            <div className="aspect-square bg-gray-200 animate-pulse" />
          </Card>
          
          {/* Details Skeleton */}
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    const retryLoadNFT = async () => {
      setError(null);
      setLoading(true);
      setNftData(null);
    };

    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <ErrorAlert
          title={error.title}
          message={error.message}
          retry={error.type === "load_failed" ? retryLoadNFT : undefined}
          onDismiss={() => setError(null)}
        />
      </div>
    );
  }

  if (!nftData) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8 text-center">
        <p className="text-gray-600">Photo not found.</p>
      </div>
    );
  }

  if (canView === UserRole.none) {
    return <AccessDeniedScreen 
      nftData={nftData} 
      mintAddress={mintAddress} 
      publicKey={publicKey} 
    />;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Image Section */}
        <Card className="p-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.02] group">
          <CardContent className="p-0">
            <div className="relative rounded-lg overflow-hidden aspect-square lg:aspect-auto">
              {decryptedUrl ? (
                <BlurhashImage
                  blurHash={nftData.metadata?.properties?.blur_hash}
                  width={nftData.metadata?.properties?.blur_width}
                  height={nftData.metadata?.properties?.blur_height}
                  src={decryptedUrl}
                  alt={nftData.metadata.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="aspect-square bg-gray-200 animate-pulse flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                </div>
              )}

              {/* Decrypting overlay */}
              {decrypting && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin" />
                    <p className="text-sm">Decrypting photo...</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right: Details & Actions */}
        <div className="space-y-6">
          {/* NFT Title */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {nftData.metadata.name}
            </h1>
            <Badge 
              variant={canView === UserRole.owner ? "default" : "secondary"}
              className="hover:scale-105 transition-transform duration-200"
            >
              {canView === UserRole.owner ? "Owner" : "Viewer"}
            </Badge>
          </div>

          {/* Metadata Grid */}
          <Card className="hover:shadow-lg transition-all duration-200 hover:border-gray-300">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Upload Date</span>
                  </div>
                  <p className="text-sm font-medium">
                    {new Date(nftData.metadata.properties.upload_date).toLocaleDateString()}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <HardDrive className="h-4 w-4" />
                    <span>File Size</span>
                  </div>
                  <p className="text-sm font-medium">
                    {formatFileSize(nftData.metadata.properties.original_size)}
                  </p>
                </div>

                <div className="col-span-2 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Copy className="h-4 w-4" />
                    <span>Mint Address</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 truncate">
                      {mintAddress}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(mintAddress, 'mintAddress')}
                      className="hover:scale-105 transition-all duration-200 hover:shadow-md"
                      aria-label="Copy mint address"
                    >
                      {copiedStates['mintAddress'] ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Share Section (Owner Only) */}
          {canView === UserRole.owner && (
            <Card className="hover:shadow-lg transition-all duration-200 hover:border-blue-200">
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-semibold text-gray-900">Share Access</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full gap-2 border-2 hover:scale-[1.02] transition-all duration-200 hover:shadow-lg hover:border-blue-300"
                    >
                      <Share2 className="h-4 w-4" />
                      Share Photo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl bg-white border-2 shadow-2xl">
                    <DialogHeader>
                      <DialogTitle>Share Photo Access</DialogTitle>
                    </DialogHeader>
                    <ShareAccessDialog 
                      onGrantAccess={handleGrantAccess}
                      isGranting={grantingAccess}
                      currentUserAddress={publicKey?.toBase58()}
                      existingViewers={Object.keys(nftData.metadata.properties.allowed_viewers || {})}
                    />
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          )}

          {/* Blink Section (Owner Only) */}
          {canView === UserRole.owner && (
            <Card className="hover:shadow-lg transition-all duration-200 hover:border-purple-200">
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-semibold text-gray-900">Generate Shareable Link</h3>
                <Button 
                  onClick={generateBlink}
                  variant="outline"
                  className="w-full gap-2 hover:scale-[1.02] transition-all duration-200 hover:shadow-lg hover:bg-purple-50 hover:border-purple-300"
                >
                  <ExternalLink className="h-4 w-4" />
                  Generate Blink URL
                </Button>
                
                {blinkUrl && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input 
                        value={blinkUrl} 
                        readOnly 
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded bg-gray-50 hover:bg-gray-100 transition-colors duration-200 font-mono"
                      />
                      <Button
                        size="sm"
                        onClick={() => copyToClipboard(blinkUrl, 'blinkUrl')}
                        className="hover:scale-105 transition-all duration-200 hover:shadow-md"
                        aria-label="Copy blink URL"
                      >
                        {copiedStates['blinkUrl'] ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => shareOnTwitter(blinkUrl)}
                        className="flex-1 gap-2 hover:scale-[1.02] transition-all duration-200 hover:shadow-md hover:bg-blue-50 hover:border-blue-300"
                      >
                        <Twitter className="h-4 w-4" />
                        Twitter
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(blinkUrl, 'blinkUrl2')}
                        className="flex-1 gap-2 hover:scale-[1.02] transition-all duration-200 hover:shadow-md hover:bg-gray-50"
                        aria-label="Copy blink URL"
                      >
                        {copiedStates['blinkUrl2'] ? (
                          <>
                            <Check className="h-4 w-4 text-green-600" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Error Alert */}
          {error && (
            <ErrorAlert
              title={(error as any).title || 'Error'}
              message={(error as any).message || 'An error occurred'}
              onDismiss={() => setError(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
