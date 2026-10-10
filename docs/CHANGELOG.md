# Change history

## 7 October 2026 — Step two: source cleanup

Release version remains v4.1.0. Step one is the baseline for this pass.

- Standardised HTML indentation and attribute wrapping, preserving every page element attribute and normalized reading text. Standardised CSS indentation without reordering selectors or media queries.
- Removed 12 declarations overridden by later declarations with the same selector, property, and condition; removed two unused HOLIX tokens. Folded unconditional HOLIX root tokens into one editing location.
- Centralised visually hidden utilities, text sizing, touch behaviour, and duplicated reduced-motion rules. Retained GUP’s distinct no-animation preference treatment.
- Cached GUP’s static elements, image/type references, collection sets, and searchable product text. Retained the existing cart storage format, prices, filtering, animations, and demonstration feedback.
- Reused one HOLIX disclosure-state writer and one focus-containment helper. Avoided repeated closed-panel resets and duplicate close calls. Batched viewport, breakpoint, and scroll updates per animation frame and avoided unchanged viewport-style writes.
- Fixed a selector-specificity conflict so keyboard focus reveals the desktop composer while reading older messages. Matched the desktop portrait container’s flex basis to its existing 60px dimensions, repairing the 6px sizing inconsistency.
- Removed the unreachable greater-than-five chat overflow branch from a demo limited to one new chat; CSS now bounds and scrolls the list when needed. Stopped model-menu Escape from also dismissing another panel. Clear stale clipboard-success styling after a failed subsequent copy.
- Retained the simpler project structure established in step one, all five public HTML paths, all content, all 21 image assets and their original bytes, icon licences, and the existing desktop palette and typography. No new build dependency or framework was introduced.
- Added `.editorconfig`, extended source checks, and updated integration and validation guidance. Expanded isolated interaction checks to 11 media widths, viewport transitions, focus containment, and storage/error cases.

## 7 October 2026 — Responsive and accessibility development pass

Release version unchanged at v4.1.0 pending the next development step.

- HOLIX Ai: replaced the small-screen restriction with a compact tablet rail and labelled phone menu; added focus management and responsive application height; kept the compact composer visible; adapted the tools modal and contextual panels.
- GUP: added wrapping navigation, small-phone catalogue and cart layouts, larger compact controls, live search results, clearer input focus, and labelled account/cart utilities.
- Developer portfolio: corrected heading hierarchy without restyling desktop titles; refined narrow-screen project titles, facts, experience, and navigation.
- Homepage: allowed grid children and headings to shrink; improved compact touch navigation; made clipboard failure feedback include the email address.
- Shared: skip-target focus, field sizing, reduced motion, forced colours, and larger compact return-navigation links.
- Source: colocated project code, split responsive styles, removed unused hidden SVG graphics, documented integration, and added source checks.

## v4.1.0 — Supplied release

- Integrated the Software Developer Portfolio showcase and its real-world case study.
- Put Software Developer Portfolio first, followed by Gamers Ultra Plus and HOLIX Ai.
- Refreshed the three project previews as WebP images.
- Added “Back to selected work” navigation to each project.
- Removed GUP’s presentation walkthrough and HOLIX Ai’s yellow focus effect.
- Simplified existing code and asset naming.
