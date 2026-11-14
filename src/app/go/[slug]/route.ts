import { getAffiliateTarget } from "@/lib/cms";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const link = await getAffiliateTarget(slug);
  const base = process.env.SITE_URL ?? "http://localhost:3000";
  if (!link) return Response.redirect(new URL("/software", base), 302);
  // No cookies, no IP storage. Click counting can be added here without personal data.
  return new Response(null, {
    status: 302,
    headers: {
      Location: link.trackingUrl,
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "no-store",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
  });
}
