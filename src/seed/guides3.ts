// Third batch: 4 guides based on statute texts (gesetze-im-internet.de) and vendor pages. Safe to re-run.
// Run: pnpm exec payload run src/seed/guides3.ts
import { getPayload } from "payload";
import config from "../../payload.config";
import { affiliateCta, callout, doc, h2, p, steps, table, ul } from "./lexical";

/* eslint-disable @typescript-eslint/no-explicit-any */
const payload = await getPayload({ config });
const day = (s: string) => new Date(`${s}T12:00:00.000Z`).toISOString();
const TODAY = "2026-11-08";
const first = async (collection: any, where: any) => (await payload.find({ collection, where, limit: 1, depth: 0 })).docs[0] as any;
const cat = async (slug: string) => (await first("categories", { slug: { equals: slug } })).id;
const srcId = async (n: number) => (await first("sources", { number: { equals: n } })).id;
const swId = async (slug: string) => (await first("software", { slug: { equals: slug } })).id;
const T = (arr: string[]) => arr.map((text) => ({ text }));

for (const s of [
  { number: 18, publisher: "Bundesministerium der Justiz (gesetze-im-internet.de)", title: "§ 19 UStG: Besteuerung der Kleinunternehmer", url: "https://www.gesetze-im-internet.de/ustg_1980/__19.html", type: "behoerde" },
  { number: 19, publisher: "Bundesministerium der Justiz (gesetze-im-internet.de)", title: "§ 18 UStG: Besteuerungsverfahren", url: "https://www.gesetze-im-internet.de/ustg_1980/__18.html", type: "behoerde" },
  { number: 20, publisher: "Bundesministerium der Justiz (gesetze-im-internet.de)", title: "§ 8 SGB IV: Geringfügige Beschäftigung und geringfügige selbständige Tätigkeit", url: "https://www.gesetze-im-internet.de/sgb_4/__8.html", type: "behoerde" },
]) {
  if (!(await first("sources", { number: { equals: s.number } }))) await payload.create({ collection: "sources", data: { ...s, type: s.type as never, accessedAt: day(TODAY) } });
}

