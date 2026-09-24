# How to use your own Pinterest photos on luxewigs

Pinterest blocks other websites from hotlinking its photos, so the site
can't pull them in automatically. Instead, every photo on the site first
looks for a **local file** in this `images/` folder — if the file exists it
is used, otherwise the site falls back to the built-in studio photo (so the
site never shows a broken image).

## Steps (2 minutes)

1. On Pinterest, open the wig photo you love → click the `...` menu →
   **Download image** (or screenshot it).
2. Rename the file to **exactly** one of the names below (keep `.jpg`).
3. Copy it into this `images/` folder.
4. Commit + push — Vercel redeploys automatically and your photo is live.

## Filenames

Hero & banners:
- `hero-main.jpg` — big hero model (long black wig)
- `hero-side.jpg` — second hero model
- `blonde-banner.jpg` — wide blonde banner
- `quality.jpg` — Quality & Luxury section photo

Category tiles:
- `tile-best.jpg` — Best Sellers tile
- `tile-flash.jpg` — Flash Sale tile
- `tile-new.jpg` — New Arrivals tile

Selfies strip:
- `selfie-1.jpg`, `selfie-2.jpg`, `selfie-3.jpg`, `selfie-4.jpg`

Products (match the product name):
- `p-bone-straight.jpg` — Luxe Bone Straight 30"
- `p-body-wave.jpg` — Royal Body Wave Frontal
- `p-kinky-curly.jpg` — Luxe Kinky Curly (Glueless)
- `p-honey-bob.jpg` — Honey Blonde Bob
- `p-chic-bob.jpg` — Chic Black Bob
- `p-burgundy-wave.jpg` — Burgundy Body Wave
- `p-platinum-613.jpg` — Platinum Blonde 613 Frontal
- `p-deep-wave.jpg` — Deep Wave Closure Unit
- `p-highlight-bun.jpg` — Highlight Bundles 28"
- `p-sdd-bouncy.jpg` — SDD Bouncy (Jet Black)
- `p-ginger-kinky.jpg` — Ginger Kinky Straight
- `p-choco-highlight.jpg` — Choco Highlight Body Wave
- `p-auburn-fire.jpg` — Auburn Fire Bussdown
- `p-honey-brown.jpg` — Honey Brown Layered Frontal
- `p-natural-fro.jpg` — Natural Girl Fro (Xtra Volume)
- `p-wine-replica.jpg` — Wine Donor Replica

Tip: portrait photos (3:4, e.g. 900×1200px) look best.
