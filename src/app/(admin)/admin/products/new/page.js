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
        <h1 className="text-3xl font-bold text-gray-900">
          Krijo Produkt të Ri
        </h1>
        <p className="text-gray-600 mt-2">Shto produkt të ri në dyqan</p>
      </div>

      {/* Form */}
      <ProductForm mode="create" />
    </div>
  );
}
