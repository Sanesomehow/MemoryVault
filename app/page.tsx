"use client";

// import { MemoCard } from "@/components/memo-card";
import { WalletConnectButton } from "@/components/wallet-connect-button";
import { decryptPhoto, Encrypt } from "@/lib/crypto/encrypt";
import {encryptAESKey} from "@/lib/crypto/keyEncryption";
import { useWallet, WalletProvider } from "@solana/wallet-adapter-react";
import nacl from "tweetnacl";
import React, { useEffect, useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File>();
  const [result, setResult] = useState<{url: string, cid: string}>();
  const [uploading, setUploading] = useState(false);
  const { connected, signMessage, publicKey } = useWallet();

  const uploadFile = async () => {
    try {
      if (!file) {
        alert("No file selected");
        return;
      }
      if(!connected || !signMessage || !publicKey) {
        alert("wallet connection error");
        return;
      }

      setUploading(true);
      
      const message: string = "Upload this for me";
      const encMessage = new TextEncoder().encode(message);
      const sig  = await signMessage(encMessage)
      const isValid = nacl.sign.detached.verify(encMessage, sig, publicKey?.toBytes());

      if(!isValid) {
        alert("invalid signature");
        setUploading(false);
        return;
      }
      
      const { encFile, keyArray, IV } = await Encrypt(file);
      const {encrypted: encryptedKey, nonce } = await encryptAESKey(keyArray, sig)

      console.log("AES key encrypted successfully");

      const data = new FormData();

      data.set('file', encFile);
      data.set('name', file.name);
      data.set('iv', Array.from(IV).toString());
      data.set('size', file.size.toString());

      data.set('encryptedKey', Array.from(encryptedKey).toString());
      data.set('nonce', nonce);

      const uploadRequest = await fetch("/api/files", {
        method: "POST",
        body: data,
      });

      if(!uploadRequest.ok) {
        throw new Error("Upload failed");
      }

      const result = await uploadRequest.json();
      console.log(result);
      setResult(result);
      setUploading(false);
      alert("Photo uploaded successfully");
      console.log("signed url: ",result.url);
      getFile(result);
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  const getFile = async (result: {url: string, cid: string}) => {
    if(!result) {
      alert("No url found");
      return;
    }
    const res = decryptPhoto(result);

  }

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
      {!connected && 
        <div>
          <p>Please connect your wallet to upload photos.</p>
        </div>
      }
      <input type="file" onChange={handleChange} />
      <button type="button" disabled={uploading || !connected} onClick={uploadFile}>
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {result?.url && (<div>
        <p>Photo uploaded successfully, URL: {result.url}</p>
      </div>) }
    </main>
  );
}
