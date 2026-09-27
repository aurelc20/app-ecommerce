// src/components/checkout/CheckoutForm.js
"use client";

import { useState, useEffect, useCallback } from "react";

const inputClass = (hasError) =>
  `w-full rounded-lg border bg-cream px-4 py-3 text-ink outline-none transition focus:border-wood focus:ring-2 focus:ring-wood/20 ${
    hasError ? "border-red-500" : "border-sand"
  }`;

export default function CheckoutForm({ onFormChange, user }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "AL",
    notes: "",
  });

  const [touched, setTouched] = useState({});

  const validate = useCallback((data) => {
    const phoneRegex = /^(\+355|0)[0-9]{9}$/;
    return (
      data.fullName.trim() !== "" &&
      data.email.trim() !== "" &&
      phoneRegex.test(data.phone.replace(/\s/g, "")) &&
      data.address.trim() !== "" &&
      data.city.trim() !== "" &&
      data.postalCode.trim() !== ""
    );
  }, []);

  // Çdo herë që ndryshon formData, njofto parent-in (CheckoutPage)
  useEffect(() => {
    const isValid = validate(formData);
    onFormChange(formData, isValid);
  }, [formData, validate, onFormChange]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const getError = (field) => {
    if (!touched[field]) return null;

    if (field === "phone") {
      const phoneRegex = /^(\+355|0)[0-9]{9}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
        return "Numri i telefonit nuk është valid";
      }
    }

    if (!formData[field] || formData[field].trim() === "") {
      return "Kjo fushë është e detyrueshme";
    }

    return null;
  };

  return (
    <div className="rounded-2xl border border-sand bg-paper p-6">
      <h2 className="mb-6 font-display text-xl font-semibold text-ink">
        Të Dhënat e Dërgesës
      </h2>

      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="mb-2 block text-sm font-medium text-ink">
            Emri i plotë *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClass(getError("fullName"))}
            placeholder="Emri Mbiemri"
          />
          {getError("fullName") && (
            <p className="mt-1 text-xs text-red-600">{getError("fullName")}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="mb-2 block text-sm font-medium text-ink">
            Email-i *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClass(getError("email"))}
            placeholder="email@example.com"
          />
          {getError("email") && (
            <p className="mt-1 text-xs text-red-600">{getError("email")}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="mb-2 block text-sm font-medium text-ink">
            Telefoni *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClass(getError("phone"))}
            placeholder="+355691234567"
          />
          {getError("phone") ? (
            <p className="mt-1 text-xs text-red-600">{getError("phone")}</p>
          ) : (
            <p className="mt-1 text-xs text-ink-soft">
              Formati: +35569XXXXXXX ose 069XXXXXXX
            </p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="mb-2 block text-sm font-medium text-ink">
            Adresa (Rruga, Nr.) *
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            onBlur={handleBlur}
            rows={2}
            className={inputClass(getError("address"))}
            placeholder="Rruga ..., Nr. ..."
          />
          {getError("address") && (
            <p className="mt-1 text-xs text-red-600">{getError("address")}</p>
          )}
        </div>

        {/* City & Postal Code */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-ink">
              Qyteti *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass(getError("city"))}
              placeholder="Durrës"
            />
            {getError("city") && (
              <p className="mt-1 text-xs text-red-600">{getError("city")}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">
              Kodi Postar *
            </label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass(getError("postalCode"))}
              placeholder="2001"
            />
            {getError("postalCode") && (
              <p className="mt-1 text-xs text-red-600">
                {getError("postalCode")}
              </p>
            )}
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="mb-2 block text-sm font-medium text-ink">
            Shteti
          </label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className={inputClass(false)}
          >
            <option value="AL">Shqipëri 🇦🇱</option>
            <option value="XK">Kosovë 🇽🇰</option>
            <option value="MK">Maqedoni e Veriut 🇲🇰</option>
            <option value="ME">Mali i Zi 🇲🇪</option>
            <option value="RS">Serbi 🇷🇸</option>
          </select>
        </div>

        {/* Order Notes */}
        <div>
          <label className="mb-2 block text-sm font-medium text-ink">
            Shënime për porositë (opsionale)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className={inputClass(false)}
            placeholder="Instruksione të veçanta për dërgesën..."
          />
        </div>
      </div>
    </div>
  );
}
