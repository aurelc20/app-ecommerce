// src/app/(admin)/admin/settings/page.js
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSettings } from "@/actions/admin/settingsActions";
import SettingsTabs from "@/components/admin/SettingsTabs";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  const settings = await getSettings();

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Menaxho konfigurimet e dyqanit</p>
      </div>

      <SettingsTabs settings={settings} />
    </div>
  );
}
