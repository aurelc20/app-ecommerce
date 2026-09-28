// src/components/admin/ProductForm.js
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/actions/admin/productActions";
import ImageUploader from "@/components/admin/ImageUploader";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { PRODUCT_CATEGORIES } from "@/lib/categories";

const inputClass =
  "w-full px-4 py-2 border border-sand rounded-lg focus:ring-2 focus:ring-wood/20 focus:border-wood focus:outline-none text-ink placeholder:text-ink-soft/60";

export default function ProductForm({ mode = "create", product = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Kutia e gabimit ndodhet ne krye te formes, ndersa butoni i submit-it
  // eshte poshte ne sidebar. Pa kete, gabimi mbetet jashte ekranit dhe
  // klikimi duket sikur nuk ben asgje.
  const errorRef = useRef(null);

  // Slug-u ndjek emrin derisa perdoruesi ta shkruaje vete. Ne modalitetin
  // edit ai ekziston tashme dhe nuk duhet mbishkruar, sepse do te prishte
  // URL-ne e produktit.
  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    salePrice: product?.salePrice?.toString() || "",
    category: product?.category || "",
    brand: product?.brand || "Furniture Shop",
    stock: product?.stock?.toString() || "0",
    sku: product?.sku || "",
    isFeatured: product?.isFeatured || false,
    isOnSale: product?.isOnSale || false,
    isActive: product?.isActive !== false,
    tags: product?.tags?.join(", ") || "",
    images: product?.images || [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validate
    const missing = [];
    if (!formData.name) missing.push("Emri");
    if (!formData.description) missing.push("Përshkrimi");
    if (!formData.price) missing.push("Çmimi");
    if (!formData.category) missing.push("Kategoria");

    if (missing.length > 0) {
      setError(`Plotëso këto fusha: ${missing.join(", ")}`);
      setLoading(false);
      return;
    }

    if (!formData.slug) {
      setError("Slug është i detyrueshëm");
      setLoading(false);
      return;
    }

    if (
      formData.salePrice &&
      parseFloat(formData.salePrice) >= parseFloat(formData.price)
    ) {
      setError("Çmimi i zbritjes duhet të jetë më i vogël se çmimi origjinal");
      setLoading(false);
      return;
    }

    // Create FormData object
    const form = new FormData();
    form.append("name", formData.name);
    form.append("slug", formData.slug);
    form.append("description", formData.description);
    form.append("price", formData.price);
    if (formData.salePrice) form.append("salePrice", formData.salePrice);
    form.append("category", formData.category);
    form.append("brand", formData.brand);
    form.append("stock", formData.stock);
    form.append("sku", formData.sku);
    form.append("isFeatured", formData.isFeatured ? "on" : "off");
    form.append("isOnSale", formData.isOnSale ? "on" : "off");
    form.append("isActive", formData.isActive ? "on" : "off");
    form.append("tags", formData.tags);
    form.append("images", JSON.stringify(formData.images));

    try {
      const result =
        mode === "create"
          ? await createProduct(form)
          : await updateProduct(product._id, form);

      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => {
          router.push("/admin/products");
        }, 1000);
      } else {
        setError(result.error || "Ndodhi një gabim");
      }
    } catch (err) {
      // Pa kete, nje server action qe hedh gabim (p.sh. ID e vjeter pas nje
      // rinisjeje) do ta linte loading true dhe butonin te bllokuar pergjithmone.
      console.error("Product submit error:", err);
      setError("Serveri nuk u përgjigj. Rifresko faqen dhe provo sërish.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [error]);

  const handleImageUpload = (images) => {
    setFormData({ ...formData, images });
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: slugTouched ? prev.slug : generateSlug(name),
    }));
  };

  const handleSlugChange = (e) => {
    setSlugTouched(true);
    setFormData((prev) => ({ ...prev, slug: generateSlug(e.target.value) }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-sand bg-paper p-6 shadow-sm"
    >
      {error && (
        <div
          ref={errorRef}
          className="mb-6 rounded-lg bg-red-50 p-4 text-red-600"
        >
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-600">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Basic Info */}
          <div>
            <h3 className="mb-4 font-display text-lg font-semibold text-ink">
              Informacionet Bazë
            </h3>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-ink">
                  Emri i Produktit *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  className={inputClass}
                  placeholder="P.sh: Karrige druri Oslo"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="mb-2 block text-sm font-medium text-ink">
                  Slug (URL) *
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-ink-soft">/product/</span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={handleSlugChange}
                    className={`flex-1 font-mono text-sm ${inputClass}`}
                    placeholder="karrige-druri-oslo"
                  />
                </div>
                <p className="mt-1 text-xs text-ink-soft">
                  URL unike për produktin. Gjenerohet automatikisht nga emri.
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-ink">
                  Përshkrimi *
                </label>
                <RichTextEditor
                  value={formData.description}
                  onChange={(value) =>
                    setFormData({ ...formData, description: value })
                  }
                />
              </div>

              {/* SKU */}
              <div>
                <label className="mb-2 block text-sm font-medium text-ink">
                  SKU (Stock Keeping Unit)
                </label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({ ...formData, sku: e.target.value })
                  }
                  className={inputClass}
                  placeholder="P.sh: KRR-001"
                />
                <p className="mt-1 text-xs text-ink-soft">
                  Kodi unik për identifikimin e produktit
                </p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="mb-4 font-display text-lg font-semibold text-ink">
              Çmimi
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Price */}
              <div>
                <label className="mb-2 block text-sm font-medium text-ink">
                  Çmimi Bazë ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className={inputClass}
                  placeholder="249.99"
                />
              </div>

              {/* Sale Price */}
              <div>
                <label className="mb-2 block text-sm font-medium text-ink">
                  Çmimi me Zbritje ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.salePrice}
                  onChange={(e) =>
                    setFormData({ ...formData, salePrice: e.target.value })
                  }
                  className={inputClass}
                  placeholder="199.99"
                />
              </div>
            </div>

            {/* Sale Toggle */}
            <div className="mt-4 flex items-center gap-3">
              <input
                type="checkbox"
                id="isOnSale"
                checked={formData.isOnSale}
                onChange={(e) =>
                  setFormData({ ...formData, isOnSale: e.target.checked })
                }
                className="rounded border-sand accent-wood focus:ring-2 focus:ring-wood/20"
              />
              <label htmlFor="isOnSale" className="text-sm font-medium text-ink">
                Aktivizo zbritjen (shfaq badge &quot;Sale&quot;)
              </label>
            </div>
          </div>

          {/* Images */}
          <div>
            <h3 className="mb-4 font-display text-lg font-semibold text-ink">
              Imazhet
            </h3>
            <ImageUploader
              images={formData.images}
              onChange={handleImageUpload}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Organization */}
          <div className="rounded-lg bg-sand/40 p-4">
            <h3 className="mb-4 font-display text-lg font-semibold text-ink">
              Organizimi
            </h3>

            <div className="space-y-4">
              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-medium text-ink">
                  Kategoria *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className={inputClass}
                >
                  <option value="">Zgjidh kategorinë</option>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand */}
              <div>
                <label className="mb-2 block text-sm font-medium text-ink">
                  Brand
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                  className={inputClass}
                  placeholder="Furniture Shop"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="mb-2 block text-sm font-medium text-ink">
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  className={inputClass}
                  placeholder="dru, modern, shtëpi"
                />
                <p className="mt-1 text-xs text-ink-soft">Ndaj me presje (,)</p>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="rounded-lg bg-sand/40 p-4">
            <h3 className="mb-4 font-display text-lg font-semibold text-ink">
              Inventari
            </h3>

            <div>
              <label className="mb-2 block text-sm font-medium text-ink">
                Stock *
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                className={inputClass}
                placeholder="0"
              />
            </div>
          </div>

          {/* Visibility */}
          <div className="rounded-lg bg-sand/40 p-4">
            <h3 className="mb-4 font-display text-lg font-semibold text-ink">
              Shfaqja
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="rounded border-sand accent-wood focus:ring-2 focus:ring-wood/20"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium text-ink"
                >
                  Aktive (shfaqet në shop)
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData({ ...formData, isFeatured: e.target.checked })
                  }
                  className="rounded border-sand accent-wood focus:ring-2 focus:ring-wood/20"
                />
                <label
                  htmlFor="isFeatured"
                  className="text-sm font-medium text-ink"
                >
                  Featured (shfaqet në homepage)
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-wood py-3 font-semibold text-white transition hover:bg-wood-dark disabled:opacity-50"
            >
              {loading
                ? "Duke ruajtur..."
                : mode === "create"
                  ? "Krijo Produktin"
                  : "Ruaj Ndryshimet"}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="w-full rounded-full bg-sand py-3 font-semibold text-ink-soft transition hover:bg-sand/70"
            >
              Anulo
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

// Helper function për të gjeneruar slug
function generateSlug(text) {
  return (
    text
      .toLowerCase()
      .trim()
      // \w eshte vetem ASCII, ndaj ë dhe ç do te fshiheshin krejt.
      // Transliterimi behet para se te hiqen karakteret speciale.
      .replace(/ë/g, "e")
      .replace(/ç/g, "c")
      // Ndan diakritiket e tjere (é, ü, ñ) nga shkronja baze dhe i heq
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^\w\s-]/g, "") // Hiq karakteret speciale
      .replace(/[\s_-]+/g, "-") // Zëvendëso hapësirat me -
      .replace(/^-+|-+$/g, "") // Hiq - nga fillimi dhe fundi
  );
}
