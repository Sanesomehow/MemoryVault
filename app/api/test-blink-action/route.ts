import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Simple test blink action to verify format
  const response = {
    type: "action",
    icon: "https://via.placeholder.com/400x400?text=Test+Action",
    title: "Test Solana Action",
    description: "This is a test Solana Action to verify Blink functionality",
    label: "Test Action",
    links: {
      actions: [
        {
          label: "Test Button",
          href: "/api/test-blink-action",
          type: "transaction"
        }
      ]
    }
  };

  return NextResponse.json(response, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Encoding, Accept-Encoding',
      'Content-Type': 'application/json',
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Test blink POST body:", body);

    return NextResponse.json({
      message: "Test action completed successfully!"
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Encoding, Accept-Encoding',
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Test action failed" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Encoding, Accept-Encoding',
    },
  });
}