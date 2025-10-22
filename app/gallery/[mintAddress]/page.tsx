"use client";

import { decryptPhoto } from "@/lib/crypto/encrypt";
import { decryptAESKey, encryptAESKey } from "@/lib/crypto/keyEncryption";
import { fetchSingleNft } from "@/lib/nft/nftFetch";
import { umi } from "@/lib/umi";
import { DataArgs, updateV1 } from "@metaplex-foundation/mpl-token-metadata";
import {
  divideAmount,
  publicKey as umiPublicKey,
} from "@metaplex-foundation/umi";
import { createSignerFromWalletAdapter, walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

enum UserRole {
  owner = "owner",
  viewer = "viewer",
  none = "none",
}

export default function PhotoDetail() {
  const { publicKey, signTransaction, signAllTransactions, connected } = useWallet();
  umi.use(walletAdapterIdentity({
  publicKey,
  signTransaction,
  signAllTransactions
}));
  const params = useParams();
  const mintAddress = params.mintAddress as string;

  const [loading, setLoading] = useState(true);
  const [nftData, setNftData] = useState<any>(null);
  const [decryptedUrl, setDecryptedUrl] = useState<string>();
  const [canView, setCanView] = useState<UserRole>(UserRole.none);
  const [visibility, setVisibility] = useState(false);
  const [viewer, setViewer] = useState<string>();
  const [error, setError] = useState<string | null>(null);

  async function editAccessList() {
    const encryptedKey = nftData.metadata.properties.owner_encrypted_key;
    const nonce = nftData.metadata.properties.encryption_params.nonce;
    const owner = nftData.nft.token.owner;
    if (!viewer) {
      throw new Error("Viewer address some issue");
    }
    const viewerBytes = bs58.decode(viewer);
    console.log("viewer: ", viewer);
    console.log("viewer bytes: ", viewerBytes);
    
    const ownerBytes = bs58.decode(owner);
    console.log("ownerBytes: ", ownerBytes)
    console.log("owner: ", owner)

    const originalKey = decryptAESKey(encryptedKey, nonce, ownerBytes);
    console.log("originalKey: ",originalKey);

    if (!originalKey) {
      throw new Error("Decryption failed");
    }
    // console.log(nftData.metadata);
    const newKey = encryptAESKey(originalKey, viewerBytes);
    console.log("new key: ", newKey);

    const newMetadata = {
      ...nftData.metadata,
      properties: {
        ...nftData.metadata.properties,
        allowed_viewers: {
          ...nftData.metadata.properties.allowed_viewers,
          [viewer]: {
            encrypted_key: newKey.encrypted,
            nonce: newKey.nonce
          },
        },
      },
    };
    console.log("new metadata: ", newMetadata)
    const updateRequest = await fetch("/api/update", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(newMetadata),
      });

    if(!updateRequest.ok) {
      throw new Error("Update failed")
    }

    const result = await updateRequest.json();
    console.log("update request result: ",result);

    const newMetadataUri = `ipfs://${result.metadataCid}`
    console.log("new metadata uri", newMetadataUri)

    const creatorsArray = nftData.nft.metadata.creators ?? [
  {
    address: nftData.nft.metadata.updateAuthority, 
    verified: true,
    share: 100,
  },
];

    const updatedData: DataArgs = {
  name: nftData.nft.name,                      
  symbol: nftData.nft.symbol,                  
  sellerFeeBasisPoints: nftData.nft.seller_fee_basis_points,
  uri: newMetadataUri,                             
  creators: creatorsArray, 
};

    const changeUri = await updateV1(umi, {
      mint: umiPublicKey(mintAddress),
      authority: umi.identity,
      data: updatedData
    }).sendAndConfirm(umi);

    console.log("change uri", changeUri);
    
  }

  // First useEffect: Load NFT data
  useEffect(() => {
    async function loadNFT() {
      if (!publicKey || !mintAddress) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { nft, metadata, metadataCid } = await fetchSingleNft(
          publicKey,
          mintAddress
        );
        setNftData({ nft, metadata, metadataCid });
        setLoading(false);
      } catch (e) {
        console.error("Error loading NFT:", e);
        setError((e as Error).message);
        setLoading(false);
      }
    }

    loadNFT();
  }, [publicKey, mintAddress]);

  // Second useEffect: Check access and decrypt
  useEffect(() => {
    if (!nftData || !publicKey) return;

    async function checkAccessAndDecrypt() {
      if (!publicKey) return;
      try {
        const { nft, metadata, metadataCid } = nftData;
        const walletAddress = publicKey.toBase58();

        // Get the properties
        const {
          encrypted_content_cid,
          encryption_params,
          owner_encrypted_key,
          allowed_viewers,
        } = metadata.properties;

        let encryptedKey: string | undefined;
        let role: UserRole = UserRole.none;

        console.log("nft.token.owner: ", nft.token.owner);
        try {
          console.log("nft.token.owner.toString(): ", nft.token.owner.toString());
        }catch(e) {
          console.log("not toString",e)
        }
        console.log("walletAddress: ", walletAddress);
        if (nft.token.owner === walletAddress) {
          role = UserRole.owner;
          encryptedKey = owner_encrypted_key;
          console.log("User is owner");
        }
        // Check if in allowed viewers
        else if (allowed_viewers && allowed_viewers[walletAddress]) {
          role = UserRole.viewer;
          encryptedKey = allowed_viewers[walletAddress];
          console.log("User is allowed viewer");
        }

        setCanView(role);

        // If has access, decrypt the photo
        if (role !== UserRole.none && encryptedKey) {
          console.log("Decrypting photo...");

          console.log(metadata.properties);
          console.log("metadata: ", metadata);

          const decrypted = await decryptPhoto({
            encryptedContentCid: encrypted_content_cid,
            encryptionParams: metadata.properties.encryption_params,
            publicKey: publicKey.toBytes(),
            encryptedKey: encryptedKey,
            fileType: metadata.properties.files[0].type,
          });

          console.log("Photo decrypted successfully");
          setDecryptedUrl(decrypted);
        }
      } catch (e) {
        console.error("Error checking access or decrypting:", e);
        setError((e as Error).message);
      }
    }

    checkAccessAndDecrypt();
  }, [nftData, publicKey]);

  // Render logic
  if (!publicKey) {
    return (
      <div className="p-8">
        <p>Please connect your wallet to view this photo.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8">
        <p>Loading photo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!nftData) {
    return (
      <div className="p-8">
        <p>Photo not found.</p>
      </div>
    );
  }

  if (canView === UserRole.none) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>You don't have permission to view this photo.</p>
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Request Access
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{nftData.metadata.name}</h1>
          {canView === UserRole.owner && (
            <div>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={() => {
                  setVisibility(!visibility);
                }}
              >
                Share Photo
              </button>
              <div className={`${visibility ? "visible" : `invisible`}`}>
                <input
                  type="text"
                  placeholder="Address of the viewer"
                  onChange={(e) => setViewer(e.target.value)}
                />
                <button type="button" onClick={editAccessList}>
                  Grant Access
                </button>
              </div>
            </div>
          )}
        </div>

        {decryptedUrl ? (
          <div className="border rounded-lg overflow-hidden shadow-lg">
            <img
              src={decryptedUrl}
              alt={nftData.metadata.name}
              className="w-full h-auto"
            />
          </div>
        ) : (
          <div className="border rounded-lg p-8 text-center">
            <p>Decrypting photo...</p>
          </div>
        )}

        <div className="bg-gray-100 p-4 rounded-lg space-y-2">
          <p>
            <strong>Upload Date:</strong>{" "}
            {new Date(
              nftData.metadata.properties.upload_date
            ).toLocaleDateString()}
          </p>
          <p>
            <strong>Original Size:</strong>{" "}
            {nftData.metadata.properties.original_size} bytes
          </p>
          <p>
            <strong>Mint Address:</strong>{" "}
            <span className="text-sm font-mono">{mintAddress}</span>
          </p>
          <p>
            <strong>Your Role:</strong>{" "}
            <span className="capitalize">{canView}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
