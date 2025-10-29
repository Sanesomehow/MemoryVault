import { prisma } from "@/lib/db";
import { fetchSingleNft } from "@/lib/nft/nftFetch";
import { Connection, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";

// CORS headers for Solana Actions
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Encoding, Accept-Encoding, X-Requested-With',
  'Access-Control-Max-Age': '86400',
  'Content-Type': 'application/json',
  'X-Action-Version': '2.1.3',
  'X-Blockchain-Ids': 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'
};

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ mintAddress: string }> }
) {
  try {
    console.log("🚀 Blink Action GET request received");
    console.log("- URL:", request.url);
    console.log("- Headers:", Object.fromEntries(request.headers.entries()));
    
    const { mintAddress } = await params;
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get("owner");
    
    console.log("- Mint Address:", mintAddress);
    console.log("- Owner:", owner);
    
    // Environment check
    console.log("🔍 Environment Check:");
    console.log("- HELIUS_API_KEY:", process.env.HELIUS_API_KEY ? "✅ Present" : "❌ Missing");
    console.log("- DATABASE_URL:", process.env.DATABASE_URL ? "✅ Present" : "❌ Missing");
    console.log("- NEXT_PUBLIC_GATEWAY_URL:", process.env.NEXT_PUBLIC_GATEWAY_URL || "Using default");
    
    if (!owner) {
      console.log("❌ Missing owner parameter");
      return NextResponse.json(
        { error: "Owner wallet address required" }, 
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }
    
    // Validate mint address format
    try {
      new PublicKey(mintAddress);
      new PublicKey(owner);
      console.log("✅ Wallet addresses validated");
    } catch (error) {
      console.log("❌ Invalid wallet address format");
      return NextResponse.json(
        { error: "Invalid wallet address format" }, 
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    // Fetch NFT metadata to display in Blink
    let metadata;
    let imageUrl = "https://via.placeholder.com/400x400?text=Encrypted+Photo";
    
    try {
      console.log("🔍 Fetching NFT metadata...");
      const ownerPubkey = new PublicKey(owner);
      const result = await fetchSingleNft(ownerPubkey, mintAddress);
      metadata = result.metadata;
      console.log("✅ NFT metadata fetched:", metadata ? "Success" : "No metadata");
      
      // Convert IPFS URL to HTTP if needed
      if (metadata?.image) {
        if (metadata.image.startsWith('ipfs://')) {
          const cid = metadata.image.replace('ipfs://', '');
          const gateway = process.env.NEXT_PUBLIC_GATEWAY_URL || 'gateway.pinata.cloud';
          imageUrl = `https://${gateway}/ipfs/${cid}`;
          console.log("🖼️ Using IPFS image:", imageUrl);
        } else {
          imageUrl = metadata.image;
          console.log("🖼️ Using direct image:", imageUrl);
        }
      }
    } catch (error) {
      console.error("❌ Failed to fetch NFT metadata:", error);
      console.error("NFT fetch error details:", {
        message: error instanceof Error ? error.message : String(error),
        mintAddress,
        owner
      });
      // Continue anyway with fallback values
    }

    const actionUrl = `${request.nextUrl.origin}/api/action/share/${mintAddress}?owner=${owner}`;
    
    const response = {
      type: "action",
      icon: imageUrl,
      title: metadata?.name || "Encrypted Photo",
      description: `Request access to view this encrypted photo shared by ${owner.slice(0, 4)}...${owner.slice(-4)}`,
      label: "Request Access",
      links: {
        actions: [
          {
            label: "Request Access",
            href: actionUrl,
            type: "transaction"
          }
        ]
      }
    };

    console.log("Blink Action GET request:");
    console.log("- Mint Address:", mintAddress);
    console.log("- Owner:", owner);
    console.log("- Action URL:", actionUrl);
    console.log("- Image URL:", imageUrl);
    console.log("- Metadata:", metadata ? "Found" : "Not found");
    console.log("- Response:", JSON.stringify(response, null, 2));

    return NextResponse.json(response, {
      headers: corsHeaders
    });
  } catch (error) {
    console.error("❌ GET /api/action/share error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    
    return NextResponse.json(
      { 
        error: "Failed to load photo details",
        details: error instanceof Error ? error.message : String(error)
      }, 
        { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}

export async function POST(
  request: NextRequest, 
  { params }: { params: Promise<{ mintAddress: string }> }
) {
  try {
    console.log("🚀 Blink Action POST request received");
    console.log("- URL:", request.url);
    console.log("- Headers:", Object.fromEntries(request.headers.entries()));
    
    const { mintAddress } = await params;
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get("owner");
    
    // Extract 'account' from body - sent automatically by Blink clients
    const body = await request.json();
    console.log("- Request body:", body);
    
    const viewerPublicKey = body.account;
    
    console.log("- Mint Address:", mintAddress);
    console.log("- Owner:", owner);
    console.log("- Viewer:", viewerPublicKey);

    if (!viewerPublicKey) {
      return NextResponse.json(
        { error: "Viewer wallet address required" }, 
        { status: 400, headers: corsHeaders }
      );
    }

    if (!owner) {
      return NextResponse.json(
        { error: "Owner wallet address required" }, 
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate wallet addresses
    try {
      new PublicKey(viewerPublicKey);
      new PublicKey(owner);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid wallet address format" }, 
        { status: 400, headers: corsHeaders }
      );
    }

    // Check if request already exists (matches your unique constraint)
    console.log("🔍 Checking for existing access request...");
    let existingRequest;
    try {
      existingRequest = await prisma.accessRequest.findUnique({
        where: {
          requesterWallet_mintAddress: {
            requesterWallet: viewerPublicKey,
            mintAddress: mintAddress,
          }
        }
      });
      console.log("✅ Database query successful:", existingRequest ? "Found existing" : "No existing request");
    } catch (dbError) {
      console.error("❌ Database error when checking existing request:", dbError);
      return NextResponse.json(
        { 
          error: "Database connection failed",
          details: dbError instanceof Error ? dbError.message : String(dbError)
        },
        { status: 500, headers: corsHeaders }
      );
    }

    if (existingRequest && existingRequest.status === "pending") {
      return NextResponse.json(
        { 
          error: "You already have a pending request for this photo",
          existingRequest: existingRequest 
        },
        { status: 400, headers: corsHeaders }
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
    console.log("🔗 Creating Solana connection...");
    let connection;
    try {
      if (!process.env.HELIUS_API_KEY) {
        throw new Error("HELIUS_API_KEY environment variable is not set");
      }
      
      connection = new Connection(
        `https://devnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`
      );
      console.log("✅ Solana connection established");
    } catch (connectionError) {
      console.error("❌ Failed to create Solana connection:", connectionError);
      return NextResponse.json(
        { 
          error: "Failed to connect to Solana network",
          details: connectionError instanceof Error ? connectionError.message : String(connectionError)
        },
        { status: 500, headers: corsHeaders }
      );
    }

    // Create memo transaction
    console.log("📝 Creating memo transaction...");
    let transaction;
    let serializedTransaction;
    
    try {
      transaction = new Transaction().add(
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
      serializedTransaction = transaction.serialize({
        requireAllSignatures: false,
        verifySignatures: false,
      });
      console.log("✅ Transaction created and serialized successfully");
    } catch (txError) {
      console.error("❌ Failed to create transaction:", txError);
      return NextResponse.json(
        { 
          error: "Failed to create transaction",
          details: txError instanceof Error ? txError.message : String(txError)
        },
        { status: 500, headers: corsHeaders }
      );
    }

    // Save request to database (matches your schema exactly)
    console.log("💾 Saving access request to database...");
    let accessRequest;
    try {
      accessRequest = await prisma.accessRequest.upsert({
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
      console.log("✅ Access request saved successfully");
    } catch (dbError) {
      console.error("❌ Database error when saving access request:", dbError);
      return NextResponse.json(
        { 
          error: "Failed to save access request",
          details: dbError instanceof Error ? dbError.message : String(dbError)
        },
        { status: 500, headers: corsHeaders }
      );
    }

    console.log(`✅ Access request created:`, {
      id: accessRequest.id,
      requester: viewerPublicKey.slice(0, 8),
      owner: owner.slice(0, 8),
      nft: mintAddress.slice(0, 8)
    });

    // Return transaction in Solana Actions format
    const response = {
      transaction: serializedTransaction.toString("base64"),
      message: `Access request sent to ${owner.slice(0, 4)}...${owner.slice(-4)}`,
    };
    
    console.log("✅ Returning successful response");
    console.log("- Transaction length:", response.transaction.length);
    console.log("- Message:", response.message);
    
    return NextResponse.json(response, {
      headers: corsHeaders
    });

  } catch (error) {
    console.error("❌ POST /api/action/share error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    
    return NextResponse.json(
      { 
        error: "Failed to create access request",
        details: error instanceof Error ? error.message : String(error)
      }, 
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}