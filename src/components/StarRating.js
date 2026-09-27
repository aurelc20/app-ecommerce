// src/components/StarRating.js
"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export default function StarRating({
  rating,
  interactive = false,
  onRatingChange,
}) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? "button" : "button"}
          disabled={!interactive}
          onClick={() => interactive && onRatingChange?.(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          className={`${interactive ? "cursor-pointer hover:scale-110 transition" : "cursor-default"}`}
        >
          <Star
            className={`h-5 w-5 fill-current ${
              star <= (hoverRating || rating) ? "text-yellow-400" : "text-sand"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
