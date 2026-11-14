import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '../..');
const out = path.join(root, 'site/public/media');
const brief = await fs.readFile(path.join(root, 'IMAGE_PROMPTS.md'), 'utf8');
const rows = Object.fromEntries(brief.split('\n').filter((s) => /^\| (?:G|K|R|M|S)\d\d \|/.test(s)).map((s) => { const c = s.split('|').map((x) => x.trim()); return [c[1], c]; }));
const slug = (s) => s.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/&/g, ' und ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const B = '#006BFF', N = '#004796', D = '#00254F', L = '#ADCFFF', P = '#EBF3FF', G = '#F4F5F7', C = '#0AE8F0', I = '#0E1420';
const r = (x,y,w,h,f=B,rx=8) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${f}"/>`;
const c = (x,y,rad,f=B) => `<circle cx="${x}" cy="${y}" r="${rad}" fill="${f}"/>`;
const p = (d,f=B) => `<path d="${d}" fill="${f}"/>`;
const doc = (x,y,w=130,h=180,f='#FFFFFF') => r(x,y,w,h,f,12)+r(x+20,y+27,w-40,12,L,3)+r(x+20,y+54,w-58,9,P,2)+r(x+20,y+76,w-48,9,P,2);
const grid = (x,y,cols,rows,n=24,g=9,primary=B) => Array.from({length:cols*rows},(_,i)=>r(x+(i%cols)*(n+g),y+Math.floor(i/cols)*(n+g),n,n,i%3===0?primary:L,3)).join('');
const shield = (x,y,s=1,f=N) => p(`M${x} ${y}l${55*s} ${-16*s} ${55*s} ${16*s}v${55*s}q0 ${65*s} -${55*s} ${89*s}q-${55*s} -${24*s} -${55*s} -${89*s}z`,f);
const wrap = (body,{w=800,h=450,bg=G}={}) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w*2}" height="${h*2}">${r(0,0,w,h,bg,0)}${body}</svg>`;

