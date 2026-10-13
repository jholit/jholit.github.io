"use strict";

(() => {
  const { setDisclosureState, trapFocus, oncePerFrame } = HOLIX;

  let hub;
  let mobile;
  const isHubModalOpen = () => hub?.isOpen() ?? false;
  const closeHubModal = (restoreFocus = true) => hub?.close(restoreFocus);
  const setHubMenuExpansion = (menuKey) => hub?.setExpansion(menuKey);
  const syncHubNavigationLayout = () => hub?.syncLayout();

  // DOM references
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
  const mobileToolbar = document.querySelector(".mobile-toolbar");
  const mobileMenuContent = document.querySelector(".mobile-menu-content");
  const mobileMenuFooter = document.querySelector(".mobile-menu-footer");
  const mobileMenuClose = document.querySelector(".mobile-menu-close");
  const mobileChatTitle = document.querySelector("#mobile-chat-title");
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
  const mobileQuery = window.matchMedia("(max-width: 1366px)");
  const maxUserCreatedChats = 1;
  const workspaceTouchActions = new Map();
  const fixedChatItem = chatList?.querySelector(".chat-list-panel__item--fixed");
  let activeChatItem = fixedChatItem;

  const updateMobileChatTitle = () => {
    const title = activeChatItem?.querySelector(".chat-list-panel__name span")?.textContent.trim() || "New chat";
    if (mobileChatTitle) mobileChatTitle.textContent = title;
    if (navigationToggle) {
      navigationToggle.title = title;
      navigationToggle.setAttribute("aria-label", `Open workspace menu: ${title}`);
    }
  };

  const announce = (message) => {
    if (prototypeStatus) prototypeStatus.textContent = message;
  };

  const isNavigationOpen = () => mobileQuery.matches && prototypeShell?.classList.contains("is-navigation-open");

  const bindWorkspaceAction = (button, action) => {
    if (!button) return;
    workspaceTouchActions.set(button, action);
    // Click remains the keyboard/mouse fallback; touch activation calls the
    // same action directly after a completed tap, without simulating a click.
    button.addEventListener("click", action);
  };

  const setMobileNavigation = (isOpen, restoreFocus = false) => {
    mobile?.reset();
    const open = mobileQuery.matches && isOpen;
    if (mobileQuery.matches && document.activeElement instanceof HTMLElement &&
        (sidebar?.contains(document.activeElement) || composerArea?.contains(document.activeElement))) {
      document.activeElement.blur();
    }
    closeSearch();
    closeChatPanel();
    closeSidebarPopups();
    if (mobileMenuContent) mobileMenuContent.scrollTop = 0;
    if (sidebar) sidebar.scrollTop = 0;
    if (chatList) chatList.scrollTop = 0;
    if (mobileQuery.matches) {
      setComposerSelectionState(false);
      setHubMenuExpansion(null);
    }
    prototypeShell?.classList.toggle("is-navigation-open", open);
    navigationToggle?.setAttribute("aria-expanded", String(open));
    sidebar?.toggleAttribute("inert", mobileQuery.matches && !open);
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
    if (open) window.requestAnimationFrame(() => {
      if (isNavigationOpen()) sidebar?.focus();
    });
    else if (restoreFocus) navigationToggle?.focus();
  };

  let viewportHeight = null;
  const updateViewportHeight = () => {
    const viewport = window.visualViewport;
    const height = mobileQuery.matches
      ? `${viewport?.scale === 1 ? viewport.height : window.innerHeight}px`
      : "";
    if (height === viewportHeight) return;

    viewportHeight = height;
    if (height) document.documentElement.style.setProperty("--viewport-height", height);
    else document.documentElement.style.removeProperty("--viewport-height");
  };

  const syncResponsiveWorkspace = () => {
    mobile?.reset();
    const active = document.activeElement;
    const shouldMoveFocus = active instanceof Element && Boolean(active.closest("#workspaceSidebar, .model-menu"));
    closeModelMenu();
    setMobileNavigation(false);
    if (newChatButton) {
      if (mobileQuery.matches) mobileMenuFooter?.append(newChatButton);
      else composerDock?.prepend(newChatButton);
    }
    setComposerSelectionState(composerArea?.contains(document.activeElement) ?? false);
    updateMobileChatTitle();
    updateViewportHeight();
    syncHubNavigationLayout();
    if (shouldMoveFocus && !isHubModalOpen()) {
      (mobileQuery.matches ? navigationToggle : chatThread)?.focus();
    }
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
    composerArea?.classList.toggle("is-selected", isSelected);
    modelSettings?.setAttribute("aria-hidden", String(!isSelected));
    modelSettings?.toggleAttribute("inert", !isSelected);

    if (!isSelected) {
      composerArea?.classList.remove("is-control-focused");
      closeModelMenu();
    }
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
    if (isOpen && mobileQuery.matches && !isNavigationOpen()) setMobileNavigation(true);
    if (!setDisclosureState(chatPanelAnchor, chatPanelTrigger, chatListPanel, isOpen)) return;

    if (isOpen) {
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
        if (activeChatItem === item) activeChatItem = fixedChatItem;
        item.remove();
        updateMobileChatTitle();
        updateNewChatAvailability();
        setChatPanelStatus("New chat canceled.");
        (mobileQuery.matches ? newChatButton : chatPanelNewChat)?.focus();
        return;
      }

      const finalName = nextName || originalName;

      label.textContent = finalName;
      nameButton.setAttribute("aria-label", `Rename chat: ${finalName}`);
      item
        .querySelector(".chat-list-panel__remove")
        ?.setAttribute("aria-label", `Remove chat: ${finalName}`);
      input.replaceWith(nameButton);
      updateMobileChatTitle();

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

    if (activeChatItem === item) activeChatItem = fixedChatItem;
    item.remove();
    updateMobileChatTitle();
    updateNewChatAvailability();
    (mobileQuery.matches ? newChatButton : chatPanelNewChat)?.focus();
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
    if (mobileQuery.matches) activeChatItem = item;
    updateMobileChatTitle();
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
    if (isOpen && mobileQuery.matches) return;
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

  chatInput?.addEventListener("focus", () => {
    composerArea?.classList.add("is-input-active");
  });

  chatInput?.addEventListener("blur", () => {
    composerArea?.classList.remove("is-input-active");
  });

  composerArea?.addEventListener("focusin", (event) => {
    composerArea.classList.toggle("is-control-focused", composerControls.includes(event.target));
    if (
      !mobileQuery.matches &&
      event.target instanceof Element &&
      event.target.closest(".composer-mic-btn")
    ) {
      setComposerSelectionState(false);
      return;
    }

    setComposerSelectionState(true);
  });

  composerArea?.addEventListener("pointerdown", (event) => {
    if (mobileQuery.matches) return;
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
    setComposerSelectionState(mobileQuery.matches && composerArea.contains(document.activeElement));
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
      if (mobileQuery.matches && !composerArea?.contains(document.activeElement)) {
        setComposerSelectionState(false);
      }
      if (
        !isChatAtPresent() &&
        !composerDock.contains(document.activeElement)
      ) {
        chatWorkspace?.classList.remove("is-composer-revealed");
      }
    });
  });

  searchTrigger?.addEventListener("click", (event) => {
    if (mobileQuery.matches) return;
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
      if (mobileQuery.matches) return;
      composerArea?.classList.add("is-control-hovered");
    });

    control.addEventListener("pointerleave", () => {
      if (mobileQuery.matches) return;
      composerArea?.classList.remove("is-control-hovered");
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

  bindWorkspaceAction(chatPanelTrigger, (event) => {
    event.stopPropagation();
    const isOpen = chatPanelAnchor?.classList.contains("is-open") ?? false;
    setChatPanelState(!isOpen);
  });

  const handleNewChatClick = (event) => {
    event.stopPropagation();
    createNewChat();
  };

  bindWorkspaceAction(chatPanelNewChat, handleNewChatClick);
  bindWorkspaceAction(newChatButton, handleNewChatClick);

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
      if (mobileQuery.matches) return;
      if (!hoverMediaQuery.matches) return;

      closeSearch();
      closeChatPanel();
      closeSidebarPopups(anchor);
      setSidebarPopupState(anchor, true);
    });

    anchor.addEventListener("pointerleave", () => {
      if (mobileQuery.matches) return;
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

    bindWorkspaceAction(trigger, (event) => {
      event.stopPropagation();
      announce(`${trigger?.getAttribute("aria-label")} is a navigation preview. No files or projects are connected.`);
      if (mobileQuery.matches) {
        setMobileNavigation(false, true);
        return;
      }
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
        if (mobileQuery.matches && composerArea?.contains(document.activeElement)) {
          document.activeElement.blur();
        }
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
    if (!sidebarPopupAnchors.some((anchor) => anchor.contains(event.target))) {
      closeSidebarPopups();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || isHubModalOpen()) return;

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
  bindWorkspaceAction(navigationToggle, () => {
    setMobileNavigation(!isNavigationOpen());
  });
  bindWorkspaceAction(mobileMenuClose, () => setMobileNavigation(false, true));

  const resetMobileWorkspace = () => {
    if (!mobileQuery.matches) return;
    mobile?.reset();
    prototypeShell?.classList.add("is-navigation-reset");
    closeHubModal(false);
    setMobileNavigation(false);
    closeModelMenu();
    setComposerSelectionState(false);
    window.requestAnimationFrame(() => prototypeShell?.classList.remove("is-navigation-reset"));
  };
  window.addEventListener("pagehide", resetMobileWorkspace);
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) resetMobileWorkspace();
  });
  window.addEventListener("popstate", resetMobileWorkspace);
  document.querySelectorAll("[data-panel-close]").forEach((button) => {
    bindWorkspaceAction(button, () => {
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
  mobileQuery.addEventListener("change", scheduleResponsiveSync);
  window.visualViewport?.addEventListener("resize", scheduleViewportHeight);
  window.addEventListener("resize", scheduleViewportHeight, { passive: true });
  modelMenu?.addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
      closeModelMenu();
      modelSelectTrigger?.focus();
    }
  });

  // Initial state

  mobile = HOLIX.initMobile({
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
  });
  hub = HOLIX.initHub({
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
  });
  hub.selectPage("connected-apps");
  updateNewChatAvailability();
  updateComposerTextState();
  updateModelMode();
  setComposerSelectionState(false);
  updateSearchResults();
  syncResponsiveWorkspace();
  window.requestAnimationFrame(scrollChatToStoryStart);
})();
