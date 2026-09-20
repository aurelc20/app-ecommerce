// scripts/migrate-product-images.mjs
//
// Ngarkon në Cloudinary imazhet e produkteve që janë ruajtur si data URL
// (base64) në MongoDB dhe i zëvendëson me url + publicId.
// Sillet si dry-run si parazgjedhje.
//
//   node --env-file=.env.local scripts/migrate-product-images.mjs
//   node --env-file=.env.local scripts/migrate-product-images.mjs --apply
//
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

const PRODUCT_FOLDER = "ecommerce/products";
const shouldApply = process.argv.includes("--apply");

async function main() {
  for (const key of [
    "MONGODB_URI",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ]) {
    if (!process.env[key]) {
      console.error(`Mungon ${key}. Nise me: node --env-file=.env.local ...`);
      process.exit(1);
    }
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  await mongoose.connect(process.env.MONGODB_URI);
  const products = mongoose.connection.db.collection("products");

  const docs = await products
    .find({}, { projection: { name: 1, images: 1 } })
    .toArray();

  let pending = 0;
  let migrated = 0;
  let failed = 0;

  for (const doc of docs) {
    const images = doc.images || [];
    const base64Images = images.filter((img) => img.url?.startsWith("data:"));

    if (base64Images.length === 0) continue;

    const sizeKb = Buffer.byteLength(JSON.stringify(images), "utf8") / 1024;
    console.log(
      `\n${doc.name || "(pa emër)"} — ${base64Images.length} imazh(e) base64, ${sizeKb.toFixed(0)} KB`,
    );

    pending += base64Images.length;

    if (!shouldApply) {
      for (const img of base64Images) {
        console.log(`  do të migrohet: ${img.alt || "(pa alt)"}`);
      }
      continue;
    }

    const newImages = [];

    for (const img of images) {
      if (!img.url?.startsWith("data:")) {
        newImages.push(img);
        continue;
      }

      try {
        // SDK-ja e pranon data URL-në direkt, pa kaluar nga skedar.
        const res = await cloudinary.uploader.upload(img.url, {
          folder: PRODUCT_FOLDER,
          transformation: [{ width: 1600, height: 1600, crop: "limit" }],
          quality: "auto",
        });

        newImages.push({
          ...img,
          url: res.secure_url,
          publicId: res.public_id,
        });

        console.log(`  u ngarkua -> ${res.public_id}`);
        migrated++;
      } catch (error) {
        console.error(`  DËSHTOI (${img.alt || "pa alt"}):`, error.message);
        // Mbaje origjinalin që të mos humbasë imazhi
        newImages.push(img);
        failed++;
      }
    }

    await products.updateOne({ _id: doc._id }, { $set: { images: newImages } });

    const newSizeKb = Buffer.byteLength(JSON.stringify(newImages), "utf8") / 1024;
    console.log(`  dokumenti: ${sizeKb.toFixed(0)} KB -> ${newSizeKb.toFixed(1)} KB`);
  }

  console.log("");

  if (pending === 0) {
    console.log("Asnjë imazh base64 — nuk ka çfarë të migrohet.");
  } else if (!shouldApply) {
    console.log(`${pending} imazh(e) për migrim. Rinise me --apply.`);
  } else {
    console.log(`U migruan ${migrated}, dështuan ${failed}.`);
  }

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error("Gabim:", e.message || e);
  process.exit(1);
});
