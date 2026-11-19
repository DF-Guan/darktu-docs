/**
 * 全局搜索弹窗交互与键盘控制服务 (searchUI.js)
 * 支持快捷键唤起、即时高亮、上下方向键选择、回车直达与无障碍焦点管理
 */

import { searchKnowledgeBase, highlightKeywords } from "./searchService.js";

let lastFocusedElement = null;

export function setupSearchUI() {
  const modal = document.getElementById("searchModalOverlay");
  const input = document.getElementById("searchInputField");
  const resultsContainer = document.getElementById("searchResultsList");

  let activeIndex = -1;

  const openSearch = () => {
    if (typeof document !== "undefined" && document.activeElement) {
      lastFocusedElement = document.activeElement;
    }
    modal?.classList.remove("hidden");
    input?.focus();
    activeIndex = -1;
  };

  const closeSearch = () => {
    modal?.classList.add("hidden");
    if (input) input.value = "";
    if (resultsContainer) resultsContainer.innerHTML = "";
    activeIndex = -1;

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
      lastFocusedElement = null;
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

  document.getElementById("headerSearchBtn")?.addEventListener("click", openSearch);
  document.getElementById("searchCloseBtn")?.addEventListener("click", closeSearch);

  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeSearch();
  });

  window.addEventListener("keydown", (e) => {
    // 1. Ctrl+K 或 Cmd+K 唤起搜索
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openSearch();
      return;
    }

    // 2. 搜索弹窗处于打开状态时，按下 Escape 关闭并原位恢复焦点
    if ((e.key === "Escape" || e.keyCode === 27) && modal && !modal.classList.contains("hidden")) {
      e.preventDefault();
      closeSearch();
      return;
    }
  });

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

  // 点击检索条目事件委托
  resultsContainer?.addEventListener("click", (e) => {
    const item = e.target.closest(".search-result-item");
    if (item) {
      closeSearch();
    }
  });

  input?.addEventListener("input", (e) => {
    const q = e.target.value;
    const results = searchKnowledgeBase(q);
    activeIndex = -1;
    if (!resultsContainer) return;

    resultsContainer.innerHTML =
      results.length === 0
        ? '<div class="search-empty">未检索到匹配的知识条目</div>'
        : results
            .map(
              (r) => `
          <a href="#/${r.doc.slug}" class="search-result-item" data-slug="${r.doc.slug}">
            <div class="search-result-header">
              <span class="search-result-title">${highlightKeywords(r.doc.title, q)}</span>
              <span class="search-result-cat">${r.doc.categoryTitle}</span>
            </div>
            <div class="search-result-snippet">${highlightKeywords(r.snippet, q)}</div>
          </a>
        `
            )
            .join("");
  });

  return { openSearch, closeSearch };
}
