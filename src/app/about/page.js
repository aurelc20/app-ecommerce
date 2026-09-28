import Image from "next/image";
import Link from "next/link";
import {
  Armchair,
  ArrowRight,
  Award,
  Hammer,
  Heart,
  Leaf,
} from "lucide-react";
import { getProducts } from "@/actions/productActions";
import Eyebrow from "@/components/Eyebrow";

export const metadata = {
  title: "Rreth Nesh | Furniture Shop",
  description:
    "Njihuni me historinë, vlerat dhe zanatin pas mobiljeve Furniture Shop.",
};

const VALUES = [
  {
    icon: Hammer,
    title: "Zanat i vërtetë",
    text: "Çdo pjesë kalon nëpër duart e artizanëve me përvojë shumëvjeçare, jo nëpër linja prodhimi masiv.",
  },
  {
    icon: Leaf,
    title: "Materiale të qëndrueshme",
    text: "Punojmë me dru dhe tekstile të certifikuara, të zgjedhura për jetëgjatësi dhe kujdes ndaj mjedisit.",
  },
  {
    icon: Award,
    title: "Cilësi e garantuar",
    text: "Çdo produkt kontrollohet me kujdes përpara se t'ju arrijë, me garanci reale pas shitjes.",
  },
  {
    icon: Heart,
    title: "Kujdes për detajin",
    text: "Nga skica e parë deri te përfundimi final, çdo detaj mendohet për komoditetin tuaj të përditshëm.",
  },
];

const STATS = [
  { value: "12+", label: "vite përvojë" },
  { value: "3,400+", label: "klientë të kënaqur" },
  { value: "250+", label: "produkte në koleksion" },
  { value: "18", label: "qytete të shërbyera" },
];

export default async function AboutPage() {
  const { products } = await getProducts({ limit: 3, sortBy: "newest" });
  const [imgA, imgB] = products || [];

  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <Eyebrow align="left" className="mb-4">
              Rreth Nesh
            </Eyebrow>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              Mobilje të krijuara për t&apos;i dhënë jetë shtëpisë suaj
            </h1>
            <p className="mt-6 max-w-lg text-lg text-ink-soft">
              Furniture Shop lindi nga një pasion i thjeshtë: t&apos;ju
              sjellim mobilje që kombinojnë dizajnin modern me zanatin
              tradicional. Sot, çdo pjesë e koleksionit tonë vazhdon të
              udhëhiqet nga i njëjti parim — cilësi që zgjat.
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
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-sand px-7 py-3.5 font-medium text-ink transition hover:border-wood hover:text-wood"
              >
                Na Kontaktoni
              </Link>
            </div>
          </div>

          <div className="relative grid grid-cols-2 gap-4">
            <div className="relative aspect-3/4 translate-y-6 overflow-hidden rounded-3xl border border-sand bg-sand/50 shadow-xl shadow-ink/10">
              {imgA?.images?.[0] ? (
                <Image
                  src={imgA.images[0].url}
                  alt={imgA.images[0].alt || imgA.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 45vw, 25vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Armchair className="h-16 w-16 text-wood/40" strokeWidth={1} />
                </div>
              )}
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-3xl border border-sand bg-sand/50 shadow-xl shadow-ink/10">
              {imgB?.images?.[0] ? (
                <Image
                  src={imgB.images[0].url}
                  alt={imgB.images[0].alt || imgB.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 45vw, 25vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Armchair className="h-16 w-16 text-wood/40" strokeWidth={1} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="border-y border-sand bg-paper/60 py-16">
        <div className="container mx-auto grid grid-cols-1 gap-10 px-4 lg:grid-cols-3">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-wood uppercase">
              Historia jonë
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ink">
              Nga një punishte e vogël, në një koleksion premium
            </h2>
          </div>
          <div className="lg:col-span-2 space-y-4 text-ink-soft">
            <p>
              Gjithçka nisi si një punishte familjare, ku çdo mobilje
              punohej me duar dhe kujdes për klientë të zonës. Me kalimin e
              viteve, ai pasion u shndërrua në një koleksion të plotë mobiljesh
              premium — pa hequr dorë kurrë nga standardet e para të cilësisë.
            </p>
            <p>
              Sot bashkëpunojmë me zejtarë dhe furnitorë të zgjedhur me kujdes
              për t&apos;ju ofruar mobilje që zgjasin gjeneratë pas gjenerate,
              të dizajnuara për jetën e përditshme moderne.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold tracking-[0.2em] text-wood uppercase">
            Çfarë na dallon
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink">
            Vlerat që udhëheqin çdo mobilje
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-sand bg-paper p-6 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-ink/10"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sand/70 text-wood">
                <Icon className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <p className="font-display text-lg font-medium text-ink">
                {title}
              </p>
              <p className="mt-2 text-sm text-ink-soft">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-sand bg-paper/60 py-16">
        <div className="container mx-auto grid grid-cols-2 gap-8 px-4 text-center sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-4xl font-semibold text-wood">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-ink-soft">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="mx-4 my-16 overflow-hidden rounded-3xl bg-ink px-8 py-16 text-center sm:mx-auto sm:max-w-5xl">
        <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
          Gati të rinovoni hapësirën tuaj?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/70">
          Zbuloni koleksionin e plotë ose na shkruani për këshillim personal
          nga ekipi ynë.
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
