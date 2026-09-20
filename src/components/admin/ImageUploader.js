// src/components/admin/ImageUploader.js
"use client";

import { useState } from "react";
import Image from "next/image";

export default function ImageUploader({ images = [], onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");

    const uploadedImages = [];
    const failures = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (!file.type.startsWith("image/")) {
          failures.push(`${file.name}: nuk është imazh`);
          continue;
        }

        if (file.size > 5 * 1024 * 1024) {
          failures.push(`${file.name}: më i madh se 5MB`);
          continue;
        }

        // Ngarkimi shkon direkt në Cloudinary përmes /api/upload. Në dokument
        // ruhet vetëm URL-ja dhe public_id-ja, jo vetë imazhi.
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);
        uploadFormData.append("kind", "product");

        const res = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });
        const result = await res.json();

        if (!result.success) {
          failures.push(`${file.name}: ${result.error || "upload dështoi"}`);
          continue;
        }

        uploadedImages.push({
          url: result.url,
          publicId: result.publicId,
          alt: file.name,
          isPrimary: images.length === 0 && uploadedImages.length === 0,
        });
      }

      if (uploadedImages.length > 0) {
        onChange([...images, ...uploadedImages]);
      }

      if (failures.length > 0) {
        setError(failures.join(" • "));
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Ndodhi një gabim gjatë uploadimit");
    } finally {
      setUploading(false);
      // Lejo rizgjedhjen e të njëjtit skedar pas një dështimi
      e.target.value = "";
    }
  };

  const handleRemove = (index) => {
    const newImages = images.filter((_, i) => i !== index);

    // Nëse u hoq imazhi kryesor, bëje të parin kryesor
    if (newImages.length > 0 && !newImages.some((img) => img.isPrimary)) {
      newImages[0] = { ...newImages[0], isPrimary: true };
    }

    onChange(newImages);
  };

  const handleSetPrimary = (index) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    onChange(newImages);
  };

  const handleReorder = (fromIndex, toIndex) => {
    const newImages = [...images];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition">
        <input
          type="file"
          id="image-upload"
          multiple
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />

        <label htmlFor="image-upload" className="cursor-pointer">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            {uploading ? "Duke uploaduar..." : "Click për të uploaduar imazhe"}
          </p>
          <p className="text-xs text-gray-500">PNG, JPG, GIF deri në 5MB</p>
        </label>
      </div>

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={image.publicId || image.url || index}
              className={`group relative aspect-square rounded-lg overflow-hidden border-2 ${
                image.isPrimary ? "border-purple-600" : "border-gray-200"
              }`}
            >
              <Image
                src={image.url}
                alt={image.alt || `Product image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />

              {/* Badges */}
              {image.isPrimary && (
                <span className="absolute top-1 left-1 bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium">
                  Primary
                </span>
              )}

              {/* Actions */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition group-hover:bg-black/50 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => handleSetPrimary(index)}
                  disabled={image.isPrimary}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 disabled:opacity-50"
                  title="Set si primary"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  title="Hiq"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Reorder Arrows */}
              <div className="absolute bottom-1 right-1 flex gap-1 opacity-0 transition group-hover:opacity-100">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleReorder(index, index - 1)}
                    className="p-1 bg-white rounded shadow hover:bg-gray-100"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                )}
                {index < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => handleReorder(index, index + 1)}
                    className="p-1 bg-white rounded shadow hover:bg-gray-100"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Helper Text */}
      <p className="text-xs text-gray-500">
        💡 Këshillë: Imazhi i parë do të jetë imazhi kryesor. Uploado së pari
        imazhin që dëshiron të jetë primary.
      </p>
    </div>
  );
}
