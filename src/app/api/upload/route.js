// src/app/api/upload/route.js
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import cloudinary, { AVATAR_FOLDER } from "@/lib/cloudinary";

export async function POST(request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Nuk ka file" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: AVATAR_FOLDER,
      transformation: [
        { width: 400, height: 400, crop: "fill", gravity: "face" },
      ],
    });

    // public_id-ja kthehet që thirrësi ta ruajë dhe të mund ta fshijë
    // këtë aset kur avatari të zëvendësohet.
    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Gabim në upload" },
      { status: 500 },
    );
  }
}
