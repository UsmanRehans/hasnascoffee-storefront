#!/usr/bin/env python3
"""Extract the approved merch prints from mockups as transparent SVG paths."""

from pathlib import Path
import html
import cv2
import numpy as np


ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "design" / "merch-references"
OUT = ROOT / "design" / "merch-vectors"


# name, source, crop (left, top, right, bottom), ink mode, display color
JOBS = [
    ("06-coffee-house-back", "06-hasnas-coffee-house-branded.png", (240, 360, 860, 1135), "brand-multi", None),
    ("07-buna-club-front", "07-hasnas-buna-club-front-back.png", (300, 260, 650, 475), "cream", "#F8F4EE"),
    ("07-buna-club-back", "07-hasnas-buna-club-front-back.png", (925, 205, 1375, 815), "cream", "#F8F4EE"),
    ("08-ethiopian-coffee-house-front", "08-hasnas-ethiopian-coffee-house-front-back.png", (430, 250, 620, 490), "cream", "#F8F4EE"),
    ("08-ethiopian-coffee-house-back", "08-hasnas-ethiopian-coffee-house-front-back.png", (915, 195, 1380, 890), "cream", "#F8F4EE"),
    ("09-buna-society-front", "09-hasnas-buna-society-front-back.png", (350, 245, 585, 475), "cream", "#F8F4EE"),
    ("09-buna-society-back", "09-hasnas-buna-society-front-back.png", (900, 210, 1385, 800), "cream", "#F8F4EE"),
    ("10-coffee-or-matcha-front", "10-hasnas-coffee-or-matcha-front-back.png", (340, 245, 650, 455), "cream", "#F8F4EE"),
    ("10-pick-your-pour-back", "10-hasnas-coffee-or-matcha-front-back.png", (965, 170, 1515, 770), "cream", "#F8F4EE"),
    ("11-espresso-depresso-front", "11-hasnas-more-espresso-less-depresso-white-front-back.png", (315, 250, 620, 500), "terracotta", "#A84F3A"),
    ("11-espresso-depresso-back", "11-hasnas-more-espresso-less-depresso-white-front-back.png", (865, 165, 1455, 815), "terracotta", "#A84F3A"),
    ("12-coffee-club-back", "12-hasnas-coffee-club-brown-back.png", (235, 420, 855, 1015), "cream", "#F8F4EE"),
    ("13-coffee-club-front", "13-hasnas-coffee-club-front-back.png", (420, 290, 650, 470), "cream", "#F8F4EE"),
    ("13-coffee-club-back", "13-hasnas-coffee-club-front-back.png", (875, 255, 1335, 750), "cream", "#F8F4EE"),
    ("14-matcha-mood-front", "14-hasnas-in-a-matcha-mood-front-back.png", (250, 245, 665, 565), "green", "#315E3A"),
    ("14-matcha-mood-illustrated-back", "14-hasnas-in-a-matcha-mood-front-back.png", (920, 190, 1485, 775), "green", "#315E3A"),
    ("15-matcha-mood-front", "15-hasnas-in-a-matcha-mood-minimal-back.png", (250, 245, 665, 565), "green", "#315E3A"),
    ("15-matcha-bowl-back", "15-hasnas-in-a-matcha-mood-minimal-back.png", (1080, 190, 1300, 355), "green", "#315E3A"),
    ("16-matcha-mood-front", "16-hasnas-in-a-matcha-mood-text-only-back.png", (250, 245, 665, 565), "green", "#315E3A"),
    ("16-hasnas-text-back", "16-hasnas-in-a-matcha-mood-text-only-back.png", (1090, 250, 1265, 345), "green", "#315E3A"),
    ("17-matcha-mood-front", "17-hasnas-in-a-matcha-mood-logo-back.png", (250, 245, 665, 565), "green", "#315E3A"),
    ("17-hasnas-logo-back", "17-hasnas-in-a-matcha-mood-logo-back.png", (1080, 180, 1285, 355), "green", "#315E3A"),
]


