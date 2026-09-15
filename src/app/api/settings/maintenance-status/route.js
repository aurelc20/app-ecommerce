// src/app/api/settings/maintenance-status/route.js
import dbConnect from "@/lib/db";
import Settings from "@/models/Settings";
import { NextResponse } from "next/server";

// ✅ Force Node runtime (jo Edge) për Mongoose compatibility
export const runtime = "nodejs";

export async function GET() {
  try {
    await dbConnect();

    let settings = await Settings.findOne().lean();

    if (!settings) {
      settings = await Settings.create({});
      settings = settings.toObject();
    }

    return NextResponse.json({
      maintenanceMode: settings.maintenanceMode || false,
      maintenanceMessage:
        settings.maintenanceMessage ||
        "Faqja është aktualisht në mirëmbajtje. Kthehuni së shpejti!",
      storeName: settings.storeName || "Perlë Jewellery Design",
      storeEmail: settings.storeEmail || "",
      storePhone: settings.storePhone || "",
    });
  } catch (error) {
    console.error("Error fetching maintenance status:", error);
    // Fail-safe: kthe false nëse DB fail
    return NextResponse.json({
      maintenanceMode: false,
      maintenanceMessage: "",
    });
  }
}
