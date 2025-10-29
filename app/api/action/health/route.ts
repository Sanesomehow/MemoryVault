import { NextRequest, NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";
import { prisma } from "@/lib/db";

// CORS headers for Solana Actions
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Encoding, Accept-Encoding, X-Requested-With',
  'Access-Control-Max-Age': '86400',
  'Content-Type': 'application/json',
  'X-Action-Version': '2.1.3',
  'X-Blockchain-Ids': 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'
};

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET(request: NextRequest) {
  const results = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: {} as Record<string, { status: string; details?: string; }>
  };

  // Check environment variables
  results.checks.helius_api_key = {
    status: process.env.HELIUS_API_KEY ? "✅ Present" : "❌ Missing"
  };
  
  results.checks.database_url = {
    status: process.env.DATABASE_URL ? "✅ Present" : "❌ Missing"
  };
  
  results.checks.gateway_url = {
    status: process.env.NEXT_PUBLIC_GATEWAY_URL ? "✅ Present" : "Using default",
    details: process.env.NEXT_PUBLIC_GATEWAY_URL || "gateway.pinata.cloud"
  };

  // Test database connection
  try {
    await prisma.$queryRaw`SELECT 1`;
    results.checks.database_connection = { status: "✅ Connected" };
  } catch (error) {
    results.checks.database_connection = { 
      status: "❌ Failed",
      details: error instanceof Error ? error.message : String(error)
    };
  }

  // Test Solana connection
  if (process.env.HELIUS_API_KEY) {
    try {
      const connection = new Connection(
        `https://devnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`
      );
      const slot = await connection.getSlot();
      results.checks.solana_connection = { 
        status: "✅ Connected",
        details: `Current slot: ${slot}`
      };
    } catch (error) {
      results.checks.solana_connection = { 
        status: "❌ Failed",
        details: error instanceof Error ? error.message : String(error)
      };
    }
  } else {
    results.checks.solana_connection = { 
      status: "❌ Skipped",
      details: "No HELIUS_API_KEY"
    };
  }

  // Test Public Key creation (basic validation)
  try {
    new PublicKey("11111111111111111111111111111112");
    results.checks.solana_web3 = { status: "✅ Working" };
  } catch (error) {
    results.checks.solana_web3 = { 
      status: "❌ Failed",
      details: error instanceof Error ? error.message : String(error)
    };
  }

  const allGood = Object.values(results.checks).every(check => 
    check.status.startsWith("✅") || check.status === "Using default"
  );

  return NextResponse.json(results, {
    status: allGood ? 200 : 500,
    headers: corsHeaders
  });
}