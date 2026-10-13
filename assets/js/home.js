"use strict";

(() => {
  const copyButton = document.querySelector("[data-copy-email]");
  const status = document.querySelector("#copy-status");
  if (!copyButton || !status) return;

  const label = copyButton.querySelector("[data-copy-label]");
  let resetTimer;
  let copying = false;

  copyButton.addEventListener("click", async () => {
    if (copying) return;
    copying = true;
    const email = copyButton.dataset.copyEmail;

    try {
      if (!navigator.clipboard) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(email);

      window.clearTimeout(resetTimer);
      copyButton.classList.add("is-copied");
      if (label) label.textContent = "Email copied";
      status.textContent = "Email address copied to clipboard.";

      resetTimer = window.setTimeout(() => {
        copyButton.classList.remove("is-copied");
        if (label) label.textContent = "Copy email";
      }, 2500);
    } catch {
      window.clearTimeout(resetTimer);
      copyButton.classList.remove("is-copied");
      if (label) label.textContent = "Copy email";
      status.textContent = `Copy unavailable. Email: ${email}`;
    } finally {
      copying = false;
    }
  });
})();
