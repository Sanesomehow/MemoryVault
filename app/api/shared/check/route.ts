import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const viewerWallet = searchParams.get("viewer");
    const mintAddress = searchParams.get("mint");

    if (!viewerWallet || !mintAddress) {
      return NextResponse.json(
        { error: "Missing viewer wallet or mint address" },
        { status: 400 }
      );
    }

    // Check if there's an active SharedAccess record
    const sharedAccess = await prisma.sharedAccess.findFirst({
      where: {
        viewerWallet: viewerWallet,
        mintAddress: mintAddress,
        status: "active"
      }
    });

    return NextResponse.json({
      hasAccess: !!sharedAccess,
      sharedAccess: sharedAccess ? {
        id: sharedAccess.id,
        ownerWallet: sharedAccess.ownerWallet,
        createdAt: sharedAccess.createdAt
      } : null
    });

  } catch (error) {
    console.error("Error checking shared access:", error);
    return NextResponse.json(
      { error: "Failed to check shared access" },
      { status: 500 }
    );
  }
}