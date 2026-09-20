// src/lib/cloudinary.js
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Dosja ku ruhen avatarët në Cloudinary
export const AVATAR_FOLDER = "ecommerce/avatars";

// Dosja ku ruhen imazhet e produkteve
export const PRODUCT_FOLDER = "ecommerce/products";

// Nxjerr public_id nga një URL Cloudinary, ose null nëse URL-ja nuk është e
// tillë (p.sh. avatarët e Google te lh3.googleusercontent.com).
// Përdoret si rrugë rezervë për përdoruesit e vjetër që kanë avatar por jo
// fushën avatarPublicId.
export function publicIdFromUrl(url) {
  if (!url || !url.includes("res.cloudinary.com")) return null;

  const after = url.split("/upload/")[1];
  if (!after) return null;

  // Hiq segmentin e versionit (v1789800992/) dhe prapashtesën (.jpg)
  return after.replace(/^v\d+\//, "").replace(/\.[^./]+$/, "");
}
