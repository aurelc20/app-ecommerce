import dbConnect from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    return NextResponse.json(
      {
        success: true,
        message: "MongoDB connected successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("DB connection error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to connect to MongoDB",
      },
      { status: 500 },
    );
  }
}
