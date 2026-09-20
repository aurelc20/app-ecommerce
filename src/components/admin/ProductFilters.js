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
    <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
      <div className="flex flex-wrap gap-4">
        {/* Search */}
        <div className="flex-1 min-w-50">
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
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Category */}
        <select
          value={currentFilters.category || ""}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
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
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Të gjitha stock</option>
          <option value="low">Stock i ulët (≤5)</option>
          <option value="out">Nuk ka në stock (0)</option>
        </select>

        {/* Status */}
        <select
          value={currentFilters.status || ""}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Të gjitha statuset</option>
          <option value="featured">Të preferuarat ⭐</option>
          <option value="sale">Në zbritje 🔥</option>
        </select>

        {/* Clear Filters */}
        <button
          onClick={handleClearFilters}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
