// Adds detailed reviews, pricing models (for charts) and criteria checks to all software profiles.
// Only facts read on the vendors' own pages (06.11.2026) are used. Run: pnpm exec payload run src/seed/reviews.ts
import { getPayload } from "payload";
import config from "../../payload.config";
import { doc, h2, p, ul } from "./lexical";

/* eslint-disable @typescript-eslint/no-explicit-any */
const payload = await getPayload({ config });
type Status = "yes" | "partial" | "no" | "unknown" | "na";
type C = [string, Status, string];

const CRIT = {
  prices: "Preise öffentlich einsehbar",
  trial: "Kostenlose Testphase",
  term: "Kurze Vertragslaufzeit (monatlich kündbar)",
  einv: "E-Rechnung (XRechnung / ZUGFeRD)",
  datev: "Export oder Schnittstelle für das Steuerbüro (DATEV)",
  data: "Datenstandort öffentlich angegeben",
  avv: "Auftragsverarbeitungsvertrag auf der Produktseite erwähnt",
  payroll: "Lohnabrechnung enthalten oder zubuchbar",
  mobile: "Mobile Nutzung (App) laut Anbieter",
  api: "Programmierschnittstelle (API) laut Anbieter",
};

type PlanModel = Partial<{
  monthlyNet: number;
  unit: "flat" | "perUser" | "perEmployee";
  includedUsers: number;
  extraUserMonthly: number;
  includedEmployees: number;
  extraEmployeeMonthly: number;
  minMonthly: number;
  annualMonthly: number;
  promoMonthly: number;
  promoMonths: number;
}>;

