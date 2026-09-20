// src/components/Footer.jsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 bg-gray-900 py-12 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-xl font-bold">Furniture Shop</h3>

            <p className="text-gray-400">
              Paisje shtëpie dhe zyre ekskluzive dhe elegante.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Links</h4>

            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/shop" className="transition hover:text-white">
                  Shop
                </Link>
              </li>

              <li>
                <Link href="/about" className="transition hover:text-white">
                  Rreth Nesh
                </Link>
              </li>

              <li>
                <Link href="/contact" className="transition hover:text-white">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Ndihmë</h4>

            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/faq" className="transition hover:text-white">
                  FAQ
                </Link>
              </li>

              <li>
                <Link href="/shipping" className="transition hover:text-white">
                  Transporti
                </Link>
              </li>

              <li>
                <Link href="/returns" className="transition hover:text-white">
                  Kthimet
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Na Kontaktoni</h4>

            <ul className="space-y-2 text-gray-400">
              <li>Email: info@furnitureshop.com</li>
              <li>Tel: +355 69 XXX XXXX</li>
              <li>Tiranë, Shqipëri</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2026 app-ecommerce. Të gjitha të drejtat e rezervuara.</p>
        </div>
      </div>
    </footer>
  );
}
