# Hasna's — Design Language

Ethiopian Coffee House · Austin, TX
Source of truth for visual decisions. If a choice isn't covered here, it should be derivable from here.

---

## 1. The organizing idea

**A cream field with a woven edge.**

Traditional Ethiopian dress — the *netela* shawl, the *habesha kemis* — is almost entirely undyed white cotton, with all of its identity concentrated into a narrow woven border called *tilet*. The cloth is calm. The edge carries the pattern, the color, the meaning.

That is the rule for this brand:

> **Content lives on calm cream. Identity lives in the edges and accents. Never the reverse.**

This is what keeps the brand from becoming a costume. Ethiopian identity here is not wallpaper — it is deliberate, placed, and earned. A page should read as quiet and premium at a glance, and reveal its specificity on inspection.

When a design feels wrong, it is almost always because pattern or color migrated from the edge into the field.

---

## 2. Reading the logo

The mark is the primary artifact. Everything below is derived from it rather than invented alongside it.

| Element in the mark | What it contributes |
|---|---|
| **The jebena** — clay coffee pot, cream silhouette, centered | The signature shape. Our most recognizable form. |
| **The circular medallion frame** | Framing device. Round, contained, ceremonial. |
| **Geometric border motif** on the upper arc | The *tilet* vocabulary — diamonds, chevrons, stepped crosses. |
| **Concentric rings** in green / gold / red | The Ethiopian tricolor, used as *line*, not as fill. |
| **Coffee branches with leaves** | The agricultural origin. Green as a living color. |
| **Cream artwork on transparency** | The mark is light-on-dark. This constrains a lot — see §7. |
| **Slightly irregular, hand-drawn linework** | Warmth. Nothing is mechanically perfect. |

Two things to carry forward specifically:

1. **The tricolor appears as thin concentric lines, never as blocks.** That restraint is why the logo reads as premium rather than as a flag. Preserve it everywhere.
2. **The jebena is drawn in the ground color, not an accent color.** The subject is cream; the decoration is colored. Same hierarchy as the netela.

---

## 3. Color

Defined in `:root` at the top of `assets/theme.css`.

### The field

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#F8F4EE` | Bone. The default ground for everything. |
| `--color-bg-alt` | `#F0EAE0` | Section alternation. Barely perceptible on purpose. |
| `--color-bg-card` | `#FFFFFF` | Lifted surfaces. |
| `--color-text` | `#1A0C05` | Espresso. Body text, and the ground for product cards. |
| `--color-text-secondary` | `#6B4F3A` | Roasted brown. |
| `--color-text-muted` | `#9E8070` | Metadata, captions. |

Cream and espresso do ~95% of the work. If a screen can be built from these alone, build it from these alone.

### The edge — the tricolor, dimmed to earth

| Token | Value | Sourced from |
|---|---|---|
| `--color-green` | `#4A7C59` | Flag green, taken toward the coffee leaf |
| `--color-gold` | `#B8860B` | Flag yellow, taken toward honey and brass |
| `--color-terracotta` | `#C4622D` | Clay — the jebena's fired-earth cousin |

**These are deliberately not the literal flag colors** (`#078930` / `#FCDD09` / `#DA121A`). Saturated flag colors on a webpage read as *a flag*. Muted toward earth, they read as *a place*. Keep them muted.

**Gap to close:** the palette has no true red. Terracotta is orange-leaning and can't complete the tricolor on its own — the logo's third ring is a deep oxblood. Add:

```css
--color-red: #9E2B25;  /* oxblood — completes the tricolor for rules, borders, accents */
```

Use it only as line and border, never as a fill or a button.

### Color rules

- Gold is the interactive color: links, buttons, focus, hover.
- Green and red are **decorative only** — rules, borders, dividers, pattern. Never a button, never a background, never body text.
- Never place green, gold, and red as three adjacent solid blocks. As three thin parallel lines, always welcome.
- No gradients except the existing hero scrim.

---

## 4. Typography

| Role | Family | Notes |
|---|---|---|
| Display | **Playfair Display** | Headlines only. High contrast, ceremonial. |
| Body / UI | **Inter** | Everything else. |

- Eyebrows are Inter, uppercase, `~0.75rem`, letter-spacing `0.12em`, `--color-gold`. This is a signature — it appears above nearly every section and should stay consistent.
- Display headings: weight 600, line-height ~1.15, never uppercase. Playfair uppercase looks like a wedding invitation.
- Body: 1rem / 1.7. Generous.
- Never letter-space Playfair.

**Amharic:** if Amharic (ግዕዝ) is ever set alongside Latin, use **Noto Serif Ethiopic** and size it ~1.1× the Latin to optically match. Do not set Amharic in a fallback font — broken Ethiopic rendering is worse than no Amharic. Do not use Amharic as decoration if no one has proofread it.

---

## 5. Form and geometry

Derived from the medallion: **round, soft, contained.**

- Radii: cards `20px`, buttons/pills fully rounded, images `16px`, small chips `8px`.
- Nothing is a hard rectangle. Nothing is a perfect circle except the medallion and badges.
- Shadows are warm and brown-tinted (`rgba(26,12,5,0.22)`), never neutral grey/black.
- Generous whitespace. The cream field needs room to actually be a field.
- Container max `1280px`.

---

## 6. The motif system

Three reusable devices. Use them sparingly — one per screen region, not stacked.

