// src/app/unauthorized/page.js
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import Eyebrow from "@/components/Eyebrow";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-20">
      <div className="w-full max-w-md text-center">
        <Eyebrow className="mb-4">Qasje e Ndaluar</Eyebrow>

        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
          <ShieldAlert className="h-8 w-8" strokeWidth={1.75} />
        </div>

        <h1 className="font-display text-2xl font-semibold text-ink">
          Nuk ke qasje në këtë faqe
        </h1>
        <p className="mt-3 text-ink-soft">
          Llogaria jote nuk ka lejet e nevojshme për ta parë këtë seksion.
          Nëse mendon se kjo është gabim, kontakto administratorin.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full bg-wood px-6 py-3 font-medium text-white transition hover:bg-wood-dark"
          >
            Shko te Dashboard-i Im
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-sand px-6 py-3 font-medium text-ink transition hover:bg-sand/50"
          >
            Kthehu në Kryefaqe
          </Link>
        </div>
      </div>
    </div>
  );
}
