# Dudley Development — website

The marketing + legal site for [Dudley Development](https://github.com/nicksantulli),
a small independent iOS studio. Static, dependency-free, low-maintenance by design.

## What's here

| Path | Purpose |
|---|---|
| `index.html` | Home — studio intro + app showcase (Powell Prowl, Vibe Rater) |
| `about.html` | About the studio |
| `support.html` | Consolidated support + per-app FAQ + contact email |
| `privacy/index.html` | Privacy hub — links to each app's policy |
| `privacy/powell-prowl.html` | Powell Prowl: Rate Chase privacy policy (migrated from the old `powell-prowl-legal` repo) |
| `privacy/vibe-rater.html` | Vibe Rater privacy policy |
| `app-ads.txt` | AdMob authorized-sellers file (served at the web root) |
| `assets/` | Shared `style.css`, brand mark, app icons |
| `.nojekyll` | Tells GitHub Pages to serve files as-is (so `app-ads.txt` works) |

## Stack

Plain HTML + one hand-written CSS file (`assets/style.css`). **No build step, no
dependencies, no framework.** Edit a file, commit, done — it deploys as-is. This is
deliberate: the site should outlive any tooling churn and need near-zero upkeep.

## Local preview

```bash
cd dudley-web
python3 -m http.server 8000   # then open http://localhost:8000
```

## Deploy (free)

Either free host works on a subdomain to start; wire a custom domain later only if
the Owner registers one.

**GitHub Pages** — repo must be public (Pages on private repos needs a paid plan).
Settings → Pages → Source: `main` / root. Serves at `https://<user>.github.io/dudley-web/`
(or the root domain if this becomes the user/organization site).

**Cloudflare Pages** — connect the repo (works while private), framework preset *None*,
build command empty, output dir `/`. Serves at `https://dudley-web.pages.dev`.

### app-ads.txt note

`app-ads.txt` must be reachable at the **root of the domain listed as the app's
marketing/developer URL in App Store Connect**. For the AdMob crawler to pick it up,
point each app's App Store marketing URL at this site's domain so the file resolves at
`https://<domain>/app-ads.txt`. Verify after deploy:

```bash
curl -s https://<domain>/app-ads.txt
# expect: google.com, pub-9950526548980224, DIRECT, f08c47fec0942fa0
```

Then register the domain in AdMob → Apps → [app] → App-ads.txt.

## Editing content

- **New app?** Add a card in `index.html#apps`, a privacy page under `privacy/`, a row
  in `privacy/index.html`, and (optionally) a support section in `support.html`.
- **Support email** lives in `support.html`, `about.html`, and each privacy page
  (`mailto:nicksantulli@yahoo.com`). Search-and-replace to change it everywhere.

© Dudley Development.
