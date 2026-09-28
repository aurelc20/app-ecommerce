// src/app/global-error.js
"use client";

import { Geist, Playfair_Display } from "next/font/google";
import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="flex min-h-full items-center justify-center bg-cream px-4 py-20 text-ink">
        <div className="w-full max-w-md rounded-2xl border border-sand bg-paper p-8 text-center shadow-xl shadow-ink/10">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertTriangle className="h-8 w-8" strokeWidth={1.75} />
          </div>

          <h1 className="mb-3 font-display text-2xl font-semibold text-ink">
            Ndodhi një gabim i papritur
          </h1>
          <p className="mb-8 text-ink-soft">
            Diçka shkoi keq gjatë ngarkimit të faqes. Provo sërish ose
            kthehu në kryefaqe.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={reset}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-wood px-4 py-3 font-semibold text-white transition hover:bg-wood-dark"
            >
              <RotateCcw className="h-4 w-4" />
              Provo sërish
            </button>

            <a
              href="/"
              className="inline-flex w-full items-center justify-center rounded-full border border-sand px-4 py-3 font-medium text-ink transition hover:bg-sand/50"
            >
              Kthehu në Kryefaqe
            </a>
          </div>

          {error?.digest && (
            <p className="mt-6 text-xs text-ink-soft/70">
              Kodi i gabimit: <span className="font-mono">{error.digest}</span>
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
