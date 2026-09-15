// src/app/(dashboard)/dashboard/wishlist/page.js
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getWishlistProducts } from "@/actions/wishlistActions";
import Image from "next/image";
import Link from "next/link";
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
        <h1 className="text-3xl font-bold text-gray-900">Wishlist Ime ❤️</h1>
        <p className="text-gray-600 mt-2">Produktet e tua të preferuara</p>
      </div>

      {/* Products Grid */}
      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-sm border overflow-hidden group"
            >
              {/* Image */}
              <Link
                href={`/product/${product.slug || product._id}`}
                className="block"
              >
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  {product.images?.[0] && (
                    <Image
                      src={product.images[0].url}
                      alt={product.images[0].alt || product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  )}
                  {product.isOnSale && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                      -{product.discountPercentage}%
                    </span>
                  )}
                </div>
              </Link>

              {/* Content */}
              <div className="p-4">
                <Link href={`/product/${product.slug || product._id}`}>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-purple-600 transition">
                    {product.name}
                  </h3>
                </Link>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    {product.salePrice ? (
                      <>
                        <span className="text-lg font-bold text-red-600">
                          ${product.salePrice}
                        </span>
                        <span className="text-sm text-gray-400 line-through ml-2">
                          ${product.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        ${product.price}
                      </span>
                    )}
                  </div>

                  <RemoveFromWishlistButton productId={product._id} />
                </div>

                {product.stock > 0 ? (
                  <p className="text-xs text-green-600 mt-2">✓ Në stock</p>
                ) : (
                  <p className="text-xs text-red-600 mt-2">✗ Nuk ka në stock</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-xl shadow-sm border text-center">
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
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Wishlist është bosh
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Shto produkte të preferuara për t'i parë këtu
          </p>
          <div className="mt-6">
            <Link
              href="/shop"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
            >
              Shiko produktet
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