**a. The medallion.** The circular logo frame, used as a containing shape — section badges, an avatar mask, a watermark at very low opacity behind a quote. Never smaller than 40px or the border motif turns to mud.

**b. The tilet rule.** A thin horizontal band of green/gold/red lines, optionally with a repeating diamond or chevron. This is the workhorse: section dividers, the underline beneath an eyebrow, footer top edge, card top edge. **Maximum 4px tall.** The moment it gets thick it becomes a flag.

**c. The jebena silhouette.** The pot outline as a functional shape — empty-state icon, loading indicator, cart icon, favicon, list bullet. Always in a single flat color, never detailed.

---

## 7. Imagery

### The light-logo constraint

Both logo PNGs are **cream artwork on transparency**. That means:

- ✅ Dark header, dark footer, dark cards, dark shirts
- ❌ The cream page body, light shirts, tote bags, light packaging

**A dark-ink version of both the mark and the wordmark does not exist and needs to be produced.** This blocks merch on any light garment and any light-background print application. Highest-priority asset gap after the hero.

### Hero imagery

The hero must communicate *brand and culture*, not *venue*. Hasna's is a cart today and a coffee house later — no image should imply a room until there is one.

Rules:
- No interiors, no walls, no windows, no furniture, no signage.
- Objects and materials only: ceremony vessels, beans, textile, clay, brass.
- Warm directional light, soft shadows, bone/cream grade.
- Composition weighted right; the **left 40% stays calm** for the headline and buttons.
- `16:9` minimum, 2000px+ wide.

### Product imagery — transparent cutouts, non-negotiable

`snippets/product-card.liquid` renders a **dark espresso bento card with a floating image**: `object-fit: contain`, a drop-shadow, and `translateY(-24px)` so the drink lifts above the card edge. A photo with a background renders as a pasted rectangle and destroys the effect.

Every product image must be a **transparent PNG cutout**.

Production spec:
- Square source, subject centered with generous margin
- Lit from the upper left, soft — the CSS drop-shadow supplies the grounding shadow, so the image itself should carry **no cast shadow**
- Shot slightly above eye level, consistent across the whole set
- Export at 1000×1000 minimum

### Vessel vocabulary

Consistency of vessel is what makes 12 separate images read as one menu. Match the drink to its correct vessel — the authenticity lives here.

| Drink type | Vessel |
|---|---|
| Traditional / ceremony buna | Black clay **jebena** + white **sini** cups on a **rekebot** stand |
| Black / spiced / buttered coffee | Single white **sini** cup |
| Espresso, macchiato | Small heavy glass or white demitasse |
| Latte | Clear glass tumbler, visible milk layering |
| Iced / cold brew | Tall clear glass, ice, condensation |
| **Tej** | **Berele** — the round-bottomed narrow-necked glass flask. Not a mug, not a wine glass. |
| Herbal tea (Kuti) | Clear glass cup, amber liquid visible |

Garnish is a signal, not decoration: cardamom pods, a cinnamon stick, fresh ginger, coffee beans, a honey drizzle. One or two per image, never a styled pile.

---

## 8. Cultural vocabulary

Use the real words. Gloss on first use, then let them stand — the specificity *is* the brand.

| Term | Meaning |
|---|---|
| **Buna** (ቡና) | Coffee |
| **Jebena** (ጀበና) | The clay brewing pot |
| **Sini** | Small handleless cups |
| **Rekebot** | The stand holding the cups |
| **Mesob** | Woven basket table |
| **Berele** | Round-bottomed flask for tej |
| **Tilet** | The woven pattern on traditional dress |
| **Netela** | White cotton shawl with a woven border |
| **Kolo** | Roasted barley, served with coffee |
| **Etan** | Frankincense, burned during the ceremony |
| **Abol · Tona · Baraka** | The three rounds of the ceremony — first, second, blessing |

Never translate these into "Ethiopian-style coffee pot." Say jebena.

---

## 9. Voice

Warm, plain, unhurried. Specific over superlative.

- "Coffee prepared with butter and salt — a tradition from the Oromia highlands." ✅
- "The BEST authentic Ethiopian coffee experience!!" ❌

Short sentences. Sensory detail before adjectives. Name origins and regions — Yirgacheffe, Harar, Sidama, Oromia — they carry more than any praise word.

Never use "exotic." Never frame the ceremony as a novelty or a performance.

---

## 10. Do / Don't

| Do | Don't |
|---|---|
| Keep the cream field calm | Tile pattern across a background |
| Use the tricolor as thin lines | Use it as three color blocks |
| Muted, earthen accents | Saturated flag colors |
| Real Amharic terms, glossed | "Exotic," "tribal," "ethnic" |
| Transparent cutouts on product cards | Square photos with backgrounds |
| Gold for anything interactive | Green or red buttons |
| One motif per screen region | Medallion + tilet + jebena stacked together |
| Objects, textile, materials in hero | Rooms, storefronts, venues |

---

## 11. Open items

- [ ] **Dark-ink logo variants** (mark + wordmark) — blocks light-garment merch and light-background print
- [ ] Add `--color-red: #9E2B25` to `:root`
- [ ] Build the tilet rule as a reusable snippet
- [ ] Favicon and social share image from the jebena silhouette
- [ ] Logo files are heavy (`Hasnas-Logo-2.svg` is 1.8MB) — optimize before they ship in the header
- [ ] Amharic proofreader before any Amharic ships publicly
