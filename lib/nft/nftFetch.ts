import { fetchAllDigitalAssetByOwner, fetchDigitalAsset, fetchDigitalAssetWithAssociatedToken } from "@metaplex-foundation/mpl-token-metadata";
import { publicKey as umiPublicKey } from "@metaplex-foundation/umi";
import { PublicKey } from "@solana/web3.js";
import { umi } from "../umi";

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'gateway.pinata.cloud';

function convertIpfsToHttp(uri: string): string {
    if (uri.startsWith('ipfs://')) {
        const cid = uri.replace('ipfs://', '');
        return `https://${GATEWAY_URL}/ipfs/${cid}`;
    }
    return uri;
}

export async function fetchAllNft(publicKey: PublicKey) {
    if(!publicKey) {
        throw new Error("Wallet not connected");
    }
    
    const owner = umiPublicKey(publicKey);
    console.log("Fetching NFTs for:", owner);
    
    const allNfts = await fetchAllDigitalAssetByOwner(umi, owner);
    console.log("allNfts: ", allNfts);
    console.log("All NFTs found:", allNfts.length);
    
    const relatedNfts = await Promise.all(
        allNfts.map(async (nft) => {
            try {
                const metadataUri = convertIpfsToHttp(nft.metadata.uri);
                console.log("Fetching metadata from:", metadataUri);
                
                const response = await fetch(metadataUri);
                
                if (!response.ok) {
                    console.error(`Failed to fetch metadata: ${response.status}`);
                    return null;
                }
                
                const metadata = await response.json();
                
                if (metadata.symbol === "MVLT" || metadata.properties?.app === "MemoryVault") {
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
    
    const filtered = relatedNfts.filter(item => item !== null);
    
    console.log("MemoryVault NFTs:", filtered.length);
    return filtered;
}

export async function fetchSingleNft(publicKey: PublicKey, mintAddressString: string) {
  const mintAddress = umiPublicKey(mintAddressString);

  // Fetch NFT metadata account directly (works for both owner & viewer)
  const nft = await fetchDigitalAsset(umi, mintAddress);

  // Convert IPFS URI
  const httpUri = ipfsToHttp(nft.metadata.uri);

  // Fetch metadata JSON
  const metadata = await fetch(httpUri).then(r => r.json());

  // Optional: check if the connected user is the owner
  const isOwner = publicKey ? await checkIfOwner(publicKey, mintAddressString) : false;

  return { nft, metadata, metadataCid: extractCid(nft.metadata.uri), isOwner };
}

function ipfsToHttp(uri: string) {
  if (!uri) return "";
  if (uri.startsWith("ipfs://")) {
    const cid = uri.replace("ipfs://", "");
    return `https://gateway.pinata.cloud/ipfs/${cid}`;
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