const guides = [
  {
    slug: "kleinunternehmerregelung-grenzen-pflichten",
    title: "Kleinunternehmerregelung: Umsatzgrenzen, Verzicht und was sich für Rechnungen ändert",
    seoTitle: "Kleinunternehmerregelung: Grenzen und Pflichten",
    description: "Wann gilt die Kleinunternehmerregelung nach § 19 UStG? Umsatzgrenzen von 25.000 und 100.000 Euro, Verzicht, Rechnungen und Software für den Einstieg.",
    category: "buchhaltung-finanzen",
    readingMinutes: 6,
    lead: "Kleinunternehmer stellen Rechnungen ohne Umsatzsteuer aus und sind von vielen Pflichten der Umsatzsteuer befreit. Der Ratgeber erklärt anhand des Gesetzestextes, wann die Regelung gilt, wie der Verzicht funktioniert und worauf Sie bei Rechnungen und Software achten.",
    hasAffiliate: false,
    sourceNumbers: [18, 1, 6],
    seed: 14,
    takeaways: [
      "Grenzen: Die Regelung gilt, wenn der Gesamtumsatz im Vorjahr 25.000 € nicht überschritten hat und im laufenden Jahr 100.000 € nicht überschreitet (§ 19 Abs. 1 UStG).",
      "Gesamtumsatz: Berechnet wird nach vereinnahmten Entgelten. Bestimmte steuerfreie Umsätze und Umsätze mit Anlagevermögen bleiben außen vor (§ 19 Abs. 2 UStG).",
      "Verzicht: Wer verzichtet, ist mindestens fünf Kalenderjahre gebunden (§ 19 Abs. 3 UStG).",
      "E-Rechnung: Kleinunternehmer müssen E-Rechnungen empfangen, aber nicht ausstellen.",
      "Prüfen: Ob die Grenzen netto oder brutto zu verstehen sind, wird in Fachquellen unterschiedlich dargestellt. Klären Sie Grenzfälle mit Ihrem Steuerbüro.",
    ],
    faqs: [
      { q: "Was passiert, wenn ich im laufenden Jahr über 100.000 € komme?", a: "Der Gesetzestext knüpft die Befreiung an die Bedingung, dass der Umsatz im laufenden Jahr 100.000 € nicht überschreitet. Welche Folgen das im Einzelnen hat, besprechen Sie mit Ihrer Steuerberatung, bevor Sie die Grenze erreichen." },
      { q: "Kann ich freiwillig auf die Kleinunternehmerregelung verzichten?", a: "Ja, durch Erklärung gegenüber dem Finanzamt. Der Verzicht bindet mindestens für fünf Kalenderjahre (§ 19 Abs. 3 UStG)." },
    ],
    body: async () => [
      h2("Was die Regelung bedeutet"),
      p("Nach § 19 UStG wird die Umsatzsteuer von Kleinunternehmern nicht erhoben. Sie weisen auf Rechnungen keine Umsatzsteuer aus und müssen für diese Umsätze auch keine Umsatzsteuer abführen. Im Gegenzug können Sie die Vorsteuer aus Ihren Einkäufen nicht abziehen. [18]"),
      h2("Die Umsatzgrenzen"),
      p("Die Umsatzsteuer wird nicht erhoben, wenn der Gesamtumsatz im vorangegangenen Kalenderjahr 25.000 € nicht überschritten hat und im laufenden Kalenderjahr 100.000 € nicht überschreitet. [18]"),
      table([
        ["Zeitraum", "Grenze", "Bedeutung"],
        ["Vorjahr", "25.000 €", "Gesamtumsatz nicht überschritten"],
        ["laufendes Jahr", "100.000 €", "Gesamtumsatz darf nicht überschritten werden"],
      ]),
      p("Der Gesamtumsatz ist nach vereinnahmten Entgelten berechnet, also nach tatsächlich erhaltenem Geld. Bestimmte steuerfreie Umsätze und Umsätze mit Gegenständen des Anlagevermögens werden nicht mitgerechnet. [18]"),
      callout("warn", "Netto oder brutto?", "Der Gesetzestext nennt Umsatzsteuer-Zuschläge nicht ausdrücklich. Fachquellen stellen die Grenzen teils als Netto-, teils als Bruttogrenzen dar. Besprechen Sie Ihren konkreten Fall mit dem Steuerbüro, besonders wenn Sie nahe an den Grenzen liegen."),
      h2("Verzicht auf die Regelung"),
      p("Sie können auf die Kleinunternehmerregelung verzichten, etwa um Vorsteuer abzuziehen. Der Verzicht ist dem Finanzamt bis zum letzten Tag des Monats Februar des zweiten auf den Besteuerungszeitraum folgenden Kalenderjahres zu erklären und bindet mindestens für fünf Kalenderjahre. [18] Überlegen Sie das gut: Ihre Rechnungen enthalten dann Umsatzsteuer, und Sie geben Voranmeldungen ab."),
      h2("Rechnungen und E-Rechnung"),
      ul([
        "Sie weisen auf Rechnungen keine Umsatzsteuer aus. Der Hinweis auf die Kleinunternehmerregelung gehört nach der üblichen Praxis auf die Rechnung. Lassen Sie sich die genaue Formulierung vom Steuerbüro bestätigen.",
        "Seit dem 1. Januar 2025 müssen Sie E-Rechnungen empfangen können. [1]",
        "Ausstellen müssen Kleinunternehmer keine E-Rechnungen, sie dürfen nach § 34a UStDV weiterhin andere Rechnungen verwenden. [1]",
      ]),
      p("Mehr dazu in unseren Ratgebern zur E-Rechnung für Kleinunternehmer und zum Empfang von E-Rechnungen."),
      h2("Software für den Einstieg"),
      p("Für wenige Rechnungen im Monat reichen oft einfache Tarife. Beispiele laut Anbieter (Stand 06.11.2026, regulär, zzgl. MwSt.): sevdesk bietet einen kostenlosen Tarif mit drei Rechnungen oder E-Rechnungen pro Monat und den Tarif Rechnung ab 11,90 €. [6] Prüfen Sie, ob die Software die Kleinunternehmer-Hinweise auf der Rechnung unterstützt."),
      steps([
        "**Grenzen im Blick behalten:** Umsatz laufend mit dem Steuerbüro abgleichen, besonders nahe 25.000 € im Vorjahr oder 100.000 € im laufenden Jahr.",
        "**Rechnungen prüfen:** Keine Umsatzsteuer ausweisen, Hinweis nach Absprache mit dem Steuerbüro.",
        "**E-Rechnungen empfangen:** Zentrale Adresse und Programm zum Lesen einrichten.",
        "**Verzicht erwägen:** Nur mit Beratung und im Wissen um die fünfjährige Bindung.",
      ]),
      affiliateCta(await swId("sevdesk"), "Dauerhaft kostenloser Tarif mit drei Rechnungen oder E-Rechnungen pro Monat; bezahlte Tarife ab 11,90 € zzgl. MwSt."),
    ],
  },
  {
    slug: "umsatzsteuervoranmeldung-elster-fristen",
    title: "Umsatzsteuer-Voranmeldung per ELSTER: Fristen, Zeiträume und Software",
    seoTitle: "Umsatzsteuer-Voranmeldung: Fristen und Zeiträume",
    description: "Wann die Umsatzsteuer-Voranmeldung fällig ist, ob monatlich oder vierteljährlich, was die Dauerfristverlängerung bedeutet und welche Software ELSTER anbindet.",
    category: "buchhaltung-finanzen",
    readingMinutes: 6,
    lead: "Die Umsatzsteuer-Voranmeldung gehört für viele Unternehmen zum festen Rhythmus. Der Ratgeber erklärt anhand von § 18 UStG, wann sie fällig ist, wie sich der Zeitraum bestimmt und welche Software die Übermittlung per ELSTER unterstützt.",
    hasAffiliate: true,
    sourceNumbers: [19, 4, 5, 6],
    seed: 36,
    takeaways: [
      "Fälligkeit: Die Vorauszahlung ist am zehnten Tag nach Ablauf des Voranmeldungszeitraums fällig (§ 18 Abs. 1 UStG).",
      "Zeitraum: Grundsätzlich das Kalendervierteljahr. Bei einer Steuer von mehr als 9.000 € im Vorjahr ist es der Kalendermonat (§ 18 Abs. 2 UStG).",
      "Befreiung: Betrug die Steuer im Vorjahr nicht mehr als 2.000 €, kann das Finanzamt von der Abgabe der Voranmeldungen befreien.",
      "Fristverlängerung: Die Fristen lassen sich um einen Monat verlängern (Dauerfristverlängerung, geregelt durch Verordnung nach § 18 Abs. 6 UStG).",
      "Software: ELSTER-Voranmeldung bieten laut Anbieter z. B. Sage Active Essentials, sevdesk Buchhaltung und Lexware Office L.",
    ],
    faqs: [
      { q: "Wie oft muss ich eine Voranmeldung abgeben?", a: "Der Voranmeldungszeitraum ist das Kalendervierteljahr. Beträgt die Steuer des Vorjahres mehr als 9.000 €, ist es der Kalendermonat. Unternehmer können nach § 18 Abs. 2a UStG unter bestimmten Voraussetzungen den Kalendermonat wählen." },
      { q: "Was ist die Dauerfristverlängerung?", a: "Sie verlängert die Fristen für Voranmeldungen und Vorauszahlungen um einen Monat. Die Rechtsgrundlage ist in § 18 Abs. 6 UStG angelegt und in einer Verordnung ausgestaltet. Den Antrag und die Bedingungen klären Sie mit dem Finanzamt oder Steuerbüro." },
      { q: "Muss ich ELSTER selbst nutzen?", a: "Die Übermittlung erfolgt elektronisch. Viele Buchhaltungsprogramme übermitteln die Voranmeldung direkt per ELSTER." },
    ],
    body: async () => [
      h2("Was die Voranmeldung ist"),
      p("Unternehmer melden dem Finanzamt regelmäßig vorab ihre Umsatzsteuer und zahlen sie als Vorauszahlung. Die Regeln dazu stehen in § 18 UStG. Die Jahressteuererklärung folgt später. [19]"),
      h2("Fälligkeit: der zehnte Tag"),
      p("Die Vorauszahlung ist am zehnten Tag nach Ablauf des Voranmeldungszeitraums fällig. [19] Planen Sie deshalb Buchungen und Belege so, dass die Zahlen vor diesem Tag vorliegen."),
      h2("Monat oder Quartal?"),
      table([
        ["Situation", "Voranmeldungszeitraum", "Rechtsgrundlage"],
        ["Grundsatz", "Kalendervierteljahr", "§ 18 Abs. 2 UStG"],
        ["Steuer im Vorjahr über 9.000 €", "Kalendermonat", "§ 18 Abs. 2 UStG"],
        ["Überschuss zu Ihren Gunsten im Vorjahr über 9.000 €", "Wahlrecht: Kalendermonat", "§ 18 Abs. 2a UStG"],
        ["Steuer im Vorjahr nicht über 2.000 €", "Finanzamt kann von der Abgabe befreien", "§ 18 Abs. 2 UStG"],
      ]),
      p("Quelle: [19]. Für neu gegründete Unternehmen gelten Sonderregeln, die hier nicht behandelt werden. Fragen Sie das Finanzamt oder Ihr Steuerbüro."),
      h2("Dauerfristverlängerung"),
      p("Das Gesetz erlaubt, die Fristen für Voranmeldungen und Vorauszahlungen durch Verordnung um einen Monat zu verlängern (§ 18 Abs. 6 UStG). [19] Die Einzelheiten, etwa Antrag und mögliche Sondervorauszahlung, sind in der Verordnung geregelt. Klären Sie sie mit Ihrem Steuerbüro, bevor Sie die Verlängerung nutzen."),
      callout("legal", "Fristen sind verbindlich", "Beachten Sie auch, dass Fristen auf Wochenenden und Feiertage fallen können. Besprechen Sie die genaue Berechnung und mögliche Säumniszuschläge mit Ihrem Steuerbüro."),
      h2("Welche Software übermittelt per ELSTER?"),
      p("Viele Cloud-Buchhaltungen erstellen die Voranmeldung und übermitteln sie direkt. Beispiele laut Anbieter (Stand 06.11.2026, reguläre Monatspreise zzgl. MwSt.):"),
      table([
        ["Software / Tarif", "Preis / Monat", "ELSTER-Voranmeldung laut Anbieter", "Quelle"],
        ["Sage Active Essentials", "49,00 €", "USt-Voranmeldung per ELSTER, monatlich oder vierteljährlich; zusätzlich DATEV-Format-Export", "[4]"],
        ["Lexware Office L", "21,90 €", "Buchhaltung, EÜR und Umsatzsteuer", "[5]"],
        ["sevdesk Buchhaltung", "25,90 €", "UStVA per ELSTER, EÜR/GuV", "[6]"],
      ]),
      p("Prüfen Sie beim Anbieter, welche Tarife ELSTER enthalten und ob die Übermittlung für Ihre Besteuerungsart (Soll- oder Ist-Versteuerung) geeignet ist."),
      steps([
        "**Zeitraum bestimmen:** Monat oder Quartal, nach der Steuer des Vorjahres.",
        "**Belege rechtzeitig buchen:** Zahlen vor dem zehnten Tag nach Periodenende prüfen.",
        "**Übermitteln:** Per ELSTER direkt aus der Software oder über das Steuerbüro.",
        "**Zahlung veranlassen:** Fälligkeit am zehnten Tag beachten.",
        "**Fristverlängerung prüfen:** Mit dem Steuerbüro klären, ob sie für Sie sinnvoll ist.",
      ]),
      affiliateCta(await swId("sage-active"), "Umsatzsteuer-Voranmeldung per ELSTER im Tarif Essentials, mit Rechnungen, Buchhaltung und Lohn für kleine Unternehmen."),
    ],
  },
  {
    slug: "minijob-abrechnen-geringfuegigkeitsgrenze",
    title: "Minijob richtig abrechnen: Verdienstgrenze, kurzfristige Beschäftigung und Software",
    seoTitle: "Minijob abrechnen: Verdienstgrenze und Regeln",
    description: "Wie sich die Minijob-Grenze berechnet, was kurzfristige Beschäftigung bedeutet, wann Überschreitungen zulässig sind und wie Sie die Abrechnung digital erledigen.",
    category: "lohn-gehalt",
    readingMinutes: 6,
    lead: "Die Minijob-Grenze steigt mit dem Mindestlohn. Der Ratgeber erklärt anhand von § 8 SGB IV, wie sie berechnet wird, was kurzfristige Beschäftigung ist und wann ein gelegentliches Überschreiten unschädlich bleibt. Außerdem zeigen wir, wie Sie die Abrechnung digital organisieren.",
    hasAffiliate: true,
    sourceNumbers: [20, 9],
    seed: 58,
    takeaways: [
      "Berechnung: Die Geringfügigkeitsgrenze ergibt sich aus Mindestlohn × 130 ÷ 3, auf volle Euro aufgerundet (§ 8 Abs. 1a SGB IV).",
      "2026: Bei einem Mindestlohn von 13,90 € ergibt das 603 € pro Monat (eigene Berechnung nach der gesetzlichen Formel).",
      "Kurzfristig: Eine Beschäftigung innerhalb eines Kalenderjahres auf längstens drei Monate oder 70 Arbeitstage begrenzt kann kurzfristig sein.",
      "Überschreiten: Ein unvorhersehbares Überschreiten schadet nicht, wenn es in nicht mehr als zwei Kalendermonaten um jeweils höchstens die Geringfügigkeitsgrenze erfolgt.",
      "Abgaben: Die Höhe der pauschalen Abgaben nennen wir hier bewusst nicht. Sie ändert sich und wird von der Minijob-Zentrale bekannt gegeben.",
    ],
    faqs: [
      { q: "Wo erfahre ich die aktuelle Grenze?", a: "Das Bundesministerium für Arbeit und Soziales gibt die Höhe der Geringfügigkeitsgrenze im Bundesanzeiger bekannt. Die Berechnung folgt aus dem Mindestlohn." },
      { q: "Zählt ein einmaliges Überschreiten?", a: "Ein unvorhersehbares Überschreiten steht dem Fortbestand der geringfügigen Beschäftigung nicht entgegen, wenn es in nicht mehr als zwei Kalendermonaten um jeweils einen Betrag bis zur Höhe der Geringfügigkeitsgrenze erfolgt (§ 8 Abs. 1b SGB IV)." },
    ],
    body: async () => [
      h2("Wann eine Beschäftigung geringfügig ist"),
      p("Eine Beschäftigung ist geringfügig, wenn das Arbeitsentgelt regelmäßig die Geringfügigkeitsgrenze nicht übersteigt. [20] Daneben gibt es die kurzfristige Beschäftigung."),
      h2("Wie die Grenze berechnet wird"),
      p("Maßgeblich ist das monatliche Arbeitsentgelt bei einer Arbeitszeit von zehn Wochenstunden zum Mindestlohn. Die Grenze wird berechnet, indem der Mindestlohn mit 130 vervielfacht, durch drei geteilt und auf volle Euro aufgerundet wird. [20]"),
      table([
        ["Mindestlohn", "Rechnung", "Geringfügigkeitsgrenze"],
        ["13,90 € (2026)", "13,90 × 130 ÷ 3 = 602,33", "603 € pro Monat"],
      ]),
      p("Das Bundesministerium für Arbeit und Soziales gibt die jeweilige Höhe im Bundesanzeiger bekannt. [20] Den aktuellen Wert und den Mindestlohn prüfen Sie dort, bevor Sie Verträge anpassen."),
      h2("Kurzfristige Beschäftigung"),
      p("Eine Beschäftigung kann kurzfristig sein, wenn sie innerhalb eines Kalenderjahres auf längstens drei Monate oder 70 Arbeitstage begrenzt ist. Die Begrenzung ergibt sich aus der Eigenart der Tätigkeit oder aus dem Vertrag im Voraus. Ist die Beschäftigung berufsmäßig, gilt die Möglichkeit nur unter weiteren Bedingungen. [20] In der Landwirtschaft gelten andere Grenzen. [20]"),
      h2("Gelegentliches Überschreiten"),
      p("Ein unvorhersehbares Überschreiten steht dem Fortbestand einer geringfügigen Beschäftigung nicht entgegen, wenn die Grenze in nicht mehr als zwei Kalendermonaten um jeweils einen Betrag bis zur Höhe der Geringfügigkeitsgrenze überschritten wird. [20]"),
      callout("tip", "Praxistipp", "Planen Sie Vertretungen oder Sonderschichten so, dass das Entgelt nicht regelmäßig über der Grenze liegt. Dokumentieren Sie, warum ein Überschreiten unvorhersehbar war."),
      h2("Abrechnung digital erledigen"),
      p("Die Abgaben für Minijobs sind pauschal und gehen an die zuständige Stelle. Ihre Höhe ändert sich und steht nicht im Gesetzestext der Grenze, deshalb nennen wir hier keine Zahlen. Eine Lohnsoftware erledigt Berechnung und Meldungen. Sage Lohnabrechnung etwa erstellt und versendet nach Anbieterangabe die gesetzlichen Meldungen automatisch an Behörden und Krankenkassen; sie kostet ab 20 € pro Monat zzgl. MwSt. inklusive fünf Mitarbeitenden. [9] Klären Sie beim Anbieter, wie Minijobs und kurzfristige Beschäftigungen abgebildet werden."),
      steps([
        "**Art klären:** Minijob oder kurzfristige Beschäftigung?",
        "**Grenze prüfen:** Aktuelle Geringfügigkeitsgrenze im Bundesanzeiger nachsehen.",
        "**Vertrag und Stunden planen:** Entgelt dauerhaft unter der Grenze halten.",
        "**Abrechnung organisieren:** Software mit Meldeversand nutzen oder Abrechnung auslagern.",
        "**Dokumentieren:** Arbeitszeiten und Ausnahmefälle festhalten.",
      ]),
      callout("legal", "Hinweis", "Dieser Beitrag ersetzt keine Beratung. Klären Sie Sozialversicherung, Pauschalabgaben und Meldungen mit der Minijob-Zentrale oder Ihrer Steuerberatung."),
      affiliateCta(await swId("sage-lohnabrechnung"), "Cloud-Lohnabrechnung ab 20 € pro Monat zzgl. MwSt. mit fünf Mitarbeitenden und automatischem Meldungsversand."),
    ],
  },
  {
    slug: "zeiterfassungssystem-auswaehlen",
    title: "Zeiterfassungssystem auswählen: Kriterien, Beispiele und Kosten",
    seoTitle: "Zeiterfassungssystem auswählen: Kriterien und Kosten",
    description: "Worauf es bei der Auswahl eines Zeiterfassungssystems ankommt, welche Module Sage, Personio und weclapp bieten und wie Sie den Betriebsrat einbinden.",
    category: "zeiterfassung",
    readingMinutes: 6,
    lead: "Seit dem Beschluss des Bundesarbeitsgerichts müssen Arbeitgeber Arbeitszeiten erfassen. Welches System dafür passt, hängt von Betriebsgröße, Arbeitsorten und vorhandener Software ab. Der Ratgeber nennt Kriterien und zeigt Beispiele, wie Zeiterfassung in verbreiteten Lösungen enthalten ist.",
    hasAffiliate: false,
    sourceNumbers: [7, 9, 14, 16, 17],
    seed: 69,
    takeaways: [
      "Pflicht: Beginn, Ende und Pausen sind zu erfassen, eine bestimmte Form ist derzeit nicht vorgeschrieben (IHK Rhein-Neckar).",
      "Auswahl: Mobile Erfassung, Nachvollziehbarkeit von Änderungen, Export und Datenschutz entscheiden mehr als einzelne Zusatzfunktionen.",
      "Beispiele: Zeiterfassung steckt in HR- und ERP-Lösungen, etwa in Sage Payroll Standard, Personio Core und weclapp ERP Dienstleistung.",
      "Betriebsrat: Bei der Ausgestaltung kann Mitbestimmung bestehen, ein Initiativrecht zur Einführung hat er nach IHK-Darstellung nicht.",
    ],
    faqs: [
      { q: "Brauche ich ein eigenes Zeiterfassungs-Tool?", a: "Nicht zwingend. Viele HR- und ERP-Lösungen enthalten Zeiterfassung. Prüfen Sie, ob das Modul Beginn, Ende und Pausen nachprüfbar erfasst und ob es zu Ihren Arbeitsorten passt." },
      { q: "Muss das System elektronisch sein?", a: "Nach dem derzeitigen Stand ist keine bestimmte Form vorgeschrieben. Eine gesetzliche Neuregelung, die elektronische Erfassung verlangen könnte, war zum Redaktionsstand nicht abschließend geklärt." },
    ],
    body: async () => [
      h2("Was gesetzlich zählt"),
      p("Arbeitgeber müssen Beginn und Ende der täglichen Arbeitszeit einschließlich Überstunden und Pausen erfassen. Eine bestimmte Form ist nicht vorgeschrieben, die Aufzeichnungen müssen nachprüfbar sein. [7] Details und den Stand der geplanten Gesetzesänderung finden Sie in unserem Ratgeber zur Arbeitszeiterfassung."),
      h2("Kriterien für die Auswahl"),
      table([
        ["Kriterium", "Worauf Sie achten"],
        ["Erfassung", "Beginn, Ende, Pausen einzeln; Überstunden"],
        ["Arbeitsorte", "Büro, Homeoffice, Baustelle, Produktion: mobil, am PC oder am Terminal"],
        ["Nachvollziehbarkeit", "Änderungen mit Nutzer und Zeitpunkt protokolliert"],
        ["Auswertung", "Salden, Überstunden, Export für Lohnabrechnung"],
        ["Anbindung", "Übergabe an Lohnabrechnung oder Buchhaltung"],
        ["Datenschutz", "Auftragsverarbeitungsvertrag, Serverstandort, Rollen und Rechte"],
        ["Mitbestimmung", "Betriebsrat frühzeitig einbinden, falls vorhanden"],
        ["Kosten", "Preis je Nutzer oder Mitarbeitenden, Mindestabnahme, Laufzeit"],
      ]),
      h2("Beispiele: Zeiterfassung in bekannten Lösungen"),
      p("Zeiterfassung wird häufig als Teil größerer Lösungen angeboten. Die folgende Übersicht gibt Angaben der Anbieter wieder (Stand 06.11.2026, zzgl. MwSt., soweit angegeben). Prüfen Sie den Umfang je Tarif beim Anbieter."),
      table([
        ["Lösung", "Zeiterfassung laut Anbieter", "Preisangabe", "Quelle"],
        ["Sage Payroll Standard", "Arbeitszeiten und Überstunden, Genehmigungs-Workflows, Arbeitszeittabellenberichte; Schichtplanung im Tarif Premium", "30 € / Monat inkl. 5 Mitarbeitende, weitere 5 € je Person", "[9]"],
        ["Sage HR Suite, Modul Zeitmanagement", "Arbeitszeitmodelle, Saldenregelungen, Reports, Zeitbewertung über die Personalabrechnung", "Preis auf Anfrage", "[14]"],
        ["Personio Core", "Zeiterfassung im Plan Core enthalten", "HR ab 7,60 € je Mitarbeitende und Monat, Mindestabnahme 420 € monatlich", "[17]"],
        ["weclapp ERP Dienstleistung", "(Personal-)Zeiterfassung im Paket enthalten; Einzellizenz „Zeit & Abwesenheit“ kostenlos laut Preisseite", "86 € je Nutzer und Monat (Ansicht „Jährlich“), 95 € monatlich", "[16]"],
      ]),
      callout("info", "Nicht gleichsetzen", "Die Lösungen unterscheiden sich im Preismodell (je Mitarbeitende, je Nutzer, je Modul) und im Umfang. Vergleichen Sie mit Ihrer tatsächlichen Mitarbeiter- und Nutzerzahl."),
      h2("In fünf Schritten zur Entscheidung"),
      steps([
        "**Arbeitsorte klären:** Wo wird gearbeitet, und wie erfassen die Beschäftigten dort?",
        "**Ohnehin genutzte Software prüfen:** Enthält Ihre HR- oder ERP-Lösung ein Zeitmodul?",
        "**Anforderungen priorisieren:** Pflicht (Beginn, Ende, Pausen) vor Zusatzfunktionen.",
        "**Betriebsrat und Datenschutz einbinden:** Regeln schriftlich festhalten.",
        "**Testen:** Mit echten Arbeitstagen, dann Export zur Lohnabrechnung prüfen.",
      ]),
    ],
  },
];

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
      category: (await cat(g.category)) as never,
      lead: g.lead,
      takeaways: T(g.takeaways),
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
