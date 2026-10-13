# Jaqweal Holit — Web Design Portfolio

**Current version: v4.1.0**

My portfolio brings together selected web design work focused on content organization, information architecture, visual hierarchy, navigation, and interaction design. It includes a real-world website redesign and two independent prototypes, with case studies explaining the problem, my contribution, the design decisions, and the observable changes.

The site pairs concise case studies with working project pages so visitors can read the reasoning and explore the resulting interfaces. It also introduces my background, capabilities, tools, and contact information.

## Featured work

| Project | Type | What to explore |
| --- | --- | --- |
| 01 — Software Developer Portfolio | Real-world website redesign | Jon Buresh's portfolio, redesigned from a limited brief to prioritize three featured games, clarify project information, and bring supporting work, experience, and contact into one page. |
| 02 — Gamers Ultra Plus | Independent storefront redesign | A responsive retail prototype built around game discovery and comparison, with search, filters, product details, and a demonstration cart. |
| 03 — HOLIX Ai | Independent AI workspace concept | An interactive interface exploring how navigation, files, projects, tools, and controls can support a familiar chat experience without overwhelming it. |

## Developer portfolio mobile navigation — 13 October 2026

Below 1080px, the Software Developer Portfolio header stays at the top while scrolling. A Menu dropdown replaces the former Contact position and contains Selected Work, About the Developer, Contact Me, and GitHub with identical link styling. Desktop navigation and its Contact button retain their original appearance. Section links account for the sticky header; the dropdown supports native touch/keyboard activation, Escape, and outside dismissal.

GitHub sits immediately below Contact Me in the mobile dropdown. Returning to this project after following one of its GitHub links closes the menu and resets the page to the top, including tab/window return and browser Back. A temporary marker in session storage supports page reloads when storage is available.

Source checks, 189 targeted navigation assertions, 128 GitHub-return assertions, and 182 root/prefix HTTP requests passed. Native dropdown rendering and physical-device checks remain pending; see [validation](docs/VALIDATION.md).

## Code cleanup — 13 October 2026

- Standardized project source folders: project HTML stays at its existing directory URL, with local CSS and JavaScript under each project's `assets/`. Homepage responsive rules are now separate from its base styles.
- Split HOLIX Ai into focused stylesheet and script controllers for navigation, workspace/composer, AI Tools, shared helpers, and TouchEvent handling. Deferred script order is checked automatically.
- Removed unused HOLIX styles, obsolete scrollbar code, overwritten declarations, and redundant developer-portfolio media rules while retaining the existing layouts and breakpoint values.
- Stabilized touch cancellation, focus during layout changes, composer focus styling, Browse history/search timing, and clipboard feedback. GUP's hero and catalogue share one product-details listener.
- Preserved all page text, 21 image assets, licences, directory routes, the fixed-width mobile prompt, and the Home / Browse / Account menus. The site still needs no build step.

Source checks, 1,268 DOM/event assertions, and 180 local HTTP page/asset requests passed. Rendered-browser and physical-device checks remain pending because a browser could not be installed in this environment. See [validation](docs/VALIDATION.md) and [integration guidance](docs/INTEGRATION.md), especially the obsolete-file deletion list.

## Mobile AI Control Center — 12 October 2026

Across mobile/tablet widths through 1366px, AI Control Center contains touch-operated category headings for HOLIX Hub (Connected Apps, Data Controls), Tasks Assistant (Overview), and Coding & Design (Overview). Lists start collapsed and only one opens at a time. TouchEvents handle right-to-open/left-to-close swipes and menu taps; keyboard/mouse buttons remain available. Submenu feedback is temporary, without persistent selected styling. Workspace Search is temporarily inactive, and New chat is icon-only without the footer divider. Your Projects, File Library, and Active Chats retain their mobile destinations. Wider desktop behaviour is preserved.

GUP's Home and Browse mobile menus use TouchEvents for rightward opening, leftward closing, and temporary tap feedback below 1080px. Both side menus contain Home, Browse, Account in that order. The visible hamburger is removed; a keyboard/screen-reader opener remains. See [GUP notes](docs/GUP.md) for interaction and validation details.

## HOLIX Ai tools navigation — 12 October 2026

Wider desktop uses HOLIX Hub, Task Assistant, and Code & Design as expandable menu options, with a blue active state and nested settings items. The existing app list and filters live in Connected Apps; Data Controls and the two Overview pages remain starter pages. Mobile uses the tap-operated headings listed above. See [validation notes](docs/VALIDATION.md) for checks and visual-verification limits.

## HOLIX Ai mobile workspace — 12 October 2026

HOLIX Ai now uses its redesigned workspace across all mobile/tablet width bands through 1366px: a chat-title header, full-width swipe menu, Leonardo's profile row, New chat at the menu's bottom left, and model controls that animate with composer focus. Menus reset on exit and back/forward navigation. The wider desktop layout remains intact. Source and DOM/event checks passed; rendered-browser and physical-device verification remain pending.

The mobile conversation fills the available viewport. Prompt controls collapse their row and gap when unfocused, expand when the composer receives focus, and restore the conversation space when focus leaves. The prompt keeps its available width as the controls appear. GUP's New Arrivals, Popular Games, and Recommendations links/placeholders are removed from both pages' header, mobile menu, and footer; the side menu now contains Home, Browse, and Account.

## Responsive alignment — 12 October 2026

