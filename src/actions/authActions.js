// src/actions/authActions.js
"use server";

import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { z } from "zod";
import { createEmailToken } from "@/lib/email-tokens";
import { sendVerificationEmail } from "@/lib/resend";
import { auth } from "@/lib/auth";
import cloudinary, { publicIdFromUrl } from "@/lib/cloudinary";

// Schema për registration
const registerSchema = z.object({
  name: z.string().min(2, "Emri duhet të jetë së paku 2 karaktere"),
  email: z.email("Email-i nuk është valid"),
  password: z.string().min(6, "Fjalëkalimi duhet të jetë së paku 6 karaktere"),
});

export async function registerUser(formData) {
  try {
    const values =
      formData instanceof FormData
        ? Object.fromEntries(formData.entries())
        : formData;

    const parsed = registerSchema.safeParse(values);

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Të dhënat nuk janë valide",
      };
    }

    const name = parsed.data.name.trim();
    const email = parsed.data.email.toLowerCase().trim();
    const password = parsed.data.password;

    await dbConnect();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return {
        success: false,
        error: "Ky email është tashmë i regjistruar",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const { rawToken, tokenHash } = createEmailToken();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "customer",

      // Null derisa user-i të klikojë linkun
      emailVerified: null,

      emailVerificationTokenHash: tokenHash,
      emailVerificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    // Vetem ne zhvillim: shtyp linkun qe te mos presesh email-in.
    // Ne prodhim ky log do te nxirrte nje token verifikimi te vlefshem.
    if (process.env.NODE_ENV === "development") {
      const verificationUrl =
        `${process.env.APP_URL}/verify-email?token=` +
        encodeURIComponent(rawToken);

      console.log("[dev] Link verifikimi:", verificationUrl);
    }

    await sendVerificationEmail({
      to: user.email,
      name: user.name,
      token: rawToken,
    });

    return {
      success: true,
      message:
        "Regjistrimi u krye. Kontrollo email-in për ta verifikuar account-in.",
    };
  } catch (error) {
    console.error("Registration error:", error);

    return {
      success: false,
      error: "Ndodhi një gabim gjatë regjistrimit. Provo sërish.",
    };
  }
}

// Identiteti merret gjithmonë nga sesioni — server actions janë endpoint-e
// publike (POST), prandaj userId nuk mund të merret si parametër i besuar.
async function requireUserId() {
  const session = await auth();
  return session?.user?.id || null;
}

export async function getUserById() {
  try {
    const userId = await requireUserId();
    if (!userId) return null;

    await dbConnect();
    const user = await User.findById(userId).select("-password").lean();

    if (!user) return null;

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function updateUserProfile(updateData) {
  try {
    const userId = await requireUserId();
    if (!userId) return { success: false, error: "Nuk je i kyçur" };

    await dbConnect();

    // "avatar" jo ketu: ndryshohet vetem permes updateUserAvatar(),
    // qe kujdeset edhe per fshirjen e asetit te vjeter ne Cloudinary.
    const allowedFields = ["name", "addresses"];
    const filteredData = {};

    Object.keys(updateData).forEach((key) => {
      if (allowedFields.includes(key)) {
        filteredData[key] = updateData[key];
      }
    });

    const user = await User.findByIdAndUpdate(userId, filteredData, {
      returnDocument: "after",
      runValidators: true,
    })
      .select("-password")
      .lean();

    if (!user) return { success: false, error: "User-i nuk u gjet" };

    return {
      success: true,
      user: JSON.parse(JSON.stringify(user)),
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      success: false,
      error: "Ndodhi një gabim gjatë përditësimit",
    };
  }
}

export async function changePassword(currentPassword, newPassword) {
  try {
    const userId = await requireUserId();
    if (!userId) return { success: false, error: "Nuk je i kyçur" };

    await dbConnect();

    const user = await User.findById(userId).select("+password");

    if (!user) {
      return { success: false, error: "User-i nuk u gjet" };
    }

    if (!user.password) {
      return {
        success: false,
        error: "Kjo llogari është krijuar me Google dhe nuk ka fjalëkalim",
      };
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return { success: false, error: "Fjalëkalimi aktual është gabim" };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    return {
      success: true,
      message: "Fjalëkalimi u ndryshua me sukses",
    };
  } catch (error) {
    console.error("Error changing password:", error);
    return {
      success: false,
      error: "Ndodhi një gabim gjatë ndryshimit të fjalëkalimit",
    };
  }
}

export async function updateUserAvatar(avatarUrl, avatarPublicId = null) {
  try {
    const userId = await requireUserId();
    if (!userId) return { success: false, error: "Nuk je i kyçur" };

    await dbConnect();

    // Gjendja para perditesimit, qe te dime cilin aset te fshijme.
    const before = await User.findById(userId)
      .select("avatar avatarPublicId")
      .lean();

    if (!before) {
      return { success: false, error: "Përdoruesi nuk u gjet" };
    }

    // Perdoruesit e vjeter s'kane avatarPublicId; nxirre nga URL-ja.
    // Kthen null per avataret e Google, qe nuk duhen prekur.
    const oldPublicId = before.avatarPublicId ?? publicIdFromUrl(before.avatar);

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl, avatarPublicId },
      { returnDocument: "after" },
    );

    if (!user) {
      return { success: false, error: "Përdoruesi nuk u gjet" };
    }

    // Fshirja vetem pasi DB-ja u perditesua me sukses. Nese deshton,
    // mbetet nje aset jetim - i riparueshem. Renditja e kundert do te linte
    // avatarin duke treguar nga nje aset qe nuk ekziston me.
    if (oldPublicId && oldPublicId !== avatarPublicId) {
      try {
        const res = await cloudinary.uploader.destroy(oldPublicId);

        // destroy() nuk hedh gabim kur aseti mungon - kthen "not found".
        // Pa kete kontroll, deshtimi kalon krejt ne heshtje.
        if (res.result !== "ok") {
          console.warn(
            "Avatari i vjeter nuk u fshi ne Cloudinary:",
            oldPublicId,
            res.result,
          );
        }
      } catch (destroyError) {
        console.error(
          "Nuk u fshi avatari i vjeter ne Cloudinary:",
          oldPublicId,
          destroyError,
        );
      }
    }

    return {
      success: true,
      message: "Avatar u përditësua me sukses",
      avatar: user.avatar,
    };
  } catch (error) {
    console.error("Update avatar error:", error);
    return { success: false, error: "Diçka shkoi keq" };
  }
}
