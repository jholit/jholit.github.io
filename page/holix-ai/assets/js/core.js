"use strict";

/* Shared disclosure, keyboard-focus, and frame scheduling helpers. */
(() => {
  // Show accessibility focus rings for keyboard navigation, not mouse/touch focus.
  const focusNavigationKeys = new Set([
    "Tab", "Escape", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
    "Home", "End", "PageUp", "PageDown", "Enter", " ",
  ]);
  document.documentElement.setAttribute("data-focus-input", "pointer");
  document.addEventListener("pointerdown", () => {
    document.documentElement.setAttribute("data-focus-input", "pointer");
  }, true);
  document.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || !focusNavigationKeys.has(event.key)) return;
    const isTextEntry = event.target instanceof Element && event.target.closest(
      'textarea, input:not([type="range"]):not([type="checkbox"]):not([type="radio"]), [contenteditable="true"]',
    );
    if (event.key === "Tab" || !isTextEntry) {
      document.documentElement.setAttribute("data-focus-input", "keyboard");
    }
  }, true);

  const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "textarea:not([disabled])",
    "select:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(", ");
  // One state writer keeps visual, accessibility, and keyboard availability in sync.
  const disclosureStates = new WeakMap();
  const setDisclosureState = (anchor, trigger, panel, isOpen) => {
    if (!anchor || !trigger || !panel || disclosureStates.get(panel) === isOpen) {
      return false;
    }

    disclosureStates.set(panel, isOpen);
    anchor.classList.toggle("is-open", isOpen);
    trigger.setAttribute("aria-expanded", String(isOpen));
    panel.setAttribute("aria-hidden", String(!isOpen));
    panel.toggleAttribute("inert", !isOpen);
    return true;
  };

  const trapFocus = (event, container, initialTarget = container) => {
    if (event.key !== "Tab") return;

    const elements = focusableWithin(container);
    const first = elements[0];
    const last = elements[elements.length - 1];
    const active = document.activeElement;

    if (!first) {
      event.preventDefault();
    } else if (active === initialTarget || !container.contains(active)) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    } else if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const focusableWithin = (container) => [...(container?.querySelectorAll(focusableSelector) ?? [])]
    .filter((element) => !element.closest('[hidden], [inert], [aria-hidden="true"]') && element.getClientRects().length);

  const oncePerFrame = (callback) => {
    let frame = 0;
    return () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        callback();
      });
    };
  };

  window.HOLIX = { setDisclosureState, trapFocus, oncePerFrame };
})();
