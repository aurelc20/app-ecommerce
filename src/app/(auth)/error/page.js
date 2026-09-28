// src/app/(auth)/error/page.js
import Link from "next/link";
import { AlertTriangle, XCircle, AlertCircle, ServerCrash } from "lucide-react";

export const metadata = {
  title: "Gabim - Ecommerce",
  description: "Ndodhi një gabim gjatë procesit të autentikimit",
};

const ERROR_MESSAGES = {
  "missing-token": {
    title: "Token mungon",
    description:
      "Linku i verifikimit nuk përmban një token të vlefshme. Sigurohu që ke klikuar linkun e plotë nga email-i.",
  },
  "invalid-token": {
    title: "Token i pavlefshme ose e skaduar",
    description:
      "Ky link verifikimi është ose i pasaktë ose ka skaduar. Linket e verifikimit janë të vlefshme për një periudhë të kufizuar kohore.",
  },
  timeout: {
    title: "Koha e kërkesës skadoi",
    description:
      "Serveri nuk u përgjigj brenda kohës së caktuar. Provo përsëri pas pak ose kontrollo lidhjen tënde të internetit.",
  },
  "connection-refused": {
    title: "Lidhja u refuzua",
    description:
      "Serveri nuk pranoi lidhjen. Mund të jetë i padisponueshëm ose i mbingarkuar. Provo përsëri më vonë.",
  },
  "server-error": {
    title: "Gabim në server",
    description:
      "Ndodhi një gabim i papritur në server. Provo përsëri pas pak, ose kontakto mbështetjen nëse problemi vazhdon.",
  },
  default: {
    title: "Ndodhi një gabim",
    description:
      "Diçka shkoi keq gjatë procesit të autentikimit. Provo përsëri ose kontakto mbështetjen.",
  },
};

const ERROR_ICONS = {
  "missing-token": {
    icon: AlertTriangle,
    bg: "bg-amber-50",
    color: "text-amber-500",
  },
  "invalid-token": {
    icon: XCircle,
    bg: "bg-red-50",
    color: "text-red-600",
  },
  timeout: {
    icon: AlertTriangle,
    bg: "bg-amber-50",
    color: "text-amber-500",
  },
  "connection-refused": {
    icon: ServerCrash,
    bg: "bg-red-50",
    color: "text-red-600",
  },
  "server-error": {
    icon: AlertCircle,
    bg: "bg-red-50",
    color: "text-red-600",
  },
  default: {
    icon: AlertCircle,
    bg: "bg-sand/70",
    color: "text-wood",
  },
};

function ErrorIcon({ reason }) {
  const {
    icon: Icon,
    bg,
    color,
  } = ERROR_ICONS[reason] || ERROR_ICONS.default;
  return (
    <div
      className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${bg} ${color}`}
    >
      <Icon className="h-8 w-8" strokeWidth={1.75} />
    </div>
  );
}

export default async function AuthErrorPage({ searchParams }) {
  const { reason = "" } = await searchParams;
  const errorInfo = ERROR_MESSAGES[reason] || ERROR_MESSAGES.default;

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-sand bg-paper p-8 text-center shadow-xl shadow-ink/10">
          {/* Icon */}
          <ErrorIcon reason={reason} />

          {/* Title & Description */}
          <h1 className="mb-3 font-display text-2xl font-semibold text-ink">
            {errorInfo.title}
          </h1>
          <p className="mb-8 text-ink-soft">{errorInfo.description}</p>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            {/* Vetem kur problemi eshte vete token-i; per timeout ose
                server-error nje link i ri nuk ndihmon. */}
            {(reason === "invalid-token" || reason === "missing-token") && (
              <Link
                href="/resend-verification"
                className="inline-flex w-full items-center justify-center rounded-full bg-wood px-4 py-3 font-semibold text-white transition hover:bg-wood-dark"
              >
                Kërko një link të ri
              </Link>
            )}

            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center rounded-full border border-sand px-4 py-3 font-medium text-ink transition hover:bg-sand/50"
            >
              Shko te Login
            </Link>

            <Link
              href="/"
              className="text-center text-sm font-medium text-wood hover:text-wood-dark"
            >
              Kthehu në Home
            </Link>
          </div>

          {/* Support note */}
          <p className="mt-6 text-xs text-ink-soft/70">
            Nëse problemi vazhdon, kontakto mbështetjen tonë.
          </p>
        </div>
      </div>
    </div>
  );
}
