// src/components/admin/settings/GeneralSettingsForm.js
"use client";

import { useState } from "react";
import { updateGeneralSettings } from "@/actions/admin/settingsActions";

const inputClass =
  "w-full px-4 py-2 border border-sand rounded-lg focus:ring-2 focus:ring-wood/20 focus:border-wood focus:outline-none text-ink";

export default function GeneralSettingsForm({ settings }) {
  const [formData, setFormData] = useState({
    storeName: settings?.storeName || "",
    storeEmail: settings?.storeEmail || "",
    storePhone: settings?.storePhone || "",
    storeAddress: settings?.storeAddress || "",
    storeDescription: settings?.storeDescription || "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const result = await updateGeneralSettings(formData);

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
        Informacionet e Dyqanit
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

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-ink">
            Emri i Dyqanit
          </label>
          <input
            type="text"
            value={formData.storeName}
            onChange={(e) =>
              setFormData({ ...formData, storeName: e.target.value })
            }
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-ink">
              Email
            </label>
            <input
              type="email"
              value={formData.storeEmail}
              onChange={(e) =>
                setFormData({ ...formData, storeEmail: e.target.value })
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">
              Telefoni
            </label>
            <input
              type="tel"
              value={formData.storePhone}
              onChange={(e) =>
                setFormData({ ...formData, storePhone: e.target.value })
              }
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-ink">
            Adresa
          </label>
          <input
            type="text"
            value={formData.storeAddress}
            onChange={(e) =>
              setFormData({ ...formData, storeAddress: e.target.value })
            }
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-ink">
            Përshkrimi
          </label>
          <textarea
            value={formData.storeDescription}
            onChange={(e) =>
              setFormData({ ...formData, storeDescription: e.target.value })
            }
            rows={3}
            className={inputClass}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 rounded-full bg-wood px-6 py-3 font-semibold text-white transition hover:bg-wood-dark disabled:opacity-50"
      >
        {loading ? "Duke ruajtur..." : "Ruaj Ndryshimet"}
      </button>
    </form>
  );
}
