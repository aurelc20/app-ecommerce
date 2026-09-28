// src/app/(admin)/admin/reviews/page.js
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Review from "@/models/Review";
import DeleteReviewButton from "@/components/admin/DeleteReviewButton";
import Image from "next/image";
import { CheckCircle2, Star, ThumbsUp } from "lucide-react";

export default async function AdminReviewsPage({ searchParams }) {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  const { page = "1", rating = "", product = "" } = await searchParams;

  await dbConnect();

  const query = {};

  if (rating) {
    query.rating = parseInt(rating);
  }

  if (product) {
    query.product = product;
  }

  const limit = 20;
  const skip = (parseInt(page) - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name email avatar")
      .populate("product", "name images")
      .lean(),
    Review.countDocuments(query),
  ]);

  const avgRating = await Review.aggregate([
    { $group: { _id: null, avg: { $avg: "$rating" } } },
  ]);

  const ratingDistribution = await Promise.all([
    Review.countDocuments({ rating: 5 }),
    Review.countDocuments({ rating: 4 }),
    Review.countDocuments({ rating: 3 }),
    Review.countDocuments({ rating: 2 }),
    Review.countDocuments({ rating: 1 }),
  ]);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-ink">
          Reviews
        </h1>
        <p className="mt-2 text-ink-soft">Moderato reviews e klientëve</p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-sand bg-paper p-6 shadow-sm">
          <p className="mb-2 text-sm text-ink-soft">Total Reviews</p>
          <p className="text-3xl font-bold text-ink">{total}</p>
        </div>
        <div className="rounded-xl border border-sand bg-paper p-6 shadow-sm">
          <p className="mb-2 text-sm text-ink-soft">Rating Mesatar</p>
          <p className="flex items-center gap-2 text-3xl font-bold text-yellow-600">
            {avgRating[0]?.avg.toFixed(1) || "0.0"}
            <Star className="h-6 w-6 fill-current" />
          </p>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-6 rounded-xl border border-sand bg-paper p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <a
            href="/admin/reviews"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              !rating
                ? "bg-wood text-white"
                : "bg-sand text-ink-soft hover:bg-sand/70"
            }`}
          >
            Të gjitha ({total})
          </a>
          {[5, 4, 3, 2, 1].map((star, index) => (
            <a
              key={star}
              href={`/admin/reviews?rating=${star}`}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition ${
                rating === star.toString()
                  ? "bg-wood text-white"
                  : "bg-sand text-ink-soft hover:bg-sand/70"
              }`}
            >
              <span>{star}</span>
              <Star className="h-3.5 w-3.5 fill-current" />
              <span>({ratingDistribution[index]})</span>
            </a>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="rounded-xl border border-sand bg-paper p-6 shadow-sm"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                {review.user?.avatar ? (
                  <Image
                    src={review.user.avatar}
                    alt={review.user.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-wood text-white font-bold">
                    {review.user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-ink">
                    {review.user?.name || "Anonim"}
                  </p>
                  <p className="text-xs text-ink-soft">
                    {review.user?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex text-yellow-400">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </span>
                <DeleteReviewButton reviewId={review._id.toString()} />
              </div>
            </div>

            <div className="mb-3">
              <p className="mb-1 text-sm text-ink-soft">
                Produkti:{" "}
                <span className="font-medium text-wood">
                  {review.product?.name}
                </span>
              </p>
              <h3 className="font-semibold text-ink">{review.title}</h3>
              <p className="mt-1 text-ink-soft">{review.comment}</p>
            </div>

            <div className="flex items-center gap-4 text-xs text-ink-soft">
              <span>
                {new Date(review.createdAt).toLocaleDateString("sq-AL")}
              </span>
              {review.isVerifiedPurchase && (
                <span className="flex items-center gap-1 font-medium text-green-600">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Blerje e verifikuar
                </span>
              )}
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-3.5 w-3.5" />
                {review.helpful || 0} helpful
              </span>
            </div>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="rounded-xl border border-sand bg-paper p-12 text-center shadow-sm">
            <p className="text-ink-soft">Nuk ka reviews për këtë filtër</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {total > limit && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {parseInt(page) > 1 && (
            <a
              href={`/admin/reviews?page=${parseInt(page) - 1}${rating ? `&rating=${rating}` : ""}`}
              className="rounded-lg border border-sand bg-paper px-4 py-2 text-sm hover:bg-sand/40"
            >
              ← Prapa
            </a>
          )}
          {skip + limit < total && (
            <a
              href={`/admin/reviews?page=${parseInt(page) + 1}${rating ? `&rating=${rating}` : ""}`}
              className="rounded-lg border border-sand bg-paper px-4 py-2 text-sm hover:bg-sand/40"
            >
              Para →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
