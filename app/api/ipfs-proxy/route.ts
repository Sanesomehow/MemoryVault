import { NextRequest, NextResponse } from 'next/server';

// IPFS gateways for server-side fetching (no CORS issues)
const IPFS_GATEWAYS = [
    'gateway.pinata.cloud',
    'ipfs.io', 
    'cloudflare-ipfs.com',
    'gateway.ipfs.io',
];

async function fetchFromGateway(cid: string, gateway: string): Promise<Response> {
    const url = `https://${gateway}/ipfs/${cid}`;
    console.log(`Server: Trying gateway ${gateway} for CID ${cid}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const cid = searchParams.get('cid');

    if (!cid) {
        return NextResponse.json({ error: 'CID parameter is required' }, { status: 400 });
    }

    console.log(`Server: Fetching CID ${cid}`);
    const errors: string[] = [];

    // Try each gateway in sequence
    for (const gateway of IPFS_GATEWAYS) {
        try {
            const response = await fetchFromGateway(cid, gateway);
            
            if (response.ok) {
                console.log(`Server: Success with gateway ${gateway}`);
                
                // Return the raw response data without additional JSON wrapping
                const data = await response.text(); // Get as text first
                
                return new NextResponse(data, {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
                        'X-Used-Gateway': gateway,
                    },
                });
            } else {
                const errorMsg = `Gateway ${gateway}: HTTP ${response.status}`;
                console.warn(`Server: ${errorMsg}`);
                errors.push(errorMsg);
            }
        } catch (error) {
            const errorMsg = `Gateway ${gateway}: ${error instanceof Error ? error.message : 'Unknown error'}`;
            console.warn(`Server: ${errorMsg}`);
            errors.push(errorMsg);
        }
    }

    // All gateways failed
    console.error(`Server: All gateways failed for CID ${cid}:`, errors);
    return NextResponse.json(
        { 
            error: 'Failed to fetch from all IPFS gateways', 
            details: errors,
            cid 
        },
        { status: 502 }
    );
}