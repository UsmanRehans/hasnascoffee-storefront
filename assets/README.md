# Assets Folder

Place your brand assets here. They will be deployed to Shopify and accessible via `{{ 'filename.ext' | asset_url }}` in Liquid templates.

## Recommended files to add

| File | Usage |
|------|-------|
| `logo.png` or `logo.svg` | Main header logo |
| `logo-white.png` or `logo-white.svg` | White version for dark backgrounds |
| `logo-dark.png` | Dark version for light backgrounds |
| `favicon.png` | Browser favicon (32×32px minimum) |
| `hero-bg.jpg` | Hero section background image |
| `about-main.jpg` | About section main image |
| `about-secondary.jpg` | About section accent image |
| `og-image.jpg` | Social sharing image (1200×630px) |

## Image guidelines

- **Logo:** PNG with transparent background, or SVG preferred
- **Hero background:** At least 2000px wide, JPG optimized for web
- **Product images:** Square format (1:1), minimum 800×800px
- **All images:** Compress before uploading to keep load times fast

## How to reference in Liquid

```liquid
{{ 'logo.png' | asset_url | img_tag: shop.name }}

<img src="{{ 'hero-bg.jpg' | asset_url }}" alt="Hero background">
```
