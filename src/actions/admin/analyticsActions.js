// src/actions/admin/analyticsActions.js
"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import Review from "@/models/Review";

async function checkAdmin() {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  return session;
}

// Merr stats për dashboard (për 30 ditët e fundit)
export async function getDashboardStats() {
  await checkAdmin();

  try {
    await dbConnect();

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Total stats
    const [totalOrders, totalRevenue, totalCustomers, totalProducts] =
      await Promise.all([
        Order.countDocuments(),
        Order.aggregate([
          { $match: { status: { $ne: "cancelled" } } },
          { $group: { _id: null, total: { $sum: "$totalPrice" } } },
        ]),
        User.countDocuments({ role: "customer" }),
        Product.countDocuments({ isActive: true }),
      ]);

    // Stats për 30 ditët e fundit
    const [ordersLast30Days, revenueLast30Days, customersLast30Days] =
      await Promise.all([
        Order.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
        Order.aggregate([
          {
            $match: {
              createdAt: { $gte: thirtyDaysAgo },
              status: { $ne: "cancelled" },
            },
          },
          { $group: { _id: null, total: { $sum: "$totalPrice" } } },
        ]),
        User.countDocuments({
          role: "customer",
          createdAt: { $gte: thirtyDaysAgo },
        }),
      ]);

    // Stats për 7 ditët e fundit (për % change)
    const [ordersLast7Days, revenueLast7Days] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: sevenDaysAgo },
            status: { $ne: "cancelled" },
          },
        },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
    ]);

    // Revenue by status
    const revenueByStatus = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      {
        $group: {
          _id: "$status",
          total: { $sum: "$totalPrice" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Top products by revenue
    const topProducts = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalRevenue: { $sum: "$items.price" },
          totalSold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          name: "$product.name",
          image: "$product.images",
          totalRevenue: 1,
          totalSold: 1,
        },
      },
    ]);

    // Orders by payment method
    const ordersByPayment = await Order.aggregate([
      {
        $group: {
          _id: "$paymentMethod",
          count: { $sum: 1 },
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    // Daily revenue for chart (30 ditët e fundit)
    const dailyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          status: { $ne: "cancelled" },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          total: { $sum: "$totalPrice" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      { $project: { _id: 0, date: "$_id", total: 1, count: 1 } },
    ]);

    return {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalCustomers,
      totalProducts,
      ordersLast30Days,
      revenueLast30Days: revenueLast30Days[0]?.total || 0,
      customersLast30Days,
      ordersLast7Days,
      revenueLast7Days: revenueLast7Days[0]?.total || 0,
      revenueByStatus,
      topProducts,
      ordersByPayment,
      dailyRevenue,
    };
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return null;
  }
}
