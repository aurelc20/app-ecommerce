// src/app/(admin)/admin/reviews/page.js
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Review from "@/models/Review";
import DeleteReviewButton from "@/components/admin/DeleteReviewButton";

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
        <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
        <p className="text-gray-600 mt-2">Moderato reviews e klientëve</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600 mb-2">Total Reviews</p>
          <p className="text-3xl font-bold text-gray-900">{total}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600 mb-2">Rating Mesatar</p>
          <p className="text-3xl font-bold text-yellow-600">
            {avgRating[0]?.avg.toFixed(1) || "0.0"} ⭐
          </p>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <a
            href="/admin/reviews"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              !rating
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Të gjitha ({total})
          </a>
          {[5, 4, 3, 2, 1].map((star, index) => (
            <a
              key={star}
              href={`/admin/reviews?rating=${star}`}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                rating === star.toString()
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {star} ⭐ ({ratingDistribution[index]})
            </a>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {review.user?.avatar ? (
                  <img
                    src={review.user.avatar}
                    alt={review.user.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                    {review.user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">
                    {review.user?.name || "Anonim"}
                  </p>
                  <p className="text-xs text-gray-500">{review.user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-yellow-400">
                  {"⭐".repeat(review.rating)}
                </span>
                <DeleteReviewButton reviewId={review._id.toString()} />
              </div>
            </div>

            <div className="mb-3">
              <p className="text-sm text-gray-500 mb-1">
                Produkti:{" "}
                <span className="text-purple-600 font-medium">
                  {review.product?.name}
                </span>
              </p>
              <h3 className="font-semibold text-gray-900">{review.title}</h3>
              <p className="text-gray-700 mt-1">{review.comment}</p>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>
                {new Date(review.createdAt).toLocaleDateString("sq-AL")}
              </span>
              {review.isVerifiedPurchase && (
                <span className="text-green-600 font-medium">
                  ✓ Blerje e verifikuar
                </span>
              )}
              <span>👍 {review.helpful || 0} helpful</span>
            </div>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <p className="text-gray-600">Nuk ka reviews për këtë filtër</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {total > limit && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {parseInt(page) > 1 && (
            <a
              href={`/admin/reviews?page=${parseInt(page) - 1}${rating ? `&rating=${rating}` : ""}`}
              className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 bg-white"
            >
              ← Prapa
            </a>
          )}
          {skip + limit < total && (
            <a
              href={`/admin/reviews?page=${parseInt(page) + 1}${rating ? `&rating=${rating}` : ""}`}
              className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 bg-white"
            >
              Para →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
