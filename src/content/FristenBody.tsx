import Link from "next/link";
import { Cite } from "@/components/content/Blocks";
import { TIMELINE } from "@/content/data";

export function FristenBody() {
  return (
    <>
      <h2 id="uebersicht">Die Fristen im Überblick</h2>
      <p>
        Die E-Rechnung wird in drei Schritten eingeführt: erst der Empfang, dann die Ausstellung für umsatzstarke Unternehmen, schließlich für alle. <Cite n={[1, 2]} />
      </p>
      <ol className="steps">
        {TIMELINE.map((t) => (
          <li key={t.when}>
            <div>
              <strong>{t.when}:</strong> {t.what}. <span className="text-ink-500">Für: {t.who}.</span>
            </div>
          </li>
        ))}
      </ol>
      <p>
        Welche Rechnungen von der Pflicht ausgenommen sind und wie Sie die Umstellung angehen, erklärt unser Ratgeber{" "}
        <Link href="/ratgeber/e-rechnung-2027-pflicht-unternehmen">E-Rechnung ab 2027</Link>.
      </p>
    </>
  );
}
