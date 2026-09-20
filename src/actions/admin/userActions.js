// src/actions/admin/userActions.js
"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";
import { revalidatePath } from "next/cache";

async function checkAdmin() {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  return session;
}

export async function updateUserRole(userId, newRole) {
  const session = await checkAdmin();

  // Mos lejo admin-in ta ndryshojë rolin e vet
  if (session.user.id === userId) {
    return { success: false, error: "Nuk mund të ndryshosh rolin tënd" };
  }

  try {
    await dbConnect();

    const user = await User.findByIdAndUpdate(
      userId,
      { role: newRole },
      { returnDocument: "after", runValidators: true },
    );

    if (!user) {
      return { success: false, error: "User-i nuk u gjet" };
    }

    revalidatePath("/admin/users");

    return { success: true, message: "Roli u përditësua me sukses" };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteUser(userId) {
  const session = await checkAdmin();

  if (session.user.id === userId) {
    return { success: false, error: "Nuk mund të fshish llogarinë tënde" };
  }

  try {
    await dbConnect();

    // Kontrollo nëse user ka porosi aktive
    const activeOrders = await Order.countDocuments({
      user: userId,
      status: { $in: ["pending", "processing", "shipped", "out_for_delivery"] },
    });

    if (activeOrders > 0) {
      return {
        success: false,
        error: `Ky user ka ${activeOrders} porosi aktive. Nuk mund të fshihet.`,
      };
    }

    await User.findByIdAndDelete(userId);

    revalidatePath("/admin/users");

    return { success: true, message: "User-i u fshi me sukses" };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: error.message };
  }
}

export async function getUserDetails(userId) {
  await checkAdmin();

  try {
    await dbConnect();

    const user = await User.findById(userId).select("-password").lean();

    if (!user) return null;

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    return {
      user: JSON.parse(JSON.stringify(user)),
      orders: JSON.parse(JSON.stringify(orders)),
    };
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
}
