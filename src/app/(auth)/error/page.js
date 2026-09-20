// src/app/auth/error/page.js
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
    color: "text-orange-600",
  },
  "invalid-token": {
    icon: XCircle,
    color: "text-red-600",
  },
  timeout: {
    icon: AlertTriangle,
    color: "text-orange-500",
  },
  "connection-refused": {
    icon: ServerCrash,
    color: "text-red-700",
  },
  "server-error": {
    icon: AlertCircle,
    color: "text-red-600",
  },
  default: {
    icon: AlertCircle,
    color: "text-gray-500",
  },
};

///krijo componentin
function ErrorIcon({ reason }) {
  const { icon: Icon, color } = ERROR_ICONS[reason] || ERROR_ICONS.default;
  return (
    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
      <Icon className={`w-8 h-8 ${color}`} />
    </div>
  );
}

export default async function AuthErrorPage({ searchParams }) {
  const { reason = "" } = await searchParams;
  const errorInfo = ERROR_MESSAGES[reason] || ERROR_MESSAGES.default;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
          {/* Icon */}
          <ErrorIcon reason={reason} />

          {/* Title & Description */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {errorInfo.title}
          </h1>
          <p className="text-gray-600 mb-8">{errorInfo.description}</p>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            {/* Vetem kur problemi eshte vete token-i; per timeout ose
                server-error nje link i ri nuk ndihmon. */}
            {(reason === "invalid-token" || reason === "missing-token") && (
              <Link
                href="/resend-verification"
                className="w-full inline-flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Kërko një link të ri
              </Link>
            )}

            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Shko te Login
            </Link>

            <Link
              href="/"
              className="w-full inline-flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              Kthehu në Home
            </Link>
          </div>

          {/* Support note */}
          <p className="text-xs text-gray-400 mt-6">
            Nëse problemi vazhdon, kontakto mbështetjen tonë.
          </p>
        </div>
      </div>
    </div>
  );
}
