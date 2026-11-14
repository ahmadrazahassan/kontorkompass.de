// Official market statistics for the "Marktdaten" dashboard. Every figure links to its primary source.
export type StatSource = { label: string; url: string; date: string };

export const SRC = {
  kiTable: {
    label: "Destatis, Unternehmen mit Nutzung von KI nach Beschäftigtengrößenklassen 2025",
    url: "https://www.destatis.de/DE/Themen/Branchen-Unternehmen/Unternehmen/IKT-in-Unternehmen-IKT-Branche/Tabellen/ikti-unternehmen-kuenstliche-intelligenz.html",
    date: "24.11.2025",
  },
  ki2024: {
    label: "Destatis, Pressemitteilung Nr. 444 vom 25. November 2024",
    url: "https://www.destatis.de/DE/Presse/Pressemitteilungen/2024/11/PD24_444_52911.html",
    date: "25.11.2024",
  },
  cloud2025: {
    label: "Destatis, Pressemitteilung Nr. 416 vom 24. November 2025",
    url: "https://www.destatis.de/DE/Presse/Pressemitteilungen/2025/11/PD25_416_52911.html",
    date: "24.11.2025",
  },
  kmu2024: {
    label: "Destatis, Anteile kleiner und mittlerer Unternehmen an ausgewählten Merkmalen 2024",
    url: "https://www.destatis.de/DE/Themen/Branchen-Unternehmen/Unternehmen/Kleine-Unternehmen-Mittlere-Unternehmen/Tabellen/wirtschaftsabschnitte-insgesamt.html",
    date: "12.08.2026",
  },
  kmuUmsatz: {
    label: "Destatis, KMU-Anteile am Umsatz nach Wirtschaftsbereichen 2024",
    url: "https://www.destatis.de/DE/Themen/Branchen-Unternehmen/Unternehmen/Kleine-Unternehmen-Mittlere-Unternehmen/aktuell-umsatz.html",
    date: "12.08.2026",
  },
} satisfies Record<string, StatSource>;

/** AI use, enterprises with 10+ employees, share in %. 2022 was not surveyed. */
export const KI_TREND = [
  { label: "2021", value: 11 },
  { label: "2023", value: 12 },
  { label: "2024", value: 20 },
  { label: "2025", value: 26 },
];

export const KI_BY_SIZE = [
  { label: "10–49", y2024: 17, y2025: 23 },
  { label: "50–249", y2024: 28, y2025: 36 },
  { label: "250+", y2024: 48, y2025: 57 },
];

/** AI technologies 2025, % of AI-using enterprises, by size class. */
export const KI_TECH = {
  cols: ["Gesamt", "10–49", "50–249", "250+"],
  rows: [
    { label: "Text Mining", values: [52, 51, 53, 57] },
    { label: "Bilder, Video, Audio erzeugen", values: [52, 51, 55, 57] },
    { label: "Spracherkennung", values: [42, 41, 43, 50] },
    { label: "Natürliche Sprache erzeugen", values: [35, 32, 40, 50] },
    { label: "Abläufe automatisieren", values: [27, 26, 25, 37] },
    { label: "Maschinelles Lernen", values: [23, 21, 25, 39] },
    { label: "Bilderkennung", values: [17, 16, 17, 24] },
    { label: "Autonome Maschinen", values: [6, 5, 6, 12] },
  ],
};

/** Reasons against AI 2024, % of non-users who considered AI. */
export const KI_HURDLES = [
  { label: "Fehlendes Wissen", value: 71 },
  { label: "Unklare rechtliche Folgen", value: 58 },
  { label: "Datenschutz und Privatsphäre", value: 53 },
  { label: "Verfügbarkeit oder Qualität der Daten", value: 45 },
  { label: "Nicht kompatibel mit vorhandenen Systemen", value: 44 },
  { label: "Hohe Kosten", value: 28 },
  { label: "Ethische Bedenken", value: 23 },
];

/** Where AI is used 2024, % of AI users. */
export const KI_USES = [
  { label: "Marketing oder Vertrieb", value: 33 },
  { label: "Produktions- oder Dienstleistungsprozesse", value: 25 },
  { label: "Verwaltung oder Management", value: 24 },
  { label: "Rechnungswesen, Controlling, Finanzen", value: 24 },
];

export const CLOUD_TOTAL = 54;
export const CLOUD_BY_SIZE = [
  { label: "10–49", value: 51 },
  { label: "50–249", value: 65 },
  { label: "250+", value: 86 },
];
/** Cloud services used, % of cloud-using enterprises (2025). */
export const CLOUD_SERVICES = [
  { label: "E-Mail", value: 76 },
  { label: "Datenspeicherung", value: 71 },
  { label: "Office-Anwendungen", value: 68 },
  { label: "ERP-Software", value: 23 },
  { label: "CRM-Software", value: 23 },
];
export const CLOUD_SECTORS = [
  { label: "Information und Kommunikation", value: 88 },
  { label: "Gastgewerbe", value: 45 },
  { label: "Verkehr und Lagerei", value: 43 },
];

/** KMU vs. large enterprises 2024, shares in %. */
export const KMU_SPLIT = [
  { label: "Unternehmen", kmu: 99.3, gross: 0.7 },
  { label: "Tätige Personen", kmu: 53.7, gross: 46.3 },
  { label: "Investitionen", kmu: 44.2, gross: 55.8 },
  { label: "Wertschöpfung", kmu: 41.3, gross: 58.7 },
  { label: "Umsatz", kmu: 27.2, gross: 72.8 },
];
export const KMU_CLASSES = [
  { label: "Kleinstunternehmen", value: 82.9 },
  { label: "Kleine Unternehmen", value: 14.0 },
  { label: "Mittlere Unternehmen", value: 2.5 },
  { label: "Großunternehmen", value: 0.7 },
];
export const KMU_TURNOVER_SECTORS = [
  { label: "Gastgewerbe", value: 78 },
  { label: "Baugewerbe", value: 71 },
  { label: "Energieversorgung", value: 3 },
];
