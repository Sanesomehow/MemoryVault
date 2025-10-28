"use client";

import { WalletConnectButton } from "@/components/wallet-connect-button";
import { decryptPhoto, Encrypt } from "@/lib/crypto/encrypt";
import { encryptAESKey } from "@/lib/crypto/keyEncryption";
import { generateBlurhash } from "@/lib/blurhash-generator";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { mintPhotoNFT } from "@/lib/nft/nftMint";
import { Gallary } from "../components/gallary";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ErrorAlert from "@/components/ui/error-alert";
import PhotoPreviewCard from "@/components/photo-preview-card";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, Check, ImageIcon, Shield, Zap, Lock, X, ArrowRight, Share2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Home() {
  const [file, setFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [result, setResult] = useState<{
    url: string;
    cid: string;
    metadataCid: string;
  }>();
  // loadingState tracks detailed upload progress
  const [loadingState, setLoadingState] = useState<
    "idle" | "encrypting" | "uploading" | "minting" | "complete"
  >("idle");
  const [displayUrl, setDisplayUrl] = useState<string>();
  const [NftMints, setNftMints] = useState<string[]>([]);
  const [refresh, setRefresh] = useState(0);
  const [sharedNfts, setSharedNfts] = useState<any[]>([]);
  
  // Error handling state
  const [error, setError] = useState<{
    title: string;
    message: string;
    type: "file" | "wallet" | "upload" | "mint" | "general" | "validation";
  } | null>(null);

  const wallet = useWallet();
  const router = useRouter();

  const { connected, signMessage, publicKey } = wallet;

  // Allowed file types
  const allowedFileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/heic', 'image/gif', 'image/webp'];
  const maxFileSize = 50 * 1024 * 1024; // 50MB

  // Fetch shared NFTs
  const fetchSharedNfts = async () => {
    if (!publicKey) return;
    
    try {
      const res = await fetch("/api/shared", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ walletAddress: publicKey.toBase58() }),
      });

      if (res.ok) {
        const data = await res.json();
        setSharedNfts(data.sharedNfts || []);
      }
    } catch (e) {
      console.error("Error fetching shared NFTs:", e);
    }
  };

  // Check for first visit and redirect to onboarding
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('memoryVault_hasSeenOnboarding');
    if (hasSeenOnboarding !== 'true') {
      // Redirect to onboarding on first visit
      router.push('/onboarding');
    }
  }, [router]);

  // Load shared NFTs when wallet connects
  useEffect(() => {
    if (publicKey) {
      fetchSharedNfts();
    } else {
      setSharedNfts([]);
    }
  }, [publicKey, refresh]);

  // File validation function
  const validateFile = (file: File): boolean => {
    // Check file type
    if (!allowedFileTypes.includes(file.type)) {
      setError({
        title: "Invalid File Type",
        message: "Please select a valid image file (PNG, JPG, JPEG, HEIC, GIF, WEBP).",
        type: "validation"
      });
      return false;
    }

    // Check file size
    if (file.size > maxFileSize) {
      setError({
        title: "File Too Large",
        message: "File size must be under 50MB. Please choose a smaller image.",
        type: "validation"
      });
      return false;
    }

    return true;
  };

  // Handle file selection
  const handleFileSelected = (selectedFile: File) => {
    setError(null);
    
    if (validateFile(selectedFile)) {
      // Clean up previous preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  // Handle removing file
  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(undefined);
    setPreviewUrl(undefined);
    setError(null);
  };

  // Handle changing photo (trigger file selector)
  // const handleChangePhoto = () => {
  //   // This will be handled by the dropzone
  //   handleRemoveFile();
  // };

  // Cleanup preview URL on unmount
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

    const uploadFile = async () => {
    setError(null); // Clear previous errors
    
    if (!file) {
      toast.error("No file selected", {
        description: "Please select a photo to upload before proceeding."
      });
      return;
    }
    if (!connected || !signMessage || !publicKey || !wallet) {
      toast.error("Wallet not connected", {
        description: "Please connect your wallet to upload photos."
      });
      return;
    }

    // Use toast.promise to handle the entire upload process
    const uploadPromise = new Promise(async (resolve, reject) => {
      try {
        setLoadingState("encrypting");
        const mimeType: string = file.type;

        // Generate blurhash before encryption
        let blurhashData = null;
        try {
          console.log('Generating blurhash for file:', file.name);
          blurhashData = await generateBlurhash(file);
          console.log('Blurhash generated successfully:', blurhashData);
        } catch (error) {
          console.error('Failed to generate blurhash:', error);
          // Continue without blurhash if generation fails
          blurhashData = { blurHash: '', width: 0, height: 0 };
        }

        // 1) Encrypt locally
        const { encFile, keyArray, IV } = await Encrypt(file);

        // move to uploading step
        setLoadingState("uploading");

        const { encrypted: encryptedKey, nonce } = encryptAESKey(
          keyArray,
          publicKey.toBytes()
        );

        console.log("AES key encrypted successfully");

        const data = new FormData();
        data.set("file", encFile);
        data.set("name", file.name);
        data.set("type", mimeType);
        data.set("iv", IV);
        data.set("size", file.size.toString());
        data.set("encryptedKey", encryptedKey);
        data.set("nonce", nonce);
        
        // Add blurhash data to form
        data.set("blurHash", blurhashData.blurHash);
        data.set("imageWidth", blurhashData.width.toString());
        data.set("imageHeight", blurhashData.height.toString());

        console.log('Sending blurhash data to API:', {
          blurHash: blurhashData.blurHash,
          imageWidth: blurhashData.width,
          imageHeight: blurhashData.height
        });

        const uploadRequest = await fetch("/api/files", {
          method: "POST",
          body: data,
        });

        if (!uploadRequest.ok) {
          throw new Error(`Upload failed with status ${uploadRequest.status}`);
        }

        const result = await uploadRequest.json();
        console.log("upload request:", uploadRequest);
        console.log("=== Upload Result ===");
        console.log("Image CID:", result.cid);
        console.log("Metadata CID:", result.metadataCid);
        console.log("Are they different?", result.cid !== result.metadataCid);
        setResult(result);
        
        // after successful upload, move to minting
        setLoadingState("minting");
        await getFile(result);

        const uri = `ipfs://${result.metadataCid}`;
        console.log("=== Minting NFT ===");
        console.log("URI being used:", uri);
        console.log("=== About to mint ===");
        console.log("File name:", file.name);
        console.log("File name length:", file.name.length);
        console.log(
          "File name bytes:",
          new TextEncoder().encode(file.name).length
        );
        const { signature, mintAddress } = await mintPhotoNFT(
          file.name,
          uri,
          wallet
        );

        console.log("Transaction:", signature);
        console.log("NFT Mint Address:", mintAddress);

        console.log(
          "Verify on explorer:",
          `https://explorer.solana.com/address/${mintAddress}?cluster=devnet`
        );

        setNftMints((prev) => [...prev, mintAddress]);
        setRefresh((prev) => prev + 1);
        setLoadingState("complete");
        
        // Reset form after successful upload
        setTimeout(() => {
          setLoadingState("idle");
          handleRemoveFile();
        }, 3000);

        resolve({ signature, mintAddress });
      } catch (e) {
        console.error("Upload/Mint error:", e);
        setLoadingState("idle");
        reject(e);
      }
    });

    // Use toast.promise for the entire upload process
    toast.promise(uploadPromise, {
      loading: 'Encrypting and uploading photo...',
      success: (result: any) => {
        return `Photo minted successfully! Transaction: ${result.signature.slice(0, 8)}...`;
      },
      error: (error: any) => {
        const errorMessage = (error as Error).message;
        
        if (errorMessage.includes("Upload failed")) {
          setError({
            title: "Upload Failed",
            message: "Failed to upload your photo to IPFS. Please check your connection and try again.",
            type: "upload"
          });
        } else if (errorMessage.includes("mint") || errorMessage.includes("transaction")) {
          setError({
            title: "Minting Failed", 
            message: `Failed to mint NFT. Error: ${errorMessage}. View transaction details on Solana Explorer.`,
            type: "mint"
          });
        } else {
          setError({
            title: "Upload Error",
            message: `An unexpected error occurred: ${errorMessage}`,
            type: "general"
          });
        }
        
        return `Upload failed: ${errorMessage}`;
      }
    });
  };

  const getFile = async (result: {
    url: string;
    cid: string;
    metadataCid: string;
  }) => {
    try {
      if (!result || !publicKey) {
        setError({
          title: "Decryption Error",
          message: "Unable to decrypt photo - missing data or wallet not connected.",
          type: "general"
        });
        return;
      }

      console.log("Decrypting photo...");

      const metadataUrl = `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${result.metadataCid}`;
      const metadataResponse = await fetch(metadataUrl);
      if (!metadataResponse.ok) {
        throw new Error("Failed to fetch metadata");
      }
      
      const metadata = await metadataResponse.json();
      console.log("Fetched metadata:", metadata);
      
      const {
        encrypted_content_cid,
        encryption_params,
        owner_encrypted_key,
        files
      } = metadata.properties;

      const displayUrl = await decryptPhoto({
        encryptedContentCid: encrypted_content_cid,
        publicKey: publicKey.toBytes(),
        encryptionParams: encryption_params,
        encryptedKey: owner_encrypted_key,
        fileType: files[0].type
      });

      console.log("Photo decrypted successfully.");
      setDisplayUrl(displayUrl);
      console.log("Decrypted message url: ", displayUrl);
    } catch (e) {
      console.error("Decryption failed:", e);
      setError({
        title: "Decryption Failed",
        message: `Failed to decrypt photo: ${(e as Error).message}`,
        type: "general"
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-12 animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center py-16">
        <h1 className="text-5xl font-bold mb-6">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Store Your Memories Securely
          </span>
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          End-to-end encrypted photo storage on Solana blockchain
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">End-to-End Encrypted</span>
          </div>
          <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-medium">Solana Powered</span>
          </div>
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full">
            <Lock className="h-4 w-4" />
            <span className="text-sm font-medium">Your Keys, Your Privacy</span>
          </div>
        </div>

        {!connected && (
          <div className="flex items-center justify-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg inline-flex">
            <span>Connect your wallet to get started</span>
          </div>
        )}
      </section>

      {/* How It Works Section */}
      {/* <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Three simple steps to secure your memories forever
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="text-center space-y-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Upload className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Upload Your Photo</h3>
              <p className="text-gray-600">
                Select any photo from your device. We support PNG, JPG, HEIC, GIF, and WebP formats up to 50MB.
              </p>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                <ImageIcon className="h-4 w-4" />
                <span>All formats supported</span>
              </div>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <div className="flex items-center">
                <div className="w-16 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"></div>
                <ArrowRight className="h-6 w-6 text-purple-500 ml-2" />
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Lock className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-sm">2</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Encrypt & Store</h3>
              <p className="text-gray-600">
                Your photo is encrypted on your device using your wallet's keys, then stored on IPFS and minted as an NFT.
              </p>
              <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
                <Shield className="h-4 w-4" />
                <span>End-to-end encrypted</span>
              </div>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <div className="flex items-center">
                <div className="w-16 h-0.5 bg-gradient-to-r from-purple-400 to-green-400"></div>
                <ArrowRight className="h-6 w-6 text-green-500 ml-2" />
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Share2 className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">3</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Share Securely</h3>
              <p className="text-gray-600">
                Share your encrypted photos with friends while maintaining full control. Only you decide who can see them.
              </p>
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                <Zap className="h-4 w-4" />
                <span>Your keys, your control</span>
              </div>
            </div>
          </div>

          <div className="text-center mt-12 space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/20 rounded-lg p-4">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-gray-700 font-medium">Zero-knowledge privacy guaranteed</span>
            </div>
            <div>
              <Button
                variant="outline"
                onClick={() => router.push('/onboarding')}
                className="text-sm bg-white/80 hover:bg-white"
              >
                View Tutorial Again
              </Button>
            </div>
          </div>
        </div>
      </section> */}

      {/* Upload Section */}
      <section className="space-y-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Upload Your Photo</CardTitle>
            <CardDescription>
              Select a photo to encrypt and mint as an NFT on Solana
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!connected && (
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Connect your wallet to start uploading photos</p>
                <div className="mt-4">
                  <WalletConnectButton />
                </div>
              </div>
            )}

            {connected && (
              <>
                {!file || !previewUrl ? (
                  <div className="space-y-4">
                    <FileUpload 
                      onChange={(files) => {
                        if (files.length > 0) {
                          handleFileSelected(files[0]);
                        }
                      }}
                    />
                    <p className="text-sm text-gray-500 text-center">
                      Supported: PNG, JPG, HEIC, GIF, WEBP • Max: 50MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Photo Preview */}
                    <div className="relative group">
                      <img
                        src={previewUrl}
                        alt={file.name}
                        className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105"
                        onClick={handleRemoveFile}
                        disabled={loadingState !== "idle"}
                        aria-label="Remove photo"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* File Info */}
                    <div className="text-center space-y-2">
                      <h3 className="font-medium text-gray-900" title={file.name}>
                        {file.name.length > 40 ? `${file.name.substring(0, 40)}...` : file.name}
                      </h3>
                      <div className="flex justify-center gap-4 text-sm text-gray-500">
                        <span>{file.type}</span>
                        <span>{(file.size / (1024 * 1024)).toFixed(4)} MB</span>
                      </div>
                    </div>

                    {/* Upload Button */}
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <Button
                          onClick={uploadFile}
                          disabled={loadingState !== "idle"}
                          className={cn(
                            "flex-1 transition-all border border-black-500 duration-200 hover:scale-105 hover:shadow-lg",
                            loadingState === "encrypting" && "animate-pulse bg-blue-600",
                            loadingState === "uploading" && "animate-pulse bg-purple-600",
                            loadingState === "minting" && "animate-pulse bg-green-600",
                            loadingState === "complete" && "bg-green-600 animate-bounce"
                          )}
                          size="lg"
                        >
                          {loadingState === "idle" && (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Upload & Mint NFT
                            </>
                          )}
                          {loadingState === "encrypting" && (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Encrypting...
                            </>
                          )}
                          {loadingState === "uploading" && (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Uploading to IPFS...
                            </>
                          )}
                          {loadingState === "minting" && (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Minting NFT...
                            </>
                          )}
                          {loadingState === "complete" && (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Success! ✓
                            </>
                          )}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={handleRemoveFile}
                          disabled={loadingState !== "idle"}
                          className="transition-all duration-200 bg-red-400 text-white border-red-100 hover:scale-105 hover:shadow-lg hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                          aria-label="Remove photo and select new one"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Progress Indicator */}
                      {loadingState !== "idle" && (
                        <div className="text-center space-y-2">
                          <div className="text-sm text-gray-600">
                            {loadingState === "encrypting" && "🔐 Step 1/3 — Encrypting photo"}
                            {loadingState === "uploading" && "📤 Step 2/3 — Uploading to IPFS"}
                            {loadingState === "minting" && "🎨 Step 3/3 — Minting NFT"}
                            {loadingState === "complete" && "✅ Upload complete!"}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: loadingState === "encrypting" ? "33%" :
                                       loadingState === "uploading" ? "66%" :
                                       loadingState === "minting" ? "90%" :
                                       loadingState === "complete" ? "100%" : "0%"
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Show error as toast notification */}
            {error && (
              <div className="mt-4">
                {(() => {
                  const toastId = toast.error(error.message, {
                    description: error.title,
                    action: error.type === "upload" || error.type === "mint" ? {
                      label: "Retry",
                      onClick: () => {
                        toast.dismiss(toastId);
                        uploadFile();
                      }
                    } : undefined,
                  });
                  // Clear error after showing toast
                  setTimeout(() => setError(null), 100);
                  return null;
                })()}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Gallery Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Photo Gallery</h2>
          <p className="text-gray-600">View and manage your encrypted photo NFTs</p>
        </div>

        {publicKey ? (
          <Gallary key={refresh} publicKey={publicKey} sharedNfts={sharedNfts} refresh={refresh} />
        ) : (
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Connect Your Wallet</h3>
              <p className="text-gray-600 mb-4">Connect your wallet to view your encrypted photos</p>
              <WalletConnectButton />
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
