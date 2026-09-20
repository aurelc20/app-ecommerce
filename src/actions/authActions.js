// src/actions/authActions.js
"use server";

import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { z } from "zod";
import { createEmailToken } from "@/lib/email-tokens";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "@/lib/resend";
import crypto from "crypto";
import { auth } from "@/lib/auth";
import cloudinary, { publicIdFromUrl } from "@/lib/cloudinary";

// Schema për registration
const registerSchema = z.object({
  name: z.string().min(2, "Emri duhet të jetë së paku 2 karaktere"),
  email: z.email("Email-i nuk është valid"),
  password: z.string().min(6, "Fjalëkalimi duhet të jetë së paku 6 karaktere"),
});

const forgotPasswordSchema = z.object({
  email: z.email("Email-i nuk është valid"),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token-i mungon"),
  password: z.string().min(6, "Fjalëkalimi duhet të jetë së paku 6 karaktere"),
});

// Sa zgjat nje link reset-i, dhe sa shpesh mund te kerkohet nje i ri.
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 ore, si te teksti i email-it
const RESET_COOLDOWN_MS = 2 * 60 * 1000; // 2 minuta
const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 ore, si te registerUser

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

    try {
      await sendVerificationEmail({
        to: user.email,
        name: user.name,
        token: rawToken,
      });
    } catch (mailError) {
      // Llogaria tashme ekziston. Nese e kthejme si deshtim regjistrimi,
      // perdoruesi riprovon dhe merr "email-i eshte tashme i regjistruar" -
      // rruge pa krye. Linku [dev] mbetet ne log.
      console.error("Nuk u dergua email-i i verifikimit:", mailError);
    }

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

// I njejti pergjigje per cdo rast, qe forma te mos perdoret per te zbuluar
// se cilat adresa jane te regjistruara.
const GENERIC_RESET_RESPONSE = {
  success: true,
  message:
    "Nëse ky email është i regjistruar, do të marrësh një link brenda pak minutash.",
};

export async function requestPasswordReset(values) {
  const parsed = forgotPasswordSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Email-i nuk është valid",
    };
  }

  const email = parsed.data.email.toLowerCase().trim();

  try {
    await dbConnect();

    const user = await User.findOne({ email });

    // Email i paregjistruar: dil pa bere asgje, por me te njejtin mesazh.
    if (!user) {
      return GENERIC_RESET_RESPONSE;
    }

    // Cooldown: nese token-i aktual u krijua para me pak se 2 minutash,
    // mos dergo nje email te dyte dhe mos e zevendeso token-in ekzistues.
    const expires = user.passwordResetTokenExpires;
    const createdAt = expires ? expires.getTime() - RESET_TOKEN_TTL_MS : 0;

    if (createdAt && Date.now() - createdAt < RESET_COOLDOWN_MS) {
      return GENERIC_RESET_RESPONSE;
    }

    const { rawToken, tokenHash } = createEmailToken();

    user.passwordResetTokenHash = tokenHash;
    user.passwordResetTokenExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
    await user.save();

    if (process.env.NODE_ENV === "development") {
      console.log(
        "[dev] Link rivendosjeje:",
        `${process.env.APP_URL}/reset-password?token=${encodeURIComponent(rawToken)}`,
      );
    }

    await sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      token: rawToken,
    });

    return GENERIC_RESET_RESPONSE;
  } catch (error) {
    // Gabimi logohet, por perdoruesi merr te njejtin mesazh - ndryshe
    // nje deshtim dergimi do te tregonte se adresa ekziston.
    console.error("Password reset request error:", error);
    return GENERIC_RESET_RESPONSE;
  }
}

export async function resetPassword(values) {
  const parsed = resetPasswordSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Të dhënat nuk janë valide",
    };
  }

  try {
    await dbConnect();

    const tokenHash = crypto
      .createHash("sha256")
      .update(parsed.data.token)
      .digest("hex");

    // passwordResetTokenHash eshte select: false, ndaj kerkohet shprehimisht.
    const user = await User.findOne({
      passwordResetTokenHash: tokenHash,
      passwordResetTokenExpires: { $gt: new Date() },
    }).select("+passwordResetTokenHash");

    if (!user) {
      return {
        success: false,
        error: "Ky link është i pavlefshëm ose ka skaduar. Kërko një të ri.",
      };
    }

    user.password = await bcrypt.hash(parsed.data.password, 12);
    user.passwordResetTokenHash = null;
    user.passwordResetTokenExpires = null;

    // Klikimi i linkut provon kontrollin mbi inbox-in, qe eshte pikerisht
    // ajo cka verifikon nje email. Pa kete, authorize() do ta bllokonte
    // kycjen edhe pas nje reset-i te suksesshem.
    if (!user.emailVerified) {
      user.emailVerified = new Date();
    }

    await user.save();

    return {
      success: true,
      message: "Fjalëkalimi u rivendos. Tani mund të kyçesh.",
    };
  } catch (error) {
    console.error("Password reset error:", error);
    return { success: false, error: "Ndodhi një gabim. Provo sërish." };
  }
}

// I njejti mesazh per cdo rast: email i paregjistruar, llogari e verifikuar
// tashme, ose i ndaluar nga cooldown-i. Ndryshe forma zbulon se cilat adresa
// ekzistojne dhe cilat jane verifikuar.
const GENERIC_VERIFICATION_RESPONSE = {
  success: true,
  message:
    "Nëse ky email ka nevojë për verifikim, do të marrësh një link brenda pak minutash.",
};

export async function resendVerificationEmail(values) {
  const parsed = forgotPasswordSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Email-i nuk është valid",
    };
  }

  const email = parsed.data.email.toLowerCase().trim();

  try {
    await dbConnect();

    const user = await User.findOne({ email });

    // Nuk ekziston, ose e ka verifikuar tashme: nje link i dyte s'ka kuptim.
    if (!user || user.emailVerified) {
      return GENERIC_VERIFICATION_RESPONSE;
    }

    // Cooldown i nxjerre nga skadimi, si te requestPasswordReset.
    const expires = user.emailVerificationTokenExpires;
    const createdAt = expires
      ? expires.getTime() - VERIFICATION_TOKEN_TTL_MS
      : 0;

    if (createdAt && Date.now() - createdAt < RESET_COOLDOWN_MS) {
      return GENERIC_VERIFICATION_RESPONSE;
    }

    const { rawToken, tokenHash } = createEmailToken();

    user.emailVerificationTokenHash = tokenHash;
    user.emailVerificationTokenExpires = new Date(
      Date.now() + VERIFICATION_TOKEN_TTL_MS,
    );
    await user.save();

    if (process.env.NODE_ENV === "development") {
      console.log(
        "[dev] Link verifikimi:",
        `${process.env.APP_URL}/verify-email?token=${encodeURIComponent(rawToken)}`,
      );
    }

    await sendVerificationEmail({
      to: user.email,
      name: user.name,
      token: rawToken,
    });

    return GENERIC_VERIFICATION_RESPONSE;
  } catch (error) {
    // Logohet, por perdoruesi merr te njejtin mesazh - nje deshtim dergimi
    // do te tregonte se adresa ekziston.
    console.error("Resend verification error:", error);
    return GENERIC_VERIFICATION_RESPONSE;
  }
}
