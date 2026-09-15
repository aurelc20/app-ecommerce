// src/app/api/auth/verify-email/route.js (ose ku e ke route handler-in)
import crypto from "crypto";
import { NextResponse } from "next/server";

import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(
        new URL("/error?reason=missing-token", request.url),
      );
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    await dbConnect();

    const user = await User.findOne({
      emailVerificationTokenHash: tokenHash,
      emailVerificationTokenExpires: {
        $gt: new Date(),
      },
    }).select("+emailVerificationTokenHash");

    if (!user) {
      return NextResponse.redirect(
        new URL("/error?reason=invalid-token", request.url),
      );
    }

    user.emailVerified = new Date();
    user.emailVerificationTokenHash = null;
    user.emailVerificationTokenExpires = null;

    await user.save();

    // Redirect me success flag
    return NextResponse.redirect(new URL("/login?verified=true", request.url));
  } catch (error) {
    console.error("Email verification error:", error);

    // Për gabime specifike vendos reason të ndryshëm
    let reason;
    if (error.code === "ETIMEDOUT") {
      reason = "timeout";
    } else if (error.code === "ECONNREFUSED") {
      reason = "connection-refused";
    } else {
      reason = "server-error";
    }

    return NextResponse.redirect(
      new URL("/error?reason=" + reason, request.url),
    );
  }
}
