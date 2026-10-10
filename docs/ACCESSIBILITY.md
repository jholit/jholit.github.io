# Accessibility implementation notes

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

## Contrast samples

Calculated using the WCAG relative-luminance formula on source colour pairs. These samples do not measure pixels over photographs, gradients, opacity, or every interaction state.

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
