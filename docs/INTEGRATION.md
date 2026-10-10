# Integration guidance

Copy the updated folder contents into the existing repository, including changed HTML, relocated styles/scripts, shared accessibility styles, `.editorconfig`, and `.nojekyll`. Use a review branch for the next step. Both requested passes are complete; this work does not include a commit, merge, or deployment.

## File moves

| Previous path | Current path |
| --- | --- |
| `assets/css/gup.css` | `page/gup/styles.css` and `page/gup/responsive.css` |
| `assets/js/gup.js` | `page/gup/script.js` |
| `assets/css/holix-ai.css` | `page/holix-ai/styles.css` and `page/holix-ai/responsive.css` |
| `assets/js/holix-ai.js` | `page/holix-ai/script.js` |
| `assets/css/software-developer-portfolio.css` | `page/software-developer-portfolio/styles.css` and `page/software-developer-portfolio/responsive.css` |
| `assets/css/motion.css` | `assets/css/shared/motion.css` |
| `assets/css/project-navigation.css` | `assets/css/shared/project-navigation.css` |

The homepage styles and script remain in `assets/css/home.css` and `assets/js/home.js`. `assets/css/shared/accessibility.css` is new. Update any references in branches outside this ZIP if they still point to moved assets. All HTML inside this ZIP already uses the current paths.

## Routes and content

The homepage, all three project routes, case-study fragment IDs, and `page/jholit/` redirect remain available at their supplied URLs. Relative links support GitHub Pages repository subpaths. Images keep their supplied paths and bytes. Case-study copy and project content remain intact, apart from removing the HOLIX small-screen warning and clarifying prototype control feedback.

## Editing conventions

- Put project structure and content in its `index.html`.
- Put desktop foundations and page-specific accessibility treatments in `styles.css`.
- Put device layouts and page-specific preference queries in `responsive.css`.
- Keep behaviour in `script.js`; the developer portfolio does not require a script.
- Keep shared styles in `assets/css/shared/` and images in their named asset folders.
- Load shared accessibility styles last. Avoid copying controls to create mobile versions; HOLIX reuses the original controls and moves its new-chat button between containers.
- Keep shared visually hidden, text sizing, touch, and reduced-motion utilities in the accessibility stylesheet. Page-specific focus colours and preference treatments remain beside the page.
- Edit HOLIX panel states through `setDisclosureState`, focus containment through `trapFocus`, and frequent layout updates through `oncePerFrame`. Avoid separately changing the same panel’s class, ARIA state, or inert state.
- GUP caches static elements in `ui` and derives searchable product records at startup. Product content continues to come from HTML; dynamic cart rows use delegated events and text-safe DOM creation.
- Follow `.editorconfig`. Use readable source rather than a minified development copy; a future deployment pipeline can handle compression independently.

## Before merging

Run the documented source checks, then complete the browser/device review in `VALIDATION.md`. Compare desktop pages with the supplied design, test repository-subpath hosting, and retain the existing licence files. A successful static check cannot establish layout quality or WCAG conformance.
