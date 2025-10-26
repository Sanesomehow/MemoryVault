import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { requestId, action } = body;

    if (!requestId || !action) {
      return NextResponse.json(
        { error: "Request ID and action are required" },
        { status: 400 }
      );
    }

    if (!["approve", "deny"].includes(action)) {
      return NextResponse.json(
        { error: "Action must be 'approve' or 'deny'" },
        { status: 400 }
      );
    }

    // Update the request status
    const updatedRequest = await prisma.accessRequest.update({
      where: { id: requestId },
      data: { 
        status: action === "approve" ? "approved" : "denied"
      }
    });

    // If approved, create a SharedAccess entry
    if (action === "approve") {
      try {
        await prisma.sharedAccess.create({
          data: {
            mintAddress: updatedRequest.mintAddress,
            ownerWallet: updatedRequest.ownerWallet,
            viewerWallet: updatedRequest.requesterWallet,
            status: "active"
          }
        });
      } catch (sharedAccessError) {
        console.warn("SharedAccess entry might already exist:", sharedAccessError);
        // Continue even if SharedAccess creation fails (might already exist)
      }
    }

    return NextResponse.json({
      success: true,
      request: {
        ...updatedRequest,
        createdAt: updatedRequest.createdAt.toISOString(),
        updatedAt: updatedRequest.updatedAt.toISOString()
      }
    });
    
  } catch (error) {
    console.error("Error responding to access request:", error);
    
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        error: "Failed to respond to access request",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}