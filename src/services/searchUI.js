/**
 * 全局搜索弹窗交互与键盘控制服务 (searchUI.js)
 * 支持快捷键唤起、即时高亮、上下方向键选择与回车直达
 */

import { searchKnowledgeBase, highlightKeywords } from "./searchService.js";

export function setupSearchUI() {
  const modal = document.getElementById("searchModalOverlay");
  const input = document.getElementById("searchInputField");
  const resultsContainer = document.getElementById("searchResultsList");

  let activeIndex = -1;

  const openSearch = () => {
    modal?.classList.remove("hidden");
    input?.focus();
    activeIndex = -1;
  };

  const closeSearch = () => {
    modal?.classList.add("hidden");
    if (input) input.value = "";
    if (resultsContainer) resultsContainer.innerHTML = "";
    activeIndex = -1;
  };

  const updateActiveItem = (items) => {
    items.forEach((item, idx) => {
      if (idx === activeIndex) {
        item.classList.add("keyboard-active");
        item.scrollIntoView({ block: "nearest" });
      } else {
        item.classList.remove("keyboard-active");
      }
    });
  };

  document.getElementById("headerSearchBtn")?.addEventListener("click", openSearch);
  document.getElementById("searchCloseBtn")?.addEventListener("click", closeSearch);

  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeSearch();
  });

  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openSearch();
    }
  });

  input?.addEventListener("keydown", (e) => {
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
      if (activeIndex >= 0 && activeIndex < items.length) {
        e.preventDefault();
        items[activeIndex].click();
      }
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
        : results.map((r) => `
          <a href="#/${r.doc.slug}" class="search-result-item" onclick="document.getElementById('searchModalOverlay').classList.add('hidden')">
            <div class="search-result-header">
              <span class="search-result-title">${highlightKeywords(r.doc.title, q)}</span>
              <span class="search-result-cat">${r.doc.categoryTitle}</span>
            </div>
            <div class="search-result-snippet">${highlightKeywords(r.snippet, q)}</div>
          </a>
        `).join("");
  });
}
