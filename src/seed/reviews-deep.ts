// Deepens all eight software reviews with researched sections: fit, data protection, tax-office workflow,
// rollout, alternatives and FAQ. Sections are inserted before "Fazit". Facts come only from vendor pages,
// vendor help centres and Sage's published sub-processor list (sources 36–45).
// Run AFTER reviews.ts:  pnpm exec payload run src/seed/reviews.ts && pnpm exec payload run src/seed/reviews-deep.ts
import { getPayload } from "payload";
import config from "../../payload.config";
import { h2, h3, ol, p, ul } from "./lexical";

/* eslint-disable @typescript-eslint/no-explicit-any */
const payload = await getPayload({ config });
const first = async (collection: any, where: any) => (await payload.find({ collection, where, limit: 1, depth: 0 })).docs[0] as any;

const SOURCES = [
  { number: 36, publisher: "Sage GmbH", title: "Customer Due Diligence: Unterauftragsverarbeiter je Produkt", url: "https://www.sage.com/de-de/vertrauen-sicherheit/datenschutz/customer-due-diligence/", type: "anbieter" },
  { number: 37, publisher: "Lexware (Haufe-Lexware GmbH & Co. KG)", title: "Preise und Versionen von Lexware Office", url: "https://www.lexware.de/preise/", type: "anbieter" },
  { number: 38, publisher: "Lexware (Haufe-Lexware GmbH & Co. KG)", title: "Datenschutz und Datensicherheit", url: "https://www.lexware.de/datenschutz-datensicherheit/", type: "anbieter" },
  { number: 39, publisher: "Lexware (Haufe-Lexware GmbH & Co. KG)", title: "DATEV-Schnittstelle in Lexware Office", url: "https://www.lexware.de/funktionen/datev-schnittstelle/", type: "anbieter" },
  { number: 40, publisher: "sevdesk GmbH", title: "Preise und Tarife", url: "https://www.sevdesk.de/preise/", type: "anbieter" },
  { number: 41, publisher: "sevdesk GmbH", title: "Sicherheit bei sevdesk", url: "https://sevdesk.de/sicherheit/", type: "anbieter" },
  { number: 42, publisher: "weclapp SE", title: "Hilfe: DATEV-Schnittstellen in weclapp", url: "https://doc.weclapp.com/knowledgebase/wie-funktioniert-datev-buchungsdatenservice", type: "anbieter" },
  { number: 43, publisher: "Personio SE & Co. KG", title: "Security and Trust", url: "https://www.personio.com/security/", type: "anbieter" },
  { number: 44, publisher: "Sage GmbH", title: "E-Rechnung: Lösungen von Sage", url: "https://www.sage.com/de-de/e-rechnung/loesungen/", type: "anbieter" },
  { number: 45, publisher: "sevdesk GmbH", title: "Preise: Zusatzleistungen und Häufige Fragen", url: "https://www.sevdesk.de/preise/#faq", type: "anbieter" },
];

const MARKER = "Für wen eignet sich";

