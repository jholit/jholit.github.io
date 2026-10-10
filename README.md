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

Source, syntax, preservation, and isolated interaction checks passed. Visual browser, real-device, and assistive-technology verification remain pending; WCAG conformance has not been established. See [validation notes](docs/VALIDATION.md).

## Built with

HTML, CSS, and vanilla JavaScript. The site requires no package installation or build step. AI-assisted implementation supports the workflow, with design direction, content, hierarchy, and interface refinement guided manually.

## Repository layout

| Path | Contents |
| --- | --- |
| `index.html` | Portfolio homepage, case studies, capabilities, About, and contact |
| `page/` | Individual project pages with their own styles and scripts, and the compatibility redirect for the earlier About page |
| `assets/css/` | Homepage styles and shared accessibility, motion, and return-navigation styles |
| `assets/js/` | Homepage email-copy interaction |
| `assets/images/` | Project previews, artwork, portraits, branding, and favicons |
| `assets/licenses/` | Third-party icon licenses |
| `docs/` | Change history, accessibility notes, validation results, and integration guidance |
| `tools/` | Dependency-free source and local-reference checks |
| `.editorconfig` | Shared text formatting conventions for future edits |
| `.nojekyll` | GitHub Pages configuration for publishing the static folder directly |