function art(id) {
  switch(id) {
    case 'R02': return r(145,130,260,170,P,18)+p('M145 145l130 92 130-92v155H145z',L)+r(430,235,220,90,N,10)+grid(450,170,5,2,20,13,B);
    case 'R03': return doc(165,115,180,230)+grid(188,165,5,4,20,8,B)+r(475,130,180,230,L,12)+doc(455,115,180,230)+r(480,270,130,35,P,4);
    case 'R05': return Array.from({length:5},(_,i)=>r(140+i*100,120,75,220,i===2?B:L,9)+r(154+i*100,142,46,12,i===2?C:N,3)).join('')+shield(332,230,.45,N);
    case 'R09': return r(155,90,490,270,P,20)+grid(205,137,8,5,42,10,B)+r(510,300,38,38,C,3);
    case 'R10': return r(120,198,80,56,N,8)+r(260,198,80,56,B,8)+r(420,150,80,56,L,8)+r(540,205,80,56,B,8)+r(655,145,35,56,N,6)+r(195,222,65,8,L,0)+r(340,222,80,8,L,0);
    case 'R12': return r(115,145,145,170,N,10)+r(540,145,145,170,B,10)+r(260,219,280,10,L,0)+grid(300,180,5,2,25,20,B);
    case 'R13': return r(120,105,255,240,P,15)+grid(145,140,5,5,30,12,N)+r(425,105,255,240,P,15)+grid(450,140,5,5,30,12,B);
    case 'R19': return r(115,145,230,180,N,10)+doc(175,160,110,145,P)+r(345,227,150,10,L,0)+r(505,165,155,150,B,10)+r(545,205,75,70,P,5);
    case 'R21': return r(225,105,310,240,L,12)+r(255,90,310,240,P,12)+doc(285,105,270,230)+shield(435,245,.65,N);
    case 'R22': return r(180,80,440,290,'#FFFFFF',15)+r(180,80,440,45,N,12)+grid(218,157,7,4,43,11,L)+r(325,212,43,43,B,3)+r(379,212,43,43,B,3)+r(433,212,43,43,C,3);
    case 'R26': return r(448,85,105,230,P,5)+r(120,305,560,8,N,0)+[85,150,110,210,165].map((h,i)=>r(145+i*105,305-h,72,h,i===3?B:L,5)).join('');
    case 'R27': return r(125,150,190,190,N,10)+Array.from({length:4},(_,i)=>r(152,177+i*36,135,16,L,3)).join('')+r(350,235,90,8,L,0)+r(485,135,180,55,B,10)+r(505,205,180,55,L,10)+r(485,275,180,55,N,10);
    case 'R30': return doc(245,62,310,330)+[0,1,2,3,4].map((i)=>r(280,185+i*37,22,22,i===2?B:L,3)+r(320,191+i*37,185,10,P,2)).join('')+r(590,94,18,280,N,3);
    case 'M02': return doc(270,70,260,310)+c(450,288,37,N)+r(305,165,180,10,L,2)+r(305,192,155,10,L,2);
    case 'M03': return p('M155 130l65-15 25 75-70 20z',L)+p('M195 245l80-20 23 55-70 25z',N)+p('M275 130l70 22-20 55-75-13z',P)+r(385,195,90,72,B,6)+grid(500,145,4,4,32,13,N);
    case 'M04': return doc(190,120,165,220)+doc(270,100,165,220,P)+shield(395,150,1.1,N)+r(443,210,22,30,C,3);
    case 'M07': return r(230,105,310,250,L,15)+r(260,85,310,250,'#FFFFFF',15)+r(260,85,310,45,N,10)+grid(290,160,5,3,36,15,L)+r(443,211,36,36,C,3)+p('M540 85l30 45h-30z',B);
    case 'M08': return [0,1,2].map((i)=>r(135+i*185,145+(2-i)*33,145,205-(2-i)*33,i===1?B:L,12)+r(165+i*185,270,85,16,i===1?P:N,3)).join('')+r(350,120,30,30,C,4);
    case 'M09': return r(105,170,135,110,N,10)+r(355,115,135,110,B,10)+r(560,210,135,110,L,10)+r(240,218,115,8,B,0)+r(490,218,70,8,B,0)+c(352,218,13,C)+c(548,218,13,C);
    case 'M12': return grid(110,145,4,4,30,11,N)+grid(505,145,4,4,30,11,B)+p('M300 265q95-145 195-30l-18 15q-82-88-165 27z',L);
    case 'M14': return grid(175,110,7,5,36,18,L)+shield(385,120,1.4,N);
    case 'G04': return r(205,165,170,200,L,12)+r(315,115,170,200,P,12)+r(425,65,170,200,'#FFFFFF',12)+r(480,105,50,38,C,4);
    case 'G05a': return r(100,145,95,150,N,4)+r(205,145,95,150,B,4)+r(180,155,40,128,L,3)+r(118,175,48,12,P,2)+r(235,175,48,12,P,2);
    case 'G05b': return doc(120,75,170,250)+r(255,92,60,60,B,5)+r(268,108,34,24,C,3);
    case 'G05c': return r(65,70,270,270,'#FFFFFF',12)+r(65,70,270,45,N,10)+grid(90,145,5,4,34,13,L)+r(231,239,34,34,B,3);
    case 'G05d': return doc(95,70,200,250)+r(260,80,55,55,B,5)+r(279,99,17,17,C,1);
    case 'G06': return r(180,180,440,200,L,12)+p('M180 180l220 145 220-145z',B)+r(265,80,270,170,'#FFFFFF',8)+r(300,116,200,10,N,2)+r(300,146,165,10,P,2);
    case 'S01': return grid(80,140,5,4,31,14,L)+c(215,185,83,B)+c(215,185,58,G)+p('M260 235l95 95-25 25-95-95z',N);
    case 'S02': return r(70,265,90,65,N,5)+r(160,205,90,125,B,5)+r(250,145,90,185,L,5)+r(250,90,90,40,P,5);
    case 'S03': return `<g transform="rotate(-7 200 200)">${doc(110,65,180,265)}</g>`+r(265,265,65,65,B,5)+r(295,280,8,28,C,2);
    case 'S04': return r(65,125,270,190,L,12)+p('M65 125l135 100 135-100z',B)+r(225,235,35,35,N,4)+p('M230 250l10 12 21-25 10 8-31 35-18-22z',C);
    case 'S05': return [0,1,2].map(i=>r(55+i*100,110,80,175,i===1?L:P,8)+r(70+i*100,145,50,9,'#FFFFFF',2)).join('');
    case 'S06': return doc(80,60,215,270)+[0,1,2].map(i=>r(115,170+i*42,22,22,B,3)+r(150,175+i*42,105,10,L,2)).join('')+p('M285 280h75l-38 60z',N);
    case 'S07': return r(50,95,220,145,L,20)+p('M115 230l-45 45v-45z',L)+r(145,175,210,135,B,20)+p('M280 300l35 40v-40z',B);
    case 'S08': return doc(55,65,170,255)+r(245,230,60,18,B,3)+r(265,170,20,65,N,3)+r(210,185,130,8,N,1)+r(203,205,45,35,L,4)+r(300,205,45,35,L,4)+r(235,85,35,35,C,3);
    default: throw new Error(`Missing illustration: ${id}`);
  }
}

