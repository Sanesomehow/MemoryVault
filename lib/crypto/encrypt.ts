import { pinata } from "@/utils/pinata-config";
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

export async function decryptPhoto({url, cid, metadataCid, sig}: {url: string, cid: string, metadataCid: string, sig:Uint8Array}) {
    // const metadata = await pinata.files.public.get(metadataCid);
    const metadataUrl = `https://${gatewayUrl}/ipfs/${metadataCid}`;
    const metadataRes = await fetch(metadataUrl);
    const metadata = await metadataRes.json();
    
    const encryptedContentCid = metadata.properties.encrypted_content_cid;
    const ivBase64 = metadata.properties.encryption_params.iv;
    const nonce = metadata.properties.encryption_params.nonce;
    const encryptedKey = metadata.properties.owner_encrypted_key;

    const aesKeyArray = decryptAESKey(encryptedKey, nonce, sig);
    if(!aesKeyArray) {
        throw new Error("Failed to decrypt AES key");
    }

    const aesKey = await window.crypto.subtle.importKey(
    'raw',
    aesKeyArray as BufferSource,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  const imageUrl = `https://${gatewayUrl}/ipfs/${encryptedContentCid}`;
  const encryptedResponse = await fetch(imageUrl);
  const encryptedBuffer = await encryptedResponse.arrayBuffer();

  const iv = Uint8Array.from(atob(ivBase64), c => c.charCodeAt(0));

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    encryptedBuffer
  );

  const blob = new Blob([decryptedBuffer], {type: "image/png"});
  const displayUrl = URL.createObjectURL(blob);

  return displayUrl;
}