import { prisma } from "@/lib/db";
import { fetchSingleNft } from "@/lib/nft/nftFetch";
import { Connection, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest, 
  { params }: { params: { mintAddress: string } }
) {
  try {
    const { mintAddress } = params;
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get("owner");
    
    if (!owner) {
      return NextResponse.json(
        { error: "Owner wallet address required" }, 
        { status: 400 }
      );
    }

    // Fetch NFT metadata to display in Blink
    let metadata;
    try {
      const ownerPubkey = new PublicKey(owner);
      const result = await fetchSingleNft(ownerPubkey, mintAddress);
      metadata = result.metadata;
    } catch (error) {
      console.error("Failed to fetch NFT metadata:", error);
      // Continue anyway with fallback values
    }

    // Return proper Solana Actions API format
    return NextResponse.json({
      icon: metadata?.image?.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/') || 
            "https://via.placeholder.com/400x400?text=Encrypted+Photo",
      label: "Request Access",
      title: metadata?.name || "Encrypted Photo",
      description: `Request access to view this encrypted photo from ${owner.slice(0, 4)}...${owner.slice(-4)}`,
      links: {
        actions: [
          {
            label: "Request Access",
            href: `/api/action/share/${mintAddress}?owner=${owner}`,
          }
        ]
      }
    });
  } catch (error) {
    console.error("GET /api/action/share error:", error);
    return NextResponse.json(
      { error: "Failed to load photo details" }, 
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest, 
  { params }: { params: { mintAddress: string } }
) {
  try {
    const { mintAddress } = params;
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get("owner");
    
    // Extract 'account' from body - sent automatically by Blink clients
    const body = await request.json();
    const viewerPublicKey = body.account;

    if (!viewerPublicKey) {
      return NextResponse.json(
        { error: "Viewer wallet address required" }, 
        { status: 400 }
      );
    }

    if (!owner) {
      return NextResponse.json(
        { error: "Owner wallet address required" }, 
        { status: 400 }
      );
    }

    // Validate wallet addresses
    try {
      new PublicKey(viewerPublicKey);
      new PublicKey(owner);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid wallet address format" }, 
        { status: 400 }
      );
    }

    // Check if request already exists (matches your unique constraint)
    const existingRequest = await prisma.accessRequest.findUnique({
      where: {
        requesterWallet_mintAddress: {
          requesterWallet: viewerPublicKey,
          mintAddress: mintAddress,
        }
      }
    });

    if (existingRequest && existingRequest.status === "pending") {
      return NextResponse.json(
        { 
          error: "You already have a pending request for this photo",
          existingRequest: existingRequest 
        },
        { status: 400 }
      );
    }

    // Fetch NFT name for better UX (optional)
    let nftName;
    try {
      const ownerPubkey = new PublicKey(owner);
      const { metadata } = await fetchSingleNft(ownerPubkey, mintAddress);
      nftName = metadata?.name;
    } catch (error) {
      console.log("Could not fetch NFT name:", error);
    }

    // Create Solana connection
    const connection = new Connection(
      `https://devnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`
    );

    // Create memo transaction
    const transaction = new Transaction().add(
      new TransactionInstruction({
        keys: [
          { pubkey: new PublicKey(viewerPublicKey), isSigner: true, isWritable: false }
        ],
        programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
        data: Buffer.from(`MEMORYVAULT_ACCESS:${mintAddress}:${viewerPublicKey}`),
      })
    );

    // Set transaction details
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("finalized");
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = new PublicKey(viewerPublicKey);
    transaction.lastValidBlockHeight = lastValidBlockHeight;

    // Serialize transaction
    const serializedTransaction = transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    });

    // Save request to database (matches your schema exactly)
    const accessRequest = await prisma.accessRequest.upsert({
      where: {
        requesterWallet_mintAddress: {
          requesterWallet: viewerPublicKey,
          mintAddress: mintAddress,
        }
      },
      update: {
        status: "pending",
        ownerWallet: owner,
        nftName: nftName,
        updatedAt: new Date(),
      },
      create: {
        requesterWallet: viewerPublicKey,
        ownerWallet: owner,
        mintAddress: mintAddress,
        nftName: nftName,
        status: "pending",
        message: null,
      },
    });

    console.log(`✅ Access request created:`, {
      id: accessRequest.id,
      requester: viewerPublicKey.slice(0, 8),
      owner: owner.slice(0, 8),
      nft: mintAddress.slice(0, 8)
    });

    // Return transaction in Solana Actions format
    return NextResponse.json({
      transaction: serializedTransaction.toString("base64"),
      message: `Access request sent to ${owner.slice(0, 4)}...${owner.slice(-4)}`,
    });

  } catch (error) {
    console.error("❌ POST /api/action/share error:", error);
    return NextResponse.json(
      { error: "Failed to create access request" }, 
      { status: 500 }
    );
  }
}