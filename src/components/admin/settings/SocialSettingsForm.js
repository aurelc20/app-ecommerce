// src/components/admin/settings/SocialSettingsForm.js
"use client";

import { useState } from "react";
import { updateSocialSettings } from "@/actions/admin/settingsActions";
import { Camera, MessageCircle, Music2, ThumbsUp } from "lucide-react";

const inputClass =
  "w-full px-4 py-2 border border-sand rounded-lg focus:ring-2 focus:ring-wood/20 focus:border-wood focus:outline-none text-ink";

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
      className="rounded-xl border border-sand bg-paper p-6 shadow-sm"
    >
      <h2 className="mb-6 font-display text-xl font-semibold text-ink">
        Social Media
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
          <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-ink">
            <ThumbsUp className="h-4 w-4 text-wood" />
            Facebook
          </label>
          <input
            type="url"
            value={formData.facebook}
            onChange={(e) =>
              setFormData({ ...formData, facebook: e.target.value })
            }
            className={inputClass}
            placeholder="https://facebook.com/perle"
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-ink">
            <Camera className="h-4 w-4 text-wood" />
            Instagram
          </label>
          <input
            type="url"
            value={formData.instagram}
            onChange={(e) =>
              setFormData({ ...formData, instagram: e.target.value })
            }
            className={inputClass}
            placeholder="https://instagram.com/perle"
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-ink">
            <Music2 className="h-4 w-4 text-wood" />
            TikTok
          </label>
          <input
            type="url"
            value={formData.tiktok}
            onChange={(e) =>
              setFormData({ ...formData, tiktok: e.target.value })
            }
            className={inputClass}
            placeholder="https://tiktok.com/@perle"
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-ink">
            <MessageCircle className="h-4 w-4 text-wood" />
            WhatsApp
          </label>
          <input
            type="text"
            value={formData.whatsapp}
            onChange={(e) =>
              setFormData({ ...formData, whatsapp: e.target.value })
            }
            className={inputClass}
            placeholder="+355691234567"
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
