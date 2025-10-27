import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/lib/pinata-config";

export async function POST(request: NextRequest) {

  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const name: string = data.get('name')?.toString() ?? "";
    const fileType: string = data.get('type')?.toString() ?? "image/png";
    const originalSize: string = data.get("size")?.toString() ?? "";
    const ivString = data.get("iv")?.toString() ?? "";
    const encryptedKey = data.get("encryptedKey")?.toString() ?? "";
    const nonce = data.get("nonce")?.toString() ?? "";
    
    // Get blurhash data from form parameters
    const blurHash = data.get("blurHash")?.toString() ?? "";
    const imageWidth = parseInt(data.get("imageWidth")?.toString() ?? "0");
    const imageHeight = parseInt(data.get("imageHeight")?.toString() ?? "0");

    console.log('Received blurhash data:', {
      blurHash,
      imageWidth,
      imageHeight,
      blurHashLength: blurHash.length
    });

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
      symbol: "MVLT",
      image: `ipfs://${cid}`,
      seller_fee_basis_points: 0,
      properties: {
        files: [{ uri: `ipfs://${cid}`, type: fileType }],
        category: "image", 
        creators: [], 
        app: "MemoryVault",
        encrypted_content_cid: cid,
        encryption_params: {
          iv: ivString,
          nonce: nonce,
          algorithm: "AES-GCM"
        },
        owner_encrypted_key: encryptedKey,
        allowed_viewers: {},
        original_size: originalSize,
        upload_date: new Date().toISOString(),
        blur_hash: blurHash,
        blur_width: imageWidth,
        blur_height: imageHeight
      }
    }

    console.log('Created metadata with properties:', {
      blur_hash: metadata.properties.blur_hash,
      blur_width: metadata.properties.blur_width,
      blur_height: metadata.properties.blur_height
    });

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