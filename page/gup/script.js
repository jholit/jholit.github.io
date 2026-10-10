'use strict';

/* GAMERS ULTRA PLUS — vanilla JavaScript, no dependencies.
   Product content is read from index.html. Cart data stays on this device.
   This demonstration makes no purchases, sends no emails, and collects no credentials. */
(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const ui = {
    emptyState: $('#empty-state'),
    cartCount: $('#cart-count'),
    openCart: $('#open-cart'),
    filterStatus: $('#filter-status'),
    searchInput: $('#search-input'),
    resetSearch: $('#reset-search'),
    searchForm: $('#search-form'),
    collection: $('#collection'),
    detailImage: $('#detail-image'),
    detailType: $('#detail-type'),
    detailTitle: $('#detail-title'),
    detailPrice: $('#detail-price'),
    detailDescription: $('#detail-description'),
    detailPlayers: $('#detail-players'),
    detailTime: $('#detail-time'),
    detailAge: $('#detail-age'),
    detailStock: $('#detail-stock'),
    detailAdd: $('#detail-add'),
    detailFeedback: $('#detail-feedback'),
    productDialog: $('#product-dialog'),
    cartItems: $('#cart-items'),
    cartSummary: $('#cart-summary'),
    cartDialog: $('#cart-dialog'),
    cartSubtotal: $('#cart-subtotal'),
    infoTitle: $('#info-title'),
    infoContent: $('#info-content'),
    infoDialog: $('#info-dialog'),
    newsletterForm: $('#newsletter-form'),
    newsletterStatus: $('#newsletter-status'),
    year: $('#year')
  };
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });
  const formatCurrency = value => currencyFormatter.format(value);
  const storageKey = 'gamers-ultra-plus-cart-v1';
  const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  const cards = $$('.product-card');
  const filterButtons = $$('.filter');
  const filterIndicator = $('.filter-indicator');
  const emptyState = ui.emptyState;
  const products = new Map(cards.map(card => {
    const image = $('img', card);
    const type = $('.product-type', card).textContent;
    return [card.dataset.id, {
      ...card.dataset,
      price: Number(card.dataset.price),
      collections: new Set(card.dataset.collection.split(' ')),
      searchText: `${card.dataset.name} ${type} ${card.dataset.keywords} ${card.dataset.players} players`.toLowerCase(),
      image: image.getAttribute('src'),
      imageAlt: image.alt,
      type,
      card
    }];
  }));
  const cart = new Map();

  let filter = 'all';
  let query = '';
  let selectedProduct = null;
  let searchTimer;
  let filterTimer;
  let filterAnimationId = 0;
  let filterResizeFrame;
  let lastDialogTrigger = null;

  // Treat local storage as untrusted and tolerate private browsing/storage restrictions.
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(saved)) {
      for (const entry of saved) {
        if (!Array.isArray(entry)) {
          continue;
        }

        const [id, quantity] = entry;
        if (products.get(id)?.stock === 'in' && Number.isInteger(quantity) && quantity > 0) {
          cart.set(id, Math.min(quantity, 99));
        }
      }
    }
  } catch { /* The cart still works in memory when storage is unavailable. */ }

  function replayAnimation(element, className) {
    if (motionQuery.matches) {
      return;
    }

    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
  }

  function moveFilterIndicator(animate = true) {
    const activeButton = filterButtons.find(button => button.dataset.filter === filter);
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

  function saveCart() {
    try { localStorage.setItem(storageKey, JSON.stringify([...cart])); } catch { /* Optional persistence. */ }
    updateCartCount(true);
  }

  function updateCartCount(animate = false) {
    const count = [...cart.values()].reduce((sum, quantity) => sum + quantity, 0);
    const countElement = ui.cartCount;
    const hasChanged = countElement.textContent !== String(count);
    countElement.textContent = String(count);
    ui.openCart.setAttribute('aria-label', `Open cart, ${count} ${count === 1 ? 'item' : 'items'}`);

    if (animate && hasChanged) {
      replayAnimation(countElement, 'is-updated');
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
    if (resultStatus) resultStatus.textContent = `${count} ${count === 1 ? 'game' : 'games'} found${query ? ` for “${query}”` : ''}.`;
    emptyState.hidden = count > 0;
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
      const matchesFilter = filter === 'all' || product.collections.has(filter);
      const matchesQuery = terms.every(term => product.searchText.includes(term));
      if (matchesFilter && matchesQuery) {
        visibleCards.add(product.card);
      }
    });

    filterButtons.forEach(button => {
      const active = button.dataset.filter === filter;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    moveFilterIndicator(animate);

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
    applyFilters();
  }

  filterButtons.forEach(button => button.addEventListener('click', () => {
    filter = button.dataset.filter;
    applyFilters();
  }));
  $$('[data-nav-filter]').forEach(link => link.addEventListener('click', () => resetCollection(link.dataset.navFilter)));
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
    filter = 'all';
    applyFilters();
    ui.collection.scrollIntoView({
      behavior: motionQuery.matches ? 'auto' : 'smooth'
    });
  });

  function openDialog(dialog, trigger) {
    lastDialogTrigger = trigger || document.activeElement;
    dialog.classList.remove('is-closing');
    dialog.showModal();
    document.body.classList.add('dialog-open');
  }

  const dialogClosePromises = new WeakMap();

  function getAnimationTime(element) {
    const styles = getComputedStyle(element);
    const toMilliseconds = value => value.endsWith('ms') ? parseFloat(value) : parseFloat(value) * 1000;
    const durations = styles.animationDuration.split(',').map(value => toMilliseconds(value.trim()));
    const delays = styles.animationDelay.split(',').map(value => toMilliseconds(value.trim()));
    return Math.max(...durations.map((duration, index) => duration + delays[index % delays.length]));
  }

  function closeDialog(dialog) {
    if (!dialog.open) {
      return Promise.resolve();
    }

    const currentClose = dialogClosePromises.get(dialog);
    if (currentClose) {
      return currentClose;
    }

    const isCart = dialog.classList.contains('cart-dialog');
    const isProduct = dialog.classList.contains('product-dialog');
    if (motionQuery.matches || (!isCart && !isProduct)) {
      dialog.close();
      return Promise.resolve();
    }

    const closingAnimation = isCart ? 'cart-drawer-out' : 'product-dialog-out';
    const closePromise = new Promise(resolve => {
      let fallbackTimer;

      function finishClose() {
        clearTimeout(fallbackTimer);
        dialog.removeEventListener('animationend', handleAnimationEnd);
        dialog.close();
        dialog.classList.remove('is-closing');
        dialogClosePromises.delete(dialog);
        resolve();
      }

      function handleAnimationEnd(event) {
        if (event.target === dialog && event.animationName === closingAnimation) {
          finishClose();
        }
      }

      dialog.addEventListener('animationend', handleAnimationEnd);
      dialog.classList.add('is-closing');
      fallbackTimer = setTimeout(finishClose, getAnimationTime(dialog) + 50);
    });

    dialogClosePromises.set(dialog, closePromise);
    return closePromise;
  }

  $$('dialog').forEach(dialog => {
    $$('[data-close]', dialog).forEach(button => button.addEventListener('click', () => {
      void closeDialog(dialog);
    }));

    // Close on a genuine backdrop click, not on whitespace inside the dialog.
    let startedOnBackdrop = false;

    function isOutsideDialog(event) {
      const bounds = dialog.getBoundingClientRect();
      return event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
    }

    dialog.addEventListener('pointerdown', event => {
      startedOnBackdrop = event.target === dialog && isOutsideDialog(event);
    });

    dialog.addEventListener('click', event => {
      if (startedOnBackdrop && event.target === dialog && isOutsideDialog(event)) {
        void closeDialog(dialog);
      }
      startedOnBackdrop = false;
    });

    dialog.addEventListener('cancel', event => {
      event.preventDefault();
      void closeDialog(dialog);
    });

    dialog.addEventListener('close', () => {
      document.body.classList.remove('dialog-open');
      lastDialogTrigger?.focus();
    });
  });

  function showProduct(id, trigger) {
    const product = products.get(id);
    if (!product) {
      return;
    }

    selectedProduct = id;
    ui.detailImage.src = product.image;
    ui.detailImage.alt = product.imageAlt;
    ui.detailType.textContent = product.type;
    ui.detailTitle.textContent = product.name;
    ui.detailPrice.textContent = formatCurrency(product.price);
    ui.detailDescription.textContent = product.description;
    ui.detailPlayers.textContent = product.players;
    ui.detailTime.textContent = `${product.time} min`;
    ui.detailAge.textContent = product.age;
    ui.detailStock.textContent = product.stock === 'in' ? 'In stock' : 'Currently out of stock';
    ui.detailAdd.disabled = product.stock !== 'in';
    ui.detailAdd.textContent = product.stock === 'in' ? 'Add to cart' : 'Sold out';
    ui.detailFeedback.textContent = '';
    openDialog(ui.productDialog, trigger);
  }

  $$('[data-product]').forEach(button => button.addEventListener('click', () => showProduct(button.dataset.product, button)));

  function addToCart(id) {
    const product = products.get(id);
    if (!product || product.stock !== 'in') {
      return '';
    }

    const quantity = cart.get(id) || 0;
    if (quantity >= 99) {
      return 'You have reached the limit of 99 copies per game.';
    }

    cart.set(id, quantity + 1);
    saveCart();
    return `${product.name} added to your cart.`;
  }

  ui.detailAdd.addEventListener('click', () => {
    const feedback = ui.detailFeedback;
    feedback.textContent = addToCart(selectedProduct);
    if (feedback.textContent) {
      replayAnimation(feedback, 'is-confirmed');
    }
  });

  function renderCart(focusTarget) {
    const container = ui.cartItems;
    container.replaceChildren();
    ui.cartSummary.hidden = cart.size === 0;

    if (!cart.size) {
      const empty = document.createElement('div');
      empty.className = 'cart-empty';

      const title = document.createElement('h3');
      title.textContent = 'Your next game night starts here.';

      const body = document.createElement('p');
      body.textContent = 'Add a game to get things going.';

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'button button-primary';
      button.textContent = 'Explore the games';
      button.addEventListener('click', () => {
        closeDialog(ui.cartDialog).then(() => {
          resetCollection();
          ui.collection.scrollIntoView();
        });
      });

      empty.append(title, body, button);
      container.append(empty);
    }

    let subtotal = 0;

    for (const [id, quantity] of cart) {
      const product = products.get(id);
      subtotal += product.price * quantity;

      const line = document.createElement('article');
      line.className = 'cart-line';
      line.dataset.cartId = id;

      const image = document.createElement('img');
      image.src = product.image;
      image.alt = '';

      const details = document.createElement('div');
      const name = document.createElement('h3');
      name.textContent = product.name;

      const quantityControl = document.createElement('div');
      quantityControl.className = 'quantity-control';

      const minus = cartAction('−', 'decrease', id, `Decrease quantity of ${product.name}`);
      const amount = document.createElement('span');
      amount.textContent = String(quantity);
      amount.setAttribute('aria-label', `Quantity: ${quantity}`);

      const plus = cartAction('+', 'increase', id, `Increase quantity of ${product.name}`);
      plus.disabled = quantity >= 99;
      quantityControl.append(minus, amount, plus);

      const remove = cartAction('Remove', 'remove', id, `Remove ${product.name} from cart`);
      remove.className = 'remove-item';
      details.append(name, quantityControl, remove);

      const price = document.createElement('p');
      price.className = 'cart-line-price';
      price.textContent = formatCurrency(product.price * quantity);

      line.append(image, details, price);
      container.append(line);
    }

    ui.cartSubtotal.textContent = formatCurrency(subtotal);

    if (focusTarget) {
      const next = $(`[data-cart-id="${focusTarget.id}"] [data-cart-action="${focusTarget.action}"]`, container);

      if (next && !next.disabled) {
        next.focus();
      } else {
        ($('[data-cart-action]', container) || $('button', container) || $('[data-close]', ui.cartDialog)).focus();
      }
    }
  }

  function cartAction(text, action, id, label) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = text;
    button.dataset.cartAction = action;
    button.dataset.id = id;
    button.setAttribute('aria-label', label);
    return button;
  }

  ui.cartItems.addEventListener('click', event => {
    const button = event.target.closest('[data-cart-action]');
    if (!button) {
      return;
    }

    const { id, cartAction: action } = button.dataset;
    const oldQuantity = cart.get(id);

    if (!oldQuantity) {
      return;
    }

    if (action === 'remove' || (action === 'decrease' && oldQuantity === 1)) {
      cart.delete(id);
    } else {
      cart.set(id, action === 'increase' ? Math.min(oldQuantity + 1, 99) : oldQuantity - 1);
    }

    saveCart();
    renderCart({ id, action });
  });

  ui.openCart.addEventListener('click', event => {
    renderCart();
    openDialog(ui.cartDialog, event.currentTarget);
  });

  // Replace these demonstration information panels with real destinations when expanding the project.
  const information = {
    account: ['YOUR ACCOUNT', 'Account sign-in is outside this homepage demonstration. No account or password is needed to explore the games or try the cart.', 'Your demo cart is saved in this browser when local storage is available.'],
    shipping: ['SHIPPING & DELIVERY', 'Example policy: standard US delivery takes 3–5 business days after dispatch. A live shop would confirm delivery options, shipping cost, and tracking at checkout.', 'This is a fictional storefront. No orders are placed or shipped.'],
    returns: ['RETURNS & EXCHANGES', 'Example policy: unopened games may be returned within 30 days of delivery. For a damaged item or a missing component, contact customer care with the order number and a description of the issue.', 'This demonstration does not process purchases, returns, or support requests.'],
    orders: ['ORDER SUPPORT', 'In the live shop, this is where you would find tracking, request an address change, or get help with a missing delivery.', 'Order lookup is outside this homepage demonstration. No real order details are needed.'],
    support: ['HERE TO HELP.', 'Need help choosing a game, checking a delivery, or replacing a missing piece? Customer care would be your first stop.', 'This is a demonstration support destination. There is no connected service team or message submission.'],
    community: ['PULL UP A CHAIR.', 'The intended community space would bring together game-night ideas, player conversations, and news from the tabletop.', 'Community destinations are placeholders in this portfolio concept.'],
    instagram: ['ON INSTAGRAM', 'A future Instagram destination would share new releases, game artwork, and moments around the table.', 'No official Gamers Ultra Plus social account is connected to this demo.'],
    discord: ['JOIN THE CONVERSATION', 'A future Discord community would give players a place to find a group, ask questions, and plan their next game night.', 'No Discord server is connected to this demo.'],
    accessibility: ['ACCESSIBILITY', 'The homepage includes keyboard-operable controls, visible focus states, labeled forms, image descriptions, reduced-motion support, and dialogs that can be closed with Escape.', 'This is a design prototype, not a claim of certified compliance. Formal accessibility testing and a support contact should be added before launch.'],
    privacy: ['YOUR PRIVACY', 'This demonstration does not submit your email address, collect account credentials, or process payments. Its cart may be stored locally in your browser.', 'Fonts are requested from Google Fonts when you open the page online. There are no analytics or advertising integrations. A production store would need a policy describing its actual services.'],
    terms: ['TERMS OF USE', 'Gamers Ultra Plus is a portfolio demonstration. Game names, imagery, prices, availability, and shopping policies are fictional and do not represent an offer for sale.', 'The cart is interactive for demonstration purposes. No transaction can be completed.'],
    cookies: ['COOKIES & LOCAL STORAGE', 'This demo does not set tracking cookies. It uses your browser’s local storage to remember the demonstration cart.', 'To remove saved cart data, remove the items from your cart or clear this page’s site data in your browser.']
  };

  $$('[data-info]').forEach(button => button.addEventListener('click', () => {
    const content = information[button.dataset.info];
    if (!content) {
      return;
    }

    ui.infoTitle.textContent = content[0];
    ui.infoContent.replaceChildren(...content.slice(1).map(text => {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      return paragraph;
    }));
    openDialog(ui.infoDialog, button);
  }));

  ui.newsletterForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) {
      return;
    }

    ui.newsletterStatus.textContent = 'Thanks for trying it! This is a demo; your email has not been sent or saved.';
    event.currentTarget.reset();
  });

  ui.year.textContent = String(new Date().getFullYear());
  updateCartCount();
  moveFilterIndicator(false);
  document.fonts?.ready.then(() => moveFilterIndicator(false));
  window.addEventListener('resize', () => {
    cancelAnimationFrame(filterResizeFrame);
    filterResizeFrame = requestAnimationFrame(() => moveFilterIndicator(false));
  });
})();
