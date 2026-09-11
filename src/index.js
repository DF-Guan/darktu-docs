/**
 * 知识库系统主入口 (index.js)
 * 遵循 Dune 架构第 4 公理（单文件行数 <= 250 行，模块清晰解耦）
 */

import { DOCS_NAVIGATION, ALL_DOCS, getDocBySlugOrId } from "./data/navigation.js";
import { getArticleMarkdown } from "./data/articlesContent.js";
import { renderMarkdown } from "./services/markdownRenderer.js";
import { searchKnowledgeBase } from "./services/searchService.js";
import { getInitialTheme, applyTheme, toggleTheme } from "./services/themeService.js";
import { setupCodeCopy, setupTOCScrollSpy, setupReadingProgressAndBackTop } from "./services/uiHelpers.js";

export class DarktuDocsApp {
  constructor() {
    this.currentDoc = null;
    this.init();
  }

  init() {
    setupCodeCopy();
    setupReadingProgressAndBackTop();

    // 1. 初始化主题
    applyTheme(getInitialTheme());
    document.getElementById("themeToggleBtn")?.addEventListener("click", () => toggleTheme());

    // 2. 移动端侧边栏切换
    const toggleBtn = document.getElementById("mobileMenuToggle");
    const sidebar = document.getElementById("docsSidebar");
    const backdrop = document.getElementById("sidebarBackdrop");
    toggleBtn?.addEventListener("click", () => {
      sidebar?.classList.toggle("mobile-open");
      if (backdrop) backdrop.style.display = sidebar?.classList.contains("mobile-open") ? "block" : "none";
    });
    backdrop?.addEventListener("click", () => {
      sidebar?.classList.remove("mobile-open");
      if (backdrop) backdrop.style.display = "none";
    });

    // 3. 渲染目录树并监听路由
    this.renderSidebar();
    window.addEventListener("hashchange", () => this.handleRoute());
    this.handleRoute();

    // 4. 全局检索
    this.initSearch();
  }

