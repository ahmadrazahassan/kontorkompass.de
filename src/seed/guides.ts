// Adds three more guides, their sources and the Sage Lohnabrechnung profile. Safe to re-run (skips existing slugs).
// Run: pnpm exec payload run src/seed/guides.ts
import { getPayload } from "payload";
import config from "../../payload.config";
import { affiliateCta, callout, doc, h2, ol, p, steps, table, ul } from "./lexical";

const payload = await getPayload({ config });
const day = (s: string) => new Date(`${s}T12:00:00.000Z`).toISOString();
const TODAY = "2026-11-06";

const first = async (collection: any, where: any) => (await payload.find({ collection, where, limit: 1, depth: 0 })).docs[0] as any;
const cat = async (slug: string) => (await first("categories", { slug: { equals: slug } })).id;
const srcId = async (n: number) => (await first("sources", { number: { equals: n } })).id;

/* ---------- sources ---------- */
const NEW_SOURCES = [
  { number: 7, publisher: "IHK Rhein-Neckar", title: "Arbeitszeiterfassung", url: "https://www.ihk.de/rhein-neckar/recht/arbeitsrecht/arbeitszeiterfassung-5631422", type: "kammer" },
  { number: 8, publisher: "Kliemt.Arbeitsrecht (Dr. Daniela Quink-Hamdan)", title: "Gesetzesentwurf zur Arbeitszeit 2026: Was jetzt zu erwarten ist (13.05.2026)", url: "https://kliemt.blog/2026/05/13/gesetzesentwurf-zur-arbeitszeit-2026-was-jetzt-zu-erwarten-ist/", type: "presse" },
  { number: 9, publisher: "Sage GmbH", title: "Sage Lohnabrechnung (Produkt- und Preisseite)", url: "https://www.sage.com/de-de/sage-business-cloud/lohnabrechnung/", type: "anbieter" },
  { number: 10, publisher: "IHK München und Oberbayern", title: "Ordnungsgemäße Buchführung: GoBD", url: "https://www.ihk-muenchen.de/de/Service/Recht-und-Steuern/Steuerrecht/Finanzverwaltung/Grunds%C3%A4tze-zur-elektronischen-Buchf%C3%BChrung-(GOBD)/", type: "kammer" },
  { number: 11, publisher: "Haufe", title: "GoBD (Themenseite)", url: "https://www.haufe.de/thema/gobd/", type: "presse" },
];
for (const s of NEW_SOURCES) {
  if (!(await first("sources", { number: { equals: s.number } }))) {
    await payload.create({ collection: "sources", data: { ...s, type: s.type as never, accessedAt: day(TODAY) } });
  }
}

