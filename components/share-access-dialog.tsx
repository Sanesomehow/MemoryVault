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
import { Clock, Eye, AlertTriangle, Share2, Wallet, Timer, Hash } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorAlert } from "@/components/ui/error-alert";
import bs58 from "bs58";

interface ShareAccessDialogProps {
  onGrantAccess: (walletAddress: string, options?: {
    timeLimit?: string;
    viewLimit?: number;
  }) => Promise<void>;
  isGranting: boolean;
  currentUserAddress?: string;
  existingViewers?: string[];
}

export function ShareAccessDialog({ 
  onGrantAccess, 
  isGranting, 
  currentUserAddress,
  existingViewers = []
}: ShareAccessDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"input" | "confirm">("input");
  const [walletAddress, setWalletAddress] = useState("");
  const [timeLimit, setTimeLimit] = useState("never");
  const [viewLimit, setViewLimit] = useState<number>(0);
  const [validationError, setValidationError] = useState<string>("");

  const validateWalletAddress = (address: string): boolean => {
    if (!address.trim()) {
      setValidationError("Wallet address is required");
      return false;
    }

    try {
      const decoded = bs58.decode(address);
      if (decoded.length !== 32) {
        setValidationError("Invalid Solana address format");
        return false;
      }
    } catch (e) {
      setValidationError("Invalid base58 format");
      return false;
    }

    if (currentUserAddress && address === currentUserAddress) {
      setValidationError("Cannot grant access to your own wallet");
      return false;
    }

    if (existingViewers.includes(address)) {
      setValidationError("Access already granted to this wallet");
      return false;
    }

    return true;
  };

  const handleNext = () => {
    setValidationError("");
    
    if (validateWalletAddress(walletAddress)) {
      setStep("confirm");
    }
  };

  const handleConfirm = async () => {
    try {
      const options = {
        timeLimit: timeLimit !== "never" ? timeLimit : undefined,
        viewLimit: viewLimit > 0 ? viewLimit : undefined
      };
      
      await onGrantAccess(walletAddress, options);
      
      setWalletAddress("");
      setTimeLimit("never");
      setViewLimit(0);
      setStep("input");
      setOpen(false);
    } catch (error) {
      console.error("Grant access failed:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setStep("input");
    setValidationError("");
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <div className="space-y-4">
      {step === "input" && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Grant Access to Photo</h3>
            <p className="text-sm text-gray-600">
              Enter the wallet address of the person you want to share this photo with.
            </p>
          </div>

          <Card className="border-2 hover:border-blue-200 transition-colors duration-200">
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="wallet-address" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Wallet className="h-4 w-4" />
                  Wallet Address *
                </label>
                <input
                  id="wallet-address"
                  type="text"
                  placeholder="Enter Solana wallet address..."
                  value={walletAddress}
                  onChange={(e) => {
                    setWalletAddress(e.target.value);
                    setValidationError("");
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm font-mono"
                />
                {validationError && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {validationError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="time-limit" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Timer className="h-4 w-4" />
                  Access Duration (Optional)
                </label>
                <select
                  id="time-limit"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                >
                  <option value="never">Permanent</option>
                  <option value="1h">1 Hour</option>
                  <option value="1d">1 Day</option>
                  <option value="1w">1 Week</option>
                  <option value="1m">1 Month</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="view-limit" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Hash className="h-4 w-4" />
                  View Limit (Optional)
                </label>
                <input
                  id="view-limit"
                  type="number"
                  min="0"
                  placeholder="0 = Unlimited"
                  value={viewLimit || ""}
                  onChange={(e) => setViewLimit(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                />
                <p className="text-xs text-gray-500">Leave as 0 for unlimited views</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 hover:scale-[1.02] transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleNext}
              disabled={!walletAddress.trim()}
              className="flex-1 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {step === "confirm" && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Access Grant</h3>
            <p className="text-sm text-gray-600">
              Review the details before granting access to your photo.
            </p>
          </div>

          <Card className="border-2 border-blue-100 bg-blue-50/50">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-gray-900 mb-4">Access Summary:</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Wallet:</span>
                  <code className="text-sm font-mono bg-white px-2 py-1 rounded border">
                    {shortenAddress(walletAddress)}
                  </code>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Duration:</span>
                  <span className="text-sm font-medium">
                    {timeLimit === "never" ? "Permanent" : 
                     timeLimit === "1h" ? "1 Hour" :
                     timeLimit === "1d" ? "1 Day" :
                     timeLimit === "1w" ? "1 Week" :
                     timeLimit === "1m" ? "1 Month" : "Permanent"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">View Limit:</span>
                  <span className="text-sm font-medium">
                    {viewLimit > 0 ? `${viewLimit} views` : "Unlimited"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-200 bg-amber-50/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800">Transaction Fee Required</p>
                  <p className="text-sm text-amber-700">This will cost approximately 0.001 SOL in transaction fees.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep("input")}
              disabled={isGranting}
              className="flex-1 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
            >
              Go Back
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={isGranting}
              className="flex-1 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isGranting ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  <span>Confirming...</span>
                </div>
              ) : (
                "Confirm & Grant Access"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShareAccessDialog;