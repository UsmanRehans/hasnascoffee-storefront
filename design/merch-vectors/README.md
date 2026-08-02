# Hasnas merch SVG package

Transparent, path-based SVG extractions of the shirt graphics in
`design/merch-references/06` through `17`. Front and back placements are separate files so they
can be uploaded and positioned independently.

## Ink colors

- Cream: `#F8F4EE`
- Matcha green: `#315E3A`
- Terracotta: `#A84F3A`
- Heritage accents: `#4A7C59`, `#B8860B`, `#9E2B25`

## File naming

The leading number matches the concept mockup. The remainder identifies the design and placement,
for example `13-coffee-club-front.svg` and `13-coffee-club-back.svg`.

## Production note

These SVGs are vector traces of approved raster concept mockups. They contain real paths and no
embedded shirt or background image. Before a production print run, inspect small lettering and
fine linework at the printer's final physical dimensions; concept-image texture can produce slight
edge irregularity. Keep these traced files as visual masters, then have final type reset and paths
cleaned for screen printing or embroidery where necessary.

The reproducible extractor is `scripts/vectorize_merch.py`.
