// src/app/(dashboard)/dashboard/wishlist/page.js
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getWishlistProducts } from "@/actions/wishlistActions";
import Image from "next/image";
import Link from "next/link";
import { Check, Heart, X } from "lucide-react";
import RemoveFromWishlistButton from "@/components/RemoveFromWishlistButton";

export default async function WishlistPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { products } = await getWishlistProducts();

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-ink">
          Wishlist
        </h1>
        <p className="mt-2 text-ink-soft">Produktet e tua të preferuara</p>
      </div>

      {/* Products Grid */}
      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="group overflow-hidden rounded-2xl border border-sand bg-paper"
            >
              {/* Image */}
              <Link
                href={`/product/${product.slug || product._id}`}
                className="block"
              >
                <div className="relative aspect-square overflow-hidden bg-sand/60">
                  {product.images?.[0] && (
                    <Image
                      src={product.images[0].url}
                      alt={product.images[0].alt || product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  )}
                  {product.isOnSale && (
                    <span className="absolute top-2 right-2 rounded-full bg-ink px-2 py-1 text-xs font-medium text-white">
                      -{product.discountPercentage}%
                    </span>
                  )}
                </div>
              </Link>

              {/* Content */}
              <div className="p-4">
                <Link href={`/product/${product.slug || product._id}`}>
                  <h3 className="mb-2 line-clamp-2 font-semibold text-ink transition hover:text-wood">
                    {product.name}
                  </h3>
                </Link>

                <p className="mb-3 line-clamp-2 text-sm text-ink-soft">
                  {product.description}
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    {product.salePrice ? (
                      <>
                        <span className="text-lg font-semibold text-ink">
                          ${product.salePrice}
                        </span>
                        <span className="ml-2 text-sm text-ink-soft/70 line-through">
                          ${product.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-semibold text-ink">
                        ${product.price}
                      </span>
                    )}
                  </div>

                  <RemoveFromWishlistButton productId={product._id} />
                </div>

                {product.stock > 0 ? (
                  <p className="mt-2 flex items-center gap-1 text-xs text-green-700">
                    <Check className="h-3.5 w-3.5" />
                    Në stock
                  </p>
                ) : (
                  <p className="mt-2 flex items-center gap-1 text-xs text-ink-soft">
                    <X className="h-3.5 w-3.5" />
                    Nuk ka në stock
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-sand bg-paper p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sand/70 text-wood">
            <Heart className="h-8 w-8" strokeWidth={1.75} />
          </div>
          <h3 className="mt-4 text-sm font-medium text-ink">
            Wishlist është bosh
          </h3>
          <p className="mt-1 text-sm text-ink-soft">
            Shto produkte të preferuara për t&apos;i parë këtu
          </p>
          <div className="mt-6">
            <Link
              href="/shop"
              className="inline-flex items-center rounded-full bg-wood px-5 py-2.5 text-sm font-medium text-white transition hover:bg-wood-dark"
            >
              Shiko produktet
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
