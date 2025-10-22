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
    if(!publicKey) {
        throw new Error("Wallet not connected");
    }
    
    const mintAddress = umiPublicKey(mintAddressString);
    const nft = await fetchDigitalAssetWithAssociatedToken(umi, mintAddress, umiPublicKey(publicKey));
    console.log("=== Fetch Single NFT ===");
    console.log("NFT URI:", nft.metadata.uri);
    
    const metadataUri = nft.metadata.uri;
    const metadataCid = metadataUri.replace('ipfs://', '').split('/')[0];

    console.log("Extracted metadata CID:", metadataCid);

    const httpUri = convertIpfsToHttp(metadataUri);

    console.log("Fetching from HTTP URI:", httpUri);
    const response = await fetch(httpUri);

    console.log("Response status:", response.status);
    console.log("Response content-type:", response.headers.get('content-type'));

    // const text = await response.text();
    // console.log("Response preview:", text.substring(0, 200));

    const metadata = await response.json();
    console.log("Parsed metadata:", metadata);

    return { nft, metadata, metadataCid };
}