const REVIEWS: Record<string, { basis: "users" | "employees" | "none"; verdict: string; plans: Record<string, PlanModel>; checks: C[]; body: any[] }> = {
  /* ---------------------------------------------------------------- Sage Active */
  "sage-active": {
    basis: "users",
    verdict:
      "Sage Active bündelt Angebote, Rechnungen, Buchhaltung und im Tarif Essentials auch die Lohnabrechnung in einer Cloud-Lösung für kleine Unternehmen. Die Preise sind transparent veröffentlicht, Zusatzkosten für Nutzende und Rechnungen klar geregelt. Das Rechenzentrum liegt laut Sage in Deutschland (Microsoft Azure). Ob E-Rechnungen im Tarif Starter auch erstellt werden, sollten Sie vor dem Kauf klären.",
    plans: {
      Starter: { unit: "flat", includedUsers: 5, extraUserMonthly: 5, promoMonthly: 12.5, promoMonths: 3 },
      Essentials: { unit: "flat", includedUsers: 10, extraUserMonthly: 10, includedEmployees: 2, extraEmployeeMonthly: 3, promoMonthly: 24.5, promoMonths: 3 },
    },
    checks: [
      [CRIT.prices, "yes", "Beide Tarife mit Preisen und Zusatzkosten auf der Produktseite"],
      [CRIT.trial, "yes", "Starter 14 Tage ohne Kreditkarte, Essentials 30 Tage mit Zahlungsdaten"],
      [CRIT.term, "yes", "Kündigung zum Ende des laufenden Abrechnungsmonats"],
      [CRIT.einv, "partial", "Einlesen von XRechnung und ZUGFeRD in beiden Tarifen; Erstellen auf der Produktseite nicht ausdrücklich beschrieben"],
      [CRIT.datev, "yes", "Export im DATEV-Format (Essentials)"],
      [CRIT.data, "yes", "Microsoft Azure, Rechenzentrum in Deutschland (Unterauftragsverarbeiter-Liste von Sage)"],
      [CRIT.avv, "unknown", "Auf der Produktseite nicht erwähnt"],
      [CRIT.payroll, "partial", "Nur im Tarif Essentials, 2 Beschäftigte inklusive"],
      [CRIT.mobile, "yes", "Mobile App laut Anbieter"],
      [CRIT.api, "yes", "Open API laut Anbieter"],
    ],
    body: [
      h2("Was ist Sage Active?"),
      p("Sage Active ist die Cloud-Lösung von Sage für kleine Unternehmen mit 1 bis 50 Beschäftigten. Sie läuft im Browser und deckt je nach Tarif die Auftragsbearbeitung mit Angeboten und Rechnungen, die Finanzbuchhaltung und die Lohnabrechnung ab. Der Anbieter ist die Sage GmbH mit Sitz in Frankfurt am Main."),
      h2("Funktionen im Überblick"),
      ul([
        "**Angebote, Aufträge und Rechnungen** in beiden Tarifen; Rechnungen lassen sich per E-Mail versenden.",
        "**E-Rechnungen einlesen:** Eingehende Rechnungen im Format XRechnung und ZUGFeRD werden laut Anbieter in beiden Tarifen eingelesen. Belege lassen sich als Bild, PDF oder E-Rechnung per Drag and Drop hochladen.",
        "**Finanzbuchhaltung (Essentials):** Kontenrahmen SKR03 und SKR04, Anlagenbuchhaltung, EÜR, Unterstützung für GuV und Bilanz, Bankkontenabgleich.",
        "**Steuer:** Umsatzsteuer-Voranmeldung per ELSTER, monatlich oder vierteljährlich (Essentials).",
        "**Steuerbüro:** Export der Buchhaltungsdaten im DATEV-Format (Essentials).",
        "**Lohn und HR (Essentials):** Lohnabrechnung für zwei Beschäftigte inklusive, weitere gegen Aufpreis.",
        "**Weiteres:** KI-Assistent „Sage Copilot“, Mobile App und Open API laut Anbieter.",
      ]),
      h2("Preise und Kosten erklärt"),
      p("Starter kostet regulär 25 € pro Monat zzgl. MwSt. und enthält ein Unternehmen, fünf Nutzende und 300 Rechnungen pro Monat. Essentials kostet regulär 49 € und enthält zehn Nutzende, zwei Beschäftigte für die Lohnabrechnung und 500 Rechnungen pro Monat. Jede weitere Person kostet im Starter 5 €, im Essentials 10 € pro Monat; jede weitere beschäftigte Person in der Lohnabrechnung 3 €. Zusätzliche Rechnungen kosten 0,05 € je Stück oder werden als Paket gebucht, etwa 100 Rechnungen für 10 €."),
      p("Bei unserer Preisprüfung im November 2026 lief eine Aktion mit 50 % Rabatt für drei Monate: Starter 12,50 €, Essentials 24,50 €. Im ersten Jahr spart das beim Starter 37,50 € und beim Essentials 73,50 € gegenüber dem regulären Preis. Danach gelten die regulären Preise."),
      h2("Stärken"),
      ul([
        "Transparente Preisstruktur mit veröffentlichten Aufpreisen für Nutzende, Beschäftigte und Rechnungen",
        "Rechnungen, Buchhaltung und Lohn in einer Lösung (Essentials)",
        "Gute Anbindung an das Steuerbüro durch DATEV-Format und ELSTER",
        "Monatlich kündbar, Testphase ohne Kreditkarte im Starter",
      ]),
      h2("Grenzen und offene Punkte"),
      ul([
        "Starter enthält keine Buchhaltung und keine Lohnabrechnung",
        "Ob E-Rechnungen auch im Format XRechnung erstellt werden, beschreibt die Produktseite nicht ausdrücklich. Lassen Sie sich das vor dem Kauf schriftlich bestätigen.",
        "Die Produktseite selbst nennt keinen Serverstandort; erst die Unterauftragsverarbeiter-Liste von Sage zeigt Microsoft Azure in Deutschland, dazu Dienste mit Verarbeitung in den USA",
        "Für mehrere Gesellschaften verweist Sage selbst auf Sage Intacct, für Lager und Produktion auf ERP-Lösungen",
      ]),
      h2("Fazit"),
      p("Sage Active ist eine runde Lösung für kleine Unternehmen, die Rechnungen, Buchhaltung und eine kleine Lohnabrechnung in einer Cloud-Software bündeln und eng mit dem Steuerbüro zusammenarbeiten. Wer nur Rechnungen schreibt, findet günstigere Einstiegstarife. Klären Sie vor dem Abschluss die E-Rechnungs-Erstellung und den Datenschutz."),
    ],
  },

  /* ---------------------------------------------------------------- Sage Lohnabrechnung */
  "sage-lohnabrechnung": {
    basis: "employees",
    verdict:
      "Sage Lohnabrechnung ist eine schlanke Cloud-Lohnabrechnung mit automatischem Meldungsversand und klarer Preisstaffel nach Beschäftigten. Ab fünf Mitarbeitenden steigen die Kosten planbar. Die Tarife unterscheiden sich vor allem bei den HR-Funktionen.",
    plans: {
      "Payroll Essentials": { unit: "flat", includedEmployees: 5, extraEmployeeMonthly: 3 },
      "Payroll Standard": { unit: "flat", includedEmployees: 5, extraEmployeeMonthly: 5 },
      "Payroll Premium": { unit: "flat", includedEmployees: 5, extraEmployeeMonthly: 7 },
    },
    checks: [
      [CRIT.prices, "yes", "Alle drei Tarife und Aufpreise auf der Produktseite"],
      [CRIT.trial, "yes", "30 Tage kostenlos"],
      [CRIT.term, "yes", "Kündigung laut Anbieter jederzeit möglich"],
      [CRIT.einv, "na", "Für eine reine Lohnabrechnung nicht relevant"],
      [CRIT.datev, "yes", "Buchhaltungsexport für Sage und DATEV"],
      [CRIT.data, "unknown", "Auf der Produktseite nicht angegeben"],
      [CRIT.avv, "unknown", "Auf der Produktseite nicht erwähnt"],
      [CRIT.payroll, "yes", "Kernfunktion"],
      [CRIT.mobile, "yes", "Mobile App im Tarif Essentials aufgeführt"],
      [CRIT.api, "unknown", "Auf der Produktseite nicht angegeben"],
    ],
    body: [
      h2("Was ist Sage Lohnabrechnung?"),
      p("Sage Lohnabrechnung, auf der Preisseite auch Sage Payroll genannt, ist eine Cloud-Lösung für die Lohn- und Gehaltsabrechnung kleiner und mittlerer Unternehmen. Sie lässt sich bis zu 150 Mitarbeitende erweitern und verbindet die Abrechnung mit HR-Funktionen."),
      h2("Funktionen im Überblick"),
      ul([
        "**Lohnabrechnung inklusive gesetzlicher Meldungen:** Diese werden laut Anbieter automatisch erstellt und an Behörden und Krankenkassen übermittelt.",
        "**Beschäftigtenzugang:** Mitarbeitende rufen Abrechnungen und Steuerdokumente online ab.",
        "**Buchhaltungsexport** für Sage und DATEV",
        "**Essentials:** elementare HR-Funktionen, bis zu drei Abwesenheitsarten, Mitarbeiterdokumente, Benutzer- und Rechteverwaltung, Mobile App",
        "**Standard:** zusätzlich Onboarding-Portal, Arbeitszeiten und Überstunden, Genehmigungs-Workflows, Arbeitszeittabellenberichte, Organigramm, Urlaub und Abwesenheiten; Recruiting und Performance optional",
        "**Premium:** zusätzlich Schichtplanung und Einsatzpläne sowie das Einreichen und Genehmigen von Mitarbeiterausgaben per App",
      ]),
      h2("Preise und Kosten erklärt"),
      p("Alle Tarife enthalten fünf Mitarbeitende. Essentials kostet 20 €, Standard 30 € und Premium 40 € pro Monat zzgl. MwSt. Jede weitere abgerechnete Person kostet 3 €, 5 € oder 7 € pro Monat."),
      p("Beispiel mit 12 Beschäftigten: Essentials 41 €, Standard 65 €, Premium 89 € pro Monat netto. Mit 25 Beschäftigten: 80 €, 130 € und 180 €. Der Abstand zwischen den Tarifen wächst also mit der Teamgröße, weil auch der Aufpreis je Person steigt."),
      h2("Stärken"),
      ul([
        "Klare, veröffentlichte Preisstaffel und 30 Tage kostenlos testen",
        "Automatischer Meldungsversand an Behörden und Krankenkassen laut Anbieter",
        "Export für Sage und DATEV für die Zusammenarbeit mit dem Steuerbüro",
        "Zeiterfassung und Urlaubsverwaltung ab dem Tarif Standard",
      ]),
      h2("Grenzen und offene Punkte"),
      ul([
        "Obergrenze laut Anbieter bei 150 Mitarbeitenden",
        "Serverstandort, Auftragsverarbeitungsvertrag und API nennt die Produktseite nicht",
        "Wer Buchhaltung und Rechnungen in derselben Lösung möchte, muss zu einer anderen Lösung wie Sage Active greifen",
      ]),
      h2("Fazit"),
      p("Für kleine Betriebe, die die Lohnabrechnung selbst digital erledigen möchten, ist Sage Lohnabrechnung ein transparenter Einstieg. Essentials reicht für die reine Abrechnung. Standard lohnt sich, sobald Arbeitszeiten und Urlaub mit erfasst werden sollen."),
    ],
  },

  /* ---------------------------------------------------------------- Sage 100 */
  "sage-100": {
    basis: "users",
    verdict:
      "Sage 100 ist eine modulare ERP-Lösung für den Mittelstand, die lokal oder in der Cloud betrieben werden kann. Die Modulpreise sind pro Nutzer veröffentlicht, gelten aber bei jährlicher Abrechnung mit zwölf Monaten Mindestlaufzeit. Für ein vollständiges Bild brauchen Sie ein Angebot inklusive Einführung.",
    plans: {
      "Modul Warenwirtschaft": { unit: "perUser" },
      "Modul Rechnungswesen": { unit: "perUser" },
      "Modul Produktion": { unit: "perUser" },
    },
    checks: [
      [CRIT.prices, "yes", "Modulpreise ab je Nutzer und Monat veröffentlicht"],
      [CRIT.trial, "unknown", "Produkttour, eine Testphase nennt die Seite nicht"],
      [CRIT.term, "no", "12 Monate Mindestlaufzeit bei jährlicher Rechnungsstellung"],
      [CRIT.einv, "yes", "Erstellen und Versenden von XRechnung und ZUGFeRD, zentraler Rechnungseingang"],
      [CRIT.datev, "yes", "DATEV-Export und -Import im Modul Rechnungswesen"],
      [CRIT.data, "yes", "Cloud-Variante in deutschen Rechenzentren laut Anbieter"],
      [CRIT.avv, "unknown", "Auf der Produktseite nicht erwähnt"],
      [CRIT.payroll, "unknown", "Integration mit HR genannt, Lohnmodul auf der Seite nicht beschrieben"],
      [CRIT.mobile, "yes", "Mobile Nutzung laut Anbieter möglich"],
      [CRIT.api, "yes", "Partnerlösungen über API-Schnittstelle laut Anbieter"],
    ],
    body: [
      h2("Was ist Sage 100?"),
      p("Sage 100 ist eine ERP-Software für mittelständische Unternehmen. Sage nennt als Zielgruppe Betriebe mit 10 bis 250 Mitarbeitenden. Die Lösung ist modular aufgebaut, branchenunabhängig und lässt sich lokal auf eigenen Servern oder in der Cloud nutzen. Die Cloud-Variante speichert die Daten laut Anbieter in deutschen Rechenzentren."),
      h2("Die drei Kernmodule"),
      ul([
        "**Warenwirtschaft:** Kunden- und Lieferantenverwaltung, Artikel und Preislisten, Auftrags- und Bestellwesen, Kommissionierung, Lagerverwaltung und Inventur, Seriennummern und Chargen, elektronische Rechnungen",
        "**Rechnungswesen:** Controlling und Dashboard, Finanz- und Anlagenbuchhaltung, Kassenbuch und digitale Belegverarbeitung, Zahlungsverkehr, Bilanzierung und Kostenrechnung, DATEV-Export und -Import, Mahnwesen, Umsatzsteuer-Voranmeldung via ELSTER",
        "**Produktion:** inklusive Warenwirtschaftspaket; Fertigungssteuerung, Ressourcenliste, CAD-Schnittstelle, Simulation, Vor- und Nachkalkulation, Betriebsdatenerfassung, Fremd- und Projektfertigung",
      ]),
      p("Alle Module erlauben laut Anbieter eine unbegrenzte Mandantenanzahl. Sage 100 lässt sich mit über 200 Anwendungen und Branchenlösungen zertifizierter Partner erweitern."),
      h2("Preise und Kosten erklärt"),
      p("Sage nennt Einstiegspreise je Modul pro Nutzer und Monat: Warenwirtschaft ab 56 €, Rechnungswesen ab 58 €, Produktion ab 90 €, jeweils zzgl. MwSt. Die Preise gelten bei jährlicher Rechnungsstellung mit zwölfmonatiger Mindestvertragslaufzeit; andere Laufzeiten sind laut Anbieter optional möglich."),
      p("Rechenbeispiel aus den Listenpreisen: Zehn Nutzende im Modul Warenwirtschaft kosten ab 560 € pro Monat, also 6.720 € im Jahr. Kommen dieselben zehn Nutzenden im Rechnungswesen hinzu, sind es ab 1.140 € pro Monat. Nicht enthalten sind Einführung, Datenmigration, Schulung und Anpassungen. In unserem Ratgeber zu ERP-Kosten erklären wir, warum diese Posten oft größer sind als die Lizenz."),
      h2("Stärken"),
      ul([
        "Veröffentlichte Modulpreise, was bei ERP-Software nicht selbstverständlich ist",
        "Wahl zwischen lokalem Betrieb und Cloud mit deutschen Rechenzentren",
        "E-Rechnungen im Format XRechnung und ZUGFeRD erstellen und versenden",
        "DATEV-Schnittstelle in beide Richtungen und ELSTER-Voranmeldung",
      ]),
      h2("Grenzen und offene Punkte"),
      ul([
        "Zwölf Monate Mindestlaufzeit bei den veröffentlichten Preisen",
        "Eine kostenlose Testphase nennt die Produktseite nicht, nur eine Produkttour",
        "Gesamtkosten hängen stark von Einführung und Partnerleistungen ab",
        "Für komplexe internationale Strukturen verweist Sage selbst auf Sage X3",
      ]),
      h2("Fazit"),
      p("Sage 100 passt zu Mittelständlern mit Warenwirtschaft, Rechnungswesen und gegebenenfalls Produktion, die ein anpassbares System suchen und zwischen Cloud und eigenem Server wählen möchten. Holen Sie mit einem Lastenheft mehrere Angebote ein und vergleichen Sie die Gesamtkosten über mindestens drei Jahre."),
    ],
  },

  /* ---------------------------------------------------------------- Sage HR Suite */
  "sage-hr-suite": {
    basis: "none",
    verdict:
      "Die Sage HR Suite ist eine modulare Personalsoftware für Unternehmen mit umfassenden HR-Prozessen. Sie deckt auch komplexe Abrechnungsfälle ab. Preise nennt Sage nur für einzelne Module, das Mengenmodell erfahren Sie im Angebot.",
    plans: {
      Personalabrechnung: { unit: "flat" },
      "Bewerbermanagement Smart": { unit: "flat" },
    },
    checks: [
      [CRIT.prices, "partial", "Einstiegspreise für zwei Module, Zeitmanagement auf Anfrage"],
      [CRIT.trial, "unknown", "Produkttour, eine Testphase nennt die Seite nicht"],
      [CRIT.term, "no", "Zwölfmonatige Mindestlaufzeit bei jährlicher Rechnungsstellung"],
      [CRIT.einv, "na", "Für HR-Software nicht relevant"],
      [CRIT.datev, "unknown", "Auf der Produktseite nicht angegeben"],
      [CRIT.data, "yes", "Gehostete Variante: Microsoft GmbH, Rechenzentrum in Deutschland (Unterauftragsverarbeiter-Liste von Sage)"],
      [CRIT.avv, "unknown", "Auf der Produktseite nicht erwähnt"],
      [CRIT.payroll, "yes", "Modul Personalabrechnung"],
      [CRIT.mobile, "unknown", "Auf der Produktseite nicht angegeben"],
      [CRIT.api, "unknown", "Auf der Produktseite nicht angegeben"],
    ],
    body: [
      h2("Was ist die Sage HR Suite?"),
      p("Die Sage HR Suite ist eine modular aufgebaute Personalsoftware, die als lokale Installation oder in der Cloud genutzt werden kann. Die Module lassen sich Schritt für Schritt einführen. Auf der Preisseite nennt Sage die Lösung für Unternehmen mit umfassenden oder komplexen HR-Prozessen und 50 oder mehr Mitarbeitenden."),
      h2("Module im Überblick"),
      ul([
        "**Personalabrechnung:** Stammdaten, Erfassung von Arbeitszeiten und Abwesenheiten, automatisierte elektronische Meldungen. Laut Anbieter auch für komplexe Fälle wie Altersteilzeit, Zuschläge, Kurzarbeit, Versorgungsbezüge und betriebliche Altersvorsorge.",
        "**Zeitmanagement:** Arbeitszeitmodelle, Saldenregelungen, Reports und Zeitbewertung über die Personalabrechnung",
        "**Bewerbermanagement Smart:** Stellenanzeigen, digitale Bewerberakte, Bewertungs-, Auswahl- und Eintrittsprozess",
        "**Weitere Bereiche:** digitale Personalakte, Reisekosten und Auslagen; auf Wunsch Hosting oder Auslagerung der Entgeltabrechnung",
      ]),
      h2("Preise und Kosten erklärt"),
      p("Das Modul Personalabrechnung beginnt bei 39 € pro Monat, das Bewerbermanagement Smart bei 19 € pro Monat, jeweils zzgl. MwSt. Die Preise gelten laut Anbieter inklusive Softwarewartung für einen Arbeitsplatz bei jährlicher Rechnungsstellung mit zwölfmonatiger Mindestvertragslaufzeit. Die Produktseite verweist auf Pakete nach Mitarbeiterzahl. Wie sich der Preis mit wachsender Belegschaft entwickelt, erfahren Sie nur im Angebot. Deshalb zeigen wir hier keine Kostenkurve."),
      h2("Stärken"),
      ul([
        "Breite Abdeckung von Abrechnung über Zeit bis Recruiting",
        "Komplexe Abrechnungsfälle laut Anbieter abgedeckt",
        "Wahl zwischen Cloud und lokalem Betrieb",
        "Module einzeln einführbar",
      ]),
      h2("Grenzen und offene Punkte"),
      ul([
        "Preise nur als Einstiegswerte, Mengenstaffel und Zeitmanagement auf Anfrage",
        "Zwölf Monate Mindestlaufzeit",
        "Zur digitalen Personalakte betont Sage selbst, dass die Erfüllung gesetzlicher Anforderungen vom Einzelfall abhängt",
        "Für kleine Betriebe mit einfacher Abrechnung ist Sage Lohnabrechnung die leichtere Lösung",
      ]),
      h2("Fazit"),
      p("Die HR Suite eignet sich für mittlere und größere Unternehmen, die HR und Abrechnung modular verbinden und auch komplexe Fälle abbilden müssen. Für eine Entscheidung brauchen Sie ein Angebot mit Ihrer Mitarbeiterzahl und den gewünschten Modulen."),
    ],
  },

  /* ---------------------------------------------------------------- Lexware Office */
  "lexware-office": {
    basis: "none",
    verdict:
      "Lexware Office staffelt den Funktionsumfang über vier Versionen von der reinen Belegerfassung bis zu Buchhaltung, EÜR und API. Die Einstiegspreise sind niedrig, die Lohnabrechnung ist als Zusatzmodul buchbar. Wie viele Nutzende enthalten sind, nennt die Preisseite nicht.",
    plans: {
      S: { unit: "flat", promoMonthly: 3.95, promoMonths: 3 },
      M: { unit: "flat", promoMonthly: 6.45, promoMonths: 3 },
      L: { unit: "flat", promoMonthly: 10.95, promoMonths: 3 },
      XL: { unit: "flat", promoMonthly: 16.45, promoMonths: 3 },
    },
    checks: [
      [CRIT.prices, "yes", "Alle vier Versionen mit Preisen veröffentlicht"],
      [CRIT.trial, "yes", "30 Tage kostenlos, inklusive XL-Funktionen und Lohn & Gehalt"],
      [CRIT.term, "yes", "Monatlich kündbar laut Preisseite"],
      [CRIT.einv, "yes", "E-Rechnungen erstellen und übermitteln (ZUGFeRD, XRechnung) laut Anbieter"],
      [CRIT.datev, "yes", "DATEV-Rechnungsdatenservice 1.0, Buchungsdatenservice und klassischer DATEV-Export laut Anbieter"],
      [CRIT.data, "yes", "Mehrere Rechenzentren in Frankfurt am Main (ISO 27001) laut Anbieter"],
      [CRIT.avv, "partial", "AVVs mit eigenen Dienstleistern nach Art. 28 DSGVO auf der Sicherheitsseite genannt"],
      [CRIT.payroll, "partial", "Lohn & Gehalt als Zusatzmodul, mit allen Versionen kombinierbar"],
      [CRIT.mobile, "unknown", "Auf der Preisseite nicht angegeben"],
      [CRIT.api, "partial", "API in der Version XL"],
    ],
    body: [
      h2("Was ist Lexware Office?"),
      p("Lexware Office ist eine Cloud-Lösung für Rechnungen und Buchhaltung, die sich vor allem an Selbstständige und kleine Unternehmen richtet. Der Funktionsumfang wächst über vier Versionen: S, M, L und XL."),
      h2("Die vier Versionen"),
      ul([
        "**S:** Belegerfassung und -archiv",
        "**M:** Angebote, (E-)Rechnungen und Mahnungen",
        "**L:** Buchhaltung, EÜR und Umsatzsteuer",
        "**XL:** EU- und Abschlagsrechnungen sowie API",
      ]),
      p("Die Lohnabrechnung ist ein optionales Modul „Lohn & Gehalt“, das sich mit allen Versionen kombinieren lässt. Die Staffeln reichen laut Preisseite von bis zu zwei bis zu 50 Mitarbeitenden."),
      h2("Preise und Kosten erklärt"),
      p("Regulär kosten die Versionen 7,90 € (S), 12,90 € (M), 21,90 € (L) und 32,90 € (XL) pro Monat zzgl. MwSt. Bei unserer Preisprüfung im November 2026 gab es 50 % Rabatt für drei Monate. Im ersten Jahr spart das zwischen 11,85 € (S) und 49,35 € (XL). Bezahlt wird per Lastschrift oder Kreditkarte, die Versionen sind monatlich kündbar."),
      p("Für die meisten Betriebe mit eigener Buchhaltung ist die Version L der relevante Vergleichspunkt: 262,80 € im Jahr netto bei regulärem Preis. Wer nur Rechnungen schreibt und die Belege an das Steuerbüro gibt, kommt mit M für 154,80 € im Jahr aus."),
      h2("Stärken"),
      ul([
        "Niedriger Einstieg und klar abgegrenzte Versionen",
        "Monatlich kündbar, 30 Tage kostenlos mit allen Funktionen testen",
        "E-Rechnungen im Format ZUGFeRD und XRechnung laut Anbieter",
        "Lohnabrechnung bei Bedarf zubuchbar",
      ]),
      h2("Grenzen und offene Punkte"),
      ul([
        "E-Rechnungen erstellen und übermitteln laut Anbieter erst ab Version M; die Version S kann sie nur empfangen",
        "Die Zahl der enthaltenen Nutzenden nennt die Preisseite nicht",
        "Keine Warenwirtschaft oder Produktion",
      ]),
      h2("Fazit"),
      p("Lexware Office ist ein günstiger und flexibler Einstieg für Selbstständige und kleine Unternehmen. Wählen Sie die Version nach Ihrer Arbeitsteilung mit dem Steuerbüro und klären Sie vor dem Kauf, welche E-Rechnungs-Funktionen in Ihrer Version enthalten sind."),
    ],
  },

  /* ---------------------------------------------------------------- sevdesk */
  sevdesk: {
    basis: "users",
    verdict:
      "sevdesk bietet einen dauerhaft kostenlosen Einstieg mit drei (E-)Rechnungen pro Monat und drei bezahlte Tarife bis zur Buchhaltung mit BWA und API. Längere Laufzeiten senken den Preis deutlich. Jeder Tarif enthält einen Nutzer, weitere kosten 5,90 € pro Monat.",
    plans: {
      Kostenlos: { unit: "flat" },
      Rechnung: { unit: "flat", includedUsers: 1, extraUserMonthly: 5.9, annualMonthly: 9.9 },
      Buchhaltung: { unit: "flat", includedUsers: 1, extraUserMonthly: 5.9, annualMonthly: 22.9 },
      "Buchhaltung Pro": { unit: "flat", includedUsers: 1, extraUserMonthly: 5.9, annualMonthly: 30.9 },
    },
    checks: [
      [CRIT.prices, "yes", "Alle Tarife mit Preisen für 1, 12 und 24 Monate"],
      [CRIT.trial, "yes", "14 Tage alle Funktionen ohne Kreditkarte, danach Wechsel in den kostenlosen Tarif"],
      [CRIT.term, "yes", "Monatliche Abrechnung wählbar"],
      [CRIT.einv, "yes", "ZUGFeRD und XRechnung, unbegrenzt in den bezahlten Tarifen"],
      [CRIT.datev, "yes", "DATEV- und ADDISON-Schnittstelle ab Tarif Rechnung"],
      [CRIT.data, "unknown", "Auf der Preisseite nicht angegeben"],
      [CRIT.avv, "unknown", "Auf der Preisseite nicht erwähnt"],
      [CRIT.payroll, "no", "Auf der Preisseite nicht aufgeführt"],
      [CRIT.mobile, "unknown", "Auf der Preisseite nicht angegeben"],
      [CRIT.api, "partial", "REST-API im Tarif Buchhaltung Pro"],
    ],
    body: [
      h2("Was ist sevdesk?"),
      p("sevdesk ist eine Cloud-Software für Rechnungen und Buchhaltung für Selbstständige und kleine Unternehmen. Neben einem dauerhaft kostenlosen Tarif gibt es die Tarife Rechnung, Buchhaltung und Buchhaltung Pro."),
      h2("Tarife und Funktionen"),
      ul([
        "**Kostenlos:** drei Rechnungen oder E-Rechnungen pro Monat, inklusive ZUGFeRD und XRechnung",
        "**Rechnung:** unbegrenzte (E-)Rechnungen, Angebote, Abschlags- und Schlussrechnungen, Rechnungen ins Ausland, Briefpapier und Logo, Mahnungen, DATEV- und ADDISON-Schnittstelle, Zugang für das Steuerbüro, Marktplatz-Integrationen, persönlicher Support",
        "**Buchhaltung:** zusätzlich einfache und doppelte Buchführung, KI-gestützte Belegerfassung, Umsatzsteuer-Voranmeldung per ELSTER, EÜR und GuV, Anbindung an über 4.000 Banken, Abschreibungen, Auftragsbestätigungen, Lieferscheine, Kassenbuch",
        "**Buchhaltung Pro:** zusätzlich Kostenstellen, REST-API und BWA",
      ]),
      h2("Preise und Kosten erklärt"),
      p("Bei monatlicher Abrechnung kosten die Tarife regulär 11,90 € (Rechnung), 25,90 € (Buchhaltung) und 34,90 € (Buchhaltung Pro) zzgl. MwSt. Bei zwölf Monaten Laufzeit sinken die Monatspreise auf 9,90 €, 22,90 € und 30,90 €, bei 24 Monaten auf 8,90 €, 19,90 € und 27,90 €. Jeder Tarif enthält einen Nutzer, weitere kosten 5,90 € pro Monat."),
      p("Rechenbeispiel Buchhaltung mit drei Nutzenden: 25,90 € + 2 × 5,90 € = 37,70 € pro Monat bei monatlicher Abrechnung. Bei unserer Preisprüfung im November 2026 zeigte die Preisseite zusätzlich verschiedene Aktionsrabatte. Diese sind hier nicht eingerechnet."),
      h2("Stärken"),
      ul([
        "Dauerhaft kostenloser Einstieg inklusive E-Rechnungen",
        "Deutliche Rabatte bei 12 oder 24 Monaten Laufzeit",
        "DATEV- und ADDISON-Schnittstelle schon ab dem Tarif Rechnung",
        "Bankanbindung und ELSTER-Voranmeldung im Tarif Buchhaltung",
      ]),
      h2("Grenzen und offene Punkte"),
      ul([
        "Nur ein Nutzer inklusive; Teams zahlen pro Person extra",
        "Keine Lohnabrechnung auf der Preisseite aufgeführt",
        "Die Preisseite zeigte bei unserer Preisprüfung im November 2026 widersprüchliche Aktionspreise; Datenstandort und Auftragsverarbeitung nennt sie nicht",
      ]),
      h2("Fazit"),
      p("sevdesk eignet sich besonders für Selbstständige und kleine Teams, die günstig starten und die Buchhaltung selbst erledigen wollen. Wer sich für zwei Jahre bindet, zahlt deutlich weniger. Für die Lohnabrechnung brauchen Sie eine zusätzliche Lösung."),
    ],
  },

  /* ---------------------------------------------------------------- weclapp */
  weclapp: {
    basis: "users",
    verdict:
      "weclapp ist ein reines Cloud-ERP mit Datenhaltung in Deutschland und klar veröffentlichten Preisen pro Nutzer. Die Pakete reichen vom Starter mit Buchhaltung und E-Rechnung bis zum Handels-ERP mit Lager und Produktion. Bei Jahreszahlung sinken die Preise der größeren Pakete spürbar.",
    plans: {
      "ERP Starter": { unit: "perUser" },
      "ERP Dienstleistung": { unit: "perUser", monthlyNet: 95, annualMonthly: 86 },
      "ERP Handel": { unit: "perUser", monthlyNet: 179, annualMonthly: 163 },
    },
    checks: [
      [CRIT.prices, "yes", "Paketpreise pro Nutzer veröffentlicht; Enterprise ab 10 Lizenzen individuell"],
      [CRIT.trial, "yes", "30 Tage kostenlos, endet automatisch"],
      [CRIT.term, "yes", "Monatliche Lizenz mit einem Monat Kündigungsfrist"],
      [CRIT.einv, "yes", "E-Rechnung im Paket ERP Starter aufgeführt"],
      [CRIT.datev, "yes", "Belegbilderservice, Rechnungsdatenservice 1.0 und Buchungsdatenservice laut weclapp-Hilfe; kostenlose Steuerberater-Lizenz"],
      [CRIT.data, "yes", "Ausschließlich in Deutschland laut Anbieter"],
      [CRIT.avv, "unknown", "Auf der Preisseite nicht erwähnt"],
      [CRIT.payroll, "unknown", "Zeit & Abwesenheit kostenlos, Lohnabrechnung auf der Preisseite nicht genannt"],
      [CRIT.mobile, "yes", "Mobile Lager-App im Paket Handel"],
      [CRIT.api, "yes", "API-Zugriff ab Paket Dienstleistung"],
    ],
    body: [
      h2("Was ist weclapp?"),
      p("weclapp ist eine cloudbasierte ERP-Software für kleine und mittlere Unternehmen aus Dienstleistung und Handel. Die Daten werden laut Anbieter ausschließlich in Deutschland in mehreren Rechenzentren gespeichert. Für Unternehmen, die selbst hosten möchten, bietet weclapp die Variante „weclappOn“ als Private Cloud vor Ort an."),
      h2("Pakete und Funktionen"),
      ul([
        "**ERP Starter:** Kontaktmanagement, Angebote und Rechnungen, Aufgaben und Kalender, Fibu und Banking, Berichtswesen, E-Rechnung; kein CRM-Paket und keine Warenwirtschaft; nur monatlich buchbar",
        "**ERP Dienstleistung:** zusätzlich CRM, Projektmanagement inklusive Leistungsnachweis, Zeiterfassung und API-Zugriff",
        "**ERP Handel:** zusätzlich Warenwirtschaft, Disposition und Einkauf, Lagerverwaltung mit Mobile Lager-App, Serien- und Chargennummern, Produktion, Shop- und Marktplatzanbindung",
        "**Zusatzmodule:** Vertragsmanagement, Helpdesk und Kasse (POS) je 55 € pro Monat; eine Lizenz für Steuerberater und das Modul Zeit & Abwesenheit sind kostenlos",
      ]),
      h2("Preise und Kosten erklärt"),
      p("Alle Preise gelten pro Nutzer und Monat zzgl. MwSt. ERP Starter kostet 39 €. ERP Dienstleistung kostet 95 € bei monatlicher und 86 € bei jährlicher Zahlung, ERP Handel 179 € beziehungsweise 163 €. Ab mehr als zehn Lizenzen gibt es ein individuelles Enterprise-Angebot."),
      p("Rechenbeispiel mit fünf Nutzenden im Paket Dienstleistung: 475 € pro Monat bei monatlicher Zahlung, 430 € bei Jahreszahlung. Über ein Jahr sind das 5.700 € gegenüber 5.160 €, also 540 € weniger. Im Paket Handel spart die Jahreszahlung bei fünf Nutzenden 960 € im Jahr."),
      h2("Stärken"),
      ul([
        "Datenhaltung in Deutschland und klar veröffentlichte Preise",
        "30 Tage kostenlos testen, der Testzugang endet automatisch",
        "Breites Spektrum von Rechnungen bis Lager und Produktion",
        "API-Zugriff und kostenlose Steuerberater-Lizenz",
      ]),
      h2("Grenzen und offene Punkte"),
      ul([
        "Preis pro Nutzer: Bei vielen Nutzenden steigen die Kosten linear",
        "Starter ist nicht mit anderen Paketen kombinierbar",
        "Die Preisseite zeigt zwei Preisansichten; die Zuordnung zur Jahreszahlung haben wir aus der Standardansicht abgeleitet",
        "Eine Lohnabrechnung ist nicht enthalten",
      ]),
      h2("Fazit"),
      p("weclapp ist eine starke Wahl für Dienstleister und Händler, die ein Cloud-ERP mit Daten in Deutschland suchen und mit überschaubarer Nutzerzahl arbeiten. Rechnen Sie die Kosten mit Ihrer Nutzerzahl durch und vergleichen Sie Monats- und Jahreszahlung."),
    ],
  },

  /* ---------------------------------------------------------------- Personio */
  personio: {
    basis: "employees",
    verdict:
      "Personio ist eine EU-gehostete HR-Plattform mit Preisen pro Mitarbeitenden und einer monatlichen Mindestabnahme von 420 €. Der Einstiegsplan Core deckt Profile, Dokumente, Zeiterfassung und Workflows ab. Wegen der Mindestabnahme lohnt sich Personio rechnerisch erst ab etwa 56 Mitarbeitenden.",
    plans: {
      Core: { unit: "perEmployee", minMonthly: 420 },
      Payroll: { unit: "perEmployee" },
    },
    checks: [
      [CRIT.prices, "partial", "Einstiegspreise veröffentlicht, Core Pro und Enterprise über Demo"],
      [CRIT.trial, "unknown", "Demo buchbar, eine Testphase nennt die Seite nicht"],
      [CRIT.term, "unknown", "Laufzeit auf der Preisseite nicht angegeben"],
      [CRIT.einv, "na", "Für HR-Software nicht relevant"],
      [CRIT.datev, "yes", "Anbindung an DATEV, ADDISON und ADP laut Anbieter"],
      [CRIT.data, "yes", "In der EU gehostet laut Anbieter"],
      [CRIT.avv, "unknown", "Auf der Preisseite nicht erwähnt"],
      [CRIT.payroll, "yes", "Payroll ab 5 € pro Mitarbeitenden"],
      [CRIT.mobile, "unknown", "Auf der Preisseite nicht angegeben"],
      [CRIT.api, "unknown", "Auf der Preisseite nicht ausdrücklich angegeben"],
    ],
    body: [
      h2("Was ist Personio?"),
      p("Personio ist eine HR-Plattform für Personalverwaltung, Zeiterfassung, Workflows und Lohnbuchhaltung. Die Lösung ist laut Anbieter in der EU gehostet und DSGVO-konform. Personio unterscheidet seine Angebote nach Unternehmensgröße: unter 200, 200 bis 1.000 und über 1.000 Mitarbeitende."),
      h2("Pläne und Funktionen"),
      ul([
        "**Core:** Mitarbeitendenprofile, Dokumente und elektronische Signaturen (mit Einschränkungen), Analysen und Berichte, Workflow-Automatisierung, Zeiterfassung, vorbereitende Lohnbuchhaltung",
        "**Core Pro:** alles aus Core, dazu unter anderem Positionsmanagement für komplexere HR-Arbeit",
        "**Core Enterprise:** zusätzlich Premium Support, Sandbox-Testumgebung, Whistleblowing, Mitarbeitendenumfragen und KI-Credits",
        "**Payroll:** separate Lösung mit Prüfungen während der Abrechnung und Gehaltsabrechnungsvorschau; Anbindungen an DATEV, ADDISON und ADP Advanced Pay laut Anbieter",
      ]),
      h2("Preise und Kosten erklärt"),
      p("HR-Lösungen beginnen laut Preisseite bei 7,60 € pro Monat und Mitarbeitenden, es gilt eine monatliche Mindestabnahme von 420 €. Payroll beginnt bei 5 € pro Monat und Mitarbeitenden. Ob die Preise netto oder brutto gemeint sind, nennt die Seite nicht. Core Pro und Enterprise gibt es auf Anfrage."),
      p("Rechenbeispiel: Bei 30 Mitarbeitenden ergäben 7,60 € pro Person 228 €. Wegen der Mindestabnahme zahlen Sie aber 420 € pro Monat, also umgerechnet 14 € pro Person. Erst ab etwa 56 Mitarbeitenden liegt der rechnerische Preis über der Mindestabnahme. Mit 100 Mitarbeitenden sind es 760 € pro Monat für HR."),
      h2("Stärken"),
      ul([
        "Breiter HR-Funktionsumfang bereits im Plan Core, inklusive Zeiterfassung",
        "EU-Hosting laut Anbieter",
        "Payroll mit Anbindung an verbreitete Lohnsysteme wie DATEV",
        "Skaliert nach Unternehmensgröße bis in den Enterprise-Bereich",
      ]),
      h2("Grenzen und offene Punkte"),
      ul([
        "Mindestabnahme von 420 € pro Monat macht kleine Teams teuer",
        "Netto oder brutto ist auf der Preisseite nicht angegeben",
        "Höhere Pläne und Laufzeiten nur über eine Demo",
      ]),
      h2("Fazit"),
      p("Personio ist für wachsende Mittelständler interessant, die HR-Prozesse und Zeiterfassung zentral steuern wollen. Unter etwa 56 Mitarbeitenden bezahlen Sie durch die Mindestabnahme deutlich mehr als den Listenpreis pro Person. Vergleichen Sie dann leichtere Lösungen."),
    ],
  },
};

for (const [slug, r] of Object.entries(REVIEWS)) {
  const found = await payload.find({ collection: "software", where: { slug: { equals: slug } }, limit: 1, depth: 0 });
  const sw: any = found.docs[0];
  if (!sw) {
    console.log("missing software:", slug);
    continue;
  }
  const plans = (sw.plans ?? []).map((p: any) => {
    const m = r.plans[p.name];
    if (!m) return p;
    return { ...p, ...m };
  });
  const unmatched = Object.keys(r.plans).filter((n) => !(sw.plans ?? []).some((p: any) => p.name === n));
  if (unmatched.length) console.log("unmatched plans", slug, unmatched);
  await payload.update({
    collection: "software",
    id: sw.id,
    data: {
      plans,
      scenarioBasis: r.basis,
      verdict: r.verdict,
      review: doc(r.body) as never,
      checks: r.checks.map(([criterion, status, note]) => ({ criterion, status, note })),
    },
  });
  console.log("review saved:", slug);
}
process.exit(0);
