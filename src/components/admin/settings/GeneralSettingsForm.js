// src/components/admin/settings/GeneralSettingsForm.js
"use client";

import { useState } from "react";
import { updateGeneralSettings } from "@/actions/admin/settingsActions";

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
      className="bg-white rounded-xl shadow-sm border p-6"
    >
      <h2 className="text-xl font-bold mb-6">Informacionet e Dyqanit</h2>

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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Emri i Dyqanit
          </label>
          <input
            type="text"
            value={formData.storeName}
            onChange={(e) =>
              setFormData({ ...formData, storeName: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.storeEmail}
              onChange={(e) =>
                setFormData({ ...formData, storeEmail: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefoni
            </label>
            <input
              type="tel"
              value={formData.storePhone}
              onChange={(e) =>
                setFormData({ ...formData, storePhone: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adresa
          </label>
          <input
            type="text"
            value={formData.storeAddress}
            onChange={(e) =>
              setFormData({ ...formData, storeAddress: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Përshkrimi
          </label>
          <textarea
            value={formData.storeDescription}
            onChange={(e) =>
              setFormData({ ...formData, storeDescription: e.target.value })
            }
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
      >
        {loading ? "Duke ruajtur..." : "Ruaj Ndryshimet"}
      </button>
    </form>
  );
}
