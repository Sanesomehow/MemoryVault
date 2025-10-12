import nacl from 'tweetnacl';

export function deriveKeyFromSignature(sig: Uint8Array): Uint8Array {

    const sigArray = sig instanceof Uint8Array 
        ? sig 
        : new Uint8Array(sig);

    const hash = nacl.hash(sig);
    return hash.slice(0, 32);
}

export function getSignatureMessage(nftMintOrId: string): string {
    return `MemoryVault-Access-${nftMintOrId}`;
}

export function encryptAESKey(aesKey: Uint8Array, sig: Uint8Array): {
    encrypted: string;
    nonce: string
} {
    const encryptionKey = deriveKeyFromSignature(sig);
    const nonce = nacl.randomBytes(24);
    const encrypted = nacl.secretbox(aesKey, nonce, encryptionKey);

    return {
        encrypted: Buffer.from(encrypted).toString('base64'),
        nonce: Buffer.from(nonce).toString('base64')
    };
}

export function decryptAESKey(encryptedKey: string, nonce: string, sig: Uint8Array): Uint8Array | null {

    const sigArray = sig instanceof Uint8Array 
        ? sig 
        : new Uint8Array(sig);


    const encryptionKey = deriveKeyFromSignature(sig);


    const encryptedBytes = Buffer.from(encryptedKey, 'base64');
    const nonceBytes = Buffer.from(nonce, 'base64');
    const decrypted = nacl.secretbox.open(encryptedBytes, nonceBytes, encryptionKey);

    return decrypted;   
}