// src/components/ReviewCard.js
import Image from "next/image";
import StarRating from "@/components/StarRating";

export default function ReviewCard({ review, onHelpful }) {
  return (
    <div className="bg-white border rounded-lg p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {review.user?.avatar ? (
            <Image
              src={review.user.avatar}
              alt={review.user.name}
              width={40}
              height={40}
              className="rounded-full"
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
            <p className="text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString("sq-AL", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <StarRating rating={review.rating} />
      </div>

      {/* Content */}
      <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
      <p className="text-gray-700 mb-4">{review.comment}</p>

      {/* Verified Purchase Badge */}
      {review.isVerifiedPurchase && (
        <div className="mb-4">
          <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Blerje e verifikuar
          </span>
        </div>
      )}

      {/* Helpful */}
      <div className="flex items-center gap-4 pt-4 border-t">
        <button
          onClick={onHelpful}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
            />
          </svg>
          Helpful ({review.helpful || 0})
        </button>
      </div>
    </div>
  );
}
