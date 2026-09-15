// src/actions/reviewActions.js
"use server";

import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Review from "@/models/Review";
import Product from "@/models/Product";
import Order from "@/models/Order";

// Merr të gjitha review-të për një produkt
export async function getProductReviews(
  productId,
  { page = 1, limit = 10, sortBy = "newest" } = {},
) {
  try {
    await dbConnect();

    let sort = {};
    switch (sortBy) {
      case "rating-high":
        sort = { rating: -1, createdAt: -1 };
        break;
      case "rating-low":
        sort = { rating: 1, createdAt: -1 };
        break;
      case "helpful":
        sort = { helpful: -1, createdAt: -1 };
        break;
      case "newest":
      default:
        sort = { createdAt: -1 };
        break;
    }

    const skip = (page - 1) * limit;

    const reviews = await Review.find({ product: productId })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("user", "name avatar")
      .lean();

    const total = await Review.countDocuments({ product: productId });

    return {
      reviews: JSON.parse(JSON.stringify(reviews)),
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    };
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return { reviews: [], totalPages: 0, currentPage: 0, total: 0 };
  }
}

// Shto review të re
export async function addReview(formData) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const { productId, rating, title, comment } = formData;

    if (!productId || !rating || !title || !comment) {
      return { success: false, error: "Të gjitha fushat janë të detyrueshme" };
    }

    await dbConnect();

    // Kontrollo nëse user ka blerë këtë produkt
    const order = await Order.findOne({
      user: session.user.id,
      "items.product": productId,
      status: { $in: ["delivered", "shipped", "out_for_delivery"] },
    });

    const isVerifiedPurchase = !!order;

    // Kontrollo nëse user ka lënë tashmë review
    const existingReview = await Review.findOne({
      product: productId,
      user: session.user.id,
    });

    if (existingReview) {
      return {
        success: false,
        error: "Keni lënë tashmë një review për këtë produkt",
      };
    }

    const review = await Review.create({
      product: productId,
      user: session.user.id,
      rating,
      title,
      comment,
      isVerifiedPurchase,
    });

    return {
      success: true,
      message: "Review u shtua me sukses!",
      review: JSON.parse(JSON.stringify(review)),
    };
  } catch (error) {
    console.error("Error adding review:", error);
    if (error.code === 11000) {
      return {
        success: false,
        error: "Keni lënë tashmë një review për këtë produkt",
      };
    }
    return { success: false, error: error.message };
  }
}

// Marko review si helpful
export async function markReviewHelpful(reviewId) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    await dbConnect();

    const review = await Review.findById(reviewId);

    if (!review) {
      return { success: false, error: "Review nuk u gjet" };
    }

    // Kontrollo nëse user e ka markuar tashmë
    if (review.helpfulUsers.includes(session.user.id)) {
      return {
        success: false,
        error: "E ke markuar tashmë këtë review si helpful",
      };
    }

    review.helpful += 1;
    review.helpfulUsers.push(session.user.id);
    await review.save();

    return {
      success: true,
      helpful: review.helpful,
    };
  } catch (error) {
    console.error("Error marking review helpful:", error);
    return { success: false, error: error.message };
  }
}

// Fshi review
export async function deleteReview(reviewId) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    await dbConnect();

    const review = await Review.findOne({
      _id: reviewId,
      user: session.user.id,
    });

    if (!review) {
      return { success: false, error: "Review nuk u gjet ose nuk ke akses" };
    }

    await review.deleteOne();

    return {
      success: true,
      message: "Review u fshi me sukses",
    };
  } catch (error) {
    console.error("Error deleting review:", error);
    return { success: false, error: error.message };
  }
}

// Merr statistikat e review-ve
export async function getReviewStats(productId) {
  try {
    await dbConnect();

    const reviews = await Review.find({ product: productId }).lean();

    const total = reviews.length;
    const average =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / total
        : 0;

    const distribution = {
      5: reviews.filter((r) => r.rating === 5).length,
      4: reviews.filter((r) => r.rating === 4).length,
      3: reviews.filter((r) => r.rating === 3).length,
      2: reviews.filter((r) => r.rating === 2).length,
      1: reviews.filter((r) => r.rating === 1).length,
    };

    return {
      total,
      average: Math.round(average * 10) / 10,
      distribution,
    };
  } catch (error) {
    console.error("Error fetching review stats:", error);
    return { total: 0, average: 0, distribution: {} };
  }
}
