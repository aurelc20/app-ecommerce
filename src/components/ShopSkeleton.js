// src/components/ShopSkeleton.js
export default function ShopSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-2xl border border-sand bg-paper"
        >
          {/* Image Placeholder */}
          <div className="relative aspect-square bg-sand/60" />

          {/* Content Placeholder */}
          <div className="p-4 space-y-3">
            {/* Category */}
            <div className="w-16 h-3 bg-sand rounded" />

            {/* Name */}
            <div className="space-y-2">
              <div className="w-3/4 h-4 bg-sand rounded" />
              <div className="w-1/2 h-4 bg-sand rounded" />
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="w-4 h-4 bg-sand rounded" />
                ))}
              </div>
              <div className="w-12 h-3 bg-sand rounded" />
            </div>

            {/* Price */}
            <div className="w-20 h-5 bg-sand rounded" />

            {/* Stock */}
            <div className="w-16 h-3 bg-sand rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
