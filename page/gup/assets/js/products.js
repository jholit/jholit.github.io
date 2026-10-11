'use strict';

/* Catalogue normalization and shared product-card rendering. */
GUP.createProducts = function (isBrowse) {
  const { $, element, formatCurrency, sitePath } = GUP;
  const grid = $('#product-grid');
  const products = new Map(GUP.catalog.map(record => [record.id, {
    ...record,
    price: Number(record.price),
    href: sitePath(record.href || `products/${record.id}/`),
    image: sitePath(record.image),
    collections: new Set((record.collection || '').split(/\s+/).filter(Boolean)),
    searchText: `${record.name} ${record.type} ${record.keywords || ''} ${record.players} players`.toLowerCase()
  }]));

  function productControl(product, className, text) {
    const control = element(isBrowse ? 'a' : 'button', className, text);
    if (isBrowse) control.href = product.href;
    else {
      control.type = 'button';
      control.dataset.product = product.id;
    }
    return control;
  }

  // Build both catalogues from the same records, without fetching files or using a build step.
  for (const product of products.values()) {
    const card = element('article', 'product-card');
    card.dataset.id = product.id;
    const visual = element('div', 'product-visual');
    const imageControl = productControl(product, 'product-image');
    imageControl.setAttribute('aria-label', `View ${product.name}`);
    if (product.badge) imageControl.append(element('span', 'badge', product.badge));
    const image = element('img');
    image.src = product.image;
    image.alt = product.imageAlt;
    image.width = product.width;
    image.height = product.height;
    image.loading = 'lazy';
    imageControl.append(image);
    const favoriteButton = element('button', 'favorite-button');
    favoriteButton.type = 'button';
    favoriteButton.dataset.favorite = product.id;
    const heart = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    heart.setAttribute('class', 'icon');
    heart.setAttribute('aria-hidden', 'true');
    const heartUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    heartUse.setAttribute('href', '#i-heart');
    heart.append(heartUse);
    favoriteButton.append(heart);
    visual.append(imageControl, favoriteButton);
    const titleRow = element('div', 'product-title-row');
    const title = element('h3');
    const titleControl = productControl(product, '', product.name);
    title.append(titleControl);
    const purchaseRow = element('div', 'product-purchase');
    purchaseRow.append(element('span', 'price', formatCurrency(product.price)));
    if (product.stock === 'out') {
      purchaseRow.append(element('span', 'availability unavailable', 'Out of stock'));
    }
    titleRow.append(title, purchaseRow);
    card.append(visual, element('p', 'product-type', product.type), titleRow);
    if (isBrowse) card.append(element('p', 'game-meta', `${product.players} players · ${product.time} min · Ages ${product.age}`));
    product.card = card;
  }

  grid.replaceChildren(...[...products.values()].map(product => product.card));
  return products;
};

/* Homepage product details; Browse deliberately uses page links instead. */
GUP.initProductDetails = function ({ products, dialogs, cart }) {
  const { $, $$, formatCurrency, replayAnimation } = GUP;
  const productDialog = $('#product-dialog');
  if (!productDialog) return;
  const ui = {};
  for (const field of ['image', 'type', 'title', 'price', 'description', 'players', 'time', 'age', 'stock', 'add', 'feedback']) {
    ui[`detail${field.charAt(0).toUpperCase() + field.slice(1)}`] = $(`#detail-${field}`);
  }
  let selectedProduct = null;
  function showProduct(id, trigger) {
    const product = products.get(id);
    if (!product) {
      return;
    }

    selectedProduct = id;
    ui.detailImage.src = product.image;
    ui.detailImage.alt = product.imageAlt;
    ui.detailImage.width = product.width;
    ui.detailImage.height = product.height;
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
    dialogs.open(productDialog, trigger);
  }

  $$('[data-product]').forEach(button => button.addEventListener('click', () => showProduct(button.dataset.product, button)));

  ui.detailAdd.addEventListener('click', () => {
    const feedback = ui.detailFeedback;
    feedback.textContent = cart.add(selectedProduct);
    if (feedback.textContent) {
      replayAnimation(feedback, 'is-confirmed');
    }
  });
};
