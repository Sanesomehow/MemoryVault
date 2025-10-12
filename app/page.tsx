"use client";

// import { MemoCard } from "@/components/memo-card";
import { WalletConnectButton } from "@/components/wallet-connect-button";
import { decryptPhoto, Encrypt } from "@/lib/crypto/encrypt";
import { encryptAESKey } from "@/lib/crypto/keyEncryption";
import { useWallet, WalletProvider } from "@solana/wallet-adapter-react";
import nacl from "tweetnacl";
import React, { useEffect, useState } from "react";
import { mintPhotoNFT } from "@/lib/metaplex/umiMint";

export default function Home() {
  const [file, setFile] = useState<File>();
  const [result, setResult] = useState<{
    url: string;
    cid: string;
    metadataCid: string;
  }>();
  const [uploading, setUploading] = useState(false);
  const [displayUrl, setDisplayUrl] = useState<string>();

  const { connected, signMessage, publicKey } = useWallet();

  const uploadFile = async () => {
    try {
      if (!file) {
        alert("No file selected");
        return;
      }
      if (!connected || !signMessage || !publicKey) {
        alert("wallet connection error");
        return;
      }

      setUploading(true);

      const { encFile, keyArray, IV } = await Encrypt(file);

      const { encrypted: encryptedKey, nonce } = await encryptAESKey(
        keyArray,
        publicKey.toBytes()
      );

      console.log("AES key encrypted successfully");

      const data = new FormData();
      data.set("file", encFile);
      data.set("name", file.name);
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
      const uri = `ipfs://${result.metadataCid}`
      const signature = await mintPhotoNFT(file.name, uri);

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

      const displayUrl = await decryptPhoto({
        url: result.url,
        cid: result.cid,
        metadataCid: result.metadataCid,
        publicKey: publicKey.toBytes(),
      });

      console.log("Photo decrypted successfully.");
      setDisplayUrl(displayUrl);
      console.log("Decrypted message url: ", displayUrl);
    } catch (e) { 
      console.error("Decryption failed:", e);
      alert("Failed to decrypt photo: " + (e as Error).message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target?.files?.[0]);
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
      <input type="file" onChange={handleChange} />
      <button
        type="button"
        disabled={uploading || !connected}
        onClick={uploadFile}
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
    </main>
  );
}
