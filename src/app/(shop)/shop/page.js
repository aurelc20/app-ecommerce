// src/app/(shop)/shop/page.js
import { Suspense } from "react";
import { getProducts, getProductStats } from "@/actions/productActions";
import ShopFilters from "@/components/ShopFilters";
import ProductGrid from "@/components/ProductGrid";
import ShopPagination from "@/components/ShopPagination";
import ShopSkeleton from "@/components/ShopSkeleton";
import ShopSortDropdown from "@/components/ShopSortDropdown";
import { categoryLabel } from "@/lib/categories";
import Eyebrow from "@/components/Eyebrow";

export const metadata = {
  title: "Dyqani | Furniture Shop",
  description: "Zbuloni koleksionin tonë të mobiljeve ekskluzive",
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
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="border-b border-sand bg-cream py-14">
        <div className="container mx-auto px-4">
          <Eyebrow>Koleksioni</Eyebrow>
          <h1 className="mt-4 text-center font-display text-4xl font-semibold text-ink sm:text-5xl">
            Produktet
          </h1>
          <p className="mt-3 text-center text-ink-soft">
            Zbuloni koleksionin tonë të mobiljeve elegante
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 shrink-0">
            <Suspense
              fallback={
                <div className="h-96 rounded-2xl bg-sand/50 animate-pulse" />
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
            <div className="mb-6 flex items-center justify-between rounded-2xl border border-sand bg-cream p-4">
              <p className="text-ink-soft">
                <span className="font-bold text-ink">{total}</span> produkte
                {filters.search && (
                  <span> për &quot;{filters.search}&quot;</span>
                )}
              </p>

              <div className="flex items-center gap-2">
                <label htmlFor="sortBy" className="text-sm text-ink-soft">
                  Rendit:
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
                  <span className="flex items-center gap-2 rounded-full bg-sand px-3 py-1 text-sm text-ink">
                    Search: {filters.search}
                    <a href="?search=" className="hover:text-wood">
                      ✕
                    </a>
                  </span>
                )}
                {filters.category && (
                  <span className="flex items-center gap-2 rounded-full bg-sand px-3 py-1 text-sm text-ink">
                    {categoryLabel(filters.category)}
                    <a href="?category=" className="hover:text-wood">
                      ✕
                    </a>
                  </span>
                )}
                {filters.brand && (
                  <span className="flex items-center gap-2 rounded-full bg-sand px-3 py-1 text-sm text-ink">
                    {filters.brand}
                    <a href="?brand=" className="hover:text-wood">
                      ✕
                    </a>
                  </span>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <span className="flex items-center gap-2 rounded-full bg-sand px-3 py-1 text-sm text-ink">
                    ${filters.minPrice || 0} - ${filters.maxPrice || "∞"}
                    <a href="?minPrice=&maxPrice=" className="hover:text-wood">
                      ✕
                    </a>
                  </span>
                )}
                <a
                  href="/shop"
                  className="rounded-full bg-ink/10 px-3 py-1 text-sm text-ink hover:bg-ink/20"
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
            {totalPages > 0 && (
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
