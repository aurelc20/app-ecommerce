// src/components/Footer.jsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#231a13] py-12 text-[#e8ddd0]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 font-display text-xl font-semibold text-white">
              Furniture Shop
            </h3>

            <p className="text-[#b3a695]">
              Mobilje dhe pajisje shtëpie ekskluzive dhe elegante.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Links</h4>

            <ul className="space-y-2 text-[#b3a695]">
              <li>
                <Link href="/shop" className="transition hover:text-wood">
                  Produktet
                </Link>
              </li>

              <li>
                <Link href="/about" className="transition hover:text-wood">
                  Rreth Nesh
                </Link>
              </li>

              <li>
                <Link href="/contact" className="transition hover:text-wood">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Ndihmë</h4>

            <ul className="space-y-2 text-[#b3a695]">
              <li>
                <Link href="/faq" className="transition hover:text-wood">
                  FAQ
                </Link>
              </li>

              <li>
                <Link href="/shipping" className="transition hover:text-wood">
                  Transporti
                </Link>
              </li>

              <li>
                <Link href="/returns" className="transition hover:text-wood">
                  Kthimet
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Na Kontaktoni</h4>

            <ul className="space-y-2 text-[#b3a695]">
              <li>Email: info@furnitureshop.com</li>
              <li>Tel: +355 69 XXX XXXX</li>
              <li>Tiranë, Shqipëri</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-8 text-center text-[#b3a695]">
          <p>&copy; 2026 Codeentech. Të gjitha të drejtat e rezervuara.</p>
        </div>
      </div>
    </footer>
  );
}
