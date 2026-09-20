// src/actions/emailActions.js
"use server";

import { resend } from "@/lib/resend";
import { orderConfirmationTemplate } from "@/emails/OrderConfirmationEmail";
import { orderStatusUpdateTemplate } from "@/emails/OrderStatusUpdateEmail";

export async function sendOrderConfirmationEmail(order, user) {
  try {
    const { data, error } = await resend.emails.send({
      from: `Furniture Shop <${process.env.EMAIL_FROM || "acangonji20@gmail.com"}>`,
      to: user.email,
      subject: `Porosia #${order._id.toString().slice(-8).toUpperCase()} u konfirmua! 🎉`,
      html: orderConfirmationTemplate({ order, user }),
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, emailId: data.id };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
}

// Email për admin kur ka porosi të re
export async function sendAdminOrderNotification(order, user) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@perle.com";

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Furniture Shop <onboarding@resend.dev>",
      to: adminEmail,
      subject: `🔔 Porosi e re #${order._id.toString().slice(-8).toUpperCase()}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Porosi e re nga ${user.name}</h2>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Telefoni:</strong> ${order.shippingAddress.phone}</p>
          <p><strong>Adresa:</strong> ${order.shippingAddress.street}, ${order.shippingAddress.city}</p>
          <p><strong>Totali:</strong> $${order.totalPrice.toFixed(2)}</p>
          <p><strong>Pagesa:</strong> ${order.paymentMethod === "cod" ? "Cash on Delivery" : "Bank Transfer"}</p>
          <p><strong>Artikuj:</strong> ${order.items.length}</p>
          <a href="${process.env.NEXTAUTH_URL}/admin/orders/${order._id}" 
             style="display: inline-block; background: #9333ea; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 12px;">
            Shiko Porosinë
          </a>
        </div>
      `,
    });

    if (error) {
      console.error("Resend admin notification error:", error);
      return { success: false, error: error.message };
    }

    console.log("✅ Admin notification sent:", data.id);
    return { success: true, emailId: data.id };
  } catch (error) {
    console.error("Error sending admin notification:", error);
    return { success: false, error: error.message };
  }
}

export async function sendOrderStatusEmail(order, user, newStatus) {
  try {
    const statusLabels = {
      processing: "Në përpunim",
      shipped: "Dërguar",
      out_for_delivery: "Në rrugë",
      delivered: "Dorëzuar",
      cancelled: "Anuluar",
    };

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Furniture Shop <onboarding@resend.dev>",
      to: user.email,
      subject: `Porosia #${order._id.toString().slice(-8).toUpperCase()} - ${statusLabels[newStatus]}`,
      html: orderStatusUpdateTemplate({ order, user, newStatus }),
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, emailId: data.id };
  } catch (error) {
    console.error("Error sending status email:", error);
    return { success: false, error: error.message };
  }
}
