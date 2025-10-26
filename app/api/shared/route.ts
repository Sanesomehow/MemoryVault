import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// const prisma = new PrismaClient();

// Helper: Convert ipfs:// links to HTTP URLs
function ipfsToHttp(uri: string) {
  if (!uri) return "";
  if (uri.startsWith("ipfs://")) {
    const cid = uri.replace("ipfs://", "").split("/")[0];
    return `https://gateway.pinata.cloud/ipfs/${cid}`;
  }
  return uri;
}

// Helper: Fetch metadata JSON safely
async function fetchMetadata(metadataUri: string) {
  try {
    const httpUri = ipfsToHttp(metadataUri);
    const response = await fetch(httpUri);
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

    // Step 1: Get all active shared NFTs for this viewer
    const sharedRecords = await prisma.sharedAccess.findMany({
      where: {
        viewerWallet: walletAddress,
        status: "active",
      },
      orderBy: { createdAt: "desc" },
    });

    if (!sharedRecords.length) {
      return NextResponse.json({ sharedNfts: [] });
    }

    // Step 2: Fetch metadata for each NFT
    const sharedNfts = [];
    for (const record of sharedRecords) {
      try {
        const heliusRpc = `https://devnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`;
        const heliusRes = await fetch(heliusRpc, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: record.mintAddress,
            method: "getAsset",
            params: { id: record.mintAddress },
          }),
        });

        const heliusData = await heliusRes.json();
        const nft = heliusData.result;

        const metadataUri = nft?.content?.json_uri;
        const metadata = metadataUri ? await fetchMetadata(metadataUri) : null;

        if (metadata) {
          sharedNfts.push({
            mintAddress: record.mintAddress,
            name: metadata.name,
            image: metadata.image,
            description: metadata.description || "",
            ownerWallet: record.ownerWallet,
            metadataCid: metadataUri,
          });
        }
      } catch (err) {
        console.warn(`Failed to fetch metadata for ${record.mintAddress}`, err);
      }
    }

    // Step 3: Return data
    return NextResponse.json({ sharedNfts });
  } catch (e) {
    console.error("Error in /api/shared:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
