import { pinata } from "@/lib/pinata-config";
import { umi } from "@/lib/umi";
import { updateV1 } from "@metaplex-foundation/mpl-token-metadata";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const metadata = await request.json();
        console.log(metadata);
        
        const jsonString = JSON.stringify(metadata, null, 2);
    const metadataFile = new File([jsonString], "metadata.json", { type: "application/json" });

    const { cid: metadataCid } = await pinata.upload.public.file(metadataFile);

    // const url = await pinata.gateways.public.convert(cid);
    // return NextResponse.json({ url, cid, metadataCid }, { status: 200 });

            return NextResponse.json({
      success: true,
      message: "Metadata received successfully",
      metadataCid
    }, {status: 200});
        
    } catch (e) {
        console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
    }
}