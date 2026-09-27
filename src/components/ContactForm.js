// src/components/ContactForm.js
"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { sendContactMessage } from "@/actions/contactActions";

const initialForm = { name: "", email: "", subject: "", message: "" };

export default function ContactForm() {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", text: "" });

    const result = await sendContactMessage(formData);

    if (result.success) {
      setStatus({ type: "success", text: result.message });
      setFormData(initialForm);
    } else {
      setStatus({ type: "error", text: result.error });
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-sand bg-paper p-6 sm:p-8"
    >
      {status.text && (
        <div
          className={`mb-6 rounded-xl px-4 py-3 text-sm ${
            status.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          {status.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Emri
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-sand bg-cream px-4 py-2.5 text-ink outline-none transition focus:border-wood focus:ring-2 focus:ring-wood/20"
            placeholder="Emri juaj"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-sand bg-cream px-4 py-2.5 text-ink outline-none transition focus:border-wood focus:ring-2 focus:ring-wood/20"
            placeholder="email@shembull.com"
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="mb-1.5 block text-sm font-medium text-ink">
          Subjekti
        </label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full rounded-lg border border-sand bg-cream px-4 py-2.5 text-ink outline-none transition focus:border-wood focus:ring-2 focus:ring-wood/20"
          placeholder="Si mund t'ju ndihmojmë?"
        />
      </div>

      <div className="mt-5">
        <label className="mb-1.5 block text-sm font-medium text-ink">
          Mesazhi
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className="w-full resize-none rounded-lg border border-sand bg-cream px-4 py-2.5 text-ink outline-none transition focus:border-wood focus:ring-2 focus:ring-wood/20"
          placeholder="Shkruani mesazhin tuaj..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-wood px-7 py-3.5 font-medium text-white transition hover:bg-wood-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {loading ? "Duke dërguar..." : "Dërgo Mesazhin"}
        {!loading && <Send className="h-4 w-4" />}
      </button>
    </form>
  );
}
