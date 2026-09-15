// src/actions/productActions.js
"use server";

import dbConnect from "@/lib/db";
import Product from "@/models/Product";

// Merr të gjitha produktet me filtera, search, sorting dhe pagination
export async function getProducts({
  page = 1,
  limit = 12,
  search = "",
  category = "",
  brand = "",
  minPrice = "",
  maxPrice = "",
  sortBy = "newest",
  isFeatured = false,
  isOnSale = false,
}) {
  try {
    await dbConnect();

    // Build query
    const query = { isActive: true };

    // Search (text search në name dhe description)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by brand
    if (brand) {
      query.brand = brand;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Featured products
    if (isFeatured) {
      query.isFeatured = true;
    }

    // Sale products
    if (isOnSale) {
      query.isOnSale = true;
    }

    // Sorting
    let sort = {};
    switch (sortBy) {
      case "price-low":
        sort = { price: 1 };
        break;
      case "price-high":
        sort = { price: -1 };
        break;
      case "rating":
        sort = { "ratings.average": -1 };
        break;
      case "name-asc":
        sort = { name: 1 };
        break;
      case "name-desc":
        sort = { name: -1 };
        break;
      case "newest":
      default:
        sort = { createdAt: -1 };
        break;
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Fetch products
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const total = await Product.countDocuments(query);

    // Get unique categories for filter
    const categories = await Product.distinct("category", { isActive: true });

    // Get unique brands for filter
    const brands = await Product.distinct("brand", { isActive: true });

    return {
      products: JSON.parse(JSON.stringify(products)),
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      categories,
      brands,
      filters: {
        category,
        brand,
        minPrice,
        maxPrice,
        sortBy,
        search,
        isFeatured,
        isOnSale,
      },
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      products: [],
      totalPages: 0,
      currentPage: 0,
      total: 0,
      categories: [],
      brands: [],
      filters: {},
    };
  }
}

// Merr një produkt sipas slug
export async function getProductBySlug(slug) {
  try {
    await dbConnect();
    const product = await Product.findOne({ slug }).lean();

    if (!product) return null;

    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

// Merr produkte të ngjashme
export async function getRelatedProducts(productId, category, limit = 4) {
  try {
    await dbConnect();

    const products = await Product.find({
      _id: { $ne: productId },
      category,
      isActive: true,
    })
      .limit(limit)
      .lean();

    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

// Merr statistikat e produkteve
export async function getProductStats() {
  try {
    await dbConnect();

    const [totalProducts, categories, brands, priceRange] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Product.distinct("category", { isActive: true }),
      Product.distinct("brand", { isActive: true }),
      Product.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            minPrice: { $min: "$price" },
            maxPrice: { $max: "$price" },
          },
        },
      ]),
    ]);

    return {
      totalProducts,
      categories,
      brands,
      minPrice: priceRange[0]?.minPrice || 0,
      maxPrice: priceRange[0]?.maxPrice || 0,
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return {
      totalProducts: 0,
      categories: [],
      brands: [],
      minPrice: 0,
      maxPrice: 0,
    };
  }
}
