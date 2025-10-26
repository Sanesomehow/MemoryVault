import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerWallet = searchParams.get("owner");

    if (!ownerWallet) {
      return NextResponse.json(
        { error: "Owner wallet address is required" },
        { status: 400 }
      );
    }

    // Fetch all access requests for NFTs owned by this wallet
    const requests = await prisma.accessRequest.findMany({
      where: {
        ownerWallet: ownerWallet
      },
      orderBy: [
        { status: "asc" }, // Pending first
        { createdAt: "desc" } // Most recent first
      ],
      select: {
        id: true,
        requesterWallet: true,
        ownerWallet: true,
        mintAddress: true,
        message: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // For each request, try to get NFT metadata if available
    const requestsWithMetadata = requests.map((request: any) => ({
      ...request,
      nftName: `Photo ${request.mintAddress.slice(0, 8)}...`, // Placeholder for now
      createdAt: request.createdAt.toISOString(),
      updatedAt: request.updatedAt.toISOString()
    }));

    return NextResponse.json({
      success: true,
      requests: requestsWithMetadata
    });
    
  } catch (error) {
    console.error("Error fetching access requests:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch access requests",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}