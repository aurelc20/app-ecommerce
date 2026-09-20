// src/actions/settingsActions.js (public - për frontend, jo admin-only)
"use server";

import dbConnect from "@/lib/db";
import Settings from "@/models/Settings";

// Public settings - vetëm ato që i duhen frontend-it (pa detaje sensitive)
export async function getPublicSettings() {
  try {
    await dbConnect();

    let settings = await Settings.findOne().lean();

    if (!settings) {
      settings = {};
    }

    return {
      freeShippingThreshold: settings.freeShippingThreshold ?? 100,
      standardShippingFee: settings.standardShippingFee ?? 5,
      taxRate: settings.taxRate ?? 0.15,
      paymentMethods: {
        cod: settings.paymentMethods?.cod || {
          enabled: true,
          label: "Cash on Delivery (COD)",
        },
        bank: settings.paymentMethods?.bank || {
          enabled: true,
          label: "Transfer Bankar",
        },
      },
      maintenanceMode: settings.maintenanceMode ?? false,
      maintenanceMessage: settings.maintenanceMessage ?? "",
      storeName: settings.storeName ?? "Furniture Shop",
      storeEmail: settings.storeEmail ?? "info@furnitureshop.com",
      storePhone: settings.storePhone ?? "",
      socialLinks: settings.socialLinks ?? {},
    };
  } catch (error) {
    console.error("Error fetching public settings:", error);
    // Fallback defaults nëse DB fail
    return {
      freeShippingThreshold: 100,
      standardShippingFee: 5,
      taxRate: 0.15,
      paymentMethods: {
        cod: { enabled: true, label: "Cash on Delivery (COD)" },
        bank: { enabled: true, label: "Transfer Bankar" },
      },
      maintenanceMode: false,
    };
  }
}
