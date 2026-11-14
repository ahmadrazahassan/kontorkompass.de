import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <div className="container-page py-24 lg:py-32">
      <div className="max-w-xl">
        <LogoMark size={56} />
        <p className="t-eyebrow mt-8">Fehler 404</p>
        <h1 className="t-h1 mt-3">Seite nicht gefunden</h1>
        <p className="t-lead mt-5">Diese Seite gibt es nicht (mehr). Vielleicht hilft Ihnen die Suche oder einer unserer Ratgeber weiter.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/" variant="primary" arrow>
            Zur Startseite
          </Button>
          <Button href="/suche" variant="outline">
            Suche öffnen
          </Button>
        </div>
        <p className="mt-10 text-[15px] text-ink-700">
          Beliebt: <Link href="/ratgeber/e-rechnung-2027-pflicht-unternehmen">E-Rechnung ab 2027</Link>
        </p>
      </div>
    </div>
  );
}
