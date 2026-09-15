// src/components/admin/settings/MaintenanceSettingsForm.js
"use client";

import { useState } from "react";
import { toggleMaintenanceMode } from "@/actions/admin/settingsActions";

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
      className="bg-white rounded-xl shadow-sm border p-6"
    >
      <h2 className="text-xl font-bold mb-6">Mirëmbajtja e Faqes</h2>

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
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 font-medium">
            ⚠️ Faqja është aktualisht në modalitetin e mirëmbajtjes! Klientët
            nuk mund të bëjnë blerje.
          </p>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">
              Modaliteti i Mirëmbajtjes
            </h3>
            <p className="text-sm text-gray-600">
              Fik dyqanin përkohësisht për mirëmbajtje
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-red-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
          </label>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mesazhi për Klientët
        </label>
        <textarea
          value={message2}
          onChange={(e) => setMessage2(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
          placeholder="Faqja është në mirëmbajtje..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50 ${
          enabled
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-purple-600 hover:bg-purple-700 text-white"
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
