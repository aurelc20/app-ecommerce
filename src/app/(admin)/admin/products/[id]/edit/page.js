// src/app/(admin)/admin/products/[id]/edit/page.js
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getProductById } from "@/actions/admin/productActions";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-ink">
          Edito Produktin
        </h1>
        <p className="mt-2 text-ink-soft">
          Përditëso informacionet e produktit
        </p>
      </div>

      {/* Form */}
      <ProductForm mode="edit" product={product} />
    </div>
  );
}
