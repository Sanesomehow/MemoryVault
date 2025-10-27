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

  } catch (e: any) {
    console.error("Database test error:", e);
    return NextResponse.json(
      { 
        error: "Database connection failed",
        details: e.message,
        stack: process.env.NODE_ENV === "development" ? e.stack : undefined
      },
      { status: 500 }
    );
  }
}