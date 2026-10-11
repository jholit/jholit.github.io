'use strict';

/* Mobile navigation, touch dismissal, and responsive hero action placement. */
GUP.initMobile = function ({ dialogs, site }) {
  const { $, $$ } = GUP;
  const mobileQuery = matchMedia('(max-width: 1079px)');
  const menu = $('#mobile-menu');
  const toggle = $('#open-mobile-menu');
  const account = $('[data-menu-account]', menu);
  const links = $$('a.mobile-menu-link', menu);
  const hero = $('.hero');
  const heroCopy = $('.hero-copy');
  const heroActions = $('.hero-actions');
  let gesture;
  let suppressClickUntil = 0;

  function updateLayout() {
    if (heroActions) (mobileQuery.matches ? hero : heroCopy).append(heroActions);
    if (!mobileQuery.matches) void dialogs.close(menu);
  }

  toggle.addEventListener('click', () => {
    if (!mobileQuery.matches) return;
    suppressClickUntil = 0;
    links.forEach(link => link.classList.remove('is-activated'));
    account.classList.remove('is-activated');
    dialogs.open(menu, toggle);
    toggle.setAttribute('aria-expanded', 'true');
  });

  menu.addEventListener('close', () => {
    toggle.setAttribute('aria-expanded', 'false');
    gesture = null;
  });

  links.forEach(link => link.addEventListener('click', event => {
    // Preserve native new-tab, context-menu, and modifier-key link behaviour.
    if (event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    link.classList.add('is-activated');
  }));

  account.addEventListener('click', () => {
    account.classList.add('is-activated');
    dialogs.close(menu).then(() => site.openInformation('account', toggle));
  });

  menu.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch' || !event.isPrimary) return;
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY };
  });

  menu.addEventListener('pointercancel', () => { gesture = null; });
  menu.addEventListener('pointerup', event => {
    if (!gesture || gesture.id !== event.pointerId) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    gesture = null;
    if (dx < -64 && Math.abs(dx) > Math.abs(dy) * 2) {
      suppressClickUntil = Date.now() + 350;
      void dialogs.close(menu);
    }
  });

  // A swipe starting on a link must dismiss the drawer without activating it.
  menu.addEventListener('click', event => {
    if (Date.now() >= suppressClickUntil) return;
    suppressClickUntil = 0;
    event.preventDefault();
    event.stopPropagation();
  }, true);

  mobileQuery.addEventListener('change', updateLayout);
  updateLayout();
};
