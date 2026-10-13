"use strict";

/* Disclosure navigation, focus return, and return-to-top after visiting GitHub. */
(() => {
  const mobileQuery = window.matchMedia("(max-width: 1079px)");
  const dropdown = document.querySelector(".main-nav__dropdown");
  const toggle = document.querySelector(".main-nav__toggle");
  const links = document.querySelector(".main-nav__links");
  if (!dropdown || !toggle || !links) return;

  const close = () => { dropdown.open = false; };

  links.addEventListener("click", event => {
    if (!mobileQuery.matches || !(event.target instanceof Element)) return;
    const link = event.target.closest("a[href]");
    if (!link || event.defaultPrevented || event.button > 0 ||
        event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

    close();
    // Move focus to the destination before its default anchor scroll. Preventing
    // focus scrolling keeps the sticky header's section offset effective.
    const destination = link.getAttribute("href");
    const target = destination.startsWith("#")
      ? document.getElementById(destination.slice(1)) : null;
    if (target) {
      if (!target.hasAttribute("tabindex")) {
        target.tabIndex = -1;
        target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
      }
      target.focus({ preventScroll: true });
    } else {
      toggle.focus({ preventScroll: true });
    }
  });

  document.addEventListener("click", event => {
    if (event.target instanceof Node && !dropdown.contains(event.target)) close();
  });

  dropdown.addEventListener("keydown", event => {
    if (event.key !== "Escape" || !dropdown.open) return;
    event.preventDefault();
    close();
    toggle.focus();
  });

  dropdown.addEventListener("focusout", event => {
    if (event.relatedTarget instanceof Node && !dropdown.contains(event.relatedTarget)) close();
  });
  mobileQuery.addEventListener("change", close);
  window.addEventListener("pagehide", close);

  // Keep the marker local to this page/tab; unavailable storage is optional.
  const returnKey = `developer-github-return:${location.pathname}`;
  const readReturn = () => {
    try { return sessionStorage.getItem(returnKey) === "away"; } catch { return false; }
  };
  const saveReturn = value => {
    try {
      if (value) sessionStorage.setItem(returnKey, value);
      else sessionStorage.removeItem(returnKey);
    } catch { /* The current visit still works without storage. */ }
  };
  let githubPending = readReturn();
  let leftPortfolio = githubPending;

  document.addEventListener("click", event => {
    if (event.defaultPrevented || event.button > 0 || !(event.target instanceof Element)) return;
    const link = event.target.closest("a[href]");
    if (!link || new URL(link.href).hostname !== "github.com") return;
    githubPending = true;
    leftPortfolio = false;
  });

  const markAway = () => {
    if (!githubPending) return;
    leftPortfolio = true;
    saveReturn("away");
  };
  const returnToTop = () => {
    if (!githubPending || !leftPortfolio || document.visibilityState === "hidden") return;
    githubPending = false;
    leftPortfolio = false;
    saveReturn(null);
    close();
    // Browser history can restore its previous scroll after pageshow.
    // Wait until that restoration completes, then reset once for this GitHub visit.
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
      const url = new URL(location.href);
      url.hash = "top";
      try { history.replaceState(history.state, "", url); } catch { /* Scroll still resets. */ }
      document.querySelector(".wordmark")?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }));
  };

  window.addEventListener("blur", markAway);
  window.addEventListener("pagehide", markAway);
  window.addEventListener("focus", returnToTop);
  window.addEventListener("pageshow", returnToTop);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") markAway();
    else returnToTop();
  });
})();
