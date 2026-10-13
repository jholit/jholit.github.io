# Validation record

## GitHub return and mobile link order — 13 October 2026

The developer mobile dropdown is ordered Selected Work, About the Developer, Contact Me, GitHub. Desktop link positions remain unchanged. Following any of this project's GitHub links marks a pending return; once the page loses and regains visibility/focus, or returns through Back/pageshow, the dropdown closes and the page scrolls instantly to the top. The wordmark receives focus, the URL fragment becomes `#top`, and the query string and repository prefix are preserved. The handler waits two animation frames to follow history scroll restoration and resets once per GitHub visit. Ordinary tab switching without a GitHub visit leaves scroll alone.

An optional page-specific sessionStorage marker handles reloads after leaving; blocked storage still supports the same-document/tab and bfcache return paths. Opening a link solely through a browser context menu is outside the click-triggered marker. Native browser lifecycle timing remains unverified under the existing browser limitation.

The source checker and 189 existing navigation assertions passed after the reorder. Another 128 event assertions passed across 390, 1079, 1080, and 1440px with available/blocked storage, covering foreground/background return, blur/focus, Back/bfcache, reload, desktop/mobile/project GitHub links, URL preservation, and reset-once behaviour. References: [MDN pageshow](https://developer.mozilla.org/en-US/docs/Web/API/Window/pageshow_event) and [MDN visibilitychange](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event).


## Developer portfolio mobile header — 13 October 2026

Only the existing phone/tablet header band (`max-width: 1079px`) changes. Its header uses `position: sticky; top: 0`; the logo stays left and a native details/summary dropdown sits at the former right-side Contact position. All four navigation links use one shared mobile style, including Contact Me without a separate pill/border treatment. Desktop base rules are unchanged apart from hiding the mobile disclosure. Section scroll offsets use the compact header's responsive height.

The controller closes the dropdown on an unmodified link selection, outside click, Escape, focus leaving the disclosure, page exit, or breakpoint change. Internal selections move focus to the destination without interfering with its default anchor scroll; modified links retain native behaviour. Native details/summary continues to work when JavaScript is unavailable.

The project source checker passed. 189 DOM/event assertions passed at 320, 479, 480, 767, 768, 1079, 1080, 1366, and 1440px, checking link order/destinations, selection focus and cleanup, Escape/outside/focus dismissal, modified links, and desktop scope. 182 local HTTP page/asset requests passed across root and repository-prefix routes. Comparison confirmed changes are confined to the developer page's four source files and documentation; other projects are untouched. The existing browser-installation limitation still applies, so native disclosure activation, sticky positioning, and rendered dimensions remain source-verified rather than browser-verified.

References: [MDN details](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details), [MDN summary](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/summary), and [MDN positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position).


## Cleanup validation — 13 October 2026

The supplied ZIP was retained separately for comparison. The cleanup preserves all six HTML entry points, page text, 21 referenced image files, both icon licences, and the existing project scope. Image/licence hashes match the original archive; every page's parsed text matches its original.

Completed checks:

- `python tools/check_project.py`: HTML structure, local routes/fragments, field labels, IDs/ARIA, script selector targets, deferred HOLIX/GUP dependency order, catalogue/image dimensions, relative CSS URLs, CSS block balance, JavaScript syntax, and unused assets.
- 1,268 assertions executing the actual page scripts against DOM/event fixtures parsed from the current HTML. HOLIX ran at 320, 479, 480, 767, 768, 1079, 1080, 1366, 1367, and 1440px; GUP Home/Browse ran at 320, 479, 480, 767, 768, 1079, 1080, 1366, and 1440px with both full and reduced motion.
- Simulations cover category/page navigation, modal/filter dismissal, composer/model controls, chat creation/rename/removal, keyboard fallbacks, focus return, swipes and rejected/cancelled/multitouch gestures, compatibility clicks, context-menu cancellation, history/layout resets, favourites, facets/sorting, product details from the hero and grid, cart quantities/removal, Account handoff, and Home navigation. The context-menu cancellation regression fails against the original HOLIX controller and passes after cleanup.
- 180 successful local HTTP page/asset requests with both a site-root layout and a `/repository/` publishing prefix. Both directory entry points and explicit `index.html` files remain available. Existing URL normalization retains queries and fragments.
- Reviewed current WHATWG script-loading guidance, MDN TouchEvent/VisualViewport guidance, and GitHub Pages static-hosting guidance on 13 October 2026.

Limitations: the DOM/event fixture checks do not render CSS, use a native dialog top layer, or generate real browser TouchEvents. No browser executable is installed; browser downloads were rejected by the environment's network restrictions. Consequently, rendered layouts, virtual-keyboard/pinch-zoom behaviour, physical devices, and assistive technologies remain unverified. Google Fonts retains the existing network dependency and local fallbacks. CSS changes remove confirmed-unused rules and redundant declarations or preserve rule order during file extraction; they are source-verified, without a claim of pixel equivalence.

The pre-existing Browse product destinations are intentionally unbuilt, as documented below; cleanup adds no product pages or live business services.

Current references: [WHATWG deferred scripts](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-defer), [MDN Touch events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events), [MDN VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport), and [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).


## Prompt-width containment and GUP Home navigation — 13 October 2026

HOLIX's mobile composer grid through 1366px now explicitly uses grid-template-columns:minmax(0,1fr). The form and input wrapper use min-width:0; the textarea uses min-width:0 and max-width:100% alongside its existing width:100%. This bounds the grid/form/input to the available dock width rather than permitting controls' minimum-content width to widen the implicit grid column. The focus-driven row/gap animation is retained. Desktop styles and JavaScript are unchanged. Width containment is source-verified; browser pixel widths remain unverified under the existing browser limitation.

Both GUP side menus now contain exactly Home, Browse, Account. Home links resolve to the GUP root from either page using ./ or ../, preserving repository-subdirectory hosting. The current Home/Browse link carries aria-current=page. Regenerated fixtures and existing actual-script TouchEvent/dialog checks pass on both pages at the 10 existing widths plus reduced-motion cases. Added checks confirm menu order, Home URL/current-page state, and a completed Home tap closing the menu and navigating exactly once. The six-page project checker passes, and unrelated source bytes/archive inventory are preserved.

## Full-height HOLIX workspace and GUP category-link removal — 13 October 2026

HOLIX previously hid the controls with opacity/visibility but kept their flex row, minimum height, and gap in the mobile layout. Mobile CSS through 1366px now gives the shell/workspace/thread zero flex bases with existing min-height:0 constraints, so the conversation fills the height remaining after project navigation, the chat-title toolbar, and the composer. The composer uses auto/0fr grid rows and zero gap when unfocused; is-selected transitions to auto/1fr and the existing 8px gap. The controls grid item has min-height:0 and clipped overflow when collapsed, with visible overflow when expanded so the model dropdown remains usable. The controls row and gap animate for 220ms. Desktop foundations are unchanged.

The existing focus logic still owns is-selected and the controls' aria-hidden/inert state. Focus within the prompt or its controls reveals them; focus outside collapses them. The existing visualViewport height update keeps the body fitted to the available screen as the mobile keyboard opens/closes; safe-area padding and reduced-motion preferences remain. Added simulation checks repeat three focus/control-focus/blur cycles at each mobile width and resize the visual viewport from 900px to 500px and back, verifying CSS viewport-variable updates and retained/released control state. The full-script HOLIX event suite passes all 11 existing widths. These checks verify state and source rules, not rendered pixel height or native keyboard behaviour.

New Arrivals, Popular Games, and Recommendations links/placeholders are removed from GUP's header/mobile navigation on Home and Browse. Their footer destination links are removed too, including Our picks. Browse/All Games remain and Account keeps its existing dialog. Current HTML fixtures are regenerated; tests assert exact remaining navigation labels and absence of the removed category URLs throughout both pages. The actual GUP mobile/dialog suite passes at its 10 existing widths on both pages plus reduced-motion cases. The project checker passes for all six pages, with original archive inventory and unrelated source bytes preserved.

Native mobile viewport layout, animation pixels, and physical-device keyboard/touch behaviour remain unverified under the existing browser limitation.

## GUP TouchEvents and gesture opening — 13 October 2026

Both GUP pages now omit the visible hamburger button/icon and use right-to-open, left-to-close menu gestures. GUP's existing max-width 1079px mobile layout scope is preserved. A visually hidden native button retains keyboard/screen-reader menu access and appears on keyboard focus. Swiping returns focus to the main content on exit; keyboard entry restores focus to its button. Desktop resizing restores focus to main if the drawer had focus.

The mobile controller tracks Touch.identifier through touchstart/move/end/cancel using touches and changedTouches. Successful gestures exceed 64px and a 2:1 horizontal/vertical ratio. Enabled menu controls receive transient is-touch-pressed feedback on touchstart, activate after movement of no more than 12px on touchend, and prevent duplicate compatibility clicks. Fresh touches and keyboard/modifier clicks remain available. Vertical scrolling, multiple fingers, context menus, cancellation, pagehide/pageshow history restoration, popstate, and breakpoint changes clear pending gestures/feedback. Links can start a swipe without navigating. Search/text controls and other open dialogs block opening gestures. No touchmove default is prevented.

The project checker passed for all six HTML pages. A new simulation runs the actual GUP mobile.js and shared dialogs.js against fixtures parsed from both current HTML pages, exercising animated and reduced-motion close paths. It passed Home and Browse at 320, 479, 480, 767, 768, 1079, 1080, 1366, 1367, and 1440px, plus reduced-motion cases at 768px. Checks cover direction/threshold rejection, opening over a link, closing over Account without activating it, compatibility-click suppression, transient/cancelled/scrolled/disabled taps, Account handoff, single Browse navigation, Close/Escape, keyboard and modified-link fallback, focus return, history/reset/resize, other-dialog exclusion, and responsive hero placement. The preceding controller fails the direct-TouchEvent opening regression. HOLIX source bytes are preserved.

These are source and DOM/event checks. Native top-layer rendering, browser-generated TouchEvents, and physical-device behaviour remain unverified under the existing local-browser limitation.

## Touch events and transient mobile menu feedback — 13 October 2026

The mobile side menu now uses TouchEvent touchstart/move/end/cancel and Touch.identifier tracking for activation and swipes. touchstart applies is-touch-pressed to an enabled button; touchend executes the corresponding action directly after movement of no more than 12px. Movement clears the pending tap/feedback, and vertical movement abandons a swipe. Scrolling and pinch zoom are not prevented. Completed taps/swipes prevent their compatibility click, with a short additional click guard that a new touch clears. Keyboard clicks with detail=0 remain available. Menu feedback/state is cleared on cancellation, extra fingers, drawer closure, history resets, and mobile/desktop layout changes. Active Chats' dynamically created rename/remove controls also receive touch activation.

Header touches toggle one submenu at a time. Sub-option touches open Connected Apps, Data Controls, Tasks Assistant Overview, or Coding & Design Overview. Mobile sub-options retain aria-current for screen-reader location information, but receive no persistent is-selected visual class. Desktop layout synchronisation restores the existing selected class. Mobile menu CSS removes borders/shadows and the nested-list divider, uses the shared text-secondary default colour, and applies the existing accent-cyan-soft background and exact #fff text while touched. The expanded main heading keeps that background to identify its open submenu.

The source checker and full-script DOM/event simulation passed at 320, 479, 480, 767, 768, 1079, 1080, 1280, 1366, 1367, and 1440px. Mobile control tests now dispatch touchstart/end directly without programmatic focus, then test the compatibility click to prove that activation occurs once. Tests cover all menu headers and settings routes, transient feedback, cancelled/moved leaf/header touches, history reset during a touch, keyboard activation immediately after touch, dynamic chat controls, swipe direction/threshold/cancellation, multi-touch, desktop selection restoration, and existing composer/search/filter/reset behaviour. The direct-touch regression fails against the preceding version. CSS treatment is source-verified; colour pixels and browser-generated TouchEvents remain unverified because no local browser is available.

Implementation reference: [MDN Touch events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events).

## Mobile drawer swipe repair — 13 October 2026

The reported opening/closing failure concerned swiping. The previous cleanup left native click handlers for the chat-title and close buttons but removed all drawer gesture handlers; a right or left swipe had no effect. Restored GUP's primary-touch recogniser with a distance greater than 64px and horizontal displacement greater than twice vertical displacement, expanded to open HOLIX on a right swipe and close it on a left swipe across max-width 1366px. Opening surfaces are the conversation and toolbar; closing surfaces are the drawer, including menu buttons. Form controls are excluded. Vertical movement, pointercancel, a second finger, history resets, and breakpoint changes clear the pending gesture. No default touch movement is prevented, and CSS permits vertical panning and pinch zoom on these surfaces and drawer controls. The short compatibility-click guard prevents accidental activation after swiping and is cleared by any new touch.

The full-script DOM/event simulation passed at 320, 479, 480, 767, 768, 1079, 1080, 1280, 1366, 1367, and 1440px. Added cases exercise right opening from conversation and title, left dismissal from a heading button, post-swipe click suppression, immediate deliberate tapping without programmatic focus, threshold/direction/diagonal rejection, vertical movement followed by a horizontal finish, multi-touch/cancel/history/layout cancellation, and no desktop/mouse gesture activation. Existing category/page routing, search/filter, composer, chat, focus and reset tests still pass. The new opening regression fails against the previously delivered script. The project source checker passes; archive inventory and unchanged-project bytes are preserved.

These checks execute the actual script in a DOM/event simulation. No installed browser is available, and network restrictions prevent downloading one; native browser rendering, browser-generated touch events, and physical-device checks remain unverified.

## Mobile control center and native tap interactions — 12 October 2026

All mobile/tablet layouts through 1366px use AI Control Center. The section has a 24px top margin in addition to the drawer's existing spacing, separating it from Search. Its three h3 headings contain native button controls for HOLIX Hub, Tasks Assistant, and Coding & Design. All nested settings lists start collapsed; tapping a heading opens or closes its list, and tapping another heading closes its sibling list. The buttons expose aria-expanded and aria-controls. The four existing settings items still open their corresponding pages.

Custom pointerdown/pointerup swipe detection, gesture coordinate/state tracking, and the 350ms post-swipe click suppression have been removed. Drawer activation and dismissal use native button click activation: the chat-title button opens it and an icon-only close button beside the portrait/name dismisses it. Header and setting actions are committed on click, with no pointer-down activation. Vertical scrolling and gesture cancellation are left to the browser. Pointer-based accessibility input-method tracking remains; composer/sidebar pointer-hover effects are ignored on mobile. History, scroll, menu reset, focus containment/return, composer and chat behaviour remain.

Mobile workspace Search is disabled using native disabled state on its trigger/input plus guards against programmatic opening. The Search placeholder remains visible, with a disabled treatment. Desktop search is re-enabled on layout changes. Connected Apps search and filters are unaffected.

The mobile New chat footer border/divider is removed. Visible New chat copy is deleted; the icon remains inside a 48px square button with its existing Start a new chat accessible name. The mobile close control is 44px square. No visible Close menu row was reintroduced. Wider desktop names, category dropdowns, blue selected state, temporary focus/border treatment, search, and composer are preserved.

The project checker and full-script DOM/event simulations passed at 320, 479, 480, 767, 768, 1079, 1080, 1280, 1366, 1367, and 1440px. New checks cover native click-only header activation (pointer down/up alone does not expand), collapsed defaults, one expanded category, repeated-tap collapse, no custom swipe actions, native close/focus return, icon-only New chat with accessible name, disabled mobile search, restored desktop search and search results, all four settings paths, mobile/desktop layout transitions, source filtering, menu/history resets, composer, chat naming/removal, and focus modality. CSS spacing/footer changes were inspected in source. Delivered ZIP files are checked against the working sources.

Implementation references: [W3C accordion pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/) and [MDN native click activation](https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event). These document heading-button disclosures and device-independent activation rather than custom gesture activation.

These checks do not simulate browser-generated clicks after real touch gestures or render CSS. Physical touch/scroll, typography/spacing pixels, native key activation, and assistive-technology behaviour remain unverified in a rendered browser under the previously documented environment limitation.

## Mobile side-menu headings and labels — 12 October 2026

For every mobile/tablet width through 1366px, the drawer now uses a static AI Tools & Controls h2 heading. Its three h3 category headings are HOLIX Hub, Tasks Assistant, and Coding & Design. Connected Apps and Data Controls remain beneath HOLIX Hub; each other category has Overview. All four settings items are visible when the drawer opens and still route to their matching settings pages. The categories no longer require disclosure taps on mobile.

The previous AI Tools trigger and category disclosure buttons are hidden and unavailable on mobile. The root dropdown arrow was removed from HTML; category arrows are hidden by their parent buttons and an additional mobile-only rule. Headings are non-interactive and do not add tab stops. Mobile keyboard navigation reaches the settings items directly; Escape closes the drawer rather than collapsing the former heading hierarchy.

File Library, Your Projects (renamed from My Projects), and Active Chats stay below the divider in that order. The mobile Projects accessible name matches Your Projects. The Task Assistant and Code & Design settings titles use Tasks Assistant and Coding & Design on mobile. Wider desktop retains its original names, icon trigger, category buttons/arrows, dropdown behaviour, and blue selected state. The shared tools tree still moves between the drawer and desktop modal, with one set of settings controls and IDs.

The project checker and full-script DOM/event simulations passed at 320, 479, 480, 767, 768, 1079, 1080, 1280, 1366, 1367, and 1440px. New checks verify the actual h2/h3 elements and exact mobile labels, hidden mobile category/AI Tools buttons, all settings items immediately available, no visible tools chevrons, Your Projects visible/accessible naming and lower menu order, direct keyboard item navigation/Escape, correct mobile settings title names, all four page routes, menu reopen/scroll handoff, and desktop-name restoration across layout changes. Existing search/filter, desktop selection/dropdown, swipe/history, composer/chat, and focus-modality checks still pass.

These are source and DOM/event checks. Native rendering, typography/spacing pixels, and physical-device touch behaviour remain unverified under the previously documented browser limitation.

## Desktop tools menu selection treatment — 12 October 2026

At desktop widths beginning at 1367px, opening AI Tools starts with collapsed main-menu sublists. Clicking a main category selects its blue visual state and opens that category's items; switching to another category transfers the blue state and closes the previous sublist. Clicking an expanded category collapses it while preserving its selected background. The current settings view does not change until a settings item is chosen.

A dedicated hubActiveMenu value separates the category being browsed from hubActivePage. Selecting a settings item synchronises both. The child's aria-current=page and parent current-page marker still identify the displayed settings view, while the root's selected visual class follows the category click. Keyboard Arrow Up/Down category opening uses the same desktop selection behaviour. Mobile continues to derive its category highlight from the chosen settings page and keeps its existing drawer hierarchy.

Desktop-only CSS removes borders, shadows/inset accent lines, and focus outlines from main and child navigation buttons. The selected main menu keeps its existing blue background even during hover. These temporary focus-outline changes are scoped to tools navigation above 1366px; input/filter/dialog focus styling and mobile focus treatment remain unchanged.

The project source checker and full-script DOM/event simulations passed at 320, 479, 480, 767, 768, 1079, 1080, 1280, 1366, 1367, and 1440px. New desktop checks confirm initially collapsed lists, immediate single-category selected state across Task Assistant/Code & Design/HOLIX Hub clicks, unchanged settings content until item selection, closure of sibling lists, and retained selected state after collapsing/reopening a category. Existing page routing, app filtering, mobile hierarchy, keyboard/reset/resize, composer, chat, and focus-modality checks still pass. Source inspection confirms the style override is confined to min-width 1367px. Rendered colours, hover and focus appearance remain unverified under the previously documented browser limitation.

## Mobile AI Tools hierarchy in the side menu — 12 October 2026

For all mobile/tablet widths through 1366px, the chat-title button opens the existing workspace drawer. Tapping AI Tools now reveals these categories inline below the trigger; tapping a category expands its nested settings items:

| Category | Settings items |
| --- | --- |
| HOLIX Hub | Connected Apps; Data Controls |
| Task Assistant | Overview |
| Code & Design | Overview |

Only tapping a settings item opens the matching content page. AI Tools and category taps do not open the settings modal. Item selection closes the drawer and its dropdowns, selects the target page, opens the modal, and moves focus into the settings dialog. Existing Connected Apps rows/search/filters and the three starter pages are unchanged.

The existing hub-tools-nav tree is relocated into mobile-tools-menu within the drawer on mobile, and returned to the tools modal on wider desktop. This preserves one set of IDs, listeners, and selected-page state. Mobile AI Tools exposes aria-controls=mobile-tools-menu and aria-expanded, without a dialog popup claim; desktop exposes its original modal controls and dialog popup. The drawer owns the nested navigation on mobile, so the settings dialog displays only its selected content view. Category/page current states remain shared.

The inline hierarchy resets when the drawer closes, Search/Active Chats opens, or history resets run. Escape collapses a category, then AI Tools, then the drawer. Arrow Down/Right on AI Tools reveals its categories and focuses the first option. Selecting a settings page or resizing across the mobile/desktop boundary never leaves focus in a hidden/inert menu. The wider desktop tools navigation retains its previous menu/page interaction model.

The project source checker passed. Full-script DOM/event simulations passed at 320, 479, 480, 767, 768, 1079, 1080, 1280, 1366, 1367, and 1440px. The click harness now rejects hidden/inert targets. Tests cover inline AI Tools expansion without a modal, exact category labels, all four settings paths, drawer closure on selection, correct page/category state, single visible independent content view, Connected Apps search/filtering, keyboard category/item navigation, Escape hierarchy, Search handoff, swipe dismissal/reset, history resets, navigation relocation, and active-page preservation across width changes. Existing composer/chat/focus-modality checks still pass.

These are source and DOM/event checks; native touch and visual layout/press/hover behaviour remain unverified in a rendered browser under the previously documented environment limitation.

## AI Tools menu options and pages — 12 October 2026

The AI Tools modal now has three button-based menu options: HOLIX Hub, Task Assistant, and Code & Design. HOLIX Hub contains Connected Apps followed by Data Controls. Connected Apps owns the existing four-app list, connection statuses, search, and All apps/Connected/Not Connected filtering; Application Access is renamed to Connected Apps. Data Controls has its own starter page. Task Assistant and Code & Design each have an Overview item with a starter page. These are independent content views inside the existing modal, not separate website routes.

Menu options have default, expanded, pressed, selected, and fine-pointer hover treatments. A chevron shows expansion. Touch layouts through 1366px use stacked dropdown groups with 44px child targets; choosing an item collapses the group and focuses its parent option. Wider desktop layouts keep the active category expanded. Expansion and current-page state are separate, so opening another dropdown does not falsely identify it as the page being viewed. Only one dropdown is open at a time. The active parent carries aria-current=true; the active child carries aria-current=page.

Inactive views and closed submenus use hidden and inert. All content views are sibling children of the modal layout, so hiding one page cannot hide another. Navigation buttons expose their controlled page or submenu IDs. Arrow Up/Down open a category and navigate its items; Home/End work within a submenu. Escape collapses an open submenu and returns focus to its option, then closes the modal when no submenu/filter is consuming it. Existing input-method focus-ring styling and modal focus containment/return remain. The modal is named AI Tools independently of the currently displayed page.

Closing/reopening the modal returns to Connected Apps. Existing app search/filter values are preserved. Breakpoint changes synchronise dropdown presentation without changing the active page. Wider portfolio/GUP/developer source and assets remain unchanged.

The project checker passed for all six HTML files, local references, IDs/ARIA targets, CSS block balance, JavaScript syntax, accessibility source checks, GUP dependencies/catalogue, and referenced assets. Full-script DOM/event simulations passed at 320, 479, 480, 767, 768, 1079, 1080, 1280, 1366, 1367, and 1440px. Checks include all four page targets, one visible independent view, hidden/inert ancestry, current category/item state, mobile focus/collapse versus desktop expansion, menu switching, keyboard focus movement, Escape behaviour, modal reopen reset, responsive transitions, and preserved app filtering/search/empty state. Existing swipe/history/composer/chat/focus-modality checks still pass.

These are source and DOM/event checks. CSS hover/press appearance, layout pixels, native touch behaviour, and assistive-technology behaviour remain unverified in a rendered browser under the previously documented browser limitation.

## HOLIX Hub simplification on all devices — 12 October 2026

The shared HOLIX Hub markup removes Connected capabilities, all four hub-source-row__detail paragraphs, both conversation-activation checkboxes/labels, both Available to connect/No access granted blocks, and the application count. The heading is Application Access. Figma and GitHub now display Not Connected; the corresponding filter and data keys use not-connected. Google Drive and Slack retain Connected status. These changes apply to mobile, tablet, and desktop.

With conversation-activation controls removed, Select all and its choice instructions were removed too. Their selection/count state, event listeners, initialisers, and unused styles were deleted. Rows retain their artwork, app names, and status badges in one grid column; the obsolete active-selection highlight is gone. The Hub header description, search, filters, modal keyboard/focus handling, current focus-ring input-method behaviour, and empty-state message remain.

The dependency-free project checker passed. Full-script DOM/event simulations passed at 320, 479, 480, 767, 768, 1079, 1080, 1280, 1366, 1367, and 1440px. Hub checks cover the exact Application Access heading, removal of old row controls/details/count, all four apps in All apps, Figma/GitHub in Not Connected, Google Drive/Slack in Connected, search combined with filtering, filter radio state, no-match empty state, and restoration to the unfiltered list. Existing swipe, history reset, composer, chat, focus-modality, and desktop-boundary checks still pass. Rendered-browser verification remains pending under the previously documented browser limitation.

## HOLIX Ai focus rings follow input method — 12 October 2026

HOLIX tracks interaction method on its document element with data-focus-input. Primary application startup and pointerdown use pointer mode. Tab (including Shift+Tab) and navigation/activation keys outside text-entry controls use keyboard mode. Typing or moving the caret within a pointer-focused text field does not enable keyboard outlines. The behaviour is based on interaction method, not an assumption about a user's ability.

In pointer mode, a scoped CSS rule suppresses outlines on focused elements and the model-mode wrapper. This also covers text inputs that browsers may consider focus-visible even when clicked, and programmatically focused menu/region containers. Keyboard mode retains the existing cyan focus-visible rules and forced-colour indicators. The data attribute is set by JavaScript rather than permanently in HTML, preserving existing focus styling if scripting is disabled. Normal active input borders/shadows, hover feedback, composer animations, and focus movement remain unchanged.

The project source checker passed. Full-script DOM/event simulations passed at 320, 479, 480, 767, 768, 1079, 1080, 1280, 1366, 1367, and 1440px, including initial pointer mode, caret/space input without enabling outlines, Shift+Tab enabling keyboard mode, mouse/touch/pen restoring pointer mode, and arrow-key widget navigation enabling keyboard mode. Existing swipe, menu-history, composer-focus, chat, and desktop-boundary checks still pass. Source inspection confirms that pointer suppression is confined to HOLIX and existing keyboard/forced-colour rules remain. Visual browser and assistive-technology verification remain pending.

## GUP touch logic for HOLIX Ai — 12 October 2026

HOLIX now uses the same gesture mechanism as GUP's assets/js/mobile.js: record the primary touch's pointer ID and starting coordinates on pointerdown, compare the ending coordinates on matching pointerup, clear the gesture on pointercancel, and prevent the first following click within 350ms after a recognised swipe. It no longer relies on a pointermove phase or explicit pointer capture. Horizontal travel must exceed 64px and twice the absolute vertical travel. GUP's existing leftward close direction is retained; HOLIX adds the corresponding rightward open direction.

The drawer animation, mobile/tablet boundary through 1366px, form-control exclusion, and menu/page-history resets remain unchanged. No GUP source files changed.

The project source checker and full-script DOM/event simulations passed at 320, 479, 480, 767, 768, 1079, 1080, 1280, 1366, 1367, and 1440px. In addition to the existing lifecycle, composer, and chat checks, verification covered opening without a pointermove event, rejection at exactly 64px, acceptance at 65px, rejection of 100px horizontal/60px vertical movement, cancelled touches, wrong-direction gestures, and accidental-click suppression. Rendered-browser and native physical-touch behaviour remain unverified under the previously documented browser limitation.

## HOLIX Ai final swipe direction — 12 October 2026

Across the mobile/tablet range through 1366px, a rightward touch swipe opens the drawer and a leftward swipe closes it. Opposite-direction gestures leave the state unchanged. The off-screen transform is translateX(-100%), matching entry from the left and exit to the left. Reset behaviour, gesture thresholds, vertical-scroll handling, click suppression, and all other workspace controls are unchanged.

The source checker and full-script DOM/event simulations passed at 320, 479, 480, 767, 768, 1079, 1080, 1280, 1366, 1367, and 1440px, including opposite-direction rejection. Physical-touch and rendered-browser checks remain unverified under the previously documented browser limitation.

## HOLIX Ai mobile workspace redesign — 12 October 2026

The mobile workspace now extends across all of the portfolio's mobile/tablet width bands through max-width 1366px, including larger tablets. Both the mobile CSS layout and JavaScript mobileQuery use that same upper bound. The prior phone-only 767px navigation behaviour and always-visible tablet model settings are superseded for HOLIX Ai. GUP, the developer project, and the portfolio keep their preceding breakpoint alignment.

The header shows the active chat name with single-line overflow/ellipsis styling and a full-title tooltip. Its button supplies tap and keyboard menu access without a separate visible Menu control. The drawer spans the workspace width below the shared project return bar. It enters from the left and slides back left on exit, with delayed visibility hiding so the closing transform can finish. Escape remains a keyboard dismissal path; the old Close menu item is removed.

The mobile profile uses a 56px circular portrait, Leonardo Debruz, and a 10px flex gap. Menu content scrolls independently while the New chat footer stays at the bottom left. One existing New chat button is moved between that footer and the desktop composer, avoiding duplicate handlers or IDs. The extra create-chat control in Active Chats is hidden only within the mobile layout. The prototype's existing one-user-created-chat limit, rename/delete interactions, and simulated conversation behaviour remain.

Rightward touch swipes open the drawer; leftward swipes close it, including when Search or Active Chats is open. Gesture recognition now uses GUP's threshold: more than 64px horizontal travel, exceeding twice the absolute vertical travel. Vertical scrolling, short gestures, mouse drags, and form-control gestures are ignored. Recognised touch gestures suppress the first subsequent click within 350ms. Drawer closure resets submenus, search, and scroll. Opening AI Tools or a navigation preview closes the drawer. Pagehide, persisted pageshow, popstate, and width changes reset transient navigation state without restoring a stale open drawer.

Mobile composer model settings now use the desktop fade/translate animation, with matching aria-hidden and inert state. Focusing the prompt or another control inside its area reveals settings; focus transfer within the area keeps them available; leaving the composer hides them and closes its model menu. The composer remains in flow on mobile. At 1367px and above, the rail, profile size, composer placement, microphone focus behaviour, and desktop control interactions remain.

Validation completed:

- The dependency-free checker passed for all six HTML pages, local references, IDs/ARIA/script targets, button types, field labels, landmarks, image alternatives, GUP dependency/catalogue checks, CSS block balance, JavaScript syntax, and asset references.
- The actual HOLIX script ran against a DOM/event simulation built from its HTML at 320, 479, 480, 767, 768, 1079, 1080, 1280, 1366, 1367, and 1440px. Checks covered initial drawer/composer state, right/left swipes, rejected vertical/short/mouse/form gestures, accidental-click suppression, Search dismissal/reset, composer focus transitions, AI Tools handoff, pagehide/back-cache/popstate resets, navigation previews, new-chat naming/deletion/title updates, and resizing across the desktop boundary.
- The final ZIP retains the original file inventory. Changes in this revision are limited to HOLIX HTML/CSS/JS and revision documentation.

These are source and DOM/event checks, not rendered-browser or physical-touch tests. The environment has no browser executable and its earlier Chromium download was blocked by the network policy. Visual layout, ellipsis rendering, native touch scrolling/capture, keyboard resizing, and real-device behaviour therefore remain unverified.

## Shared portfolio breakpoints across projects — 12 October 2026

The homepage's existing width rules are the source of truth. Each project uses only the rules it needs from this family; no empty layout rules were introduced.

| Width rule | Intended layout band |
| --- | --- |
| Above 1366px | Wider desktop |
| 1080–1366px | Intermediate desktop |
| 768–1079px | Compact/tablet |
| 480–767px | Phone |
| Up to 479px | Smaller phone |

HOLIX Ai now uses max-width 1366px for its desktop tightening and max-width 767px for its phone drawer layout. Its JavaScript phoneQuery uses the same 767px threshold, so sidebar inertness, focus handling, drawer state, and new-chat control placement follow the stylesheet. Its existing compact threshold stays at 1079px. Smaller phones inherit that phone layout without an unnecessary extra query.

GUP's max-width 1200px and 1250px layout conditions now use 1366px. Its min-width 1600px hero condition now uses 1367px. Header adjustments were consolidated into the 1080–1366px band. Existing tablet/phone queries, mobile JavaScript, and storefront interactions are preserved.

The developer portfolio's previous 1100px, 900px, 760px, 560px, and 420px rules now use 1366px, 1079px, 767px, and 479px. Duplicate queries were consolidated in descending width order, retaining declaration order within each band and 44px compact navigation targets. Shared return-navigation gutters now change at 767px.

The dependency-free project checker passed for all six HTML pages, references, CSS block balance, JavaScript syntax, accessibility source checks, GUP dependencies/catalogue, and referenced assets. A width-query audit confirmed that all layout media conditions belong to the portfolio's breakpoint family. The existing 75rem motion gate already matches shared portfolio motion.css and remains a user-preference animation condition. Project-specific height, coarse-pointer, reduced-motion, and forced-colour rules remain intact. HTML, images, and unrelated interaction scripts are byte-identical to the uploaded ZIP.

Visual rendering and physical-device checks remain pending: Playwright is installed but no browser executable was available, and Chromium download returned HTTP 403 under the current network restrictions. No browser-rendering success is claimed.

## Centred About layout on larger tablets — 11 October 2026

About's stacked, centred layout now applies at widths up to 1366px, with a full-width bounded content column and centred portrait. The heading and paragraphs use auto inline margins, so their maximum widths do not offset their centre from the page centre. Above 1366px, About retains its original two-column desktop layout. The later phone rule still supplies its 80px bottom margin.

The source checker passed. Changes are limited to homepage About responsive styling and these revision records. Other section breakpoints, HTML, project pages, and assets are unchanged. Browser/tablet rendering remains unverified.

## GUP mobile menu history fix — 11 October 2026

GUP resets the mobile drawer on ordinary menu-link navigation and pagehide, with a persisted pageshow handler covering back/forward-cache restoration. Reset closes the native dialog immediately and synchronises aria-expanded, activation/touch state, and the dialog-open body class. Other open dialogs keep their scroll lock. Immediate close cancels any pending close animation/timer.

The source checker and focused Node regression harness passed for navigation, restored history state, reopening, pending-animation cancellation, modifier clicks, and scroll locking with another dialog. Real-browser/device verification remains unavailable.

## Restore Contact paragraph colour — 11 October 2026

The shared .contact__layout p rule again uses var(--ink-muted), resolving to #91a2b2. No responsive rule overrides this colour. The project checker passed.

## Shorter About and Contact headings — 11 October 2026

The shared homepage headings now read About Me and Contact Me. Existing IDs and aria-labelledby references remain valid. No stylesheet or project-page changes were made. The project checker passed.

## Mobile section spacing and Contact scope — 11 October 2026

Below 768px, About has an 80px bottom margin and Contact has 80px top padding. The Contact layout has zero inner padding to avoid stacking another gap. Contact copy centring and auto inline margins now live exclusively in the phone query; above it the original left-aligned Contact layout applies. Desktop section spacing, all other requested mobile alignment, and footer spacing remain unchanged.

The source checker passed; archive comparison confirmed unchanged markup, project pages, and assets. Browser rendering remains unverified.

## Mobile homepage alignment finishes — 11 October 2026

Below 1080px, the specified hero identity, How? explanation, About copy, and Contact copy use centred text/alignment. Showcase title rows centre their numbers, h3 headings, and status pills; project links become fit-content flex blocks with auto inline margins. The previous phone-only left status alignment was removed.

Below 768px, the page gutter uses clamp(1.25rem, 4vw, 2rem), and Contact no longer adds an extra horizontal inset. Existing 100px About margins and Contact-to-footer padding remain unchanged. Desktop styling is unaffected. The project source checker passed; source comparison confirmed changes only to homepage CSS and revision records. Browser rendering remains unverified.

## Tighter Contact-to-footer spacing — 11 October 2026

The new uploaded archive is the baseline for this revision. Contact now supplies padding-bottom: clamp(2rem, 4vw, 4rem); its inner container supplies no bottom padding, including the compact layout. This removes duplicate bottom padding while preserving a responsive gap before the footer. The clipboard status reserve remains for interaction feedback.

The uploaded version had removed the Capabilities heading while retaining its aria-labelledby reference; this was corrected with aria-label="Design capabilities" without restoring visible text. The project checker passed. An archive comparison confirmed that only homepage HTML/CSS and the revision records changed. Browser rendering remains unverified.

## About, Capabilities, Contact order — 11 October 2026

The source order is hero, Selected Work, About, Design Capabilities, Contact. This order applies to every breakpoint. About retains 100px top/bottom margins; Capabilities has no top padding so its heading sits 100px after About; Contact has a 100px top margin so the same gap remains after the table. Internal section padding and layout rules are otherwise unchanged.

The project checker passed. Focused checks confirmed section order, preserved section content, and unchanged project pages/assets. Browser rendering remains unverified.

## White Contact paragraph on all devices — 11 October 2026

The shared .contact__layout p rule now sets color: #fff; there is no device-specific override. No .contact__layout rule adds a border or background, including compact and forced-colours queries. The project checker passed. Browser rendering remains unverified.

## Open Contact section — 11 October 2026

Contact's outer layout container no longer defines a border or background; its forced-colours border override was removed as well. The contact-action controls retain their existing borders, backgrounds, and focus styling. The source checker passed; project pages and assets remain unchanged.

## Continuous desktop capabilities outline — 11 October 2026

At 1080px and above, capabilities__table supplies a single 1px rgb(199 230 247 / 28%) border with a 1rem radius and clips both grids to that outline. The capability grid retains its bottom divider but removes its now-redundant top border. The tool grid's desktop top margin is zero, so the outline has no gap. Internal cell borders and grid gaps retain their previous colour and width. Below 1080px the wrapper is unstyled and existing separate table borders/10px corners remain in effect.

The project checker passed. Only homepage HTML/CSS and revision records changed. Browser rendering remains unverified.

## Capabilities table outer corners — 11 October 2026

Desktop capability-list uses border-radius: 1rem 1rem 0 0; tools-evidence uses border-radius: 0 0 1rem 1rem. Both clip their child backgrounds with overflow: hidden. This rounds the four outside corners of the combined desktop table and leaves its internal junctions square. The change applies only at 1080px and above. Below 1080px, both separately spaced tables retain their existing 10px radius. The source checker passed; browser rendering remains unverified.

## Work spacing and restored About copy — 11 October 2026

Selected Work uses padding-top: clamp(1rem, 2vw, 5rem). The capabilities section no longer has bottom padding; About's margin-block: 100px remains unchanged. Both About paragraphs exactly match the user-supplied original copy, with normal paragraph styling. The obsolete about__bridge selector was removed.

The project checker passed. Focused checks verified both paragraphs verbatim and the requested spacing; the rebuilt archive passed ZIP integrity checks and matches the edited homepage files. This revision edits only homepage HTML/CSS and these revision records. Browser rendering remains unverified.

## Equal About section spacing — 11 October 2026

About uses margin-block: 100px and padding-block: 0, with its top border removed. Contact no longer shares the capabilities top-padding rule, preventing extra space below About. Existing responsive queries do not override About's margins. The source checker passed; project pages and image bytes are unchanged. Browser rendering remains unverified.

## Semi-bold section headings — 11 October 2026

Homepage h2 headings now explicitly use font-weight: 600, while h3 headings retain 500. The homepage loads Palanquin 500 and 600. Normal letter spacing and existing sizes remain unchanged. The source checker passed; project pages and assets retain their previous bytes.

## Static hero images — 11 October 2026

Both hero previews are now static image containers with no links, click handlers, or tab stops. Their image assets, alternative text, and visual styling are unchanged. The obsolete focus-visible rule was removed. The source checker passed; all project-page files remain unchanged.

## Palanquin Medium headings — 11 October 2026

Homepage h2 and h3 elements now use Palanquin with font-weight: 500 and normal letter spacing. The homepage font request loads Palanquin 500. Palanquin Dark 400 and 600 remain loaded for the hero and logo; the unused 700 request was removed. Heading sizes and project-page files are unchanged. The source checker passed; browser rendering remains unverified.

## Portfolio heading readability — 11 October 2026

Homepage h2 and h3 elements now use Palanquin Dark with letter-spacing: normal. The section and showcase heading rules no longer override this with negative tracking. The homepage font request includes Palanquin Dark 700, preserving existing bold heading weights without synthetic bold. Existing heading sizes and other styles remain unchanged.

The project checker passed. An archive comparison confirmed that only homepage HTML/CSS and the revision records changed; all project pages and assets retain their previous bytes. Browser rendering remains unverified.

## Visual designer hero composition — 11 October 2026

The current hero adapts oversized type and layered visual composition from graphic/creative designer portfolio concepts by Hasanul Haque Topu and TechX Solutions, with original implementation and this portfolio's existing assets. The title and name occupy the left side; overlapping Software Developer Portfolio and GUP preview links occupy the right. The statement and explanation share a second grid row, with both grids stacking below 768px.

All original hero reading copy is retained. No hr or divider styles were reintroduced. New styles are scoped to .hero and its descendants. The source checker passed for local links, IDs/ARIA, image alternatives, CSS balance, JavaScript syntax, and asset references. Scope checks confirmed unchanged content outside the hero, project pages, scripts, and image bytes. Browser layout and external font loading remain unverified.

## Simplified typography-led hero — 11 October 2026

The current hero uses a centred single-column hierarchy, informed by the identity/role/introduction pattern on https://brittanychiang.com/. Its role heading retains Palanquin Dark 400, while the name, statement, and explanation retain Inter and their supplied weights. The text scales independently for a clear hierarchy rather than through a single multiplier. All supplied copy is unchanged; statement wrapping is natural.

The hr element, identity-divider wrapper, divider CSS, scale variable, and obsolete mobile hero overrides are completely removed. The 54rem outer content width, 30ch statement width, and 40rem introduction width constrain line length. The source checker passed; focused checks confirmed exact copy, section order, absence of removed hero constructs, and preservation of project pages and assets. Browser layout verification remains unavailable.

## Complete hero centring — 11 October 2026

The JH logo now explicitly uses font-weight: 600. Previously, its inherited regular weight resolved to the only loaded Palanquin Dark weight (600); adding 400 for the hero changed that resolution. The explicit weight isolates the logo from hero font-loading changes.

The hero copy is a centred flex column with width min(100%, 60rem) and auto inline margins. Its full-width top row uses justify-content: center; the statement now uses flex: 0 1 auto so unused space does not push the visible group off centre. The intro has width 100%, a 50rem maximum, and centred items. Symmetric section padding centres the group vertically within its content-sized section. Existing text alignments, scale, and gaps are preserved.

The project checker passed. Browser rendering remains unverified.

## Hero scale and How? alignment — 11 October 2026

The hero now defines a shared scale unit with clamp(1.25px, .16vw, 1.75px). All five hero font sizes and both responsive divider-length declarations multiply their supplied base values by that unit. Desktop sizes cap at 56px/28px/35px/28px/21px and a 217px divider. At narrow widths, they become 40px/20px/25px/20px/15px and a 155px divider. Font weights, line-height ratios, and the 1px white divider at 30% opacity remain as specified.

The intro column uses align-items: center to centre How? above its already centred paragraph. The five existing gap values (10, 18, 25, 15, and 30px), section order, and mobile stacking are unchanged. The existing project checker passed; focused source checks confirmed shared scaling and gap preservation. Browser layout and external font loading remain unverified.

## Hero typography specification — 11 October 2026

The latest hero styles apply Palanquin Dark 400 at 32px for the title, Inter 200 at 16px for the name, Inter 400 at 20px/1.3 for the statement, Palanquin Dark 400 at 16px for How?, and Inter 300 at 12px/1.5 with centre alignment for the explanation. The Google Fonts request includes all newly required weights. The statement breaks before purpose to websites.

The divider is now 124px long with a 1px white border, .3 opacity, and 999px radius. Below 768px its orientation switches from vertical to horizontal while keeping the same length, border, and opacity. The responsive subtitle size override was removed so the specified 20px applies at every width. Existing flex gaps and section order are retained.

The source checker passed. Focused source inspection confirmed all requested typography and divider declarations. Browser rendering and external font loading remain unverified.

## Hero redesign and restored About order — 11 October 2026

The current section order is hero, Selected Work, Design Capabilities, About Jaqweal Holit, and Contact Jaqweal Holit. About's project reference now points above.

The hero uses the supplied Web Designer title, Jaqweal Holit name span, Bringing clarity, structure, and purpose to websites. statement span, How? span, and explanation paragraph. Nested flex containers declare gaps of 10px (title/name), 18px (identity/divider), 25px (divider/statement), 15px (How?/paragraph), and 30px (upper/lower groups). The desktop divider retains its vertical 2px grey treatment. Text is left aligned, with vertical centring in the top row. Below 768px, the groups stack and the divider becomes horizontal.

The existing source checker passed for all six HTML pages, local references, IDs/ARIA, image alternatives, dependencies, CSS balance, JavaScript syntax, and asset usage. Focused source checks verified section order and exact hero copy; an archive comparison verified that project pages, scripts, and assets remain unchanged. Rendered-browser and real-device layout checks remain pending because browser-control infrastructure is unavailable in this session.

The following entry records the preceding revision, superseded by the hero and section-order changes above.

## Homepage UI adjustments — 11 October 2026

The hero introduces Who am I? and A Web Designer, with the right-aligned statement I bring clarity, structure, and purpose to websites. The What do I do? introduction is followed by a 27-word paragraph describing website layout, navigation, content, visitor experience, and purpose. Its desktop grid retains the vertical 2px grey rule at 20% opacity. Below 768px, the identity occupies a full row and the focus statement occupies the next row beside the divider. All text tracks can shrink and wrap.

About now appears immediately before Selected Work, with a compact 14rem portrait, a shorter background paragraph, and a sentence introducing the projects below. The source check confirmed section order and the hero paragraph's word count. Four main section H2 headings use `clamp(2.1rem, 4.6vw, 4.4rem)`, roughly 8% smaller than their original sizing; the hero's new question heading uses a smaller subordinate style.

The homepage uses GUP's compact thresholds of 1079px, 767px, and 479px. Desktop typography, palette, portrait treatment, and shared radius styling also apply on mobile. The capabilities and tools tables retain their original desktop appearance; below 1080px, both have independent 10px corners, full 1px borders at 28% opacity, clipped child backgrounds, and a 1.25rem gap between them. The portrait wrapper has an explicit responsive 14rem maximum width, auto inline margins, and centred grid alignment below 1080px; its image fills that wrapper.

The featured-preview figure and its dedicated CSS have been removed. The hero is content-sized, without a second column or a viewport-height minimum. The View selected work button and its unused action styles have also been removed at every width. The hero leads into a compact About section and then Selected Work. Work retains its previous responsive top padding plus 24px. Background artwork and gradients share one fixed layer rather than mixing a scrolling image with fixed overlays.

`python3 tools/check_project.py` passed after these revisions: HTML structure, references, IDs/ARIA, catalogue/dependencies, CSS block balance, JavaScript syntax, and asset usage. An archive comparison confirmed that only homepage HTML/CSS and the change/validation documentation changed; project pages and assets retain their supplied bytes.

Rendered layout and scrolling are **not verified**. There is no installed local browser, and the official Playwright Chromium download was blocked with HTTP 403. A cloud-browser review was also attempted, but its security policy rejected the local preview URL; no bypass was attempted. Check 320px and both sides of the 480px, 768px, and 1080px boundaries before publishing; confirm portrait alignment, rounded table corners, readable navigation, no unintended horizontal overflow, and consistent backgrounds during scroll on real phones.

## GUP integration — 10 October 2026

This record covers the supplied GUP replacement integrated into the supplied portfolio ZIP.

### Completed checks

| Check | Result |
| --- | --- |
| Six HTML documents | Balanced nesting, unique IDs, page language, viewport metadata, local references/fragments, explicit button types, labels and ARIA targets passed. Five content pages have one `h1`, one main landmark, a skip link, and image alternatives; the sixth is the earlier About redirect. |
| Source separation | No inline style blocks, style attributes, or HTML event handlers. Live CSS, JS, and media all have references. Superseded sources were removed. |
| All JavaScript | All twelve scripts passed `node --check`: two portfolio scripts, HOLIX’s application script, and nine GUP controllers. |
| CSS and assets | All CSS blocks balanced and local CSS URL references resolved. All 21 images are used; the four GUP catalogue images have matching intrinsic dimensions. |
| GUP dependencies | Both pages load the nine storefront scripts in the required order after the shared URL-normalization script. Body root attributes resolve catalogue images and destinations relative to GUP. |
| GUP catalogue | Stable unique product IDs, finite numeric fields, sensible price/player/playtime values, image existence/dimensions, and future directory-route formats passed. |
| GUP startup and interactions | DOM simulations passed full initialization on Home and Browse, card rendering, favorites persistence, combined facets, search, sorting, URL state, cart add/quantity/remove, invalid stored quantities/products, the 99-copy cap, blocked-storage fallback, dialog dismissal, newsletter feedback, and mobile-menu expanded/open state. |
| Directory URLs | GUP startup simulations passed clean `index.html` normalization and catalogue path resolution at a site root and repository prefix. Internal anchors use directory URLs; external links are preserved. |
| Local HTTP hosting | 110 HTML/asset requests passed with status 200 and exact source bytes, covering both a site-root mount and a `/portfolio/` repository prefix. Slashless Browse requests redirect to its directory URL. |
| Preservation | Homepage, HOLIX, and developer artwork and reading content are retained. Their live CSS and application JavaScript remain byte-identical. GUP retains the incoming live CSS and artwork; changes are portfolio return navigation and shared URL handling. |

DOM simulations emulate APIs and media-query states. They do not render CSS, prove native dialog/touch behaviour, or establish accessibility conformance. The simulation harness and HTTP fixtures are temporary audit tooling, not publishing files or runtime dependencies. `tools/check_project.py` is the reusable source checker.

### Existing prototype destinations

GUP Browse images and titles link to `page/gup/products/<id>/`. Those product pages were intentionally unbuilt in the supplied GUP project, and remain unbuilt. They will return 404 until corresponding pages are added. The checker validates their route format rather than reporting them as existing pages. Home’s product details and demonstration cart remain usable.

Account sign-in, checkout/payments, newsletter delivery, support services, and live HOLIX AI/upload/audio integrations remain outside the supplied prototypes. External links and remote fonts were preserved but were not availability-tested.

### Pending rendered-browser review

No rendered browser results are claimed. Local Playwright had no installed browser binary, and its official browser download returned an environment network-denial response. The alternate cloud-browser preview timed out. No screenshots, pixel comparisons, real-device results, or automated browser accessibility scan were obtained.

Before publishing, review all five content pages in current Chromium, Firefox, and Safari:

1. Check phone, tablet, and desktop widths, including 320px and the GUP 480/768/1080px boundaries. Confirm no clipped content or unintended horizontal scrolling; compare desktop composition with the supplied designs.
2. Test keyboard-only skip links, focus visibility, Tab/Shift+Tab, Escape, modal/drawer dismissal and focus return; resize with panels open.
3. On real phones, test menu swipes, scroll/zoom, landscape, and HOLIX’s on-screen keyboard/composer layout.
4. Check reduced motion, forced colours, text enlargement, browser zoom, and text-spacing overrides.
5. Verify screen-reader headings, names/states, live feedback, and rendered contrast; run an accessibility scan in base and open-panel states.

The archive is ready for source review and merge. Visual preservation and WCAG conformance remain subject to these rendered checks.
