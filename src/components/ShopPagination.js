// src/components/ShopPagination.js
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ShopPagination({
  currentPage,
  totalPages,
  currentFilters,
}) {
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `/shop?${params.toString()}`;
  };

  // Generate page numbers
  const pages = [];
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mt-6 flex items-center justify-between">
      <p className="text-sm text-gray-600">
        Faqja <span className="font-medium">{currentPage}</span> nga{" "}
        <span className="font-medium">{totalPages}</span>
      </p>

      <div className="flex items-center gap-2">
        {/* Previous */}
        {currentPage > 1 ? (
          <Link
            href={createPageURL(currentPage - 1)}
            className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 transition"
          >
            ← Prapa
          </Link>
        ) : (
          <button
            disabled
            className="px-4 py-2 border rounded-lg text-sm bg-gray-100 text-gray-400 cursor-not-allowed"
          >
            ← Prapa
          </button>
        )}

        {/* Page Numbers */}
        <div className="hidden sm:flex items-center gap-2">
          {startPage > 1 && (
            <>
              <Link
                href={createPageURL(1)}
                className="w-10 h-10 flex items-center justify-center border rounded-lg hover:bg-gray-50 transition"
              >
                1
              </Link>
              {startPage > 2 && <span className="text-gray-400">...</span>}
            </>
          )}

          {pages.map((page) => (
            <Link
              key={page}
              href={createPageURL(page)}
              className={`w-10 h-10 flex items-center justify-center border rounded-lg transition ${
                page === currentPage
                  ? "bg-purple-600 text-white border-purple-600"
                  : "hover:bg-gray-50"
              }`}
            >
              {page}
            </Link>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="text-gray-400">...</span>
              )}
              <Link
                href={createPageURL(totalPages)}
                className="w-10 h-10 flex items-center justify-center border rounded-lg hover:bg-gray-50 transition"
              >
                {totalPages}
              </Link>
            </>
          )}
        </div>

        {/* Next */}
        {currentPage < totalPages ? (
          <Link
            href={createPageURL(currentPage + 1)}
            className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 transition"
          >
            Para →
          </Link>
        ) : (
          <button
            disabled
            className="px-4 py-2 border rounded-lg text-sm bg-gray-100 text-gray-400 cursor-not-allowed"
          >
            Para →
          </button>
        )}
      </div>
    </div>
  );
}
