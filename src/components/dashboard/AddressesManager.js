// src/components/dashboard/AddressesManager.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "@/actions/authActions";
import { House, Briefcase, MapPin, Pencil, Trash2, Star } from "lucide-react";

const TYPE_OPTIONS = [
  { value: "home", label: "Shtëpi", icon: House },
  { value: "work", label: "Punë", icon: Briefcase },
  { value: "other", label: "Tjetër", icon: MapPin },
];

const EMPTY_ADDRESS = {
  type: "home",
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "AL",
  phone: "",
  isDefault: false,
};

function typeMeta(type) {
  return TYPE_OPTIONS.find((o) => o.value === type) || TYPE_OPTIONS[2];
}

export default function AddressesManager({ addresses: initialAddresses }) {
  const router = useRouter();

  const [addresses, setAddresses] = useState(initialAddresses || []);
  const [editingIndex, setEditingIndex] = useState(null); // null = mbyllur, -1 = e re
  const [form, setForm] = useState(EMPTY_ADDRESS);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const openNew = () => {
    setForm({ ...EMPTY_ADDRESS, isDefault: addresses.length === 0 });
    setEditingIndex(-1);
    setMessage({ type: "", text: "" });
  };

  const openEdit = (index) => {
    setForm({ ...EMPTY_ADDRESS, ...addresses[index] });
    setEditingIndex(index);
    setMessage({ type: "", text: "" });
  };

  const closeForm = () => {
    setEditingIndex(null);
    setForm(EMPTY_ADDRESS);
  };

  // Vetëm një adresë mund të jetë kryesore
  const normalize = (list) => {
    if (list.length === 0) return list;
    const hasDefault = list.some((a) => a.isDefault);
    return list.map((a, i) => ({
      ...a,
      isDefault: hasDefault ? Boolean(a.isDefault) : i === 0,
    }));
  };

  const persist = async (nextAddresses, successText) => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    const result = await updateUserProfile({ addresses: nextAddresses });

    if (result.success) {
      setAddresses(result.user?.addresses || nextAddresses);
      setMessage({ type: "success", text: successText });
      closeForm();
      router.refresh();
    } else {
      setMessage({ type: "error", text: result.error || "Ndodhi një gabim" });
    }

    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.street.trim() || !form.city.trim()) {
      setMessage({
        type: "error",
        text: "Rruga dhe qyteti janë të detyrueshme",
      });
      return;
    }

    const entry = {
      ...form,
      street: form.street.trim(),
      city: form.city.trim(),
    };

    let next =
      editingIndex === -1
        ? [...addresses, entry]
        : addresses.map((a, i) => (i === editingIndex ? entry : a));

    // Nëse kjo adresë u shënua kryesore, hiqe flag-un nga të tjerat
    if (entry.isDefault) {
      const targetIndex = editingIndex === -1 ? next.length - 1 : editingIndex;
      next = next.map((a, i) => ({ ...a, isDefault: i === targetIndex }));
    }

    await persist(
      normalize(next),
      editingIndex === -1 ? "Adresa u shtua me sukses!" : "Adresa u përditësua!",
    );
  };

  const handleDelete = async (index) => {
    if (!confirm("Je i sigurt që do ta fshish këtë adresë?")) return;
    await persist(
      normalize(addresses.filter((_, i) => i !== index)),
      "Adresa u fshi.",
    );
  };

  const handleSetDefault = async (index) => {
    const next = addresses.map((a, i) => ({ ...a, isDefault: i === index }));
    await persist(next, "Adresa kryesore u përditësua.");
  };

  const field = (key) => ({
    value: form[key] ?? "",
    onChange: (e) => setForm({ ...form, [key]: e.target.value }),
    className:
      "w-full rounded-lg border border-sand bg-cream px-4 py-2 text-ink outline-none transition focus:border-wood focus:ring-2 focus:ring-wood/20",
  });

  return (
    <div>
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

      {/* Lista e adresave */}
      {addresses.length > 0 ? (
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {addresses.map((address, index) => {
            const meta = typeMeta(address.type);
            const Icon = meta.icon;

            return (
              <div
                key={address._id || index}
                className="rounded-2xl border border-sand bg-paper p-6"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sand/70">
                      <Icon className="h-4 w-4 text-wood" />
                    </span>
                    <span className="text-sm font-semibold text-ink">
                      {meta.label}
                    </span>
                    {address.isDefault && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                        Kryesore
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(index)}
                      disabled={loading}
                      aria-label="Ndrysho adresën"
                      className="rounded-lg p-2 text-ink-soft transition hover:bg-sand/60 hover:text-wood disabled:opacity-50"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(index)}
                      disabled={loading}
                      aria-label="Fshi adresën"
                      className="rounded-lg p-2 text-ink-soft transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-ink">{address.street}</p>
                <p className="text-sm text-ink-soft">
                  {[address.postalCode, address.city, address.state]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                <p className="text-sm text-ink-soft">{address.country}</p>
                {address.phone && (
                  <p className="mt-1 text-sm text-ink-soft">{address.phone}</p>
                )}

                {!address.isDefault && (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(index)}
                    disabled={loading}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm text-wood hover:text-wood-dark disabled:opacity-50"
                  >
                    <Star className="h-4 w-4" />
                    Vendos si kryesore
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mb-8 rounded-2xl border border-sand bg-paper p-12 text-center">
          <MapPin className="mx-auto h-12 w-12 text-ink-soft/50" />
          <h3 className="mt-2 text-sm font-medium text-ink">
            Nuk ke asnjë adresë
          </h3>
          <p className="mt-1 text-sm text-ink-soft">
            Shto një adresë për ta përdorur gjatë checkout-it.
          </p>
        </div>
      )}

      {/* Forma */}
      {editingIndex === null ? (
        <button
          type="button"
          onClick={openNew}
          className="rounded-full bg-wood px-6 py-2 text-white transition hover:bg-wood-dark"
        >
          Shto adresë të re
        </button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-sand bg-paper p-6"
        >
          <h2 className="mb-4 font-display text-xl font-semibold text-ink">
            {editingIndex === -1 ? "Adresë e Re" : "Ndrysho Adresën"}
          </h2>

          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-ink">
                Lloji
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full rounded-lg border border-sand bg-cream px-4 py-2 text-ink outline-none transition focus:border-wood focus:ring-2 focus:ring-wood/20"
              >
                {TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-ink">
                Telefoni
              </label>
              <input type="tel" {...field("phone")} />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-ink">
                Rruga *
              </label>
              <input type="text" required {...field("street")} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-ink">
                Qyteti *
              </label>
              <input type="text" required {...field("city")} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-ink">
                Rrethi / Shteti
              </label>
              <input type="text" {...field("state")} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-ink">
                Kodi postar
              </label>
              <input type="text" {...field("postalCode")} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-ink">
                Shteti
              </label>
              <input type="text" {...field("country")} />
            </div>
          </div>

          <label className="mb-6 flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={Boolean(form.isDefault)}
              onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
              className="h-4 w-4 rounded border-sand text-wood focus:ring-wood/40"
            />
            Vendose si adresë kryesore
          </label>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-wood px-6 py-2 text-white transition hover:bg-wood-dark disabled:opacity-50"
            >
              {loading ? "Duke ruajtur..." : "Ruaj adresën"}
            </button>

            <button
              type="button"
              onClick={closeForm}
              disabled={loading}
              className="rounded-full border border-sand px-6 py-2 text-ink transition hover:bg-sand/60 disabled:opacity-50"
            >
              Anulo
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
