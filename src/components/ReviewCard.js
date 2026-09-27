import Image from "next/image";
import { BadgeCheck, ThumbsUp } from "lucide-react";
import StarRating from "@/components/StarRating";

const ALBANIAN_MONTHS = [
  "janar",
  "shkurt",
  "mars",
  "prill",
  "maj",
  "qershor",
  "korrik",
  "gusht",
  "shtator",
  "tetor",
  "nëntor",
  "dhjetor",
];

// Formatim manual (jo Intl/toLocaleDateString) sepse ICU-ja e "sq-AL" nuk
// është domosdoshmërisht e njëjtë mes Node (server) dhe browser-it (client),
// gjë që shkakton hydration mismatch pasi ReviewCard renderohet nga
// ReviewsSection ("use client") në të dyja anët.
function formatAlbanianDate(date) {
  const d = new Date(date);
  return `${d.getDate()} ${ALBANIAN_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export default function ReviewCard({ review, onHelpful }) {
  return (
    <div className="rounded-2xl border border-sand bg-paper p-6">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
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
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-wood font-bold text-white">
              {review.user?.name?.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <p className="font-semibold text-ink">
              {review.user?.name || "Anonim"}
            </p>
            <p className="text-sm text-ink-soft">
              {formatAlbanianDate(review.createdAt)}
            </p>
          </div>
        </div>

        <StarRating rating={review.rating} />
      </div>

      {/* Content */}
      <h4 className="mb-2 font-semibold text-ink">{review.title}</h4>
      <p className="mb-4 text-ink-soft">{review.comment}</p>

      {/* Verified Purchase Badge */}
      {review.isVerifiedPurchase && (
        <div className="mb-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs text-green-700">
            <BadgeCheck className="h-4 w-4" />
            Blerje e verifikuar
          </span>
        </div>
      )}

      {/* Helpful */}
      <div className="flex items-center gap-4 border-t border-sand pt-4">
        <button
          onClick={onHelpful}
          className="flex items-center gap-2 text-sm text-ink-soft transition hover:text-wood"
        >
          <ThumbsUp className="h-4 w-4" />
          Helpful ({review.helpful || 0})
        </button>
      </div>
    </div>
  );
}
