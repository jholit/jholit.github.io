'use strict';

/* Site information, demonstration newsletter, and page initialization. */
GUP.initSite = function (dialogs) {
  const { $, $$ } = GUP;
  const ui = {
    infoTitle: $('#info-title'), infoContent: $('#info-content'), infoDialog: $('#info-dialog'),
    newsletterForm: $('#newsletter-form'), newsletterStatus: $('#newsletter-status'), year: $('#year')
  };
  // Replace these demonstration information panels with real destinations when expanding the project.
  const information = {
    account: [
      'YOUR ACCOUNT',
      'Account sign-in is outside this storefront demonstration. No account or password is needed to explore the games or try the cart.',
      'Your demo cart and favorites are saved in this browser when local storage is available.'
    ],
    shipping: [
      'SHIPPING & DELIVERY',
      'Example policy: standard US delivery takes 3–5 business days after dispatch. A live shop would confirm delivery options, shipping cost, and tracking at checkout.',
      'This is a fictional storefront. No orders are placed or shipped.'
    ],
    returns: [
      'RETURNS & EXCHANGES',
      'Example policy: unopened games may be returned within 30 days of delivery. For a damaged item or a missing component, contact customer care with the order number and a description of the issue.',
      'This demonstration does not process purchases, returns, or support requests.'
    ],
    orders: [
      'ORDER SUPPORT',
      'In the live shop, this is where you would find tracking, request an address change, or get help with a missing delivery.',
      'Order lookup is outside this storefront demonstration. No real order details are needed.'
    ],
    support: [
      'HERE TO HELP.',
      'Need help choosing a game, checking a delivery, or replacing a missing piece? Customer care would be your first stop.',
      'This is a demonstration support destination. There is no connected service team or message submission.'
    ],
    community: [
      'PULL UP A CHAIR.',
      'The intended community space would bring together game-night ideas, player conversations, and news from the tabletop.',
      'Community destinations are placeholders in this storefront concept.'
    ],
    instagram: [
      'ON INSTAGRAM',
      'A future Instagram destination would share new releases, game artwork, and moments around the table.',
      'No official Gamers Ultra Plus social account is connected to this demo.'
    ],
    discord: [
      'JOIN THE CONVERSATION',
      'A future Discord community would give players a place to find a group, ask questions, and plan their next game night.',
      'No Discord server is connected to this demo.'
    ],
    accessibility: [
      'ACCESSIBILITY',
      'The storefront includes keyboard-operable controls, visible focus states, labeled forms, image descriptions, reduced-motion support, and dialogs that can be closed with Escape.',
      'This is a design prototype, not a claim of certified compliance. Formal accessibility testing and a support contact should be added before launch.'
    ],
    privacy: [
      'YOUR PRIVACY',
      'This demonstration does not submit your email address, collect account credentials, or process payments. Its cart and favorites may be stored locally in your browser.',
      'Fonts are requested from Google Fonts when you open the page online. There are no analytics or advertising integrations. A production store would need a policy describing its actual services.'
    ],
    terms: [
      'TERMS OF USE',
      'Gamers Ultra Plus is a storefront demonstration. Game names, imagery, prices, availability, and shopping policies are fictional and do not represent an offer for sale.',
      'The cart is interactive for demonstration purposes. No transaction can be completed.'
    ],
    cookies: [
      'COOKIES & LOCAL STORAGE',
      'This demo does not set tracking cookies. It uses your browser’s local storage to remember the demonstration cart and saved favorites.',
      'To remove saved cart data, remove the items from your cart and favorites, or clear this page’s site data in your browser.'
    ]
  };

  function openInformation(key, trigger) {
    const content = information[key];
    if (!content) {
      return;
    }

    ui.infoTitle.textContent = content[0];
    ui.infoContent.replaceChildren(...content.slice(1).map(text => {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      return paragraph;
    }));
    dialogs.open(ui.infoDialog, trigger);
  }

  $$('[data-info]').forEach(button => button.addEventListener('click', () => {
    openInformation(button.dataset.info, button);
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
  return { openInformation };
};

/* Small bootstrap: dependencies are loaded by the ordered deferred script tags. */
(() => {
  const isBrowse = document.body.dataset.page === 'browse';
  const products = GUP.createProducts(isBrowse);
  const favorites = GUP.initFavorites(products);
  const collection = GUP.initCollection({ isBrowse, products, favorites });
  const dialogs = GUP.initDialogs();
  const cart = GUP.initCart({ products, dialogs, collection });
  GUP.initProductDetails({ products, dialogs, cart });
  const site = GUP.initSite(dialogs);
  GUP.initMobile({ dialogs, site });
})();
