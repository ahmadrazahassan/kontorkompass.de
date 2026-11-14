import { Callout, Cite, EditorNote, PriceBars } from "@/components/content/Blocks";
import { AffiliateCtaBox } from "@/components/content/RichBody";
import { TIMELINE } from "@/content/data";

export function ERechnungBody() {
  return (
    <>
      <h2 id="was-sich-aendert">Was sich zum 1. Januar 2027 ändert</h2>
      <p>
        Mit dem Wachstumschancengesetz hat der Gesetzgeber die elektronische Rechnung für Umsätze zwischen inländischen Unternehmen schrittweise verpflichtend gemacht.
        <Cite n={[1]} /> Die erste Stufe betrifft seit 2025 alle Betriebe: Sie müssen eingehende E-Rechnungen annehmen können. Beim Ausstellen gab es dagegen
        Übergangsfristen. In den Jahren 2025 und 2026 durften Unternehmen weiterhin Papierrechnungen verschicken und, mit Zustimmung des Empfängers, auch andere
        elektronische Formate wie PDF. <Cite n={[1]} />
      </p>
      <p>
        Diese Übergangszeit endet für einen Teil der Unternehmen am 31. Dezember 2026. Ab dem 1. Januar 2027 müssen Betriebe, deren Gesamtumsatz im Vorjahr über
        800.000 € lag, ihre inländischen B2B-Rechnungen als E-Rechnung ausstellen. <Cite n={[1]} />
      </p>

      <h2 id="betroffen">Ist mein Unternehmen betroffen?</h2>
      <p>Entscheidend sind drei Fragen:</p>
      <ol>
        <li>
          <strong>Handelt es sich um einen inländischen B2B-Umsatz?</strong> Die Pflicht betrifft Leistungen zwischen Unternehmen, die in Deutschland ansässig sind.
          Dazu zählen Sitz, Geschäftsleitung, Wohnsitz oder eine umsatzsteuerlich relevante Betriebsstätte in Deutschland, die an der Leistung beteiligt ist. Rechnungen
          an Privatpersonen (B2C) sind nicht erfasst. <Cite n={[1]} />
        </li>
        <li>
          <strong>Wie hoch war Ihr Gesamtumsatz 2026?</strong> Maßgeblich ist der umsatzsteuerliche Gesamtumsatz im Vorjahr, für 2027 also im Jahr 2026. <Cite n={[1]} />{" "}
          Liegt er über 800.000 €, gilt die Ausstellungspflicht ab dem 1. Januar 2027.
        </li>
        <li>
          <strong>Greift eine Ausnahme?</strong> Siehe Abschnitt „Ausnahmen“.
        </li>
      </ol>
      <Callout kind="tip" title="Praxisbeispiel">
        <p>
          Ein Elektrobetrieb mit 14 Beschäftigten hat 2026 rund 1,1 Mio. € Gesamtumsatz und stellt fast nur Rechnungen an gewerbliche Kunden. Er muss ab dem 1. Januar
          2027 E-Rechnungen ausstellen. Eine Werbeagentur mit 450.000 € Umsatz darf 2027 noch sonstige Rechnungen nutzen. Für sie gilt die Pflicht ab 2028.
        </p>
        <p className="text-[14px]">Beispiele zur Veranschaulichung, keine realen Unternehmen.</p>
      </Callout>

      <h2 id="zeitplan">Der Zeitplan im Überblick</h2>
      <div className="table-wrap not-prose">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Zeitpunkt</th>
              <th scope="col">Was gilt</th>
              <th scope="col">Für wen</th>
            </tr>
          </thead>
          <tbody>
            {TIMELINE.map((r) => (
              <tr key={r.when}>
                <th scope="row" className="!bg-transparent !normal-case !tracking-normal !text-[15px] text-ink-950" style={{ fontFamily: "var(--font-sans)", fontWeight: 600 }}>
                  {r.when}
                </th>
                <td>{r.what}</td>
                <td>{r.who}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="t-eyebrow !normal-case !tracking-normal">
        Quellen: <Cite n={[1, 2]} /> Darstellung vereinfacht. Prüfen Sie Sonderfälle mit Ihrer Steuerberatung.
      </p>

      <h2 id="was-zaehlt">Was als E-Rechnung zählt – und was nicht</h2>
      <p>
        Eine E-Rechnung ist eine Rechnung in einem <strong>strukturierten elektronischen Format</strong>, das ausgestellt, übermittelt und empfangen wird und eine
        elektronische Verarbeitung ermöglicht. Sie muss der europäischen Norm <strong>EN 16931</strong> entsprechen (§ 14 Abs. 1 UStG). <Cite n={[1]} /> Alternativ können
        Aussteller und Empfänger ein anderes Format vereinbaren, wenn sich daraus die nach der EU-Richtlinie 2014/55/EU erforderlichen Daten extrahieren lassen.
      </p>
      <p>In der Praxis sind zwei Formate verbreitet:</p>
      <ul>
        <li>
          <strong>XRechnung:</strong> ein reines XML-Format. Für Menschen ist es erst mit einer Anzeige-Software lesbar.
        </li>
        <li>
          <strong>ZUGFeRD:</strong> ein hybrides Format aus PDF und eingebetteter XML-Datei. Nach dem BMF-Schreiben vom 15. Oktober 2024 ist ZUGFeRD ab Version 2.0.1
          zulässig. <Cite n={[1]} />
        </li>
      </ul>
      <Callout kind="warn" title="Achtung">
        <p>
          Eine PDF-Rechnung per E-Mail ist <strong>keine</strong> E-Rechnung. Sie gilt als „sonstige Rechnung“ und ist nur mit Zustimmung des Empfängers zulässig,
          solange die Übergangsregeln gelten. Auch nicht jedes ZUGFeRD-Profil erfüllt die Norm. Lassen Sie sich vom Softwareanbieter bestätigen, dass die erzeugten
          Rechnungen EN 16931 entsprechen.
        </p>
      </Callout>
      <p>
        Wie die E-Rechnung übermittelt wird, schreibt das Gesetz nicht vor. Möglich sind etwa der Versand per E-Mail, eine Schnittstelle oder der Download über ein
        Portal. Das vereinbaren die Beteiligten. <Cite n={[1]} />
      </p>

      <h3 id="bmf-2025">Was das zweite BMF-Schreiben vom 15. Oktober 2025 klarstellt</h3>
      <p>
        Am 15. Oktober 2025 hat das Bundesfinanzministerium ein zweites Schreiben zur E-Rechnung veröffentlicht. Seine Grundsätze gelten grundsätzlich für Umsätze, die nach
        dem 31. Dezember 2024 ausgeführt werden. <Cite n={[46]} /> Für die Praxis sind vor allem diese Punkte wichtig:
      </p>
      <ul>
        <li>
          <strong>Formatfehler:</strong> Entspricht eine Rechnung nicht dem vorgeschriebenen Format nach EN 16931, ist sie keine E-Rechnung, sondern eine sonstige
          Rechnung. Der Empfänger muss dann eine korrekte E-Rechnung anfordern. <Cite n={[47]} />
        </li>
        <li>
          <strong>Inhaltsfehler:</strong> Fehler wie ein falscher Steuersatz erfordern eine berichtigte E-Rechnung. <Cite n={[47]} />
        </li>
        <li>
          <strong>Validierung:</strong> Das BMF empfiehlt, eingehende E-Rechnungen zu validieren; Prüfprotokolle können als Nachweis dienen. <Cite n={[47]} /> Eine
          negative technische Validierung schließt den Vorsteuerabzug aber nicht automatisch aus. Lehnen Sie E-Rechnungen deshalb nicht allein wegen technischer
          Fehlermeldungen ab. <Cite n={[46]} />
        </li>
      </ul>

      <h2 id="ausnahmen">Ausnahmen</h2>
      <p>
        Keine E-Rechnung ist erforderlich bei: <Cite n={[1, 2]} />
      </p>
      <ul>
        <li>
          <strong>Kleinbetragsrechnungen</strong> bis 250 € (brutto, § 33 UStDV)
        </li>
        <li>
          <strong>Fahrausweisen</strong>, die als Rechnung gelten (§ 34 UStDV)
        </li>
        <li>
          Leistungen von <strong>Kleinunternehmern</strong> (§ 34a UStDV). Sie müssen E-Rechnungen aber empfangen können.
        </li>
        <li>bestimmten <strong>steuerfreien Umsätzen</strong> nach § 4 Nr. 8 bis 29 UStG</li>
        <li>
          Umsätzen an <strong>Privatpersonen</strong> (B2C)
        </li>
      </ul>
      <p>In diesen Fällen dürfen Sie weiterhin andere Rechnungsformen verwenden.</p>

      <h2 id="empfang">Empfang: Was seit 2025 gilt</h2>
      <p>
        Für den Empfang gibt es keine Übergangsfrist. Als Übergangsmaßnahme reicht aber zunächst ein E-Mail-Postfach. <Cite n={[1]} /> Wichtig ist, dass Sie die
        Rechnung auch verarbeiten können. Eine XRechnung ist als XML-Datei ohne passende Software kaum lesbar. Prüfen Sie deshalb, ob Ihre Buchhaltungssoftware
        E-Rechnungen einlesen und anzeigen kann. Alternativ nutzen Sie einen Viewer.
      </p>
      <Callout kind="tip" title="Praxistipp">
        <p>
          Richten Sie eine zentrale Adresse wie <code>rechnungseingang@ihre-firma.de</code> ein und teilen Sie sie Ihren Lieferanten mit. So landen E-Rechnungen nicht in
          persönlichen Postfächern.
        </p>
      </Callout>

      <h2 id="archivierung">Archivierung: acht Jahre, im Originalformat</h2>
      <p>
        Rechnungen und Buchungsbelege sind in Deutschland <strong>acht Jahre</strong> aufzubewahren. <Cite n={[3]} /> Bei E-Rechnungen ist der strukturierte Datensatz
        entscheidend. Bewahren Sie die Datei in ihrer ursprünglichen Form unveränderbar und GoBD-konform auf. Ein Ausdruck ersetzt sie nicht. Bei ZUGFeRD-Rechnungen ginge
        beim Ausdrucken die eingebettete XML-Datei verloren.
      </p>
      <p>
        Das BMF-Schreiben vom Oktober 2025 bestätigt das: Der strukturierte Datensatz ist unverändert aufzubewahren, und seine Lesbarkeit und Nachvollziehbarkeit müssen
        für die gesamte Aufbewahrungsfrist erhalten bleiben. <Cite n={[47]} />
      </p>
      <EditorNote>
        <p>
          Die genaue Übergangsregel für Altbelege und der Fristbeginn sind vor Veröffentlichung am Gesetzestext (§ 147 AO, § 14b UStG) zu bestätigen. Die Haufe-Quelle nennt
          weder Stichtag noch Übergang.
        </p>
      </EditorNote>

      <h2 id="sieben-schritte">In 7 Schritten startklar für 2027</h2>
      <ol className="steps">
        <li>
          <div>
            <strong>Betroffenheit klären:</strong> Gesamtumsatz 2026 ermitteln oder mit dem Steuerbüro abschätzen. Anteil der inländischen B2B-Rechnungen bestimmen.
          </div>
        </li>
        <li>
          <div>
            <strong>Rechnungsprozesse erfassen:</strong> Wo entstehen Rechnungen (Buchhaltung, Warenwirtschaft, Branchensoftware, Word-Vorlagen)? Jede Quelle muss künftig
            E-Rechnungen erzeugen können.
          </div>
        </li>
        <li>
          <div>
            <strong>Software prüfen:</strong> Kann Ihre Lösung EN-16931-konforme XRechnung oder ZUGFeRD <em>erstellen</em>, <em>empfangen</em> und <em>archivieren</em>?
            Fragen Sie beim Anbieter schriftlich nach.
          </div>
        </li>
        <li>
          <div>
            <strong>Stammdaten bereinigen:</strong> Vollständige Kundendaten, Leitweg-IDs für öffentliche Auftraggeber, korrekte Umsatzsteuer-IDs und Bestellnummern, falls
            Kunden diese verlangen.
          </div>
        </li>
        <li>
          <div>
            <strong>Übermittlungswege vereinbaren:</strong> Mit Ihren größten Kunden abstimmen, ob E-Mail, Portal oder Schnittstelle genutzt wird.
          </div>
        </li>
        <li>
          <div>
            <strong>Testlauf:</strong> Vor dem Stichtag Test-Rechnungen an zwei, drei Kunden senden und die Validierung prüfen.
          </div>
        </li>
        <li>
          <div>
            <strong>Archiv und Verfahrensdokumentation:</strong> Ablage der Originaldateien festlegen und den Prozess dokumentieren (GoBD).
          </div>
        </li>
      </ol>

      <h2 id="software">Was Ihre Software können muss</h2>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Anforderung</th>
              <th scope="col">Warum</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["E-Rechnungen erstellen (XRechnung und/oder ZUGFeRD, EN 16931)", "Ausstellungspflicht ab 2027/2028"],
              ["E-Rechnungen empfangen, anzeigen, einlesen", "Empfangspflicht seit 2025"],
              ["Validierung vor dem Versand", "vermeidet Rückläufer"],
              ["GoBD-konforme Archivierung der Originaldatei", "Aufbewahrungspflicht"],
              ["DATEV-Export oder Schnittstelle zum Steuerbüro", "reibungslose Zusammenarbeit"],
              ["Mengengerüst passt (Rechnungen/Monat, Nutzende)", "Kosten im Griff behalten"],
            ].map(([a, b]) => (
              <tr key={a}>
                <td>{a}</td>
                <td>{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="kosten">Was E-Rechnungs-fähige Software kostet</h2>
      <p>
        Viele Cloud-Lösungen für kleine Unternehmen decken E-Rechnungen ab. Die folgende Übersicht nennt reguläre Monatspreise bei monatlicher Abrechnung, ohne
        Aktionsrabatte. Prüfen Sie den genauen Funktionsumfang je Tarif beim Anbieter.
      </p>
      <p className="t-eyebrow !normal-case !tracking-normal">Preise geprüft: November 2026</p>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Software (Tarif)</th>
              <th scope="col">Preis/Monat zzgl. MwSt.</th>
              <th scope="col">Laut Anbieter enthalten (Auszug)</th>
              <th scope="col">Testphase</th>
              <th scope="col">Quelle</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Sage Active Starter", "25,00 €", "Angebote & Rechnungen, 5 Nutzende, 300 Rechnungen/Monat, Einlesen von XRechnung/ZUGFeRD", "14 Tage, ohne Kreditkarte", [4]],
              ["Sage Active Essentials", "49,00 €", "zusätzlich Buchhaltung & Lohn, 10 Nutzende, 2 Beschäftigte, 500 Rechnungen/Monat, DATEV-Export, USt-VA per ELSTER", "30 Tage (mit Zahlungsdaten)", [4]],
              ["Lexware Office M", "12,90 €", "Angebote, Rechnungen, Mahnungen; E-Rechnungen erstellen und übermitteln (ZUGFeRD, XRechnung) ab dieser Version", "30 Tage", [5, 48]],
              ["Lexware Office L", "21,90 €", "zusätzlich Buchhaltung, EÜR, Umsatzsteuer", "30 Tage", [5, 48]],
              ["sevdesk Rechnung", "11,90 €", "unbegrenzte (E-)Rechnungen, DATEV-Schnittstelle", "laut Anbieter, Dauer nicht angegeben", [6]],
              ["sevdesk Buchhaltung", "25,90 €", "zusätzlich Buchhaltung, UStVA per ELSTER, EÜR", "laut Anbieter, Dauer nicht angegeben", [6]],
            ].map(([n, p, i, t, s]) => (
              <tr key={n as string}>
                <th scope="row" className="!bg-transparent !normal-case !tracking-normal !text-[15px] text-ink-950" style={{ fontFamily: "var(--font-sans)", fontWeight: 600 }}>
                  {n as string}
                </th>
                <td className="whitespace-nowrap">{p as string}</td>
                <td>{i as string}</td>
                <td>{t as string}</td>
                <td>
                  <Cite n={s as number[]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="t-eyebrow !normal-case !tracking-normal">
        Bei längerer Vertragslaufzeit oder in Aktionen sind die Preise teils deutlich niedriger. Bei unserer Preisprüfung im November 2026 gewährten Sage Active und
        Lexware Office 50 % Rabatt für drei Monate, sevdesk bot Rabatte bei 12- und 24-monatiger Laufzeit. In der kleinsten Version S kann Lexware Office E-Rechnungen
        empfangen, aber nicht erstellen. <Cite n={[48]} />
      </p>
      <PriceBars
        title="Regulärer Einstiegspreis pro Monat (netto)"
        takeaway="Die Einstiegstarife liegen zwischen rund 12 € und 25 €. Funktionsumfang und Rechnungsmengen unterscheiden sich deutlich."
        source="Anbieterangaben (Sage, Lexware, sevdesk)"
        items={[
          { label: "Sage Active Starter", value: 25 },
          { label: "sevdesk Rechnung", value: 11.9 },
          { label: "Lexware Office M", value: 12.9 },
          { label: "Lexware Office L", value: 21.9 },
        ]}
      />
      <EditorNote>
        <p>
          (1) Ob Sage Active E-Rechnungen auch <em>erstellt</em> (nicht nur einliest), war auf der Produktseite nicht eindeutig (sage.com blockte am 14.11.2026 den
          automatischen Abruf). (2) Erledigt am 14.11.2026: Lexware Office erstellt E-Rechnungen ab Version M, empfängt in allen Versionen [48]. (3) Die
          sevdesk-Preisseite zeigte widersprüchliche Aktionspreise. (4) Zweites BMF-Schreiben vom 15.10.2025 über IHK-Zusammenfassungen ergänzt [46, 47]; den
          Originaltext des BMF (bundesfinanzministerium.de war nicht erreichbar) und die BMF-FAQ als Primärquelle nachtragen.
        </p>
      </EditorNote>

      {/* Labels ("Anzeige", *) follow the real programme status of the linked software in the CMS. */}
      <AffiliateCtaBox slug="sage-active" text="bündelt Rechnungen, Buchhaltung und Lohn für kleine Unternehmen mit 1 bis 50 Beschäftigten." />
    </>
  );
}
