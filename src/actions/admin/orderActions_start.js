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

    order.status = newStatus;

    if (newStatus === "delivered") {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    await order.save();

    // Dërgo email njoftimi
    const user = await User.findById(order.user).lean();

    sendOrderStatusEmail(
      JSON.parse(JSON.stringify(order)),
      JSON.parse(JSON.stringify(user)),
      newStatus,
    ).catch((err) => console.error("Failed to send status email:", err));

    revalidatePath("/admin/orders");
    revalidatePath(`/dashboard/orders/${orderId}`);

    return { success: true, message: "Statusi u përditësua me sukses" };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: error.message };
  }
}
