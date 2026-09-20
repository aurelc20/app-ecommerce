// src/app/api/upload/route.js
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import cloudinary, { AVATAR_FOLDER, PRODUCT_FOLDER } from "@/lib/cloudinary";

// Avatarët priten katror me fokus te fytyra; produktet vetëm zvogëlohen nëse
// e kalojnë kufirin, që raporti dhe përmbajtja të mos humbasin.
const UPLOAD_OPTIONS = {
  avatar: {
    folder: AVATAR_FOLDER,
    transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face" }],
  },
  product: {
    folder: PRODUCT_FOLDER,
    transformation: [{ width: 1600, height: 1600, crop: "limit" }],
    quality: "auto",
  },
};

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
    const kind = formData.get("kind") || "avatar";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Nuk ka file" },
        { status: 400 },
      );
    }

    const options = UPLOAD_OPTIONS[kind];

    if (!options) {
      return NextResponse.json(
        { success: false, error: "Lloj i panjohur ngarkimi" },
        { status: 400 },
      );
    }

    // Imazhet e produkteve i ngarkon vetëm admini
    if (kind === "product" && session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64, options);

    // public_id-ja kthehet që thirrësi ta ruajë dhe të mund ta fshijë
    // këtë aset kur imazhi të zëvendësohet ose të hiqet.
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