HOLIX Ai, GUP (Home and Browse), and the Software Developer Portfolio now follow the portfolio's width breakpoint family: 1366px, 1079px, 767px, and 479px. Their layouts and visual styles remain project-specific. HOLIX Ai's later mobile workspace redesign uses the 1366px upper bound for every mobile/tablet band. See [validation notes](docs/VALIDATION.md) for the changes and verification limits.

## What's new in v4.1.0

- Added a real-world redesign: Integrated the Software Developer Portfolio showcase and its case study into the portfolio.
- Updated the featured project and order: Software Developer Portfolio now leads the homepage as the featured project and Project / 01, followed by GUP as Project / 02 and HOLIX Ai as Project / 03.
- Refreshed project previews: Added the developer portfolio preview and replaced GUP and HOLIX Ai previews with updated screenshots, stored as lossless WebP images.
- Unified return navigation: All three project pages now include “← Back to selected work,” linking directly to their corresponding homepage case study.
- Removed presentation guides: Removed GUP's walkthrough and HOLIX Ai's yellow focus effect and related controls, leaving the case studies and interfaces to present the work.
- Cleaned up the codebase: Removed unused code and assets, simplified the folder structure, aligned file naming, and refined existing interaction code.
- Added HOLIX Ai phone and tablet layouts: Removed the larger-device-only notice, introduced a labeled phone menu and compact tablet navigation, and adapted the conversation, composer, tools modal, and contextual panels.
- Refined responsive layouts: Improved smaller-screen navigation, product grids, dialogs, cart rows, and footer layouts in GUP, plus project titles, facts, experience, and navigation in the developer portfolio.
- Strengthened accessibility: Improved heading structure, skip links, field labels, keyboard focus and focus return, dialog dismissal, live feedback, reduced-motion behavior, and forced-color support, targeting WCAG 2.2 Level AA.
- Organized project source files: Placed each project's styles and scripts beside its HTML, separated responsive styles, and centralized shared accessibility utilities. Reformatted HTML and CSS and removed redundant declarations and unused style tokens.
- Refined interactions and repaired UI issues: Simplified HOLIX panel states and focus containment, batched frequent layout updates, and cached GUP elements and search records. Fixed desktop composer focus visibility, inconsistent sidebar portrait sizing, chat-list overflow handling, and stale clipboard success feedback.
- Prepared the project for further development: Added editor formatting conventions, extended source checks, and documented integration and validation. Preserved page URLs, content, and all 21 referenced image assets without adding a build dependency.

## GUP integration and cleanup — 10 October 2026

- Replaced the older single-page GUP with the supplied two-page project at `page/gup/` and `page/gup/browse/`, including its current artwork, catalogue, filters, favorites, and cart.
- Kept “Back to selected work” on both GUP pages, returning to the existing GUP case study.
- Removed superseded portfolio CSS/JS copies and unreferenced GUP sources. The storefront is self-contained under `page/gup/assets/`; shared icon licences remain in `assets/licenses/`.
- Changed internal return links to directory URLs and added one shared URL-normalization script. An explicit HTTP(S) `index.html` visit becomes the same directory URL, preserving query strings and fragments.
- Extended the source checker to cover both storefront pages, GUP script order and catalogue data, image dimensions, JavaScript syntax, clean internal URLs, and unused CSS/JS/media.

Source checks, GUP DOM interaction simulations, and 110 local HTTP requests across site-root and repository-prefix layouts passed. Browser rendering, real-device, and assistive-technology verification remain pending. Browse product-page destinations remain intentionally unbuilt as in the supplied GUP project. See [validation notes](docs/VALIDATION.md) and [GUP editing guidance](docs/GUP.md).

## Built with

HTML, CSS, and vanilla JavaScript. The site requires no package installation or build step. AI-assisted implementation supports the workflow, with design direction, content, hierarchy, and interface refinement guided manually.

## Repository layout

| Path | Contents |
| --- | --- |
| `index.html` | Portfolio homepage, case studies, capabilities, About, and contact |
| `page/` | Project HTML with local `assets/css/` and `assets/js/`, GUP’s Browse route, and the earlier About redirect |
| `assets/css/` | Homepage base/responsive styles and shared accessibility, motion, and return-navigation styles |
| `assets/js/` | Homepage email-copy interaction and shared directory-URL normalization |
| `assets/images/` | Project previews, artwork, portraits, branding, and favicons |
| `assets/licenses/` | Third-party icon licenses |
| `docs/` | Change history, accessibility notes, validation results, and integration guidance |
| `tools/` | Dependency-free source and local-reference checks |
| `.editorconfig` | Shared text formatting conventions for future edits |
| `.nojekyll` | GitHub Pages configuration for publishing the static folder directly |

## Local checks

From the repository root:

```sh
python -m http.server 8000
```

Open `http://localhost:8000/`. With Python 3.10+ and Node.js available, run:

```sh
python tools/check_project.py
```

The published site needs no Node.js, Python, package installation, or build step.

## GitHub Pages

Put the **contents** of this folder in the repository’s selected publishing folder; keep `index.html` and `.nojekyll` at that level. For a branch deployment, select the branch and root folder under **Settings → Pages**. Use a review branch before merging into `main`.

Internal routes use directory URLs, so navigation shows `page/gup/` and `page/gup/browse/` rather than HTML filenames. Relative paths support both a custom domain and GitHub Pages’ repository prefix. Explicit `index.html` visits are normalized when JavaScript is available; filenames remain normal source files in GitHub. No GitHub commit, merge, or deployment has been performed.

Follow [integration guidance](docs/INTEGRATION.md) so deleted files do not remain as stale copies when applying the ZIP. GitHub’s [current static-site guidance](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) covers entry points, publishing sources, and `.nojekyll`.
