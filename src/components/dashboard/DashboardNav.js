// src/components/dashboard/DashboardNav.js
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardNav({ items, variant = "sidebar" }) {
  const pathname = usePathname();

  const isActive = (href) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  if (variant === "mobile") {
    return (
      <ul className="flex min-w-max gap-2">
        {items.map((item) => {
          const active = isActive(item.href);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
                }`}
              >
                <span className="h-4 w-4">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul className="space-y-1.5">
      {items.map((item) => {
        const active = isActive(item.href);

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                active
                  ? "bg-indigo-500 text-white shadow-sm"
                  : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
              }`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                  active
                    ? "bg-white/20 text-white"
                    : "text-slate-400 group-hover:bg-white group-hover:text-indigo-600"
                }`}
              >
                <span className="h-5 w-5">{item.icon}</span>
              </span>

              <span>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
