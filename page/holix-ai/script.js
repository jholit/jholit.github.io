"use strict";

(() => {
  // DOM references
  const hubModal = document.querySelector("#hub-modal");
  const hubModalCloseButtons = [
    ...document.querySelectorAll("[data-hub-modal-close]"),
  ];
  const hubModalDialog = hubModal?.querySelector(".hub-modal__dialog");
  const hubModalTrigger = document.querySelector("#hub-modal-trigger");
  const hubFilter = document.querySelector(".hub-filter");
  const hubFilterTrigger = document.querySelector("#hub-filter-trigger");
  const hubFilterMenu = document.querySelector("#hub-filter-menu");
  const hubFilterItems = [...document.querySelectorAll(".hub-filter__item")];
  const hubSearchInput = document.querySelector("#hub-search-input");
  const hubSelectAll = document.querySelector("#hub-select-all");
  const hubSourceRows = [...document.querySelectorAll("[data-hub-source]")];
  const hubSourceActiveInputs = [
    ...document.querySelectorAll("[data-hub-source-active]"),
  ];
  const hubSourceCount = document.querySelector("#hub-source-count");
  const hubSourceEmpty = document.querySelector("#hub-source-empty");
  const composerArea = document.querySelector(".composer-area");
  const composerDock = document.querySelector(".composer-dock");
  const chatComposer = document.querySelector(".chat-composer");
  const chatThread = document.querySelector(".chat-thread");
  const chatWorkspace = document.querySelector(".chat-workspace");
  const chatInput = document.querySelector("#chatInput");
  const composerSendButton = document.querySelector(".composer-send-btn");
  const composerMicButton = document.querySelector(".composer-mic-btn");
  const modelSettings = document.querySelector(".composer-model-settings");
  const modelModeToggle = document.querySelector(".model-mode-toggle");
  const modelModeSlider = document.querySelector(".model-mode-slider");
  const modelSelect = document.querySelector(".model-select");
  const modelSelectTrigger = document.querySelector(".model-select-trigger");
  const modelMenu = document.querySelector(".model-menu");
  const currentModelName = document.querySelector(".current-model-name");
  const modelMenuItems = [...document.querySelectorAll(".model-menu-item")];
  const prototypeShell = document.querySelector(".prototype-shell");
  const projectNavigation = document.querySelector(".project-navigation");
  const sidebar = document.querySelector("#workspaceSidebar");
  const navigationToggle = document.querySelector("#workspace-navigation-toggle");
  const navigationClose = document.querySelector(".mobile-navigation-close");
  const navigationBackdrop = document.querySelector(".navigation-backdrop");
  const mobileToolbar = document.querySelector(".mobile-toolbar");
  const mobileToolbarActions = document.querySelector(".mobile-toolbar__actions");
  const prototypeStatus = document.querySelector("#prototype-status");
  const searchAnchor = document.querySelector(".search-popout-anchor");
  const searchTrigger = document.querySelector(".collapsed-search-btn");
  const searchPanel = document.querySelector("#workspaceSearchPanel");
  const searchInput = document.querySelector("#workspaceSearchInput");
  const searchFilterButton = document.querySelector(".search-filter-btn");
  const searchResults = document.querySelector("#workspaceSearchResults");
  const searchResultItems = [
    ...document.querySelectorAll(".search-result-item"),
  ];
  const searchStatus = document.querySelector(".search-status");
  const chatPanelAnchor = document.querySelector(".chat-panel-anchor");
  const chatPanelTrigger = document.querySelector(".chat-panel-trigger");
  const chatListPanel = document.querySelector("#chatListPanel");
  const chatList = document.querySelector("#chatList");
  const chatPanelNewChat = document.querySelector("#chatPanelNewChat");
  const chatPanelStatus = document.querySelector(".chat-list-panel__status");
  const newChatButton = document.querySelector(".new-chat-btn");
  const sidebarPopupAnchors = [
    ...document.querySelectorAll(".sidebar-popup-anchor"),
  ];
  const composerControls = [
    ...document.querySelectorAll(
      ".composer-icon-btn, .model-select-trigger, .model-mode-slider",
    ),
  ];
  const hoverMediaQuery = window.matchMedia("(hover: hover)");
  const phoneQuery = window.matchMedia("(max-width: 600px)");
  const compactQuery = window.matchMedia("(max-width: 1079px)");
  const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "textarea:not([disabled])",
    "select:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(", ");
  const maxUserCreatedChats = 1;
  let hubActiveFilter = "all";

  // One state writer keeps visual, accessibility, and keyboard availability in sync.
  const disclosureStates = new WeakMap();
  const setDisclosureState = (anchor, trigger, panel, isOpen) => {
    if (!anchor || !trigger || !panel || disclosureStates.get(panel) === isOpen) {
      return false;
    }

    disclosureStates.set(panel, isOpen);
    anchor.classList.toggle("is-open", isOpen);
    trigger.setAttribute("aria-expanded", String(isOpen));
    panel.setAttribute("aria-hidden", String(!isOpen));
    panel.toggleAttribute("inert", !isOpen);
    return true;
  };

  const trapFocus = (event, container, initialTarget = container) => {
    if (event.key !== "Tab") return;

    const elements = focusableWithin(container);
    const first = elements[0];
    const last = elements[elements.length - 1];
    const active = document.activeElement;

    if (!first) {
      event.preventDefault();
    } else if (active === initialTarget || !container.contains(active)) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    } else if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const announce = (message) => {
    if (prototypeStatus) prototypeStatus.textContent = message;
  };

  const focusableWithin = (container) => [...(container?.querySelectorAll(focusableSelector) ?? [])]
    .filter((element) => !element.closest('[hidden], [inert], [aria-hidden="true"]') && element.getClientRects().length);

  const isNavigationOpen = () => phoneQuery.matches && prototypeShell?.classList.contains("is-navigation-open");

  const setMobileNavigation = (isOpen, restoreFocus = false) => {
    const open = phoneQuery.matches && isOpen;
    if (!open) {
      closeSearch();
      closeChatPanel();
      closeSidebarPopups();
    }
    prototypeShell?.classList.toggle("is-navigation-open", open);
    navigationToggle?.setAttribute("aria-expanded", String(open));
    sidebar?.toggleAttribute("inert", phoneQuery.matches && !open);
    if (open) {
      sidebar?.setAttribute("role", "dialog");
      sidebar?.setAttribute("aria-modal", "true");
    } else {
      sidebar?.removeAttribute("role");
      sidebar?.removeAttribute("aria-modal");
    }
    const backgroundInert = open || isHubModalOpen();
    chatWorkspace?.closest("main")?.toggleAttribute("inert", backgroundInert);
    mobileToolbar?.toggleAttribute("inert", backgroundInert);
    projectNavigation?.toggleAttribute("inert", backgroundInert);
    if (open) window.requestAnimationFrame(() => navigationClose?.focus());
    else if (restoreFocus) navigationToggle?.focus();
  };

  let viewportHeight = null;
  const updateViewportHeight = () => {
    const viewport = window.visualViewport;
    const height = compactQuery.matches
      ? `${viewport?.scale === 1 ? viewport.height : window.innerHeight}px`
      : "";
    if (height === viewportHeight) return;

    viewportHeight = height;
    if (height) document.documentElement.style.setProperty("--viewport-height", height);
    else document.documentElement.style.removeProperty("--viewport-height");
  };

  const oncePerFrame = (callback) => {
    let frame = 0;
    return () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        callback();
      });
    };
  };

  const syncResponsiveWorkspace = () => {
    const active = document.activeElement;
    const shouldMoveFocus = active instanceof Element && Boolean(active.closest("#workspaceSidebar, .model-menu"));
    closeModelMenu();
    setMobileNavigation(false);
    if (newChatButton) {
      if (phoneQuery.matches) mobileToolbarActions?.append(newChatButton);
      else composerDock?.prepend(newChatButton);
    }
    setComposerSelectionState(compactQuery.matches);
    updateViewportHeight();
    if (shouldMoveFocus && !isHubModalOpen()) {
      (phoneQuery.matches ? navigationToggle : chatThread)?.focus();
    }
  };

  // HOLIX Hub modal

  const isHubModalOpen = () =>
    hubModal?.classList.contains("is-open") ?? false;

  const setHubFilterState = (isOpen) =>
    setDisclosureState(hubFilter, hubFilterTrigger, hubFilterMenu, isOpen);

  const closeHubFilter = () => setHubFilterState(false);

  const getVisibleHubSourceRows = () =>
    hubSourceRows.filter((row) => !row.hidden);

  const syncHubSelectAllState = () => {
    if (!hubSelectAll) return;

    const visibleActiveInputs = getVisibleHubSourceRows()
      .map((row) => row.querySelector("[data-hub-source-active]"))
      .filter(Boolean);

    const checkedCount = visibleActiveInputs.filter((input) => input.checked).length;

    hubSelectAll.disabled = visibleActiveInputs.length === 0;
    hubSelectAll.checked =
      visibleActiveInputs.length > 0 && checkedCount === visibleActiveInputs.length;
    hubSelectAll.indeterminate =
      checkedCount > 0 && checkedCount < visibleActiveInputs.length;
  };

  const syncHubSourceActiveState = (input) => {
    const row = input.closest("[data-hub-source]");
    const stateText = row?.querySelector("[data-hub-source-active-text]");

    row?.classList.toggle("is-active", input.checked);

    if (stateText) {
      stateText.textContent = input.checked
        ? "Active for this conversation"
        : "Not active in this conversation";
    }
  };

  const updateHubSourceVisibility = () => {
    const query = hubSearchInput?.value.trim().toLowerCase() ?? "";
    let visibleCount = 0;

    hubSourceRows.forEach((row) => {
      const status = row.dataset.hubStatus ?? "available";
      const searchableText = `${row.dataset.hubSearch ?? ""} ${row.textContent ?? ""}`.toLowerCase();
      const matchesFilter =
        hubActiveFilter === "all" || status === hubActiveFilter;
      const matchesSearch = !query || searchableText.includes(query);
      const isVisible = matchesFilter && matchesSearch;

      row.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    if (hubSourceCount) {
      hubSourceCount.textContent = `${visibleCount} ${
        visibleCount === 1 ? "application" : "applications"
      }`;
    }

    if (hubSourceEmpty) {
      hubSourceEmpty.hidden = visibleCount !== 0;
    }

    syncHubSelectAllState();
  };

  const closeHubModal = () => {
    if (!hubModal) return;

    const wasOpen = isHubModalOpen();
    closeHubFilter();
    hubModal.classList.remove("is-open");
    hubModal.setAttribute("aria-hidden", "true");
    hubModal.toggleAttribute("inert", true);
    hubModalTrigger?.setAttribute("aria-expanded", "false");
    prototypeShell?.toggleAttribute("inert", false);
    setMobileNavigation(false);
    if (wasOpen) {
      window.requestAnimationFrame(() => (phoneQuery.matches ? navigationToggle : hubModalTrigger)?.focus());
    }
  };

  const openHubModal = () => {
    if (!hubModal) return;

    setMobileNavigation(false);
    closeModelMenu();
    hubModal.classList.add("is-open");
    hubModal.setAttribute("aria-hidden", "false");
    hubModal.toggleAttribute("inert", false);
    hubModalTrigger?.setAttribute("aria-expanded", "true");
    prototypeShell?.toggleAttribute("inert", true);
    projectNavigation?.toggleAttribute("inert", true);
    updateHubSourceVisibility();

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

  // Chat, composer, and model controls

  const isChatAtPresent = () => {
    if (!chatThread) return true;

    const remainingScroll =
      chatThread.scrollHeight - chatThread.clientHeight - chatThread.scrollTop;

    return remainingScroll <= 2;
  };

  const updateComposerScrollState = () => {
    if (!chatWorkspace) return;

    const isAtPresent = isChatAtPresent();
    chatWorkspace.classList.toggle("is-composer-hidden", !isAtPresent);

    if (isAtPresent) {
      chatWorkspace.classList.remove("is-composer-revealed");
    }
  };

  const scrollChatToStoryStart = () => {
    if (!chatThread) return;

    chatThread.scrollTop = 0;
    updateComposerScrollState();
  };

  const updateComposerTextState = () => {
    const hasText = Boolean(chatInput?.value);

    composerArea?.classList.toggle("has-text", hasText);
    if (composerSendButton) composerSendButton.disabled = !chatInput?.value.trim();
  };

  const setComposerSelectionState = (isSelected) => {
    isSelected = compactQuery.matches || isSelected;
    composerArea?.classList.toggle("is-selected", isSelected);
    modelSettings?.setAttribute("aria-hidden", String(!isSelected));
    modelSettings?.toggleAttribute("inert", !isSelected);

    if (!isSelected) closeModelMenu();
  };

  const setModelMenuState = (isOpen) => {
    if (setDisclosureState(modelSelect, modelSelectTrigger, modelMenu, isOpen)) {
      composerArea?.classList.toggle("is-model-menu-open", isOpen);
    }
  };

  const closeModelMenu = () => setModelMenuState(false);

  const focusModelMenuItem = (index) => {
    modelMenuItems.forEach((item, itemIndex) => {
      item.tabIndex = itemIndex === index ? 0 : -1;
    });

    modelMenuItems[index]?.focus();
  };

  const setChatPanelState = (isOpen, shouldReturnFocus = false) => {
    if (!setDisclosureState(chatPanelAnchor, chatPanelTrigger, chatListPanel, isOpen)) return;

    if (isOpen) {
      if (phoneQuery.matches && !isNavigationOpen()) setMobileNavigation(true);
      closeSearch();
      closeModelMenu();
      closeSidebarPopups();
      if (chatList) chatList.scrollTop = 0;
      return;
    }

    if (shouldReturnFocus) chatPanelTrigger.focus();
  };

  const closeChatPanel = (shouldReturnFocus = false) =>
    setChatPanelState(false, shouldReturnFocus);

  const setChatPanelStatus = (message) => {
    if (chatPanelStatus) chatPanelStatus.textContent = message;
  };

  const getUserCreatedChatCount = () => {
    if (!chatList) return 0;

    return chatList.querySelectorAll(
      ".chat-list-panel__item:not(.chat-list-panel__item--fixed)",
    ).length;
  };

  const updateNewChatAvailability = () => {
    const isAtLimit = getUserCreatedChatCount() >= maxUserCreatedChats;

    [chatPanelNewChat, newChatButton].forEach((button) => {
      if (!(button instanceof HTMLButtonElement)) return;

      button.disabled = isAtLimit;

      if (isAtLimit) {
        button.title = "This demo supports one user-created chat at a time.";
      } else {
        button.removeAttribute("title");
      }
    });
  };

  const startChatRename = (
    nameButton,
    shouldClear = false,
    removeIfEmpty = false,
  ) => {
    if (!(nameButton instanceof HTMLButtonElement)) return;

    const item = nameButton.closest(".chat-list-panel__item");
    const label = nameButton.querySelector("span");
    if (!item || !label || item.querySelector(".chat-list-panel__rename")) {
      return;
    }

    const originalName = label.textContent.trim() || "New chat";
    const input = document.createElement("input");
    input.className = "chat-list-panel__rename";
    input.type = "text";
    input.value = shouldClear ? "" : originalName;
    input.maxLength = 80;
    input.setAttribute("aria-label", `Rename chat: ${originalName}`);

    nameButton.replaceWith(input);

    let isFinished = false;

    const finishRename = (shouldSave, shouldRestoreFocus = true) => {
      if (isFinished) return;
      isFinished = true;

      const nextName = shouldSave ? input.value.trim() : "";

      if (removeIfEmpty && (!shouldSave || !nextName)) {
        item.remove();
        updateNewChatAvailability();
        setChatPanelStatus("New chat canceled.");
        chatPanelNewChat?.focus();
        return;
      }

      const finalName = nextName || originalName;

      label.textContent = finalName;
      nameButton.setAttribute("aria-label", `Rename chat: ${finalName}`);
      item
        .querySelector(".chat-list-panel__remove")
        ?.setAttribute("aria-label", `Remove chat: ${finalName}`);
      input.replaceWith(nameButton);

      if (shouldSave && finalName !== originalName) {
        setChatPanelStatus(`Chat renamed to ${finalName}.`);
      }

      if (shouldRestoreFocus) nameButton.focus();
    };

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        finishRename(true);
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        finishRename(false);
      }
    });

    input.addEventListener("blur", () => finishRename(true, false), { once: true });

    window.requestAnimationFrame(() => {
      input.focus();
      input.select();
    });
  };

  const removeChat = (removeButton) => {
    if (!(removeButton instanceof HTMLButtonElement)) return;

    const item = removeButton.closest(".chat-list-panel__item");
    if (!item || item.classList.contains("chat-list-panel__item--fixed")) return;

    const chatName =
      item.querySelector(".chat-list-panel__name span")?.textContent.trim() ||
      "Chat";

    item.remove();
    updateNewChatAvailability();
    chatPanelNewChat?.focus();
    setChatPanelStatus(`${chatName} removed.`);
  };

  const createNewChat = () => {
    if (!chatList) return;

    if (getUserCreatedChatCount() >= maxUserCreatedChats) {
      setChatPanelState(true);
      setChatPanelStatus("This demo supports one user-created chat at a time.");
      updateNewChatAvailability();
      return;
    }

    const item = document.createElement("li");
    item.className = "chat-list-panel__item";

    const nameButton = document.createElement("button");
    nameButton.className = "chat-list-panel__name";
    nameButton.type = "button";
    nameButton.setAttribute("aria-label", "Rename chat: New chat");

    const label = document.createElement("span");
    label.textContent = "New chat";
    nameButton.append(label);

    const removeButton = document.createElement("button");
    removeButton.className = "chat-list-panel__remove";
    removeButton.type = "button";
    removeButton.setAttribute("aria-label", "Remove chat: New chat");
    removeButton.textContent = "−";

    item.append(nameButton, removeButton);
    chatList.append(item);
    updateNewChatAvailability();
    setChatPanelState(true);

    if (chatInput) {
      chatInput.value = "";
      updateComposerTextState();
    }

    setChatPanelStatus("New chat created.");

    window.requestAnimationFrame(() => {
      chatList.scrollTop = chatList.scrollHeight;
      startChatRename(nameButton, true, true);
    });
  };

  // Workspace search and sidebar popups

  const setSidebarPopupState = (anchor, isOpen) => {
    if (!anchor) return;

    const trigger = anchor.querySelector(".sidebar-popup-trigger");
    const popup = anchor.querySelector(".sidebar-popup");

    setDisclosureState(anchor, trigger, popup, isOpen);
  };

  const closeSidebarPopups = (exception = null) => {
    sidebarPopupAnchors.forEach((anchor) => {
      if (anchor !== exception) setSidebarPopupState(anchor, false);
    });
  };

  const updateSearchResults = () => {
    if (!searchPanel || !searchInput || !searchResults) return;

    const hasQuery = Boolean(searchInput.value.trim());
    searchPanel.classList.toggle("has-query", hasQuery);
    searchResults.setAttribute("aria-hidden", String(!hasQuery));
    searchResults.toggleAttribute("inert", !hasQuery);

    if (searchStatus) {
      searchStatus.textContent = hasQuery
        ? searchFilterButton?.getAttribute("aria-pressed") === "true"
          ? "Showing one chat result with the chat filter applied."
          : "Showing one related result."
        : "";
    }
  };

  const resetSearch = () => {
    if (searchInput) searchInput.value = "";
    searchFilterButton?.setAttribute("aria-pressed", "false");
    updateSearchResults();
  };

  const setSearchState = (isOpen, shouldReturnFocus = false) => {
    if (!setDisclosureState(searchAnchor, searchTrigger, searchPanel, isOpen)) return;
    prototypeShell?.classList.toggle("is-searching", isOpen);

    if (isOpen) {
      closeChatPanel();
      closeSidebarPopups();
      closeModelMenu();
      window.requestAnimationFrame(() => searchInput?.focus());
      return;
    }

    resetSearch();
    if (shouldReturnFocus) searchTrigger.focus();
  };

  const closeSearch = (shouldReturnFocus = false) =>
    setSearchState(false, shouldReturnFocus);

  const submitComposer = () => {
    if (!chatInput?.value.trim()) return;
    announce("Demo message cleared. This prototype does not send messages to an AI.");

    chatInput.value = "";
    updateComposerTextState();
    chatInput.focus();
  };

  // Event bindings

  chatInput?.addEventListener("input", updateComposerTextState);

  hubModalCloseButtons.forEach((closeButton) => {
    closeButton.addEventListener("click", closeHubModal);
  });

  hubModalTrigger?.addEventListener("click", openHubModal);

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

  hubSelectAll?.addEventListener("change", () => {
    getVisibleHubSourceRows().forEach((row) => {
      const input = row.querySelector("[data-hub-source-active]");
      if (!input) return;

      input.checked = hubSelectAll.checked;
      syncHubSourceActiveState(input);
    });

    syncHubSelectAllState();
  });

  hubSourceActiveInputs.forEach((input) => {
    input.addEventListener("change", () => {
      syncHubSourceActiveState(input);
      syncHubSelectAllState();
    });
  });

  document.addEventListener("keydown", handleHubModalKeydown);

  chatInput?.addEventListener("focus", () => {
    composerArea?.classList.add("is-input-active");
  });

  chatInput?.addEventListener("blur", () => {
    composerArea?.classList.remove("is-input-active");
  });

  composerArea?.addEventListener("focusin", (event) => {
    if (
      event.target instanceof Element &&
      event.target.closest(".composer-mic-btn")
    ) {
      setComposerSelectionState(false);
      return;
    }

    setComposerSelectionState(true);
  });

  composerArea?.addEventListener("pointerdown", (event) => {
    if (
      event.target instanceof Element &&
      event.target.closest(".composer-mic-btn")
    ) {
      setComposerSelectionState(false);
      return;
    }

    setComposerSelectionState(true);
  });

  composerMicButton?.addEventListener("click", () => {
    setComposerSelectionState(false);
    announce("Microphone recording is a preview control. No audio is recorded.");
  });

  chatInput?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || (!event.ctrlKey && !event.metaKey)) return;

    event.preventDefault();
    submitComposer();
  });

  chatComposer?.addEventListener("submit", (event) => {
    event.preventDefault();
    submitComposer();
  });

  chatThread?.addEventListener("scroll", oncePerFrame(updateComposerScrollState), { passive: true });

  composerDock?.addEventListener("focusin", () => {
    if (!isChatAtPresent()) {
      chatWorkspace?.classList.add("is-composer-revealed");
    }
  });

  composerDock?.addEventListener("focusout", () => {
    window.requestAnimationFrame(() => {
      if (
        !isChatAtPresent() &&
        !composerDock.contains(document.activeElement)
      ) {
        chatWorkspace?.classList.remove("is-composer-revealed");
      }
    });
  });

  searchTrigger?.addEventListener("click", (event) => {
    event.stopPropagation();
    setSearchState(!searchAnchor?.classList.contains("is-open"));
  });

  searchInput?.addEventListener("input", updateSearchResults);

  searchInput?.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowDown" || !searchInput.value.trim()) return;

    event.preventDefault();
    searchResultItems[0]?.focus();
  });

  searchFilterButton?.addEventListener("click", () => {
    const isPressed =
      searchFilterButton.getAttribute("aria-pressed") === "true";

    searchFilterButton.setAttribute("aria-pressed", String(!isPressed));
    updateSearchResults();
  });

  searchResultItems.forEach((item) => {
    item.addEventListener("click", () => {
      const targetId = item.dataset.searchTarget;
      const target = targetId ? document.querySelector(`#${targetId}`) : null;

      closeSearch();
      target?.focus();
    });

    item.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowUp") return;

      event.preventDefault();
      searchInput?.focus();
    });
  });

  composerControls.forEach((control) => {
    control.addEventListener("pointerenter", () => {
      composerArea?.classList.add("is-control-hovered");
    });

    control.addEventListener("pointerleave", () => {
      composerArea?.classList.remove("is-control-hovered");
    });

    control.addEventListener("focus", () => {
      composerArea?.classList.add("is-control-focused");
    });

    control.addEventListener("blur", () => {
      window.requestAnimationFrame(() => {
        if (!composerArea?.contains(document.activeElement)) {
          composerArea?.classList.remove("is-control-focused");
        }
      });
    });
  });

  modelSelectTrigger?.addEventListener("click", (event) => {
    event.stopPropagation();
    closeSearch();
    const open = !modelSelect?.classList.contains("is-open");
    setModelMenuState(open);
    if (open) focusModelMenuItem(Math.max(0, modelMenuItems.findIndex((item) => item.getAttribute("aria-checked") === "true")));
  });

  modelSelectTrigger?.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

    event.preventDefault();
    setModelMenuState(true);

    const targetItem =
      event.key === "ArrowDown"
        ? modelMenuItems[0]
        : modelMenuItems[modelMenuItems.length - 1];

    const targetIndex = modelMenuItems.indexOf(targetItem);
    if (targetIndex >= 0) focusModelMenuItem(targetIndex);
  });

  chatPanelTrigger?.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = chatPanelAnchor?.classList.contains("is-open") ?? false;
    setChatPanelState(!isOpen);
  });

  const handleNewChatClick = (event) => {
    event.stopPropagation();
    createNewChat();
  };

  chatPanelNewChat?.addEventListener("click", handleNewChatClick);
  newChatButton?.addEventListener("click", handleNewChatClick);

  chatList?.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;

    const removeButton = event.target.closest(".chat-list-panel__remove");
    if (removeButton) {
      event.stopPropagation();
      removeChat(removeButton);
      return;
    }

    const nameButton = event.target.closest("button.chat-list-panel__name");
    if (nameButton) {
      event.stopPropagation();
      startChatRename(nameButton);
    }
  });

  sidebarPopupAnchors.forEach((anchor) => {
    const trigger = anchor.querySelector(".sidebar-popup-trigger");

    anchor.addEventListener("pointerenter", () => {
      if (!hoverMediaQuery.matches) return;

      closeSearch();
      closeChatPanel();
      closeSidebarPopups(anchor);
      setSidebarPopupState(anchor, true);
    });

    anchor.addEventListener("pointerleave", () => {
      if (!hoverMediaQuery.matches) return;

      setSidebarPopupState(anchor, false);
    });

    trigger?.addEventListener("focus", () => {
      if (!trigger.matches(":focus-visible")) return;

      closeSearch();
      closeChatPanel();
      closeSidebarPopups(anchor);
      setSidebarPopupState(anchor, true);
    });

    trigger?.addEventListener("blur", () => {
      setSidebarPopupState(anchor, false);
    });

    trigger?.addEventListener("click", (event) => {
      event.stopPropagation();
      announce(`${trigger?.getAttribute("aria-label")} is a navigation preview. No files or projects are connected.`);
      if (hoverMediaQuery.matches) return;
      closeSearch();
      const isOpen = anchor.classList.contains("is-open");
      closeSidebarPopups(anchor);
      setSidebarPopupState(anchor, !isOpen);
    });
  });

  modelMenuItems.forEach((item, index) => {
    item.addEventListener("click", (event) => {
      event.stopPropagation();

      const selectedModel = item.dataset.model;
      if (selectedModel && currentModelName) {
        currentModelName.textContent = selectedModel;
      }

      modelMenuItems.forEach((menuItem) => {
        const isSelected = menuItem === item;
        menuItem.classList.toggle("is-selected", isSelected);
        menuItem.setAttribute("aria-checked", String(isSelected));
        menuItem.tabIndex = isSelected ? 0 : -1;
      });

      closeModelMenu();
      modelSelectTrigger?.focus();
    });

    item.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeModelMenu();
        modelSelectTrigger?.focus();
        return;
      }

      if (event.key === "Home") {
        event.preventDefault();
        focusModelMenuItem(0);
        return;
      }

      if (event.key === "End") {
        event.preventDefault();
        focusModelMenuItem(modelMenuItems.length - 1);
        return;
      }

      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const nextIndex =
        (index + direction + modelMenuItems.length) % modelMenuItems.length;

      focusModelMenuItem(nextIndex);
    });
  });

  const modelModes = [
    { value: "talkative", label: "Talkative" },
    { value: "contemplative", label: "Contemplative" },
    { value: "thinking", label: "Thinking" },
  ];

  const updateModelMode = () => {
    if (!modelModeSlider || !modelModeToggle) return;

    const modeIndex = Number.parseInt(modelModeSlider.value, 10);
    const selectedMode = modelModes[modeIndex] ?? modelModes[0];

    modelModeToggle.dataset.active = selectedMode.value;
    modelModeSlider.setAttribute("aria-valuetext", selectedMode.label);
  };

  modelModeSlider?.addEventListener("input", updateModelMode);

  document.addEventListener(
    "click",
    (event) => {
      if (!(event.target instanceof Node)) return;

      if (!composerArea?.contains(event.target)) {
        setComposerSelectionState(false);
      }
    },
    true,
  );

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Node)) return;

    if (!modelSelect?.contains(event.target)) closeModelMenu();
    if (!searchAnchor?.contains(event.target)) closeSearch();
    if (!chatPanelAnchor?.contains(event.target)) closeChatPanel();
    if (!hubFilter?.contains(event.target)) closeHubFilter();
    if (!sidebarPopupAnchors.some((anchor) => anchor.contains(event.target))) {
      closeSidebarPopups();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    sidebar?.classList.add("is-tooltip-dismissed");
    if (modelSelect?.classList.contains("is-open")) {
      closeModelMenu();
      modelSelectTrigger?.focus();
      return;
    }

    if (searchAnchor?.classList.contains("is-open")) {
      closeSearch(true);
      return;
    }

    if (chatPanelAnchor?.classList.contains("is-open")) {
      closeChatPanel(true);
      return;
    }

    const openPopupAnchor = sidebarPopupAnchors.find((anchor) =>
      anchor.classList.contains("is-open"),
    );

    if (openPopupAnchor) {
      setSidebarPopupState(openPopupAnchor, false);
      openPopupAnchor.querySelector(".sidebar-popup-trigger")?.focus();
      return;
    }
    if (isNavigationOpen()) setMobileNavigation(false, true);
  });

  // Responsive navigation shares the original controls instead of duplicating IDs.
  navigationToggle?.addEventListener("click", () => setMobileNavigation(!isNavigationOpen()));
  navigationClose?.addEventListener("click", () => setMobileNavigation(false, true));
  navigationBackdrop?.addEventListener("click", () => setMobileNavigation(false, true));
  document.querySelectorAll("[data-panel-close]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.panelClose === "search") closeSearch(true);
      else closeChatPanel(true);
    });
  });
  sidebar?.addEventListener("keydown", (event) => {
    if (isNavigationOpen()) trapFocus(event, sidebar);
  });
  sidebar?.addEventListener("pointerleave", () => sidebar.classList.remove("is-tooltip-dismissed"));
  sidebar?.addEventListener("focusout", (event) => {
    if (!sidebar.contains(event.relatedTarget)) sidebar.classList.remove("is-tooltip-dismissed");
  });
  document.querySelectorAll(".sidebar-popup-anchor, .sidebar-tools-anchor, .search-popout-anchor, .chat-panel-anchor").forEach((anchor) => {
    anchor.addEventListener("pointerenter", () => sidebar?.classList.remove("is-tooltip-dismissed"));
  });
  const scheduleResponsiveSync = oncePerFrame(syncResponsiveWorkspace);
  const scheduleViewportHeight = oncePerFrame(updateViewportHeight);
  phoneQuery.addEventListener("change", scheduleResponsiveSync);
  compactQuery.addEventListener("change", scheduleResponsiveSync);
  window.visualViewport?.addEventListener("resize", scheduleViewportHeight);
  window.addEventListener("resize", scheduleViewportHeight, { passive: true });
  modelMenu?.addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
      closeModelMenu();
      modelSelectTrigger?.focus();
    }
  });

  // Initial state

  updateNewChatAvailability();
  hubSourceActiveInputs.forEach(syncHubSourceActiveState);
  updateHubSourceVisibility();
  updateComposerTextState();
  updateModelMode();
  setComposerSelectionState(false);
  updateSearchResults();
  syncResponsiveWorkspace();
  window.requestAnimationFrame(scrollChatToStoryStart);
})();
