# Integration guidance

This archive is the complete updated portfolio. Extract it locally and copy the **contents** of `jacks_portfolio` into the existing repository’s publishing folder on your review branch. Keep the repository’s `.git` directory and any repository-specific configuration outside this delivered source tree. Preserve unrelated files on your branch.

Copying files over the old tree will not remove obsolete files. Apply the deletions below as well, then review `git diff --stat` and `git diff --check` before committing and merging.

## GUP replacement

Replace the old `page/gup/` directory in full with the delivered one. Home stays at `page/gup/`; the new Browse page is at `page/gup/browse/`. Both return to `#gup-project` on the portfolio homepage. GUP now owns its CSS, JavaScript, catalogue, and four WebP images in `page/gup/assets/`. The shared Tabler licence remains in `assets/licenses/`.

The following old GUP files are replaced by its component styles and controllers:

- `page/gup/styles.css`
- `page/gup/responsive.css`
- `page/gup/script.js`

## Remove superseded copies

Delete these paths from the old portfolio tree; no delivered page loads them:

- `assets/css/gup.css`
- `assets/css/holix-ai.css`
- `assets/css/software-developer-portfolio.css`
- `assets/css/motion.css`
- `assets/css/project-navigation.css`
- `assets/js/gup.js`
- `assets/js/holix-ai.js`
- `assets/images/gup/` (the current artwork is inside GUP instead)

The new standalone GUP archive also contained unreferenced legacy files: `browse.html`, `assets/css/styles.css`, `assets/css/responsive.css`, `assets/css/motion.css`, `assets/js/app.js`, `assets/js/product-details.js`, and `assets/js/storefront.js`. They are intentionally absent from this integration. Live product-details and bootstrap functions already exist in `products.js` and `site.js` respectively.

## Preserved pages and assets

The homepage, HOLIX Ai, Software Developer Portfolio, the earlier About redirect, and their case-study IDs remain available. Their reading content and artwork are unchanged. Their live CSS and application JavaScript are byte-identical to the supplied portfolio. HTML changes outside GUP are limited to internal directory return links and loading the shared URL-normalization script.

The existing GUP homepage preview and case-study copy are unchanged. No new product pages, business services, deployment workflow, dependency, or framework was introduced. Browse product URLs are intentionally unbuilt in the supplied prototype; this limitation remains documented rather than inventing new pages.

## Editing conventions

- Keep HTML, CSS, and JavaScript in their respective files.
- Edit homepage styles/behaviour in `assets/css/home.css` and `assets/js/home.js`.
- Edit HOLIX and the developer showcase beside their HTML; shared accessibility, motion, and return navigation remain in `assets/css/shared/`.
- Edit GUP’s functional components in `page/gup/assets/css/` and `page/gup/assets/js/`. Responsive rules live beside their component; see [GUP guidance](GUP.md).
- Keep shared directory-URL handling in `assets/js/site.js`. GUP’s own `site.js` handles only its storefront controls and initialization.
- Preserve both icon licence files and follow `.editorconfig`.

## Validation and publishing

Run `python tools/check_project.py` with Python 3.10+ and Node.js. Review [validation notes](VALIDATION.md), including pending rendered-browser checks. The site itself needs no build tools.

For GitHub Pages, publish the folder containing `index.html` and `.nojekyll` as the site root. Internal links use directory URLs and remain relative to support a repository prefix. Do not publish the ZIP as the site entry point. The delivered source is ready for review and merge; no GitHub action was taken on your behalf.
