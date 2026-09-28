// src/components/dashboard/DashboardNav.js
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardNav({ items, variant = "sidebar" }) {
  const pathname = usePathname();

  // Zërat me `exact` (p.sh. /dashboard dhe /dashboard/profile) ndriçohen vetëm
  // në rrugën e tyre të saktë, që nënfaqet të mos i shënojnë edhe ata si aktivë.
  const isActive = ({ href, exact }) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  if (variant === "mobile") {
    return (
      <ul className="flex min-w-max gap-2">
        {items.map((item) => {
          const active = isActive(item);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-wood text-white shadow-sm"
                    : "text-ink hover:bg-sand/60 hover:text-wood"
                }`}
              >
                <span>{item.icon}</span>
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
        const active = isActive(item);

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-base font-medium transition duration-200 ${
                active
                  ? "bg-wood text-white shadow-sm"
                  : "text-ink hover:bg-sand/60 hover:text-wood"
              }`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition  ${
                  active
                    ? "bg-white/20 text-white"
                    : "text-ink-soft group-hover:bg-paper group-hover:text-wood"
                }`}
              >
                {item.icon}
              </span>

              <span>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
