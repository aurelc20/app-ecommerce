// src/app/maintenance/page.js
import { getSettings } from "@/actions/admin/settingsActions";

export default async function MaintenancePage() {
  const settings = await getSettings();

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center text-white">
        {/* Icon */}
        <div className="mb-6 text-6xl">🔧</div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-4">
          {settings?.storeName || "Perlë Jewellery Design"}
        </h1>

        {/* Message */}
        <p className="text-lg text-purple-100 mb-8">
          {settings?.maintenanceMessage ||
            "Faqja është aktualisht në mirëmbajtje. Kthehuni së shpejti!"}
        </p>

        {/* Contact Info */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-6">
          <p className="text-sm text-purple-100 mb-2">Na kontaktoni:</p>
          {settings?.storeEmail && (
            <p className="font-medium">{settings.storeEmail}</p>
          )}
          {settings?.storePhone && (
            <p className="font-medium">{settings.storePhone}</p>
          )}
        </div>

        {/* Admin Login Link */}
        <div className="mt-8">
          <a
            href="/login"
            className="text-sm text-purple-200 hover:text-white underline"
          >
            Login për admin
          </a>
        </div>
      </div>
    </div>
  );
}
