import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Types for database records
interface SharedRecord {
  mintAddress: string;
  ownerWallet: string;
  createdAt: Date;
}

// Types for Helius API response
interface HeliusNft {
  id: string;
  content?: {
    json_uri?: string;
  };
}

interface HeliusResponse {
  result?: HeliusNft[];
}

// Helper: Convert ipfs:// links to HTTP URLs
function ipfsToHttp(uri: string) {
  if (!uri) return "";
  if (uri.startsWith("ipfs://")) {
    const cid = uri.replace("ipfs://", "").split("/")[0];
    const gateway = process.env.NEXT_PUBLIC_GATEWAY_URL || 'gateway.pinata.cloud';
    return `https://${gateway}/ipfs/${cid}`;
  }
  return uri;
}

// Helper: Fetch metadata JSON safely with timeout
async function fetchMetadata(metadataUri: string, timeoutMs = 5000) {
  try {
    const httpUri = ipfsToHttp(metadataUri);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    const response = await fetch(httpUri, { 
      signal: controller.signal,
      cache: 'force-cache' // Cache responses to improve performance
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) throw new Error(`Metadata fetch failed: ${response.status}`);
    return await response.json();
  } catch (err) {
    console.warn("Metadata fetch failed:", err);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { walletAddress } = await req.json();
    if (!walletAddress) {
      return NextResponse.json({ error: "Missing wallet address" }, { status: 400 });
    }

    // Step 1: Get all active shared NFTs for this viewer (limit to recent 50)
    const sharedRecords = await prisma.sharedAccess.findMany({
      where: {
        viewerWallet: walletAddress,
        status: "active",
      },
      orderBy: { createdAt: "desc" },
      take: 50, // Limit results to prevent performance issues
      select: {
        mintAddress: true,
        ownerWallet: true,
        createdAt: true,
      }
    });

    if (!sharedRecords.length) {
      return NextResponse.json({ sharedNfts: [] });
    }

    // Step 2: Batch fetch NFT data using Helius bulk API
    const mintAddresses = sharedRecords.map((r: SharedRecord) => r.mintAddress);
    
    if (!process.env.HELIUS_API_KEY) {
      console.warn("HELIUS_API_KEY not configured, falling back to limited data");
      // Return basic data without Helius metadata
      const sharedNfts = sharedRecords.map((record: SharedRecord) => ({
        mintAddress: record.mintAddress,
        name: `NFT ${record.mintAddress.slice(0, 8)}...`,
        image: null,
        description: "",
        ownerWallet: record.ownerWallet,
        createdAt: record.createdAt,
      }));
      return NextResponse.json({ sharedNfts });
    }
    
    const heliusRpc = `https://devnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`;
    const heliusRes = await fetch(heliusRpc, {
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "bulk-request",
        method: "getAssetBatch",
        params: { ids: mintAddresses },
      }),
    });

    if (!heliusRes.ok) {
      throw new Error(`Helius API failed: ${heliusRes.status}`);
    }

    const heliusData: HeliusResponse = await heliusRes.json();
    const nfts: HeliusNft[] = heliusData.result || [];

    // Step 3: Parallel fetch of metadata
    const metadataPromises = nfts.map(async (nft: HeliusNft, index: number) => {
      try {
        const record = sharedRecords.find((r: SharedRecord) => r.mintAddress === nft.id);
        if (!record) return null;

        const metadataUri = nft?.content?.json_uri;
        const metadata = metadataUri ? await fetchMetadata(metadataUri) : null;

        if (metadata) {
          return {
            mintAddress: record.mintAddress,
            name: metadata.name,
            image: ipfsToHttp(metadata.image), // Convert IPFS URLs to HTTP
            description: metadata.description || "",
            ownerWallet: record.ownerWallet,
            metadataCid: metadataUri,
            metadata: metadata, // Include full metadata for thumbnails
            createdAt: record.createdAt,
          };
        }
        return null;
      } catch (err) {
        console.warn(`Failed to fetch metadata for ${nft?.id}`, err);
        return null;
      }
    });

    // Wait for all metadata fetches to complete
    const results = await Promise.all(metadataPromises);
    const sharedNfts = results.filter(Boolean);

    // Step 3: Return data
    return NextResponse.json({ sharedNfts });
  } catch (e) {
    console.error("Error in /api/shared:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
