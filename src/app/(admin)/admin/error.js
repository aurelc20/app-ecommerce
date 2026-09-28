// src/app/(admin)/admin/error.js
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function AdminError({ error, reset }) {
  useEffect(() => {
    console.error("Admin panel error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-sand bg-paper p-8 text-center shadow-xl shadow-ink/10">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertTriangle className="h-8 w-8" strokeWidth={1.75} />
        </div>

        <h1 className="mb-3 font-display text-2xl font-semibold text-ink">
          Ndodhi një gabim
        </h1>
        <p className="mb-8 text-ink-soft">
          Diçka shkoi keq gjatë ngarkimit të kësaj faqeje në panelin e
          administrimit. Provo sërish ose kthehu te dashboard-i.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-wood px-4 py-3 font-semibold text-white transition hover:bg-wood-dark"
          >
            <RotateCcw className="h-4 w-4" />
            Provo sërish
          </button>

          <Link
            href="/admin"
            className="inline-flex w-full items-center justify-center rounded-full border border-sand px-4 py-3 font-medium text-ink transition hover:bg-sand/50"
          >
            Kthehu te Dashboard
          </Link>
        </div>

        {error?.digest && (
          <p className="mt-6 text-xs text-ink-soft/70">
            Kodi i gabimit: <span className="font-mono">{error.digest}</span>
          </p>
        )}
      </div>
    </div>
  );
}
