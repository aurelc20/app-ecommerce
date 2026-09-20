// src/app/(auth)/resend-verification/page.js
"use client";

import { useState } from "react";
import Link from "next/link";
import { resendVerificationEmail } from "@/actions/authActions";
import { MailCheck } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Ridërgo verifikimin
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Nuk e ke marrë email-in, ose linku ka skaduar? Shkruaj email-in tënd
            dhe të dërgojmë një të ri
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg">
          {sent ? (
            <div className="text-center">
              <MailCheck className="mx-auto h-12 w-12 text-green-600" />
              <p className="mt-4 text-sm text-gray-700">{sent}</p>
              <p className="mt-2 text-xs text-gray-500">
                Linku skadon pas 24 orësh. Kontrollo edhe dosjen e spam-it.
              </p>
              <Link
                href="/login"
                className="mt-6 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Kthehu te kyçja
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="email@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? "Duke dërguar..." : "Dërgo linkun"}
              </button>

              <p className="text-center text-sm text-gray-600">
                E ke verifikuar tashmë?{" "}
                <Link
                  href="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
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
