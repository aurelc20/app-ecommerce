// src/models/Settings.js
import mongoose from "mongoose";
import registerModel from "@/lib/registerModel";

const SettingsSchema = new mongoose.Schema(
  {
    // Këto janë settings globale - do të ketë vetëm 1 dokument
    storeName: {
      type: String,
      default: "Perlë Jewellery Design",
    },
    storeEmail: {
      type: String,
      default: "info@perle.com",
    },
    storePhone: {
      type: String,
      default: "+355691234567",
    },
    storeAddress: {
      type: String,
      default: "Durrës, Shqipëri",
    },
    storeDescription: {
      type: String,
      default: "Bizhuteri ekskluzive dhe elegante",
    },
    logo: {
      type: String,
      default: "",
    },

    // Shipping
    freeShippingThreshold: {
      type: Number,
      default: 100,
    },
    standardShippingFee: {
      type: Number,
      default: 5,
    },

    // Tax
    taxRate: {
      type: Number,
      default: 0.15, // 15%
    },

    // Payment Methods
    paymentMethods: {
      cod: {
        enabled: { type: Boolean, default: true },
        label: { type: String, default: "Cash on Delivery (COD)" },
      },
      bank: {
        enabled: { type: Boolean, default: true },
        label: { type: String, default: "Transfer Bankar" },
        bankName: { type: String, default: "Raiffeisen Bank" },
        accountNumber: { type: String, default: "" },
        swift: { type: String, default: "" },
        beneficiary: { type: String, default: "" },
      },
    },

    // Email Settings
    adminNotificationEmail: {
      type: String,
      default: "",
    },

    // Social Media
    socialLinks: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      tiktok: { type: String, default: "" },
      whatsapp: { type: String, default: "" },
    },

    // Maintenance Mode
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    maintenanceMessage: {
      type: String,
      default: "Faqja është në mirëmbajtje. Kthehuni së shpejti!",
    },

    // Return Policy
    returnPolicyDays: {
      type: Number,
      default: 30,
    },
  },
  {
    timestamps: true,
  },
);

export default registerModel("Settings", SettingsSchema);
