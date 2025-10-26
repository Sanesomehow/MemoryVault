"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Send, User, Wallet, MessageSquare, Info } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";

interface RequestAccessModalProps {
  ownerAddress: string;
  mintAddress: string;
  requesterAddress: string;
  nftName: string;
  onRequestSent?: () => void;
}

export function RequestAccessModal({ 
  ownerAddress, 
  mintAddress, 
  requesterAddress, 
  nftName,
  onRequestSent 
}: RequestAccessModalProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const handleSubmit = async () => {
    if (!requesterAddress) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/requests/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ownerAddress,
          mintAddress,
          requesterAddress,
          message: message.trim() || null,
          nftName
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      
      localStorage.setItem(`access_request_${mintAddress}`, JSON.stringify({
        status: "pending",
        timestamp: Date.now(),
        requestId: result.requestId
      }));

      toast.success("Access request sent!", {
        description: "The owner will be notified of your request."
      });

      setOpen(false);
      setMessage("");
      onRequestSent?.();
      
    } catch (error) {
      console.error("Failed to send access request:", error);
      toast.error("Failed to send request", {
        description: error instanceof Error ? error.message : "Please try again later"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full gap-2 border-2 hover:scale-[1.02] transition-all duration-200 hover:shadow-lg hover:border-green-300 hover:bg-green-50"
        >
          <Send className="h-4 w-4" />
          Request Access
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl bg-white border-2 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Request Photo Access
          </DialogTitle>
          <DialogDescription>
            Send a request to view "{nftName}" to the photo owner.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Wallet Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-2 hover:border-blue-200 transition-colors duration-200">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <User className="h-4 w-4" />
                    Photo Owner
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
                    <Wallet className="h-4 w-4 text-gray-600" />
                    <code className="text-sm font-mono">{shortenAddress(ownerAddress)}</code>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors duration-200">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Wallet className="h-4 w-4" />
                    Your Wallet
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200">
                    <Wallet className="h-4 w-4 text-green-600" />
                    <code className="text-sm font-mono">{shortenAddress(requesterAddress)}</code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message Section */}
          <Card className="border-2 hover:border-blue-200 transition-colors duration-200">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <MessageSquare className="h-4 w-4" />
                Message (Optional)
              </div>
              <textarea
                id="message"
                placeholder="Why would you like to access this photo? (Optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 200))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-sm"
              />
              <div className="text-right text-xs text-gray-500">
                {message.length}/200 characters
              </div>
            </CardContent>
          </Card>

          {/* Info Section */}
          <Card className="border-2 border-blue-100 bg-blue-50/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-800 font-medium">Request Information</p>
                  <p className="text-sm text-blue-700 mt-1">
                    The photo owner will receive a notification about your request. 
                    They can approve or deny access at any time.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
            className="hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !requesterAddress}
            className="gap-2 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                <span>Sending...</span>
              </div>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send Request
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}