// src/app/(shop)/shop/page.js
import { Suspense } from "react";
import { getProducts, getProductStats } from "@/actions/productActions";
import ShopFilters from "@/components/ShopFilters";
import ProductGrid from "@/components/ProductGrid";
import ShopPagination from "@/components/ShopPagination";
import ShopSkeleton from "@/components/ShopSkeleton";
import ShopSortDropdown from "@/components/ShopSortDropdown";
import { categoryLabel } from "@/lib/categories";

export const metadata = {
  title: "Dyqani | Furniture Shop",
  description: "Zbuloni koleksionin tonë të bizhuterive ekskluzive",
};

export default async function ShopPage({ searchParams }) {
  const {
    page = "1",
    limit = "12",
    search = "",
    category = "",
    brand = "",
    minPrice = "",
    maxPrice = "",
    sortBy = "newest",
    featured = "",
    sale = "",
  } = await searchParams;

  // Fetch products
  const {
    products,
    totalPages,
    currentPage,
    total,
    categories,
    brands,
    filters,
  } = await getProducts({
    page: parseInt(page),
    limit: parseInt(limit),
    search,
    category,
    brand,
    minPrice,
    maxPrice,
    sortBy,
    isFeatured: featured === "true",
    isOnSale: sale === "true",
  });

  // Fetch stats
  const stats = await getProductStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-linear-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-4">Shop</h1>
          <p className="text-center text-purple-100">
            Zbuloni koleksionin tonë të bizhuterive elegante
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 shrink-0">
            <Suspense
              fallback={
                <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
              }
            >
              <ShopFilters
                categories={categories}
                brands={brands}
                stats={stats}
                currentFilters={filters}
              />
            </Suspense>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Results Info */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                <span className="font-bold text-gray-900">{total}</span>{" "}
                produkte
                {filters.search && (
                  <span> për &quot;{filters.search}&quot;</span>
                )}
              </p>

              <div className="flex items-center gap-2">
                <label htmlFor="sortBy" className="text-sm text-gray-600">
                  Sorto:
                </label>
                <ShopSortDropdown defaultValue={filters.sortBy} />
              </div>
            </div>

            {/* Active Filters */}
            {(filters.category ||
              filters.brand ||
              filters.minPrice ||
              filters.maxPrice ||
              filters.search) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.search && (
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    Search: {filters.search}
                    <a href="?search=" className="hover:text-purple-600">
                      ✕
                    </a>
                  </span>
                )}
                {filters.category && (
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {categoryLabel(filters.category)}
                    <a href="?category=" className="hover:text-purple-600">
                      ✕
                    </a>
                  </span>
                )}
                {filters.brand && (
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {filters.brand}
                    <a href="?brand=" className="hover:text-purple-600">
                      ✕
                    </a>
                  </span>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    ${filters.minPrice || 0} - ${filters.maxPrice || "∞"}
                    <a
                      href="?minPrice=&maxPrice="
                      className="hover:text-purple-600"
                    >
                      ✕
                    </a>
                  </span>
                )}
                <a
                  href="/shop"
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-300"
                >
                  Clear all
                </a>
              </div>
            )}

            {/* Products Grid */}
            <Suspense fallback={<ShopSkeleton />}>
              <ProductGrid products={products} />
            </Suspense>

            {/* Pagination */}
            {totalPages > 1 && (
              <ShopPagination
                currentPage={currentPage}
                totalPages={totalPages}
                currentFilters={filters}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
