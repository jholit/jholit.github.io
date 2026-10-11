'use strict';

/* Saved-product state, heart controls, and cross-tab synchronization. */
GUP.initFavorites = function (products) {
  const { $, $$, readStorage, writeStorage } = GUP;
  const key = 'gamers-ultra-plus-favorites-v1';
  const ids = new Set();
  const listeners = new Set();
  const buttons = $$('[data-favorite]');
  const counts = $$('[data-favorites-count]');
  const links = $$('.favorites-link');
  const status = $('#favorites-status');

  function restore() {
    ids.clear();
    for (const id of readStorage(key)) {
      if (typeof id === 'string' && products.has(id)) ids.add(id);
    }
  }

  function render() {
    for (const button of buttons) {
      const saved = ids.has(button.dataset.favorite);
      const name = products.get(button.dataset.favorite).name;
      button.classList.toggle('is-saved', saved);
      button.setAttribute('aria-pressed', String(saved));
      button.setAttribute('aria-label', `${saved ? 'Remove' : 'Save'} ${name} ${saved ? 'from' : 'to'} favorites`);
      button.title = saved ? 'Remove from favorites' : 'Save to favorites';
    }
    counts.forEach(node => { node.textContent = String(ids.size); });
    links.forEach(link => link.setAttribute('aria-label', `View favorites, ${ids.size} saved ${ids.size === 1 ? 'item' : 'items'}`));
  }

  function notify(change) {
    render();
    listeners.forEach(listener => listener(change));
  }

  restore();
  render();
  buttons.forEach(button => button.addEventListener('click', () => {
    const id = button.dataset.favorite;
    const removed = ids.has(id);
    if (removed) ids.delete(id);
    else ids.add(id);
    writeStorage(key, [...ids]);
    status.textContent = `${products.get(id).name} ${removed ? 'removed from' : 'saved to'} favorites.`;
    notify({ id, removed, fromUser: true });
  }));
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) {
      restore();
      notify({ fromUser: false });
    }
  });

  return {
    has: id => ids.has(id),
    get size() { return ids.size; },
    subscribe: listener => listeners.add(listener)
  };
};
