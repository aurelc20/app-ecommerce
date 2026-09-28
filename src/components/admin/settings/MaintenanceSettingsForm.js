// src/components/admin/settings/MaintenanceSettingsForm.js
"use client";

import { useState } from "react";
import { toggleMaintenanceMode } from "@/actions/admin/settingsActions";
import { TriangleAlert } from "lucide-react";

export default function MaintenanceSettingsForm({ settings }) {
  const [enabled, setEnabled] = useState(settings?.maintenanceMode || false);
  const [message2, setMessage2] = useState(settings?.maintenanceMessage || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const result = await toggleMaintenanceMode(enabled, message2);

    if (result.success) {
      setMessage({ type: "success", text: result.message });
    } else {
      setMessage({ type: "error", text: result.error });
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-sand bg-paper p-6 shadow-sm"
    >
      <h2 className="mb-6 font-display text-xl font-semibold text-ink">
        Mirëmbajtja e Faqes
      </h2>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {enabled && (
        <div className="mb-6 flex items-start gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <TriangleAlert className="h-4 w-4 shrink-0 translate-y-0.5 text-yellow-800" />
          <p className="text-sm font-medium text-yellow-800">
            Faqja është aktualisht në modalitetin e mirëmbajtjes! Klientët nuk
            mund të bëjnë blerje.
          </p>
        </div>
      )}

      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-ink">
              Modaliteti i Mirëmbajtjes
            </h3>
            <p className="text-sm text-ink-soft">
              Fik dyqanin përkohësisht për mirëmbajtje
            </p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="peer sr-only"
            />
            <div className="peer h-6 w-11 rounded-full bg-sand peer-checked:bg-red-600 peer-focus:outline-none after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full" />
          </label>
        </div>

        <label className="mb-2 block text-sm font-medium text-ink">
          Mesazhi për Klientët
        </label>
        <textarea
          value={message2}
          onChange={(e) => setMessage2(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-sand rounded-lg focus:ring-2 focus:ring-wood/20 focus:border-wood focus:outline-none text-ink"
          placeholder="Faqja është në mirëmbajtje..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`px-6 py-3 rounded-full font-semibold transition disabled:opacity-50 ${
          enabled
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-wood hover:bg-wood-dark text-white"
        }`}
      >
        {loading
          ? "Duke ruajtur..."
          : enabled
            ? "Aktivizo Mirëmbajtjen"
            : "Ruaj Ndryshimet"}
      </button>
    </form>
  );
}