/* ---------- Sage Lohnabrechnung profile ---------- */
let link = await first("affiliate-links", { slug: { equals: "sage-lohnabrechnung-testen" } });
if (!link) {
  link = await payload.create({
    collection: "affiliate-links",
    data: { slug: "sage-lohnabrechnung-testen", partner: "Sage", trackingUrl: "https://www.sage.com/de-de/sage-business-cloud/lohnabrechnung/", isAffiliate: false, network: "Impact (nach Freigabe)", active: true },
  });
}
let sageLohn = await first("software", { slug: { equals: "sage-lohnabrechnung" } });
if (!sageLohn) {
  const lexware = await first("software", { slug: { equals: "lexware-office" } });
  sageLohn = await payload.create({
    collection: "software",
    data: {
      name: "Sage Lohnabrechnung",
      slug: "sage-lohnabrechnung",
      vendor: "Sage GmbH",
      categories: [await cat("lohn-gehalt"), await cat("hr-personal")] as never,
      summary: "Cloud-Lösung für Lohn- und Gehaltsabrechnung mit automatischem Meldungsversand und HR-Funktionen, in drei Tarifen (Essentials, Standard, Premium).",
      affiliateLink: link.id,
      ctaLabel: "Kostenlos testen",
      trial: "30 Tage",
      entryPrice: 20,
      facts: [
        { label: "Bereitstellung", value: "Cloud (Browser); Mobile App im Tarif Essentials aufgeführt" },
        { label: "Tarife", value: "Payroll Essentials, Standard, Premium" },
        { label: "Mitarbeitende", value: "5 inklusive; bis zu 150 Mitarbeitende hinzufügbar" },
        { label: "Einstiegspreis", value: "20 € pro Monat zzgl. MwSt. (Essentials, regulär)" },
        { label: "Testphase", value: "30 Tage kostenlos" },
        { label: "Kündigung", value: "laut Anbieter jederzeit möglich, keine langfristigen Verträge" },
        { label: "Meldungen", value: "gesetzliche Meldungen werden laut Anbieter automatisch erstellt und an Behörden und Krankenkassen versendet" },
        { label: "Buchhaltungsexport", value: "Sage und DATEV (laut Anbieter)" },
        { label: "Serverstandort / AVV", value: "auf der Produktseite nicht angegeben" },
      ],
      plans: [
        { name: "Payroll Essentials", monthlyNet: 20, billing: "monatlich, 5 Mitarbeitende inklusive; weitere 3 € je Mitarbeiter/Monat", includes: "Lohnabrechnung inkl. gesetzlicher Meldungen, Zugriff auf Abrechnungen für Mitarbeitende, Buchhaltungsexport (Sage & DATEV), elementare HR-Funktionen (u. a. Mobile App)" },
        { name: "Payroll Standard", monthlyNet: 30, billing: "monatlich, 5 Mitarbeitende inklusive; weitere 5 € je Mitarbeiter/Monat", includes: "alles aus Essentials plus Onboarding-Portal, Arbeitszeiten & Überstunden, Genehmigungs-Workflows, Urlaub & Abwesenheiten, Organigramm; Recruiting und Performance optional zubuchbar" },
        { name: "Payroll Premium", monthlyNet: 40, billing: "monatlich, 5 Mitarbeitende inklusive; weitere 7 € je Mitarbeiter/Monat", includes: "alles aus Standard plus Schichtplanung und Einsatzpläne, Einreichen und Genehmigen von Mitarbeiterausgaben per App" },
      ],
      priceNote: "Alle Preise zzgl. MwSt., Stand 06.11.2026. Es gelten die AGB des Anbieters.",
      fits: [{ text: "kleine Unternehmen, die die Lohnabrechnung digital und mit automatischem Meldungsversand erledigen möchten" }, { text: "Betriebe, die Lohn und einfache HR-Funktionen (Urlaub, Abwesenheiten) in einer Lösung bündeln wollen" }],
      notFits: [{ text: "Unternehmen mit mehr als 150 Mitarbeitenden (Obergrenze laut Anbieter)" }, { text: "Unternehmen, die Lohn, Buchhaltung und Rechnungen in einer Lösung suchen (dafür nennt Sage Active)" }],
      alternatives: [lexware.id, (await first("software", { slug: { equals: "sage-active" } })).id] as never,
      sources: [await srcId(9)] as never,
      verified: day(TODAY),
    },
  });
}

