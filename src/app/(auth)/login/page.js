// src/app/(auth)/login/page.js
"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import Eyebrow from "@/components/Eyebrow";

// NextAuth kthen kodin e vet te brendshem; pa kete harte perdoruesi lexon
// literalisht "CredentialsSignin". Nje mesazh i vetem mbulon fjalekalimin e
// gabuar dhe email-in e paverifikuar, pa i dalluar, ndaj nuk zbulon nese
// llogaria ekziston.
const AUTH_ERRORS = {
  CredentialsSignin:
    "Email-i ose fjalëkalimi është gabim. Nëse sapo je regjistruar, verifiko më parë email-in.",
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false, // Vendos remember
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Lexo "remember me" cookie kur komponenti mountohet
  useEffect(() => {
    const rememberedEmail = Cookies.get("remember_email");
    if (rememberedEmail) {
      // js-cookie prek document, ndaj leximi duhet te ndodhe pas hidratimit.
      // Nje inicializues i voneshem te useState do ta lexonte gjate render-it,
      // ku serveri do te jepte fushe bosh dhe klienti email - mosperputhje
      // hidratimi. Efekti eshte vendi i duhur ketu.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData((prev) => ({
        ...prev,
        email: rememberedEmail,
        remember: true,
      }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 6) {
      setError("Fjalekalimi duhet te kete se paku 6 karaktere.");
      return;
    }

    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(AUTH_ERRORS[result.error] || "Kyçja dështoi. Provo sërish.");
      } else {
        // Ruaj email-in në cookie nëse "remember" është i zgjedhur
        if (formData.remember) {
          Cookies.set("remember_email", formData.email, {
            expires: 30, // 30 ditë
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
          });
        } else {
          // Hiqe cookie nëse nuk është i zgjedhur
          Cookies.remove("remember_email", { path: "/" });
        }

        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError("Ndodhi një gabim. Provo sërish.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center">
          <Eyebrow className="mb-4">Hyrje</Eyebrow>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Mirësevini përsëri
          </h1>
          <p className="mt-2 text-ink-soft">
            Hyni në llogarinë tuaj për të vazhduar
          </p>
        </div>

        {/* Form */}
        <div className="mt-8 rounded-2xl border border-sand bg-paper p-8 shadow-xl shadow-ink/10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                {error}
                <Link
                  href="/resend-verification"
                  className="mt-2 block font-medium underline hover:no-underline"
                >
                  Ridërgo email-in e verifikimit
                </Link>
              </div>
            )}

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
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full rounded-xl border border-sand bg-cream/40 px-4 py-2.5 text-ink placeholder:text-ink-soft/60 transition focus:border-wood focus:outline-none focus:ring-2 focus:ring-wood/20"
                placeholder="******"
              />
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label
                htmlFor="remember-me"
                className="flex items-center gap-2 text-sm text-ink-soft"
              >
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={formData.remember}
                  onChange={(e) =>
                    setFormData({ ...formData, remember: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-sand accent-wood focus:ring-2 focus:ring-wood/20"
                />
                Më mbaj mend
              </label>

              <Link
                href="/forgot-password"
                className="text-sm font-medium text-wood hover:text-wood-dark"
              >
                Harrove fjalëkalimin?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-wood py-3 font-semibold text-white transition hover:bg-wood-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Duke u kyçur...
                </>
              ) : (
                "Hyni"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-sand" />
              <span className="text-xs font-medium tracking-wide text-ink-soft uppercase">
                Ose vazhdo me
              </span>
              <div className="h-px flex-1 bg-sand" />
            </div>

            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              className="mt-4 flex w-full items-center justify-center gap-3 rounded-full border border-sand bg-paper py-2.5 text-sm font-medium text-ink transition hover:bg-sand/50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
          </div>

          {/* Register Link */}
          <p className="mt-6 text-center text-sm text-ink-soft">
            Nuk ke llogari?{" "}
            <Link
              href="/register"
              className="font-medium text-wood hover:text-wood-dark"
            >
              Regjistrohu tani
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
