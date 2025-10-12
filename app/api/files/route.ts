import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/utils/pinata-config"

export async function POST(request: NextRequest) {

  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const name: string = data.get('name')?.toString() ?? "";
    const originalSize: string = data.get("size")?.toString() ?? "";
    const ivString = data.get("iv")?.toString() ?? "";
    const encryptedKey = data.get("encryptedKey")?.toString() ?? "";
    const nonce = data.get("nonce")?.toString() ?? "";

    if (!file) {
      return NextResponse.json(
        { error: "No file found" },
        { status: 400 }
      );
    }

    const { cid } = await pinata.upload.public.file(file)
      .name(name)
      .keyvalues({
        originalSize: originalSize,
      })

    const metadata = {
      name: name,
      description: "Encrypted photo from MemoryVault",
      image: `ipfs://${cid}`,
      properties: {
        encrypted_content_cid: cid,
        encryption_params: {
          iv: ivString,
          nonce: nonce,
          algorithm: "AES-GCM"
        },
        owner_encrypted_key: encryptedKey,
        allowed_viewers: {},
        original_size: originalSize,
        upload_date: new Date().toISOString()
      }
    }
    const jsonString = JSON.stringify(metadata, null, 2);
    const metadataFile = new File([jsonString], "metadata.json", { type: "application/json" });

    const { cid: metadataCid } = await pinata.upload.public.file(metadataFile);

    const url = await pinata.gateways.public.convert(cid);
    return NextResponse.json({ url, cid, metadataCid }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}