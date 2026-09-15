"use client";

import { useState } from "react";

export default function UserAvatar({ src, name }) {
  const [imageError, setImageError] = useState(false);

  const initial = name?.charAt(0).toUpperCase() || "U";

  if (!src || imageError) {
    return (
      <div
        className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-white"
        aria-label={name || "Profili"}
      >
        {initial}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name || "Profili"}
      referrerPolicy="no-referrer"
      onError={() => setImageError(true)}
      className="h-8 w-8 rounded-full object-cover"
    />
  );
}
