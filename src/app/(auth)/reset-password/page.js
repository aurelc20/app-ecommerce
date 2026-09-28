// src/app/(auth)/reset-password/page.js
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "@/actions/authActions";
import { CircleCheckBig, Loader2, TriangleAlert } from "lucide-react";
import Eyebrow from "@/components/Eyebrow";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Fjalëkalimet nuk përputhen");
      return;
    }

    if (formData.password.length < 6) {
      setError("Fjalëkalimi duhet të jetë së paku 6 karaktere");
      return;
    }

    setLoading(true);

    try {
      const result = await resetPassword({
        token,
        password: formData.password,
      });

      if (result.success) {
        setDone(result.message);
      } else {
        setError(result.error || "Ndodhi një gabim");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setError("Serveri nuk u përgjigj. Rifresko faqen dhe provo sërish.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <Eyebrow className="mb-4">Rivendos</Eyebrow>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Vendos një fjalëkalim të ri
          </h1>
          <p className="mt-2 text-ink-soft">
            Zgjidh një fjalëkalim me së paku 6 karaktere
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-sand bg-paper p-8 shadow-xl shadow-ink/10">
          {!token ? (
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-500">
                <TriangleAlert className="h-8 w-8" strokeWidth={1.75} />
              </div>
              <p className="mt-4 text-sm text-ink">
                Ky link nuk përmban token. Sigurohu që e ke hapur linkun e
                plotë nga email-i.
              </p>
              <Link
                href="/forgot-password"
                className="mt-6 inline-block text-sm font-medium text-wood hover:text-wood-dark"
              >
                Kërko një link të ri
              </Link>
            </div>
          ) : done ? (
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
                <CircleCheckBig className="h-8 w-8" strokeWidth={1.75} />
              </div>
              <p className="mt-4 text-sm text-ink">{done}</p>
              <Link
                href="/login"
                className="mt-6 flex w-full items-center justify-center rounded-full bg-wood py-3 font-semibold text-white transition hover:bg-wood-dark"
              >
                Kyçu
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
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-ink"
                >
                  Fjalëkalimi i ri
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full rounded-xl border border-sand bg-cream/40 px-4 py-2.5 text-ink placeholder:text-ink-soft/60 transition focus:border-wood focus:outline-none focus:ring-2 focus:ring-wood/20"
                  placeholder="••••••"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1.5 block text-sm font-medium text-ink"
                >
                  Konfirmo fjalëkalimin
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-sand bg-cream/40 px-4 py-2.5 text-ink placeholder:text-ink-soft/60 transition focus:border-wood focus:outline-none focus:ring-2 focus:ring-wood/20"
                  placeholder="••••••"
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
                    Duke ruajtur...
                  </>
                ) : (
                  "Rivendos fjalëkalimin"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
