"use client";

import { useState } from "react";
import Image from "next/image";

// `size` eshte burimi i vetem i dimensionit: ushqen width/height te
// next/image dhe njekohesisht madhesine e rrethit fallback, keshtu qe ato
// nuk mund te shkeputen nga njera-tjetra. `className` mbetet per stilime
// shtese, p.sh. madhesine e shkronjes se inicialit.
export default function UserAvatar({ src, name, size = 32, className = "" }) {
  const [imageError, setImageError] = useState(false);

  const initial = name?.charAt(0).toUpperCase() || "U";

  if (!src || imageError) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`flex shrink-0 items-center justify-center rounded-full bg-purple-600 font-bold text-white ${className}`}
        aria-label={name || "Profili"}
      >
        {initial}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={name || "Profili"}
      width={size}
      height={size}
      onError={() => setImageError(true)}
      className={`shrink-0 rounded-full object-cover ${className}`}
    />
  );
}
