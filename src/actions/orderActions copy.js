// src/actions/orderActions.js
"use server";

import dbConnect from "@/lib/db";
import Order from "@/models/Order";

import { auth } from "@/lib/auth";
import Product from "@/models/Product";

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

export async function createOrder(orderData) {
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
    });

    // Reduce stock
    for (const item of orderData.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    return {
      success: true,
      order: JSON.parse(JSON.stringify(order)),
    };
  } catch (error) {
    console.error("Error creating order:", error);
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
