// src/app/(dashboard)/dashboard/profile/page.js
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserById } from "@/actions/authActions";
import ProfileForm from "@/components/ProfileForm";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await getUserById(session.user.id);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profili Im</h1>
        <p className="text-gray-600 mt-2">Menaxho të dhënat e tua personale</p>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-xl shadow-sm border">
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
