// src/components/admin/settings/ShippingSettingsForm.js
"use client";

import { useState } from "react";
import { updateShippingSettings } from "@/actions/admin/settingsActions";

export default function ShippingSettingsForm({ settings }) {
  const [formData, setFormData] = useState({
    freeShippingThreshold: settings?.freeShippingThreshold || 100,
    standardShippingFee: settings?.standardShippingFee || 5,
    taxRate: (settings?.taxRate || 0.15) * 100, // shfaq si %
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const result = await updateShippingSettings(formData);

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
      <h2 className="text-xl font-bold mb-6">Shipping & Tatimi</h2>

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
            Pragu për Transport Falas ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.freeShippingThreshold}
            onChange={(e) =>
              setFormData({
                ...formData,
                freeShippingThreshold: e.target.value,
              })
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Porositë mbi këtë shumë marrin transport falas
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tarifa Standarde e Transportit ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.standardShippingFee}
            onChange={(e) =>
              setFormData({ ...formData, standardShippingFee: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Norma e TVSH (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.taxRate}
            onChange={(e) =>
              setFormData({ ...formData, taxRate: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Aktualisht: {formData.taxRate}% TVSH e aplikuar në çdo porosi
          </p>
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
