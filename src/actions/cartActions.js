// src/actions/cartActions.js
"use server";

import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Cart from "@/models/Cart";
import Product from "@/models/Product";

export async function addToCart(productId, quantity = 1) {
  try {
    const session = await auth();

    if (!session?.user) {
      return {
        success: false,
        error: "Duhet të jesh i loguar për të shtuar në shportë",
      };
    }

    await dbConnect();

    // Gjej produktin
    const product = await Product.findById(productId);

    if (!product) {
      return { success: false, error: "Produkti nuk u gjet" };
    }

    if (product.stock < quantity) {
      return { success: false, error: "Nuk ka mjaftueshëm stock" };
    }

    // Gjej ose krijo shportën e userit
    let cart = await Cart.findOne({ user: session.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: session.user.id,
        items: [],
      });
    }

    // Kontrollo nëse produkti është tashmë në shportë
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.salePrice || product.price,
      });
    }

    await cart.save();

    return { success: true, message: "Produkti u shtua në shportë" };
  } catch (error) {
    console.error("Add to cart error:", error);
    return { success: false, error: "Diçka shkoi keq" };
  }
}

export async function removeFromCart(productId) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, error: "Duhet të jesh i loguar" };
    }

    await dbConnect();

    const cart = await Cart.findOne({ user: session.user.id });

    if (!cart) {
      return { success: false, error: "Shporta nuk u gjet" };
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );

    await cart.save();

    return { success: true, message: "Produkti u hoq nga shporta" };
  } catch (error) {
    console.error("Remove from cart error:", error);
    return { success: false, error: "Diçka shkoi keq" };
  }
}

export async function updateCartQuantity(productId, quantity) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, error: "Duhet të jesh i loguar" };
    }

    await dbConnect();

    const cart = await Cart.findOne({ user: session.user.id });

    if (!cart) {
      return { success: false, error: "Shporta nuk u gjet" };
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (!item) {
      return { success: false, error: "Produkti nuk u gjet në shportë" };
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId,
      );
    } else {
      item.quantity = quantity;
    }

    await cart.save();

    return { success: true, message: "Sasia u përditësua" };
  } catch (error) {
    console.error("Update cart error:", error);
    return { success: false, error: "Diçka shkoi keq" };
  }
}

export async function getCart() {
  try {
    const session = await auth();

    if (!session?.user) {
      return { items: [], total: 0 };
    }

    await dbConnect();

    const cart = await Cart.findOne({ user: session.user.id }).populate(
      "items.product",
      "name images price salePrice",
    );

    if (!cart) {
      return { items: [], total: 0 };
    }

    const items = cart.items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
    }));

    const total = items.reduce((sum, item) => sum + item.subtotal, 0);

    return { items, total };
  } catch (error) {
    console.error("Get cart error:", error);
    return { items: [], total: 0 };
  }
}

//////////////////////// New
export async function syncCartToDatabase(items) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, error: "User not authenticated" };
    }

    await dbConnect();

    // Gjej ose krijo shportën
    let cart = await Cart.findOne({ user: session.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: session.user.id,
        items: [],
      });
    }

    // Konverto items nga Zustand format në database format
    const dbItems = items.map((item) => ({
      product: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    cart.items = dbItems;
    await cart.save();

    return { success: true };
  } catch (error) {
    console.error("Sync cart error:", error);
    return { success: false, error: error.message };
  }
}

export async function getCartFromDatabase() {
  try {
    const session = await auth();

    if (!session?.user) {
      return { items: [] };
    }

    await dbConnect();

    const cart = await Cart.findOne({ user: session.user.id }).populate(
      "items.product",
      "name images price salePrice",
    );

    if (!cart) {
      return { items: [] };
    }

    return { items: cart.items };
  } catch (error) {
    console.error("Get cart error:", error);
    return { items: [] };
  }
}
