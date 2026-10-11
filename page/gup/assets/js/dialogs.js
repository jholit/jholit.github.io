'use strict';

/* Native dialog focus, backdrop dismissal, and closing animations. */
GUP.initDialogs = function () {
  const { $$, motionQuery } = GUP;
  const triggers = new WeakMap();
  function openDialog(dialog, trigger) {
    if (dialog.open) return;
    triggers.set(dialog, trigger || document.activeElement);
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
    const closingAnimation = isCart ? 'cart-drawer-out'
      : isProduct ? 'product-dialog-out' : dialog.dataset.closeAnimation;
    if (motionQuery.matches || !closingAnimation) {
      dialog.close();
      return Promise.resolve();
    }

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
      const anotherDialogOpen = $$('dialog').some(item => item.open);
      document.body.classList.toggle('dialog-open', anotherDialogOpen);
      if (!anotherDialogOpen) triggers.get(dialog)?.focus();
    });
  });

  return { open: openDialog, close: closeDialog };
};
