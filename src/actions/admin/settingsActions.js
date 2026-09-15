// src/actions/admin/settingsActions.js
"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Settings from "@/models/Settings";
import { revalidatePath } from "next/cache";

async function checkAdmin() {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  return session;
}

// Merr settings (krijon default nëse nuk ekziston)
export async function getSettings() {
  try {
    await dbConnect();

    let settings = await Settings.findOne().lean();

    if (!settings) {
      settings = await Settings.create({});
      settings = settings.toObject();
    }

    return JSON.parse(JSON.stringify(settings));
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
}

// Përditëso general settings
export async function updateGeneralSettings(formData) {
  await checkAdmin();

  try {
    await dbConnect();

    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();

    settings.storeName = formData.storeName;
    settings.storeEmail = formData.storeEmail;
    settings.storePhone = formData.storePhone;
    settings.storeAddress = formData.storeAddress;
    settings.storeDescription = formData.storeDescription;

    await settings.save();

    revalidatePath("/admin/settings");
    revalidatePath("/");

    return { success: true, message: "Të dhënat e dyqanit u përditësuan" };
  } catch (error) {
    console.error("Error updating general settings:", error);
    return { success: false, error: error.message };
  }
}

// Përditëso shipping & tax settings
export async function updateShippingSettings(formData) {
  await checkAdmin();

  try {
    await dbConnect();

    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();

    settings.freeShippingThreshold = parseFloat(formData.freeShippingThreshold);
    settings.standardShippingFee = parseFloat(formData.standardShippingFee);
    settings.taxRate = parseFloat(formData.taxRate) / 100; // input në % por ruajmë decimal

    await settings.save();

    revalidatePath("/admin/settings");
    revalidatePath("/checkout");
    revalidatePath("/cart");

    return { success: true, message: "Shipping & Tax u përditësuan" };
  } catch (error) {
    console.error("Error updating shipping settings:", error);
    return { success: false, error: error.message };
  }
}

// Përditëso payment methods
export async function updatePaymentSettings(formData) {
  await checkAdmin();

  try {
    await dbConnect();

    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();

    settings.paymentMethods = {
      cod: {
        enabled: formData.codEnabled,
        label: formData.codLabel,
      },
      bank: {
        enabled: formData.bankEnabled,
        label: formData.bankLabel,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        swift: formData.swift,
        beneficiary: formData.beneficiary,
      },
    };

    await settings.save();

    revalidatePath("/admin/settings");
    revalidatePath("/checkout");

    return { success: true, message: "Metodat e pagesës u përditësuan" };
  } catch (error) {
    console.error("Error updating payment settings:", error);
    return { success: false, error: error.message };
  }
}

// Përditëso social links
export async function updateSocialSettings(formData) {
  await checkAdmin();

  try {
    await dbConnect();

    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();

    settings.socialLinks = {
      facebook: formData.facebook,
      instagram: formData.instagram,
      tiktok: formData.tiktok,
      whatsapp: formData.whatsapp,
    };

    await settings.save();

    revalidatePath("/admin/settings");
    revalidatePath("/");

    return { success: true, message: "Social media u përditësuan" };
  } catch (error) {
    console.error("Error updating social settings:", error);
    return { success: false, error: error.message };
  }
}

// Toggle maintenance mode
export async function toggleMaintenanceMode(enabled, message) {
  await checkAdmin();

  try {
    await dbConnect();

    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();

    settings.maintenanceMode = enabled;
    if (message) settings.maintenanceMessage = message;

    await settings.save();

    revalidatePath("/admin/settings");
    revalidatePath("/");

    return {
      success: true,
      message: `Maintenance mode ${enabled ? "aktivizuar" : "çaktivizuar"}`,
    };
  } catch (error) {
    console.error("Error toggling maintenance mode:", error);
    return { success: false, error: error.message };
  }
}
