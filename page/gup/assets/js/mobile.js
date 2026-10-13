'use strict';

/* Mobile TouchEvents, gesture navigation, and responsive hero action placement. */
GUP.initMobile = function ({ dialogs, site }) {
  const { $, $$ } = GUP;
  const allDialogs = $$('dialog');
  const mobileQuery = matchMedia('(max-width: 1079px)');
  const menu = $('#mobile-menu');
  const toggle = $('#open-mobile-menu');
  const main = $('#main');
  const account = $('[data-menu-account]', menu);
  const links = $$('a.mobile-menu-link', menu);
  const hero = $('.hero');
  const heroCopy = $('.hero-copy');
  const heroActions = $('.hero-actions');
  let gesture = null;
  let tap = null;
  let suppressClickUntil = 0;
  let menuReturnTarget = main;

  function clearTouch() {
    tap?.control.classList.remove('is-touch-pressed');
    tap = null;
    gesture = null;
  }

  function resetMenu() {
    clearTouch();
    suppressClickUntil = 0;
    dialogs.closeImmediately(menu);
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.toggle('dialog-open', allDialogs.some(dialog => dialog.open));
  }

  function openMenu(trigger = main) {
    if (!mobileQuery.matches || allDialogs.some(dialog => dialog.open)) return;
    clearTouch();
    menuReturnTarget = trigger;
    dialogs.open(menu, trigger);
    toggle.setAttribute('aria-expanded', 'true');
  }

  function updateLayout() {
    clearTouch();
    suppressClickUntil = 0;
    if (heroActions) (mobileQuery.matches ? hero : heroCopy).append(heroActions);
    if (!mobileQuery.matches) {
      const hadMenuFocus = menu.contains(document.activeElement);
      resetMenu();
      if (hadMenuFocus) main.focus();
    }
  }

  // The hamburger is gone. Keep an unobtrusive keyboard/screen-reader opener;
  // ordinary touch users open rightward and dismiss leftward.
  toggle.addEventListener('click', () => openMenu(toggle));
  menu.addEventListener('close', () => {
    toggle.setAttribute('aria-expanded', 'false');
    clearTouch();
  });

  links.forEach(link => link.addEventListener('click', event => {
    // Preserve keyboard navigation, context menus, modifier keys and new tabs.
    if (event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    resetMenu();
  }));

  function openAccount() {
    void dialogs.close(menu).then(() => site.openInformation('account', menuReturnTarget));
  }
  account.addEventListener('click', openAccount);

  document.addEventListener('touchstart', event => {
    if (!mobileQuery.matches) return;
    suppressClickUntil = 0;
    clearTouch();
    if (event.touches.length !== 1 || !(event.target instanceof Element) ||
        allDialogs.some(dialog => dialog !== menu && dialog.open) || menu.classList.contains('is-closing')) return;
    const touch = event.touches[0];
    const open = menu.open;
    const surface = event.target.closest(open ? '#mobile-menu' : 'main, .site-header');
    if (!surface) return;
    const editable = event.target.closest('input, textarea, select, [contenteditable="true"]');
    if (editable) return;
    const control = event.target.closest('button, a');
    if (open && control && !control.disabled && menu.contains(control)) {
      let action;
      if (control.matches('a.mobile-menu-link')) action = () => {
        const destination = control.href;
        resetMenu();
        window.location.assign(destination);
      };
      else if (control === account) action = openAccount;
      else if (control.matches('[data-close]')) action = () => { void dialogs.close(menu); };
      if (action) {
        tap = { id: touch.identifier, x: touch.clientX, y: touch.clientY, control, action };
        control.classList.add('is-touch-pressed');
      }
    }
    gesture = { id: touch.identifier, x: touch.clientX, y: touch.clientY, open };
  }, { passive: true });

  document.addEventListener('touchmove', event => {
    if (event.touches.length !== 1) { clearTouch(); return; }
    const touch = event.touches[0];
    if (tap && (touch.identifier !== tap.id || Math.hypot(touch.clientX - tap.x, touch.clientY - tap.y) > 12)) {
      tap.control.classList.remove('is-touch-pressed');
      tap = null;
    }
    if (!gesture || touch.identifier !== gesture.id) return;
    const dx = touch.clientX - gesture.x;
    const dy = touch.clientY - gesture.y;
    if (Math.abs(dy) > 12 && Math.abs(dy) >= Math.abs(dx)) gesture = null;
  }, { passive: true });

  document.addEventListener('touchcancel', clearTouch, { passive: true });
  document.addEventListener('contextmenu', clearTouch);
  document.addEventListener('touchend', event => {
    const pendingTap = tap;
    const pendingGesture = gesture;
    const touch = [...event.changedTouches].find(item => item.identifier === (pendingTap?.id ?? pendingGesture?.id));
    clearTouch();
    if (!mobileQuery.matches || !touch || event.touches.length || menu.classList.contains('is-closing') ||
        allDialogs.some(dialog => dialog !== menu && dialog.open)) return;
    if (pendingTap && menu.open && !pendingTap.control.disabled &&
        Math.hypot(touch.clientX - pendingTap.x, touch.clientY - pendingTap.y) <= 12) {
      if (event.cancelable) event.preventDefault();
      pendingTap.action();
      suppressClickUntil = Date.now() + 350;
      return;
    }
    if (!pendingGesture || pendingGesture.open !== menu.open) return;
    const dx = touch.clientX - pendingGesture.x;
    const dy = touch.clientY - pendingGesture.y;
    const distance = pendingGesture.open ? -dx : dx;
    if (distance <= 64 || distance <= Math.abs(dy) * 2) return;
    if (event.cancelable) event.preventDefault();
    if (pendingGesture.open) void dialogs.close(menu);
    else openMenu();
    suppressClickUntil = Date.now() + 350;
  }, { passive: false });

  // A handled touch must never also activate the browser's compatibility click.
  document.addEventListener('click', event => {
    if (event.detail === 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey ||
        event.button > 0 || Date.now() >= suppressClickUntil) return;
    suppressClickUntil = 0;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);

  mobileQuery.addEventListener('change', updateLayout);
  window.addEventListener('pagehide', resetMenu);
  window.addEventListener('pageshow', event => {
    if (event.persisted) resetMenu();
  });
  window.addEventListener('popstate', resetMenu);
  updateLayout();
};
