// src/components/ProductGrid.js
import Link from "next/link";
import Image from "next/image";
import AddToWishlistButton from "@/components/AddToWishlistButton";

export default function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          Nuk u gjet asnjë produkt
        </h3>
        <p className="mt-2 text-gray-600">
          Provo të ndryshosh filterat ose kërko diçka tjetër
        </p>
        <Link
          href="/shop"
          className="mt-4 inline-block text-purple-600 hover:text-purple-700 font-medium"
        >
          Shiko të gjitha produktet
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

function ProductCard({ product }) {
  const primaryImage =
    product.images?.find((img) => img.isPrimary) || product.images?.[0];

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden group hover:shadow-lg transition">
      {/* Image */}
      <Link
        href={`/product/${product.slug || product._id}`}
        className="block relative"
      >
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || product.name}
              fill
              className="object-cover group-hover:scale-105 transition duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isOnSale && (
              <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                -{product.discountPercentage}%
              </span>
            )}
            {product.isFeatured && (
              <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                ⭐ Featured
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
            <AddToWishlistButton productId={product._id} />
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-purple-600 font-medium mb-1">
          {product.category}
        </p>

        {/* Name */}
        <Link href={`/product/${product.slug || product._id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-purple-600 transition">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.ratings?.count > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.ratings.average)
                      ? "fill-current"
                      : "text-gray-300 fill-current"
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-600">
              {product.ratings.average.toFixed(1)} ({product.ratings.count})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          {product.salePrice ? (
            <>
              <span className="text-lg font-bold text-red-600">
                ${product.salePrice}
              </span>
              <span className="text-sm text-gray-400 line-through">
                ${product.price}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              ${product.price}
            </span>
          )}
        </div>

        {/* Stock Status */}
        {product.stock > 0 ? (
          <p className="text-xs text-green-600">✓ Në stock ({product.stock})</p>
        ) : (
          <p className="text-xs text-red-600">✗ Nuk ka në stock</p>
        )}
      </div>
    </div>
  );
}
