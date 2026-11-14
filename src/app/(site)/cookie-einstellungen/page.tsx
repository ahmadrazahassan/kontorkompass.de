import type { Metadata } from "next";
import { TextPage } from "@/components/content/PageShell";

export const metadata: Metadata = { title: "Cookie-Einstellungen", alternates: { canonical: "/cookie-einstellungen" } };

export default function Page() {
  return (
    <TextPage title="Cookie-Einstellungen" crumbs={[{ label: "Cookie-Einstellungen" }]}>
      <p>Diese Website setzt derzeit keine Cookies und keine Dienste ein, die eine Einwilligung erfordern. Schriftarten werden lokal geladen.</p>
      <p>
        Sobald wir Dienste einsetzen, für die eine Einwilligung nötig ist (zum Beispiel Einbettungen von Drittanbietern), erscheint hier eine Auswahl, in der „Alle ablehnen“ so
        leicht zu wählen ist wie „Alle akzeptieren“.
      </p>
    </TextPage>
  );
}
