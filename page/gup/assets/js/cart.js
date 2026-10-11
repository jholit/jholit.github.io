'use strict';

/* Cart validation, persistence, quantity controls, and drawer rendering. */
GUP.initCart = function ({ products, dialogs, collection }) {
  const { $, element, formatCurrency, replayAnimation, readStorage, writeStorage } = GUP;
  const storageKey = 'gamers-ultra-plus-cart-v1';
  const ui = {
    cartCount: $('#cart-count'), openCart: $('#open-cart'), cartItems: $('#cart-items'),
    cartSummary: $('#cart-summary'), cartDialog: $('#cart-dialog'),
    cartSubtotal: $('#cart-subtotal'), collection: $('#collection')
  };
  const cart = new Map();
  for (const entry of readStorage(storageKey)) {
    if (!Array.isArray(entry)) continue;
    const [id, quantity] = entry;
    if (products.get(id)?.stock === 'in' && Number.isInteger(quantity) && quantity > 0) {
      cart.set(id, Math.min(quantity, 99));
    }
  }
  function saveCart() {
    writeStorage(storageKey, [...cart]);
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

  function renderCart(focusTarget) {
    const container = ui.cartItems;
    container.replaceChildren();
    ui.cartSummary.hidden = cart.size === 0;

    if (!cart.size) {
      const empty = element('div', 'cart-empty');

      const title = element('h3', '', 'Your next game night starts here.');

      const body = element('p', '', 'Add a game to get things going.');

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'button button-primary';
      button.textContent = 'Explore the games';
      button.addEventListener('click', () => {
        dialogs.close(ui.cartDialog).then(() => {
          collection.reset();
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

      const line = element('article', 'cart-line');
      line.dataset.cartId = id;

      const image = document.createElement('img');
      image.src = product.image;
      image.alt = '';

      const details = document.createElement('div');
      const name = element('h3', '', product.name);

      const quantityControl = element('div', 'quantity-control');

      const minus = cartAction('−', 'decrease', id, `Decrease quantity of ${product.name}`);
      const amount = element('span', '', String(quantity));
      amount.setAttribute('aria-label', `Quantity: ${quantity}`);

      const plus = cartAction('+', 'increase', id, `Increase quantity of ${product.name}`);
      plus.disabled = quantity >= 99;
      quantityControl.append(minus, amount, plus);

      const remove = cartAction('Remove', 'remove', id, `Remove ${product.name} from cart`);
      remove.className = 'remove-item';
      details.append(name, quantityControl, remove);

      const price = element('p', 'cart-line-price', formatCurrency(product.price * quantity));

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
    dialogs.open(ui.cartDialog, event.currentTarget);
  });

  updateCartCount();
  return { add: addToCart };
};
