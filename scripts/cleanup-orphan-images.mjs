// scripts/cleanup-orphan-images.mjs
//
// Gjen imazhet në Cloudinary që nuk i referon askush — as një avatar
// përdoruesi, as një imazh produkti — dhe i fshin.
// Sillet si dry-run si parazgjedhje.
//
//   node --env-file=.env.local scripts/cleanup-orphan-images.mjs
//   node --env-file=.env.local scripts/cleanup-orphan-images.mjs --delete
//
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

// Dosjet aktuale plus ajo e vjetër, që tranzicioni të mbulohet i plotë.
const FOLDERS = [
  "ecommerce/avatars",
  "ecommerce/products",
  "perle-jewellery/avatars",
];

const shouldDelete = process.argv.includes("--delete");

function publicIdFromUrl(url) {
  if (!url || !url.includes("res.cloudinary.com")) return null;
  const after = url.split("/upload/")[1];
  if (!after) return null;
  return after.replace(/^v\d+\//, "").replace(/\.[^./]+$/, "");
}

async function listFolder(prefix) {
  const all = [];
  let cursor;

  do {
    const res = await cloudinary.api.resources({
      type: "upload",
      prefix,
      max_results: 500,
      next_cursor: cursor,
    });
    all.push(...res.resources);
    cursor = res.next_cursor;
  } while (cursor);

  return all;
}

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
  const db = mongoose.connection.db;
  const users = db.collection("users");
  const products = db.collection("products");

  const inUse = new Set();
  const toBackfill = [];

  // 1. Avatarët
  const userDocs = await users
    .find({}, { projection: { email: 1, avatar: 1, avatarPublicId: 1 } })
    .toArray();

  for (const u of userDocs) {
    const fromUrl = publicIdFromUrl(u.avatar);
    const publicId = u.avatarPublicId ?? fromUrl;

    if (publicId) inUse.add(publicId);

    if (!u.avatarPublicId && fromUrl) {
      toBackfill.push({ _id: u._id, email: u.email, publicId: fromUrl });
    }
  }

  // 2. Imazhet e produkteve
  const productDocs = await products
    .find({}, { projection: { name: 1, images: 1 } })
    .toArray();

  for (const p of productDocs) {
    for (const img of p.images || []) {
      const publicId = img.publicId || publicIdFromUrl(img.url);
      if (publicId) inUse.add(publicId);
    }
  }

  // 3. Backfill i avatarPublicId
  if (toBackfill.length > 0) {
    console.log(`Backfill i avatarPublicId për ${toBackfill.length} përdorues:`);
    for (const b of toBackfill) {
      console.log(`  ${b.email} -> ${b.publicId}`);
      if (shouldDelete) {
        await users.updateOne(
          { _id: b._id },
          { $set: { avatarPublicId: b.publicId } },
        );
      }
    }
    if (!shouldDelete) console.log("  (dry-run: asgjë nuk u shkrua)");
    console.log("");
  }

  // 4. Gjej jetimët
  const orphans = [];
  let total = 0;
  let bytes = 0;

  for (const folder of FOLDERS) {
    const resources = await listFolder(folder);
    total += resources.length;

    for (const r of resources) {
      if (!inUse.has(r.public_id)) {
        orphans.push(r);
        bytes += r.bytes || 0;
      }
    }
  }

  console.log(`Asete gjithsej:  ${total}`);
  console.log(`Në përdorim:     ${inUse.size}`);
  console.log(`JETIME:          ${orphans.length}`);
  console.log(`Hapësirë:        ${(bytes / 1024 / 1024).toFixed(2)} MB\n`);

  if (orphans.length === 0) {
    console.log("Asgjë për të pastruar.");
    await mongoose.disconnect();
    return;
  }

  for (const o of orphans) {
    console.log(
      `  ${o.public_id}  ${(o.bytes / 1024).toFixed(0)} KB  ${o.created_at}`,
    );
  }

  if (!shouldDelete) {
    console.log("\nDry-run. Rinise me --delete për t'i fshirë.");
    await mongoose.disconnect();
    return;
  }

  console.log("\nDuke fshirë...");
  let ok = 0;
  let failed = 0;

  for (const o of orphans) {
    try {
      const res = await cloudinary.uploader.destroy(o.public_id);
      if (res.result === "ok") {
        ok++;
      } else {
        console.error(`  dështoi ${o.public_id}: ${res.result}`);
        failed++;
      }
    } catch (e) {
      console.error(`  dështoi ${o.public_id}: ${e.message}`);
      failed++;
    }
  }

  console.log(`\nU fshinë ${ok}, dështuan ${failed}.`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error("Gabim:", e.message || e);
  process.exit(1);
});
