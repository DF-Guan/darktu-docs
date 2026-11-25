/**
 * 全局搜索弹窗交互与键盘控制服务 (searchUI.js)
 * 支持快捷键唤起、章节锚点深链直达 (#/slug#anchor)、上下方向键选择、
 * 拼写容错标识、XSS 安全高亮与 Schema.org SearchAction 路由唤起
 */

import { searchKnowledgeBase, highlightKeywords, escapeHtml } from "./searchService.js";

let lastFocusedElement = null;

/**
 * 构建检索结果列表 HTML（纯函数，便于测试与单点安全转义）
 */
export function renderSearchResultsMarkup(query, results) {
  if (!query || !query.trim()) return "";
  if (!Array.isArray(results) || results.length === 0) {
    return '<div class="search-empty">未检索到匹配条目，可尝试切换关键词、英文缩写（如 HVV / GEO / GFM）或简短词组</div>';
  }

  const summaryBar = `<div class="search-results-summary">命中 ${results.length} 条高相关结果 · 支持章节直达与拼写容错</div>`;
  const itemsMarkup = results
    .map((r) => {
      const targetHref = r.anchor ? `#/${escapeHtml(r.doc.slug)}#${escapeHtml(r.anchor)}` : `#/${escapeHtml(r.doc.slug)}`;
      const fuzzyBadge = r.matchType === "fuzzy" ? '<span class="search-result-badge fuzzy">拼写容错</span>' : "";
      const sectionRow = r.sectionTitle
        ? `<div class="search-result-section"><span class="search-section-icon">§</span><span>${highlightKeywords(r.sectionTitle, query)}</span></div>`
        : "";
      return `
        <a href="${targetHref}" class="search-result-item" data-slug="${escapeHtml(r.doc.slug)}" data-anchor="${escapeHtml(r.anchor || "")}">
          <div class="search-result-header">
            <span class="search-result-title">${highlightKeywords(r.doc.title, query)}</span>
            <span class="search-result-meta">${fuzzyBadge}<span class="search-result-cat">${escapeHtml(r.doc.categoryTitle)}</span></span>
          </div>
          ${sectionRow}
          <div class="search-result-snippet">${highlightKeywords(r.snippet, query)}</div>
        </a>
      `;
    })
    .join("");

  return `${summaryBar}${itemsMarkup}`;
}

export function setupSearchUI() {
  const modal = document.getElementById("searchModalOverlay");
  const input = document.getElementById("searchInputField");
  const resultsContainer = document.getElementById("searchResultsList");

  let activeIndex = -1;

  const runSearchAndRender = (q) => {
    const results = searchKnowledgeBase(q);
    activeIndex = -1;
    if (!resultsContainer) return;
    resultsContainer.innerHTML = renderSearchResultsMarkup(q, results);
  };

  const openSearch = (initialQuery = "") => {
    if (typeof document !== "undefined" && document.activeElement) {
      lastFocusedElement = document.activeElement;
    }
    modal?.classList.remove("hidden");
    if (input) {
      if (initialQuery) {
        input.value = initialQuery;
        runSearchAndRender(initialQuery);
      }
      input.focus();
    }
    activeIndex = -1;
  };

  const closeSearch = () => {
    modal?.classList.add("hidden");
    if (input) input.value = "";
    if (resultsContainer) resultsContainer.replaceChildren();
    activeIndex = -1;

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  };

  const handleSearchActionHash = () => {
    if (typeof window === "undefined") return;
    const match = window.location.hash.match(/^#\/?search\?q=([^#]+)/);
    if (match) {
      try {
        const q = decodeURIComponent(match[1].replace(/\+/g, " ")).trim();
        if (q) openSearch(q);
      } catch (err) {
        console.warn("Failed to decode search query hash:", err);
      }
    }
  };

  const updateActiveItem = (items) => {
    items.forEach((item, idx) => {
      if (idx === activeIndex) {
        item.classList.add("keyboard-active");
        item.setAttribute("aria-selected", "true");
        item.scrollIntoView({ block: "nearest" });
      } else {
        item.classList.remove("keyboard-active");
        item.removeAttribute("aria-selected");
      }
    });
  };

  document.getElementById("headerSearchBtn")?.addEventListener("click", () => openSearch());
  document.getElementById("searchCloseBtn")?.addEventListener("click", closeSearch);

  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeSearch();
  });

  if (typeof window !== "undefined") {
    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openSearch();
        return;
      }

      if ((e.key === "Escape" || e.keyCode === 27) && modal && !modal.classList.contains("hidden")) {
        e.preventDefault();
        closeSearch();
        return;
      }
    });

    window.addEventListener("hashchange", handleSearchActionHash);
    handleSearchActionHash();
  }

  input?.addEventListener("keydown", (e) => {
    if (e.key === "Escape" || e.keyCode === 27) {
      e.preventDefault();
      closeSearch();
      return;
    }

    const items = resultsContainer ? Array.from(resultsContainer.querySelectorAll(".search-result-item")) : [];
    if (items.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % items.length;
      updateActiveItem(items);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + items.length) % items.length;
      updateActiveItem(items);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < items.length) {
        items[activeIndex].click();
      } else if (items.length > 0) {
        items[0].click();
      }
    }
  });

  // 点击检索条目事件委托：支持同一锚点二次点击平滑滚动
  resultsContainer?.addEventListener("click", (e) => {
    const item = e.target.closest(".search-result-item");
    if (item) {
      const anchor = item.getAttribute("data-anchor");
      const href = item.getAttribute("href");
      closeSearch();
      if (typeof window !== "undefined" && href && window.location.hash === href && anchor) {
        const targetEl = document.getElementById(anchor);
        targetEl?.scrollIntoView({ behavior: "smooth", block: "start" });
        targetEl?.classList.add("heading-highlight-pulse");
      }
    }
  });

  input?.addEventListener("input", (e) => {
    runSearchAndRender(e.target.value);
  });

  return { openSearch, closeSearch };
}