const illustrations = [
  ['G04','global/home-fokus-e-rechnung.svg','home-fokus-e-rechnung.svg'],
  ['G05a','global/methodik-01-quellen.svg','methodik-01-quellen.svg'],['G05b','global/methodik-02-zahlen.svg','methodik-02-zahlen.svg'],['G05c','global/methodik-03-pruefen.svg','methodik-03-pruefen.svg'],['G05d','global/methodik-04-transparent.svg','methodik-04-transparent.svg'],
  ['G06','global/newsletter-illustration.svg','newsletter-illustration.svg'],
  ...['R02','R03','R05','R09','R10','R12','R13','R19','R21','R22','R26','R27','R30'].map(id=>[id,`ratgeber/ratgeber-${slug(rows[id][2])}-hero.svg`]),
  ...['M02','M03','M04','M07','M08','M09','M12','M14'].map(id=>[id,`magazin/magazin-${slug(rows[id][2])}-hero.svg`]),
  ...['S01','S02','S03','S04','S05','S06','S07','S08'].map(id=>[id,`spots/${rows[id][2].replaceAll('`','')}`]),
];
const methodAlts = {
  G05a: 'Symbol für Primärquellen',
  G05b: 'Symbol für belegte Zahlen',
  G05c: 'Symbol für regelmäßige Prüfung',
  G05d: 'Symbol für gekennzeichnete Werbelinks',
};
const manifest = [];
for (const [id, rel] of illustrations) {
  const small = id.startsWith('S') || id.startsWith('G05');
  const dark = id === 'G04';
  const svg = wrap(art(id), small ? {w:400,h:400,bg:G} : {bg:dark?D:G});
  const target = path.join(out,rel);
  await fs.mkdir(path.dirname(target),{recursive:true});
  await fs.writeFile(target,svg);
  const row=rows[id.slice(0,3)];
  manifest.push({id,file:`/media/${rel.replaceAll('\\','/')}`,alt:methodAlts[id] ?? row?.[id.startsWith('S')?5: id.startsWith('G')?7:5] ?? ''});
}

function halftone({w=800,h=600,dot=B,bg=P,focal=[.3,.55],mode='smooth',freq=4,secondary=null,pitch=25}) {
  let dots=''; const max=pitch*.46, radius=Math.hypot(w,h)*.65;
  for(let y=pitch/2;y<h;y+=pitch) for(let x=pitch/2;x<w;x+=pitch) {
    const d=Math.hypot(x-focal[0]*w,y-focal[1]*h)/radius;
    const t=Math.max(0,1-d);
    const fall=mode==='linear' ? t : mode==='rings' ? Math.max(0,Math.sin((1-d)*Math.PI*freq))*t : t*t*(3-2*t);
    const rad=Math.round(max*fall*10)/10;
    if(rad>.7) dots+=c(Math.round(x),Math.round(y),rad,secondary&&Math.floor(x/pitch+y/pitch)%7===0?secondary:dot);
  }
  return wrap(dots,{w,h,bg});
}
function contour({w=800,h=600,a=B,b=N,seed=101,bands=12,rotate=0}) {
  const x=Math.round(w*(.35+(seed%7)*.045)),y=Math.round(h*(.34+(seed%11)*.027));
  const max=Math.round(Math.hypot(w,h)*.78);
  const rings=Array.from({length:bands},(_,i)=>c(x,y,Math.round(max*(bands-i)/bands),i%2?a:b)).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w*2}" height="${h*2}"><defs><filter id="flow" x="-40%" y="-40%" width="180%" height="180%"><feTurbulence type="fractalNoise" baseFrequency="0.004" numOctaves="2" seed="${seed}" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="${Math.round(w*.22)}" xChannelSelector="R" yChannelSelector="G"/></filter></defs>${r(0,0,w,h,b,0)}<g transform="rotate(${rotate} ${w/2} ${h/2})" filter="url(#flow)">${rings}</g></svg>`;
}
const patterns=[
  ['G01','global/home-hero-kontur.svg',contour({w:600,h:480,a:B,b:N,seed:101})],
  ['G02','global/home-hero-kontur-mobile.svg',contour({w:800,h:450,a:B,b:N,seed:101,rotate:90})],
  ['K01','categories/kategorie-buchhaltung-finanzen.svg',halftone({dot:B,bg:P,focal:[.3,.55]})],
  ['K02','categories/kategorie-rechnungsstellung-e-rechnung.svg',contour({a:B,b:N,seed:202})],
  ['K03','categories/kategorie-lohn-gehalt.svg',halftone({dot:N,bg:G,focal:[0,.5],mode:'linear'})],
  ['K04','categories/kategorie-hr-personal.svg',halftone({dot:C,secondary:'#7AB3FF',bg:D,focal:[.5,.5],mode:'rings',freq:4})],
  ['K05','categories/kategorie-erp-warenwirtschaft.svg',contour({a:N,b:D,seed:505})],
  ['K06','categories/kategorie-zeiterfassung.svg',halftone({dot:B,bg:'#FFFFFF',focal:[.7,.4],mode:'rings',freq:6})],
  ['K07','categories/kategorie-crm-vertrieb.svg',contour({a:'#7AB3FF',b:B,seed:707})],
  ['K08','categories/kategorie-marketing-software.svg',halftone({dot:'#3D8FFF',bg:P,focal:[.75,.3]})],
  ['K09','categories/kategorie-projektmanagement.svg',halftone({dot:N,bg:'#ECEEF1',focal:[.5,1],mode:'linear'})],
  ['K10','categories/kategorie-zusammenarbeit.svg',contour({a:L,b:B,seed:1010})],
  ['K11','categories/kategorie-e-commerce.svg',halftone({dot:B,secondary:C,bg:D,focal:[.3,.7],mode:'rings',freq:3})],
  ['K12','categories/kategorie-dokumentenmanagement.svg',halftone({dot:D,bg:G,focal:[.6,.6]})],
  ['K13','categories/kategorie-it-sicherheit-datenschutz.svg',contour({a:N,b:I,seed:1313})],
  ['M01',`magazin/magazin-${slug(rows.M01[2])}-hero.svg`,contour({w:800,h:450,a:B,b:N,seed:2027})],
  ['M05',`magazin/magazin-${slug(rows.M05[2])}-hero.svg`,halftone({w:800,h:450,dot:N,bg:P,focal:[.2,.8]})],
  ['M13',`magazin/magazin-${slug(rows.M13[2])}-hero.svg`,halftone({w:800,h:450,dot:B,bg:'#FFFFFF',focal:[.5,.5],mode:'rings',freq:5})],
];
for(const [id,rel,svg] of patterns) {const target=path.join(out,rel);await fs.mkdir(path.dirname(target),{recursive:true});await fs.writeFile(target,svg);manifest.push({id,file:`/media/${rel}`,alt:''});}
const panel=Buffer.from(halftone({w:840,h:360,dot:L,bg:G,focal:[.85,.5],pitch:22}));
await sharp(panel).resize(2520,1080).blur(40).avif({quality:45}).toFile(path.join(out,'global/home-panel-hintergrund.avif'));
manifest.push({id:'G03',file:'/media/global/home-panel-hintergrund.avif',alt:''});
await fs.writeFile(path.join(out,'vector-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
const tiles=[];
for(let i=0;i<manifest.length;i++) {
  const entry=manifest[i],x=(i%6)*200,y=Math.floor(i/6)*160;
  const preview=await sharp(path.join(root,'site/public',entry.file)).resize(200,130,{fit:'cover'}).png().toBuffer();
  tiles.push({input:preview,left:x,top:y});
  const label=Buffer.from(`<svg width="200" height="30"><rect width="200" height="30" fill="#0E1420"/><text x="7" y="20" font-family="Arial" font-size="15" fill="white">${entry.id}</text></svg>`);
  tiles.push({input:label,left:x,top:y+130});
}
await sharp({create:{width:1200,height:Math.ceil(manifest.length/6)*160,channels:3,background:'#FFFFFF'}}).composite(tiles).webp({quality:80}).toFile(path.join(out,'vector-contact-sheet.webp'));
console.log(`Generated ${manifest.length} vector/pattern assets.`);
