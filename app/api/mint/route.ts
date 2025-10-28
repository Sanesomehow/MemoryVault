import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    // This API route is currently not implemented
    // Minting is handled client-side in the main page component
    return NextResponse.json(
        { error: "Minting is handled client-side" }, 
        { status: 501 }
    );
}