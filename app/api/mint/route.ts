// import { mintPhotoNFT } from "@/lib/metaplex/umiMint";
// import { error } from "console";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(request: NextRequest) {
//     try {
//         const data = await request.json();
//         const name = data.name ?? "";
//         const uri = data.uri ?? "";

//         console.log(data);

//         if(!name || !uri) {
//             return NextResponse.json(
//                 { error: "Name or uri not found"},
//                 { status: 400 }
//             );
//         }

//         const signature = await mintPhotoNFT(name, uri)

//         return NextResponse.json(
//             {signature}, 
//             { status: 200 }
//         )
//     } catch (e) {
//         return NextResponse.json(
//             { error: e },
//             { status: 500 }
//         );
//     }
// }