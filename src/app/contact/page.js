import Link from "next/link";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { getPublicSettings } from "@/actions/settingsActions";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Kontakt | Furniture Shop",
  description:
    "Na kontaktoni për pyetje rreth produkteve, porosive ose bashkëpunimeve.",
};

const SOCIAL_LABELS = {
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  whatsapp: "WhatsApp",
};

export default async function ContactPage() {
  const settings = await getPublicSettings();
  const socialLinks = Object.entries(settings.socialLinks || {}).filter(
    ([, url]) => url,
  );

  const infoItems = [
    {
      icon: Mail,
      label: "Email",
      value: settings.storeEmail,
      href: `mailto:${settings.storeEmail}`,
    },
    settings.storePhone && {
      icon: Phone,
      label: "Telefon",
      value: settings.storePhone,
      href: `tel:${settings.storePhone.replace(/\s+/g, "")}`,
    },
    {
      icon: MapPin,
      label: "Adresa",
      value: "Tiranë, Shqipëri",
    },
    {
      icon: Clock,
      label: "Orari",
      value: "E Hënë – E Shtunë, 09:00 – 18:00",
    },
  ].filter(Boolean);

  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="container mx-auto px-4 py-16 text-center lg:py-20">
        <p className="text-sm font-semibold tracking-[0.2em] text-wood uppercase">
          Kontakt
        </p>
        <h1 className="mx-auto mt-2 max-w-2xl font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
          Na shkruani, jemi këtu për t&apos;ju ndihmuar
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft">
          Pyetje për një produkt, një porosi ekzistuese, apo dëshironi
          këshillim personal? Ekipi ynë përgjigjet brenda 24 orësh.
        </p>
      </section>

      {/* Form + Info */}
      <section className="container mx-auto grid grid-cols-1 gap-8 px-4 pb-20 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ContactForm />
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-sand bg-paper p-6">
            <h2 className="font-display text-lg font-medium text-ink">
              Të dhënat e kontaktit
            </h2>
            <div className="mt-5 space-y-5">
              {infoItems.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sand/70 text-wood">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-xs text-ink-soft">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        className="font-medium text-ink transition hover:text-wood"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="font-medium text-ink">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {socialLinks.length > 0 && (
            <div className="rounded-2xl border border-sand bg-paper p-6">
              <h2 className="font-display text-lg font-medium text-ink">
                Na ndiqni
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {socialLinks.map(([key, url]) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-sand px-4 py-2 text-sm font-medium text-ink transition hover:border-wood hover:text-wood"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {SOCIAL_LABELS[key] || key}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-sand bg-[#231a13] p-6 text-white">
            <h2 className="font-display text-lg font-medium">
              Keni një porosi ekzistuese?
            </h2>
            <p className="mt-2 text-sm text-[#b3a695]">
              Ndiqni statusin e porosisë suaj direkt nga dashboard-i juaj.
            </p>
            <Link
              href="/dashboard/orders"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-wood px-5 py-2.5 text-sm font-medium text-white transition hover:bg-wood-dark"
            >
              Shiko Porositë
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
