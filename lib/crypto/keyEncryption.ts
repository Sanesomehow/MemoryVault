import nacl from 'tweetnacl';

export function deriveKeyFromPublicKey(publicKey: Uint8Array): Uint8Array {
    const hash = nacl.hash(publicKey);
    return hash.slice(0, 32);
}



export function encryptAESKey(aesKey: Uint8Array, walletPublicKey: Uint8Array): {
    encrypted: string;
    nonce: string
} {
    const encryptionKey = deriveKeyFromPublicKey(walletPublicKey);
    const nonce = nacl.randomBytes(24);
    const encrypted = nacl.secretbox(aesKey, nonce, encryptionKey);

    return {
        encrypted: Buffer.from(encrypted).toString('base64'),
        nonce: Buffer.from(nonce).toString('base64')
    };
}

export function decryptAESKey(
    encryptedKey: string, 
    nonce: string, 
    walletPublicKey: Uint8Array
): Uint8Array | null {
    const encryptionKey = deriveKeyFromPublicKey(walletPublicKey);
    const encryptedBytes = Buffer.from(encryptedKey, 'base64');
    const nonceBytes = Buffer.from(nonce, 'base64');
    const decrypted = nacl.secretbox.open(encryptedBytes, nonceBytes, encryptionKey);

    return decrypted;   
}