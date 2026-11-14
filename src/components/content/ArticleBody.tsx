import { ERechnungBody } from "@/content/ERechnungBody";
import { FristenBody } from "@/content/FristenBody";
import { RichBody } from "./RichBody";
import type { DocWithBody } from "@/lib/cms";

// Renders the article text: CMS rich text for new articles, code templates for the two founding articles.
export function ArticleBody({ doc }: { doc: DocWithBody }) {
  if (doc.legacyBody === "e-rechnung-2027") return <ERechnungBody />;
  if (doc.legacyBody === "fristen") return <FristenBody />;
  if (doc.body) return <RichBody data={doc.body} />;
  return null;
}
