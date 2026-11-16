/**
 * Labels for software whose /go link is an active Werbelink (isAffiliate in the CMS).
 * Render them only behind `s.isAffiliate`: a non-partner must never carry them.
 * All visible text is German (user decision 16.11.2026: "Werbepartner", "Werbelink", no English "Affiliate").
 * No hooks and no server imports, so client components (Finder, CompareBuilder) can use them too.
 */

const TIP = "Wir erhalten gegebenenfalls eine Provision, wenn Sie über unseren Link einen Vertrag abschließen. Für Sie entstehen keine Mehrkosten.";

/** Small squared tag "Werbepartner". `tab` sits on the top border of a card without moving its content. */
export function AffiliateBadge({ tab = false, className = "" }: { tab?: boolean; className?: string }) {
  return (
    <span
      title={TIP}
      className={`inline-flex items-center whitespace-nowrap border border-brand-500/45 bg-white px-2 py-0.5 font-data text-[11px] font-medium uppercase leading-[18px] tracking-wider text-brand-700 ${tab ? "absolute -top-[11px] left-5 z-[1]" : ""} ${className}`}
      style={{ borderRadius: 4 }}
    >
      Werbepartner
    </span>
  );
}

/** Line directly under a vendor button that carries the * mark. */
export function AffiliateLinkNote({ long = false, className = "" }: { long?: boolean; className?: string }) {
  return (
    <p className={`text-[13px] leading-snug text-ink-500 ${className}`}>
      <span className="font-medium text-ink-700">* Werbelink:</span>{" "}
      {long
        ? "Wenn Sie über diesen Link einen Vertrag abschließen, erhalten wir gegebenenfalls eine Provision. Für Sie entstehen keine Mehrkosten."
        : "Bei einem Abschluss erhalten wir gegebenenfalls eine Provision."}
    </p>
  );
}
