import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const testUrl = searchParams.get("url");
  
  if (!testUrl) {
    return NextResponse.json({ 
      error: "No URL provided",
      usage: "Add ?url=<blink-action-url> to test a Blink action URL"
    });
  }

  try {
    console.log("Testing Blink URL:", testUrl);
    
    const response = await fetch(testUrl, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    
    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      data: data
    });
  } catch (error) {
    console.error("Blink test error:", error);
    return NextResponse.json({
      success: false,
      error: (error as Error).message
    });
  }
}