import { NextRequest, NextResponse } from "next/server";

// Simple endpoint to test IPFS gateway connectivity
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cid = searchParams.get("cid") || "bafkreifcrzn4ifwoluzpnbr5sbg2damnjues6us5bmfpllalrvub4si6ky";
  
  const gateways = [
    'gateway.pinata.cloud',
    'ipfs.io',
    'cloudflare-ipfs.com', 
    'dweb.link',
    'gateway.ipfs.io'
  ];

  const results = [];

  for (const gateway of gateways) {
    try {
      const url = `https://${gateway}/ipfs/${cid}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const start = Date.now();
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });
      clearTimeout(timeoutId);
      
      const duration = Date.now() - start;
      
      results.push({
        gateway,
        url,
        status: response.status,
        statusText: response.statusText,
        duration: `${duration}ms`,
        success: response.ok
      });
    } catch (error) {
      results.push({
        gateway,
        url: `https://${gateway}/ipfs/${cid}`,
        error: (error as Error).message,
        success: false
      });
    }
  }

  return NextResponse.json({
    cid,
    results,
    summary: {
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      total: results.length
    }
  });
}