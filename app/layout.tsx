import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SolanaProvider } from "@/components/solana-provider";
import { AppHeader } from "@/components/app-header";
import { AppFooter } from "@/components/app-footer";
import { Toaster } from "@/components/ui/sonner";
import ErrorBoundary from "@/components/error-boundary";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MemoryVault - Encrypted Photos on Solana",
  description: "Securely store and share your photos as encrypted NFTs on Solana blockchain. Your photos, your keys, your privacy.",
  keywords: "encrypted photos, NFT, Solana, blockchain, privacy, secure storage",
  // authors: [{ name: "PicRolls Team" }],
  // themeColor: "#0ea5e9",
  // colorScheme: "light",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <SolanaProvider>
          <ErrorBoundary>
            <Toaster />
            <AppHeader />
            <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
              {children}
            </main>
            <AppFooter />
          </ErrorBoundary>
        </SolanaProvider>
      </body>
    </html>
  );
}
