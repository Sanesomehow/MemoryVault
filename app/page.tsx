"use client";

// import { MemoCard } from "@/components/memo-card";
import { WalletConnectButton } from "@/components/wallet-connect-button";
import { decryptPhoto, Encrypt } from "@/lib/crypto/encrypt";
import { encryptAESKey } from "@/lib/crypto/keyEncryption";
import { useWallet, WalletProvider } from "@solana/wallet-adapter-react";
import nacl from "tweetnacl";
import React, { useCallback, useEffect, useState } from "react";
import { mintPhotoNFT } from "@/lib/nft/nftMint";
import { usesToggle } from "@metaplex-foundation/mpl-token-metadata";
import { Gallary } from "../components/gallary";
import Link from "next/link";
import {useDropzone} from 'react-dropzone'


export default function Home() {
  const [file, setFile] = useState<File>();
  const [result, setResult] = useState<{
    url: string;
    cid: string;
    metadataCid: string;
  }>();
  const [uploading, setUploading] = useState(false);
  const [displayUrl, setDisplayUrl] = useState<string>();
  const [NftMints, setNftMints] = useState<string[]>([]);


  const wallet = useWallet()

  const { connected, signMessage, publicKey } = wallet;

  const uploadFile = async () => {
    try {
      if (!file) {
        alert("No file selected");
        return;
      }
      if (!connected || !signMessage || !publicKey || !wallet) {
        alert("wallet connection error");
        return;
      }

      setUploading(true);
      const mimeType: string = file.type;

      const { encFile, keyArray, IV } = await Encrypt(file);

      const { encrypted: encryptedKey, nonce } = encryptAESKey(
        keyArray,
        publicKey.toBytes()
      );

      console.log("AES key encrypted successfully");

      const data = new FormData();
      data.set("file", encFile);
      data.set("name", file.name);
      data.set("type", mimeType);
      data.set("iv", IV);
      data.set("size", file.size.toString());
      data.set("encryptedKey", encryptedKey);
      data.set("nonce", nonce);

      const uploadRequest = await fetch("/api/files", {
        method: "POST",
        body: data,
      });

      if (!uploadRequest.ok) {
        throw new Error("Upload failed");
      }

      const result = await uploadRequest.json();
      console.log("upload request:", uploadRequest);
      console.log("=== Upload Result ===");
    console.log("Image CID:", result.cid);
    console.log("Metadata CID:", result.metadataCid);
    console.log("Are they different?", result.cid !== result.metadataCid);
      setResult(result);
      setUploading(false);
      alert("Photo uploaded successfully");

      await getFile(result);

      // const mintRequest = await fetch("/api/mint", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     name: file.name,
      //     uri: `ipfs://${result.metadataCid}`
      //   })
      // })
      // console.log(mintRequest);

      // const mintResult = await mintRequest.text();
      // console.log(mintResult);
      const uri = `ipfs://${result.metadataCid}`;
      console.log("=== Minting NFT ===");
    console.log("URI being used:", uri);
      const { signature, mintAddress } = await mintPhotoNFT(file.name, uri, wallet);

      console.log("Transaction:", signature);
      console.log("NFT Mint Address:", mintAddress);

      console.log("Verify on explorer:", `https://explorer.solana.com/address/${mintAddress}?cluster=devnet`);

      setNftMints(prev => [...prev, mintAddress]);

    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  const getFile = async (result: {
    url: string;
    cid: string;
    metadataCid: string;
  }) => {
    try {
      if (!result || !publicKey) {
        alert("No result or wallet not connected");
        return;
      }

      console.log("Decrypting photo...");

      // const displayUrl = await decryptPhoto({
      //   metadataCid: result.metadataCid,
      //   publicKey: publicKey.toBytes(),
      // });

      console.log("Photo decrypted successfully.");
      setDisplayUrl(displayUrl);
      console.log("Decrypted message url: ", displayUrl);
    } catch (e) {
      console.error("Decryption failed:", e);
      alert("Failed to decrypt photo: " + (e as Error).message);
    }
  };

  return (
    <main>
      <div className=" flex items-center justify-end p-4">
        <div className="w-full max-w-full bg-card rounded-lg border shadow-lg p-6 space-y-6">
          <div className="flex justify-end  ">
            <WalletConnectButton />
          </div>
        </div>
      </div>
      {!connected && (
        <div>
          <p>Please connect your wallet to upload photos.</p>
        </div>
      )}

      <MyDropzone onFileSelected={setFile} />
      <p>Supported formats: PNG, JPG/JPEG, HEIC, GIF, WEBP</p>

      <button
        type="button"
        disabled={uploading || !connected}
        onClick={uploadFile}
        className="bg-green-300 p-2"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {result?.url && (
        <div>
          <p>Photo uploaded successfully, URL: {result.url}</p>
        </div>
      )}

      {displayUrl && (
        <div>
          <img src={displayUrl} alt="" />
        </div>
      )}
      {publicKey ?<Gallary publicKey={publicKey} /> : <div>
        <p>Please connect your wallet to view NFTs.</p>
      </div> }

    </main>
  );
}



function MyDropzone({ onFileSelected }: { onFileSelected: (file: File) => void }) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelected(acceptedFiles[0]);
    }
  }, [onFileSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="p-10 border border-dashed border-blue-500">
      <input {...getInputProps()} />
      {isDragActive ? <p>Drop the files here ...</p> : <p>Drag 'n' drop some files here, or click to select files</p>}
    </div>
  );
}