  renderSidebar() {
    const container = document.getElementById("sidebarTree");
    if (!container) return;

    container.innerHTML = DOCS_NAVIGATION.map((cat) => `
      <div class="sidebar-category" id="cat-${cat.id}">
        <div class="sidebar-category-header" onclick="this.parentElement.classList.toggle('collapsed')">
          <div class="category-title-group">
            <svg class="category-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
            <span>${cat.title}</span>
          </div>
          <span class="category-badge">${cat.badge}</span>
        </div>
        <div class="sidebar-items-list">
          ${cat.items
            .map(
              (item) => `
            <a href="#/${item.slug}" class="sidebar-item-link" id="link-${item.id.replace(/\//g, "-")}">
              ${item.title}
            </a>
          `
            )
            .join("")}
        </div>
      </div>
    `).join("");

    const filterInput = document.getElementById("sidebarFilter");
    filterInput?.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      document.querySelectorAll(".sidebar-item-link").forEach((el) => {
        const text = el.innerText.toLowerCase();
        el.style.display = !q || text.includes(q) ? "flex" : "none";
      });
    });
  }

  handleRoute() {
    const hash = window.location.hash;
    const { doc, prev, next } = getDocBySlugOrId(hash);
    this.currentDoc = doc;

    document.querySelectorAll(".sidebar-item-link").forEach((el) => el.classList.remove("active"));
    const activeLink = document.getElementById(`link-${doc.id.replace(/\//g, "-")}`);
    activeLink?.classList.add("active");

    document.getElementById("docsSidebar")?.classList.remove("mobile-open");
    const backdrop = document.getElementById("sidebarBackdrop");
    if (backdrop) backdrop.style.display = "none";

    this.renderContent(doc, prev, next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  renderContent(doc, prev, next) {
    const breadcrumbEl = document.getElementById("docsBreadcrumb");
    const metaHeaderEl = document.getElementById("docsMetaHeader");
    const bodyEl = document.getElementById("docsBody");
    const footerEl = document.getElementById("docsFooter");
    const tocListEl = document.getElementById("tocList");

    if (breadcrumbEl) {
      breadcrumbEl.innerHTML = `
        <a href="#/overview" style="color: var(--text-muted); text-decoration: none;">知识库</a>
        <span class="breadcrumb-sep">/</span>
        <span>${doc.categoryTitle}</span>
        <span class="breadcrumb-sep">/</span>
        <span class="breadcrumb-current">${doc.title}</span>
      `;
    }

    const rawMd = getArticleMarkdown(doc.id);
    const wordCount = rawMd.length;
    const readMinutes = Math.max(1, Math.ceil(wordCount / 450));

    if (metaHeaderEl) {
      metaHeaderEl.innerHTML = `
        <span class="docs-meta-badge">${doc.categoryTitle}</span>
        <span class="docs-meta-divider"></span>
        <span class="docs-meta-item">预计阅读：约 ${readMinutes} 分钟</span>
        <span class="docs-meta-divider"></span>
        <span class="docs-meta-item">字数：约 ${wordCount} 字</span>
        <span class="docs-meta-divider"></span>
        <span class="docs-meta-item">修订：2026-09</span>
      `;
    }

    const { html, toc } = renderMarkdown(rawMd);
    if (bodyEl) bodyEl.innerHTML = html;

    if (tocListEl) {
      tocListEl.innerHTML =
        toc.length === 0
          ? '<li class="toc-item"><span style="color: var(--text-muted);">本条目暂无小节</span></li>'
          : toc
              .map(
                (t) => `
            <li class="toc-item level-${t.level}">
              <a href="#${t.id}" class="toc-link" data-heading="${t.id}">${t.text}</a>
            </li>
          `
              )
              .join("");
      setupTOCScrollSpy();
    }

    if (footerEl) {
      footerEl.innerHTML = `
        <div class="article-wiki-footer">
          <div class="wiki-footer-left">
            <span>本条目内容遵循 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans" target="_blank" rel="noopener noreferrer">CC BY-NC-SA 4.0</a> 许可，欢迎自由阅读学习。</span>
          </div>
          <div class="wiki-footer-right">
            <a href="https://github.com/DF-Guan/we-markdown" target="_blank" rel="noopener noreferrer" class="wiki-edit-btn">在 GitHub 参与编辑</a>
            <a href="https://github.com/DF-Guan/we-markdown/issues/new?title=${encodeURIComponent(`[词条勘误] ${doc.title}`)}" target="_blank" rel="noopener noreferrer" class="wiki-edit-btn">报告勘误</a>
          </div>
        </div>
        <div style="display: flex; gap: 16px; width: 100%; margin-top: 24px;">
          ${prev ? `<a href="#/${prev.slug}" class="nav-card prev"><span class="nav-card-label">← 上一词条</span><span class="nav-card-title">${prev.title}</span></a>` : '<div style="flex:1;"></div>'}
          ${next ? `<a href="#/${next.slug}" class="nav-card next"><span class="nav-card-label">下一词条 →</span><span class="nav-card-title">${next.title}</span></a>` : '<div style="flex:1;"></div>'}
        </div>
      `;
    }

    document.title = `${doc.title} - Darktu 知识库`;
  }

  initSearch() {
    const modal = document.getElementById("searchModalOverlay");
    const input = document.getElementById("searchInputField");
    const resultsContainer = document.getElementById("searchResultsList");

    const openSearch = () => {
      modal?.classList.remove("hidden");
      input?.focus();
    };

    const closeSearch = () => {
      modal?.classList.add("hidden");
      if (input) input.value = "";
      if (resultsContainer) resultsContainer.innerHTML = "";
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
      } else if (e.key === "Escape" || e.keyCode === 27) {
        closeSearch();
      }
    });

    input?.addEventListener("input", (e) => {
      const q = e.target.value;
      const results = searchKnowledgeBase(q);
      if (!resultsContainer) return;

      resultsContainer.innerHTML =
        results.length === 0
          ? '<div class="search-empty">未检索到匹配的知识条目</div>'
          : results
              .map(
                (r) => `
            <a href="#/${r.doc.slug}" class="search-result-item" onclick="document.getElementById('searchModalOverlay').classList.add('hidden')">
              <div class="search-result-header">
                <span class="search-result-title">${r.doc.title}</span>
                <span class="search-result-cat">${r.doc.categoryTitle}</span>
              </div>
              <div class="search-result-snippet">${r.snippet}</div>
            </a>
          `
              )
              .join("");
    });
  }
}

export function main() {
  return new DarktuDocsApp();
}

if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => main());
}
