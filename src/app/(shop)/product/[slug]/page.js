// src/app/(shop)/product/[slug]/page.js
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/actions/productActions";
import { getReviewStats, getProductReviews } from "@/actions/reviewActions";
import Image from "next/image";
import Link from "next/link";
import ProductGallery from "@/components/ProductGallery";
import { categoryLabel } from "@/lib/categories";

import AddToWishlistButton from "@/components/AddToWishlistButton";
import ReviewsSection from "@/components/ReviewsSection";

import AddToCartButton from "@/components/AddToCartButton";
import StarRating from "@/components/StarRating";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Produkti nuk u gjet",
    };
  }

  return {
    title: `${product.name} | Furniture Shop`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images?.map((img) => img.url) || [],
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [relatedProducts, reviewStats, { reviews }] = await Promise.all([
    getRelatedProducts(product._id, product.category),
    getReviewStats(product._id),
    getProductReviews(product._id, { limit: 5 }),
  ]);

  const primaryImage =
    product.images?.find((img) => img.isPrimary) || product.images?.[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-purple-600">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-purple-600">
              Shop
            </Link>
            <span>/</span>
            <Link
              href={`/shop?category=${product.category}`}
              className="hover:text-purple-600"
            >
              {categoryLabel(product.category)}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Product Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Gallery */}
          <ProductGallery images={product.images} />

          {/* Info */}
          <div>
            {/* Title & Rating */}
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>

              <div className="flex items-center gap-4">
                {product.ratings?.count > 0 ? (
                  <div className="flex items-center gap-2">
                    <StarRating rating={product.ratings.average} />
                    <span className="text-sm text-gray-600">
                      {product.ratings.average.toFixed(1)} (
                      {product.ratings.count} reviews)
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">Pa reviews ende</span>
                )}

                <span
                  className={`text-sm ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {product.stock > 0 ? "✓ Në stock" : "✗ Nuk ka në stock"}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              {product.salePrice ? (
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold text-red-600">
                    ${product.salePrice}
                  </span>
                  <span className="text-xl text-gray-400 line-through">
                    ${product.price}
                  </span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                    -{product.discountPercentage}%
                  </span>
                </div>
              ) : (
                <span className="text-4xl font-bold text-gray-900">
                  ${product.price}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="prose prose-sm max-w-none mb-6">
              <p className="text-gray-700">{product.description}</p>
            </div>

            {/* Meta Info */}
            <div className="border-t border-b py-4 mb-6 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Kategoria:</span>
                <Link
                  href={`/shop?category=${product.category}`}
                  className="text-sm text-purple-600 hover:text-purple-700"
                >
                  {categoryLabel(product.category)}
                </Link>
              </div>
              {product.brand && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Brand:</span>
                  <span className="text-sm text-gray-900">{product.brand}</span>
                </div>
              )}
              {product.sku && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">SKU:</span>
                  <span className="text-sm text-gray-900">{product.sku}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-6">
              <AddToCartButton
                // productId={product._id}
                product={product} // ← kalo të gjithë produktin
                disabled={product.stock <= 0}
                className="flex-1"
              />
              <AddToWishlistButton
                productId={product._id}
                className="px-4 py-3 border rounded-lg hover:bg-gray-50"
              />
            </div>

            {/* Features */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Karakteristikat
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Material i cilësisë së lartë
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Dizajn unik dhe elegant
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  I përshtatshëm për çdo rast
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Garanci 1 vit
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewsSection
          productId={product._id}
          reviewStats={reviewStats}
          initialReviews={reviews}
        />

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Produkte të Ngjashme
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <Link
                  key={product._id}
                  href={`/product/${product.slug || product._id}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition">
                    <div className="relative aspect-square bg-gray-100">
                      {product.images?.[0] && (
                        <Image
                          src={product.images[0].url}
                          alt={product.images[0].alt || product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-lg font-bold text-purple-600">
                        ${product.price}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
