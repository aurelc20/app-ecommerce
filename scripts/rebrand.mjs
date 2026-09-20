// scripts/rebrand.mjs
//
// Përditëson emrin e dyqanit dhe brandin e produkteve në bazë.
// Vlerat në kod janë vetëm rezerva — ajo që shfaqet vjen nga këto dokumente.
// Sillet si dry-run si parazgjedhje.
//
//   node --env-file=.env.local scripts/rebrand.mjs
//   node --env-file=.env.local scripts/rebrand.mjs --apply
//
import mongoose from "mongoose";

const OLD_BRAND = "Perlë";
const NEW_BRAND = "Furniture Shop";
const NEW_STORE_NAME = "Furniture Shop";

const shouldApply = process.argv.includes("--apply");

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error("Mungon MONGODB_URI. Nise me: node --env-file=.env.local ...");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  // 1. Emri i dyqanit
  const settings = await db.collection("settings").findOne({});

  if (!settings) {
    console.log("Settings: asnjë dokument — do të krijohet me parazgjedhjet e reja.");
  } else if (settings.storeName === NEW_STORE_NAME) {
    console.log(`Settings: storeName është tashmë "${NEW_STORE_NAME}".`);
  } else {
    console.log(`Settings: storeName "${settings.storeName}" -> "${NEW_STORE_NAME}"`);

    if (shouldApply) {
      await db
        .collection("settings")
        .updateOne({ _id: settings._id }, { $set: { storeName: NEW_STORE_NAME } });
    }

    // storeEmail nuk preket: është adresë reale kontakti
    if (settings.storeEmail) {
      console.log(`  (storeEmail mbetet "${settings.storeEmail}" — ndryshoje nga /admin/settings)`);
    }
  }

  console.log("");

  // 2. Brandi i produkteve
  const products = await db
    .collection("products")
    .find({ brand: OLD_BRAND }, { projection: { name: 1, brand: 1 } })
    .toArray();

  if (products.length === 0) {
    console.log(`Produkte me brand "${OLD_BRAND}": asnjë.`);
  } else {
    console.log(`Produkte me brand "${OLD_BRAND}" -> "${NEW_BRAND}": ${products.length}`);
    for (const p of products) {
      console.log(`  ${p.name}`);
    }

    if (shouldApply) {
      const res = await db
        .collection("products")
        .updateMany({ brand: OLD_BRAND }, { $set: { brand: NEW_BRAND } });
      console.log(`  u përditësuan ${res.modifiedCount}`);
    }
  }

  console.log("");
  console.log(shouldApply ? "U zbatua." : "Dry-run. Rinise me --apply për t'i shkruar.");

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error("Gabim:", e.message || e);
  process.exit(1);
});
