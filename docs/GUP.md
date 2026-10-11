# Gamers Ultra Plus

A two-page GUP storefront using HTML, CSS, and vanilla JavaScript. No packages, framework, or build step are required.

## Run locally

Keep the folder together. From the portfolio root, run:

```sh
python -m http.server 8000
```

Open `http://localhost:8000/page/gup/` for Home or `http://localhost:8000/page/gup/browse/` for Browse. Use a server for directory navigation and reliable shared cart/favorites storage. Opening an HTML file directly remains useful for a single-page preview, but storage support depends on the browser.

Google Fonts supplies Inter and Barlow Condensed online; local fallback fonts work offline.

## GitHub Pages

Copy the **contents** of `jacks_portfolio`, including `.nojekyll`, into your repository's publishing folder. In GitHub, choose that branch and folder under **Settings → Pages → Deploy from a branch**. Publish from the repository root or place the contents in `/docs` and select that folder. The archive itself is not a publishing source.

The entry points are `page/gup/index.html` and `page/gup/browse/index.html`. Internal navigation uses directory URLs: `/page/gup/` and `/page/gup/browse/`, or `/<repository>/page/gup/` and `/<repository>/page/gup/browse/` for a project site. The browser address bar does not show HTML filenames during navigation. If an explicit `index.html` URL is opened over HTTP(S), JavaScript normalizes it to the directory URL while retaining the query and fragment.

Links and assets use paths relative to each page. JavaScript resolves catalogue paths from the body's `data-site-root` (`./` on Home, `../` on Browse), so a custom domain and a repository subdirectory both work. On future pages, set that attribute to the relative path back to the GUP project root. `.nojekyll` keeps the published files as plain static content. No deployment has been performed.

## Where to edit

Paths below are relative to `page/gup/`, unless specified otherwise.

| File | Responsibility |
| --- | --- |
| `index.html` | Homepage structure, editorial hero, navigation, footer, and dialogs |
| `browse/index.html` | Browse structure, facets, collection controls, and sorting |
| `assets/css/base.css` | Design tokens, reset, typography, shared buttons, and page entrance |
| `assets/css/header.css` | Header, utilities, search, and mobile drawer |
| `assets/css/products.css` | Collection controls, cards, heart states, and empty results |
| `assets/css/home.css` / `browse.css` | Page-specific layouts, loaded only on their owning page |
| `assets/css/dialogs.css` / `footer.css` | Product/cart/information dialogs and footer/newsletter layout |
| `assets/css/accessibility.css` | Hidden content, touch controls, forced colours, and reduced motion; loaded last |
| `assets/js/core.js` | DOM, currency, storage, motion, and site-path helpers |
| `assets/js/catalog.js` | Single source of product data |
| `assets/js/products.js` | Product normalization, card rendering, and homepage details |
| `assets/js/favorites.js` / `cart.js` | Their own saved state, validation, controls, and rendering |
| `assets/js/collection.js` | Tabs, search, facets, sorting, result transitions, and URL state |
| `assets/js/dialogs.js` | Native dialog opening, animated dismissal, and focus restoration |
| `assets/js/mobile.js` | Drawer interaction, swipe dismissal, and responsive hero action placement |
| `assets/js/site.js` | Information panels, newsletter feedback, year, and controller initialization |
| `assets/images/` / portfolio `assets/licenses/` | Four used WebP images and the shared Tabler icon licence |
| `tools/check_project.py` (portfolio root) | Repeatable source, route, and asset integrity checks |

Keep HTML structure, CSS styling, and JavaScript behaviour separate. Responsive rules belong beside their component. The ordered `defer` scripts share one `window.GUP` namespace: keep `core.js` first and `site.js` last. Update both pages and the checker's `GUP_SCRIPT_ORDER` if dependencies change. The shared `assets/js/site.js` normalizes directory URLs for all portfolio pages.

## Catalogue and product destinations

Add a JSON-compatible record to `GUP.catalog` in `assets/js/catalog.js`, and put its image in `assets/images/`. Both pages render it automatically; no duplicated card HTML is needed. Paths in the catalogue are relative to the project root.

