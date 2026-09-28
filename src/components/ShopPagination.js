// src/components/ShopPagination.js
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    <div className="mt-6 flex items-center justify-between rounded-2xl border border-sand bg-cream p-4">
      <p className="text-sm text-ink-soft">
        Faqja <span className="font-medium text-ink">{currentPage}</span> nga{" "}
        <span className="font-medium text-ink">{totalPages}</span>
      </p>

      <div className="flex items-center gap-2">
        {/* Previous */}
        {currentPage > 1 ? (
          <Link
            href={createPageURL(currentPage - 1)}
            className="flex items-center gap-1.5 rounded-lg border border-sand px-4 py-2 text-sm text-ink transition hover:border-wood/40 hover:bg-sand/60"
          >
            <ChevronLeft className="h-4 w-4" />
            Prapa
          </Link>
        ) : (
          <button
            disabled
            className="flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-sand px-4 py-2 text-sm text-ink-soft/50"
          >
            <ChevronLeft className="h-4 w-4" />
            Prapa
          </button>
        )}

        {/* Page Numbers */}
        <div className="hidden sm:flex items-center gap-2">
          {startPage > 1 && (
            <>
              <Link
                href={createPageURL(1)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-sand text-ink transition hover:border-wood/40 hover:bg-sand/60"
              >
                1
              </Link>
              {startPage > 2 && <span className="text-ink-soft">...</span>}
            </>
          )}

          {pages.map((page) => (
            <Link
              key={page}
              href={createPageURL(page)}
              className={`flex h-10 w-10 items-center justify-center rounded-lg border transition ${
                page === currentPage
                  ? "border-wood bg-wood text-white"
                  : "border-sand text-ink hover:border-wood/40 hover:bg-sand/60"
              }`}
            >
              {page}
            </Link>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="text-ink-soft">...</span>
              )}
              <Link
                href={createPageURL(totalPages)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-sand text-ink transition hover:border-wood/40 hover:bg-sand/60"
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
            className="flex items-center gap-1.5 rounded-lg border border-sand px-4 py-2 text-sm text-ink transition hover:border-wood/40 hover:bg-sand/60"
          >
            Para
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <button
            disabled
            className="flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-sand px-4 py-2 text-sm text-ink-soft/50"
          >
            Para
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
