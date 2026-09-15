// src/app/(admin)/admin/layout.js
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
  title: "Admin Dashboard - Perlë",
  description: "Admin panel për menaxhimin e e-commerce",
};

export default async function AdminLayout({ children }) {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/analytics", label: "Statistikat", icon: "📈" },
    { href: "/admin/products", label: "Produktet", icon: "📦" },
    { href: "/admin/orders", label: "Porositë", icon: "🛒" },
    { href: "/admin/users", label: "Përdoruesit", icon: "👥" },
    { href: "/admin/reviews", label: "Reviews", icon: "⭐" },
    { href: "/admin/settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg fixed h-full overflow-y-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-purple-600">Perlë Admin</h1>
          <p className="text-sm text-gray-600 mt-1">Paneli i Kontrollit</p>
        </div>

        <nav className="mt-6">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
          >
            ← Kthehu në Shop
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">{children}</main>
    </div>
  );
}
