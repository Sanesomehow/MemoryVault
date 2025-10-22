"use client";

import { useEffect, useState } from "react";
import { fetchAllNft } from "@/lib/nft/nftFetch";
import { PublicKey } from "@solana/web3.js";
import Link from "next/link";

interface GallaryProps {
  publicKey: PublicKey;
}

export function Gallary({ publicKey }: GallaryProps) {
  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNFTs = async () => {
      try {
        const result = await fetchAllNft(publicKey);
        setNfts(result);
        // console.log(result)
      } catch (err) {
        console.error("Error fetching NFTs:", err);
      } finally {
        setLoading(false);
      }
    };

    loadNFTs();
  }, [publicKey]);

  if (loading) return <p>Loading NFTs...</p>;

  return (
    <div>
      {nfts.map((nft, i) => (
        <div key={i}>
          <Link href={`/gallery/${nft.mintAddress}`}>
          <img src="/assets/image.png" alt="" />
            {nft.metadata?.name} — {nft.metadata?.symbol}
          </Link>
        </div>
      ))}
    </div>
  );
}
