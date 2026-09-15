// src/components/ReviewsSection.js
"use client";

import { useState } from "react";
import {
  getProductReviews,
  addReview,
  markReviewHelpful,
} from "@/actions/reviewActions";
import StarRating from "@/components/StarRating";
import ReviewForm from "@/components/ReviewForm";
import ReviewCard from "@/components/ReviewCard";
import RatingDistribution from "@/components/RatingDistribution";

export default function ReviewsSection({
  productId,
  reviewStats,
  initialReviews,
}) {
  const [reviews, setReviews] = useState(initialReviews || []);
  const [showForm, setShowForm] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  const handleAddReview = async (formData) => {
    const result = await addReview({ ...formData, productId });

    if (result.success) {
      setShowForm(false);
      // Refresh reviews
      const { reviews: newReviews } = await getProductReviews(productId, {
        limit: 5,
      });
      setReviews(newReviews);
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
    <section className="border-t pt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Reviews e Klientëve
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
            <h3 className="text-lg font-semibold mb-4">Përmbledhja</h3>

            <RatingDistribution stats={reviewStats} />

            <button
              onClick={() => setShowForm(!showForm)}
              className="w-full mt-6 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              {showForm ? "Mbyll formularin" : "Shkruaj një review"}
            </button>
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2">
          {showForm && (
            <div className="mb-8">
              <ReviewForm
                onSubmit={handleAddReview}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}

          {/* Sort */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              <span className="font-semibold">{reviewStats.total}</span> reviews
            </p>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
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
              <div className="text-center py-12">
                <p className="text-gray-600">
                  Nuk ka ende reviews për këtë produkt
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
                >
                  Bëhu i pari që shkruan review
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
