import {prisma} from "@/lib/db";
import { pinata } from "@/lib/pinata-config";
import { umi } from "@/lib/umi";
import { updateV1 } from "@metaplex-foundation/mpl-token-metadata";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { metadata, viewerWallet, mintAddress, owner } = await request.json();
    console.log(metadata);

    const jsonString = JSON.stringify(metadata, null, 2);
    const metadataFile = new File([jsonString], "metadata.json", { type: "application/json" });

    const { cid: metadataCid } = await pinata.upload.public.file(metadataFile);

    if (viewerWallet && mintAddress) {
      await prisma.sharedAccess.create({
        data: {
          ownerWallet: owner, // or nftData.nft.token.owner
          viewerWallet: viewerWallet,
          mintAddress: mintAddress,
          status: "active",
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Metadata received successfully",
      metadataCid
    }, { status: 200 });

  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}