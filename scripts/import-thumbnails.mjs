// Imports N01..N21 from ../brand-input/thumbnails into public/media as AVIF + WebP and adds them to the photo manifest.
import sharp from "sharp";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const manifestPath = join(root, "public/media/photo-manifest.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

const ITEMS = [
  { id: "N01", dir: "ratgeber", name: "ratgeber-e-rechnungen-empfangen-foto", title: "E-Rechnungen empfangen", alt: "Mitarbeiterin einer Hausverwaltung sortiert am Stehtisch die eingehende Post, daneben ein Laptop" },
  { id: "N02", dir: "ratgeber", name: "ratgeber-e-rechnungen-archivieren-foto", title: "E-Rechnungen GoBD-konform archivieren", alt: "Mitarbeiter zieht im Archivraum einer Druckerei einen Ordner aus einem Rollregal" },
  { id: "N03", dir: "ratgeber", name: "ratgeber-gobd-einfach-erklaert-foto", title: "GoBD einfach erklärt", alt: "Inhaber einer Fahrradwerkstatt sortiert im Büro Belege in Ordner und versieht einen mit Datumsstempel" },
  { id: "N04", dir: "ratgeber", name: "ratgeber-erp-kosten-foto", title: "ERP-Kosten", alt: "Zwei Personen vergleichen in einer Gärtnerei ausgedruckte Kostenaufstellungen und einen Taschenrechner" },
  { id: "N05", dir: "magazin", name: "magazin-e-rechnung-fristen-foto", title: "E-Rechnung: Alle Fristen bis 2028", alt: "Mitarbeiterin markiert an einem großen Jahresplaner an der Bürowand einen Termin" },
  { id: "N06", dir: "ratgeber", name: "ratgeber-kleinunternehmerregelung-foto", title: "Kleinunternehmerregelung", alt: "Inhaberin eines kleinen Friseursalons geht nach Ladenschluss am Empfangstresen Belege durch" },
  // Batch 2 (Magazin, 09.11.2026): one photo per new article. After import, map the slugs in src/lib/brief-images.ts.
  { id: "N07", dir: "magazin", name: "magazin-belegchaos-foto", title: "Belegchaos: Belege digitalisieren", alt: "Floristin fotografiert im Hinterzimmer ihres Blumenladens einen Kassenbon aus einem Karton voller Belege" },
  { id: "N08", dir: "magazin", name: "magazin-zahlungsverzug-foto", title: "Zahlungsverzug und Mahnwesen", alt: "Inhaber eines Cateringbetriebs prüft im Büro eine Liste offener Rechnungen" },
  { id: "N09", dir: "magazin", name: "magazin-e-rechnung-nicht-vorbereitet-foto", title: "E-Rechnung 2027: Unternehmen nicht vorbereitet", alt: "Drei Mitarbeitende eines Verpackungsherstellers planen an einem Whiteboard mit Haftnotizen die Umstellung" },
  { id: "N10", dir: "magazin", name: "magazin-excel-am-limit-foto", title: "Excel am Limit", alt: "Inhaber einer Kaffeerösterei vergleicht markierte Tabellenausdrucke an seinem Schreibtisch" },
  { id: "N11", dir: "magazin", name: "magazin-insellosungen-foto", title: "Insellösungen und Datensilos", alt: "Disponentin einer Spedition gleicht Angaben aus zwei Ordnern an ihrem Arbeitsplatz ab" },
  { id: "N12", dir: "magazin", name: "magazin-lager-foto", title: "Lager ohne Überblick", alt: "Inhaber einer Eisenwarenhandlung scannt im Lager eine Kleinteile-Packung aus einer Schublade" },
  { id: "N13", dir: "magazin", name: "magazin-lohnabrechnung-foto", title: "Lohnabrechnung und Meldepflichten", alt: "Lohnsachbearbeiterin eines Reinigungsunternehmens prüft ausgedruckte Gehaltsabrechnungen" },
  { id: "N14", dir: "magazin", name: "magazin-urlaubsplanung-foto", title: "Urlaubsplanung digital", alt: "Praxismanagerin einer Zahnarztpraxis plant am Empfang die Abwesenheiten des Teams" },
  { id: "N15", dir: "magazin", name: "magazin-onboarding-foto", title: "Onboarding und Nachweisgesetz", alt: "Büroleiterin eines Architekturbüros richtet am ersten Arbeitstag den Arbeitsplatz eines neuen Mitarbeiters ein" },
  { id: "N16", dir: "magazin", name: "magazin-ueberstunden-foto", title: "Überstunden und Arbeitszeitkonten", alt: "Koch trägt am frühen Morgen in einer Restaurantküche seine Arbeitszeit am Tablet ein" },
  { id: "N17", dir: "magazin", name: "magazin-ki-mittelstand-foto", title: "KI im Mittelstand", alt: "Buchhalter eines Autohauses vergleicht im Büro über dem Verkaufsraum eine Papierrechnung mit dem Laptop" },
  { id: "N18", dir: "magazin", name: "magazin-cloud-datenschutz-foto", title: "Cloud-Software und Datenschutz", alt: "Geschäftsführerin eines ambulanten Pflegedienstes liest im Büro aufmerksam einen ausgedruckten Vertrag" },
  { id: "N19", dir: "magazin", name: "magazin-steuerbuero-foto", title: "Zusammenarbeit mit dem Steuerbüro", alt: "Physiotherapeut scannt nach Praxisschluss Belege ein und spricht per Videogespräch mit seinem Steuerbüro" },
  { id: "N20", dir: "magazin", name: "magazin-buerokratie-foto", title: "Bürokratie im Mittelstand", alt: "Metzgermeister sitzt abends im Büro seines Betriebs vor einem hohen Stapel Formulare" },
  { id: "N21", dir: "magazin", name: "magazin-kleinunternehmergrenze-foto", title: "Raus aus der Kleinunternehmerregelung", alt: "Grafikdesigner sortiert in seinem Atelier Rechnungen und Notizen neben einem Laptop" },
];

for (const it of ITEMS) {
  const src = join(root, "..", "brand-input", "thumbnails", `${it.id}.png`);
  if (!existsSync(src)) { console.warn("missing", src); continue; }
  const base = sharp(src).resize(1600, 900, { fit: "cover", position: "attention" }).toColorspace("srgb");
  const avif = `/media/${it.dir}/${it.name}.avif`;
  const webp = `/media/${it.dir}/${it.name}.webp`;
  await base.clone().avif({ quality: 52 }).toFile(join(root, "public", avif));
  await base.clone().webp({ quality: 78 }).toFile(join(root, "public", webp));
  await sharp(src).resize(1200, 630, { fit: "cover", position: "attention" }).jpeg({ quality: 82, mozjpeg: true }).toFile(join(root, "public/media/og", `${it.id}.jpg`));
  const entry = { id: it.id, title: it.title, alt: it.alt, caption: "Symbolbild (KI-generiert)", credit: "KI-generiert", avif, webp };
  const i = manifest.findIndex((m) => m.id === it.id);
  if (i >= 0) manifest[i] = entry; else manifest.push(entry);
  console.log("imported", it.id);
}
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