const DEEP: Record<string, { sources: number[]; blocks: any[] }> = {
  /* ------------------------------------------------------------ Sage Active */
  "sage-active": {
    sources: [36, 44],
    blocks: [
      h2("Für wen eignet sich Sage Active?"),
      h3("Passt gut"),
      ul([
        "Kleine Unternehmen und Selbstständige mit 1 bis 50 Beschäftigten, die Rechnungen, Buchhaltung und eine kleine Lohnabrechnung in einer Oberfläche haben möchten",
        "Betriebe, die mit einem Steuerbüro arbeiten, das DATEV nutzt, und die Umsatzsteuer-Voranmeldung selbst per ELSTER übermitteln",
        "Teams mit mehreren Personen im Büro: Schon der Starter enthält fünf Nutzende, Essentials zehn",
      ]),
      h3("Passt weniger"),
      ul([
        "Unternehmen mit Lager, Produktion oder mehreren Gesellschaften (dafür nennt Sage selbst andere Produkte)",
        "Betriebe mit mehr als einer Handvoll Beschäftigten in der Lohnabrechnung, die umfangreiche HR-Funktionen brauchen. Hier ist [Sage Lohnabrechnung](/software/sage-lohnabrechnung) die spezialisiertere Lösung",
        "Wer ausschließlich Rechnungen schreiben will, zahlt bei Einstiegstarifen anderer Anbieter weniger",
      ]),
      h2("Datenschutz und Sicherheit"),
      p("Sage veröffentlicht für jedes Produkt eine Liste der Unterauftragsverarbeiter. Für Sage Active nennt sie Microsoft Azure mit Rechenzentrum in Deutschland. Dazu kommen Dienste mit Verarbeitung außerhalb Deutschlands: Cloudflare (USA) für Web-Sicherheit und Infrastruktur, OPSWAT (Frankreich) für die Viren- und Malware-Prüfung, Pendo (USA) für Nutzungsanalysen, Upland/RightAnswer (USA) für die Support-Plattform und Twilio SendGrid (USA) für den E-Mail-Versand."),
      p("Für Ihre Datenschutz-Dokumentation heißt das: Die Buchhaltungsdaten liegen in Deutschland, einzelne Begleitdienste verarbeiten Daten aber in den USA. Lassen Sie sich vor dem Abschluss den Auftragsverarbeitungsvertrag geben und prüfen Sie, auf welcher Grundlage die Übermittlung in die USA erfolgt. Was ein AVV enthalten muss, erklärt unser Beitrag [Cloud-Software und Datenschutz](/magazin/cloud-software-datenschutz-avv-dsgvo)."),
      h2("E-Rechnung in Sage Active"),
      p("Sage nennt auf seiner E-Rechnungs-Seite XRechnung und ZUGFeRD nach der europäischen Norm EN 16931 als unterstützte Formate, integriert in die jeweilige Sage-Lösung. Auf der Produktseite von Sage Active ist ausdrücklich das Einlesen eingehender E-Rechnungen in beiden Tarifen beschrieben. Seit dem 1. Januar 2025 müssen alle inländischen Unternehmen E-Rechnungen empfangen können, ab 2027 beziehungsweise 2028 gilt schrittweise die Pflicht zum Versand. Die Fristen im Detail finden Sie in [E-Rechnung: alle Fristen bis 2028](/magazin/e-rechnung-fristen-bis-2028)."),
      p("Unser Rat: Wenn Sie zu den Unternehmen gehören, die ab 2027 E-Rechnungen versenden müssen, lassen Sie sich in der Testphase zeigen, wie eine XRechnung aus Ihrem Tarif erzeugt und versendet wird, und prüfen Sie eine Testrechnung mit einem kostenlosen Validator."),
      h2("Zusammenarbeit mit dem Steuerbüro"),
      ul([
        "**Essentials:** Export der Buchhaltungsdaten im DATEV-Format, Umsatzsteuer-Voranmeldung per ELSTER, EÜR sowie Unterstützung für GuV und Bilanz",
        "**Starter:** keine eigene Buchhaltung. Hier gehen Rechnungen und Belege an das Steuerbüro, das die Buchungen übernimmt",
        "Klären Sie vorab mit Ihrer Kanzlei, ob sie einen Export-Datei-Import nutzt oder lieber direkt in DATEV Unternehmen online arbeitet. Hintergründe im Beitrag [Zusammenarbeit mit dem Steuerbüro](/magazin/zusammenarbeit-steuerbuero-datev-export)",
      ]),
      h2("Einführung in der Praxis"),
      ol([
        "Starter 14 Tage ohne Kreditkarte testen oder direkt Essentials 30 Tage mit Zahlungsdaten",
        "Firmendaten, Kontenrahmen (SKR03 oder SKR04) und Steuerdaten hinterlegen. Den Kontenrahmen mit dem Steuerbüro abstimmen",
        "Bankkonto verbinden und die Belege der letzten Wochen per Drag and Drop hochladen",
        "Eine Testrechnung erzeugen und eine eingehende E-Rechnung einlesen",
        "DATEV-Export einmal mit der Kanzlei durchspielen, bevor der Echtbetrieb startet",
        "Rechtzeitig vor dem Ende der Aktion (50 % für drei Monate) prüfen, ob der Tarif passt",
      ]),
      h2("Wann eine andere Lösung besser passt"),
      ul([
        "[Lexware Office](/software/lexware-office): niedrigerer Einstieg, Lohn & Gehalt als Zusatzmodul, Rechenzentren in Frankfurt",
        "[sevdesk](/software/sevdesk): dauerhaft kostenloser Tarif für bis zu drei Rechnungen pro Monat",
        "[weclapp](/software/weclapp): wenn Warenwirtschaft, Projekte oder Lager dazukommen",
      ]),
      h2("Häufige Fragen zu Sage Active"),
      h3("Kann ich vom Starter in Essentials wechseln?"),
      p("Ja. Die Tarife bauen aufeinander auf. Beachten Sie, dass die Testphase von Essentials mit Zahlungsdaten startet."),
      h3("Was passiert, wenn ich mehr als 300 Rechnungen im Monat schreibe?"),
      p("Zusätzliche Rechnungen kosten 0,05 € je Stück oder werden als Paket gebucht, etwa 100 Rechnungen für 10 €. Essentials enthält 500 Rechnungen pro Monat."),
      h3("Wo liegen meine Daten?"),
      p("Laut der Unterauftragsverarbeiter-Liste von Sage im Microsoft-Azure-Rechenzentrum in Deutschland. Einzelne Begleitdienste wie Support-Plattform, Nutzungsanalyse und E-Mail-Versand verarbeiten Daten in den USA."),
    ],
  },

  /* ------------------------------------------------------------ Sage Lohnabrechnung */
  "sage-lohnabrechnung": {
    sources: [],
    blocks: [
      h2("Für wen eignet sich Sage Lohnabrechnung?"),
      h3("Passt gut"),
      ul([
        "Betriebe mit wenigen bis gut hundert Beschäftigten, die die Lohnabrechnung selbst digital erledigen statt sie komplett auszulagern",
        "Unternehmen, die Abrechnungen und Steuerdokumente den Beschäftigten online bereitstellen möchten",
        "Teams, die ab dem Tarif Standard Arbeitszeiten, Überstunden und Urlaub in derselben Lösung führen wollen",
      ]),
      h3("Passt weniger"),
      ul([
        "Unternehmen über 150 Mitarbeitende (Obergrenze laut Anbieter)",
        "Betriebe mit sehr komplexen Abrechnungsfällen wie Altersteilzeit oder Versorgungsbezügen. Dafür bewirbt Sage die [Sage HR Suite](/software/sage-hr-suite)",
        "Wer Buchhaltung und Rechnungen in derselben Software möchte",
      ]),
      h2("Was die Software Ihnen abnimmt und was nicht"),
      p("Die Software berechnet Lohnsteuer und Sozialversicherungsbeiträge und übermittelt laut Anbieter die gesetzlichen Meldungen automatisch an Behörden und Krankenkassen. Die fachliche Verantwortung bleibt beim Arbeitgeber: Stammdaten wie Steuerklasse, Krankenkasse, Beschäftigungsart und Arbeitszeit müssen stimmen. Die häufigsten Fehlerquellen beschreibt unser Beitrag [Lohnabrechnung: Fehler und Meldepflichten](/magazin/lohnabrechnung-fehler-meldepflichten-kleine-betriebe)."),
      p("Für Minijobs gelten eigene Regeln, etwa die Meldung an die Minijob-Zentrale. Wie Sie Minijobs korrekt abrechnen, lesen Sie im Ratgeber [Minijob richtig abrechnen](/ratgeber/minijob-abrechnen-geringfuegigkeitsgrenze)."),
      h2("Welcher Tarif für welchen Betrieb?"),
      ul([
        "**Essentials (20 € + 3 € je weitere Person):** reine Abrechnung, Beschäftigtenzugang, Dokumente und bis zu drei Abwesenheitsarten. Genug, wenn Arbeitszeiten anderswo erfasst werden",
        "**Standard (30 € + 5 €):** sinnvoll, sobald Sie die [Arbeitszeiterfassung](/ratgeber/arbeitszeiterfassung-pflicht-arbeitgeber), Überstunden, Urlaub und Genehmigungen digital abbilden möchten",
        "**Premium (40 € + 7 €):** für Betriebe mit Schichtplanung und Spesenabrechnung per App",
      ]),
      p("Bei zwölf Beschäftigten beträgt der Aufpreis von Essentials auf Standard 24 € im Monat. Wenn eine separate Zeiterfassungs-App ähnlich viel kostet, ist die integrierte Lösung meist einfacher, weil Zeiten ohne Medienbruch in die Abrechnung fließen."),
      h2("Zusammenarbeit mit dem Steuerbüro"),
      p("Die Lohnbuchungen lassen sich laut Anbieter für Sage und DATEV exportieren. Damit kann die Kanzlei die Lohnkosten in der Finanzbuchhaltung verbuchen, ohne die Abrechnung selbst zu erstellen. Stimmen Sie vor dem ersten Monat ab, welche Lohnkonten die Kanzlei erwartet."),
      h2("Einführung in der Praxis"),
      ol([
        "Testphase (30 Tage) für einen Probemonat nutzen und mit der letzten Abrechnung des bisherigen Systems vergleichen",
        "Stammdaten aller Beschäftigten übernehmen: Steuer-ID, Sozialversicherungsnummer, Krankenkasse, Steuerklasse, Bankverbindung",
        "Bisherige Jahreswerte (Lohnsteuer, SV-Brutto) übernehmen, wenn der Wechsel unterjährig erfolgt",
        "Lohnarten für Zuschläge, Sachbezüge und Einmalzahlungen anlegen",
        "Beschäftigtenzugang freischalten, damit Abrechnungen digital abrufbar sind",
        "Ersten Echtmonat parallel prüfen, bevor Sie das Altsystem abschalten",
      ]),
      p("Mehr zur Auswahl finden Sie im Ratgeber [Lohnabrechnungssoftware für kleine Unternehmen](/ratgeber/lohnabrechnungssoftware-kleine-unternehmen)."),
      h2("Wann eine andere Lösung besser passt"),
      ul([
        "[Lexware Office](/software/lexware-office) mit dem Zusatzmodul Lohn & Gehalt, wenn Buchhaltung und Lohn aus einer Hand kommen sollen",
        "[Sage Active](/software/sage-active) Essentials für sehr kleine Teams mit zwei Beschäftigten in der Abrechnung",
        "[Personio](/software/personio) mit Payroll für wachsende Unternehmen mit umfangreichen HR-Prozessen",
      ]),
      h2("Häufige Fragen zu Sage Lohnabrechnung"),
      h3("Muss ich Meldungen selbst übermitteln?"),
      p("Nein. Laut Anbieter werden die gesetzlichen Meldungen automatisch erstellt und an Behörden und Krankenkassen übermittelt. Prüfen Sie trotzdem regelmäßig die Rückmeldungen der Krankenkassen."),
      h3("Was kostet die Software bei 30 Beschäftigten?"),
      p("Essentials 95 €, Standard 155 € und Premium 215 € pro Monat zzgl. MwSt., jeweils mit fünf enthaltenen und 25 zusätzlichen Personen."),
      h3("Kann ich jederzeit kündigen?"),
      p("Laut Anbieter ist die Kündigung jederzeit möglich. Sichern Sie vor dem Ende alle Abrechnungen und Lohnkonten, denn Lohnunterlagen unterliegen Aufbewahrungspflichten."),
    ],
  },

  /* ------------------------------------------------------------ Sage 100 */
  "sage-100": {
    sources: [36],
    blocks: [
      h2("Für wen eignet sich Sage 100?"),
      h3("Passt gut"),
      ul([
        "Mittelständler mit 10 bis 250 Mitarbeitenden, die Warenwirtschaft, Rechnungswesen und gegebenenfalls Produktion in einem System bündeln",
        "Unternehmen, die zwischen eigenem Server und Cloud wählen möchten oder bewusst lokal bleiben wollen",
        "Firmen mit mehreren Mandanten: Laut Anbieter ist die Mandantenzahl unbegrenzt",
        "Betriebe, die Branchenfunktionen über zertifizierte Partnerlösungen ergänzen müssen",
      ]),
      h3("Passt weniger"),
      ul([
        "Kleine Betriebe, die nur Rechnungen und Buchhaltung brauchen. Hier sind [Sage Active](/software/sage-active) oder [Lexware Office](/software/lexware-office) deutlich günstiger",
        "Unternehmen, die monatlich flexibel bleiben wollen: Die veröffentlichten Preise setzen zwölf Monate Laufzeit voraus",
        "Internationale Konzernstrukturen, für die Sage selbst auf Sage X3 verweist",
      ]),
      h2("Datenschutz, Hosting und Partner"),
      p("Die Cloud-Variante speichert die Daten laut Anbieter in deutschen Rechenzentren. Die Unterauftragsverarbeiter-Liste von Sage nennt für „Sage 100 Hosting“ die Elabs AG (Deutschland) für Rechenzentrum und Systemadministration. Für Zusatzlösungen wie mobile Datenerfassung, Betriebsdatenerfassung oder die PPS Suite sind jeweils deutsche Partnerunternehmen für den 2nd- und 3rd-Level-Support aufgeführt."),
      p("Bei einer lokalen Installation tragen Sie selbst die Verantwortung für Server, Datensicherung und Updates. Rechnen Sie diese Kosten in den Vergleich ein. Eine Entscheidungshilfe bietet unser Ratgeber zu [ERP-Kosten im Mittelstand](/ratgeber/erp-kosten-mittelstand)."),
      h2("Einführung in der Praxis"),
      p("Eine ERP-Einführung ist ein Projekt, keine Installation. Sage 100 wird typischerweise mit einem Sage-Partner eingeführt. Bewährt hat sich dieses Vorgehen:"),
      ol([
        "Ist-Prozesse aufnehmen und ein Lastenheft schreiben: Welche Abläufe muss das System abbilden, welche Schnittstellen braucht es?",
        "Mindestens zwei Partnerangebote einholen, die Lizenz, Einführung, Datenmigration, Schulung und Wartung getrennt ausweisen",
        "Stammdaten bereinigen (Artikel, Kunden, Lieferanten), bevor sie migriert werden",
        "Einen Pilotbereich, etwa den Einkauf, zuerst umstellen und erst dann ausrollen",
        "DATEV-Export und ELSTER-Voranmeldung mit dem Steuerbüro testen",
        "Stichtag für den Echtbetrieb an einen Monats- oder Quartalswechsel legen",
      ]),
      p("Die typischen Projektphasen beschreibt unser Ratgeber [ERP-Einführung im Mittelstand](/ratgeber/erp-einfuehrung-mittelstand)."),
      h2("Kosten über drei Jahre richtig vergleichen"),
      p("Ein Rechenbeispiel aus den Listenpreisen: Zehn Nutzende mit Warenwirtschaft und Rechnungswesen kosten ab 1.140 € im Monat, also ab 41.040 € in drei Jahren netto, nur für die Lizenzen. Einführung, Anpassungen und Schulung kommen hinzu. Bitten Sie die Partner, diese Posten als Festpreis oder mit Stundenkontingent anzubieten, damit Sie Angebote vergleichen können."),
      h2("Wann eine andere Lösung besser passt"),
      ul([
        "[weclapp](/software/weclapp): reines Cloud-ERP mit Daten in Deutschland, monatlich buchbare Pakete und öffentliche Preise je Nutzer",
        "Für kleinere Betriebe ohne Lager: [Sage Active](/software/sage-active)",
      ]),
      h2("Häufige Fragen zu Sage 100"),
      h3("Gibt es Sage 100 auch zur Miete?"),
      p("Ja. Die veröffentlichten Preise gelten pro Nutzer und Monat bei jährlicher Rechnungsstellung mit zwölf Monaten Mindestlaufzeit."),
      h3("Kann Sage 100 E-Rechnungen versenden?"),
      p("Laut Anbieter können XRechnung und ZUGFeRD erstellt und versendet werden, eingehende Rechnungen laufen über einen zentralen Rechnungseingang."),
      h3("Wie lange dauert die Einführung?"),
      p("Das hängt vom Umfang ab. Planen Sie bei mehreren Modulen und Datenmigration eher Monate als Wochen ein und lassen Sie sich vom Partner einen Projektplan geben."),
    ],
  },

  /* ------------------------------------------------------------ Sage HR Suite */
  "sage-hr-suite": {
    sources: [36],
    blocks: [
      h2("Für wen eignet sich die Sage HR Suite?"),
      h3("Passt gut"),
      ul([
        "Unternehmen ab etwa 50 Mitarbeitenden mit umfassenden oder komplexen HR-Prozessen",
        "Betriebe mit anspruchsvollen Abrechnungsfällen wie Altersteilzeit, Kurzarbeit, Zuschlägen, Versorgungsbezügen oder betrieblicher Altersvorsorge",
        "Personalabteilungen, die Module schrittweise einführen und zwischen lokalem Betrieb, Hosting und Cloud wählen möchten",
      ]),
      h3("Passt weniger"),
      ul([
        "Kleine Betriebe mit einfacher Abrechnung: [Sage Lohnabrechnung](/software/sage-lohnabrechnung) ist günstiger und schneller eingerichtet",
        "Unternehmen, die monatlich kündbare Verträge suchen",
      ]),
      h2("Hosting und Datenschutz"),
      p("Die Unterauftragsverarbeiter-Liste von Sage führt für den „Sage HR-Hosting Service“ die Microsoft GmbH mit Rechenzentrum in Deutschland und die Netz 16 GmbH für Einrichtung, Administration und Monitoring auf. Für die Cloud-Variante der digitalen Personalakte ist die d.velop AG (Deutschland) genannt, für die HR Suite selbst unter anderem die CTI GmbH für Bereitstellung und Betrieb der Online-Anwendung. Alle genannten Dienstleister haben ihren Sitz in Deutschland."),
      p("Personaldaten gehören zu den sensibelsten Daten im Unternehmen. Klären Sie vor der Einführung das Rollen- und Rechtekonzept und beziehen Sie, wo vorhanden, den Betriebsrat früh ein, denn bei technischen Einrichtungen zur Leistungs- oder Verhaltenskontrolle hat er ein Mitbestimmungsrecht."),
      h2("Module sinnvoll kombinieren"),
      ul([
        "**Start mit der Personalabrechnung:** Sie ist das Pflichtstück und Grundlage für Zeitwirtschaft und Auswertungen",
        "**Zeitmanagement:** sinnvoll, sobald Zuschläge, Gleitzeit oder Schichtmodelle automatisch in die Abrechnung fließen sollen. Hintergrund: [Überstunden und Arbeitszeitkonto erfassen](/magazin/ueberstunden-arbeitszeitkonto-erfassen)",
        "**Bewerbermanagement Smart:** ab 19 € im Monat für Unternehmen mit regelmäßigen Ausschreibungen",
        "**Digitale Personalakte:** löst Papierakten ab. Sage weist selbst darauf hin, dass die Erfüllung gesetzlicher Anforderungen vom Einzelfall abhängt",
      ]),
      h2("Einführung in der Praxis"),
      ol([
        "Anforderungen sammeln: Abrechnungsfälle, Arbeitszeitmodelle, Schnittstellen zur Finanzbuchhaltung",
        "Angebot mit Ihrer Mitarbeiterzahl und den gewünschten Modulen anfordern",
        "Betriebsmodell festlegen: lokal, gehostet oder Cloud",
        "Stammdaten- und Lohnkontenübernahme mit Parallelabrechnung planen",
        "Rechtekonzept und Betriebsvereinbarung abstimmen",
      ]),
      p("Wie Sie HR-Software allgemein auswählen, lesen Sie im Ratgeber [HR-Software für den Mittelstand](/ratgeber/hr-software-mittelstand)."),
      h2("Wann eine andere Lösung besser passt"),
      ul([
        "[Personio](/software/personio): Cloud-HR-Plattform mit öffentlichen Einstiegspreisen und Payroll-Anbindung",
        "[Sage Lohnabrechnung](/software/sage-lohnabrechnung): schlanke Cloud-Abrechnung bis 150 Mitarbeitende",
      ]),
      h2("Häufige Fragen zur Sage HR Suite"),
      h3("Was kostet die HR Suite insgesamt?"),
      p("Sage nennt nur Einstiegspreise: Personalabrechnung ab 39 € und Bewerbermanagement Smart ab 19 € pro Monat für einen Arbeitsplatz bei jährlicher Rechnungsstellung. Den Gesamtpreis für Ihre Mitarbeiterzahl erfahren Sie nur im Angebot."),
      h3("Kann ich die Abrechnung auslagern?"),
      p("Ja, laut Anbieter sind Hosting und auf Wunsch die Auslagerung der Entgeltabrechnung möglich. Die Abwägung beschreibt unser Ratgeber [Lohnabrechnungssoftware für kleine Unternehmen](/ratgeber/lohnabrechnungssoftware-kleine-unternehmen)."),
    ],
  },

  /* ------------------------------------------------------------ Lexware Office */
  "lexware-office": {
    sources: [37, 38, 39],
    blocks: [
      h2("Für wen eignet sich Lexware Office?"),
      h3("Passt gut"),
      ul([
        "Selbstständige, Freiberufler und kleine Unternehmen, die günstig starten und den Funktionsumfang später erweitern wollen",
        "Betriebe, die eng mit dem Steuerbüro arbeiten: Kanzleizugang und DATEV-Schnittstelle sind enthalten",
        "Kleine Arbeitgeber, die die Lohnabrechnung über das Zusatzmodul Lohn & Gehalt in derselben Software erledigen möchten",
      ]),
      h3("Passt weniger"),
      ul([
        "Händler mit Lagerhaltung oder Produktion. Dafür fehlt eine Warenwirtschaft, siehe [weclapp](/software/weclapp)",
        "Unternehmen mit mehr als 50 Beschäftigten in der Lohnabrechnung",
      ]),
      h2("Welche Version brauchen Sie?"),
      ul([
        "**S (7,90 €):** Sie sammeln nur Belege und geben sie an das Steuerbüro. E-Rechnungen lassen sich erfassen",
        "**M (12,90 €):** Sie schreiben Angebote, Rechnungen und E-Rechnungen und mahnen säumige Kunden. Hintergrund: [Zahlungsverzug und Mahnwesen](/magazin/zahlungsverzug-kunden-mahnwesen-automatisieren)",
        "**L (21,90 €):** Sie buchen selbst, erstellen die EÜR und übermitteln die Umsatzsteuer-Voranmeldung",
        "**XL (32,90 €):** Sie brauchen EU- und Abschlagsrechnungen oder die öffentliche API",
      ]),
      p("Die Testphase dauert 30 Tage mit vollem XL-Umfang inklusive Lohn & Gehalt. Danach wählen Sie die Version. Ein Wechsel ist laut Preisseite jederzeit in den Kontoeinstellungen möglich."),
      h2("Datenschutz und Sicherheit"),
      ul([
        "**Rechenzentren:** mehrere Hochsicherheitsrechenzentren am Standort Frankfurt am Main, laut Anbieter nach ISO 27001 und PCI DSS zertifiziert",
        "**Prüfung:** Software- und Datensicherheit werden laut Anbieter regelmäßig von einer unabhängigen Wirtschaftsprüfungsgesellschaft nach IDW PS 880, IDW RS FAIT 1 und GoBD geprüft",
        "**Verschlüsselung:** Verbindung per 256-Bit-TLS, besonders sensible Daten mit AES",
        "**Datensicherung:** tägliche Sicherung, verteilt auf mehrere voneinander unabhängige Rechenzentren in Frankfurt",
        "**Auftragsverarbeitung:** Mit den eigenen Dienstleistern bestehen laut Anbieter AVVs nach Art. 28 DSGVO",
      ]),
      p("Eine Software kann nicht „GoBD-zertifiziert“ sein, denn die GoBD sind Verwaltungsgrundsätze, kein Zertifikat. Ein Prüfbericht nach IDW PS 880 belegt aber, dass die Software ordnungsgemäß arbeiten kann. Die Verantwortung für die richtige Nutzung bleibt bei Ihnen, siehe [GoBD einfach erklärt](/ratgeber/gobd-einfach-erklaert)."),
      h2("Zusammenarbeit mit dem Steuerbüro"),
      p("Lexware Office bietet laut Anbieter drei Wege zur Kanzlei. Die DATEV-Schnittstelle ist bereits enthalten:"),
      ul([
        "**DATEV-Rechnungsdatenservice 1.0:** für Betriebe, deren Steuerkanzlei die laufende Buchhaltung erledigt. Ein- und Ausgangsrechnungen werden mit Belegdaten übertragen",
        "**DATEV-Buchungsdatenservice:** für Selbstbucher. Belegbilder, Buchungs- und Zahlungsdaten gehen an die Kanzlei, die den Abschluss erstellt",
        "**Klassischer DATEV-Export:** Download von Belegen, Buchungsstapeln oder einzelnen Buchungssätzen, auch als CSV",
      ]),
      p("Zusätzlich erhält Ihre Kanzlei auf Wunsch einen kostenlosen Online-Zugang. Für Betriebsprüfungen steht ein Export im IDEA-Format bereit. Welcher Weg passt, besprechen Sie am besten vorab mit der Kanzlei, siehe [Zusammenarbeit mit dem Steuerbüro](/magazin/zusammenarbeit-steuerbuero-datev-export)."),
      h2("Support"),
      p("Der Support ist im Preis enthalten: Hilfe direkt in der Software, E-Mail-Support, eine kostenlose Hotline montags bis freitags von 8 bis 18 Uhr und ein Online-Hilfecenter. Die Lexware-App gibt es für iOS und Android."),
      h2("Einführung in der Praxis"),
      ol([
        "30 Tage mit allen Funktionen testen und dabei die gewünschte Version festlegen",
        "Bankkonten über Multibanking verbinden",
        "Rechnungsvorlage mit Logo, Pflichtangaben und Zahlungsbedingungen anlegen",
        "Eine E-Rechnung im Format XRechnung oder ZUGFeRD erzeugen und prüfen",
        "Steuerberaterzugang einrichten und den DATEV-Weg mit der Kanzlei festlegen",
        "Nach dem Aktionszeitraum die Version nach tatsächlichem Bedarf anpassen",
      ]),
      h2("Wann eine andere Lösung besser passt"),
      ul([
        "[sevdesk](/software/sevdesk): dauerhaft kostenloser Einstieg und günstigere Preise bei langer Laufzeit",
        "[Sage Active](/software/sage-active): mehr Nutzende inklusive und Lohnabrechnung im Tarif Essentials",
      ]),
      h2("Häufige Fragen zu Lexware Office"),
      h3("Ist Lexware Office monatlich kündbar?"),
      p("Ja. Es gibt laut Preisseite keine Mindestlaufzeit, bezahlt wird per Lastschrift oder Kreditkarte."),
      h3("Wo liegen meine Daten?"),
      p("In mehreren Rechenzentren am Standort Frankfurt am Main, die laut Anbieter nach ISO 27001 und PCI DSS zertifiziert sind."),
      h3("Kann ich mit Lexware Office Löhne abrechnen?"),
      p("Ja, mit dem Zusatzmodul Lohn & Gehalt für 12,90 € pro Monat regulär. Es ist laut Preisseite mit allen Versionen kombinierbar und für bis zu 50 Beschäftigte ausgelegt."),
    ],
  },

  /* ------------------------------------------------------------ sevdesk */
  sevdesk: {
    sources: [40, 41, 45],
    blocks: [
      h2("Für wen eignet sich sevdesk?"),
      h3("Passt gut"),
      ul([
        "Gründerinnen, Gründer und Kleinunternehmen, die mit wenigen Rechnungen pro Monat kostenlos starten wollen. Dazu passt unser Ratgeber [E-Rechnung für Kleinunternehmer](/ratgeber/e-rechnung-kleinunternehmer)",
        "Selbstständige, die ihre Buchhaltung selbst erledigen und die Umsatzsteuer-Voranmeldung per ELSTER senden",
        "Betriebe, die sich ein bis zwei Jahre binden können und dafür deutlich günstigere Monatspreise erhalten",
      ]),
      h3("Passt weniger"),
      ul([
        "Teams mit vielen Nutzenden: Jeder Tarif enthält eine Person, jede weitere kostet 5,90 € pro Monat",
        "Arbeitgeber, die die Lohnabrechnung in derselben Software erledigen wollen",
        "Händler, die eine vollwertige Lagerverwaltung brauchen. Die Inventur-Funktion kostet extra (19,90 € pro Monat)",
      ]),
      h2("Zusatzkosten im Blick"),
      p("Die Preisseite listet neben den Tarifen kostenpflichtige Extras. Prüfen Sie, welche Sie wirklich brauchen:"),
      ul([
        "Weitere Nutzende: 5,90 € pro Monat",
        "Zeiterfassung: 4,90 € pro Monat",
        "Inventur und Lager: 19,90 € pro Monat",
        "Premium-Layouts: 3,90 € pro Monat; zusätzliches Briefpapier oder ein weiterer Layout-Platz je 4,90 € pro Monat",
        "Einrichtungstermin: 49 € einmalig; Experten-Termin ab 24,90 € je 15 Minuten",
        "Vier-Augen-Prüfung eines Belegs: 3 € je Dokument",
      ]),
      p("Beispiel: Tarif Buchhaltung mit zwei Nutzenden und Zeiterfassung kostet bei monatlicher Abrechnung 25,90 € + 5,90 € + 4,90 € = 36,70 € pro Monat zzgl. MwSt."),
      h2("Datenschutz und Sicherheit"),
      p("sevdesk nennt auf seiner Sicherheitsseite Amazon Web Services als Hosting-Anbieter und beschreibt unter anderem Verschlüsselung, DDoS-Schutz und die AWS Web Application Firewall. Nutzende können eine Multi-Faktor-Authentifizierung aktivieren, was wir für jede Buchhaltungssoftware dringend empfehlen."),
      p("Eine konkrete Rechenzentrumsregion nennen Sicherheits- und Preisseite nicht. Fordern Sie vor dem Abschluss den Auftragsverarbeitungsvertrag an und lassen Sie sich die Region und die Liste der Unterauftragsverarbeiter bestätigen. Worauf Sie achten sollten, erklärt unser Beitrag [Cloud-Software und Datenschutz](/magazin/cloud-software-datenschutz-avv-dsgvo)."),
      h2("E-Rechnungen mit sevdesk"),
      p("Schon der kostenlose Tarif erstellt bis zu drei E-Rechnungen pro Monat im Format ZUGFeRD oder XRechnung, ab dem Tarif Rechnung unbegrenzt. Empfangene E-Rechnungen laden Sie laut Anbieter einfach hoch, die Rechnungsdaten werden automatisch für die Buchhaltung ausgelesen. Die Funktion steht auch in der Mobile App zur Verfügung."),
      h2("Zusammenarbeit mit dem Steuerbüro"),
      ul([
        "**Ab Tarif Rechnung:** DATEV- und ADDISON-Schnittstelle sowie direkter Zugang für das Steuerbüro",
        "**Ab Tarif Buchhaltung:** DATEV-konforme Exporte (CSV und XML im DATEV-Format), DATEV-Rechnungsdatenservice 1.0, DATEV-Buchungsdatenservice sowie ADDISON OneClick und SMART Connect",
      ]),
      h2("Support"),
      p("Alle bezahlten Tarife enthalten persönlichen Support per Live-Chat, E-Mail und Telefon. Alle Tarife haben Zugriff auf Wissensdatenbank, Webinare, Video-Tutorials und den rund um die Uhr erreichbaren KI-Assistenten „Sevi“."),
      h2("Einführung in der Praxis"),
      ol([
        "14 Tage alle Funktionen ohne Kreditkarte testen. Danach wechselt das Konto automatisch in den kostenlosen Tarif, es entstehen keine Kosten",
        "Bankkonto verbinden (Tarif Buchhaltung) und Belege per App fotografieren",
        "Rechnungslayout und Pflichtangaben einrichten, eine Test-E-Rechnung erzeugen",
        "Steuerbüro-Zugang einrichten und den DATEV-Weg festlegen",
        "Erst nach dem Test über Laufzeit entscheiden: 12 oder 24 Monate senken den Monatspreis deutlich",
      ]),
      h2("Wann eine andere Lösung besser passt"),
      ul([
        "[Lexware Office](/software/lexware-office): Rechenzentren in Frankfurt und Lohnmodul zubuchbar",
        "[Sage Active](/software/sage-active): mehr Nutzende im Grundpreis",
      ]),
      h2("Häufige Fragen zu sevdesk"),
      h3("Ist sevdesk wirklich kostenlos?"),
      p("Der Tarif „Kostenlos“ ist laut Anbieter dauerhaft gratis und umfasst bis zu drei Rechnungen oder E-Rechnungen pro Monat. Buchhaltung, Bankanbindung und unbegrenzte Rechnungen gibt es nur in den bezahlten Tarifen."),
      h3("Wie wird bezahlt?"),
      p("Laut Preisseite monatlich per Kreditkarte oder PayPal. Jahrespläne werden einmal im Jahr im Voraus berechnet."),
      h3("Kann ich mehrere Firmen verwalten?"),
      p("Laut Anbieter lässt sich sevdesk für mehrere Tätigkeiten nutzen, etwa freiberuflich und gewerblich. Klären Sie, ob dafür ein zweites Konto nötig ist."),
    ],
  },

  /* ------------------------------------------------------------ weclapp */
  weclapp: {
    sources: [42],
    blocks: [
      h2("Für wen eignet sich weclapp?"),
      h3("Passt gut"),
      ul([
        "Dienstleister und Agenturen, die CRM, Projekte, Zeiterfassung und Rechnungen verbinden wollen (Paket Dienstleistung)",
        "Händler mit Lager, Einkauf, Online-Shop oder Marktplätzen (Paket Handel)",
        "Unternehmen, für die die Datenhaltung in Deutschland ein Muss ist",
        "Betriebe, die ihre Prozesse über eine API mit weiteren Systemen verbinden wollen",
      ]),
      h3("Passt weniger"),
      ul([
        "Teams mit vielen Gelegenheitsnutzenden, weil jede Person eine eigene Lizenz braucht",
        "Wer eine Lohnabrechnung im selben System erwartet",
        "Einzelunternehmer, die nur Rechnungen schreiben: [sevdesk](/software/sevdesk) oder [Lexware Office](/software/lexware-office) sind deutlich günstiger",
      ]),
      h2("Datenschutz und Hosting"),
      p("weclapp speichert die Daten laut Anbieter ausschließlich in Deutschland, verteilt auf mehrere Rechenzentren. Wer die Software im eigenen Haus betreiben möchte, kann die Variante weclappOn als Private Cloud nutzen."),
      h2("DATEV-Anbindung"),
      p("Die weclapp-Hilfe beschreibt drei Wege zu DATEV Unternehmen online, die unter Buchhaltung › Export eingerichtet werden:"),
      ul([
        "**Belegbilderservice:** überträgt PDF-Belege an DATEV, ohne dass in weclapp eine Buchhaltung eingerichtet sein muss. Benötigt werden Berater- und Mandantennummer von der Kanzlei",
        "**Rechnungsdatenservice 1.0:** überträgt Belege strukturiert mit Belegbild, setzt eine eingerichtete weclapp-Buchhaltung voraus",
        "**Buchungsdatenservice:** überträgt vollständige Buchungssätze mit verknüpftem Belegbild. Der Beginn des Wirtschaftsjahres muss mit den DATEV-Einstellungen übereinstimmen",
      ]),
      p("Wichtig aus der Hilfe: DATEV prüft nicht auf Duplikate. Übertragen Sie jeden Beleg nur einmal, weclapp empfiehlt eine gesammelte Übertragung zum Monatsende. Dazu kommt eine kostenlose Lizenz für die Steuerberatung."),
      h2("Support"),
      p("Kostenloser E-Mail-Support ist in allen Paketen enthalten. Telefon, Live-Chat und Fernwartung gibt es über die kostenpflichtigen Support-Pakete Bronze, Silber und Gold. Planen Sie das bei der Einführung ein."),
      h2("Einführung in der Praxis"),
      ol([
        "Paket nach Kernprozess wählen: Dienstleistung für Projekte, Handel für Lager und Shop",
        "Testzugang (30 Tage, endet automatisch) mit echten Beispieldaten befüllen",
        "Artikel-, Kunden- und Lieferantendaten bereinigen und per Import übernehmen",
        "DATEV-Weg mit der Kanzlei festlegen und einen Testmonat übertragen",
        "Nutzerzahl realistisch planen und Monats- gegen Jahreszahlung rechnen",
        "Bei mehr als zehn Lizenzen ein Enterprise-Angebot anfragen",
      ]),
      p("Wann sich ein ERP lohnt, beschreibt unser Beitrag [Excel am Limit](/magazin/excel-am-limit-wann-ein-erp-sinnvoll-ist). Für Händler lohnt außerdem [Lagerbestand ohne Überblick](/magazin/lagerbestand-ohne-ueberblick-handel)."),
      h2("Wann eine andere Lösung besser passt"),
      ul([
        "[Sage 100](/software/sage-100): modulares ERP mit Wahl zwischen eigenem Server und Cloud",
        "Für reine Rechnungs- und Buchhaltungsanforderungen: [Sage Active](/software/sage-active)",
      ]),
      h2("Häufige Fragen zu weclapp"),
      h3("Ist der Starter für Händler geeignet?"),
      p("Nein. ERP Starter enthält Kontakte, Rechnungen, Buchhaltung und E-Rechnung, aber keine Warenwirtschaft. Lager und Einkauf gibt es erst im Paket Handel."),
      h3("Gibt es eine API?"),
      p("Ja, in den Paketen Dienstleistung und Handel. Im Starter ist sie nicht enthalten."),
      h3("Was kosten Zusatzmodule?"),
      p("Vertragsmanagement, Helpdesk und Kasse (POS) kosten laut Preisseite ab 55 € pro Monat. Die Steuerberater-Lizenz und das Modul Zeit & Abwesenheit sind kostenlos."),
    ],
  },

  /* ------------------------------------------------------------ Personio */
  personio: {
    sources: [43],
    blocks: [
      h2("Für wen eignet sich Personio?"),
      h3("Passt gut"),
      ul([
        "Wachsende Unternehmen ab etwa 50 Mitarbeitenden, die Personalakte, Abwesenheiten, Zeiterfassung und Workflows zentral steuern",
        "HR-Teams, die Onboarding und Dokumente digital abbilden wollen. Hintergrund: [Onboarding und Nachweisgesetz](/magazin/onboarding-nachweisgesetz-arbeitsvertrag-fristen)",
        "Firmen, die eine EU-gehostete Lösung mit unabhängig geprüfter ISO-27001-Zertifizierung suchen",
      ]),
      h3("Passt weniger"),
      ul([
        "Kleine Teams unter etwa 56 Mitarbeitenden, weil die Mindestabnahme von 420 € pro Monat den Preis je Person deutlich erhöht",
        "Betriebe, die nur die Lohnabrechnung brauchen: [Sage Lohnabrechnung](/software/sage-lohnabrechnung) ist dafür schlanker",
      ]),
      h2("Datenschutz und Sicherheit"),
      ul([
        "**Hosting:** in der EU laut Anbieter",
        "**Zertifizierung:** ISO 27001, die Einhaltung wird jährlich von einer unabhängigen Prüfgesellschaft bestätigt",
        "**Verschlüsselung:** Daten werden laut Anbieter bei der Übertragung und im Ruhezustand verschlüsselt",
        "**Penetrationstests:** neben eigenen Schwachstellenscans regelmäßig durch externe Dienstleister",
        "**Unterauftragsverarbeiter:** Die vollständige Liste der Pflicht- und optionalen Dienstleister ist im Personio-Konto einsehbar",
      ]),
      p("Weil Personaldaten besonders schutzbedürftig sind, sollten Sie auch die optionalen Dienstleister prüfen und nur die Integrationen aktivieren, die Sie wirklich brauchen."),
      h2("Personio und die Lohnabrechnung"),
      p("Im Plan Core ist die vorbereitende Lohnbuchhaltung enthalten: Personio sammelt die abrechnungsrelevanten Daten. Die eigentliche Abrechnung erfolgt entweder mit Personio Payroll (ab 5 € pro Mitarbeitenden und Monat) oder über die Anbindung an DATEV, ADDISON oder ADP Advanced Pay, etwa bei Ihrem Steuerbüro. Wenn die Kanzlei Ihre Löhne bereits abrechnet, ist die Anbindung meist der einfachere Weg."),
      h2("Kosten nach Teamgröße"),
      ul([
        "**30 Mitarbeitende:** 420 € pro Monat wegen der Mindestabnahme, umgerechnet 14 € pro Person",
        "**56 Mitarbeitende:** 425,60 € pro Monat, ab hier liegt der Listenpreis über der Mindestabnahme",
        "**100 Mitarbeitende:** 760 € pro Monat für HR, mit Payroll zusätzlich 500 €",
        "**150 Mitarbeitende:** 1.140 € pro Monat für HR",
      ]),
      p("Ob die Preise netto oder brutto gelten, nennt die Preisseite nicht. Klären Sie das und die Vertragslaufzeit im Angebot."),
      h2("Einführung in der Praxis"),
      ol([
        "Demo buchen und mit eigenen Prozessen durchspielen: Onboarding, Urlaubsantrag, Krankmeldung",
        "Organisationsstruktur, Abwesenheitsarten und Arbeitszeitmodelle festlegen",
        "Mitarbeiterdaten importieren und Zugriffsrechte nach Rollen vergeben",
        "Lohnweg festlegen: Personio Payroll oder Anbindung an DATEV, ADDISON oder ADP",
        "Betriebsrat früh einbinden, besonders bei Zeiterfassung und Auswertungen",
      ]),
      p("Weitere Kriterien finden Sie im Ratgeber [HR-Software für den Mittelstand](/ratgeber/hr-software-mittelstand) und zur Zeiterfassungspflicht unter [Arbeitszeiterfassung: Pflichten für Arbeitgeber](/ratgeber/arbeitszeiterfassung-pflicht-arbeitgeber)."),
      h2("Wann eine andere Lösung besser passt"),
      ul([
        "[Sage HR Suite](/software/sage-hr-suite): modular, auch lokal oder gehostet betreibbar, für komplexe Abrechnungsfälle",
        "[Sage Lohnabrechnung](/software/sage-lohnabrechnung): günstige Cloud-Lohnabrechnung mit HR-Basisfunktionen",
      ]),
      h2("Häufige Fragen zu Personio"),
      h3("Gibt es eine kostenlose Testphase?"),
      p("Die Preisseite nennt eine Demo, aber keine frei zugängliche Testphase."),
      h3("Ist Personio DSGVO-konform?"),
      p("Personio gibt an, die wesentlichen Anforderungen der DSGVO zu erfüllen, in der EU zu hosten und nach ISO 27001 zertifiziert zu sein. Die DSGVO-Konformität Ihrer Nutzung hängt zusätzlich von Ihrem Rechtekonzept und dem Auftragsverarbeitungsvertrag ab."),
    ],
  },
};

