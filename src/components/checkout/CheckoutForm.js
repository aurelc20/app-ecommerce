// src/components/checkout/CheckoutForm.js
"use client";

import { useState, useEffect, useCallback } from "react";

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
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-xl font-bold mb-6">Të Dhënat e Dërgesës</h2>

      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Emri i plotë *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              getError("fullName") ? "border-red-500" : ""
            }`}
            placeholder="Emri Mbiemri"
          />
          {getError("fullName") && (
            <p className="text-xs text-red-600 mt-1">{getError("fullName")}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email-i *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              getError("email") ? "border-red-500" : ""
            }`}
            placeholder="email@example.com"
          />
          {getError("email") && (
            <p className="text-xs text-red-600 mt-1">{getError("email")}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefoni *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              getError("phone") ? "border-red-500" : ""
            }`}
            placeholder="+355691234567"
          />
          {getError("phone") ? (
            <p className="text-xs text-red-600 mt-1">{getError("phone")}</p>
          ) : (
            <p className="text-xs text-gray-500 mt-1">
              Formati: +35569XXXXXXX ose 069XXXXXXX
            </p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adresa (Rruga, Nr.) *
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            onBlur={handleBlur}
            rows={2}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              getError("address") ? "border-red-500" : ""
            }`}
            placeholder="Rruga ..., Nr. ..."
          />
          {getError("address") && (
            <p className="text-xs text-red-600 mt-1">{getError("address")}</p>
          )}
        </div>

        {/* City & Postal Code */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Qyteti *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                getError("city") ? "border-red-500" : ""
              }`}
              placeholder="Durrës"
            />
            {getError("city") && (
              <p className="text-xs text-red-600 mt-1">{getError("city")}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kodi Postar *
            </label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                getError("postalCode") ? "border-red-500" : ""
              }`}
              placeholder="2001"
            />
            {getError("postalCode") && (
              <p className="text-xs text-red-600 mt-1">
                {getError("postalCode")}
              </p>
            )}
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shteti
          </label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shënime për porositë (opsionale)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Instruksione të veçanta për dërgesën..."
          />
        </div>
      </div>
    </div>
  );
}
