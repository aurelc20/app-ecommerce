// src/app/maintenance/page.js
import { getSettings } from "@/actions/admin/settingsActions";
import { Wrench } from "lucide-react";
import Eyebrow from "@/components/Eyebrow";

export default async function MaintenancePage() {
  const settings = await getSettings();

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-20">
      <div className="w-full max-w-md text-center">
        <Eyebrow className="mb-4">Mirëmbajtje</Eyebrow>

        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-sand/70 text-wood">
          <Wrench className="h-8 w-8" strokeWidth={1.75} />
        </div>

        {/* Title */}
        <h1 className="font-display text-3xl font-semibold text-ink">
          {settings?.storeName || "Furniture Shop"}
        </h1>

        {/* Message */}
        <p className="mt-4 text-ink-soft">
          {settings?.maintenanceMessage ||
            "Faqja është aktualisht në mirëmbajtje. Kthehuni së shpejti!"}
        </p>

        {/* Contact Info */}
        {(settings?.storeEmail || settings?.storePhone) && (
          <div className="mt-8 rounded-2xl border border-sand bg-paper p-6 text-left shadow-xl shadow-ink/10">
            <p className="mb-2 text-sm text-ink-soft">Na kontaktoni:</p>
            {settings?.storeEmail && (
              <p className="font-medium text-ink">{settings.storeEmail}</p>
            )}
            {settings?.storePhone && (
              <p className="font-medium text-ink">{settings.storePhone}</p>
            )}
          </div>
        )}

        {/* Admin Login Link */}
        <div className="mt-8">
          <a
            href="/login"
            className="text-sm font-medium text-wood hover:text-wood-dark"
          >
            Login për admin
          </a>
        </div>
      </div>
    </div>
  );
}
