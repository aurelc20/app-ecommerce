// src/actions/orderActions.js
"use server";

import dbConnect from "@/lib/db";
import Order from "@/models/Order";

import { auth } from "@/lib/auth";
import Product from "@/models/Product";
import User from "@/models/User";
import {
  sendAdminOrderNotification,
  sendOrderConfirmationEmail,
} from "./emailActions";
import { getSettings } from "@/actions/admin/settingsActions";

export async function getUserOrders(
  userId,
  { page = 1, limit = 10, status } = {},
) {
  try {
    await dbConnect();

    const query = { user: userId };

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("items.product", "name images price")
      .lean();

    const total = await Order.countDocuments(query);

    return {
      orders: JSON.parse(JSON.stringify(orders)),
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { orders: [], totalPages: 0, currentPage: 0, total: 0 };
  }
}

export async function getOrderById(orderId, userId) {
  try {
    await dbConnect();

    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    })
      .populate("items.product", "name images price")
      .lean();

    if (!order) return null;

    return JSON.parse(JSON.stringify(order));
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}

//ne fill perdor kete
export async function createOrder_start(orderData) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    await dbConnect();

    // Validate items and calculate totals
    let itemsPrice = 0;
    const items = [];

    for (const item of orderData.items) {
      const product = await Product.findById(item.product).lean();

      if (!product || product.stock < item.quantity) {
        return {
          success: false,
          error: `Produkti "${product?.name || "N/A"}" nuk është në stock`,
        };
      }

      items.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0]?.url,
        quantity: item.quantity,
        price: product.price,
      });

      itemsPrice += product.price * item.quantity;
    }

    const taxPrice = itemsPrice * 0.15; // 15% TVSH
    const shippingPrice = itemsPrice > 100 ? 0 : 5; // Free shipping mbi $100
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    const order = await Order.create({
      user: session.user.id,
      items,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      status: "pending",
      notes: orderData.notes,
    });

    // Reduce stock
    for (const item of orderData.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // ✅ Dërgo email-et (fire-and-forget, pa prit)
    const user = await User.findById(session.user.id).lean();
    console.log(user);

    // Mos prit përgjigjen, thjesht dërgo
    sendOrderConfirmationEmail(
      JSON.parse(JSON.stringify(order)),
      JSON.parse(JSON.stringify(user)),
    ); // ❌ PA .then() ose await

    sendAdminOrderNotification(
      JSON.parse(JSON.stringify(order)),
      JSON.parse(JSON.stringify(user)),
    ); // ❌ PA .then() ose await

    return {
      success: true,
      order: JSON.parse(JSON.stringify(order)),
    };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: error.message };
  }
}

//perdore pas krijimit te settings
export async function createOrder(orderData) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return { success: false, error: 'Unauthorized' };
    }

    await dbConnect();

    // ✅ Merr settings dinamike (shipping, tax, payment methods)
    const settings = await getSettings();

    if (!settings) {
      return { success: false, error: 'Nuk mund të merren konfigurimet e dyqanit' };
    }

    // ✅ Kontrollo nëse dyqani është në maintenance mode
    if (settings.maintenanceMode) {
      return { 
        success: false, 
        error: settings.maintenanceMessage || 'Dyqani është aktualisht në mirëmbajtje' 
      };
    }

    // ✅ Kontrollo nëse metoda e pagesës është aktive
    const paymentMethodConfig = settings.paymentMethods?.[orderData.paymentMethod];
    
    if (!paymentMethodConfig?.enabled) {
      return { 
        success: false, 
        error: 'Kjo metodë pagese nuk është e disponueshme aktualisht' 
      };
    }

    // Validate items and calculate totals
    let itemsPrice = 0;
    const items = [];

    for (const item of orderData.items) {
      const product = await Product.findById(item.product).lean();
      
      if (!product || product.stock < item.quantity) {
        return { 
          success: false, 
          error: `Produkti "${product?.name || 'N/A'}" nuk është në stock` 
        };
      }

      const price = product.salePrice || product.price;

      items.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0]?.url,
        quantity: item.quantity,
        price,
      });

      itemsPrice += price * item.quantity;
    }

    // ✅ Përdor vlerat dinamike nga Settings (jo hardcoded)
    const taxRate = settings.taxRate ?? 0.15;
    const freeShippingThreshold = settings.freeShippingThreshold ?? 100;
    const standardShippingFee = settings.standardShippingFee ?? 5;

    const taxPrice = itemsPrice * taxRate;
    const shippingPrice = itemsPrice >= freeShippingThreshold ? 0 : standardShippingFee;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    const order = await Order.create({
      user: session.user.id,
      items,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      status: 'pending',
      notes: orderData.notes,
    });

    // Reduce stock
    for (const item of orderData.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // Dërgo email-et (fire-and-forget)
    const user = await User.findById(session.user.id).lean();
    
    sendOrderConfirmationEmail(
      JSON.parse(JSON.stringify(order)),
      JSON.parse(JSON.stringify(user))
    );

    // ✅ Përdor admin email nga settings nëse ekziston
    sendAdminOrderNotification(
      JSON.parse(JSON.stringify(order)),
      JSON.parse(JSON.stringify(user)),
      settings.adminNotificationEmail
    );

    return {
      success: true,
      order: JSON.parse(JSON.stringify(order)),
    };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error: error.message };
  }
}



export async function cancelOrder(orderId, userId) {
  try {
    await dbConnect();

    const order = await Order.findOne({ _id: orderId, user: userId });

    if (!order) {
      return { success: false, error: "Porosia nuk u gjet" };
    }

    if (order.status !== "pending" && order.status !== "processing") {
      return { success: false, error: "Porosia nuk mund të anulohet" };
    }

    order.status = "cancelled";
    await order.save();

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    return { success: true, message: "Porosia u anulua me sukses" };
  } catch (error) {
    console.error("Error cancelling order:", error);
    return { success: false, error: error.message };
  }
}
