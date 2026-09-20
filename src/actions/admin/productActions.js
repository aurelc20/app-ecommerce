// src/actions/admin/productActions.js
"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { revalidatePath } from "next/cache";
import cloudinary, { publicIdFromUrl } from "@/lib/cloudinary";

// Kontrollo nëse user është admin
async function checkAdmin() {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  return session;
}

// Fshin asetet ne Cloudinary. Thirret GJITHMONE pas nje shkrimi te suksesshem
// ne DB: nese fshirja deshton mbetet nje aset jetim (i riparueshem), ndersa
// renditja e kundert do te linte produktin duke treguar nga imazhe te fshira.
async function destroyImages(images = []) {
  const publicIds = images
    .map((img) => img.publicId || publicIdFromUrl(img.url))
    .filter(Boolean);

  for (const publicId of publicIds) {
    try {
      const res = await cloudinary.uploader.destroy(publicId);

      // destroy() nuk hedh gabim kur aseti mungon - kthen "not found".
      if (res.result !== "ok") {
        console.warn("Imazhi nuk u fshi ne Cloudinary:", publicId, res.result);
      }
    } catch (error) {
      console.error("Gabim gjate fshirjes ne Cloudinary:", publicId, error);
    }
  }
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
      brand: formData.get("brand") || "Furniture Shop",
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

    // Imazhet aktuale, per te ditur cilat hiqen nga ky perditesim.
    const before = await Product.findById(productId).select("images").lean();

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

    // Imazhet qe ishin me pare dhe nuk jane me ne vargun e ri
    const keep = new Set(
      updateData.images.map((img) => img.publicId).filter(Boolean),
    );
    const removed = (before?.images || []).filter((img) => {
      const publicId = img.publicId || publicIdFromUrl(img.url);
      return publicId && !keep.has(publicId);
    });

    await destroyImages(removed);

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

    const product = await Product.findById(productId).select("images").lean();

    await Product.findByIdAndDelete(productId);

    await destroyImages(product?.images || []);

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
