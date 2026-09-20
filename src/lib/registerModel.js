// src/lib/registerModel.js
import mongoose from "mongoose";

// Në zhvillim, HMR-ja e Next-it e ri-vlerëson modulin e modelit, por
// mongoose.models e mban skemën e vjetër të kompiluar. Rezultati: fushat e
// reja të skemës hidhen poshtë në heshtje gjatë shkrimit, sepse Mongoose ka
// strict: true si parazgjedhje — pa asnjë gabim në log.
//
// Fshirja e modelit të cache-uar e detyron rikompilimin me skemën aktuale.
// Në prodhim nuk ka HMR, ndaj sjellja mbetet identike me më parë.
export default function registerModel(name, schema) {
  if (process.env.NODE_ENV !== "production" && mongoose.models[name]) {
    mongoose.deleteModel(name);
  }

  return mongoose.models[name] || mongoose.model(name, schema);
}
