// src/actions/admin/orderActions.js
"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";
import { sendOrderStatusEmail } from "@/actions/emailActions";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId, newStatus) {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  try {
    await dbConnect();

    const order = await Order.findById(orderId);

    if (!order) {
      return { success: false, error: "Porosia nuk u gjet" };
    }

    const oldStatus = order.status;
    order.status = newStatus;

    // Auto-set flags based on status
    if (newStatus === "delivered") {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    if (newStatus === "cancelled" || newStatus === "refunded") {
      order.isPaid = false;
    }

    await order.save();

    // Dërgo email njoftimi nëse statusi ndryshoi
    if (
      oldStatus !== newStatus &&
      ["processing", "shipped", "out_for_delivery", "delivered"].includes(
        newStatus,
      )
    ) {
      const user = await User.findById(order.user).lean();

      sendOrderStatusEmail(
        JSON.parse(JSON.stringify(order)),
        JSON.parse(JSON.stringify(user)),
        newStatus,
      ).catch((err) => console.error("Failed to send status email:", err));
    }

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath(`/dashboard/orders/${orderId}`);

    return { success: true, message: "Statusi u përditësua me sukses" };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: error.message };
  }
}

export async function getOrderById(orderId) {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  try {
    await dbConnect();

    const order = await Order.findById(orderId)
      .populate("user", "name email")
      .lean();

    if (!order) {
      return null;
    }

    return JSON.parse(JSON.stringify(order));
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}
