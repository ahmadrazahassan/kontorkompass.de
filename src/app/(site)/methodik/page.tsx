import type { Metadata } from "next";
import Link from "next/link";
import { TextPage } from "@/components/content/PageShell";

export const metadata: Metadata = { title: "Methodik", description: "So recherchieren, prüfen und aktualisieren wir unsere Inhalte.", alternates: { canonical: "/methodik" } };

export default function Page() {
  return (
    <TextPage title="Methodik" lead="So recherchieren, prüfen und aktualisieren wir unsere Inhalte." crumbs={[{ label: "Methodik" }]}>
      <h2>Quellen</h2>
      <p>
        Wir beginnen bei Primärquellen: Gesetzestexte, Behörden, Industrie- und Handelskammern, anerkannte Studien sowie die Preis-, Funktions- und Sicherheitsseiten der
        Anbieter. Jede Quelle, die wir nennen, haben wir geöffnet und gelesen. Wir nennen sie am Ende jedes Beitrags mit Herausgeber, Titel und Link.
      </p>
      <h2>Zahlen und Preise</h2>
      <ul>
        <li>Jede Zahl und jeder Preis trägt eine nummerierte Quelle.</li>
        <li>Preise nennen wir in Euro und kennzeichnen, ob sie netto oder brutto sind, welcher Abrechnungszeitraum gilt und welche Aktionen laufen.</li>
        <li>Wir erfinden nichts. Was wir nicht belegen können, lassen wir weg oder kennzeichnen es als „nicht öffentlich angegeben“.</li>
      </ul>
      <h2>Aktualisierung</h2>
      <p>
        Preise prüfen wir mindestens vierteljährlich. Bei jeder Preistabelle nennen wir den Monat der letzten Prüfung. Rechtsthemen aktualisieren wir, sobald sich Gesetze
        oder Verwaltungsanweisungen ändern.
      </p>
      <h2>Auswahl von Software</h2>
      <p>
        Für alle Anbieter gelten dieselben Kriterien. Anbieter mit Partnerprogramm werden nicht bevorzugt. Übersichten sortieren wir nach dem Kriterienwert (siehe unten). Im
        Software-Finder und im Vergleich ergibt sich die Reihenfolge aus Ihren Angaben und den veröffentlichten Preisen; die Gewichtung nennen wir jeweils direkt beim Ergebnis.
      </p>
      <h2>So entstehen unsere Software-Profile</h2>
      <p>
        Jedes Software-Profil beruht auf den öffentlich zugänglichen Angaben des Anbieters: Produkt-, Preis- und Hilfeseiten. Wir nennen nur Funktionen und Preise, die wir dort
        belegen können, und kennzeichnen Angaben des Anbieters mit „laut Anbieter“.
      </p>
      <h3>Kostenanalyse</h3>
      <p>
        Diagramme und Kostentabellen berechnen wir ausschließlich aus veröffentlichten Preisbestandteilen: Grundpreis, enthaltene Nutzende oder Beschäftigte, Aufpreise je
        weiterer Person, Mindestbeträge, Preise bei Jahreszahlung und laufende Aktionen. Zusatzmodule, Einrichtung und Beratung sind nicht enthalten. Brutto-Werte rechnen wir
        mit 19 % Umsatzsteuer.
      </p>
      <h3>Prüfkriterien</h3>
      <p>Wir prüfen jede Software anhand derselben zehn Kriterien:</p>
      <ul>
        <li>Preise öffentlich einsehbar</li>
        <li>Kostenlose Testphase</li>
        <li>Kurze Vertragslaufzeit (monatlich kündbar)</li>
        <li>E-Rechnung (XRechnung / ZUGFeRD)</li>
        <li>Export oder Schnittstelle für das Steuerbüro (DATEV)</li>
        <li>Datenstandort öffentlich angegeben</li>
        <li>Auftragsverarbeitungsvertrag auf der Produktseite erwähnt</li>
        <li>Lohnabrechnung enthalten oder zubuchbar</li>
        <li>Mobile Nutzung (App) laut Anbieter</li>
        <li>Programmierschnittstelle (API) laut Anbieter</li>
      </ul>
      <p>
        Jedes Kriterium ist erfüllt, teilweise erfüllt, nicht enthalten, nicht öffentlich angegeben oder für das Produkt nicht relevant. Erfüllt zählt einen Punkt, teilweise einen
        halben. Nicht relevante Kriterien zählen nicht mit. Der Wert von 0 bis 100 zeigt den Anteil der Punkte an allen relevanten Kriterien. Er misst, wie viele dieser
        Anforderungen sich öffentlich belegen lassen, und ist keine Gesamtbewertung der Software.
      </p>
      <h2>Rechts- und Steuerthemen</h2>
      <p>Unsere Beiträge ersetzen keine Rechts- oder Steuerberatung.</p>
      <h2>Korrekturen</h2>
      <p>
        Haben Sie einen Fehler gefunden? Schreiben Sie uns über die Seite <Link href="/kontakt">Kontakt</Link>. Wir prüfen jeden Hinweis und korrigieren belegte Fehler umgehend.
      </p>
    </TextPage>
  );
}
