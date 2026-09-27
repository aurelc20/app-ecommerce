// src/components/ProductGrid.js
import Link from "next/link";
import Image from "next/image";
import { Check, PackageSearch, Sparkles, Star, X } from "lucide-react";
import AddToWishlistButton from "@/components/AddToWishlistButton";
import { categoryLabel } from "@/lib/categories";

export default function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="rounded-2xl border border-sand bg-paper p-12 text-center">
        <PackageSearch
          className="mx-auto h-12 w-12 text-ink-soft/50"
          strokeWidth={1.5}
        />
        <h3 className="mt-4 font-display text-lg font-medium text-ink">
          Nuk u gjet asnjë produkt
        </h3>
        <p className="mt-2 text-ink-soft">
          Provo të ndryshosh filterat ose kërko diçka tjetër
        </p>
        <Link
          href="/shop"
          className="mt-4 inline-block font-medium text-wood hover:text-wood-dark"
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
    <div className="group overflow-hidden rounded-2xl border border-sand bg-paper transition hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/10">
      {/* Image */}
      <Link
        href={`/product/${product.slug || product._id}`}
        className="block relative"
      >
        <div className="relative aspect-square overflow-hidden bg-sand/60">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || product.name}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-ink-soft">
              No Image
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.isOnSale && (
              <span className="rounded-full bg-red-500 px-2.5 py-1 text-xs font-medium text-white">
                -{product.discountPercentage}%
              </span>
            )}
            {product.isFeatured && (
              <span className="flex items-center gap-1 rounded-full bg-wood px-2.5 py-1 text-xs font-medium text-white">
                <Sparkles className="h-3 w-3" />
                Featured
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <div className="absolute top-3 right-3 opacity-0 transition group-hover:opacity-100">
            <AddToWishlistButton productId={product._id} />
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="mb-1 text-xs font-medium tracking-wide text-wood uppercase">
          {categoryLabel(product.category)}
        </p>

        {/* Name */}
        <Link href={`/product/${product.slug || product._id}`}>
          <h3 className="mb-2 font-display text-lg font-medium text-ink line-clamp-2 transition group-hover:text-wood">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.ratings?.count > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 fill-current ${
                    i < Math.floor(product.ratings.average)
                      ? ""
                      : "text-sand"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-ink-soft">
              {product.ratings.average.toFixed(1)} ({product.ratings.count})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          {product.salePrice ? (
            <>
              <span className="text-lg font-semibold text-red-600">
                ${product.salePrice}
              </span>
              <span className="text-sm text-ink-soft/70 line-through">
                ${product.price}
              </span>
            </>
          ) : (
            <span className="text-lg font-semibold text-ink">
              ${product.price}
            </span>
          )}
        </div>

        {/* Stock Status */}
        {product.stock > 0 ? (
          <p className="flex items-center gap-1 text-xs text-green-700">
            <Check className="h-3.5 w-3.5" />
            Në stock ({product.stock})
          </p>
        ) : (
          <p className="flex items-center gap-1 text-xs text-red-600">
            <X className="h-3.5 w-3.5" />
            Nuk ka në stock
          </p>
        )}
      </div>
    </div>
  );
}
