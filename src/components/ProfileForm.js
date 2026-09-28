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

  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null); //
  const [avatarUploading, setAvatarUploading] = useState(false); //
  const fileInputRef = useRef(null); //

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" }); //

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

  const inputClass =
    "w-full rounded-lg border border-sand bg-cream px-4 py-2 text-ink outline-none transition focus:border-wood focus:ring-2 focus:ring-wood/20";

  return (
    <div className="p-6">
      {message.text && (
        <div
          className={`mb-6 rounded-lg p-4 ${
            message.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Avatar */}
      <div className="mb-8 border-b border-sand pb-8">
        <h2 className="mb-4 font-display text-xl font-semibold text-ink">
          Fotoja e Profilit
        </h2>

        <div className="flex items-center gap-6">
          <div className="relative">
            {avatarPreview ? (
              // Parapamja lokale eshte blob: URL nga URL.createObjectURL,
              // qe next/image nuk e mbeshtet si src.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarPreview}
                alt={user?.name || "Avatar"}
                className="h-24 w-24 rounded-full border-2 border-sand object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-wood text-3xl font-bold text-white">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}

            {avatarUploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                <LoaderCircle className="h-6 w-6 animate-spin text-white" />
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
              className="rounded-full border border-wood px-4 py-2 text-wood transition hover:bg-wood/10 disabled:opacity-50"
            >
              {avatarUploading ? "Duke ngarkuar..." : "Ndrysho foton"}
            </button>

            <p className="mt-2 text-xs text-ink-soft">
              JPG, PNG ose WEBP. Maksimumi 5MB.
            </p>
          </div>
        </div>
      </div>

      {/* Update Profile */}
      <form
        onSubmit={handleUpdateProfile}
        className="mb-8 border-b border-sand pb-8"
      >
        <h2 className="mb-4 font-display text-xl font-semibold text-ink">
          Të Dhënat Personale
        </h2>

        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-ink">
              Emri i plotë
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">
              Email-i
            </label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full cursor-not-allowed rounded-lg border border-sand bg-sand/40 px-4 py-2 text-ink-soft"
            />
            <p className="mt-1 text-xs text-ink-soft">
              Email-i nuk mund të ndryshohet
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-wood px-6 py-2 text-white transition hover:bg-wood-dark disabled:opacity-50"
        >
          {loading ? "Duke ruajtur..." : "Ruaj ndryshimet"}
        </button>
      </form>

      {/* Change Password */}
      <form onSubmit={handleChangePassword}>
        <h2 className="mb-4 font-display text-xl font-semibold text-ink">
          Ndrysho Fjalëkalimin
        </h2>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-ink">
              Fjalëkalimi aktual
            </label>
            <input
              type="password"
              value={formData.currentPassword}
              onChange={(e) =>
                setFormData({ ...formData, currentPassword: e.target.value })
              }
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-ink">
                Fjalëkalimi i ri
              </label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-ink">
                Konfirmo fjalëkalimin
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 rounded-full bg-wood px-6 py-2 text-white transition hover:bg-wood-dark disabled:opacity-50"
        >
          {loading ? "Duke ndryshuar..." : "Ndrysho fjalëkalimin"}
        </button>
      </form>
    </div>
  );
}
