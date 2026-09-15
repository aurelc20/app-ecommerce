// src/components/admin/settings/SocialSettingsForm.js
"use client";

import { useState } from "react";
import { updateSocialSettings } from "@/actions/admin/settingsActions";

export default function SocialSettingsForm({ settings }) {
  const [formData, setFormData] = useState({
    facebook: settings?.socialLinks?.facebook || "",
    instagram: settings?.socialLinks?.instagram || "",
    tiktok: settings?.socialLinks?.tiktok || "",
    whatsapp: settings?.socialLinks?.whatsapp || "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const result = await updateSocialSettings(formData);

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
      <h2 className="text-xl font-bold mb-6">Social Media</h2>

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
            📘 Facebook
          </label>
          <input
            type="url"
            value={formData.facebook}
            onChange={(e) =>
              setFormData({ ...formData, facebook: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="https://facebook.com/perle"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📷 Instagram
          </label>
          <input
            type="url"
            value={formData.instagram}
            onChange={(e) =>
              setFormData({ ...formData, instagram: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="https://instagram.com/perle"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🎵 TikTok
          </label>
          <input
            type="url"
            value={formData.tiktok}
            onChange={(e) =>
              setFormData({ ...formData, tiktok: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="https://tiktok.com/@perle"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            💬 WhatsApp
          </label>
          <input
            type="text"
            value={formData.whatsapp}
            onChange={(e) =>
              setFormData({ ...formData, whatsapp: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="+355691234567"
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
