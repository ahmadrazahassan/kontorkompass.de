import type { ReactNode } from "react";
import { Breadcrumbs } from "./Blocks";

export function PageHeader({
  title,
  lead,
  eyebrow,
  crumbs,
}: {
  title: string;
  lead?: string;
  eyebrow?: string;
  crumbs: { label: string; href?: string }[];
}) {
  return (
    <div className="container-page pt-8 lg:pt-12">
      <Breadcrumbs items={[{ label: "Startseite", href: "/" }, ...crumbs]} />
      <div className="mt-10 max-w-3xl pb-10 lg:pb-14">
        {eyebrow && <p className="t-eyebrow mb-4">{eyebrow}</p>}
        <h1 className="t-h1">{title}</h1>
        {lead && <p className="t-lead mt-6 max-w-[60ch]">{lead}</p>}
      </div>
    </div>
  );
}

export function TextPage({ title, lead, crumbs, children }: { title: string; lead?: string; crumbs: { label: string; href?: string }[]; children: ReactNode }) {
  return (
    <>
      <PageHeader title={title} lead={lead} crumbs={crumbs} />
      <div className="container-page border-t border-line pb-24 pt-12">
        <div className="prose-de max-w-[720px]">{children}</div>
      </div>
    </>
  );
}

export function Placeholder({ children }: { children: ReactNode }) {
  return <mark className="bg-[#fff3c4] px-1 text-ink-950">{children}</mark>;
}

/** Shows a value, or a yellow placeholder while the value is still empty. */
export function Fill({ value, label }: { value: string; label: string }) {
  return value ? <>{value}</> : <Placeholder>[{label}]</Placeholder>;
}
