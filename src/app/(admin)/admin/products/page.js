// src/app/(admin)/admin/products/page.js
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Link from "next/link";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import ProductFilters from "@/components/admin/ProductFilters";
import { categoryLabel } from "@/lib/categories";
import Image from "next/image";
import { Star } from "lucide-react";

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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Produktet
          </h1>
          <p className="mt-2 text-ink-soft">Menaxho produktet e dyqanit</p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-wood px-6 py-3 font-semibold text-white transition hover:bg-wood-dark"
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
      <div className="overflow-hidden rounded-xl border border-sand bg-paper shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sand/40">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink-soft uppercase">
                  <input type="checkbox" className="rounded accent-wood" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink-soft uppercase">
                  Produkti
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink-soft uppercase">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink-soft uppercase">
                  Kategoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink-soft uppercase">
                  Çmimi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink-soft uppercase">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink-soft uppercase">
                  Statusi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink-soft uppercase">
                  Veprime
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {products.map((product) => (
                <tr key={product._id.toString()} className="hover:bg-sand/20">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded accent-wood" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.images?.[0] && (
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium text-ink">{product.name}</p>
                        {product.isOnSale && (
                          <span className="text-xs font-medium text-wood">
                            Në zbritje
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-ink-soft">
                    {product.sku || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="rounded bg-sand px-2 py-1 text-ink-soft">
                      {categoryLabel(product.category)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {product.salePrice ? (
                      <div>
                        <span className="text-ink">${product.salePrice}</span>
                        <span className="ml-2 text-xs text-ink-soft/70 line-through">
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
                          ? "font-medium text-red-600"
                          : "text-ink-soft"
                      }
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-1">
                      {product.isFeatured && (
                        <span className="flex items-center gap-1 rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                          <Star className="h-3 w-3 fill-current" />
                          Featured
                        </span>
                      )}
                      {product.isActive ? (
                        <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="rounded bg-sand px-2 py-1 text-xs text-ink-soft">
                          Inactive
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/${product._id.toString()}/edit`}
                        className="font-medium text-wood hover:text-wood-dark"
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
          <div className="flex items-center justify-between border-t border-sand px-6 py-4">
            <p className="text-sm text-ink-soft">
              Shfaqur {skip + 1}-{Math.min(skip + limit, total)} nga {total}
            </p>
            <div className="flex gap-2">
              {parseInt(page) > 1 && (
                <Link
                  href={`/admin/products?page=${parseInt(page) - 1}${search ? `&search=${search}` : ""}${category ? `&category=${category}` : ""}`}
                  className="rounded-lg border border-sand px-4 py-2 text-sm hover:bg-sand/40"
                >
                  ← Prapa
                </Link>
              )}
              {skip + limit < total && (
                <Link
                  href={`/admin/products?page=${parseInt(page) + 1}${search ? `&search=${search}` : ""}${category ? `&category=${category}` : ""}`}
                  className="rounded-lg border border-sand px-4 py-2 text-sm hover:bg-sand/40"
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
