// src/app/(admin)/admin/products/page.js
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Link from "next/link";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import ProductFilters from "@/components/admin/ProductFilters";
import { categoryLabel } from "@/lib/categories";

export default async function ProductsPage({ searchParams }) {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  const {
    page = "1",
    search = "",
    category = "",
    stock = "",
    status = "",
  } = await searchParams;

  await dbConnect();

  // Build query
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { sku: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    query.category = category;
  }

  if (stock === "low") {
    query.stock = { $lte: 5 };
  } else if (stock === "out") {
    query.stock = 0;
  }

  if (status === "featured") {
    query.isFeatured = true;
  } else if (status === "sale") {
    query.isOnSale = true;
  }

  const limit = 20;
  const skip = (parseInt(page) - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Product.countDocuments(query),
  ]);

  const categories = await Product.distinct("category");

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Produktet</h1>
          <p className="text-gray-600 mt-2">Menaxho produktet e dyqanit</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
        >
          + Krijo Produkt
        </Link>
      </div>

      {/* Filters */}
      <ProductFilters
        categories={categories}
        currentFilters={{ search, category, stock, status }}
      />

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Produkti
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Kategoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Çmimi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Statusi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Veprime
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id.toString()} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.images?.[0] && (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {product.name}
                        </p>
                        {product.isOnSale && (
                          <span className="text-xs text-red-600 font-medium">
                            Në zbritje
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                    {product.sku || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 bg-gray-100 rounded text-gray-700">
                      {categoryLabel(product.category)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {product.salePrice ? (
                      <div>
                        <span className="text-red-600">
                          ${product.salePrice}
                        </span>
                        <span className="text-gray-400 line-through text-xs ml-2">
                          ${product.price}
                        </span>
                      </div>
                    ) : (
                      `$${product.price}`
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={
                        product.stock <= 5
                          ? "text-red-600 font-medium"
                          : "text-gray-700"
                      }
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-1">
                      {product.isFeatured && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                          ⭐ Featured
                        </span>
                      )}
                      {product.isActive ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                          Inactive
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/${product._id.toString()}/edit`}
                        className="text-purple-600 hover:text-purple-700 font-medium"
                      >
                        Edit
                      </Link>
                      <DeleteProductButton
                        productId={product._id.toString()} // ← KONVERTO NË STRING
                        productName={product.name}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > limit && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Shfaqur {skip + 1}-{Math.min(skip + limit, total)} nga {total}
            </p>
            <div className="flex gap-2">
              {parseInt(page) > 1 && (
                <Link
                  href={`/admin/products?page=${parseInt(page) - 1}${search ? `&search=${search}` : ""}${category ? `&category=${category}` : ""}`}
                  className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
                >
                  ← Prapa
                </Link>
              )}
              {skip + limit < total && (
                <Link
                  href={`/admin/products?page=${parseInt(page) + 1}${search ? `&search=${search}` : ""}${category ? `&category=${category}` : ""}`}
                  className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
                >
                  Para →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
