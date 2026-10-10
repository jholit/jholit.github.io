# Validation record — 7 October 2026

## Completed checks

| Check | Result |
| --- | --- |
| Five HTML documents | Passed structural parsing, balanced elements, unique IDs, language, viewport metadata, local references, explicit button types, search targets, and static JavaScript ID targets. The fifth document is the existing About redirect. |
| Four content pages | Passed main-landmark, single-page-heading, skip-link, image-alternative, field-label, ARIA-reference, and new-tab-link source checks. |
| JavaScript | All three application scripts passed `node --check`. |
| CSS and assets | Balanced blocks and local CSS asset references passed. All 21 images are referenced and retain their original bytes. |
| HTML/content preservation against step one | All five documents retain the same element attributes and normalized reading content after formatting. Public routes and local asset paths remain the same. |
| Stylesheet comparison against step one | Compared final declarations by selector, property, and media condition across each page’s stylesheet load order. Differences are limited to shared utility consolidation, unused token removal, chat-list overflow, the composer focus-selector repair, and the portrait flex-basis repair described below. Selector and media-query order were retained; overridden declarations were pruned in place. This is source analysis, not a computed-style or pixel comparison. |
| Homepage isolated interaction fixture | Clipboard success/failure and clearing stale success styling on a failed repeat copy passed. |
| GUP isolated interaction fixtures | Search/filter results and live count, stock state, cart add/quantity/remove, dialog focus return, and newsletter feedback passed. Malformed/blocked storage, unavailable/unknown products, invalid quantities, the 99-copy cap, and the normal-motion dialog-close timer fallback passed. |
| HOLIX isolated interaction fixtures | At media states representing 320, 375, 390, 600, 768, 820, 1024, 1080, 1280, 1440, and 1920 CSS pixels: responsive control placement, navigation/search, nested tools-filter Escape dismissal, chat rename/remove, composer feedback, model selection, and microphone feedback passed. |
| HOLIX transition/keyboard fixtures | Phone/tablet/desktop control movement and focus return, released inert backgrounds, tools-modal state across a resize, drawer/modal Tab and Shift+Tab containment, model-menu Escape, and chat-rename cancellation passed. |
| Source contrast samples | Documented text pairs meet 4.5:1; documented focus and input-boundary pairs meet 3:1. |

Isolated fixtures emulate DOM APIs and media-query states. They do not render CSS, run native browser dialogs, establish touch geometry, or replace browser tests. The fixtures were audit tooling; they are not runtime dependencies or included in the publishing folder. The reusable dependency-free source checker is included in `tools/check_project.py`; syntax-check commands are in the README.

## Reviewed cleanup differences

- The stronger desktop hidden-composer selector previously overrode the focus-reveal rule. The hidden selector now excludes `:focus-within`, allowing the existing default visible state to apply to keyboard use. Compact composer layout rules remain active.
- HOLIX’s portrait container declared 60px width/height but a 6px flex basis. The basis now matches its existing 60px dimensions; this is an intentional repair to the desktop sidebar sizing artifact.
- The chat list no longer depends on a greater-than-five-items JavaScript branch that could never run under the existing one-new-chat limit. CSS bounds the list and permits scrolling when its content needs more room.
- Shared visually hidden styling also handles GUP’s existing `sr-only` class. The deprecated duplicate `clip` declaration was removed; `clip-path` remains. Redundant page-level preference/utility declarations were removed while retaining GUP’s distinct no-animation treatment.
- Reading content, imagery, colours, typography, cart persistence format, public URLs, and prototype scope remain intact. No build system, framework, deployment, or service integration was added.

## Outstanding visual and device review

Automatic approval review rejected access to the local browser preview, so no browser screenshots, pixel comparisons, automated browser accessibility scan, or device visual results are claimed.

Before merging, check every content page in a current Chromium browser, Firefox, and Safari:

1. Test 320, 375, 390, 600, 768, 820, 1024, 1080, 1280, 1440, and 1920 CSS-pixel widths, plus phone/tablet landscape. Confirm no clipped content or unintended horizontal page scrolling.
2. Compare desktop composition, typography, imagery, and interactions with the supplied version. Check touch tablets with widths above 1080px.
3. Test 200% text enlargement, 400% browser zoom, and WCAG text-spacing overrides. Verify all content and controls remain available.
4. Test HOLIX on iOS Safari and Android Chrome with the on-screen keyboard open; check the toolbar, conversation, composer, drawer, contextual panels, and full tools modal.
5. Use keyboard-only navigation to verify skip links, visible/unobscured focus, drawer/modal containment, Tab/Shift+Tab, Escape, model-menu arrow keys, native dialog dismissal, and focus return. Check viewport changes while a panel is open.
6. Use VoiceOver and NVDA to verify headings, region names, field labels, control states, and live feedback. Run a current accessibility scanner on base pages and open-dialog states.
7. Check rendered contrast over developer artwork, control hover/focus states, and operating-system high-contrast mode. Check reduced motion.
8. Serve under a repository subpath and open each page, preview link, return link, and About redirect. Confirm no missing local requests or runtime errors. External game/social links and remote fonts/logos were retained but not availability-tested.

The ZIP is suitable for the next development/review step. Visual desktop preservation and WCAG AA conformance remain subject to the outstanding checks above.
