// src/actions/wishlistActions.js
"use server";

import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Product from "@/models/Product";

export async function addToWishlist(productId) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    await dbConnect();

    const user = await User.findById(session.user.id);

    if (!user) {
      return { success: false, error: "User-i nuk u gjet" };
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return { success: false, error: "Produkti nuk u gjet" };
    }

    // Check if already in wishlist
    if (user.wishlist.includes(productId)) {
      return { success: false, error: "Produkti është tashmë në wishlist" };
    }

    user.wishlist.push(productId);
    await user.save();

    return {
      success: true,
      message: "U shtua në wishlist",
      wishlist: user.wishlist,
    };
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return { success: false, error: error.message };
  }
}

export async function removeFromWishlist(productId) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    await dbConnect();

    const user = await User.findById(session.user.id);

    if (!user) {
      return { success: false, error: "User-i nuk u gjet" };
    }

    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    await user.save();

    return {
      success: true,
      message: "U hoq nga wishlist",
      wishlist: user.wishlist,
    };
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return { success: false, error: error.message };
  }
}

export async function getWishlistProducts() {
  try {
    const session = await auth();

    if (!session?.user) {
      return { products: [] };
    }

    await dbConnect();

    const user = await User.findById(session.user.id)
      .populate({
        path: "wishlist",
        model: Product,
      })
      .lean();

    if (!user) return { products: [] };

    return {
      products: JSON.parse(JSON.stringify(user.wishlist || [])),
    };
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return { products: [] };
  }
}
