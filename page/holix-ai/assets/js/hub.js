"use strict";

/* AI Tools pages, app search/filter, modal, and responsive category navigation. */
HOLIX.initHub = function ({
  mobileQuery,
  prototypeShell,
  projectNavigation,
  composerArea,
  searchTrigger,
  searchInput,
  mobileMenuClose,
  navigationToggle,
  bindWorkspaceAction,
  setMobileNavigation,
  closeModelMenu,
  isNavigationOpen,
}) {
  const { setDisclosureState, trapFocus } = HOLIX;
  const hubModal = document.querySelector("#hub-modal");
  const hubModalCloseButtons = [
    ...document.querySelectorAll("[data-hub-modal-close]"),
  ];
  const hubModalDialog = hubModal?.querySelector(".hub-modal__dialog");
  const hubModalTrigger = document.querySelector("#hub-modal-trigger");
  const mobileToolsMenu = document.querySelector("#mobile-tools-menu");
  const hubToolsNavigation = document.querySelector(".hub-tools-nav");
  const hubModalLayout = document.querySelector(".hub-modal__layout");
  const projectsTrigger = document.querySelector(".projects-trigger");
  const taskPageTitle = document.querySelector("#hub-title-task-overview");
  const codePageTitle = document.querySelector("#hub-title-code-overview");
  const hubFilter = document.querySelector(".hub-filter");
  const hubFilterTrigger = document.querySelector("#hub-filter-trigger");
  const hubFilterMenu = document.querySelector("#hub-filter-menu");
  const hubFilterItems = [...document.querySelectorAll(".hub-filter__item")];
  const hubSearchInput = document.querySelector("#hub-search-input");
  const hubSourceRows = [...document.querySelectorAll("[data-hub-source]")];
  const hubSourceEmpty = document.querySelector("#hub-source-empty");
  const hubMenuOptions = [...document.querySelectorAll("[data-hub-option]")];
  const mobileHubMenuOptions = [...document.querySelectorAll("[data-mobile-hub-option]")];
  const mobileHubHeadings = [...document.querySelectorAll(".mobile-tool-category-heading")];
  const hubPageButtons = [...document.querySelectorAll("[data-hub-page]")];
  const hubPages = [...document.querySelectorAll("[data-hub-view]")];
  const hubMenus = [...document.querySelectorAll("[data-hub-menu]")];
  let hubActiveFilter = "all";
  let hubActivePage = "connected-apps";
  let hubActiveMenu = "holix-hub";
  // HOLIX Hub modal

  const isHubModalOpen = () =>
    hubModal?.classList.contains("is-open") ?? false;

  const setHubFilterState = (isOpen) =>
    setDisclosureState(hubFilter, hubFilterTrigger, hubFilterMenu, isOpen);

  const closeHubFilter = () => setHubFilterState(false);

  const hubMenuForPage = (page) => hubPageButtons
    .find((button) => button.dataset.hubPage === page)?.closest("[data-hub-menu]");

  const setHubActiveMenu = (menuKey) => {
    hubActiveMenu = menuKey;
    hubMenuOptions.forEach((option) => {
      option.classList.toggle("is-selected", option.dataset.hubOption === menuKey);
    });
  };

  const setHubMenuExpansion = (menuKey) => {
    hubMenus.forEach((menu) => {
      const open = menu.dataset.hubMenu === menuKey;
      menu.querySelector("[data-hub-option]")?.setAttribute("aria-expanded", String(open));
      menu.querySelector("[data-mobile-hub-option]")?.setAttribute("aria-expanded", String(open));
      const submenu = menu.querySelector(".hub-tools-nav__submenu");
      if (submenu) {
        submenu.hidden = !open;
        submenu.toggleAttribute("inert", !open);
      }
    });
  };

  const selectHubPage = (page) => {
    if (!hubPages.some((view) => view.dataset.hubView === page)) return;
    closeHubFilter();
    hubActivePage = page;
    hubPages.forEach((view) => {
      const active = view.dataset.hubView === page;
      view.hidden = !active;
      view.toggleAttribute("inert", !active);
    });
    hubPageButtons.forEach((button) => {
      const active = button.dataset.hubPage === page;
      button.classList.toggle("is-selected", active && !mobileQuery.matches);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
    const activeMenu = hubMenuForPage(page);
    setHubActiveMenu(activeMenu?.dataset.hubMenu);
    hubMenuOptions.forEach((option) => {
      const active = option.dataset.hubOption === activeMenu?.dataset.hubMenu;
      if (active) option.setAttribute("aria-current", "true");
      else option.removeAttribute("aria-current");
    });
    setHubMenuExpansion(mobileQuery.matches ? null : activeMenu?.dataset.hubMenu);
    if (page === "connected-apps") updateHubSourceVisibility();
  };

  const syncHubNavigationLayout = () => {
    const activeMenu = hubMenuForPage(hubActivePage);
    const hadNavigationFocus = hubToolsNavigation?.contains(document.activeElement);
    hubModalTrigger.hidden = mobileQuery.matches;
    hubModalTrigger.closest(".sidebar-section")?.setAttribute("aria-label", mobileQuery.matches ? "AI Control Center" : "AI Tools");
    hubMenuOptions.forEach((option) => { option.hidden = mobileQuery.matches; });
    hubPageButtons.forEach((button) => {
      button.classList.toggle("is-selected", !mobileQuery.matches && button.dataset.hubPage === hubActivePage);
    });
    mobileHubHeadings.forEach((heading) => { heading.hidden = !mobileQuery.matches; });
    searchTrigger.disabled = mobileQuery.matches;
    searchInput.disabled = mobileQuery.matches;
    if (mobileMenuClose) mobileMenuClose.hidden = !mobileQuery.matches;
    if (mobileQuery.matches) composerArea?.classList.remove("is-control-hovered");
    projectsTrigger?.setAttribute("aria-label", mobileQuery.matches ? "Your Projects" : "My Projects");
    if (taskPageTitle) taskPageTitle.textContent = mobileQuery.matches ? "Tasks Assistant" : "Task Assistant";
    if (codePageTitle) codePageTitle.textContent = mobileQuery.matches ? "Coding & Design" : "Code & Design";
    if (mobileQuery.matches) {
      setHubActiveMenu(activeMenu?.dataset.hubMenu);
      if (hubToolsNavigation?.parentElement !== mobileToolsMenu) mobileToolsMenu?.append(hubToolsNavigation);
      mobileToolsMenu.hidden = false;
      mobileToolsMenu.toggleAttribute("inert", false);
      hubModalTrigger?.setAttribute("aria-controls", "hub-modal");
      hubModalTrigger?.removeAttribute("aria-haspopup");
      hubModalTrigger?.removeAttribute("aria-expanded");
    } else {
      if (hubToolsNavigation?.parentElement !== hubModalLayout) hubModalLayout?.prepend(hubToolsNavigation);
      if (mobileToolsMenu) {
        mobileToolsMenu.hidden = true;
        mobileToolsMenu.toggleAttribute("inert", true);
      }
      hubModalTrigger?.setAttribute("aria-controls", "hub-modal");
      hubModalTrigger?.setAttribute("aria-haspopup", "dialog");
      hubModalTrigger?.setAttribute("aria-expanded", String(isHubModalOpen()));
    }
    setHubMenuExpansion(mobileQuery.matches ? null : hubActiveMenu);
    if (hadNavigationFocus && mobileQuery.matches) {
      const currentItem = hubPageButtons.find((button) => button.dataset.hubPage === hubActivePage);
      (isHubModalOpen() ? hubModalDialog : isNavigationOpen()
        ? currentItem?.closest("[data-hub-menu]")?.querySelector("[data-mobile-hub-option]")
        : navigationToggle)?.focus();
    }
  };

  const hubSourceSearch = new Map(hubSourceRows.map(row => [row,
    `${row.dataset.hubSearch ?? ""} ${row.textContent ?? ""}`.toLowerCase()]));

  const updateHubSourceVisibility = () => {
    const query = hubSearchInput?.value.trim().toLowerCase() ?? "";
    let visibleCount = 0;

    hubSourceRows.forEach((row) => {
      const status = row.dataset.hubStatus ?? "not-connected";
      const searchableText = hubSourceSearch.get(row);
      const matchesFilter =
        hubActiveFilter === "all" || status === hubActiveFilter;
      const matchesSearch = !query || searchableText.includes(query);
      const isVisible = matchesFilter && matchesSearch;

      row.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    if (hubSourceEmpty) {
      hubSourceEmpty.hidden = visibleCount !== 0;
    }
  };

  const closeHubModal = (restoreFocus = true) => {
    if (!hubModal) return;

    const wasOpen = isHubModalOpen();
    closeHubFilter();
    hubModal.classList.remove("is-open");
    hubModal.setAttribute("aria-hidden", "true");
    hubModal.toggleAttribute("inert", true);
    hubModalTrigger?.setAttribute("aria-expanded", "false");
    prototypeShell?.toggleAttribute("inert", false);
    setMobileNavigation(false);
    selectHubPage("connected-apps");
    if (wasOpen && restoreFocus) {
      window.requestAnimationFrame(() => (mobileQuery.matches ? navigationToggle : hubModalTrigger)?.focus());
    }
  };

  const openHubModal = (page = "connected-apps") => {
    if (!hubModal) return;

    setMobileNavigation(false);
    closeModelMenu();
    hubModal.classList.add("is-open");
    hubModal.setAttribute("aria-hidden", "false");
    hubModal.toggleAttribute("inert", false);
    hubModalTrigger?.setAttribute("aria-expanded", String(!mobileQuery.matches));
    prototypeShell?.toggleAttribute("inert", true);
    projectNavigation?.toggleAttribute("inert", true);
    selectHubPage(page);
    syncHubNavigationLayout();
    if (!mobileQuery.matches) setHubMenuExpansion(null);

    window.requestAnimationFrame(() => hubModalDialog?.focus());
  };

  const handleHubModalKeydown = (event) => {
    if (!isHubModalOpen()) return;

    if (event.key === "Escape") {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (hubFilter?.classList.contains("is-open")) {
        closeHubFilter();
        hubFilterTrigger?.focus();
        return;
      }

      closeHubModal();
      return;
    }

    trapFocus(event, hubModal, hubModalDialog);
  };

  hubModalCloseButtons.forEach((closeButton) => {
    closeButton.addEventListener("click", () => closeHubModal());
  });

  hubModalTrigger?.addEventListener("click", () => {
    if (!mobileQuery.matches) openHubModal();
  });

  mobileHubMenuOptions.forEach((option) => {
    bindWorkspaceAction(option, () => {
      if (!mobileQuery.matches) return;
      const open = option.getAttribute("aria-expanded") === "true";
      setHubMenuExpansion(open ? null : option.dataset.mobileHubOption);
    });
  });

  hubMenuOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const open = option.getAttribute("aria-expanded") === "true";
      if (!mobileQuery.matches) setHubActiveMenu(option.dataset.hubOption);
      setHubMenuExpansion(open ? null : option.dataset.hubOption);
    });
    option.addEventListener("keydown", (event) => {
      if (!["ArrowDown", "ArrowUp", "Escape", "ArrowLeft"].includes(event.key)) return;
      if (event.key === "Escape" && option.getAttribute("aria-expanded") !== "true") return;
      event.preventDefault();
      event.stopPropagation();
      if (event.key === "Escape" || event.key === "ArrowLeft") {
        setHubMenuExpansion(null);
        return;
      }
      if (!mobileQuery.matches) setHubActiveMenu(option.dataset.hubOption);
      setHubMenuExpansion(option.dataset.hubOption);
      const items = option.closest("[data-hub-menu]")?.querySelectorAll("[data-hub-page]") ?? [];
      (event.key === "ArrowUp" ? items[items.length - 1] : items[0])?.focus();
    });
  });

  hubPageButtons.forEach((button) => {
    bindWorkspaceAction(button, () => {
      if (mobileQuery.matches) openHubModal(button.dataset.hubPage);
      else selectHubPage(button.dataset.hubPage);
    });
    button.addEventListener("keydown", (event) => {
      if (!["ArrowDown", "ArrowUp", "Home", "End", "Escape", "ArrowLeft"].includes(event.key)) return;
      if (mobileQuery.matches && ["Escape", "ArrowLeft"].includes(event.key)) return;
      event.preventDefault();
      event.stopPropagation();
      const menu = button.closest("[data-hub-menu]");
      if (event.key === "Escape" || event.key === "ArrowLeft") {
        setHubMenuExpansion(null);
        menu?.querySelector("[data-hub-option]")?.focus();
        return;
      }
      const items = [...(menu?.querySelectorAll("[data-hub-page]") ?? [])];
      let index = items.indexOf(button);
      if (event.key === "Home") index = 0;
      else if (event.key === "End") index = items.length - 1;
      else index = (index + (event.key === "ArrowUp" ? -1 : 1) + items.length) % items.length;
      items[index]?.focus();
    });
  });

  hubFilterTrigger?.addEventListener("click", (event) => {
    event.stopPropagation();
    setHubFilterState(!hubFilter?.classList.contains("is-open"));
  });

  hubFilterTrigger?.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

    event.preventDefault();
    setHubFilterState(true);

    const targetItem =
      event.key === "ArrowUp"
        ? hubFilterItems[hubFilterItems.length - 1]
        : hubFilterItems[0];
    targetItem?.focus();
  });

  hubFilterMenu?.addEventListener("keydown", (event) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;

    const currentIndex = hubFilterItems.indexOf(document.activeElement);
    let nextIndex = currentIndex;

    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = hubFilterItems.length - 1;
    if (event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1 + hubFilterItems.length) % hubFilterItems.length;
    }
    if (event.key === "ArrowUp") {
      nextIndex =
        (currentIndex - 1 + hubFilterItems.length) % hubFilterItems.length;
    }

    event.preventDefault();
    hubFilterItems[nextIndex]?.focus();
  });

  hubFilterItems.forEach((item) => {
    item.addEventListener("click", () => {
      hubFilterItems.forEach((filterItem) => {
        const isSelected = filterItem === item;
        filterItem.classList.toggle("is-selected", isSelected);
        filterItem.setAttribute("aria-checked", String(isSelected));
      });

      hubActiveFilter = item.dataset.hubFilter ?? "all";
      updateHubSourceVisibility();
      closeHubFilter();
      hubFilterTrigger?.focus();
    });
  });

  hubSearchInput?.addEventListener("input", updateHubSourceVisibility);

  document.addEventListener("keydown", handleHubModalKeydown);
  document.addEventListener("click", event => {
    if (event.target instanceof Node && !hubFilter?.contains(event.target)) closeHubFilter();
  });

  return { isOpen: isHubModalOpen, close: closeHubModal, setExpansion: setHubMenuExpansion, syncLayout: syncHubNavigationLayout,
    selectPage: selectHubPage };
};
