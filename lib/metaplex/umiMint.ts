import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { useWallet } from '@solana/wallet-adapter-react'
import { createNft, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { base58 } from '@metaplex-foundation/umi/serializers'
import { generateSigner, percentAmount } from '@metaplex-foundation/umi';
import { NextResponse } from 'next/server'


const rpc = process.env.HELIUS_RPC || "https://devnet.helius-rpc.com/?api-key=112abdd4-a592-481e-81f7-f48398349adb";

const umi = createUmi(rpc)
.use(mplTokenMetadata());

export async function mintPhotoNFT(name: string, uri: string) {
    const wallet = useWallet();
        
    umi.use(walletAdapterIdentity(wallet));
    
    const nftSigner = generateSigner(umi);
    
    const tx = await createNft(umi, {
        mint: nftSigner,
        sellerFeeBasisPoints: percentAmount(0),
        name: name,
        uri: uri,
    }).sendAndConfirm(umi);
    
    const signature = base58.deserialize(tx.signature)[0];
    console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`);

    return signature;
}