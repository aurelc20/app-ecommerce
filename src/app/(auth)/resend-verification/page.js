// src/app/(auth)/resend-verification/page.js
"use client";

import { useState } from "react";
import Link from "next/link";
import { resendVerificationEmail } from "@/actions/authActions";
import { Loader2, MailCheck } from "lucide-react";
import Eyebrow from "@/components/Eyebrow";

export default function ResendVerificationPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await resendVerificationEmail({ email });

      if (result.success) {
        setSent(result.message);
      } else {
        setError(result.error || "Ndodhi një gabim");
      }
    } catch (err) {
      console.error("Resend verification error:", err);
      setError("Serveri nuk u përgjigj. Rifresko faqen dhe provo sërish.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <Eyebrow className="mb-4">Verifikim</Eyebrow>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Ridërgo verifikimin
          </h1>
          <p className="mt-2 text-ink-soft">
            Nuk e ke marrë email-in, ose linku ka skaduar? Shkruaj email-in
            tënd dhe të dërgojmë një të ri
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-sand bg-paper p-8 shadow-xl shadow-ink/10">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
                <MailCheck className="h-8 w-8" strokeWidth={1.75} />
              </div>
              <p className="mt-4 text-sm text-ink">{sent}</p>
              <p className="mt-2 text-xs text-ink-soft">
                Linku skadon pas 24 orësh. Kontrollo edhe dosjen e spam-it.
              </p>
              <Link
                href="/login"
                className="mt-6 inline-block text-sm font-medium text-wood hover:text-wood-dark"
              >
                Kthehu te kyçja
              </Link>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-ink"
                >
                  Email-i
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-sand bg-cream/40 px-4 py-2.5 text-ink placeholder:text-ink-soft/60 transition focus:border-wood focus:outline-none focus:ring-2 focus:ring-wood/20"
                  placeholder="email@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-wood py-3 font-semibold text-white transition hover:bg-wood-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Duke dërguar...
                  </>
                ) : (
                  "Dërgo linkun"
                )}
              </button>

              <p className="text-center text-sm text-ink-soft">
                E ke verifikuar tashmë?{" "}
                <Link
                  href="/login"
                  className="font-medium text-wood hover:text-wood-dark"
                >
                  Kyçu
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
