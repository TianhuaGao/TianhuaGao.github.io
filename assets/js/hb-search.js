// In-page Pagefind search dialog.
let searchWrapper = null;
let searchInput = null;
let searchOpener = null;
let closeTimer = null;
let previousBodyOverflow = "";
let previousHtmlOverflow = "";

window.addEventListener("DOMContentLoaded", () => {
  const configScript = document.getElementById("search-config");
  searchWrapper = document.getElementById("search-wrapper");

  if (!configScript || !searchWrapper) return;

  // The theme renders the modal inside the sticky header. Moving it to the body
  // keeps the dialog fixed to the viewport without changing the header effects.
  document.body.appendChild(searchWrapper);

  const searchConfig = JSON.parse(configScript.textContent);
  if (!searchConfig || typeof searchConfig.baseUrl === "undefined") {
    console.error("Pagefind search config is missing or invalid.", searchConfig);
    return;
  }

  try {
    new PagefindUI({
      element: "#search",
      showSubResults: true,
      showImages: false,
      baseUrl: searchConfig.baseUrl,
      bundlePath: searchConfig.baseUrl + "pagefind/",
      translations: {
        placeholder: "Search papers, projects, guides…",
        clear_search: "Clear",
        zero_results: "No results found for [SEARCH_TERM]",
        one_result: "1 result for [SEARCH_TERM]",
        many_results: "[COUNT] results for [SEARCH_TERM]",
        searching: "Searching for [SEARCH_TERM]…",
      },
    });
  } catch (error) {
    console.error("Failed to initialize PagefindUI:", error);
    return;
  }

  searchInput = searchWrapper.querySelector(".pagefind-ui__search-input");
  if (!searchInput) return;

  searchInput.addEventListener("input", updateSearchState);
  searchWrapper.querySelector(".pagefind-ui__search-clear")?.addEventListener("click", () => {
    window.requestAnimationFrame(() => {
      updateSearchState();
      searchInput?.focus();
    });
  });
  searchWrapper.querySelectorAll("[data-search-suggestion]").forEach((button) => {
    button.addEventListener("click", () => {
      searchInput.value = button.dataset.searchSuggestion || "";
      searchInput.dispatchEvent(new Event("input", { bubbles: true }));
      searchInput.focus();
    });
  });

  document.querySelectorAll("[data-search-toggle]").forEach((trigger) => {
    const isDialogControl = searchWrapper.contains(trigger);
    if (!isDialogControl) {
      trigger.setAttribute("aria-controls", "search-wrapper");
      trigger.setAttribute("aria-expanded", "false");
    }

    trigger.addEventListener("click", () => {
      if (isDialogControl || !searchWrapper.classList.contains("hidden")) {
        closeSearch();
      } else {
        openSearch(trigger);
      }
    });
  });

  searchWrapper.querySelector("[data-search-dismiss]")?.addEventListener("click", closeSearch);
  document.addEventListener("keydown", handleSearchKeys);
  updateSearchState();
});

function updateSearchState() {
  if (!searchWrapper || !searchInput) return;
  searchWrapper.classList.toggle("has-query", searchInput.value.trim().length > 0);
}

function clearSearch() {
  if (!searchInput) return;
  searchInput.value = "";
  searchInput.dispatchEvent(new Event("input", { bubbles: true }));
  updateSearchState();
}

function openSearch(opener) {
  if (!searchWrapper || !searchInput) return;

  if (closeTimer) {
    window.clearTimeout(closeTimer);
    closeTimer = null;
  }

  searchOpener = opener instanceof HTMLElement ? opener : document.activeElement;
  previousBodyOverflow = document.body.style.overflow;
  previousHtmlOverflow = document.documentElement.style.overflow;

  clearSearch();
  searchWrapper.classList.remove("hidden", "is-closing");
  searchWrapper.setAttribute("aria-hidden", "false");
  document.documentElement.classList.add("search-open");
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";
  document.querySelectorAll("[data-search-toggle][aria-controls='search-wrapper']").forEach((trigger) => {
    trigger.setAttribute("aria-expanded", "true");
  });

  window.requestAnimationFrame(() => {
    searchWrapper?.classList.add("is-open");
    window.setTimeout(() => searchInput?.focus(), 30);
  });
}

function closeSearch() {
  if (!searchWrapper || searchWrapper.classList.contains("hidden")) return;

  if (searchOpener instanceof HTMLElement) searchOpener.focus();
  searchWrapper.classList.remove("is-open");
  searchWrapper.classList.add("is-closing");
  searchWrapper.setAttribute("aria-hidden", "true");
  document.documentElement.classList.remove("search-open");
  document.body.style.overflow = previousBodyOverflow;
  document.documentElement.style.overflow = previousHtmlOverflow;
  document.querySelectorAll("[data-search-toggle][aria-controls='search-wrapper']").forEach((trigger) => {
    trigger.setAttribute("aria-expanded", "false");
  });

  closeTimer = window.setTimeout(() => {
    searchWrapper?.classList.add("hidden");
    searchWrapper?.classList.remove("is-closing");
    closeTimer = null;
  }, 190);
}

function handleSearchKeys(event) {
  if (!searchWrapper || searchWrapper.classList.contains("hidden")) return;

  if (event.key === "Escape") {
    event.preventDefault();
    closeSearch();
    return;
  }

  if (event.key !== "Tab") return;

  const focusable = Array.from(
    searchWrapper.querySelectorAll(
      "a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex='-1'])",
    ),
  ).filter((element) => element.getClientRects().length > 0);

  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
