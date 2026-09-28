// src/app/(auth)/register/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { registerUser } from "@/actions/authActions";
import Eyebrow from "@/components/Eyebrow";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate
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
      const result = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        router.push("/login?registered=true");
      } else {
        setError(result.error || "Regjistrimi dështoi");
      }
    } catch (err) {
      setError("Ndodhi një gabim. Provo sërish.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <Eyebrow className="mb-4">Regjistrim</Eyebrow>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Krijo llogari të re
          </h1>
          <p className="mt-2 text-ink-soft">Fillo shopping-un tënd sot</p>
        </div>

        <div className="mt-8 rounded-2xl border border-sand bg-paper p-8 shadow-xl shadow-ink/10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-ink"
              >
                Emri i plotë
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full rounded-xl border border-sand bg-cream/40 px-4 py-2.5 text-ink placeholder:text-ink-soft/60 transition focus:border-wood focus:outline-none focus:ring-2 focus:ring-wood/20"
                placeholder="Emri Mbiemri"
              />
            </div>

            {/* Email */}
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
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full rounded-xl border border-sand bg-cream/40 px-4 py-2.5 text-ink placeholder:text-ink-soft/60 transition focus:border-wood focus:outline-none focus:ring-2 focus:ring-wood/20"
                placeholder="email@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-ink"
              >
                Fjalëkalimi
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full rounded-xl border border-sand bg-cream/40 px-4 py-2.5 text-ink placeholder:text-ink-soft/60 transition focus:border-wood focus:outline-none focus:ring-2 focus:ring-wood/20"
                placeholder="******"
              />
            </div>

            {/* Confirm Password */}
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
                required
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full rounded-xl border border-sand bg-cream/40 px-4 py-2.5 text-ink placeholder:text-ink-soft/60 transition focus:border-wood focus:outline-none focus:ring-2 focus:ring-wood/20"
                placeholder="******"
              />
            </div>

            {/* Terms */}
            <label
              htmlFor="terms"
              className="flex items-start gap-2 text-sm text-ink-soft"
            >
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="mt-0.5 h-4 w-4 rounded border-sand accent-wood focus:ring-2 focus:ring-wood/20"
              />
              <span>
                Pranoj{" "}
                <Link
                  href="/terms"
                  className="font-medium text-wood hover:text-wood-dark"
                >
                  Termat dhe Kushtet
                </Link>{" "}
                dhe{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-wood hover:text-wood-dark"
                >
                  Politikën e Privatësisë
                </Link>
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-wood py-3 font-semibold text-white transition hover:bg-wood-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Duke u regjistruar...
                </>
              ) : (
                "Regjistrohu"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-soft">
            Ke tashmë llogari?{" "}
            <Link
              href="/login"
              className="font-medium text-wood hover:text-wood-dark"
            >
              Hynu këtu
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
