# Printify — Print Specs & Generation Brief

## The blanks

URL format is `/app/editor/{blueprint}/{printProvider}/{technique}`.

| Blueprint | Provider | Blank | Technique |
|---|---|---|---|
| 1393 | 99 | *(unresolved — behind login)* | DTG |
| 1349 | 99 | *(unresolved — behind login)* | DTG |
| 1575 | — | Lane Seven Unisex Urban Heavy Tee | — |
| 2394 | — | Independent Trading Co. Unisex Mainstreet Heavyweight Hooded Sweatshirt | — |
| 1706 | 29 | *(unresolved — behind login)* | DTG |

Within Printify the **print provider** drives quality consistency more than the blueprint does.
Providers 99 and 29 are handling these; keep the same provider across the line so color and hand
match between the tee and the hoodie.

## Printify print specifications

Official, from [Printify's design size guide](https://printify.com/blog/t-shirt-design-size/).

| Placement | Physical size | Canvas @ 300 DPI |
|---|---|---|
| Front, full | 10–12" W × 10–14" H | 3600 × 4200 px |
| Front, center chest | 6–10" W × 6–8" H | 3000 × 2400 px |
| Back, full | 10–14" W × 6–15" H | 4200 × 4500 px |
| Left chest | 2.5–5" × 2.5–5" | 1500 × 1500 px |
| Sleeve (short) | 1–3" × 1–3" | 900 × 900 px |
| Outer neck label | 1–3" × 1–3" | 900 × 900 px |

**File requirements**
- 300 DPI, **RGB** (build in RGB from the start — CMYK gets converted and shifts)
- PNG with transparency, no interlacing. SVG also accepted.
- Max 100 MB (PNG/JPG), 20 MB (SVG). Max 30,000 × 30,000 px.
- Keep art 2–3" below the neckline; stay clear of seams and edges.

**Build everything on a 4500 × 5400 px canvas @ 300 DPI (15" × 18").** That exceeds every print
area above, so a single master file scales *down* into any placement. Never scale up.

### Getting the exact per-blank numbers

Printify's published ranges are generic. Each blueprint + provider has its own hard maximum:

1. Open the editor URL for the blank.
2. Upload any placeholder image.
3. The right-hand panel shows that placement's print area in inches and pixels.
4. Repeat per placement (front / back / sleeve) — they differ.

Print area also varies by **garment size** — the max on a S is smaller than on a 3XL. Printify
scales one uploaded file across the size run, so design to the smallest size's safe area or the
art will crop on small sizes.

---

## The generation brief

Paste the **style block** first, then one numbered request per image. Generate one at a time.

### Style block

> I need original artwork for a coffee brand's apparel line. The brand is Hasna's, an Ethiopian
> coffee house in Austin, Texas.
>
> **Style:** single-color flat vector illustration. No gradients, no shading, no texture, no
> photographic elements, no drop shadows. Clean confident outlines with slight hand-drawn
> irregularity — warm, not mechanically perfect. Where a character or mascot appears, use 1930s
> rubber-hose cartoon linework.
>
> **Color:** the artwork is a single flat cream (#F8F4EE), designed to print on a dark espresso
> (#1A0C05) garment. Render the illustration in cream on a solid black background so I can
> knock it out cleanly. Use exactly one ink color — no second color anywhere.
>
> **Subject vocabulary** — use the real objects, never generic coffee iconography:
> - *jebena* — Ethiopian clay brewing pot: round body, long narrow neck, small side spout,
>   domed lid with a finial
> - *sini* — small handleless cups
> - *rekebot* — the wooden stand the cups rest on
> - coffee branches with leaves and cherries
> - *tilet* geometric border motifs — diamonds, chevrons, stepped crosses
>
> **Never include:** espresso machines, paper to-go cups, Italian moka pots, generic coffee
> beans-with-steam clip art, Latin lettering, any text at all. I set the type myself.
>
> **Output:** square, centered, generous margin, maximum resolution available.

### The requests

**1 — Jebena mark** (back print, tee)
> A single jebena, front-facing, centered. Bold silhouette-forward drawing — readable at
> arm's length. Minimal interior line detail. This is the hero mark for the line.

**2 — Ceremony still life** (back print, tee)
> A jebena on a rekebot stand with three sini cups arranged around it, and one coffee branch
> with two leaves and two cherries entering from the lower left. Composed, symmetrical,
> ceremonial. Reads as a single contained emblem.

**3 — Rubber-hose mascot** (back print, tee)
> A jebena as a 1930s rubber-hose cartoon character — round body, four-fingered gloved hands,
> rounded shoes, simple dot eyes and a friendly smile, one arm raised in a wave. Pouring a
> small stream into a sini cup held in the other hand. Playful, vintage, confident linework.

**4 — Tilet border strip** (sleeve / neck label / hem)
> A horizontal repeating geometric border in the Ethiopian *tilet* tradition — diamonds,
> chevrons, and stepped crosses. Flat, even, tileable left-to-right. Roughly 8:1 aspect ratio.

---

## Resolution gap — read before uploading

ChatGPT's image generator outputs around **1024–1536 px**. Printify wants **4500 px**. Uploading
generated art directly will trigger a low-resolution warning and print soft.

Because this artwork is single-color flat vector by design, the fix is easy:

1. Generate in ChatGPT (cream on solid black).
2. **Vectorize** — Illustrator Image Trace on Black & White Logo, or vectorizer.ai. Single-color
   flat art traces near-perfectly; this is exactly the case tracing handles best.
3. Clean the paths, recolor to cream `#F8F4EE`, delete the black background.
4. Export PNG at 4500 × 5400 @ 300 DPI, transparent. **Upload the PNG, keep the SVG as master.**
   Printify accepts SVG under 20 MB, but DTG rasterizes at the print RIP anyway, and SVG can
   carry elements that interpret unpredictably. Exporting the PNG yourself means you see
   exactly what prints.

Vectorizing also makes the art resolution-independent, so the same file serves a 15" back print,
a 3" sleeve hit, cups, and signage.

**Do not use an AI upscaler** (Higgsfield, Topaz, etc.) for this artwork. Those do raster
upscaling — inventing new pixels — which suits photographs and degrades flat line art into soft,
wobbly edges. Tracing rebuilds true geometry instead. There is no upscaling step in this pipeline.

This only holds if the generated art stays genuinely flat. Tracing collapses on gradients,
texture, and soft shading, turning them into hundreds of muddy stacked paths. The "flat, single
color, no gradients, no shading" constraint in the style block is what keeps the pipeline working
— it is a technical requirement, not a stylistic preference.

**Set type in vector, not in ChatGPT.** Generators produce malformed letterforms and bad spacing.
Three of the five reference designs are pure typography — that half gets built directly as SVG.

## Constraints carried from DESIGN_LANGUAGE.md

- Light garments remain blocked until a dark-ink logo variant exists (§7, §11 item 1). These
  briefs all assume cream ink on a dark garment, which works with current assets.
- Tricolor (`#4A7C59` / `#B8860B` / `#9E2B25`) appears only as thin rules, never as fill (§3, §6b).
- No Amharic until proofread (§4).
- Playfair Display for display type, Inter for everything else (§4).
