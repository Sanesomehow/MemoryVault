import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { useWallet, Wallet, WalletContextState } from '@solana/wallet-adapter-react'
import { createNft, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { base58 } from '@metaplex-foundation/umi/serializers'
import { generateSigner, percentAmount } from '@metaplex-foundation/umi';
import { NextResponse } from 'next/server'
import { umi } from "@/lib/umi";
import { PublicKey } from '@solana/web3.js'
import { WalletAdapter } from '@solana/wallet-adapter-base'


export async function mintPhotoNFT(name: string, uri: string, wallet: WalletContextState) {
    // const wallet = useWallet();
        
    umi.use(walletAdapterIdentity(wallet));
    
    const nftSigner = generateSigner(umi);
    
    const tx = await createNft(umi, {
        mint: nftSigner,
        sellerFeeBasisPoints: percentAmount(0),
        name: name,
        symbol: "MVLT",
        uri: uri,
    }).sendAndConfirm(umi);
    
    const signature = base58.deserialize(tx.signature)[0];
    const mintAddress = nftSigner.publicKey;
    console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`);

    return {
        signature,
        mintAddress: mintAddress.toString()
    };
}