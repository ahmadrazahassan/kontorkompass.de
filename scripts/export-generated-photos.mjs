import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const sourceDir = process.argv[2];
if (!sourceDir) throw new Error('Pass the generated image directory.');

const sources = {
  R01: '8ef1d9e2-cc01-45ae-aa1d-b67c9073e38d',
  R04: '80110583-d7c0-400c-bc96-40a853ed89e4',
  R06: 'aac05722-065d-4e7a-a262-565685d3c2c9',
  R07: '72beb8fd-2778-4e9f-9c27-ae2cf462a34c',
  R08: '3c184691-d811-4b68-a442-75513cf1879e',
  R11: 'c331a3f1-623b-4edb-bf74-12bfb3e93252',
  R14: 'd80135bd-cb87-40db-a63c-0daa1b5122e0',
  R15: '28ed2e99-ab40-47ad-b7f8-57d1b0a55012',
  R16: '553334ed-acc2-498c-9772-2dc9ea83c1d0',
  R17: '4ac92d6a-804a-4474-8b36-e31a4ed63ff5',
  R18: '14b190c7-5903-4969-915c-a36be52aaa9a',
  R20: '28fef40c-e61b-4830-8e9a-f2445005d040',
  R23: '27c1f154-476e-4b77-b5d3-177afe58a1e3',
  R24: 'fdf1234a-e0e1-4860-8825-2dca84c92333',
  R25: 'bc9c8188-a736-44c9-b810-36dca2110fa7',
  R28: '70b88457-0964-4f08-98d8-ece1f49b535e',
  R29: '6c42b8fb-5723-4ade-8264-46b99cc35e77',
  M06: 'fcc81bac-01cd-48fe-afa5-a38d0b1734b6',
  M10: '9f07048f-7e7c-496f-856b-67e72a9e3cac',
  M15: '6ccef862-b7d0-44a0-89e5-1350966f8629',
  T01: '42b3a212-83aa-4696-8e1f-32024b66b041',
  T02: 'a6a1ff84-4ac3-42a9-be12-b20bc5f4a826',
};

const root = path.resolve(import.meta.dirname, '../..');
const output = path.join(root, 'site/public/media');
const brief = await fs.readFile(path.join(root, 'IMAGE_PROMPTS.md'), 'utf8');
const slug = (s) => s.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/&/g, ' und ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const altOverrides = {
  R17: 'Inhaberin eines Handwerksbetriebs übergibt einem neuen Mitarbeiter eine Mappe',
  R23: 'Mitarbeiterin hält am Eingang einer Produktionshalle ihren Ausweis an ein Zeiterfassungsterminal',
  R28: 'Lagermitarbeiter scannt im Großhandelslager einen Karton',
  R29: 'Maschinenbedienerin prüft in einer Fertigungshalle ein Terminal neben einer CNC-Maschine',
};
const records = [];

for (const [id, uuid] of Object.entries(sources)) {
  const line = brief.split('\n').find((l) => l.startsWith(`| ${id} |`));
  if (!line) throw new Error(`Missing brief row: ${id}`);
  const cells = line.split('|').map((s) => s.trim());
  const title = id === 'T01' ? 'Über uns' : id === 'T02' ? 'Methodik' : cells[2].replaceAll('`', '');
  const alt = altOverrides[id] || cells[5] || (id === 'T01' ? 'Redaktionsschreibtisch mit Rechercheunterlagen und Laptop' : 'Person gleicht eine gedruckte Quelle mit Notizen ab');
  const filename = id.startsWith('R') ? `ratgeber-${slug(title)}-hero` : id.startsWith('M') ? `magazin-${slug(title)}-hero` : id === 'T01' ? 'ueber-uns-hero' : 'methodik-hero';
  const folder = id.startsWith('R') ? 'ratgeber' : id.startsWith('M') ? 'magazin' : 'trust';
  const dir = path.join(output, folder);
  await fs.mkdir(dir, { recursive: true });
  const src = path.join(sourceDir, `exec-${uuid}.png`);
  const stem = path.join(dir, filename);
  const image = sharp(src).resize(1600, 900, { fit: 'cover', position: 'centre' }).toColourspace('srgb');
  await image.clone().avif({ quality: 50, effort: 6 }).toFile(`${stem}.avif`);
  await image.clone().webp({ quality: 75, effort: 6 }).toFile(`${stem}.webp`);
  records.push({ id, title, alt, caption: 'Symbolbild (KI-generiert)', credit: 'KI-generiert', avif: `/media/${folder}/${filename}.avif`, webp: `/media/${folder}/${filename}.webp`, source: src });
}

await fs.writeFile(path.join(output, 'photo-manifest.json'), JSON.stringify(records.map(({ source, ...record }) => record), null, 2) + '\n');

const composite = [];
for (let i = 0; i < records.length; i++) {
  const { id, title, source } = records[i];
  const x = (i % 4) * 320;
  const y = Math.floor(i / 4) * 214;
  composite.push({ input: await sharp(source).resize(320, 180, { fit: 'cover' }).png().toBuffer(), left: x, top: y });
  const label = Buffer.from(`<svg width="320" height="34"><rect width="320" height="34" fill="#0E1420"/><text x="8" y="22" font-size="14" fill="white" font-family="Arial">${id} · ${title.replaceAll('&', '&amp;')}</text></svg>`);
  composite.push({ input: label, left: x, top: y + 180 });
}
await sharp({ create: { width: 1280, height: Math.ceil(records.length / 4) * 214, channels: 3, background: '#FFFFFF' } }).composite(composite).webp({ quality: 80 }).toFile(path.join(output, 'photo-contact-sheet.webp'));
console.log(`Exported ${records.length} photos and contact sheet to ${output}`);
