# Jaqweal Holit — Web Design Portfolio

Static HTML, CSS, and JavaScript. No package installation or build step is required.

## Structure

| Path | Purpose |
| --- | --- |
| `index.html` | Homepage and the three project case studies |
| `page/software-developer-portfolio/` | Software developer portfolio showcase |
| `page/gup/` | Gamers Ultra Plus interactive storefront prototype |
| `page/holix-ai/` | HOLIX Ai interactive workspace prototype |
| `page/jholit/` | Compatibility redirect to the homepage About section |
| `assets/css/` | Page styles, shared motion, and shared return navigation |
| `assets/js/` | Homepage, GUP, and HOLIX Ai interaction code |
| `assets/images/previews/` | Lossless screenshots used on the homepage |
| `assets/images/portfolio/` | Homepage background, portrait, and favicons |
| `assets/images/gup/` | Storefront product artwork |
| `assets/images/holix-ai/` | Workspace portrait |
| `assets/images/software-developer-portfolio/` | Developer branding and game artwork |
| `assets/licenses/` | Existing third-party icon licenses |

The project names match their page folders, stylesheets, scripts, and image groups. The homepage uses `home.css` and `home.js`. Project styles remain separate so they cannot override the homepage or each other. All three project pages share `project-navigation.css` and return directly to their corresponding homepage case study.

## Local preview

From this directory, run `python3 -m http.server 8000` and open `http://localhost:8000/`. Use an HTTP server rather than opening HTML files directly.

## GitHub Pages

Publish **this directory's contents**, including the root `index.html` and `.nojekyll`, from the selected branch and folder in the repository's Pages settings. Do not place the outer `portfolio` folder inside the publishing root. `.nojekyll` keeps the site on the direct static publishing path. Relative asset and navigation links work both at a domain root and beneath a repository subpath.

## Development notes

- Edit case-study copy and project order in the root `index.html`. Project / 01 is Software Developer Portfolio, Project / 02 is GUP, and Project / 03 is HOLIX Ai.
- Edit each prototype's HTML, stylesheet, and script separately. GUP's guided walkthrough content remains in `assets/js/gup.js`.
- GUP preserves the existing `gamers-ultra-plus-cart-v1` local-storage key, demonstration cart, dialogs, search, filters, newsletter feedback, and guided case study. It does not process purchases.
- HOLIX Ai preserves its desktop prototype and existing small-screen notice. Its return navigation remains available on small screens. The composer and sidebar fit the viewport below the shared navigation bar.
- Google Fonts and the developer showcase's employer logos remain external resources. The developer's game manual and Stashery links open their existing external pages. Its email icon remains a display-only placeholder.
- Homepage preview screenshots were encoded as lossless WebP without resizing or changing their pixels. Other artwork is retained.
- Keep the About redirect for older incoming links. Keep the icon license files with the distributed project.

This cleanup does not publish the site or change repository settings. Browser visual testing still requires a local browser; static and interaction-fixture checks do not replace that review.
