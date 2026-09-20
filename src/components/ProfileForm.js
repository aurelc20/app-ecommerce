// src/components/ProfileForm.js
"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";

import {
  updateUserProfile,
  changePassword,
  updateUserAvatar,
} from "@/actions/authActions";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

export default function ProfileForm({ user }) {
  const { update } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleAvatarSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Zgjidh vetëm një skedar imazhi" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "Imazhi duhet të jetë më i vogël se 5MB",
      });
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setAvatarPreview(localPreview);
    setAvatarUploading(true);
    setMessage({ type: "", text: "" });

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });
      const uploadResult = await uploadRes.json();

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || "Upload dështoi");
      }

      const result = await updateUserAvatar(
        uploadResult.url,
        uploadResult.publicId,
      );

      if (result.success) {
        setAvatarPreview(result.avatar);
        // Rifresko JWT token-in me avatar-in e ri
        await update({ avatar: result.avatar, image: result.avatar });
        router.refresh(); // ← RIFRESKON SERVER COMPONENTS (sidebar, etj.)

        setMessage({ type: "success", text: "Avatar u përditësua me sukses!" });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setAvatarPreview(user?.avatar || null);
      setMessage({ type: "error", text: error.message || "Ndodhi një gabim" });
    } finally {
      setAvatarUploading(false);
      URL.revokeObjectURL(localPreview);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const result = await updateUserProfile({
      name: formData.name,
    });

    if (result.success) {
      setMessage({ type: "success", text: "Profili u përditësua me sukses!" });
    } else {
      setMessage({ type: "error", text: result.error || "Ndodhi një gabim" });
    }

    setLoading(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Fjalëkalimet e reja nuk përputhen" });
      setLoading(false);
      return;
    }

    const result = await changePassword(
      formData.currentPassword,
      formData.newPassword,
    );

    if (result.success) {
      setMessage({
        type: "success",
        text: "Fjalëkalimi u ndryshua me sukses!",
      });
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      setMessage({ type: "error", text: result.error || "Ndodhi një gabim" });
    }

    setLoading(false);
  };

  return (
    <div className="p-6">
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

      {/* Avatar */}
      <div className="mb-8 pb-8 border-b">
        <h2 className="text-xl font-bold mb-4">Fotoja e Profilit</h2>

        <div className="flex items-center gap-6">
          <div className="relative">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt={user?.name || "Avatar"}
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-purple-600 text-white flex items-center justify-center text-3xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}

            {avatarUploading && (
              <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                <LoaderCircle className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </div>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarSelect}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
              className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition disabled:opacity-50"
            >
              {avatarUploading ? "Duke ngarkuar..." : "Ndrysho foton"}
            </button>

            <p className="text-xs text-gray-500 mt-2">
              JPG, PNG ose WEBP. Maksimumi 5MB.
            </p>
          </div>
        </div>
      </div>

      {/* Update Profile */}
      <form onSubmit={handleUpdateProfile} className="mb-8 pb-8 border-b">
        <h2 className="text-xl font-bold mb-4">Të Dhënat Personale</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emri i plotë
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email-i
            </label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Email-i nuk mund të ndryshohet
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
        >
          {loading ? "Duke ruajtur..." : "Ruaj ndryshimet"}
        </button>
      </form>

      {/* Change Password */}
      <form onSubmit={handleChangePassword}>
        <h2 className="text-xl font-bold mb-4">Ndrysho Fjalëkalimin</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fjalëkalimi aktual
            </label>
            <input
              type="password"
              value={formData.currentPassword}
              onChange={(e) =>
                setFormData({ ...formData, currentPassword: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fjalëkalimi i ri
              </label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Konfirmo fjalëkalimin
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
        >
          {loading ? "Duke ndryshuar..." : "Ndrysho fjalëkalimin"}
        </button>
      </form>
    </div>
  );
}