/* ---------------------------------------------------------------- write */
for (const s of SOURCES) {
  if (!(await first("sources", { number: { equals: s.number } })))
    await payload.create({ collection: "sources", data: { ...s, type: s.type as never, accessedAt: new Date("2026-11-12T12:00:00.000Z").toISOString() } });
}
const srcIds = new Map<number, any>();
for (const s of SOURCES) srcIds.set(s.number, (await first("sources", { number: { equals: s.number } })).id);

const headingText = (n: any) => (n?.type === "heading" ? (n.children ?? []).map((c: any) => c.text ?? "").join("") : "");

for (const [slug, d] of Object.entries(DEEP)) {
  const sw = await first("software", { slug: { equals: slug } });
  if (!sw) {
    console.log("missing software:", slug);
    continue;
  }
  const review = sw.review ?? { root: { type: "root", version: 1, format: "", indent: 0, direction: "ltr", children: [] } };
  const children: any[] = review.root.children ?? [];
  if (children.some((n) => headingText(n).startsWith(MARKER))) {
    console.log("already deep:", slug);
    continue;
  }
  const fazit = children.findIndex((n) => headingText(n) === "Fazit");
  const at = fazit === -1 ? children.length : fazit;
  const next = [...children.slice(0, at), ...d.blocks, ...children.slice(at)];
  const sources = new Set<any>(((sw.sources as any[]) ?? []).map((s) => (typeof s === "object" ? s.id : s)));
  for (const n of d.sources) sources.add(srcIds.get(n));
  await payload.update({
    collection: "software",
    id: sw.id,
    data: { review: { root: { ...review.root, children: next } } as never, sources: [...sources] as never },
  });
  console.log("review deepened:", slug, `(+${d.blocks.length} blocks)`);
}

// Short trial facts confirmed during research (shown in the profile header).
const sev = await first("software", { slug: { equals: "sevdesk" } });
if (sev && sev.trial !== "14 Tage kostenlos") await payload.update({ collection: "software", id: sev.id, data: { trial: "14 Tage kostenlos" } });
process.exit(0);
