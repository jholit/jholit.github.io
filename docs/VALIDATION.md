# Validation record — 10 October 2026

This record covers the supplied GUP replacement integrated into the supplied portfolio ZIP.

## Completed checks

| Check | Result |
| --- | --- |
| Six HTML documents | Balanced nesting, unique IDs, page language, viewport metadata, local references/fragments, explicit button types, labels and ARIA targets passed. Five content pages have one `h1`, one main landmark, a skip link, and image alternatives; the sixth is the earlier About redirect. |
| Source separation | No inline style blocks, style attributes, or HTML event handlers. Live CSS, JS, and media all have references. Superseded sources were removed. |
| All JavaScript | All twelve scripts passed `node --check`: two portfolio scripts, HOLIX’s application script, and nine GUP controllers. |
| CSS and assets | All CSS blocks balanced and local CSS URL references resolved. All 21 images are used; the four GUP catalogue images have matching intrinsic dimensions. |
| GUP dependencies | Both pages load the nine storefront scripts in the required order after the shared URL-normalization script. Body root attributes resolve catalogue images and destinations relative to GUP. |
| GUP catalogue | Stable unique product IDs, finite numeric fields, sensible price/player/playtime values, image existence/dimensions, and future directory-route formats passed. |
| GUP startup and interactions | DOM simulations passed full initialization on Home and Browse, card rendering, favorites persistence, combined facets, search, sorting, URL state, cart add/quantity/remove, invalid stored quantities/products, the 99-copy cap, blocked-storage fallback, dialog dismissal, newsletter feedback, and mobile-menu expanded/open state. |
| Directory URLs | GUP startup simulations passed clean `index.html` normalization and catalogue path resolution at a site root and repository prefix. Internal anchors use directory URLs; external links are preserved. |
| Local HTTP hosting | 110 HTML/asset requests passed with status 200 and exact source bytes, covering both a site-root mount and a `/portfolio/` repository prefix. Slashless Browse requests redirect to its directory URL. |
| Preservation | Homepage, HOLIX, and developer artwork and reading content are retained. Their live CSS and application JavaScript remain byte-identical. GUP retains the incoming live CSS and artwork; changes are portfolio return navigation and shared URL handling. |

DOM simulations emulate APIs and media-query states. They do not render CSS, prove native dialog/touch behaviour, or establish accessibility conformance. The simulation harness and HTTP fixtures are temporary audit tooling, not publishing files or runtime dependencies. `tools/check_project.py` is the reusable source checker.

## Existing prototype destinations

GUP Browse images and titles link to `page/gup/products/<id>/`. Those product pages were intentionally unbuilt in the supplied GUP project, and remain unbuilt. They will return 404 until corresponding pages are added. The checker validates their route format rather than reporting them as existing pages. Home’s product details and demonstration cart remain usable.

Account sign-in, checkout/payments, newsletter delivery, support services, and live HOLIX AI/upload/audio integrations remain outside the supplied prototypes. External links and remote fonts were preserved but were not availability-tested.

## Pending rendered-browser review

No rendered browser results are claimed. Local Playwright had no installed browser binary, and its official browser download returned an environment network-denial response. The alternate cloud-browser preview timed out. No screenshots, pixel comparisons, real-device results, or automated browser accessibility scan were obtained.

Before publishing, review all five content pages in current Chromium, Firefox, and Safari:

1. Check phone, tablet, and desktop widths, including 320px and the GUP 480/768/1080px boundaries. Confirm no clipped content or unintended horizontal scrolling; compare desktop composition with the supplied designs.
2. Test keyboard-only skip links, focus visibility, Tab/Shift+Tab, Escape, modal/drawer dismissal and focus return; resize with panels open.
3. On real phones, test menu swipes, scroll/zoom, landscape, and HOLIX’s on-screen keyboard/composer layout.
4. Check reduced motion, forced colours, text enlargement, browser zoom, and text-spacing overrides.
5. Verify screen-reader headings, names/states, live feedback, and rendered contrast; run an accessibility scan in base and open-panel states.

The archive is ready for source review and merge. Visual preservation and WCAG conformance remain subject to these rendered checks.