| Field | Value |
| --- | --- |
| `id` | Unique stable lowercase identifier, such as `wild-atlas`; used by cart and favorites |
| `href` | Future directory route, such as `products/wild-atlas/`; defaults to `products/<id>/` |
| `name`, `description`, `type` | Product name, details, and displayed style |
| `price` | Numeric USD price |
| `collection`, `keywords` | Space-separated collection tags (`new`, `featured`, `popular`) and search terms |
| `category` | Lowercase game-style key; filter options are generated automatically |
| `bookType` | Optional `rulebook`, `lorebook`, or `charactersheets`; omit for other products |
| `players`, `time`, `age` | Display text, such as `2–4`, `45–60`, and `10+` |
| `minPlayers`, `maxPlayers`, `maxTime` | Numeric filter values consistent with the display text |
| `stock`, `badge` | `in` or `out`; optional badge text |
| `image`, `imageAlt`, `width`, `height` | Artwork path, description, and intrinsic pixel dimensions |

Browse images and titles link to dedicated product routes. Those pages remain intentionally unbuilt; add a future page at `products/<id>/index.html` when ready. Homepage details retain their modal. Update the separate hero's copy, image, and `data-product` in `index.html` to change its featured game.

## Preserved behaviour

Browse has **All games** and **Favorites (N)** tabs. Sort by remains beside them with an automatic left margin and wraps below them on small phones. Search, facets, favorites, and sorting combine; Clear all resets the collection. Settings persist in the URL, and header/footer collection links still select New Arrivals, Popular Games, or Recommendations. The stock checkbox stays above the dropdowns, results use `N Games Found`, and cards show only unavailable stock labels beside their prices.

The four existing games have no book classification. Specific Book type selections therefore show no results until corresponding records are added. Playtime filtering uses the upper end of each game's duration range.

Hearts remain separate buttons within the image area, with default `#bf5260`, hover `#e0314b`, and pressed/saved `#a1162b` states. Favorites persist and synchronize between browser tabs; the header shortcut stays hidden on Browse and visible elsewhere. Cart and favorites storage keys are unchanged. Invalid entries are ignored; blocked storage falls back to the current visit.

| CSS viewport width | Layout |
| --- | --- |
| 320–479px | One product/filter column; sort controls wrap |
| 480–767px | Two product/filter columns; stacked hero |
| 768–1079px | Two columns; hero image and action in the right column |
| 1080px and above | Desktop navigation and layout |

320px remains the minimum supported design width. Below 1080px the header is sticky, numeric utility badges are hidden visually, and Browse facets sit above products. The full-width mobile drawer slides from/to the left and supports its close button, Escape, backdrop dismissal, and a predominantly horizontal left swipe over 64px. Vertical scrolling, pinch zoom, focus restoration, and reduced-motion support remain available.

Browse is the mobile drawer's live page link. New Arrivals, Popular Games, and Recommendations remain disabled placeholders; Account opens its existing demonstration panel. The homepage hero action moves below the image on mobile/tablet and returns to the copy on desktop. Product images retain `object-fit: cover`; the mobile details image uses `height: clamp(240px, 36dvh, 360px)` with a smaller cap on short landscape screens, inside the existing reduced-size scrollable modal.

## Checks and scope

With Python 3.10+ and Node.js installed, run:

```sh
python tools/check_project.py
```

The checker validates HTML nesting, IDs, labels/ARIA, directory routes and fragments, relative asset paths, script dependency order, catalogue values, image dimensions, asset use, CSS block balance, and JavaScript syntax. Future product routes are format-checked but not required to exist.

The integrated portfolio passed source checks, GUP DOM simulations, and HTTP checks at both a site root and a repository prefix. See [the current validation record](VALIDATION.md) for exactly what was tested and its limitations.

Browser/device visual and gesture verification remains pending; these source and simulation checks do not replace it. Before publishing, review both pages on phone, tablet, and desktop with touch and keyboard input.

Dedicated product pages, accounts, newsletter delivery, checkout, payments, and support services remain outside this fictional storefront prototype. No new business features have been added.

Reference documentation: [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site), [ordered script loading](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-defer), [native dialogs](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element), [CSS object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/object-fit), [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), [Pointer Events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events), and [touch-action](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/touch-action).
