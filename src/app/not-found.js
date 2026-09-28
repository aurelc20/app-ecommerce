// src/app/not-found.js
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Eyebrow from "@/components/Eyebrow";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-20">
      <div className="w-full max-w-md text-center">
        <Eyebrow className="mb-4">Gabim 404</Eyebrow>
        <p className="font-display text-7xl font-semibold text-ink">404</p>
        <h1 className="mt-4 font-display text-2xl font-semibold text-ink">
          Faqja nuk u gjet
        </h1>
        <p className="mt-3 text-ink-soft">
          Faqja që po kërkon mund të jetë hequr, riemërtuar, ose nuk ka
          ekzistuar kurrë.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-wood px-6 py-3 font-medium text-white transition hover:bg-wood-dark"
          >
            Kthehu në Kryefaqe
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full border border-sand px-6 py-3 font-medium text-ink transition hover:bg-sand/50"
          >
            Shiko Produktet
          </Link>
        </div>
      </div>
    </div>
  );
}
