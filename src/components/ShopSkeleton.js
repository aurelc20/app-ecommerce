// src/components/ShopSkeleton.js
export default function ShopSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-sm border overflow-hidden animate-pulse"
        >
          {/* Image Placeholder */}
          <div className="relative aspect-square bg-gray-200" />

          {/* Content Placeholder */}
          <div className="p-4 space-y-3">
            {/* Category */}
            <div className="w-16 h-3 bg-gray-200 rounded" />

            {/* Name */}
            <div className="space-y-2">
              <div className="w-3/4 h-4 bg-gray-200 rounded" />
              <div className="w-1/2 h-4 bg-gray-200 rounded" />
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="w-4 h-4 bg-gray-200 rounded" />
                ))}
              </div>
              <div className="w-12 h-3 bg-gray-200 rounded" />
            </div>

            {/* Price */}
            <div className="w-20 h-5 bg-gray-200 rounded" />

            {/* Stock */}
            <div className="w-16 h-3 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
