import { fetchAllDigitalAssetByOwner, fetchDigitalAsset, fetchDigitalAssetWithAssociatedToken } from "@metaplex-foundation/mpl-token-metadata";
import { publicKey as umiPublicKey } from "@metaplex-foundation/umi";
import { PublicKey } from "@solana/web3.js";
import { umi } from "../umi";

interface NftMetadata {
  symbol?: string;
  name?: string;
  image?: string;
  properties?: {
    app?: string;
    blur_hash?: string;
    blur_width?: number;
    blur_height?: number;
    upload_date?: string;
    original_size?: number;
    allowed_viewers?: Record<string, any>;
  };
}

interface ProcessedNft {
  nft: Record<string, unknown>;
  metadata: NftMetadata;
  mintAddress: string;
}

// Multiple IPFS gateways for fallback (ordered by reliability)
// Avoiding gateways that cause CORS preflight issues
const IPFS_GATEWAYS = [
    'gateway.pinata.cloud',
    'ipfs.io', 
    'cloudflare-ipfs.com',
    'gateway.ipfs.io', // Additional backup
    // Removed dweb.link - causes redirect CORS issues
];

function convertIpfsToHttp(uri: string): string {
    if (uri.startsWith('ipfs://')) {
        const cid = uri.replace('ipfs://', '');
        const gateway = process.env.NEXT_PUBLIC_GATEWAY_URL || IPFS_GATEWAYS[0];
        return `https://${gateway}/ipfs/${cid}`;
    }
    return uri;
}

// Server-side proxy handles IPFS gateway selection and caching

// Fetch using original gateway only
async function fetchWithOriginalGateway(uri: string): Promise<Response> {
    if (!uri.startsWith('ipfs://')) {
        // For non-IPFS URIs, fetch directly
        return fetch(uri);
    }

    const cid = uri.replace('ipfs://', '');
    console.log(`Fetching CID directly from original gateway: ${cid}`);
    
    try {
        // Use the original gateway directly
        const gateway = process.env.NEXT_PUBLIC_GATEWAY_URL || 'gateway.pinata.cloud';
        const httpUrl = `https://${gateway}/ipfs/${cid}`;
        
        console.log(`Fetching from: ${httpUrl}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        const response = await fetch(httpUrl, {
            method: 'GET',
            signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            console.log(`Direct fetch success from gateway: ${gateway}`);
            return response;
        } else {
            throw new Error(`Gateway fetch failed: HTTP ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error('Direct gateway fetch failed:', error);
        throw new Error(`Gateway fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function fetchAllNft(publicKey: PublicKey): Promise<ProcessedNft[]> {
    if(!publicKey) {
        throw new Error("Wallet not connected");
    }
    
    const owner = umiPublicKey(publicKey);
    console.log("Fetching NFTs for:", owner);
    
    const allNfts = await fetchAllDigitalAssetByOwner(umi, owner);
    console.log("allNfts: ", allNfts);
    console.log("All NFTs found:", allNfts.length);
    
    // Process NFTs in batches for better performance
    const batchSize = 10; // Process 10 at a time to avoid overwhelming IPFS gateways
    const relatedNfts: (ProcessedNft | null)[] = [];
    
    for (let i = 0; i < allNfts.length; i += batchSize) {
        const batch = allNfts.slice(i, i + batchSize);
        console.log(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(allNfts.length/batchSize)}`);
        
        const batchResults = await Promise.all(
            batch.map(async (nft) => {
                try {
                console.log("Fetching metadata from:", nft.metadata.uri);
                console.log("NFT mint address:", nft.publicKey.toString());
                
                const response = await fetchWithOriginalGateway(nft.metadata.uri);
                const metadata = await response.json();
                
                console.log("Raw metadata received:", metadata);
                console.log("Metadata properties:", metadata?.properties);
                console.log("Blur hash value:", metadata?.properties?.blur_hash);
                console.log("Blur hash type:", typeof metadata?.properties?.blur_hash);
                console.log("Expected blur hash fields:", {
                    blur_hash: metadata?.properties?.blur_hash,
                    blur_width: metadata?.properties?.blur_width, 
                    blur_height: metadata?.properties?.blur_height
                });                    if (metadata.symbol === "MVLT" || metadata.properties?.app === "MemoryVault") {
                        return { 
                            nft, 
                            metadata,
                            mintAddress: nft.publicKey.toString()
                        };
                    }
                    return null;
                } catch (e) {
                    console.error("Error fetching metadata:", e);
                    return null;
                }
            })
        );
        
        relatedNfts.push(...batchResults);
        
        // Small delay between batches to be respectful to IPFS gateways
        if (i + batchSize < allNfts.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    
    const filtered = relatedNfts.filter(item => item !== null);
    
    console.log("MemoryVault NFTs:", filtered.length);
    return filtered;
}

export async function fetchSingleNft(publicKey: PublicKey, mintAddressString: string) {
  try {
    const mintAddress = umiPublicKey(mintAddressString);

    console.log(`🔍 Fetching NFT: ${mintAddressString} for wallet: ${publicKey.toBase58()}`);
    
    // Fetch NFT metadata account directly (works for both owner & viewer)
    const nft = await fetchDigitalAsset(umi, mintAddress);
    
    console.log(`📋 NFT metadata URI: ${nft.metadata.uri}`);
    console.log(`🏠 Update authority: ${nft.metadata.updateAuthority}`);
    console.log(` Symbol: ${nft.metadata.symbol || 'Unknown'}`);

    // Fetch metadata JSON with original gateway
    const response = await fetchWithOriginalGateway(nft.metadata.uri);
    const metadata = await response.json();

    console.log(`Metadata fetched successfully for: ${metadata.name || 'Unnamed NFT'}`);

    // Optional: check if the connected user is the owner
    const isOwner = publicKey ? await checkIfOwner(publicKey, mintAddressString) : false;

    return { nft, metadata, metadataCid: extractCid(nft.metadata.uri), isOwner };
  } catch (error) {
    console.error(`Failed to fetch NFT ${mintAddressString}:`, error);
    throw new Error(`Failed to fetch NFT: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function ipfsToHttp(uri: string) {
  if (!uri) return "";
  if (uri.startsWith("ipfs://")) {
    const cid = uri.replace("ipfs://", "");
    const gateway = process.env.NEXT_PUBLIC_GATEWAY_URL || IPFS_GATEWAYS[0];
    return `https://${gateway}/ipfs/${cid}`;
  }
  return uri; // Already HTTP(S)
}

async function checkIfOwner(publicKey: PublicKey, mintAddress: string) {
  // Query associated token account balance
  try {
    const ata = await fetchDigitalAssetWithAssociatedToken(umi, umiPublicKey(mintAddress), umiPublicKey(publicKey));
    return ata ? true : false;
  } catch {
    return false;
  }
}

function extractCid(uri: string) {
  return uri?.includes("ipfs://") ? uri.split("ipfs://")[1].split("/")[0] : null;
}
