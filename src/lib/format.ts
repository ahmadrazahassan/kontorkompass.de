const eur = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
const eur0 = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

export const formatEur = (n: number) => (Number.isInteger(n) ? eur0.format(n) : eur.format(n));
export const formatPercent = (n: number) => `${new Intl.NumberFormat("de-DE").format(n)} %`;

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
export const formatDateShort = (iso: string) =>
  new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(iso));
export const formatMonthYear = (iso: string) =>
  new Intl.DateTimeFormat("de-DE", { month: "long", year: "numeric" }).format(new Date(iso));

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
