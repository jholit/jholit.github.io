'use strict';

/* Shared DOM, formatting, storage, and motion helpers. */
(() => {
  const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  function element(tag, className = '', text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function readStorage(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }

  function writeStorage(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Optional persistence. */ }
  }

  function replayAnimation(node, className) {
    if (motionQuery.matches) return;
    node.classList.remove(className);
    void node.offsetWidth;
    node.classList.add(className);
  }

  const siteRoot = new URL(document.body.dataset.siteRoot || './', location.href);
  const sitePath = path => new URL(path, siteRoot).href;

  // Ordered deferred scripts need no bundler or data fetch.
  window.GUP = { $, $$, element, sitePath, motionQuery, readStorage, writeStorage, replayAnimation,
    formatCurrency: value => currency.format(value) };
})();
