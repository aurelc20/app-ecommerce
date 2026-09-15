// src/components/admin/ProductForm.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/actions/admin/productActions";
import ImageUploader from "@/components/admin/ImageUploader";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function ProductForm({ mode = "create", product = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    salePrice: product?.salePrice?.toString() || "",
    category: product?.category || "",
    brand: product?.brand || "Perlë",
    stock: product?.stock?.toString() || "0",
    sku: product?.sku || "",
    isFeatured: product?.isFeatured || false,
    isOnSale: product?.isOnSale || false,
    isActive: product?.isActive !== false,
    tags: product?.tags?.join(", ") || "",
    images: product?.images || [],
  });

  // Auto-generate slug nga emri
  useEffect(() => {
    if (mode === "create" && formData.name && !formData.slug) {
      const generatedSlug = generateSlug(formData.name);
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.name, mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validate
    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.category
    ) {
      setError("Të gjitha fushat me * janë të detyrueshme");
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

    let result;
    if (mode === "create") {
      result = await createProduct(form);
    } else {
      result = await updateProduct(product._id, form);
    }

    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => {
        router.push("/admin/products");
      }, 1000);
    } else {
      setError(result.error || "Ndodhi një gabim");
    }

    setLoading(false);
  };

  const handleImageUpload = (images) => {
    setFormData({ ...formData, images });
  };

  const handleSlugChange = (e) => {
    const slug = generateSlug(e.target.value);
    setFormData({ ...formData, slug });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-sm border p-6"
    >
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-lg">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Informacionet Bazë
            </h3>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emri i Produktit *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 placeholder:text-black/50 text-black/70"
                  placeholder="P.sh: Varëse Diamanti"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug (URL) *
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">/product/</span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={handleSlugChange}
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 font-mono text-sm placeholder:text-black/50 text-black/70"
                    placeholder="varëse-diamanti"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  URL unike për produktin. Gjenerohet automatikisht nga emri.
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU (Stock Keeping Unit)
                </label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({ ...formData, sku: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 placeholder:text-black/50 text-black/70"
                  placeholder="P.sh: NKL-001"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Kodi unik për identifikimin e produktit
                </p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Çmimi</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 placeholder:text-black/50 text-black/70"
                  placeholder="99.99"
                />
              </div>

              {/* Sale Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 placeholder:text-black/50 text-black/70"
                  placeholder="79.99"
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
                className="rounded text-purple-600 focus:ring-purple-500 placeholder:text-black/50 "
              />
              <label
                htmlFor="isOnSale"
                className="text-sm font-medium text-gray-700"
              >
                Aktivizo zbritjen (shfaq badge "Sale")
              </label>
            </div>
          </div>

          {/* Images */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Imazhet</h3>
            <ImageUploader
              images={formData.images}
              onChange={handleImageUpload}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Organization */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Organizimi</h3>

            <div className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategoria *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 placeholder:text-black/50 text-black/70"
                >
                  <option value="">Zgjidh kategorinë</option>
                  <option value="Necklaces">Varëse (Necklaces)</option>
                  <option value="Earrings">Vathë (Earrings)</option>
                  <option value="Bracelets">Byzylykë (Bracelets)</option>
                  <option value="Rings">Unaza (Rings)</option>
                  <option value="Sets">Sete (Sets)</option>
                  <option value="Other">Tjera (Other)</option>
                </select>
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 placeholder:text-black/50 text-black/70"
                  placeholder="Perlë"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 placeholder:text-black/50 text-black/70"
                  placeholder="diamant, ar, elegant"
                />
                <p className="text-xs text-gray-500 mt-1">Ndaj me presje (,)</p>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Inventari</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock *
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 placeholder:text-black/50 text-black/70"
                placeholder="0"
              />
            </div>
          </div>

          {/* Visibility */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Shfaqja</h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="rounded focus:ring-purple-500 placeholder:text-black/50 text-black/70"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium text-gray-700"
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
                  className="rounded focus:ring-purple-500 placeholder:text-black/50 text-black/70"
                />
                <label
                  htmlFor="isFeatured"
                  className="text-sm font-medium text-gray-700"
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
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
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
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
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
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Hiq karakteret speciale
    .replace(/[\s_-]+/g, "-") // Zëvendëso hapësirat me -
    .replace(/^-+|-+$/g, ""); // Hiq - nga fillimi dhe fundi
}
