'use strict';

/* Collection tabs, search, facets, sorting, URL state, and result motion. */
GUP.initCollection = function ({ isBrowse, products, favorites }) {
  const { $, $$, motionQuery } = GUP;
  const cards = [...products.values()].map(product => product.card);
  const grid = $('#product-grid');
  const filterButtons = $$('.filter');
  const filterIndicator = $('.filter-indicator');
  const emptyState = $('#empty-state');
  const emptyTitle = $('h3', emptyState);
  const emptyCopy = $('p', emptyState);
  const ui = {
    searchInput: $('#search-input'), searchForm: $('#search-form'),
    filterStatus: $('#filter-status'), resetSearch: $('#reset-search'), collection: $('#collection')
  };
  const facets = Object.fromEntries(['bookType', 'category', 'players', 'time', 'price', 'stock'].map(key =>
    [key, $(`#${key === 'bookType' ? 'book-type' : key}-filter`)]));
  const sortSelect = $('#sort-select');
  const facetsForm = $('#browse-facets');
  const clearButton = $('#clear-filters');
  let filter = 'all';
  let query = '';
  let searchTimer;
  let filterTimer;
  let filterAnimationId = 0;
  let filterResizeFrame;

  if (isBrowse) {
    for (const category of new Set([...products.values()].map(product => product.category))) {
      const option = GUP.element('option', '', category.charAt(0).toUpperCase() + category.slice(1));
      option.value = category;
      facets.category.append(option);
    }
  }
  function moveFilterIndicator(animate = true) {
    const activeFilter = isBrowse && filter !== 'favorites' ? 'all' : filter;
    const activeButton = filterButtons.find(button => button.dataset.filter === activeFilter);
    if (!activeButton || !filterIndicator) {
      return;
    }

    const shouldAnimate = animate && !motionQuery.matches;
    if (!shouldAnimate) {
      filterIndicator.style.transition = 'none';
    }

    filterIndicator.style.width = `${activeButton.offsetWidth}px`;
    filterIndicator.style.transform = `translateX(${activeButton.offsetLeft}px)`;

    if (!shouldAnimate) {
      void filterIndicator.offsetWidth;
      filterIndicator.style.removeProperty('transition');
    }
  }

  function commitFilterResults(visibleCards, animateIn, animationId) {
    let count = 0;

    cards.forEach(card => {
      card.hidden = !visibleCards.has(card);
      card.classList.remove('is-filtering-out', 'is-filtering-in');
      count += Number(!card.hidden);
    });

    const resultStatus = ui.filterStatus;
    if (resultStatus) resultStatus.textContent = isBrowse
      ? `${count} Games Found`
      : `${count} ${count === 1 ? 'game' : 'games'} found${query ? ` for “${query}”` : ''}.`;
    if (isBrowse) {
      const sorted = [...products.values()];
      if (sortSelect.value === 'price-low') sorted.sort((a, b) => a.price - b.price);
      if (sortSelect.value === 'price-high') sorted.sort((a, b) => b.price - a.price);
      if (sortSelect.value === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
      grid.append(...sorted.map(product => product.card));
    }
    emptyState.hidden = count > 0;
    if (isBrowse) {
      emptyTitle.textContent = filter === 'favorites' && !favorites.size ? 'No favorites saved yet.' : 'No games found.';
      emptyCopy.textContent = filter === 'favorites' && !favorites.size
        ? 'Click a heart on a product to save it for later.'
        : 'Try a different search or clear your filters to see the whole collection.';
    }
    emptyState.classList.remove('is-filtering-out', 'is-filtering-in');

    if (!animateIn || motionQuery.matches) {
      return;
    }

    const incoming = count ? cards.filter(card => !card.hidden) : [emptyState];
    incoming.forEach(element => element.classList.add('is-filtering-in'));

    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (animationId === filterAnimationId) {
        incoming.forEach(element => element.classList.remove('is-filtering-in'));
      }
    }));
  }

  function applyFilters({ animate = true } = {}) {
    const animationId = ++filterAnimationId;
    clearTimeout(filterTimer);
    cards.forEach(card => card.classList.remove('is-filtering-out', 'is-filtering-in'));
    emptyState.classList.remove('is-filtering-out', 'is-filtering-in');

    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    const visibleCards = new Set();

    products.forEach(product => {
      const matchesFilter = filter === 'all' || filter === 'favorites' || product.collections.has(filter);
      const matchesQuery = terms.every(term => product.searchText.includes(term));
      const matchesFacets = !isBrowse || (
        (facets.bookType.value === 'all' || product.bookType === facets.bookType.value) &&
        (facets.category.value === 'all' || product.category === facets.category.value) &&
        (facets.players.value === 'all' || (Number(product.minPlayers) <= Number(facets.players.value) && Number(product.maxPlayers) >= Number(facets.players.value))) &&
        (facets.time.value === 'all' || Number(product.maxTime) <= Number(facets.time.value)) &&
        (facets.price.value === 'all' || product.price <= Number(facets.price.value)) &&
        (!facets.stock.checked || product.stock === 'in')
      );
      const matchesFavorites = filter !== 'favorites' || favorites.has(product.id);
      if (matchesFilter && matchesQuery && matchesFacets && matchesFavorites) {
        visibleCards.add(product.card);
      }
    });

    filterButtons.forEach(button => {
      const activeFilter = isBrowse && filter !== 'favorites' ? 'all' : filter;
      const active = button.dataset.filter === activeFilter;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    moveFilterIndicator(animate);
    if (isBrowse) syncBrowseURL();

    const resultsChanged = cards.some(card => visibleCards.has(card) === card.hidden);
    if (!animate || motionQuery.matches || !resultsChanged) {
      commitFilterResults(visibleCards, false, animationId);
      return;
    }

    const outgoing = cards.filter(card => !card.hidden);
    if (!emptyState.hidden) {
      outgoing.push(emptyState);
    }

    if (!outgoing.length) {
      commitFilterResults(visibleCards, true, animationId);
      return;
    }

    outgoing.forEach(element => element.classList.add('is-filtering-out'));
    filterTimer = setTimeout(() => commitFilterResults(visibleCards, true, animationId), 250);
  }

  function resetCollection(nextFilter = 'all') {
    clearTimeout(searchTimer);
    filter = nextFilter;
    query = '';
    ui.searchInput.value = '';
    if (isBrowse) {
      Object.entries(facets).forEach(([key, input]) => {
        if (key === 'stock') input.checked = false;
        else input.value = 'all';
      });
      sortSelect.value = 'recommended';
    }
    applyFilters();
  }

  filterButtons.forEach(button => button.addEventListener('click', () => {
    filter = button.dataset.filter;
    applyFilters();
  }));
  function syncBrowseURL() {
    const params = new URLSearchParams();
    if (filter === 'favorites') params.set('favorites', '1');
    if (filter !== 'all' && filter !== 'favorites') params.set('collection', filter);
    if (query) params.set('q', query);
    for (const [key, input] of Object.entries(facets)) {
      if (key === 'stock') { if (input.checked) params.set('stock', 'in'); }
      else if (input.value !== 'all') params.set(key, input.value);
    }
    if (sortSelect.value !== 'recommended') params.set('sort', sortSelect.value);
    const url = new URL(location.href);
    url.search = params.toString();
    // file:// browsing can limit History API support; filtering still works.
    try { history.replaceState(history.state, '', url); } catch { /* Optional URL persistence. */ }
  }

  function readBrowseURL() {
    clearTimeout(searchTimer);
    const params = new URLSearchParams(location.search);
    const requestedFilter = params.get('favorites') === '1' ? 'favorites' : params.get('collection');
    // Header links can still request collections without adding extra Browse tabs.
    filter = ['all', 'new', 'featured', 'popular', 'favorites'].includes(requestedFilter) ? requestedFilter : 'all';
    query = (params.get('q') || '').slice(0, 100);
    ui.searchInput.value = query;
    for (const [key, input] of Object.entries(facets)) {
      if (key === 'stock') input.checked = params.get(key) === 'in';
      else input.value = [...input.options].some(option => option.value === params.get(key)) ? params.get(key) : 'all';
    }
    sortSelect.value = [...sortSelect.options].some(option => option.value === params.get('sort')) ? params.get('sort') : 'recommended';
  }

  if (isBrowse) {
    facetsForm.addEventListener('submit', event => event.preventDefault());
    Object.values(facets).forEach(input => input.addEventListener('change', () => applyFilters()));
    sortSelect.addEventListener('change', () => applyFilters({ animate: false }));
    clearButton.addEventListener('click', () => resetCollection());
    window.addEventListener('popstate', () => { readBrowseURL(); applyFilters({ animate: false }); });
    readBrowseURL();
  }
  ui.resetSearch.addEventListener('click', () => {
    resetCollection();
    $('.filter').focus();
  });

  ui.searchInput.addEventListener('input', event => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      query = event.target.value.trim();
      applyFilters();
    }, 150);
  });

  ui.searchForm.addEventListener('submit', event => {
    event.preventDefault();
    clearTimeout(searchTimer);
    query = ui.searchInput.value.trim();
    if (!isBrowse) {
      const destination = new URL(GUP.sitePath('browse/'));
      if (query) destination.searchParams.set('q', query);
      location.href = destination.href;
      return;
    }
    if (filter !== 'favorites') filter = 'all';
    applyFilters();
    ui.collection.scrollIntoView({
      behavior: motionQuery.matches ? 'auto' : 'smooth'
    });
  });

  favorites.subscribe(change => {
    if (!isBrowse) return;
    if (filter === 'favorites' || !change.fromUser) applyFilters({ animate: false });
    if (filter === 'favorites' && change.fromUser && change.removed) {
      (cards.find(card => !card.hidden)?.querySelector('[data-favorite]') || $('[data-filter="favorites"]')).focus();
    }
  });
  applyFilters({ animate: false });
  document.fonts?.ready.then(() => moveFilterIndicator(false));
  window.addEventListener('resize', () => {
    cancelAnimationFrame(filterResizeFrame);
    filterResizeFrame = requestAnimationFrame(() => moveFilterIndicator(false));
  });
  return { reset: resetCollection };
};
