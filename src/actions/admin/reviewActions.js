// src/actions/admin/reviewActions.js
"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Review from "@/models/Review";
import Product from "@/models/Product";
import { revalidatePath } from "next/cache";

export async function deleteReviewAdmin(reviewId) {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  try {
    await dbConnect();

    const review = await Review.findById(reviewId);

    if (!review) {
      return { success: false, error: "Review nuk u gjet" };
    }

    const productId = review.product;

    await review.deleteOne();

    // Rillogarit rating-un e produktit
    const remainingReviews = await Review.find({ product: productId });
    const product = await Product.findById(productId);

    if (product) {
      if (remainingReviews.length > 0) {
        const totalRating = remainingReviews.reduce(
          (sum, r) => sum + r.rating,
          0,
        );
        product.ratings = {
          average:
            Math.round((totalRating / remainingReviews.length) * 10) / 10,
          count: remainingReviews.length,
        };
      } else {
        product.ratings = { average: 0, count: 0 };
      }
      await product.save();
    }

    revalidatePath("/admin/reviews");
    revalidatePath("/shop");

    return { success: true, message: "Review u fshi me sukses" };
  } catch (error) {
    console.error("Error deleting review:", error);
    return { success: false, error: error.message };
  }
}
