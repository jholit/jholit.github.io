# Accessibility implementation notes

The 13 October cleanup clears stale composer-control focus styling when focus moves to the prompt, cancels pending HOLIX taps on context menus, and returns focus to a visible category heading when responsive navigation moves. Existing input-method focus treatment and the requested desktop tools selection treatment remain. See [validation](VALIDATION.md) for current checks and rendering limits.

HOLIX's mobile composer controls now collapse their layout height and gap when unfocused and expand on composer focus, keeping the workspace fitted to the available viewport. Moving focus into model/settings controls preserves the expanded state; moving it outside restores the conversation space and makes hidden controls inert. Existing keyboard-height tracking, safe-area padding, and reduced-motion treatment remain. GUP's removed category links are absent from both visual navigation and keyboard/screen-reader navigation.

GUP's mobile menu uses right-to-open and left-to-close TouchEvent gestures, with temporary menu touch feedback and activation on release. Scrolling, cancellation, extra fingers, and context menus abandon pending taps. The visible hamburger has been removed; a visually hidden native opener remains for keyboard and screen-reader access and is shown on keyboard focus. Close and Escape remain available. Swipe dismissal restores focus to main, while keyboard dismissal returns to its opener. GUP's desktop wordmark/home navigation and native modified-link behaviour remain.

HOLIX Ai focus indicators now follow input method: mouse/touch/pen interactions hide accessibility outlines, while Tab and keyboard widget navigation retain visible focus. This applies across HOLIX's mobile and desktop layouts. Normal text-entry feedback and composer focus animations remain. See [validation notes](VALIDATION.md) for source/DOM checks and the remaining rendered-browser verification limit.

On mobile, AI Control Center uses native buttons inside h3 category headings, with matching expanded/control states and mutually exclusive settings panels. Settings items open their matching dialogs. A native icon-only close button dismisses the drawer; New chat retains its accessible name after its visible label was removed. Mobile workspace Search uses native disabled state. Keyboard Escape still dismisses the drawer, and layout changes keep focus available.

Mobile menu touches activate on touchend rather than on initial contact. Moving a finger, touch cancellation, multi-touch, and history/layout resets clear pending activation and temporary feedback. Keyboard/mouse clicks remain available. Submenu buttons use transient feedback only, with no persistent selected styling; aria-current still identifies the selected settings screen for assistive technology. Menu text uses the shared default colour and #fff during touch feedback, without borders. Expanded main headings keep their existing background to identify the open submenu.

Right swipes from the mobile conversation/title open the drawer, and left swipes within it close it. Native tap/keyboard controls remain alternatives to gestures. Vertical panning, pinch zoom, and editable controls retain their native behaviour. Swipe dismissal returns focus to the title; cancelled or multi-touch gestures do not change menu state. The compatibility click after a swipe is consumed without discarding a fresh intentional touch.

Desktop AI Tools navigation uses labelled disclosure buttons, current-category/page states, keyboard item navigation, and hidden/inert inactive pages. Mobile page selection opens and focuses the matching settings dialog; desktop Escape collapses a submenu before closing the tools modal.

The current desktop tools navigation temporarily omits menu-button focus outlines and borders at widths above 1366px, as requested. Keyboard navigation remains functional; mobile and non-navigation focus styling retain their previous behaviour.

The target is [WCAG 2.2 Level AA](https://www.w3.org/TR/WCAG22/). This is an implementation pass with source and isolated interaction validation, not a conformance certification. Browser rendering, assistive technology, and real-device checks remain required.

| Area | Implementation |
| --- | --- |
| Text alternatives and structure | Existing image descriptions retained; decorative images use empty alternatives; one page heading per content page; developer project headings corrected without changing their desktop styling. |
| Navigation and keyboard | Skip links and focusable main targets on every content page; keyboard-scrollable HOLIX conversation; labelled phone menu; Escape dismissal; shared focus containment and return for the phone menu and tools modal; repaired desktop composer focus reveal. |
| Names and states | Explicit field labels, named icon controls, expanded/pressed/checked states, and inert closed panels. |
| Feedback | Search result counts, clipboard success/failure, cart feedback, chat lifecycle status, and explicit microphone/message demonstration feedback. |
| Contrast and focus | Stronger HOLIX muted text and solid cyan focus; clearer text-entry boundaries; stronger GUP input focus and newsletter control colour. |
| Reflow and touch | Layout rules for compact tablets and phones, including 320px widths; wrapping navigation; single-column small-phone catalogue; compact controls generally use 44px targets. |
| Preferences | Reduced-motion support; forced-colour borders/focus; enlarged editable field text in compact/touch layouts; no orientation lock. |

Existing prototype limits remain: GUP does not place orders or submit newsletter addresses; HOLIX does not connect to AI services, upload files, or record audio. Its File Library and My Projects buttons remain navigation previews.

## Historical contrast samples (before the GUP replacement)

These samples belong to the earlier portfolio validation. GUP-specific samples have not been recalculated for the incoming replacement. Calculated using the WCAG relative-luminance formula on source colour pairs. These samples do not measure pixels over photographs, gradients, opacity, or every interaction state.

| Pair | Ratio |
| --- | ---: |
| Homepage muted text on raised surface | 6.22:1 |
| Homepage primary button text | 14.26:1 |
| GUP secondary text on paper | 5.66:1 |
| GUP primary button text | 5.24:1 |
| GUP hovered primary button text | 4.92:1 |
| GUP footer links | 9.55:1 |
| HOLIX muted text on overlay surface | 6.15:1 |
| HOLIX focus on overlay surface | 8.90:1 |
| HOLIX input boundary on overlay surface | 3.21:1 |
| GUP search input boundary | 3.43:1 |
| Developer muted text on paper | 5.67:1 |
| Developer blue heading on paper | 5.08:1 |
| Developer muted text on dark section | 9.68:1 |

Verify rendered contrast over artwork and all hover/focus/open states before making a full conformance claim.

## Relevant guidance

- [Reflow, SC 1.4.10](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- [Target size, SC 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- Keyboard access, focus visibility and order, names/roles/states, and status messages are covered by the linked WCAG recommendation.

## GUP replacement — 10 October 2026

The incoming GUP retains its own accessibility stylesheet, labelled fields, native dialogs, favorites states, reduced-motion handling, and responsive touch rules. Shared return navigation is loaded on both pages. Current source and simulated interaction checks are described in [VALIDATION.md](VALIDATION.md); these are not rendered contrast checks or conformance certification.
