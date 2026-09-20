// src/app/(auth)/reset-password/page.js
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "@/actions/authActions";
import { CircleCheckBig, TriangleAlert } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Vendos një fjalëkalim të ri
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Zgjidh një fjalëkalim me së paku 6 karaktere
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg">
          {!token ? (
            <div className="text-center">
              <TriangleAlert className="mx-auto h-12 w-12 text-amber-500" />
              <p className="mt-4 text-sm text-gray-700">
                Ky link nuk përmban token. Sigurohu që e ke hapur linkun e plotë
                nga email-i.
              </p>
              <Link
                href="/forgot-password"
                className="mt-6 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Kërko një link të ri
              </Link>
            </div>
          ) : done ? (
            <div className="text-center">
              <CircleCheckBig className="mx-auto h-12 w-12 text-green-600" />
              <p className="mt-4 text-sm text-gray-700">{done}</p>
              <Link
                href="/login"
                className="mt-6 inline-block w-full py-2 px-4 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Kyçu
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
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? "Duke ruajtur..." : "Rivendos fjalëkalimin"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
