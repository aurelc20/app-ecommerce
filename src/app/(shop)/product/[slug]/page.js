// src/app/(shop)/product/[slug]/page.js
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/actions/productActions";
import {
  getReviewStats,
  getProductReviews,
  getUserReview,
  hasPurchasedProduct,
} from "@/actions/reviewActions";
import Link from "next/link";
import { Check, X } from "lucide-react";
import ProductGallery from "@/components/ProductGallery";
import { categoryLabel } from "@/lib/categories";

import AddToWishlistButton from "@/components/AddToWishlistButton";
import ReviewsSection from "@/components/ReviewsSection";

import AddToCartButton from "@/components/AddToCartButton";
import StarRating from "@/components/StarRating";
import ProductGrid from "@/components/ProductGrid";

const FEATURES = [
  "Material i cilësisë së lartë",
  "Dizajn unik dhe elegant",
  "I përshtatshëm për çdo rast",
  "Garanci 1 vit",
];

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

  const [relatedProducts, reviewStats, { reviews }, userReview, hasPurchased] =
    await Promise.all([
      getRelatedProducts(product._id, product.category),
      getReviewStats(product._id),
      getProductReviews(product._id, { limit: 5 }),
      getUserReview(product._id),
      hasPurchasedProduct(product._id),
    ]);

  // `discountPercentage` është një Mongoose virtual — nuk mbijeton `.lean()`,
  // prandaj e llogarisim vetë këtu nga price/salePrice.
  const discountPercentage =
    product.salePrice && product.price
      ? Math.round(
          ((product.price - product.salePrice) / product.price) * 100,
        )
      : null;

  return (
    <div className="min-h-screen bg-cream">
      {/* Breadcrumb */}
      <div className="border-b border-sand bg-paper/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-ink-soft">
            <Link href="/" className="hover:text-wood">
              Kryefaqja
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-wood">
              Produktet
            </Link>
            <span>/</span>
            <Link
              href={`/shop?category=${product.category}`}
              className="hover:text-wood"
            >
              {categoryLabel(product.category)}
            </Link>
            <span>/</span>
            <span className="text-ink">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Product Info */}
        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Gallery */}
          <ProductGallery images={product.images} />

          {/* Info */}
          <div>
            {/* Title & Rating */}
            <div className="mb-4">
              <h1 className="mb-2 font-display text-3xl font-semibold text-ink">
                {product.name}
              </h1>

              <div className="flex items-center gap-4">
                {product.ratings?.count > 0 ? (
                  <div className="flex items-center gap-2">
                    <StarRating rating={product.ratings.average} />
                    <span className="text-sm text-ink-soft">
                      {product.ratings.average.toFixed(1)} (
                      {product.ratings.count} reviews)
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-ink-soft">Pa reviews ende</span>
                )}

                <span
                  className={`flex items-center gap-1 text-sm ${
                    product.stock > 0 ? "text-green-700" : "text-red-600"
                  }`}
                >
                  {product.stock > 0 ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                  {product.stock > 0 ? "Në stock" : "Nuk ka në stock"}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              {product.salePrice ? (
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-semibold text-ink">
                    ${product.salePrice}
                  </span>
                  <span className="text-xl text-ink-soft/70 line-through">
                    ${product.price}
                  </span>
                  {discountPercentage !== null && (
                    <span className="rounded-full bg-ink px-2.5 py-1 text-sm font-medium text-white">
                      -{discountPercentage}%
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-4xl font-semibold text-ink">
                  ${product.price}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="prose prose-sm mb-6 max-w-none">
              <p className="text-ink-soft">{product.description}</p>
            </div>

            {/* Meta Info */}
            <div className="mb-6 space-y-2 border-y border-sand py-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-ink-soft">Kategoria:</span>
                <Link
                  href={`/shop?category=${product.category}`}
                  className="text-sm text-wood hover:text-wood-dark"
                >
                  {categoryLabel(product.category)}
                </Link>
              </div>
              {product.brand && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-ink-soft">Brand:</span>
                  <span className="text-sm text-ink">{product.brand}</span>
                </div>
              )}
              {product.sku && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-ink-soft">SKU:</span>
                  <span className="text-sm text-ink">{product.sku}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mb-6 flex items-center gap-4">
              <AddToCartButton
                product={product}
                disabled={product.stock <= 0}
                className="flex-1"
              />
              <AddToWishlistButton productId={product._id} />
            </div>

            {/* Features */}
            <div className="rounded-2xl border border-sand bg-paper p-4">
              <h3 className="mb-3 font-display font-medium text-ink">
                Karakteristikat
              </h3>
              <ul className="space-y-2 text-sm text-ink-soft">
                {FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-5 w-5 shrink-0 text-wood" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewsSection
          productSlug={product.slug}
          productId={product._id}
          reviewStats={reviewStats}
          initialReviews={reviews}
          initialUserReview={userReview}
          hasPurchased={hasPurchased}
        />

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-6 font-display text-2xl font-semibold text-ink">
              Produkte të Ngjashme
            </h2>
            <ProductGrid products={relatedProducts} />
          </section>
        )}
      </div>
    </div>
  );
}
