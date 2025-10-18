"use client";

import { useEffect, useState } from "react";
import { fetchAllNft } from "@/lib/nft/nftFetch";
import { PublicKey } from "@solana/web3.js";

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
          {nft.metadata?.name} — {nft.metadata?.symbol}
        </div>
      ))}
    </div>
  );
}
