import { pinata } from "@/utils/pinata-config";
import { subtle } from "crypto";


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
    
    const encryptedFile = await window.crypto.subtle.encrypt({
        name: 'AES-GCM',
        iv: IV,
    },
        key,
         convertedFile
    );

    const blob = new Blob([encryptedFile], {type: "application/octet-stream"});
    const encFile = new File([blob], file.name);
    
    

    return {encFile, keyArray, IV};

}

export async function decryptPhoto({url, cid}: {url: string, cid: string}) {
    const file = await pinata.files.public.get(cid);

    const metadata =  {
        name: file.name,
        originalSIze: file.keyvalues.originalSize,
        iv: file.keyvalues.iv,
        encryptedKey: file.keyvalues?.encryptedKey,
        nonce: file.keyvalues?.nonce,
    };

    console.log(metadata);
}