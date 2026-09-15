// src/actions/admin/productActions.js
"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { revalidatePath } from "next/cache";

// Kontrollo nëse user është admin
async function checkAdmin() {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  return session;
}

// Krijo produkt të ri
export async function createProduct(formData) {
  await checkAdmin();

  try {
    await dbConnect();

    const productData = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      price: parseFloat(formData.get("price")),
      salePrice: formData.get("salePrice")
        ? parseFloat(formData.get("salePrice"))
        : undefined,
      category: formData.get("category"),
      brand: formData.get("brand") || "Perlë",
      stock: parseInt(formData.get("stock")),
      sku: formData.get("sku"),
      isFeatured: formData.get("isFeatured") === "on",
      isOnSale: formData.get("isOnSale") === "on",
      isActive: formData.get("isActive") !== "off",
      tags:
        formData
          .get("tags")
          ?.split(",")
          .map((tag) => tag.trim())
          .filter(Boolean) || [],
      images: JSON.parse(formData.get("images") || "[]"),
    };

    const product = await Product.create(productData);

    revalidatePath("/admin/products");
    revalidatePath("/shop");

    return {
      success: true,
      message: "Produkti u krijua me sukses",
      productId: product._id.toString(),
    };
  } catch (error) {
    console.error("Error creating product:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Përditëso produkt
export async function updateProduct(productId, formData) {
  await checkAdmin();

  try {
    await dbConnect();

    const price = parseFloat(formData.get("price"));
    const salePrice = formData.get("salePrice")
      ? parseFloat(formData.get("salePrice"))
      : undefined;

    // Validimi manual
    if (salePrice && salePrice >= price) {
      return {
        success: false,
        error: "Çmimi i zbritjes duhet të jetë më i vogël se çmimi origjinal",
      };
    }

    const updateData = {
      name: formData.get("name"),
      description: formData.get("description"),
      price,
      salePrice: salePrice || undefined,
      category: formData.get("category"),
      brand: formData.get("brand"),
      stock: parseInt(formData.get("stock")),
      sku: formData.get("sku"),
      isFeatured: formData.get("isFeatured") === "on",
      isOnSale: formData.get("isOnSale") === "on",
      isActive: formData.get("isActive") !== "off",
      tags:
        formData
          .get("tags")
          ?.split(",")
          .map((tag) => tag.trim())
          .filter(Boolean) || [],
      images: JSON.parse(formData.get("images") || "[]"),
    };

    const product = await Product.findByIdAndUpdate(productId, updateData, {
      returnDocument: "after",
      // runValidators: true,
    });

    if (!product) {
      return { success: false, error: "Produkti nuk u gjet" };
    }

    revalidatePath("/admin/products");
    revalidatePath("/shop");

    return {
      success: true,
      message: "Produkti u përditësua me sukses",
      product: JSON.parse(JSON.stringify(product)),
    };
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Fshi produkt
export async function deleteProduct(productId) {
  await checkAdmin();

  try {
    await dbConnect();

    await Product.findByIdAndDelete(productId);

    revalidatePath("/admin/products");
    revalidatePath("/shop");

    return {
      success: true,
      message: "Produkti u fshi me sukses",
    };
  } catch (error) {
    console.error("Error deleting product:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Merr produkt sipas ID
export async function getProductById(productId) {
  await checkAdmin();

  try {
    await dbConnect();

    const product = await Product.findById(productId).lean();

    if (!product) return null;

    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

// Bulk update stock
export async function bulkUpdateStock(items) {
  await checkAdmin();

  try {
    await dbConnect();

    const operations = items.map(({ productId, stock }) => ({
      updateOne: {
        _id: productId,
        update: { stock: parseInt(stock) },
      },
    }));

    await Product.bulkWrite(operations);

    revalidatePath("/admin/products");
    revalidatePath("/shop");

    return {
      success: true,
      message: `Stock u përditësua për ${items.length} produkte`,
    };
  } catch (error) {
    console.error("Error bulk updating stock:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
