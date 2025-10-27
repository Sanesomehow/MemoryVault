"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Clock, User, MessageSquare, Check, X, CheckCircle, Users, Upload, Eye } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorAlert } from "@/components/ui/error-alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WalletConnectButton } from "@/components/wallet-connect-button";
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
  const { publicKey } = useWallet();
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingRequests, setProcessingRequests] = useState<Set<string>>(new Set());
  const [error, setError] = useState<{ title: string; message: string } | null>(null);

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
            ? { ...req, status: action === "approve" ? "approved" : "denied" }
            : req
        )
      );

      toast.success(
        action === "approve" ? "Access granted!" : "Request denied",
        {
          description: action === "approve" 
            ? "The user can now view your photo" 
            : "The request has been declined"
        }
      );
    } catch (err) {
      console.error(`Error ${action}ing request:`, err);
      toast.error(`Failed to ${action} request`, {
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
  const processedRequests = requests.filter(req => req.status !== "pending");

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

        {/* Processed Requests */}
        {processedRequests.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Activity
              </h2>
              <Badge variant="secondary" className="px-3 py-1">
                {processedRequests.length}
              </Badge>
            </div>
            <div className="space-y-4">
              {processedRequests.slice(0, 10).map((request) => (
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
                    Approve
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