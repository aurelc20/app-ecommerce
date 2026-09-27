import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Armchair,
  Boxes,
  Package,
  RotateCcw,
  ShieldCheck,
  Sofa,
  Table2,
  Truck,
} from "lucide-react";
import { getProducts } from "@/actions/productActions";
import { PRODUCT_CATEGORIES, categoryLabel } from "@/lib/categories";
import ProductGrid from "@/components/ProductGrid";

const CATEGORY_ICONS = {
  Chairs: Armchair,
  Tables: Table2,
  Armchairs: Sofa,
  Sets: Boxes,
  Other: Package,
};

const VALUE_PROPS = [
  {
    icon: Truck,
    title: "Transport falas",
    text: "Për porosi mbi $100, kudo në Shqipëri.",
  },
  {
    icon: ShieldCheck,
    title: "Pagesë e sigurt",
    text: "Checkout i mbrojtur, të dhëna të koduara.",
  },
  {
    icon: RotateCcw,
    title: "Kthim i lehtë",
    text: "14 ditë afat për kthim ose ndërrim.",
  },
];

export default async function Home() {
  const { products } = await getProducts({
    isFeatured: true,
    limit: 8,
    sortBy: "newest",
  });

  const featuredProducts =
    products?.length > 0
      ? products
      : (await getProducts({ limit: 8, sortBy: "newest" })).products;

  const heroProduct = featuredProducts?.[0];
  const heroImage =
    heroProduct?.images?.find((img) => img.isPrimary) ||
    heroProduct?.images?.[0];

  const categoryTiles = PRODUCT_CATEGORIES.map((cat) => ({
    ...cat,
    thumbnail: featuredProducts?.find((p) => p.category === cat.value)
      ?.images?.[0],
  }));

  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="mb-4 text-sm font-semibold tracking-[0.2em] text-wood uppercase">
              Koleksioni 2026
            </p>
            <h1 className="font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl lg:text-6xl">
              Mobilje që kthejnë çdo shtëpi në një hapësirë premium
            </h1>
            <p className="mt-6 max-w-lg text-lg text-ink-soft">
              Dizajn i qëndrueshëm, materiale të zgjedhura me kujdes dhe punime
              artizanale — koleksion i kuruar për t&apos;ju dhënë komoditet dhe
              eleganca njëkohësisht.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-wood px-7 py-3.5 font-medium text-white transition hover:bg-wood-dark"
              >
                Shiko Koleksionin
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full border border-sand px-7 py-3.5 font-medium text-ink transition hover:border-wood hover:text-wood"
              >
                Rreth Nesh
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-4/5 overflow-hidden rounded-4xl border border-sand bg-sand/50 shadow-2xl shadow-ink/10">
              {heroImage ? (
                <Image
                  src={heroImage.url}
                  alt={heroImage.alt || heroProduct.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 90vw, 45vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Armchair
                    className="h-24 w-24 text-wood/40"
                    strokeWidth={1}
                  />
                </div>
              )}
            </div>

            {heroProduct && (
              <div className="absolute -bottom-6 left-6 right-6 rounded-2xl border border-sand bg-paper p-5 shadow-xl shadow-ink/10 sm:left-10 sm:right-auto sm:w-72">
                <p className="text-xs font-medium tracking-wide text-wood uppercase">
                  {categoryLabel(heroProduct.category)}
                </p>
                <p className="mt-1 font-display text-lg font-medium text-ink line-clamp-1">
                  {heroProduct.name}
                </p>
                <p className="mt-1 text-lg font-semibold text-ink">
                  ${heroProduct.salePrice ?? heroProduct.price}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-wood uppercase">
              Kategoritë
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ink">
              Gjej pjesën e duhur
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden items-center gap-1 font-medium text-wood hover:text-wood-dark sm:flex"
          >
            Të gjitha <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categoryTiles.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.value] || Package;
            return (
              <Link
                key={cat.value}
                href={`/shop?category=${encodeURIComponent(cat.value)}`}
                className="group relative overflow-hidden rounded-2xl border border-sand bg-paper p-6 text-center transition hover:-translate-y-1 hover:shadow-lg hover:shadow-ink/10"
              >
                {cat.thumbnail ? (
                  <div className="absolute inset-0 opacity-0 transition group-hover:opacity-10">
                    <Image
                      src={cat.thumbnail.url}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <div className="relative mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sand/70 text-wood transition group-hover:bg-wood group-hover:text-white">
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <p className="relative font-medium text-ink">{cat.label}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured products */}
      {featuredProducts?.length > 0 && (
        <section className="border-y border-sand bg-paper/60 py-16">
          <div className="container mx-auto px-4">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="text-sm font-semibold tracking-[0.2em] text-wood uppercase">
                  Të zgjedhura
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-ink">
                  Produkte të Zgjedhura
                </h2>
              </div>
              <Link
                href="/shop"
                className="hidden items-center gap-1 font-medium text-wood hover:text-wood-dark sm:flex"
              >
                Shiko të gjitha <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <ProductGrid products={featuredProducts} />
          </div>
        </section>
      )}

      {/* Value props */}
      <section className="container mx-auto grid grid-cols-1 gap-8 px-4 py-16 sm:grid-cols-3">
        {VALUE_PROPS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sand/70 text-wood">
              <Icon className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <div>
              <p className="font-display text-lg font-medium text-ink">
                {title}
              </p>
              <p className="mt-1 text-sm text-ink-soft">{text}</p>
            </div>
          </div>
        ))}
      </section>

      {/* CTA band */}
      <section className="mx-4 mb-16 overflow-hidden rounded-3xl bg-[#231a13] px-8 py-16 text-center sm:mx-auto sm:max-w-5xl">
        <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
          Krijo hapësirën që gjithmonë ke ëndërruar
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[#b3a695]">
          Shfleto koleksionin e plotë ose na kontakto për këshillim personal nga
          ekipi ynë i dizajnit.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-wood px-7 py-3.5 font-medium text-white transition hover:bg-wood-dark"
          >
            Shiko Koleksionin
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 font-medium text-white transition hover:border-white/50"
          >
            Kontakto Ekipin
          </Link>
        </div>
      </section>
    </div>
  );
}
