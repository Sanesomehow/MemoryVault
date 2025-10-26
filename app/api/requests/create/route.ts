import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      requesterAddress, 
      ownerAddress, 
      mintAddress, 
      message, 
      nftName 
    } = body;

    // Validation
    if (!requesterAddress || !ownerAddress || !mintAddress) {
      return NextResponse.json(
        { error: "Missing required fields: requesterAddress, ownerAddress, mintAddress" },
        { status: 400 }
      );
    }

    // Prevent self-requests
    if (requesterAddress === ownerAddress) {
      return NextResponse.json(
        { error: "You cannot request access to your own photo" },
        { status: 400 }
      );
    }

    // Check if request already exists
    const existingRequest = await prisma.accessRequest.findUnique({
      where: {
        requesterWallet_mintAddress: {
          requesterWallet: requesterAddress,
          mintAddress: mintAddress
        }
      }
    });

    if (existingRequest) {
      // Update existing request instead of creating new one
      const updatedRequest = await prisma.accessRequest.update({
        where: { id: existingRequest.id },
        data: {
          message: message || null,
          status: "pending",
          updatedAt: new Date()
        }
      });

      return NextResponse.json({
        success: true,
        message: "Access request updated",
        requestId: updatedRequest.id,
        status: "updated"
      });
    }

    // Create new access request
    const accessRequest = await prisma.accessRequest.create({
      data: {
        requesterWallet: requesterAddress,
        ownerWallet: ownerAddress,
        mintAddress: mintAddress,
        message: message || null,
        nftName: nftName || null,
        status: "pending"
      }
    });

    return NextResponse.json({
      success: true,
      message: "Access request created successfully",
      requestId: accessRequest.id
    });

  } catch (error) {
    console.error("Error creating access request:", error);
    return NextResponse.json(
      { error: "Failed to create access request" },
      { status: 500 }
    );
  }
}

// GET method to check request status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requesterAddress = searchParams.get("requester");
    const mintAddress = searchParams.get("mint");

    if (!requesterAddress || !mintAddress) {
      return NextResponse.json(
        { error: "Missing requester or mint address" },
        { status: 400 }
      );
    }

    const accessRequest = await prisma.accessRequest.findUnique({
      where: {
        requesterWallet_mintAddress: {
          requesterWallet: requesterAddress,
          mintAddress: mintAddress
        }
      }
    });

    if (!accessRequest) {
      return NextResponse.json({ status: "none" });
    }

    return NextResponse.json({
      status: accessRequest.status,
      requestId: accessRequest.id,
      createdAt: accessRequest.createdAt,
      updatedAt: accessRequest.updatedAt
    });

  } catch (error) {
    console.error("Error checking access request status:", error);
    return NextResponse.json(
      { error: "Failed to check request status" },
      { status: 500 }
    );
  }
}