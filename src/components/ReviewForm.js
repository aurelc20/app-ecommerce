// src/components/ReviewForm.js
"use client";

import { useState } from "react";
import StarRating from "@/components/StarRating";

export default function ReviewForm({
  onSubmit,
  onCancel,
  initialData = null,
  isEditing = false,
}) {
  const [formData, setFormData] = useState({
    rating: initialData?.rating || 0,
    title: initialData?.title || "",
    comment: initialData?.comment || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.rating === 0) {
      setError("Ju lutem zgjidhni një rating");
      return;
    }

    if (!formData.title.trim() || !formData.comment.trim()) {
      setError("Titulli dhe komenti janë të detyrueshëm");
      return;
    }

    setLoading(true);
    const result = await onSubmit(formData);

    if (!result.success) {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-sand bg-paper p-6"
    >
      <h3 className="mb-4 font-display text-xl font-semibold text-ink">
        {isEditing ? "Redakto Review-n Tënde" : "Shkruaj Review Tënde"}
      </h3>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Rating */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-ink">
          Rating
        </label>
        <div className="flex items-center gap-2">
          <StarRating
            rating={formData.rating}
            interactive
            onRatingChange={(rating) => setFormData({ ...formData, rating })}
          />
          <span className="text-sm text-ink-soft">
            {formData.rating > 0 ? `${formData.rating} / 5` : "Zgjidh rating"}
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-ink">
          Titulli
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Përshkruaj përvojën tënde në një fjali"
          className="w-full rounded-lg border border-sand bg-cream px-4 py-2 text-ink outline-none focus:border-wood focus:ring-2 focus:ring-wood/20"
          maxLength={100}
        />
        <p className="mt-1 text-xs text-ink-soft">
          {formData.title.length} / 100 karaktere
        </p>
      </div>

      {/* Comment */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-ink">
          Komenti
        </label>
        <textarea
          value={formData.comment}
          onChange={(e) =>
            setFormData({ ...formData, comment: e.target.value })
          }
          placeholder="Çfarë të pëlqeu ose nuk të pëlqeu te ky produkt?"
          className="min-h-30 w-full rounded-lg border border-sand bg-cream px-4 py-2 text-ink outline-none focus:border-wood focus:ring-2 focus:ring-wood/20"
          maxLength={1000}
        />
        <p className="mt-1 text-xs text-ink-soft">
          {formData.comment.length} / 1000 karaktere
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-full bg-wood py-2 font-semibold text-white transition hover:bg-wood-dark disabled:opacity-50"
        >
          {loading
            ? "Duke dërguar..."
            : isEditing
              ? "Përditëso Review"
              : "Dërgo Review"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-sand px-6 py-2 text-ink transition hover:bg-sand/60"
        >
          Anulo
        </button>
      </div>
    </form>
  );
}
