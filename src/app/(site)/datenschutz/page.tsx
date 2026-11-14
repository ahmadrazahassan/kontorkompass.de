import type { Metadata } from "next";
import { TextPage } from "@/components/content/PageShell";
import { OPERATOR, SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Datenschutzerklärung", alternates: { canonical: "/datenschutz" } };

export default function Page() {
  return (
    <TextPage title="Datenschutzerklärung" crumbs={[{ label: "Datenschutz" }]}>
      <p>
        Mit dieser Datenschutzerklärung informieren wir Sie darüber, welche personenbezogenen Daten beim Besuch von {SITE.domain} verarbeitet werden, zu welchem
        Zweck, auf welcher Rechtsgrundlage und welche Rechte Sie haben. Wir verarbeiten so wenige Daten wie möglich: Diese Website setzt keine Cookies zu Analyse- oder
        Werbezwecken, bindet keine Inhalte von Drittanbietern ein und verwendet kein Tracking.
      </p>

      <h2>1. Verantwortliche Stelle</h2>
      <p>Verantwortlich für die Datenverarbeitung auf dieser Website im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:</p>
      <p>
        {OPERATOR.company}
        <br />
        {OPERATOR.street}
        <br />
        {OPERATOR.city}
        <br />
        {OPERATOR.country}
        <br />
        Vertreten durch: {OPERATOR.representative}
        <br />
        E-Mail: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
      </p>
      <p>
        Wir sind nicht gesetzlich verpflichtet, einen Datenschutzbeauftragten zu benennen. Für alle Fragen zum Datenschutz erreichen Sie uns unter der oben genannten
        E-Mail-Adresse.
      </p>

      <h2>2. Hosting und Server-Logdaten</h2>
      <p>
        Diese Website wird bei der Vercel Inc. (USA) gehostet. Bei jedem Aufruf einer Seite verarbeitet der Anbieter technisch notwendige Daten, die Ihr Browser
        automatisch übermittelt (Server-Logdaten):
      </p>
      <ul>
        <li>IP-Adresse des zugreifenden Geräts</li>
        <li>Datum und Uhrzeit des Zugriffs</li>
        <li>aufgerufene Seite und übertragene Datenmenge</li>
        <li>Referrer-URL (die zuvor besuchte Seite), sofern übermittelt</li>
        <li>Browsertyp, Betriebssystem und Statuscode der Anfrage</li>
      </ul>
      <p>
        Die Verarbeitung ist erforderlich, um die Website auszuliefern, ihre Stabilität und Sicherheit zu gewährleisten und Angriffe abzuwehren. Rechtsgrundlage ist unser
        berechtigtes Interesse an einem sicheren und zuverlässigen Betrieb der Website (Art. 6 Abs. 1 lit. f DSGVO). Eine Zusammenführung dieser Daten mit anderen
        Datenquellen findet nicht statt.
      </p>
      <p>
        Mit Vercel besteht ein Vertrag über die Auftragsverarbeitung nach Art. 28 DSGVO. Da Vercel ein Unternehmen mit Sitz in den USA ist, kann eine Übermittlung
        personenbezogener Daten in die USA nicht ausgeschlossen werden. Vercel ist nach dem EU-US Data Privacy Framework zertifiziert; die Übermittlung stützt sich
        damit auf den Angemessenheitsbeschluss der EU-Kommission (Art. 45 DSGVO). Ergänzend sind im Auftragsverarbeitungsvertrag EU-Standardvertragsklauseln
        vereinbart (Art. 46 Abs. 2 lit. c DSGVO).
      </p>

      <h2>3. Datenbank und Redaktionssystem</h2>
      <p>
        Die Inhalte dieser Website (Ratgeber, Artikel, Software-Profile) werden in einer Datenbank gespeichert, die über unser Redaktionssystem gepflegt wird. Personenbezogene
        Daten speichern wir dort nur in zwei Fällen: für die Konten unserer Redaktion (Name, E-Mail-Adresse, Passwort als Hashwert) und als Nachweis Ihrer
        Newsletter-Einwilligung (siehe Abschnitt 7). Daten, die Ihr Browser beim normalen Besuch übermittelt, speichern wir dort nicht. Für angemeldete
        Redaktionsmitglieder setzt das Redaktionssystem ein technisch notwendiges Sitzungs-Cookie; Rechtsgrundlage ist § 25 Abs. 2 Nr. 2 TDDDG in Verbindung mit
        Art. 6 Abs. 1 lit. f DSGVO.
      </p>
      <p>
        Die Datenbank betreibt für uns die Supabase Pte. Ltd. (Singapur) in einem Rechenzentrum in Frankfurt am Main. Mit Supabase besteht ein Vertrag über die
        Auftragsverarbeitung nach Art. 28 DSGVO. Die Datenbank und ihre Sicherungen liegen in der EU. Für Support und Betrieb kann Supabase Daten an verbundene
        Unternehmen und Dienstleister in Singapur und in den USA übermitteln. Grundlage dafür sind EU-Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO).
      </p>

      <h2>4. Cookies und lokale Speicherung</h2>
      <p>
        Beim normalen Besuch dieser Website setzen wir keine Cookies und lesen keine Informationen aus Ihrem Endgerät aus, die nicht für die Bereitstellung der Website
        unbedingt erforderlich sind. Eine Einwilligung ist deshalb nicht erforderlich. Einzelheiten finden Sie in den <a href="/cookie-einstellungen">Cookie-Einstellungen</a>.
      </p>

      <h2>5. Schriftarten</h2>
      <p>Wir binden alle Schriftarten lokal von unserem eigenen Server ein. Beim Besuch dieser Website werden dafür keine Daten an Google oder andere Anbieter übertragen.</p>

      <h2>6. Kontakt per E-Mail</h2>
      <p>
        Wenn Sie uns per E-Mail schreiben, verarbeiten wir Ihre E-Mail-Adresse, Ihren Namen (falls angegeben) und den Inhalt Ihrer Nachricht, um Ihre Anfrage zu
        beantworten. Rechtsgrundlage ist unser berechtigtes Interesse an der Beantwortung von Anfragen (Art. 6 Abs. 1 lit. f DSGVO) beziehungsweise, wenn Ihre Anfrage
        auf einen Vertrag zielt, Art. 6 Abs. 1 lit. b DSGVO. Wir löschen die Daten, sobald die Anfrage abschließend bearbeitet ist und keine gesetzlichen
        Aufbewahrungspflichten entgegenstehen. Ein Kontaktformular setzen wir nicht ein.
      </p>

      <h2>7. Newsletter</h2>
      <p>
        Wenn Sie unseren Newsletter abonnieren, verarbeiten wir Ihre E-Mail-Adresse, um Ihnen den Newsletter zuzusenden. Die Anmeldung erfolgt im
        Double-Opt-in-Verfahren: Nach der Eintragung erhalten Sie eine E-Mail mit der Bitte, die Anmeldung über einen Link zu bestätigen. Erst danach nehmen wir Sie in
        den Verteiler auf. Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Die Bestätigung erfolgt mit einem Klick auf „Anmeldung bestätigen“ auf
        unserer Website, damit automatische Link-Prüfungen von E-Mail-Programmen keine Anmeldung auslösen.
      </p>
      <p>
        Um die Anmeldung nachweisen zu können, speichern wir Ihre E-Mail-Adresse zusammen mit dem Zeitpunkt der Anmeldung und dem Zeitpunkt der Bestätigung in unserer
        Datenbank (Abschnitt 3). Rechtsgrundlage ist unser berechtigtes Interesse am Nachweis Ihrer Einwilligung (Art. 6 Abs. 1 lit. f DSGVO in Verbindung mit
        Art. 7 Abs. 1 DSGVO). Diesen Nachweis bewahren wir nach einer Abmeldung bis zu drei Jahre auf, um die frühere Einwilligung belegen zu können. Damit das
        Anmeldeformular nicht missbraucht wird, begrenzen wir die Zahl der Anmeldungen je IP-Adresse; dafür wird die IP-Adresse kurzzeitig im Arbeitsspeicher
        des Servers gehalten und nicht dauerhaft gespeichert.
      </p>
      <p>
        Sie können den Newsletter jederzeit abbestellen und damit Ihre Einwilligung mit Wirkung für die Zukunft widerrufen, etwa über den Abmeldelink in jeder
        Newsletter-E-Mail oder per E-Mail an <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. Nach der Abmeldung löschen wir Ihre E-Mail-Adresse aus dem Verteiler.
      </p>
      <p>
        Für den Versand der Bestätigungsmail und des Newsletters setzen wir den Dienst Resend der Plus Five Five, Inc. (USA) ein. An Resend übermitteln wir Ihre
        E-Mail-Adresse; dort wird sie gespeichert, bis Sie den Newsletter abbestellen. Mit Resend besteht ein Vertrag über die Auftragsverarbeitung nach Art. 28 DSGVO.
        Resend ist nach dem EU-US Data Privacy Framework zertifiziert (Art. 45 DSGVO); zusätzlich sind EU-Standardvertragsklauseln vereinbart (Art. 46 Abs. 2 lit. c
        DSGVO).
      </p>

      <h2>8. Reichweitenmessung</h2>
      <p>
        Wir setzen keine Werkzeuge zur Reichweitenmessung oder Webanalyse ein (zum Beispiel Google Analytics) und erstellen keine Nutzungsprofile. Sollte sich das
        ändern, passen wir diese Datenschutzerklärung vorher an und holen, soweit erforderlich, Ihre Einwilligung ein.
      </p>

      <h2>9. Links zu Anbietern und Werbelinks</h2>
      <p>
        Links mit * sind Werbelinks. Sie führen über eine interne Weiterleitung (/go/…) zur Website des jeweiligen Anbieters. Bei dieser Weiterleitung setzen wir keine
        Cookies und speichern keine personenbezogenen Daten. Sobald Sie die Seite des Anbieters oder eines Partnernetzwerks erreichen, verarbeiten diese Daten in eigener
        Verantwortung; es gelten deren Datenschutzhinweise. Ob dort Cookies gesetzt werden, entscheiden Sie über die Einstellungen auf der Partnerseite.
      </p>

      <h2>10. Speicherdauer</h2>
      <p>
        Wir speichern personenbezogene Daten nur so lange, wie es für den jeweiligen Zweck erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen. Server-Logdaten
        werden vom Hosting-Anbieter nach kurzer Zeit automatisch gelöscht. Newsletter-Daten speichern wir bis zu Ihrer Abmeldung; den Nachweis Ihrer Einwilligung
        bis zu drei Jahre danach (Abschnitt 7).
      </p>

      <h2>11. Ihre Rechte</h2>
      <p>Sie haben gegenüber uns folgende Rechte hinsichtlich der Sie betreffenden personenbezogenen Daten:</p>
      <ul>
        <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
        <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
        <li>Recht auf Löschung (Art. 17 DSGVO)</li>
        <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
        <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
        <li>Recht auf Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)</li>
      </ul>
      <p>
        <strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Soweit wir Daten auf Grundlage unseres berechtigten Interesses verarbeiten (Art. 6 Abs. 1 lit. f DSGVO),
        können Sie jederzeit aus Gründen, die sich aus Ihrer besonderen Situation ergeben, Widerspruch gegen diese Verarbeitung einlegen.
      </p>
      <p>
        Um Ihre Rechte auszuüben, genügt eine E-Mail an <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. Außerdem haben Sie das Recht, sich bei einer
        Datenschutz-Aufsichtsbehörde zu beschweren (Art. 77 DSGVO), insbesondere in dem Mitgliedstaat Ihres Aufenthaltsorts, Ihres Arbeitsplatzes oder des Orts des
        mutmaßlichen Verstoßes.
      </p>

      <h2>12. Pflicht zur Bereitstellung und automatisierte Entscheidungen</h2>
      <p>
        Sie sind weder gesetzlich noch vertraglich verpflichtet, uns personenbezogene Daten bereitzustellen. Ohne die technisch übermittelten Server-Logdaten kann die
        Website jedoch nicht angezeigt werden, ohne E-Mail-Adresse können wir Ihnen keinen Newsletter senden. Eine automatisierte Entscheidungsfindung einschließlich
        Profiling (Art. 22 DSGVO) findet nicht statt.
      </p>

      <h2>13. Sicherheit</h2>
      <p>Diese Website nutzt aus Sicherheitsgründen eine TLS-Verschlüsselung. Sie erkennen eine verschlüsselte Verbindung an „https://“ in der Adresszeile Ihres Browsers.</p>

      <h2>14. Änderungen</h2>
      <p>
        Wir passen diese Datenschutzerklärung an, wenn sich die eingesetzten Dienste oder die Rechtslage ändern. Es gilt die jeweils auf dieser Seite veröffentlichte
        Fassung.
      </p>
    </TextPage>
  );
}
