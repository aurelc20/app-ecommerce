// src/components/ReviewsSection.js
"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, LogIn } from "lucide-react";
import {
  getProductReviews,
  addReview,
  updateReview,
  markReviewHelpful,
} from "@/actions/reviewActions";
import StarRating from "@/components/StarRating";
import ReviewForm from "@/components/ReviewForm";
import ReviewCard from "@/components/ReviewCard";
import RatingDistribution from "@/components/RatingDistribution";

export default function ReviewsSection({
  productId,
  productSlug,
  reviewStats,
  initialReviews,
  initialUserReview,
  hasPurchased,
}) {
  const [reviews, setReviews] = useState(initialReviews || []);
  const [userReview, setUserReview] = useState(initialUserReview || null);
  const [showForm, setShowForm] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  const isLoggedIn = hasPurchased !== null || !!userReview;
  const canWriteNewReview = hasPurchased === true;

  const refreshReviews = async () => {
    const { reviews: newReviews } = await getProductReviews(productId, {
      limit: 5,
    });
    setReviews(newReviews);
  };

  const handleSubmitReview = async (formData) => {
    const result = userReview
      ? await updateReview(userReview._id, formData)
      : await addReview({ ...formData, productId });

    if (result.success) {
      setShowForm(false);
      setUserReview(result.review);
      await refreshReviews();
    }

    return result;
  };

  const handleHelpful = async (reviewId) => {
    const result = await markReviewHelpful(reviewId);

    if (result.success) {
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === reviewId
            ? { ...review, helpful: result.helpful }
            : review,
        ),
      );
    }
  };

  return (
    <section className="border-t border-sand pt-8">
      <h2 className="mb-6 font-display text-2xl font-semibold text-ink">
        Reviews e Klientëve
      </h2>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Stats */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-sand bg-paper p-6">
            <h3 className="mb-4 font-display text-lg font-medium text-ink">
              Përmbledhja
            </h3>

            <RatingDistribution stats={reviewStats} />

            {userReview ? (
              <button
                onClick={() => setShowForm(!showForm)}
                className="mt-6 w-full rounded-full bg-wood py-3 font-semibold text-white transition hover:bg-wood-dark"
              >
                {showForm ? "Mbyll formularin" : "Redakto review-n tënde"}
              </button>
            ) : !isLoggedIn ? (
              <Link
                href={`/login?callbackUrl=/product/${productSlug}`}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-sand py-3 font-semibold text-ink transition hover:bg-sand/60"
              >
                <LogIn className="h-4 w-4" />
                Kyçu për të lënë review
              </Link>
            ) : !canWriteNewReview ? (
              <div className="mt-6 flex items-start gap-2 rounded-xl bg-sand/50 p-3 text-sm text-ink-soft">
                <Lock className="mt-0.5 h-4 w-4 shrink-0" />
                Duhet ta kesh blerë këtë produkt për të lënë një review.
              </div>
            ) : (
              <button
                onClick={() => setShowForm(!showForm)}
                className="mt-6 w-full rounded-full bg-wood py-3 font-semibold text-white transition hover:bg-wood-dark"
              >
                {showForm ? "Mbyll formularin" : "Shkruaj një review"}
              </button>
            )}
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2">
          {showForm && (userReview || canWriteNewReview) && (
            <div className="mb-8">
              <ReviewForm
                onSubmit={handleSubmitReview}
                onCancel={() => setShowForm(false)}
                initialData={userReview}
                isEditing={!!userReview}
              />
            </div>
          )}

          {/* Sort */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-ink-soft">
              <span className="font-semibold text-ink">
                {reviewStats.total}
              </span>{" "}
              reviews
            </p>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-sand bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-wood focus:ring-2 focus:ring-wood/20"
            >
              <option value="newest">Më të rejat</option>
              <option value="helpful">Më të dobishmet</option>
              <option value="rating-high">Rating: Lart</option>
              <option value="rating-low">Rating: Poshtë</option>
            </select>
          </div>

          {/* Reviews */}
          <div className="space-y-6">
            {reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  onHelpful={() => handleHelpful(review._id)}
                />
              ))
            ) : (
              <div className="py-12 text-center">
                <p className="text-ink-soft">
                  Nuk ka ende reviews për këtë produkt
                </p>
                {!userReview && canWriteNewReview && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="mt-4 font-medium text-wood hover:text-wood-dark"
                  >
                    Bëhu i pari që shkruan review
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
