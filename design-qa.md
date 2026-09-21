# Dudley website design QA

- Source visual truth: `/Users/nicksantulli/.codex/visualizations/2026/09/21/01a0c425-4c4b-7351-99e0-825dc654d409/.superpowers/brainstorm/74192-1790005228/content/option-2.png`
- Source pixels: 1487 × 1058.
- Implementation: `http://127.0.0.1:4322/` and `http://127.0.0.1:4322/apps/last-human/`.
- Implementation screenshots: current-run Codex Browser captures emitted inline; the in-app browser did not provide a filesystem export path.
- Viewports: 1440 × 900 and 390 × 844 CSS pixels at device scale factor 1.
- State: logged-out public homepage and Last Human product page; mobile menu closed except during the keyboard interaction check.

## Full-view comparison evidence

The approved direction and implementation now share the same visible hierarchy: compact black masthead, one-line desktop product-first headline, immediate transition into full-width product bands, Last Human first, solid product-specific color fields, heavy sans-serif type, mono product facts, square controls, and real product imagery. The directional mock's stale Last Human “coming soon” message was correctly replaced by “Live on the App Store.”

At 390 CSS pixels the page reflows into a single-column reading order without horizontal overflow. At 1440 CSS pixels Last Human begins within the first viewport, instead of being pushed below an oversized introduction.

## Focused region comparison evidence

- Header: the visible longhorn-D mark and Dudley Development wordmark now match the approved masthead structure. The implementation uses an optimized 108-pixel transparent WebP derived from the supplied Dudley mark.
- Homepage opening: the desktop H1 renders on one line and the supporting sentence remains directly below it.
- Last Human band: live status, product name, premise, real artwork, factual bullets, attributed App Store action, and product-page action are all visible.
- Last Human detail: live status, 50-floor description, pricing/account/offline/privacy facts, App Store action, FAQ, and related product content are present.

## Required fidelity surfaces

- Fonts and typography: passed. Heavy Arial/Helvetica display type and system monospace labels preserve the approved editorial/poster contrast, hierarchy, and wrapping.
- Spacing and layout rhythm: passed after one iteration. Desktop intro height is approximately 280 CSS pixels and the first product begins at approximately 344 CSS pixels; mobile stays compact and single-column.
- Colors and visual tokens: passed. Black, warm paper, Last Human green, Table Talk amber/brown, VibeRater magenta, EconByte blue, and Powell Prowl yellow remain solid and high-contrast without gradients or glass effects.
- Image quality and asset fidelity: passed. Product bands use the real supplied app art with WebP sources. The shared mark now renders from a self-contained optimized asset instead of an SVG wrapper whose nested PNG failed to display.
- Copy and content: passed. The rejected “Independent iOS studio” and “small apps with real character” language is absent. Last Human is identified as live and the page states 50 floors.

## Interaction and accessibility evidence

- Homepage-to-Last-Human navigation reached `/apps/last-human/` from the visible secondary product action.
- The mobile menu opened with Enter, closed with Escape, and returned focus to the Menu summary.
- A 36-case route sweep covering 9 routes at 320, 390, 844, and 1440 CSS pixels found zero horizontal-overflow, H1-count, skip-target, missing-alt, or unlabeled-form failures.
- Browser console check found zero warnings or errors on the homepage and Last Human route.
- Automated Lighthouse checks completed earlier in this release pass scored the representative routes at 100 for performance, accessibility, and SEO; five of six routes scored 100 for best practices and Last Human scored 96.

## Comparison history

1. P2 — The desktop introduction and product bands were substantially taller than the selected visual direction, keeping every product below a 900-pixel viewport. Fixed by reducing the intro type scale/padding and desktop band height/gaps. Post-fix evidence shows a one-line H1 and Last Human starting at approximately 344 CSS pixels.
2. P2 — The shared shell displayed only the cream SVG background because the SVG referenced an external PNG that did not render as a nested image. Fixed by generating self-contained optimized mark assets and using the visible WebP in the shared header/footer. Post-fix capture shows the Dudley mark next to the wordmark.

## Findings

No actionable P0, P1, or P2 findings remain.

## Follow-up polish

No P3 item is required for launch. The directional mock is intentionally not copied pixel-for-pixel because the live site carries more factual product detail, accessible actions, and current release status.

## Final result

final result: passed
