import {prisma} from "@/lib/db";
import { pinata } from "@/lib/pinata-config";
import { umi } from "@/lib/umi";
import { updateV1 } from "@metaplex-foundation/mpl-token-metadata";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { metadata, viewerWallet, mintAddress, owner } = await request.json();
    console.log("Received update request:", { viewerWallet, mintAddress, owner });

    // Validate required fields
    if (!metadata) {
      throw new Error("Metadata is required");
    }

    if (!mintAddress) {
      throw new Error("Mint address is required");
    }

    if (!owner) {
      throw new Error("Owner wallet address is required");
    }

    // Upload metadata to IPFS
    const jsonString = JSON.stringify(metadata, null, 2);
    const metadataFile = new File([jsonString], "metadata.json", { type: "application/json" });

    const { cid: metadataCid } = await pinata.upload.public.file(metadataFile);
    console.log("Metadata uploaded to IPFS:", metadataCid);

    // Create database record if viewer and mint address are provided
    if (viewerWallet && mintAddress) {
      try {
        // Check if record already exists to avoid duplicates
        const existing = await prisma.sharedAccess.findFirst({
          where: {
            ownerWallet: owner,
            viewerWallet: viewerWallet,
            mintAddress: mintAddress,
          }
        });

        if (!existing) {
          const sharedAccess = await prisma.sharedAccess.create({
            data: {
              ownerWallet: owner,
              viewerWallet: viewerWallet,
              mintAddress: mintAddress,
              status: "active",
            },
          });
          console.log("Database record created:", sharedAccess);
        } else {
          console.log("Database record already exists, skipping creation");
        }
      } catch (dbError: unknown) {
        console.error("Database error:", dbError);
        // Continue with the response even if DB operation fails
        // The NFT update is more important than the DB record
      }
    }

    return NextResponse.json({
      success: true,
      message: "Metadata received successfully",
      metadataCid
    }, { status: 200 });

  } catch (e: unknown) {
    console.error("API Error:", e);
    const error = e as Error;
    return NextResponse.json(
      { 
        error: "Internal Server Error",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}