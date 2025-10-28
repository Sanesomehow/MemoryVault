import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Simple test query to check database connection
    const count = await prisma.sharedAccess.count();
    
    return NextResponse.json({
      success: true,
      message: "Database connection working",
      sharedAccessCount: count
    }, { status: 200 });

  } catch (e: unknown) {
    console.error("Database test error:", e);
    const error = e as Error;
    return NextResponse.json(
      { 
        error: "Database connection failed",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}