import { pinata } from "@/lib/pinata-config";
import { subtle } from "crypto";
import { decryptAESKey } from "./keyEncryption";

const gatewayUrl = process.env.NEXT_PUBLIC_GATEWAY_URL;


export async function Encrypt(file: File) {

    const key = await window.crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    )

    const exportedKey = await window.crypto.subtle.exportKey('raw', key);
    const keyArray = new Uint8Array(exportedKey);    

    const convertedFile = await file.arrayBuffer()

    const IV = window.crypto.getRandomValues(new Uint8Array(12));
    const ivBase64 = Buffer.from(IV).toString('base64');    
    
    const encryptedFile = await window.crypto.subtle.encrypt({
        name: 'AES-GCM',
        iv: IV,
    },
        key,
         convertedFile
    );

    const blob = new Blob([encryptedFile], {type: "application/octet-stream"});
    const encFile = new File([blob], file.name);
    
    

    return {encFile, keyArray, IV:ivBase64};

}

export async function decryptPhoto({
    encryptedContentCid,
    publicKey,
    encryptionParams,
    encryptedKey,
    fileType
}: {
    encryptedContentCid: string,
    publicKey: Uint8Array,
    encryptionParams: { iv: string; nonce: string },
    encryptedKey: string,
    fileType: string
}) {
    console.log("🧩 decryptPhoto() called");

    const { iv: ivBase64, nonce } = encryptionParams;
    const aesKeyArray = decryptAESKey(encryptedKey, nonce, publicKey);
    if (!aesKeyArray) throw new Error("Failed to decrypt AES key");

    const aesKey = await window.crypto.subtle.importKey(
        'raw',
        aesKeyArray as BufferSource,
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt']
    );

    const imageUrl = `https://${gatewayUrl}/ipfs/${encryptedContentCid}`;
    console.log("📦 Fetching encrypted image from:", imageUrl);
    const encryptedResponse = await fetch(imageUrl);
    if (!encryptedResponse.ok) throw new Error("Failed to fetch encrypted content");

    const encryptedBuffer = await encryptedResponse.arrayBuffer();
    const iv = Uint8Array.from(atob(ivBase64), c => c.charCodeAt(0));

    const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        aesKey,
        encryptedBuffer
    );

    const blob = new Blob([decryptedBuffer], { type: fileType });
    const displayUrl = URL.createObjectURL(blob);
    return displayUrl;
}

