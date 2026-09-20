// src/app/(dashboard)/dashboard/profile/addresses/page.js
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserById } from "@/actions/authActions";
import AddressesManager from "@/components/dashboard/AddressesManager";

export default async function AddressesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard/profile/addresses");
  }

  const user = await getUserById();

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Adresat e Mia</h1>
        <p className="text-gray-600 mt-2">
          Menaxho adresat e dërgesës për porositë e tua
        </p>
      </div>

      <AddressesManager addresses={user?.addresses || []} />
    </div>
  );
}
