// src/components/ReviewForm.js
"use client";

import { useState } from "react";
import StarRating from "@/components/StarRating";

export default function ReviewForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    rating: 0,
    title: "",
    comment: "",
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
    <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">Shkruaj Review Tënde</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded text-sm">
          {error}
        </div>
      )}

      {/* Rating */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating
        </label>
        <div className="flex items-center gap-2">
          <StarRating
            rating={formData.rating}
            interactive
            onRatingChange={(rating) => setFormData({ ...formData, rating })}
          />
          <span className="text-sm text-gray-600">
            {formData.rating > 0 ? `${formData.rating} / 5` : "Zgjidh rating"}
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Titulli
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Përshkruaj përvojën tënde në një fjali"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
          maxLength={100}
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.title.length} / 100 karaktere
        </p>
      </div>

      {/* Comment */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Komenti
        </label>
        <textarea
          value={formData.comment}
          onChange={(e) =>
            setFormData({ ...formData, comment: e.target.value })
          }
          placeholder="Çfarë të pëlqeu ose nuk të pëlqeu te ky produkt?"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 min-h-30"
          maxLength={1000}
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.comment.length} / 1000 karaktere
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
        >
          {loading ? "Duke dërguar..." : "Dërgo Review"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition"
        >
          Anulo
        </button>
      </div>
    </form>
  );
}
