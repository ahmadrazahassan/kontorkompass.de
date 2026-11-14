import type { Doc } from '@/content/data';
import photos from '../../public/media/photo-manifest.json';
import vectors from '../../public/media/vector-manifest.json';

type BriefImage = { src: string; alt: string; aiGenerated: boolean };

const SLUG_TO_ID: Record<string, string> = {
  'ratgeber/e-rechnung-2027-pflicht-unternehmen': 'R01',
  'ratgeber/e-rechnungen-empfangen-pflicht-2025': 'N01',
  'ratgeber/e-rechnung-kleinunternehmer': 'R04',
  'ratgeber/e-rechnungen-archivieren-gobd': 'N02',
  'ratgeber/buchhaltungssoftware-kleine-unternehmen': 'R07',
  'ratgeber/gobd-einfach-erklaert': 'N03',
  'ratgeber/lohnabrechnungssoftware-kleine-unternehmen': 'R16',
  'ratgeber/hr-software-mittelstand': 'R20',
  'ratgeber/arbeitszeiterfassung-pflicht-arbeitgeber': 'R23',
  'ratgeber/erp-einfuehrung-mittelstand': 'R25',
  'ratgeber/erp-kosten-mittelstand': 'N04',
  'magazin/e-rechnung-fristen-bis-2028': 'N05',
  'ratgeber/kleinunternehmerregelung-grenzen-pflichten': 'N06',
  'ratgeber/umsatzsteuervoranmeldung-elster-fristen': 'R11',
  'ratgeber/minijob-abrechnen-geringfuegigkeitsgrenze': 'R18',
  'ratgeber/zeiterfassungssystem-auswaehlen': 'R24',
  // Magazin: pain points and solutions (2026-11-09), own photos N07–N21
  'magazin/belegchaos-buero-belege-digitalisieren': 'N07',
  'magazin/zahlungsverzug-kunden-mahnwesen-automatisieren': 'N08',
  'magazin/e-rechnung-2027-unternehmen-nicht-vorbereitet': 'N09',
  'magazin/excel-am-limit-wann-ein-erp-sinnvoll-ist': 'N10',
  'magazin/insellosungen-datensilos-buchhaltung-lohn-warenwirtschaft': 'N11',
  'magazin/lagerbestand-ohne-ueberblick-handel': 'N12',
  'magazin/lohnabrechnung-fehler-meldepflichten-kleine-betriebe': 'N13',
  'magazin/urlaubsplanung-digital-statt-zuruf': 'N14',
  'magazin/onboarding-nachweisgesetz-arbeitsvertrag-fristen': 'N15',
  'magazin/ueberstunden-arbeitszeitkonto-erfassen': 'N16',
  'magazin/ki-im-mittelstand-huerden-einstieg': 'N17',
  'magazin/cloud-software-datenschutz-avv-dsgvo': 'N18',
  'magazin/zusammenarbeit-steuerbuero-datev-export': 'N19',
  'magazin/buerokratie-mittelstand-zeit-sparen-software': 'N20',
  'magazin/wachstum-kleinunternehmergrenze-ueberschritten': 'N21',
};

export function briefImage(doc: Pick<Doc, 'kind' | 'slug'>): BriefImage | undefined {
  const id = SLUG_TO_ID[`${doc.kind}/${doc.slug}`];
  if (!id) return undefined;
  const photo = photos.find((item) => item.id === id);
  if (photo) return { src: photo.avif, alt: photo.alt, aiGenerated: true };
  const vector = vectors.find((item) => item.id === id);
  return vector ? { src: vector.file, alt: vector.alt, aiGenerated: false } : undefined;
}

// 1200x630 JPEG for social sharing (made by scripts/make-og-images.mjs).
export function briefShareImage(doc: Pick<Doc, 'kind' | 'slug'>): string | undefined {
  const id = SLUG_TO_ID[`${doc.kind}/${doc.slug}`];
  return id ? `/media/og/${id}.jpg` : undefined;
}