/* ---------- guides ---------- */
const guides = [
  {
    slug: "arbeitszeiterfassung-pflicht-arbeitgeber",
    title: "Arbeitszeiterfassung: Was Arbeitgeber heute erfassen müssen und was gesetzlich geplant ist",
    seoTitle: "Arbeitszeiterfassung: Pflichten für Arbeitgeber",
    description: "Seit dem BAG-Beschluss von 2022 müssen Arbeitgeber Arbeitszeiten erfassen. Was das heißt, wer ausgenommen ist und was die geplante Gesetzesänderung bringt.",
    category: "zeiterfassung",
    readingMinutes: 6,
    lead: "Arbeitgeber in Deutschland müssen die Arbeitszeit ihrer Beschäftigten erfassen. Das folgt aus einem Beschluss des Bundesarbeitsgerichts. Wie genau das zu geschehen hat, soll ein neues Gesetz regeln. Dieser Ratgeber fasst den aktuellen Stand zusammen und zeigt, wie Sie die Erfassung sinnvoll organisieren.",
    hasAffiliate: false,
    sourceNumbers: [7, 8],
    seed: 41,
    takeaways: [
      "Pflicht: Arbeitgeber müssen Beginn, Ende und Dauer der täglichen Arbeitszeit erfassen, einschließlich Überstunden und Pausen.",
      "Form: Das Gesetz schreibt aktuell keine bestimmte Form vor. Papier und elektronische Systeme sind zulässig.",
      "Grundlage: Das Bundesarbeitsgericht hat die Pflicht am 13. September 2022 aus dem Arbeitsschutzgesetz abgeleitet.",
      "Reform: Eine Änderung des Arbeitszeitgesetzes ist angekündigt. Sie soll unter anderem die elektronische Erfassung regeln. Ob und wann sie in Kraft tritt, prüfen Sie vor Umsetzung neu.",
      "Bußgeld: Ein Verstoß gegen die Erfassungspflicht selbst ist derzeit nicht unmittelbar bußgeldbewehrt. Ordnet die Behörde Maßnahmen an, kann Nichtbefolgung bis zu 30.000 € kosten.",
    ],
    faqs: [
      { q: "Darf ich die Erfassung an meine Beschäftigten übertragen?", a: "Ja. Die Aufzeichnung kann delegiert werden, die Aufzeichnungen müssen aber nachprüfbar sein und auf Verlangen vorgelegt werden können." },
      { q: "Reicht eine Excel-Tabelle oder ein Zettel?", a: "Nach dem derzeitigen Stand ist keine bestimmte Form vorgeschrieben. Entscheidend ist, dass Beginn, Ende und Pausen nachvollziehbar und nachprüfbar erfasst werden." },
      { q: "Gilt die Pflicht auch bei Vertrauensarbeitszeit?", a: "Vertrauensarbeitszeit bleibt nach den bisherigen Äußerungen zur geplanten Reform möglich. Sie entbindet aber nicht von der Erfassung." },
      { q: "Muss der Betriebsrat zustimmen?", a: "Der Betriebsrat hat nach der IHK-Darstellung kein Initiativrecht zur Einführung eines Systems. Bei der Ausgestaltung kann er mitbestimmen, soweit keine gesetzlichen oder tariflichen Regeln bestehen." },
    ],
    body: async () => [
      h2("Worauf die Pflicht beruht"),
      p("Das Bundesarbeitsgericht (BAG) hat am 13. September 2022 entschieden (Az. 1 ABR 22/21), dass Arbeitgeber ein System zur Erfassung der Arbeitszeit einführen und nutzen müssen. Die Begründung wurde am 3. Dezember 2022 veröffentlicht. Das Gericht leitet die Pflicht aus § 3 Abs. 2 Nr. 1 des Arbeitsschutzgesetzes ab und liest ihn im Licht des EU-Rechts. [7]"),
      p("Zuvor hatte der Europäische Gerichtshof am 14. Mai 2019 (C-55/18) ein „objektives, verlässliches und zugängliches System“ zur Arbeitszeiterfassung verlangt. [7]"),
      h2("Was Arbeitgeber erfassen müssen"),
      ul([
        "**Beginn und Ende** der täglichen Arbeitszeit, einschließlich Überstunden",
        "**Pausenzeiten**, nicht nur die Gesamtstunden. Der Vermerk, dass eine Pause von 30 Minuten stattfand, genügt nicht.",
        "Die Aufzeichnungen müssen **nachprüfbar** sein und auf Verlangen vorgelegt werden können.",
      ]),
      p("Eine bestimmte Form ist nicht vorgeschrieben. Elektronische und Papier-Systeme sind zulässig. Die Erfassung kann an die Beschäftigten delegiert werden. Das Landesamt für Arbeitsschutz in Berlin (LAGetSi) akzeptiert nach der IHK-Darstellung ein Muster-Protokoll mit Datum, Beginn, Ende, Pausen, Dauer und Bemerkungen, bis neue Regeln gelten. [7]"),
      callout("tip", "Praxistipp", "Legen Sie einheitlich fest, wer wann einträgt (täglich, spätestens am nächsten Arbeitstag) und wer die Einträge prüft. Ein Protokoll, das regelmäßig geprüft wird, ist belastbarer als eine Sammlung nachträglicher Schätzungen."),
      h2("Wer ist erfasst?"),
      p("Die Pflicht betrifft grundsätzlich alle Beschäftigten nach § 5 Abs. 1 des Betriebsverfassungsgesetzes. Leitende Angestellte (§ 5 Abs. 3 BetrVG) sind nach der IHK-Darstellung voraussichtlich ausgenommen. [7]"),
      h2("Bußgeld und Betriebsrat"),
      p("Ein Verstoß gegen die Erfassungspflicht ist derzeit nicht unmittelbar mit einem Bußgeld belegt. Die Behörde kann aber konkrete Maßnahmen anordnen. Wird eine solche Anordnung nicht befolgt, kann ein Bußgeld von bis zu 30.000 € verhängt werden. [7]"),
      p("Der Betriebsrat kann die Einführung eines Systems nicht selbst anstoßen. Bei der Ausgestaltung kann er mitbestimmen, soweit keine gesetzlichen oder tariflichen Regeln bestehen. [7]"),
      h2("Was die geplante Gesetzesänderung bedeutet"),
      p("Das Bundesarbeitsministerium hat einen Referentenentwurf zur Änderung des Arbeitszeitgesetzes vorgelegt, der sich nach Darstellung der IHK in einem frühen Stadium befindet. Nach diesem Entwurf wäre die elektronische Erfassung von Beginn, Ende und Dauer der Arbeitszeit verpflichtend, jeweils am Tag der Arbeitsleistung. Die Übergangsfristen sollen nach Unternehmensgröße gestaffelt sein, sehr kleine Betriebe könnten dauerhaft ohne elektronische Erfassung auskommen. Vertrauensarbeitszeit bliebe möglich, hebt die Erfassungspflicht aber nicht auf. [7]"),
      p("Nach Angaben einer Fachkanzlei hatte die Bundesarbeitsministerin im Mai 2026 angekündigt, einen Entwurf im Juni vorzulegen. Zugleich soll die tägliche Höchstarbeitszeit auf eine wöchentliche Betrachtung umgestellt werden. Die Kanzlei betont, dass offen sei, wie erfasst werde, nicht ob. [8]"),
      callout("warn", "Stand der Gesetzgebung prüfen", "Ob und in welcher Form der Entwurf beschlossen wird, war zum Redaktionsstand nicht abschließend belegt. Prüfen Sie vor Ihrer Entscheidung den aktuellen Stand beim Bundesarbeitsministerium oder bei Ihrer Kammer."),
      h2("Papier, Tabelle oder Software?"),
      p("Solange keine Form vorgeschrieben ist, reicht grundsätzlich jedes System, das Beginn, Ende und Pausen nachprüfbar festhält. Mit wachsender Beschäftigtenzahl, mobilen Einsätzen oder mehreren Standorten lohnt sich meist eine digitale Lösung. Folgende Fragen helfen bei der Auswahl:"),
      table([
        ["Frage", "Warum sie zählt"],
        ["Erfasst das System Beginn, Ende und Pausen einzeln?", "Gesamtstunden allein genügen nicht"],
        ["Sind Änderungen nachvollziehbar (wer, wann, was)?", "Nachprüfbarkeit der Aufzeichnungen"],
        ["Lassen sich Daten auf Verlangen exportieren?", "Vorlage gegenüber der Behörde"],
        ["Ist Erfassung mobil oder am Terminal möglich?", "Außendienst, Baustelle, Produktion"],
        ["Gibt es einen Auftragsverarbeitungsvertrag und einen genannten Serverstandort?", "Datenschutz bei Beschäftigtendaten"],
        ["Ist der Betriebsrat eingebunden, falls vorhanden?", "Mitbestimmung bei der Ausgestaltung"],
      ]),
      h2("In fünf Schritten zur Erfassung"),
      steps([
        "**Geltungsbereich festlegen:** Welche Beschäftigten sind erfasst, wer ist ausgenommen?",
        "**Verfahren wählen:** Papier, Tabelle oder Software, passend zu Betriebsgröße und Arbeitsorten.",
        "**Regeln schriftlich fixieren:** Wer trägt wann ein? Wer prüft? Wie werden Fehler korrigiert?",
        "**Beschäftigte informieren:** Kurze Einweisung, einheitliche Vorlage oder Schulung.",
        "**Regelmäßig prüfen:** Stichproben, Archivierung, Anpassung an die künftige gesetzliche Regelung.",
      ]),
    ],
  },
  {
    slug: "lohnabrechnungssoftware-kleine-unternehmen",
    title: "Lohnabrechnungssoftware für kleine Unternehmen: Was sie kostet und worauf es ankommt",
    seoTitle: "Lohnabrechnungssoftware für kleine Unternehmen: Kosten",
    description: "Was Cloud-Lohnabrechnung für kleine Unternehmen kostet, welche Funktionen nötig sind und wie Sie Tarife anhand der Mitarbeiterzahl vergleichen. Mit Rechenbeispielen.",
    category: "lohn-gehalt",
    readingMinutes: 7,
    lead: "Die monatliche Lohnabrechnung ist Pflicht und fehleranfällig. Software kann Berechnung, Meldungen und Unterlagen automatisieren. Dieser Ratgeber zeigt, worauf Sie bei der Auswahl achten, und rechnet mit echten Listenpreisen durch, was Cloud-Lohnabrechnung je nach Mitarbeiterzahl kostet.",
    hasAffiliate: true,
    sourceNumbers: [9, 5],
    seed: 52,
    takeaways: [
      "Preisstruktur: Cloud-Lösungen berechnen meist einen Grundpreis inklusive weniger Mitarbeitender plus einen Aufpreis je weiterer Person.",
      "Beispiel Sage Payroll: Ab 20 € pro Monat zzgl. MwSt. inklusive 5 Mitarbeitenden, jede weitere Person kostet je nach Tarif 3, 5 oder 7 €.",
      "Entscheidend: Automatischer Meldungsversand, Export zur Buchhaltung oder zum Steuerbüro und die Frage, ob HR-Funktionen wie Urlaub oder Arbeitszeiten gebraucht werden.",
      "Testen: Viele Anbieter bieten eine Testphase. Rechnen Sie vorher mit Ihrer tatsächlichen Mitarbeiterzahl.",
    ],
    faqs: [
      { q: "Brauche ich für wenige Mitarbeitende überhaupt Software?", a: "Das hängt von Aufwand und Fehlerrisiko ab. Software automatisiert Berechnung und Meldungen. Alternativ lässt sich die Abrechnung auslagern. Vergleichen Sie Kosten und Aufwand für Ihren konkreten Fall." },
      { q: "Wer übermittelt die gesetzlichen Meldungen?", a: "Bei Cloud-Lösungen wie Sage Payroll werden die gesetzlichen Meldungen laut Anbieter automatisch erstellt und an Behörden und Krankenkassen versendet. Prüfen Sie diesen Punkt bei jedem Anbieter einzeln." },
      { q: "Wie vergleiche ich Preise fair?", a: "Rechnen Sie mit Ihrer tatsächlichen Mitarbeiterzahl, regulären Preisen ohne Aktionsrabatt und zzgl. MwSt. Achten Sie auf inkludierte Mitarbeitende, Aufpreise und Mindestlaufzeiten." },
    ],
    body: async () => [
      h2("Was gute Lohnabrechnungssoftware leisten sollte"),
      p("Die Anforderungen unterscheiden sich je nach Betrieb. Diese Kriterien haben sich bei der Auswahl bewährt:"),
      ul([
        "**Gesetzliche Meldungen:** Werden sie automatisch erstellt und übermittelt? [9]",
        "**Zugriff für Beschäftigte:** Können Mitarbeitende Abrechnungen und Steuerdokumente online abrufen? [9]",
        "**Schnittstellen:** Export in Ihre Buchhaltung oder im DATEV-Format für das Steuerbüro [9]",
        "**HR-Funktionen:** Urlaub, Abwesenheiten, Arbeitszeiten: nur nötig, wenn Sie sie wirklich nutzen",
        "**Skalierung:** Lässt sich die Mitarbeiterzahl flexibel erweitern, und was kostet jede weitere Person?",
        "**Datenschutz:** Auftragsverarbeitungsvertrag und Serverstandort, da es um Beschäftigtendaten geht",
        "**Kündigung und Testphase:** Wie lange läuft der Vertrag, und lässt sich vorher testen?",
      ]),
      h2("Beispiel Sage Payroll: Tarife und Preise"),
      p("Sage bietet Lohnabrechnung als Cloud-Lösung in drei Tarifen an. Alle Tarife enthalten fünf Mitarbeitende, bis zu 150 lassen sich hinzufügen. Alle Preise zzgl. MwSt., Stand 06.11.2026. [9]"),
      table([
        ["Tarif", "Grundpreis / Monat", "Weitere Mitarbeitende", "Zusätzlich enthalten (laut Anbieter)"],
        ["Payroll Essentials", "20 €", "3 € je Person / Monat", "Lohnabrechnung inkl. Meldungen, Zugriff für Beschäftigte, Buchhaltungsexport (Sage & DATEV), elementare HR-Funktionen"],
        ["Payroll Standard", "30 €", "5 € je Person / Monat", "zusätzlich Onboarding-Portal, Arbeitszeiten & Überstunden, Genehmigungs-Workflows, Urlaub & Abwesenheiten"],
        ["Payroll Premium", "40 €", "7 € je Person / Monat", "zusätzlich Schichtplanung, Einsatzpläne, Ausgabenmanagement per App"],
      ]),
      p("Sage nennt eine Testphase von 30 Tagen. Laut Anbieter ist die Kündigung jederzeit möglich, ohne langfristige Verträge. [9]"),
      h2("Was kostet das je nach Mitarbeiterzahl?"),
      p("Rechenbeispiele auf Basis der obigen Listenpreise (eigene Berechnung, zzgl. MwSt., ohne Aktionsrabatte):"),
      table([
        ["Mitarbeitende", "Essentials", "Standard", "Premium"],
        ["5", "20 €", "30 €", "40 €"],
        ["12", "41 € (20 + 7 × 3)", "65 € (30 + 7 × 5)", "89 € (40 + 7 × 7)"],
        ["25", "80 € (20 + 20 × 3)", "130 € (30 + 20 × 5)", "180 € (40 + 20 × 7)"],
      ]),
      callout("info", "Hinweis", "Aktionen wie „50 % Rabatt für einen begrenzten Zeitraum“ ändern sich häufig und sind hier nicht eingerechnet. Entscheidend ist der reguläre Preis nach der Aktion."),
      h2("Andere Wege: Add-on in der Buchhaltung"),
      p("Manche Buchhaltungs-Lösungen bieten Lohn & Gehalt als optionales Modul an. Bei Lexware Office ist die Lohnabrechnung nach Anbieterangabe mit allen Versionen kombinierbar, die Preisstaffeln richten sich nach der Mitarbeiterzahl. [5] Das kann praktisch sein, wenn Sie Buchhaltung und Lohn aus einer Hand wollen. Vergleichen Sie dann die Gesamtkosten.", ),
      affiliateCta(sageLohn.id, "Cloud-Lohnabrechnung ab 20 € pro Monat zzgl. MwSt. mit fünf Mitarbeitenden, automatischem Meldungsversand und Buchhaltungsexport (Sage & DATEV)."),
      h2("In vier Schritten zur passenden Lösung"),
      steps([
        "**Mengengerüst klären:** Wie viele Beschäftigte rechnen Sie heute ab, wie viele in zwölf Monaten?",
        "**Funktionen priorisieren:** Reicht reine Lohnabrechnung, oder brauchen Sie Urlaub, Zeiten und Onboarding?",
        "**Kosten durchrechnen:** Mit regulären Preisen und Ihrer Mitarbeiterzahl, wie im Beispiel oben.",
        "**Testphase nutzen:** Eine echte Abrechnung durchspielen und die Übergabe an Buchhaltung oder Steuerbüro prüfen.",
      ]),
    ],
  },
  {
    slug: "gobd-einfach-erklaert",
    title: "GoBD einfach erklärt: Anforderungen an Buchführung und Software",
    seoTitle: "GoBD einfach erklärt: Anforderungen an die Buchführung",
    description: "Was die GoBD sind, wer sie beachten muss und was das für Belege, Buchungen, Scans, E-Rechnungen und Ihre Buchhaltungssoftware bedeutet.",
    category: "buchhaltung-finanzen",
    readingMinutes: 8,
    lead: "Die GoBD legen fest, wie Unternehmen ihre Bücher elektronisch führen und aufbewahren müssen, damit das Finanzamt sie anerkennt. Der Ratgeber erklärt die Grundsätze verständlich, zeigt, was sich durch die E-Rechnung geändert hat, und nennt Fragen, die Sie Ihrem Software-Anbieter stellen sollten.",
    hasAffiliate: true,
    sourceNumbers: [10, 11, 3, 4],
    seed: 63,
    takeaways: [
      "Geltung: Die GoBD gelten grundsätzlich für alle Unternehmen, die zur Buchführung verpflichtet sind, unabhängig von Größe und Rechtsform, nach IHK-Darstellung auch für Kleinunternehmer mit EÜR.",
      "Version: Maßgeblich ist das BMF-Schreiben vom 28. November 2019, zuletzt angepasst im März 2024 und im Juli 2025.",
      "Unveränderbarkeit: Buchungen dürfen nicht spurlos geändert werden. Korrekturen erfolgen durch Stornieren und Neubuchen.",
      "E-Rechnung: Es genügt in der Regel, den strukturierten XML-Teil aufzubewahren. Der lesbare Teil nur, wenn er zusätzliche steuerlich relevante Informationen enthält.",
      "Verfahrensdokumentation: Für jedes IT-System der Buchführung ist sie vorgesehen. Fehlt sie, ist das nicht automatisch ein schwerer Mangel, solange die Buchführung nachvollziehbar bleibt.",
    ],
    faqs: [
      { q: "Gelten die GoBD auch für Kleinunternehmer?", a: "Nach der Darstellung der IHK München gelten sie für alle zur Buchführung verpflichteten Unternehmen unabhängig von Größe und Rechtsform und auch für Kleinunternehmer, die eine EÜR erstellen." },
      { q: "Darf ich Belege mit dem Smartphone fotografieren?", a: "Haufe nennt das Abfotografieren von Belegen mit Smartphones ausdrücklich als zulässig. Die Originalfassung darf entfallen, wenn keine Veränderung erfolgt, keine aufbewahrungspflichtigen Informationen verloren gehen, die Umwandlung dokumentiert ist und die maschinelle Auswertbarkeit erhalten bleibt." },
      { q: "Was passiert bei Verstößen?", a: "Nach IHK-Darstellung kann die Buchführung verworfen werden, wenn die GoBD nicht erfüllt sind. Das Finanzamt kann den Gewinn dann schätzen, was zu höheren Steuerzahlungen führen kann. Verstöße führen aber nicht zwingend zu Konsequenzen, solange Nachvollziehbarkeit und Nachprüfbarkeit gewahrt bleiben." },
    ],
    body: async () => [
      h2("Was die GoBD sind"),
      p("GoBD steht für „Grundsätze zur ordnungsmäßigen Führung und Aufbewahrung von Büchern, Aufzeichnungen und Unterlagen in elektronischer Form sowie zum Datenzugriff“. Es handelt sich um Verwaltungsgrundsätze der Finanzverwaltung. Sie konkretisieren, wie IT bei Buchführung und Aufzeichnungen eingesetzt werden muss. [10][11]"),
      p("Wer sie nicht beachtet, riskiert, dass die Buchführung nicht anerkannt wird. Das Finanzamt kann den Gewinn dann schätzen, was zu höheren Steuerzahlungen führen kann. [10]"),
      h2("Wer sie beachten muss und welche Fassung gilt"),
      p("Grundsätzlich gelten die GoBD für alle Unternehmen, die zur Buchführung verpflichtet sind, unabhängig von Größe und Rechtsform. Nach der Darstellung der IHK München betrifft das auch Kleinunternehmer, die eine Einnahmen-Überschuss-Rechnung erstellen. [10]"),
      p("Die maßgebliche Fassung ist das BMF-Schreiben vom 28. November 2019, das ab 1. Januar 2020 gilt. Sie wurde durch ein Schreiben vom 11. März 2024 und ein ergänzendes Schreiben vom 14. Juli 2025 angepasst. Die Anpassung 2025 geht vor allem auf die E-Rechnungspflicht im inländischen B2B-Bereich seit 1. Januar 2025 zurück. [10][11]"),
      h2("Die Grundsätze im Überblick"),
      table([
        ["Grundsatz", "Was er bedeutet"],
        ["Nachvollziehbarkeit", "Ein sachverständiger Dritter kann Geschäftsvorfälle in angemessener Zeit prüfen"],
        ["Wahrheit und Richtigkeit", "Aufzeichnungen entsprechen den tatsächlichen Vorgängen, nichts wird manipuliert"],
        ["Vollständigkeit", "Alle Einnahmen und Ausgaben werden erfasst, auch Bareinnahmen"],
        ["Zeitgerechtheit", "Kasse täglich, andere Vorgänge nach IHK-Darstellung innerhalb von 10 Tagen"],
        ["Ordnung", "Aufzeichnungen sind geordnet, Belege lassen sich zuordnen und finden"],
        ["Unveränderbarkeit", "Änderungen bleiben erkennbar, Daten werden bis Fristende nicht gelöscht"],
      ]),
      callout("info", "Hinweis zu den Fristen", "Die Angabe „10 Tage“ für unbare Geschäftsvorfälle stammt aus der IHK-Darstellung. Prüfen Sie Details zu Fristen mit Ihrer Steuerberatung."),
      h2("Unveränderbarkeit in der Praxis"),
      p("Buchungen und Aufzeichnungen dürfen nicht so geändert werden, dass nicht mehr erkennbar ist, was ursprünglich eingetragen war. Korrekturen erfolgen laut IHK durch Stornieren und Neubuchen, nicht durch Überschreiben. Änderungen müssen protokolliert und dokumentiert werden. [10] Elektronische Daten dürfen vor Ablauf der Aufbewahrungsfrist nicht gelöscht werden, eine ausschließlich ausgedruckte Aufbewahrung ist unzulässig. [11]"),
      h2("Verfahrensdokumentation"),
      p("Für jedes IT-System der Buchführung ist eine Verfahrensdokumentation vorgesehen. Sie besteht nach der IHK-Darstellung meist aus vier Teilen: allgemeine Beschreibung, Anwenderdokumentation, technische Systemdokumentation und Betriebsdokumentation. Sie muss dem tatsächlichen Verfahren entsprechen, Änderungen werden dokumentiert und versioniert. Eine fehlende oder unvollständige Dokumentation ist nicht automatisch ein schwerer Mangel, solange die Buchführung nachvollziehbar und prüfbar bleibt. [10]"),
      h2("Belege scannen und fotografieren"),
      p("Belege in Papierform dürfen umgewandelt werden. Vermeiden Sie Formate, die eine Auswertung unmöglich machen, etwa Scans ohne Texterkennung. [10] Haufe nennt das Abfotografieren mit dem Smartphone ausdrücklich als zulässig. Die Originalfassung darf entfallen, wenn keine bildliche oder inhaltliche Veränderung erfolgt, keine aufbewahrungspflichtigen Informationen verloren gehen, die Umwandlung dokumentiert ist und die maschinelle Auswertbarkeit erhalten bleibt. [11]"),
      h2("E-Rechnungen und die GoBD"),
      p("Seit der E-Rechnungspflicht ab 2025 sind E-Rechnungen ausdrücklich in den GoBD verankert. Es genügt in der Regel, den strukturierten Teil (XML) aufzubewahren. Den lesbaren Teil, etwa ein PDF, müssen Sie nur aufbewahren, wenn er steuerlich relevante Zusatzinformationen enthält. Das empfangene Format bleibt maßgeblich, auch mit OCR angereicherte Informationen sind aufzubewahren. [10] Mehr dazu in unserem Ratgeber zur E-Rechnung."),
      h2("Aufbewahrungsfristen"),
      p("Die GoBD selbst legen keine Fristen fest. Diese ergeben sich aus Handels- und Steuergesetzen. [10] Für Rechnungen und Buchungsbelege nennt Haufe eine Frist von acht Jahren, [3] für empfangene Handelsbriefe nennt die IHK München sechs Jahre. [10] Ältere Darstellungen sprechen noch von zehn Jahren. Fristen können je nach Unterlage abweichen und laufen nicht ab, solange die Unterlagen für eine noch nicht verjährte Steuerfestsetzung von Bedeutung sind. [11]"),
      callout("warn", "Fristen mit der Steuerberatung abstimmen", "Die Darstellungen der Quellen weichen bei den Aufbewahrungsfristen voneinander ab. Klären Sie die für Ihre Unterlagen geltende Frist mit Ihrer Steuerberatung, bevor Sie Daten löschen."),
      h2("Was Ihre Software leisten sollte"),
      ul([
        "Änderungen und Stornos nachvollziehbar protokollieren, statt zu überschreiben",
        "Belege dauerhaft und unveränderbar ablegen, mit eindeutigem Index",
        "E-Rechnungen im Originalformat (XML) speichern",
        "Daten exportieren können, etwa im DATEV-Format, für Steuerbüro und Betriebsprüfung",
        "Eine Verfahrensdokumentation oder Hilfen dafür bereitstellen",
        "Vom Anbieter schriftlich zusichern lassen, wie die GoBD-Konformität gewährleistet wird",
      ]),
      p("Viele Anbieter werben mit GoBD-Konformität. Sage nennt für Sage Active nach eigenen Angaben „zertifizierte Software“ und bietet im Tarif Essentials einen Export im DATEV-Format. Fragen Sie nach Zertifikat und Umfang, die Produktseite nennt dazu keine Details. [4]"),
      affiliateCta((await first("software", { slug: { equals: "sage-active" } })).id, "Cloud-Lösung für Rechnungen, Buchhaltung und Lohn mit Export im DATEV-Format; laut Anbieter GoBD-konform."),
    ],
  },
];

const catRel = async (g: (typeof guides)[number]) => await cat(g.category);

for (const g of guides) {
  if (await first("beitraege", { slug: { equals: g.slug } })) {
    console.log("exists:", g.slug);
    continue;
  }
  await payload.create({
    collection: "beitraege",
    draft: false,
    data: {
      _status: "published",
      title: g.title,
      slug: g.slug,
      kind: "ratgeber",
      category: (await catRel(g)) as never,
      lead: g.lead,
      takeaways: g.takeaways.map((text) => ({ text })),
      body: doc(await g.body()) as never,
      faqs: g.faqs,
      sources: (await Promise.all(g.sourceNumbers.map(srcId))) as never,
      lastVerifiedAt: day(TODAY),
      legalDisclaimer: true,
      hasAffiliate: g.hasAffiliate,
      seoTitle: g.seoTitle,
      description: g.description,
      readingMinutes: g.readingMinutes,
      coverSeed: g.seed,
      publishedAt: day(TODAY),
    },
  });
  console.log("created:", g.slug);
}
process.exit(0);
