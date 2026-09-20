// src/lib/categories.js
//
// Burimi i vetëm i kategorive. Vlera ruhet në anglisht në bazë (dhe përdoret
// te query-t e filtrave), ndërsa etiketa shfaqet në shqip në ndërfaqe.
export const PRODUCT_CATEGORIES = [
  { value: "Chairs", label: "Karrige" },
  { value: "Tables", label: "Tavolina" },
  { value: "Armchairs", label: "Kolltukë" },
  { value: "Sets", label: "Sete" },
  { value: "Other", label: "Tjera" },
];

// Vlerat e lejuara te skema e produktit
export const CATEGORY_VALUES = PRODUCT_CATEGORIES.map((c) => c.value);

// Kthen etiketën shqip për një vlerë. Nëse vlera nuk njihet — p.sh. një
// kategori e vjetër që ka mbetur në bazë — kthen vetë vlerën, që ndërfaqja
// të mos shfaqë bosh.
export function categoryLabel(value) {
  return PRODUCT_CATEGORIES.find((c) => c.value === value)?.label || value;
}
