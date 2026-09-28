// src/app/(admin)/admin/products/new/page.js
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-ink">
          Krijo Produkt të Ri
        </h1>
        <p className="mt-2 text-ink-soft">Shto produkt të ri në dyqan</p>
      </div>

      {/* Form */}
      <ProductForm mode="create" />
    </div>
  );
}
