"use strict";

/* TouchEvent taps/swipes. Native keyboard and mouse activation stays in workspace.js. */
HOLIX.initMobile = function ({
  mobileQuery,
  sidebar,
  navigationToggle,
  prototypeShell,
  chatList,
  workspaceTouchActions,
  isHubModalOpen,
  isNavigationOpen,
  setMobileNavigation,
  removeChat,
  startChatRename,
}) {
  let navigationGesture = null;
  let menuTouch = null;
  let suppressNavigationClickUntil = 0;
  const clearMenuTouch = () => {
    menuTouch?.button.classList.remove("is-touch-pressed");
    menuTouch = null;
  };

  // Mobile menu taps and swipes share Touch.identifier tracking. Movement
  // cancels a pending tap without preventing native scrolling or pinch zoom.
  document.addEventListener("touchstart", (event) => {
    if (!mobileQuery.matches) return;
    document.documentElement.setAttribute("data-focus-input", "pointer");
    suppressNavigationClickUntil = 0;
    clearMenuTouch();
    navigationGesture = null;
    if (event.touches.length !== 1 || !(event.target instanceof Element) || isHubModalOpen()) return;
    const touch = event.touches[0];
    const button = event.target.closest("button");
    const inMenu = sidebar?.contains(button) || button === navigationToggle;
    if (inMenu && button && !button.disabled && !button.closest("[hidden], [inert]")) {
      let action = workspaceTouchActions.get(button);
      // Active Chats creates its rename/remove buttons dynamically.
      if (!action && chatList?.contains(button)) {
        if (button.matches(".chat-list-panel__remove")) action = () => removeChat(button);
        else if (button.matches(".chat-list-panel__name")) action = () => startChatRename(button);
      }
      if (action) {
        menuTouch = { id: touch.identifier, x: touch.clientX, y: touch.clientY, button, action };
        button.classList.add("is-touch-pressed");
      }
    }
    const open = isNavigationOpen();
    const surface = event.target.closest(open ? "#workspaceSidebar" : ".chat-thread, .mobile-toolbar");
    const control = event.target.closest(open
      ? 'input, textarea, select, [contenteditable="true"]'
      : 'button, a, input, textarea, select, [contenteditable="true"]');
    navigationGesture = surface && (!control || control === navigationToggle)
      ? { id: touch.identifier, x: touch.clientX, y: touch.clientY, open }
      : null;
  }, { passive: true });

  document.addEventListener("touchmove", (event) => {
    if (event.touches.length !== 1) {
      clearMenuTouch();
      navigationGesture = null;
      return;
    }
    if (menuTouch) {
      const touch = [...event.touches].find((item) => item.identifier === menuTouch.id);
      if (!touch || Math.hypot(touch.clientX - menuTouch.x, touch.clientY - menuTouch.y) > 12) clearMenuTouch();
    }
    if (!navigationGesture) return;
    const touch = [...event.touches].find((item) => item.identifier === navigationGesture.id);
    if (!touch) { navigationGesture = null; return; }
    const dx = touch.clientX - navigationGesture.x;
    const dy = touch.clientY - navigationGesture.y;
    if (Math.abs(dy) > 12 && Math.abs(dy) >= Math.abs(dx)) navigationGesture = null;
  }, { passive: true });
  document.addEventListener("touchcancel", () => {
    navigationGesture = null;
    clearMenuTouch();
  }, { passive: true });
  document.addEventListener("touchend", (event) => {
    const tap = menuTouch;
    const gesture = navigationGesture;
    const touch = [...event.changedTouches].find((item) => item.identifier === (tap?.id ?? gesture?.id));
    clearMenuTouch();
    navigationGesture = null;
    if (!touch || !mobileQuery.matches || isHubModalOpen() || event.touches.length) return;
    if (tap && Math.hypot(touch.clientX - tap.x, touch.clientY - tap.y) <= 12 &&
        !tap.button.disabled && !tap.button.closest("[hidden], [inert]")) {
      if (event.cancelable) event.preventDefault();
      tap.action(event);
      suppressNavigationClickUntil = Date.now() + 350;
      return;
    }
    if (!gesture) return;
    if (!mobileQuery.matches || isHubModalOpen() || gesture.open !== isNavigationOpen()) return;
    const dx = touch.clientX - gesture.x;
    const dy = touch.clientY - gesture.y;
    const distance = gesture.open ? -dx : dx;
    if (distance <= 64 || distance <= Math.abs(dy) * 2) return;
    if (event.cancelable) event.preventDefault();
    setMobileNavigation(!gesture.open, gesture.open);
    suppressNavigationClickUntil = Date.now() + 350;
  }, { passive: false });
  prototypeShell?.addEventListener("click", (event) => {
    // Consume only the compatibility click after a handled touch. A fresh
    // touch clears this guard, so the next deliberate tap is never discarded.
    if (event.detail === 0 || Date.now() >= suppressNavigationClickUntil) return;
    suppressNavigationClickUntil = 0;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);

  document.addEventListener("contextmenu", () => {
    navigationGesture = null;
    clearMenuTouch();
  });
  return { reset() {
    navigationGesture = null;
    clearMenuTouch();
    suppressNavigationClickUntil = 0;
  } };
};
