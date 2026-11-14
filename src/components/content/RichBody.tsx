import { RichText, type JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { Callout } from "./Blocks";
import { Button } from "@/components/ui/Button";
import { PartnerLogo } from "@/components/ui/PartnerLogo";
import { getCms } from "@/lib/cms";
import { slugify } from "@/lib/format";

/* eslint-disable @typescript-eslint/no-explicit-any */
const textOf = (nodes: any[]): string => (nodes ?? []).map((n) => n.text ?? textOf(n.children ?? [])).join("");

/** Plain-text block fields (steps, callouts) may contain **bold** and [label](/path). Render them instead of showing the raw marks. */
function InlineMd({ text }: { text: string }) {
  const parts = String(text ?? "").split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
        const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
        if (link) return <a key={i} href={link[2]}>{link[1]}</a>;
        return part;
      })}
    </>
  );
}

/** Software box inside articles. "Anzeige" and * only appear while the linked programme is really active (isAffiliate in the CMS). */
export async function AffiliateCtaBox({ softwareId, slug, text }: { softwareId?: any; slug?: string; text: string }) {
  const payload = await getCms();
  let sw: any = null;
  if (slug) {
    sw = (await payload.find({ collection: "software", where: { slug: { equals: slug } }, limit: 1, depth: 1 }).catch(() => null))?.docs[0] ?? null;
  } else {
    const id = typeof softwareId === "object" ? softwareId.id : softwareId;
    sw = await payload.findByID({ collection: "software", id, depth: 1 }).catch(() => null);
  }
  if (!sw) return null;
  const link = typeof sw.affiliateLink === "object" ? sw.affiliateLink : null;
  const isAffiliate = Boolean(link?.isAffiliate);
  return (
    <div className="not-prose my-10 rounded-[12px] border border-line p-6">
      <p className="t-eyebrow">{isAffiliate ? "Anzeige · Mit * gekennzeichnete Links sind Werbelinks" : "Software im Überblick"}</p>
      <div className="mt-3 flex items-center justify-between gap-4">
        <h3 className="t-h3">Passende Software</h3>
        <PartnerLogo slug={sw.slug} height={20} maxWidth={110} tile={false} />
      </div>
      <p className="mt-2 text-ink-700">
        <strong className="text-ink-950">{sw.name}:</strong> {text}
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        {link && (
          <Button href={`/go/${link.slug}`} variant="primary" affiliate={isAffiliate} external={!isAffiliate} arrow>
            {sw.ctaLabel}
          </Button>
        )}
        <Button href={`/software/${sw.slug}`} variant="outline">
          Zum Software-Profil
        </Button>
      </div>
      {isAffiliate && <p className="mt-3 text-[13px] text-ink-500">* Werbelink: Wir erhalten gegebenenfalls eine Provision. Für Sie entstehen keine Mehrkosten.</p>}
    </div>
  );
}

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  heading: ({ node, nodesToJSX }) => {
    const Tag = node.tag as "h2" | "h3" | "h4";
    const label = textOf(node.children as any[]);
    return <Tag id={slugify(label)}>{nodesToJSX({ nodes: node.children })}</Tag>;
  },
  table: ({ node, nodesToJSX }) => (
    <div className="table-wrap">
      <table className="data-table">
        <tbody>{nodesToJSX({ nodes: node.children })}</tbody>
      </table>
    </div>
  ),
  blocks: {
    callout: ({ node }: any) => (
      <Callout kind={node.fields.kind ?? "info"} title={node.fields.title}>
        <p>
          <InlineMd text={node.fields.text} />
        </p>
      </Callout>
    ),
    affiliateCta: ({ node }: any) => <AffiliateCtaBox softwareId={node.fields.software} text={node.fields.text} />,
    steps: ({ node }: any) => (
      <ol className="steps">
        {(node.fields.steps ?? []).map((s: any, i: number) => (
          <li key={i}>
            <div>
              <InlineMd text={s.text} />
            </div>
          </li>
        ))}
      </ol>
    ),
  } as any,
});

export function RichBody({ data }: { data: SerializedEditorState }) {
  return <RichText data={data} converters={converters} />;
}
