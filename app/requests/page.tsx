"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Clock, User, MessageSquare, Check, X, CheckCircle, Users, Upload, Eye, Key, Share2 } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorAlert } from "@/components/ui/error-alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { WalletConnectButton } from "@/components/wallet-connect-button";
import ShareAccessDialog from "@/components/share-access-dialog";
import Link from "next/link";
import { toast } from "sonner";

interface AccessRequest {
  id: string;
  requesterWallet: string;
  ownerWallet: string;
  mintAddress: string;
  nftName?: string;
  message?: string;
  status: "pending" | "approved" | "denied";
  createdAt: string;
  updatedAt: string;
}

export default function RequestsPage() {
  const { publicKey, signTransaction, signAllTransactions } = useWallet();
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingRequests, setProcessingRequests] = useState<Set<string>>(new Set());
  const [error, setError] = useState<{ title: string; message: string } | null>(null);
  const [grantingAccess, setGrantingAccess] = useState<boolean>(false);
  const [nftDataCache, setNftDataCache] = useState<Record<string, any>>({});

  // Fetch access requests
  const fetchRequests = async () => {
    if (!publicKey) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/requests/list?owner=${publicKey.toBase58()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch requests: ${response.status}`);
      }

      const data = await response.json();
      setRequests(data.requests || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError({
        title: "Failed to Load Requests",
        message: err instanceof Error ? err.message : "Please try again later"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [publicKey]);

  const handleRequestResponse = async (requestId: string, action: "approve" | "deny") => {
    if (action === "deny") {
      // Simple deny - just update status
      setProcessingRequests(prev => new Set(prev).add(requestId));
      
      try {
        const response = await fetch(`/api/requests/respond`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requestId, action })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        // Update local state
        setRequests(prev => 
          prev.map(req => 
            req.id === requestId 
              ? { ...req, status: "denied" }
              : req
          )
        );

        toast.success("Request denied", {
          description: "The request has been declined"
        });
      } catch (err) {
        console.error(`Error denying request:`, err);
        toast.error(`Failed to deny request`, {
          description: err instanceof Error ? err.message : "Please try again"
        });
      } finally {
        setProcessingRequests(prev => {
          const next = new Set(prev);
          next.delete(requestId);
          return next;
        });
      }
    } else {
      // Approve AND grant access in one step
      await handleApproveAndGrantAccess(requestId);
    }
  };

  const handleApproveAndGrantAccess = async (requestId: string) => {
    setProcessingRequests(prev => new Set(prev).add(requestId));
    
    try {
      // First approve the request
      const response = await fetch(`/api/requests/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action: "approve" })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      const request = result.request;

      // Now grant access by updating NFT metadata
      await handleGrantAccess(request.requesterWallet, request.mintAddress);

      // Update local state to remove from pending
      setRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: "approved" }
            : req
        )
      );

      toast.success("Access granted successfully!", {
        description: "The user can now view and decrypt your photo"
      });
    } catch (err) {
      console.error(`Error approving and granting access:`, err);
      toast.error(`Failed to grant access`, {
        description: err instanceof Error ? err.message : "Please try again"
      });
    } finally {
      setProcessingRequests(prev => {
        const next = new Set(prev);
        next.delete(requestId);
        return next;
      });
    }
  };

  const handleBulkAction = async (action: "approve" | "deny") => {
    const pendingRequests = requests.filter(req => req.status === "pending");
    
    if (pendingRequests.length === 0) {
      toast.error("No pending requests to process");
      return;
    }

    const confirmation = confirm(
      `Are you sure you want to ${action} all ${pendingRequests.length} pending requests?`
    );
    
    if (!confirmation) return;

    for (const request of pendingRequests) {
      await handleRequestResponse(request.id, action);
    }
  };

  // Load NFT data for sharing access
  const loadNftData = async (mintAddress: string) => {
    if (nftDataCache[mintAddress]) return nftDataCache[mintAddress];
    
    try {
      const { fetchSingleNft } = await import("@/lib/nft/nftFetch");
      const { PublicKey } = await import("@solana/web3.js");
      
      if (!publicKey) throw new Error("Wallet not connected");
      
      const nftData = await fetchSingleNft(publicKey, mintAddress);
      setNftDataCache(prev => ({ ...prev, [mintAddress]: nftData }));
      return nftData;
    } catch (error) {
      console.error("Failed to load NFT data:", error);
      throw error;
    }
  };

  // Handle granting access (updating NFT metadata with encryption key)
  const handleGrantAccess = async (
    walletAddress: string, 
    mintAddress: string,
    options?: { timeLimit?: string; viewLimit?: number }
  ) => {
    console.log("🚀 Starting handleGrantAccess:", { walletAddress, mintAddress, options });
    setGrantingAccess(true);
    try {
      if (!publicKey) {
        throw new Error("Wallet not connected");
      }

      console.log("📱 Owner wallet:", publicKey.toBase58());

      // Load NFT data
      console.log("📦 Loading NFT data for:", mintAddress);
      const nftData = await loadNftData(mintAddress);
      console.log("📦 NFT data loaded:", nftData);
      
      const encryptedKey = nftData.metadata.properties.owner_encrypted_key;
      const nonce = nftData.metadata.properties.encryption_params.nonce;
      
      // Import crypto functions dynamically
      const { decryptAESKey, encryptAESKey } = await import("@/lib/crypto/keyEncryption");
      const bs58 = await import("bs58");
      
      const viewerBytes = bs58.default.decode(walletAddress);
      const ownerBytes = publicKey.toBytes();

      const originalKey = decryptAESKey(encryptedKey, nonce, ownerBytes);
      if (!originalKey) {
        throw new Error("Decryption failed");
      }

      const newKey = encryptAESKey(originalKey, viewerBytes);

      // Create new metadata with access controls
      const viewerAccess: {
        encrypted_key: string;
        nonce: string;
        expires_at?: string;
        view_limit?: number;
        views_remaining?: number;
      } = {
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
      
      console.log("🔄 Sending update request to /api/update with:", {
        viewerWallet: walletAddress,
        mintAddress: mintAddress,
        owner: publicKey.toBase58(),
        metadataPreview: {
          name: newMetadata.name,
          allowedViewersCount: Object.keys(newMetadata.properties.allowed_viewers).length
        }
      });

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

      console.log("📤 Update request response status:", updateRequest.status);

      if (!updateRequest.ok) {
        const errorData = await updateRequest.json().catch(() => ({}));
        console.error("❌ Update request failed:", errorData);
        throw new Error(`Update failed: ${errorData.details || updateRequest.statusText}`);
      }

      const result = await updateRequest.json();
      console.log("✅ Metadata uploaded to IPFS:", result);

      // Now update the NFT metadata URI on-chain
      console.log("🔗 Updating NFT metadata URI on-chain...");
      const { umi } = await import("@/lib/umi");
      const { updateV1 } = await import("@metaplex-foundation/mpl-token-metadata");
      const { publicKey: umiPublicKey } = await import("@metaplex-foundation/umi");
      const { walletAdapterIdentity } = await import("@metaplex-foundation/umi-signer-wallet-adapters");

      // Configure UMI with wallet (same setup as photo detail page)
      umi.use(walletAdapterIdentity({
        publicKey,
        signTransaction,
        signAllTransactions,
      }));

      const newMetadataUri = `ipfs://${result.metadataCid}`;
      console.log("📍 New metadata URI:", newMetadataUri);

      const creatorsArray = nftData.nft.metadata.creators ?? [
        {
          address: nftData.nft.metadata.updateAuthority,
          verified: true,
          share: 100,
        },
      ];

      const updatedData = {
        name: nftData.nft.name || "MemoryVault Photo",
        symbol: "MVLT",
        sellerFeeBasisPoints: nftData.nft.seller_fee_basis_points,
        uri: newMetadataUri,
        creators: creatorsArray,
      };

      console.log("🚀 Sending blockchain transaction...");
      const changeUri = await updateV1(umi, {
        mint: umiPublicKey(mintAddress),
        authority: umi.identity,
        data: updatedData,
      }).sendAndConfirm(umi);

      console.log("✅ NFT metadata updated on-chain:", changeUri);

      toast.success("Access granted successfully!", {
        description: "The user can now decrypt and view the photo."
      });

      // Clear cache to force reload
      setNftDataCache(prev => {
        const newCache = { ...prev };
        delete newCache[mintAddress];
        return newCache;
      });

      // Refresh the requests list to reflect changes
      await fetchRequests();

      // Add a small delay to ensure blockchain propagation
      setTimeout(() => {
        console.log("✨ Access granted - blockchain update should be propagated now");
      }, 3000);
      
    } catch (e) {
      console.error("Error granting access:", e);
      toast.error("Failed to grant access", {
        description: (e as Error).message
      });
      throw e;
    } finally {
      setGrantingAccess(false);
    }
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const timeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  if (!publicKey) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Access Requests</h1>
        
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6 text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Connect Your Wallet</h2>
            <p className="text-gray-600 mb-8">
              Please connect your wallet to view and manage access requests for your photos.
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Access Requests</h1>
        
        <div className="flex justify-center py-12">
          <LoadingSpinner text="Loading requests..." size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Access Requests</h1>
        
        <div className="max-w-2xl mx-auto">
          <ErrorAlert
            title={error.title}
            message={error.message}
            retry={fetchRequests}
            onDismiss={() => setError(null)}
          />
        </div>
      </div>
    );
  }

  const pendingRequests = requests.filter(req => req.status === "pending");
  const approvedRequests = requests.filter(req => req.status === "approved");
  const deniedRequests = requests.filter(req => req.status === "denied");

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Access Requests</h1>
          
          {/* Action Buttons */}
          {pendingRequests.length > 0 && (
            <div className="flex gap-3">
              <Button
                onClick={() => handleBulkAction("approve")}
                className="gap-2 border border-black-300 hover:scale-[1.02] transition-all duration-200"
              >
                <Check className="h-4 w-4" />
                Approve All ({pendingRequests.length})
              </Button>
              <Button
                variant="outline"
                onClick={() => handleBulkAction("deny")}
                className="gap-2 hover:scale-[1.02] transition-all duration-200"
              >
                <X className="h-4 w-4" />
                Deny All
              </Button>
            </div>
          )}
        </div>
        
        <p className="text-gray-600">
          Manage who can view your encrypted photos. Approve or deny access requests from other users.
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Clock className="h-5 w-5 text-amber-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Pending Requests
              </h2>
              <Badge variant="secondary" className="px-3 py-1">
                {pendingRequests.length}
              </Badge>
            </div>
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onApprove={() => handleRequestResponse(request.id, "approve")}
                  onDeny={() => handleRequestResponse(request.id, "deny")}
                  isProcessing={processingRequests.has(request.id)}
                  shortenAddress={shortenAddress}
                  timeAgo={timeAgo}
                />
              ))}
            </div>
          </div>
        )}

        {/* Approved Requests */}
        {approvedRequests.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Recently Approved
              </h2>
              <Badge variant="secondary" className="px-3 py-1">
                {approvedRequests.length}
              </Badge>
            </div>
            <div className="space-y-4">
              {approvedRequests.slice(0, 10).map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  shortenAddress={shortenAddress}
                  timeAgo={timeAgo}
                  readonly
                />
              ))}
            </div>
          </div>
        )}

        {/* Denied Requests */}
        {deniedRequests.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <X className="h-5 w-5 text-red-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Denied Requests
              </h2>
              <Badge variant="secondary" className="px-3 py-1">
                {deniedRequests.length}
              </Badge>
            </div>
            <div className="space-y-4">
              {deniedRequests.slice(0, 10).map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  shortenAddress={shortenAddress}
                  timeAgo={timeAgo}
                  readonly
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {requests.length === 0 && (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">No pending requests</h3>
              <p className="text-gray-600 mb-8">
                When people request access to your private photos, they'll appear here. 
                Share your photos to start receiving requests.
              </p>
              <Link href="/">
                <Button className="gap-2 hover:scale-[1.02] transition-all duration-200">
                  <Upload className="w-4 h-4" />
                  Upload Your First Photo
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Request card component
function RequestCard({
  request,
  onApprove,
  onDeny,
  isProcessing = false,
  shortenAddress,
  timeAgo,
  readonly = false
}: {
  request: AccessRequest;
  onApprove?: () => void;
  onDeny?: () => void;
  isProcessing?: boolean;
  shortenAddress: (address: string) => string;
  timeAgo: (dateString: string) => string;
  readonly?: boolean;
}) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            Approved
          </span>
        );
      case 'denied':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
            Denied
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
            Pending
          </span>
        );
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Photo Thumbnail */}
          <div className="w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
            <div className="w-8 h-8 bg-gray-400 rounded" />
          </div>

          {/* Info Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {request.nftName || "Untitled Photo"}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <User className="h-3 w-3" />
                  <code className="text-xs">{shortenAddress(request.requesterWallet)}</code>
                  <span>•</span>
                  <span>{timeAgo(request.createdAt)}</span>
                </div>
              </div>
              <div className="flex-shrink-0 ml-4 flex items-center">
                {getStatusBadge(request.status)}
              </div>
            </div>

            {/* Message */}
            {request.message && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700 leading-relaxed">{request.message}</p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          {!readonly && request.status === "pending" && (
            <div className="flex gap-3 flex-shrink-0">
              <Button
                onClick={onApprove}
                disabled={isProcessing}
                className="gap-2 border border-black-300 hover:scale-[1.02] transition-all duration-200 disabled:hover:scale-100"
              >
                {isProcessing ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Approve & Grant Access
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={onDeny}
                disabled={isProcessing}
                className="gap-2 hover:scale-[1.02] transition-all duration-200 disabled:hover:scale-100"
              >
                {isProcessing ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <X className="h-4 w-4" />
                    Deny
                  </>
                )}
              </Button>
            </div>
          )}


        </div>
      </CardContent>
    </Card>
  );
}