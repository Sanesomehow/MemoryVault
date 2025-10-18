import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

const rpc = process.env.HELIUS_RPC || "https://devnet.helius-rpc.com/?api-key=112abdd4-a592-481e-81f7-f48398349adb";

export const umi = createUmi(rpc)
.use(mplTokenMetadata());