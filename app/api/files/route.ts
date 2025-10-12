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
    const nonce = data.get("nonce")?.toString() ?? ""

    if(!file) {
      return NextResponse.json(
        {error: "No file found"},
        { status: 400 }
      );
    }

    const { cid } = await pinata.upload.public.file(file)
    .name(name)
    .keyvalues({
      originalSize: originalSize,
      iv: ivString,
      encryptedKey: encryptedKey,
      nonce: nonce,
    })

    const url = await pinata.gateways.public.convert(cid);
    return NextResponse.json({url, cid}, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}