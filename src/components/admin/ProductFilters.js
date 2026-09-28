// src/components/admin/ProductFilters.js
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { categoryLabel } from "@/lib/categories";

export default function ProductFilters({ categories, currentFilters }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "" || value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    // Reset page kur filterat ndryshojnë
    params.delete("page");

    router.push(`/admin/products?${params.toString()}`);
  };

  const handleClearFilters = () => {
    router.push("/admin/products");
  };

  return (
    <div className="mb-6 rounded-xl border border-sand bg-paper p-4 shadow-sm">
      <div className="flex flex-wrap gap-4">
        {/* Search */}
        <div className="min-w-50 flex-1">
          <input
            type="text"
            placeholder="Kërko produkte..."
            defaultValue={currentFilters.search}
            onBlur={(e) => handleFilterChange("search", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleFilterChange("search", e.target.value);
              }
            }}
            className="w-full rounded-lg border border-sand px-4 py-2 text-ink transition focus:border-wood focus:ring-2 focus:ring-wood/20 focus:outline-none"
          />
        </div>

        {/* Category */}
        <select
          value={currentFilters.category || ""}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          className="rounded-lg border border-sand px-4 py-2 text-ink transition focus:border-wood focus:ring-2 focus:ring-wood/20 focus:outline-none"
        >
          <option value="">Të gjitha kategoritë</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {categoryLabel(cat)}
            </option>
          ))}
        </select>

        {/* Stock */}
        <select
          value={currentFilters.stock || ""}
          onChange={(e) => handleFilterChange("stock", e.target.value)}
          className="rounded-lg border border-sand px-4 py-2 text-ink transition focus:border-wood focus:ring-2 focus:ring-wood/20 focus:outline-none"
        >
          <option value="">Të gjitha stock</option>
          <option value="low">Stock i ulët (≤5)</option>
          <option value="out">Nuk ka në stock (0)</option>
        </select>

        {/* Status */}
        <select
          value={currentFilters.status || ""}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="rounded-lg border border-sand px-4 py-2 text-ink transition focus:border-wood focus:ring-2 focus:ring-wood/20 focus:outline-none"
        >
          <option value="">Të gjitha statuset</option>
          <option value="featured">Të preferuarat ⭐</option>
          <option value="sale">Në zbritje 🔥</option>
        </select>

        {/* Clear Filters */}
        <button
          onClick={handleClearFilters}
          className="rounded-lg bg-sand px-4 py-2 text-ink-soft transition hover:bg-sand/70"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
