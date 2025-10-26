import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/lib/pinata-config";
import sharp from "sharp";
import { encode } from "blurhash";

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

    if (!file) {
      return NextResponse.json(
        { error: "No file found" },
        { status: 400 }
      );
    }

    // Generate blur hash before encryption
    let blurHash = "";
    let imageWidth = 0;
    let imageHeight = 0;
    
    try {
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      
      // Get original image dimensions
      const metadata = await sharp(fileBuffer).metadata();
      imageWidth = metadata.width || 0;
      imageHeight = metadata.height || 0;
      
      // Resize to 32x32 and get raw pixel data
      const { data, info } = await sharp(fileBuffer)
        .resize(32, 32, { fit: 'cover' })
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      
      // Generate blurhash
      blurHash = encode(new Uint8ClampedArray(data), info.width, info.height, 4, 4);
    } catch (error) {
      console.error("Error generating blur hash:", error);
      // Continue without blur hash if generation fails
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