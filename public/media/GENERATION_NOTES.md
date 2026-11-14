# Image delivery

This directory contains the assets from `IMAGE_PROMPTS.md` that can be produced without real company, author, or vendor photography.

- `photo-manifest.json`: 22 distinct editorial photographs, with German alt text, attribution, caption, AVIF and WebP paths.
- `vector-manifest.json`: 54 illustrations and patterns, with German alt text where the image is informative.
- `photo-contact-sheet.webp` and `vector-contact-sheet.webp`: visual review sheets.

The photos were regenerated on 7 November 2026 with the built-in image generation tool, one prompt per subject. Each prompt combined the corresponding Section 7 subject with this revised shared style block:

> Candid photorealistic documentary photograph in a believable German small or mid-sized business setting. Natural light appropriate to the place, restrained grade, natural posture, real skin and fabric texture, believable objects, editorial negative space. Use the specified distinct person, outfit, workspace, camera angle and activity. Avoid uniform navy/blue outfits and repeated bright offices. No readable text or screens, logos, watermark, fake UI, holograms, floating icons, stock-photo smile, posing, handshakes, pointing, thumbs up, HDR, orange-teal grade, flare, vignette, or distorted anatomy.

The casting and color choices were deliberately different across the set: burgundy accountant, olive-and-tan carpenter, rust-and-charcoal colleagues, yellow-and-brown bakery owner, green-jacket business owner, sage-sweater home worker, green-cardigan roofing manager, lilac-shirt payroll specialist, tan-and-orange workshop onboarding, striped-shirt grocery worker, mustard/grey/cream HR team, charcoal factory worker, orange-vest foreman, maroon warehouse worker, grey-coverall machine operator, plum-blazer adviser, beige-shirt scanner operator, and terracotta software tester. The two trust-page shots are a desk still life and a close view of a researcher's hands.

The source subjects and intended German alt text remain in `IMAGE_PROMPTS.md`. The original generated PNGs remain in the Codex generated-images directory; `scripts/export-generated-photos.mjs` records their IDs and exports 1600×900 sRGB files for the site. `scripts/generate-brief-art.mjs` produces the SVG family with exact brand colors.

Photorealistic images must retain the visible caption **Symbolbild (KI-generiert)** wherever published. `M11` requires a real company photo; author portraits and vendor logos/screenshots likewise require real approved source material. `G07` is specified as a `next/og` template, so there is no static image in this directory for it.
