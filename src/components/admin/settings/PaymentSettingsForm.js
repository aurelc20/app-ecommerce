// src/components/admin/settings/PaymentSettingsForm.js
"use client";

import { useState } from "react";
import { updatePaymentSettings } from "@/actions/admin/settingsActions";
import { Banknote, Landmark } from "lucide-react";

const inputClass =
  "w-full px-4 py-2 border border-sand rounded-lg focus:ring-2 focus:ring-wood/20 focus:border-wood focus:outline-none text-ink";

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
      className="rounded-xl border border-sand bg-paper p-6 shadow-sm"
    >
      <h2 className="mb-6 font-display text-xl font-semibold text-ink">
        Metodat e Pagesës
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

      {/* COD */}
      <div className="mb-6 rounded-lg border border-sand p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold text-ink">
            <Banknote className="h-5 w-5 text-wood" />
            Cash on Delivery
          </h3>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={formData.codEnabled}
              onChange={(e) =>
                setFormData({ ...formData, codEnabled: e.target.checked })
              }
              className="peer sr-only"
            />
            <div className="peer h-6 w-11 rounded-full bg-sand peer-checked:bg-wood peer-focus:outline-none after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full" />
          </label>
        </div>
        <input
          type="text"
          value={formData.codLabel}
          onChange={(e) =>
            setFormData({ ...formData, codLabel: e.target.value })
          }
          className={inputClass}
          placeholder="Etiketa e metodës"
        />
      </div>

      {/* Bank Transfer */}
      <div className="rounded-lg border border-sand p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold text-ink">
            <Landmark className="h-5 w-5 text-wood" />
            Transfer Bankar
          </h3>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={formData.bankEnabled}
              onChange={(e) =>
                setFormData({ ...formData, bankEnabled: e.target.checked })
              }
              className="peer sr-only"
            />
            <div className="peer h-6 w-11 rounded-full bg-sand peer-checked:bg-wood peer-focus:outline-none after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full" />
          </label>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            value={formData.bankName}
            onChange={(e) =>
              setFormData({ ...formData, bankName: e.target.value })
            }
            className={inputClass}
            placeholder="Emri i Bankës (p.sh. Raiffeisen Bank)"
          />
          <input
            type="text"
            value={formData.accountNumber}
            onChange={(e) =>
              setFormData({ ...formData, accountNumber: e.target.value })
            }
            className={`font-mono ${inputClass}`}
            placeholder="IBAN (p.sh. AL40 2011 1100 0000...)"
          />
          <input
            type="text"
            value={formData.swift}
            onChange={(e) =>
              setFormData({ ...formData, swift: e.target.value })
            }
            className={inputClass}
            placeholder="SWIFT/BIC Code"
          />
          <input
            type="text"
            value={formData.beneficiary}
            onChange={(e) =>
              setFormData({ ...formData, beneficiary: e.target.value })
            }
            className={inputClass}
            placeholder="Përfituesi (Emri i biznesit)"
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