def mask_for(rgb, mode):
    hsv = cv2.cvtColor(rgb, cv2.COLOR_RGB2HSV)
    h, s, v = cv2.split(hsv)
    if mode == "cream":
        return ((v > 145) & (s < 105)).astype(np.uint8) * 255
    if mode == "green":
        r, g, b = cv2.split(rgb)
        return ((g.astype(int) > r.astype(int) + 3) &
                (g.astype(int) > b.astype(int) + 3) &
                (s > 12) & (v < 250)).astype(np.uint8) * 255
    if mode == "terracotta":
        r, g, b = cv2.split(rgb)
        return ((r.astype(int) > g.astype(int) + 8) &
                (r.astype(int) > b.astype(int) + 8) &
                (s > 25) & (v < 235)).astype(np.uint8) * 255
    raise ValueError(mode)


def clean_mask(mask):
    kernel = np.ones((2, 2), np.uint8)
    return cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)


def remove_border_components(mask):
    count, labels, _, _ = cv2.connectedComponentsWithStats(mask, 8)
    border = set(np.unique(labels[0, :])) | set(np.unique(labels[-1, :]))
    border |= set(np.unique(labels[:, 0])) | set(np.unique(labels[:, -1]))
    cleaned = mask.copy()
    for label in border:
        if label:
            cleaned[labels == label] = 0
    return cleaned


def compound_path(mask):
    contours, hierarchy = cv2.findContours(mask, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_SIMPLE)
    if hierarchy is None:
        return ""
    parts = []
    for contour in contours:
        if abs(cv2.contourArea(contour)) < 3:
            continue
        contour = cv2.approxPolyDP(contour, 0.7, True)
        pts = contour[:, 0, :]
        if len(pts) < 3:
            continue
        parts.append("M" + " ".join(f"{int(x)},{int(y)}" for x, y in pts) + "Z")
    return " ".join(parts)


def svg_for(name, source, crop, mode, color):
    image = cv2.cvtColor(cv2.imread(str(SRC / source)), cv2.COLOR_BGR2RGB)
    left, top, right, bottom = crop
    art = image[top:bottom, left:right]
    height, width = art.shape[:2]
    layers = []
    if mode == "brand-multi":
        targets = [
            ("#F8F4EE", np.array([248, 244, 238])),
            ("#4A7C59", np.array([74, 124, 89])),
            ("#9E2B25", np.array([158, 43, 37])),
            ("#B8860B", np.array([184, 134, 11])),
        ]
        pixels = art.astype(int)
        distances = np.stack([np.linalg.norm(pixels - target, axis=2) for _, target in targets])
        nearest = np.argmin(distances, axis=0)
        best = np.min(distances, axis=0)
        for index, (layer_color, _) in enumerate(targets):
            threshold = 72 if index else 95
            mask = ((nearest == index) & (best < threshold)).astype(np.uint8) * 255
            if index == 0:
                mask = remove_border_components(mask)
            layers.append((layer_color, clean_mask(mask)))
    else:
        mask = mask_for(art, mode)
        layers.append((color, clean_mask(mask)))

    paths = []
    for fill, mask in layers:
        data = compound_path(mask)
        if data:
            paths.append(f'  <path fill="{fill}" fill-rule="evenodd" d="{data}"/>')
    title = name.replace("-", " ").title()
    return "\n".join([
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img" aria-label="{html.escape(title)}">',
        f'  <title>{html.escape(title)}</title>',
        f'  <metadata>Vectorized from {html.escape(source)}; transparent print artwork only.</metadata>',
        *paths,
        '</svg>',
        '',
    ])


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for name, source, crop, mode, color in JOBS:
        (OUT / f"{name}.svg").write_text(svg_for(name, source, crop, mode, color))
    print(f"Wrote {len(JOBS)} SVG files to {OUT}")


if __name__ == "__main__":
    main()
