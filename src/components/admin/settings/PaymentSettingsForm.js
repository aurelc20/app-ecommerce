// src/components/admin/settings/PaymentSettingsForm.js
"use client";

import { useState } from "react";
import { updatePaymentSettings } from "@/actions/admin/settingsActions";

export default function PaymentSettingsForm({ settings }) {
  const [formData, setFormData] = useState({
    codEnabled: settings?.paymentMethods?.cod?.enabled ?? true,
    codLabel: settings?.paymentMethods?.cod?.label || "Cash on Delivery (COD)",
    bankEnabled: settings?.paymentMethods?.bank?.enabled ?? true,
    bankLabel: settings?.paymentMethods?.bank?.label || "Transfer Bankar",
    bankName: settings?.paymentMethods?.bank?.bankName || "",
    accountNumber: settings?.paymentMethods?.bank?.accountNumber || "",
    swift: settings?.paymentMethods?.bank?.swift || "",
    beneficiary: settings?.paymentMethods?.bank?.beneficiary || "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const result = await updatePaymentSettings(formData);

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
      <h2 className="text-xl font-bold mb-6">Metodat e Pagesës</h2>

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

      {/* COD */}
      <div className="mb-6 p-4 border rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">💵 Cash on Delivery</h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.codEnabled}
              onChange={(e) =>
                setFormData({ ...formData, codEnabled: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-purple-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
          </label>
        </div>
        <input
          type="text"
          value={formData.codLabel}
          onChange={(e) =>
            setFormData({ ...formData, codLabel: e.target.value })
          }
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
          placeholder="Etiketa e metodës"
        />
      </div>

      {/* Bank Transfer */}
      <div className="p-4 border rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">🏦 Transfer Bankar</h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.bankEnabled}
              onChange={(e) =>
                setFormData({ ...formData, bankEnabled: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-purple-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
          </label>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            value={formData.bankName}
            onChange={(e) =>
              setFormData({ ...formData, bankName: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="Emri i Bankës (p.sh. Raiffeisen Bank)"
          />
          <input
            type="text"
            value={formData.accountNumber}
            onChange={(e) =>
              setFormData({ ...formData, accountNumber: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 font-mono"
            placeholder="IBAN (p.sh. AL40 2011 1100 0000...)"
          />
          <input
            type="text"
            value={formData.swift}
            onChange={(e) =>
              setFormData({ ...formData, swift: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="SWIFT/BIC Code"
          />
          <input
            type="text"
            value={formData.beneficiary}
            onChange={(e) =>
              setFormData({ ...formData, beneficiary: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="Përfituesi (Emri i biznesit)"
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
