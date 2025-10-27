"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletConnectButton } from "@/components/wallet-connect-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  ArrowLeft,
  Shield, 
  Lock, 
  Upload, 
  Wallet, 
  Eye,
  Share2,
  CheckCircle,
  AlertCircle,
  Image,
  Zap,
  Key,
  ContainerIcon,
  Link,
  Link2Off,
  BlocksIcon,
  Container
} from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  content: React.ReactNode;
  canProceed: boolean;
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const router = useRouter();
  const { connected, publicKey } = useWallet();

  useEffect(() => {
    // Check if user has already seen onboarding
    const seen = localStorage.getItem('memoryVault_hasSeenOnboarding');
    if (seen === 'true') {
      setHasSeenOnboarding(true);
      // Redirect to home if they've already seen it
      router.push('/');
    }
  }, [router]);

  const completeOnboarding = () => {
    localStorage.setItem('memoryVault_hasSeenOnboarding', 'true');
    toast.success("Welcome to MemoryVault! 🎉", {
      description: "Your secure photo vault is ready to use."
    });
    router.push('/');
  };

  const skipOnboarding = () => {
    localStorage.setItem('memoryVault_hasSeenOnboarding', 'true');
    router.push('/');
  };

  const handleFileSelected = (files: File[]) => {
    if (files.length > 0) {
      setUploadFile(files[0]);
    }
  };

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: "What is MemoryVault?",
      description: "Learn about our secure, encrypted photo storage",
      canProceed: true,
      content: (
        <div className="space-y-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Key className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Your Photos, Your Keys, Your Privacy
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              MemoryVault uses cutting-edge encryption to keep your memories safe and private.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-100 rounded-lg">
              <Lock className="h-8 w-8 text-blue-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">End-to-End Encrypted</h4>
              <p className="text-gray-600 text-sm">
                Photos are encrypted on your device before upload. Only you can decrypt them.
              </p>
            </div>
            
            <div className="text-center p-6 bg-red-100 rounded-lg">
              <Container className="h-8 w-8 text-purple-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Blockchain Powered</h4>
              <p className="text-gray-600 text-sm">
                Built on Solana for fast, secure, and decentralized storage.
              </p>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <Share2 className="h-8 w-8 text-green-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Controlled Sharing</h4>
              <p className="text-gray-600 text-sm">
                Share photos securely with friends while maintaining full control.
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-semibold text-amber-800 mb-2">Important: We Never See Your Photos</h5>
                <p className="text-amber-700 text-sm">
                  Your photos are encrypted using your wallet's keys before leaving your device. 
                  Even we cannot see your original images - true zero-knowledge privacy.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Connect Your Wallet",
      description: "Your wallet secures your photos with cryptographic keys",
      canProceed: connected,
      content: (
        <div className="space-y-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wallet className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Why Do We Need Your Wallet?
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Your Solana wallet provides the cryptographic keys needed to secure your photos.
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-semibold text-sm">1</span>
              </div>
              <div>
                <h5 className="font-semibold text-gray-900 mb-1">Encryption Keys</h5>
                <p className="text-gray-600 text-sm">
                  Your wallet generates unique encryption keys for each photo
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-semibold text-sm">2</span>
              </div>
              <div>
                <h5 className="font-semibold text-gray-900 mb-1">NFT Minting</h5>
                <p className="text-gray-600 text-sm">
                  Creates a blockchain record proving ownership of your encrypted photo
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-semibold text-sm">3</span>
              </div>
              <div>
                <h5 className="font-semibold text-gray-900 mb-1">Secure Access</h5>
                <p className="text-gray-600 text-sm">
                  Only you can decrypt and view your photos using your wallet
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            {!connected ? (
              <div className="space-y-4">
                <WalletConnectButton />
                <p className="text-sm text-gray-500">
                  We recommend Phantom, Solflare, or any Solana-compatible wallet
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Wallet Connected!</span>
                </div>
                <p className="text-sm text-gray-600">
                  Wallet: {publicKey?.toBase58().slice(0, 8)}...{publicKey?.toBase58().slice(-8)}
                </p>
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Upload Your First Photo",
      description: "Try the secure upload process with a test photo",
      canProceed: uploadFile !== null,
      content: (
        <div className="space-y-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Upload className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Let's Upload Your First Photo
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Select any photo to see how our encryption process works. Don't worry - this is just a demo!
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            {!uploadFile ? (
              <div className="space-y-4">
                <FileUpload 
                  onChange={handleFileSelected}
                />
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm font-medium">This is just a preview - you can upload for real later!</span>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative group">
                  <img
                    src={URL.createObjectURL(uploadFile)}
                    alt="Preview"
                    className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
                  />
                  <Badge 
                    variant="secondary" 
                    className="absolute top-2 left-2 bg-green-100 text-green-800"
                  >
                    Preview Mode
                  </Badge>
                </div>
                
                <div className="text-center space-y-2">
                  <h4 className="font-medium text-gray-900">{uploadFile.name}</h4>
                  <p className="text-sm text-gray-500">
                    {uploadFile.type} • {(uploadFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>

                <div className="space-y-3 text-left bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-blue-900">What happens next:</h5>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      Photo gets encrypted on your device
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      Encrypted file uploads to IPFS
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      NFT minted on Solana blockchain
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      Only you can decrypt and view it
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setUploadFile(null)}
                  className="w-full"
                >
                  Try Another Photo
                </Button>
              </div>
            )}
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep - 1];
  const isLastStep = currentStep === steps.length;

  return (
    <div className="min-h-screen bg-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-blue-600 bg-clip-text text-transparent mb-4">
            Welcome to MemoryVault
          </h1>
          <p className="text-gray-600 text-lg">
            Let's get you started with secure photo storage
          </p>
          
          {/* Skip Button */}
          <div className="mt-4">
            <Button
              variant="ghost"
              onClick={skipOnboarding}
              className="text-yellow-500 hover:text-orange-500 bg-yellow-100 hover:bg-orange-100 animate-bounce"
            >
              Skip Tutorial
            </Button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "flex items-center",
                  index < steps.length - 1 && "flex-1"
                )}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors",
                      step.id < currentStep
                        ? "bg-green-600 text-white"
                        : step.id === currentStep
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    )}
                  >
                    {step.id < currentStep ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs mt-2 font-medium",
                      step.id <= currentStep ? "text-gray-900" : "text-gray-500"
                    )}
                  >
                    Step {step.id}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 flex-1 mx-4 transition-colors",
                      step.id < currentStep ? "bg-green-600" : "bg-gray-200"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="mb-2">
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                Step {currentStep} of {steps.length}
              </Badge>
            </div>
            <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
            <CardDescription className="text-lg">
              {currentStepData.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentStepData.content}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="text-sm text-gray-500">
            {currentStep} of {steps.length}
          </div>

          {isLastStep ? (
            <Button
              onClick={completeOnboarding}
              disabled={!currentStepData.canProceed}
              className="flex items-center gap-2 bg-blue-600 hover:from-blue-700 hover:to-purple-700"
            >
              Get Started
              <CheckCircle className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
              disabled={!currentStepData.canProceed}
              className="flex items-center gap-2 border border-black-300"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}