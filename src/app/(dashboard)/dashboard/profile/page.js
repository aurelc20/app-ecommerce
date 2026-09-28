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

  const user = await getUserById();

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-ink">
          Profili Im
        </h1>
        <p className="mt-2 text-ink-soft">Menaxho të dhënat e tua personale</p>
      </div>

      {/* Profile Form */}
      <div className="rounded-2xl border border-sand bg-paper">
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
