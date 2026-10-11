"use strict";

/* Normalize HTTP directory entry points without changing query strings or fragments. */
(() => {
  if (!/^https?:$/.test(location.protocol) || !location.pathname.endsWith("/index.html")) return;
  const url = new URL(location.href);
  url.pathname = url.pathname.slice(0, -"index.html".length);
  try { history.replaceState(history.state, "", url); } catch { /* Links still work. */ }
})();
